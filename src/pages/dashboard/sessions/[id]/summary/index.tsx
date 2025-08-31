import { Disclosure } from "@headlessui/react";
import { SessionRecordStatus } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { HiChevronDown } from "react-icons/hi2";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import QuestionBubbleIcon from "~/assets/question-bubble-icon";
import { BackButton, DashboardLayout, RetrySessionButton, SessionRecordAnswerGradeBadge } from "~/components";
import { Loader, LoaderSize } from "~/components/ui";
import { classNames } from "~/lib/classNames";
import { roundNumber } from "~/lib/roundNumber";
import { prisma } from "~/server/db";
import { ssrInit } from "~/server/lib/ssr";
import type { inferSSRProps } from "~/types/inferSSRProps";
import { api } from "~/utils/api";

export default function SessionSummary({}: inferSSRProps<typeof getServerSideProps>) {
  const router = useRouter();
  const { id } = router.query;
  const { data: user } = api.me.useQuery();
  const { data: sessionRecord, isLoading: sessionRecordLoading } = api.sessionRecords.get.useQuery({
    id: id as string,
  });
  const questionsAndAnswers = useMemo(() => {
    if (!sessionRecord || sessionRecord.currentQuestionIndex == null) {
      return [];
    }

    const questions = sessionRecord.questions.slice(0, sessionRecord.currentQuestionIndex + 1);
    return questions.map((question, index) => ({ question, answer: sessionRecord.answers[index] }));
  }, [sessionRecord]);

  return (
    <>
      <NextSeo title={`${sessionRecord?.topic || "Untitled"} - Summary | TeachMe`} />
      <DashboardLayout>
        <div
          className={classNames(
            "relative flex h-full flex-col space-y-4 bg-white bg-opacity-25 bg-cover bg-center bg-no-repeat px-4 pt-6 bg-blend-color"
          )}
          style={{ backgroundImage: `url(${BackgroundPatternTransparent.src})` }}>
          <BackButton href={`/dashboard/sessions/${id as string}`} />
          <div className="mx-8 flex flex-auto flex-col items-center space-y-4 overflow-hidden pt-8">
            <div className="mb-4 flex w-full justify-between self-start px-8">
              <span className="text-3xl underline decoration-primary-500">Session Summary</span>
              <RetrySessionButton id={id as string} size="sm" disabled={!!user?.activeSessionRecordId} />
            </div>
            {!sessionRecord || sessionRecordLoading ? (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Loader size={LoaderSize.Five} />
              </div>
            ) : (
              <div className="relative flex w-full flex-auto flex-col overflow-hidden rounded-b-sm rounded-t-3xl bg-gray-50 bg-opacity-80 shadow">
                <div className="border-b-2 border-b-primary-500 bg-white px-4 py-2.5 shadow">
                  <div className="flex w-2/3 items-center justify-between">
                    <div className="space-y-2 py-2.5 pl-6 pr-8 text-sm">
                      <div className="space-x-2.5">
                        <span>Title:</span>
                        <span className="font-semibold">{sessionRecord.topic}</span>
                      </div>
                      <div className="space-x-2.5 text-gray-500">
                        <span>Date:</span>
                        <span className="font-semibold">
                          {sessionRecord.createdAt.toLocaleString("en-UK", {
                            dateStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <span>Score:</span>
                      <span className="w-fit rounded-2xl bg-rose-50 px-2 py-1 font-semibold text-red-500">
                        <span>{roundNumber(sessionRecord.score)} / 100</span>
                      </span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-4 overflow-y-auto px-10 py-6">
                  {questionsAndAnswers.map(({ question, answer }, index) => {
                    if (!answer) {
                      return null;
                    }
                    return (
                      <li key={question.id}>
                        <Disclosure>
                          <>
                            <Disclosure.Button
                              className="flex w-full items-center space-x-6 border-b border-b-gray-300 py-4"
                              disabled={!answer}>
                              <div className="relative">
                                <QuestionBubbleIcon className="relative z-0 h-8 w-8" aria-hidden="true" />
                                <span className="absolute left-1/2 top-3.5 z-10 -translate-x-1/2 -translate-y-1/2 text-sm text-white">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2.5 text-left">
                                <span className="flex flex-1 items-center space-x-2.5">
                                  {question.payload}
                                </span>
                                <HiChevronDown
                                  className="h-4 w-4 transition-transform ui-open:rotate-180"
                                  aria-hidden="true"
                                />
                              </div>
                            </Disclosure.Button>

                            <Disclosure.Panel className="mt-2 space-y-6">
                              <div className="space-y-2.5">
                                <div>Your response:</div>
                                <div className="ml-4 space-y-2">
                                  <div className="inline-flex items-center space-x-2">
                                    <span>Grade:</span>
                                    <SessionRecordAnswerGradeBadge grade={answer.grade} />
                                  </div>
                                  <p className="text-sm">{answer.payload}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <span className="flex items-center space-x-2.5">Review:</span>
                                <p className="ml-4 text-sm">{answer.review}</p>
                              </div>
                              {answer.modelAnswer && (
                                <div className="space-y-2">
                                  <span className="flex items-center space-x-2.5">Model Answer:</span>
                                  <p className="ml-4 text-sm">{answer.modelAnswer}</p>
                                </div>
                              )}
                            </Disclosure.Panel>
                          </>
                        </Disclosure>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const ssr = await ssrInit(ctx);

  const { id } = ctx.query;
  if (!id || Array.isArray(id)) {
    return {
      redirect: { destination: `/dashboard/sessions`, permanent: false },
    };
  }

  const sessionRecord = await prisma.sessionRecord.findFirst({ where: { id } });
  if (sessionRecord?.status !== SessionRecordStatus.FINISHED) {
    return {
      redirect: { destination: `/dashboard/sessions/${id}`, permanent: false },
    };
  }

  return {
    props: {
      trpcState: ssr.dehydrate(),
    },
  };
}
