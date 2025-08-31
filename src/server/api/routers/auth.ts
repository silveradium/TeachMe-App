import { IdentityProvider } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hashPassword } from "~/lib/auth/hashPassword";
import { EMAIL_REGEX, PASSWORD_REGEX } from "~/lib/auth/validations";
import { verifyPassword } from "~/lib/auth/verifyPassword";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  changePassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { oldPassword, newPassword } = input;

      const { prisma, user } = ctx;

      if (user.identityProvider !== IdentityProvider.TEACHME) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "THIRD_PARTY_IDENTITY_PROVIDER_ENABLED",
        });
      }

      const currentPasswordQuery = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
        select: {
          password: true,
        },
      });

      const currentPassword = currentPasswordQuery?.password;

      if (!currentPassword) {
        throw new TRPCError({ code: "NOT_FOUND", message: "MISSING_PASSWORD" });
      }

      const passwordsMatch = await verifyPassword(oldPassword, currentPassword);
      if (!passwordsMatch) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "incorrect_password",
        });
      }

      if (oldPassword === newPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "new_password_matches_old_password",
        });
      }

      if (!PASSWORD_REGEX.test(newPassword)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "password_hint_min",
        });
      }

      const hashedPassword = await hashPassword(newPassword);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });
    }),
  verifyPassword: protectedProcedure
    .input(
      z.object({
        passwordInput: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const user = await prisma.user.findUnique({
        where: {
          id: ctx.user.id,
        },
      });

      if (!user?.password) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const passwordsMatch = await verifyPassword(input.passwordInput, user.password);

      if (!passwordsMatch) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return;
    }),
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const lowercaseEmail = email.toLowerCase();

      const { prisma } = ctx;

      // check for email validity
      if (!EMAIL_REGEX.test(lowercaseEmail)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid email" });
      }

      // check for password strength
      if (!PASSWORD_REGEX.test(password)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password is too weak",
        });
      }

      // check for existing users with the same email
      const existingUser = await prisma.user.findFirst({
        where: {
          email: lowercaseEmail,
        },
      });
      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "An account with the email already exists",
        });
      }

      // hash password
      const hashedPassword = await hashPassword(password);

      // save user in the database
      await prisma.user.upsert({
        where: { email: lowercaseEmail },
        update: {
          password: hashedPassword,
          emailVerified: new Date(Date.now()),
          identityProvider: IdentityProvider.TEACHME,
        },
        create: {
          email: lowercaseEmail,
          password: hashedPassword,
          identityProvider: IdentityProvider.TEACHME,
        },
      });
    }),
});
