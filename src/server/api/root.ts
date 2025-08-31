import { z } from "zod";
import { authRouter } from "~/server/api/routers/auth";
import { profileRouter } from "~/server/api/routers/profile";
import { sessionRecordsRouter } from "~/server/api/routers/session-records";
import { createTRPCRouter, mergeRouters, protectedProcedure } from "~/server/api/trpc";
import { getLevel, getPointsOfNextLevel } from "~/server/lib/user-level";

const loggedInViewerRouter = createTRPCRouter({
  me: protectedProcedure
    .input(
      z
        .object({
          select: z
            .object({
              highestEducationalExperience: z.boolean(),
              interestedTopics: z.boolean(),
            })
            .optional(),
        })
        .optional()
    )
    .query(({ input, ctx }) => {
      const { select } = input ?? {};
      const { highestEducationalExperience, interestedTopics, points, ...user } = ctx.user;

      const level = getLevel(points);
      const pointsOfNextLevel = getPointsOfNextLevel(points, level);

      return {
        ...user,
        ...(select?.highestEducationalExperience && {
          highestEducationalExperience,
        }),
        ...(select?.interestedTopics && { interestedTopics }),
        points,
        level,
        pointsOfNextLevel,
      };
    }),
});

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = mergeRouters(
  loggedInViewerRouter,
  createTRPCRouter({
    loggedInViewerRouter,
    auth: authRouter,
    profile: profileRouter,
    sessionRecords: sessionRecordsRouter,
  })
);

// export type definition of API
export type AppRouter = typeof appRouter;
