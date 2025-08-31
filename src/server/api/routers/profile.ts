import {
  HighestEducationalExperience,
  UserStatus,
  type HighestEducationalExperience as HighestEducationalExperienceType,
} from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import resizeBase64Image from "~/server/lib/resizeBase64Image";

export const profileRouter = createTRPCRouter({
  finishOnboarding: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        highestEducationalExperience: z.enum(
          Object.values(HighestEducationalExperience) as [
            HighestEducationalExperienceType,
            ...HighestEducationalExperienceType[]
          ]
        ),
        interestedTopics: z.string().array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user, prisma } = ctx;
      await prisma.user.update({
        where: { id: user.id },
        data: { ...input, status: UserStatus.ACTIVE },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().nullish(),
        highestEducationalExperience: z
          .enum(
            Object.values(HighestEducationalExperience) as [
              HighestEducationalExperienceType,
              ...HighestEducationalExperienceType[]
            ]
          )
          .nullish(),
        interestedTopics: z.string().array().nullish(),
        avatar: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, highestEducationalExperience, interestedTopics, avatar } = input;
      const { user, prisma } = ctx;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(name && { name }),
          ...(highestEducationalExperience && { highestEducationalExperience }),
          ...(interestedTopics && { interestedTopics }),
          ...(avatar && { avatar: await resizeBase64Image(avatar) }),
        },
      });
    }),
});
