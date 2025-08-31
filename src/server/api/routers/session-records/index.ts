import {
  SessionRecordAnswerGrade,
  SessionRecordStatus,
  type SessionRecordStatus as SessionRecordStatusType,
  type SessionRecord,
  type SessionRecordAnswer,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { ObjectId } from "bson";
import { z } from "zod";
import logger from "~/lib/logger";
import { ActiveSessionRecordExistsError } from "~/server/api/routers/session-records/errors/active-session-record-exists.error";
import { InvalidTopicInputError } from "~/server/api/routers/session-records/errors/invalid-topic-input.error";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getChatGPTResponse } from "~/server/lib/openai";

function sumAnswersScores(answers: SessionRecordAnswer[]): number {
  return answers.reduce((accumulator, currentValue) => accumulator + (currentValue.score ?? 0), 0);
}

function calculateScoreForSessionRecord(sessionRecord: SessionRecord): SessionRecord & { score: number } {
  const { questions, answers } = sessionRecord;

  return {
    ...sessionRecord,
    score: sumAnswersScores(answers) / questions.length,
  };
}

export const sessionRecordsRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const { prisma } = ctx;
    const sessionRecord = await prisma.sessionRecord.findFirst({ where: { id: input.id } });
    return sessionRecord ? calculateScoreForSessionRecord(sessionRecord) : null;
  }),
  list: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(Object.values(SessionRecordStatus) as [SessionRecordStatusType, ...SessionRecordStatusType[]])
          .nullish(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { status, cursor } = input;
      const { user, prisma } = ctx;

      const items = await prisma.sessionRecord.findMany({
        where: {
          userId: user.id,
          ...(status && { status }),
        },
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        orderBy: {
          id: "asc",
        },
        ...(cursor && { cursor: { id: cursor } }),
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items: items.map(calculateScoreForSessionRecord),
        nextCursor,
      };
    }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { user, prisma } = ctx;

    if (user.activeSessionRecordId) {
      throw new ActiveSessionRecordExistsError();
    }

    const createdSessionRecord = await prisma.sessionRecord.create({ data: { userId: user.id } });
    await prisma.user.update({
      where: { id: user.id },
      data: { activeSessionRecordId: createdSessionRecord.id },
    });

    return createdSessionRecord;
  }),
  start: protectedProcedure
    .input(z.object({ id: z.string().min(1), topicInput: z.string().min(1).max(200) }))
    .mutation(async ({ input, ctx }) => {
      const { id, topicInput } = input;
      const { prisma } = ctx;

      const sessionRecord = await prisma.sessionRecord.findFirst({ where: { id: input.id } });
      if (!sessionRecord || sessionRecord.status !== SessionRecordStatus.PENDING) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      try {
        const topic = (
          JSON.parse(
            (await getChatGPTResponse([
              {
                role: "user",
                content: `extract the topic. keep it short: "${topicInput}". format { "topic": string }`,
              },
            ])) ?? "{}"
          ) as { topic: string }
        ).topic;

        const questions = (
          JSON.parse(
            (await getChatGPTResponse([
              {
                role: "user",
                content: `7 questions about "${topic}", newbie. response must parse as JSON { "questions": string[] }
                `,
              },
            ])) ?? "{}"
          ) as { questions: string[] }
        ).questions;

        await prisma.sessionRecord.update({
          where: { id },
          data: {
            topic,
            status: SessionRecordStatus.STARTED,
            currentQuestionIndex: 0,
            questions: questions.map((question) => ({ id: new ObjectId().toString(), payload: question })),
          },
        });
      } catch (error) {
        logger.error(error, "Start session record: Failed");
        throw new InvalidTopicInputError();
      }
    }),
  answerQuestion: protectedProcedure
    .input(z.object({ id: z.string().min(1), answerInput: z.string().max(2_000) }))
    .mutation(async ({ input, ctx }) => {
      const { id, answerInput } = input;
      const { user, prisma } = ctx;

      const sessionRecord = await prisma.sessionRecord.findFirst({ where: { id: input.id } });
      if (
        !sessionRecord ||
        sessionRecord.status !== SessionRecordStatus.STARTED ||
        sessionRecord.currentQuestionIndex == null
      ) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const { currentQuestionIndex, questions, answers } = sessionRecord;
      const question = questions[currentQuestionIndex];

      if (!question) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      try {
        const { score, review, modelAnswer } = JSON.parse(
          (await getChatGPTResponse([
            {
              role: "user",
              content: `review answer: "${answerInput}" to: "${question.payload}". score out of 100. as strict as possible. format { "score": number, "review": string, modelAnswer: string }.`,
            },
          ])) ?? "{}"
        ) as { score: number; review: string; modelAnswer: string };

        const lastQuestion = currentQuestionIndex === questions.length - 1;

        await prisma.sessionRecord.update({
          where: { id },
          data: {
            answers: {
              push: {
                id: new ObjectId().toString(),
                payload: answerInput,
                questionId: question.id,
                score,
                review,
                modelAnswer,
                grade: (() => {
                  if (score >= 90) {
                    return SessionRecordAnswerGrade.A;
                  }
                  if (score >= 80) {
                    return SessionRecordAnswerGrade.B;
                  }
                  if (score >= 70) {
                    return SessionRecordAnswerGrade.C;
                  }
                  if (score >= 60) {
                    return SessionRecordAnswerGrade.D;
                  }
                  return SessionRecordAnswerGrade.F;
                })(),
              },
            },
            // if this is the last question, end the session
            ...(lastQuestion
              ? { status: SessionRecordStatus.FINISHED }
              : { currentQuestionIndex: { increment: 1 } }),
          },
        });

        if (lastQuestion) {
          await prisma.user.update({
            where: { id: user.id },
            data: { activeSessionRecordId: null, points: { increment: sumAnswersScores(answers) + score } },
          });
        }
      } catch (error) {
        logger.error(error, "Answer session record question: Failed");
        throw new InvalidTopicInputError();
      }
    }),
  retry: protectedProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const { id } = input;
    const { user, prisma } = ctx;

    if (user.activeSessionRecordId) {
      throw new ActiveSessionRecordExistsError();
    }

    const sessionRecordToRetry = await prisma.sessionRecord.findFirst({ where: { id } });
    if (!sessionRecordToRetry || sessionRecordToRetry.status !== SessionRecordStatus.FINISHED) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const { topic, questions } = sessionRecordToRetry;

    const createdSessionRecord = await prisma.sessionRecord.create({
      data: {
        userId: user.id,
        status: SessionRecordStatus.STARTED,
        topic,
        questions,
        currentQuestionIndex: 0,
      },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { activeSessionRecordId: createdSessionRecord.id },
    });

    return createdSessionRecord;
  }),
  end: protectedProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const { id } = input;
    const { user, prisma } = ctx;

    const sessionRecord = await prisma.sessionRecord.findFirst({ where: { id: input.id } });
    if (!sessionRecord || sessionRecord.status === SessionRecordStatus.FINISHED) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    await prisma.sessionRecord.update({
      where: { id },
      data: {
        status: SessionRecordStatus.FINISHED,
      },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { activeSessionRecordId: null, points: { increment: sumAnswersScores(sessionRecord.answers) } },
    });
  }),
});
