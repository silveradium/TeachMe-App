import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { IdentityProvider } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { AuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { ErrorCode } from "~/lib/auth/ErrorCode";
import { verifyPassword } from "~/lib/auth/verifyPassword";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, IS_GOOGLE_LOGIN_ENABLED, WEBAPP_URL } from "~/lib/constants";
import { defaultCookies } from "~/lib/default-cookies";
import { prisma } from "~/server/db";

const adapter = PrismaAdapter(prisma);

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const AUTH_OPTIONS: AuthOptions = {
  adapter,
  session: {
    strategy: "jwt",
  },
  cookies: defaultCookies(WEBAPP_URL?.startsWith("https://")),
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
    verifyRequest: "/verify",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      const autoMergeIdentities = async () => {
        const existingUser = await prisma.user.findFirst({
          where: { email: token.email! },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        if (!existingUser) {
          return token;
        }

        return {
          ...existingUser,
          ...token,
        };
      };
      if (!user) {
        return await autoMergeIdentities();
      }
      if (!account) {
        return token;
      }
      if (account.type === "credentials") {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }

      // The arguments above are from the provider so we need to look up the
      // user based on those values in order to construct a JWT.
      if (account.type === "oauth") {
        if (!account.provider || !account.providerAccountId) {
          return token;
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            AND: [
              {
                identityProvider: IdentityProvider.GOOGLE,
              },
              {
                identityProviderId: account.providerAccountId,
              },
            ],
          },
        });

        if (!existingUser) {
          return await autoMergeIdentities();
        }

        return {
          ...token,
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        };
      }

      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as number,
          name: token.name,
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Teachme.com",
      type: "credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your super secure password",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.error(`For some reason credentials are missing`);
          throw new Error(ErrorCode.InternalServerError);
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            identityProvider: true,
            password: true,
          },
        });

        // Don't leak information about it being email or password that is invalid
        if (!user) {
          throw new Error(ErrorCode.IncorrectEmailPassword);
        }

        if (user.identityProvider !== IdentityProvider.TEACHME) {
          throw new Error(ErrorCode.ThirdPartyIdentityProviderEnabled);
        }

        if (!user.password) {
          throw new Error(ErrorCode.IncorrectEmailPassword);
        }

        if (user.password) {
          const isCorrectPassword = await verifyPassword(credentials.password, user.password);
          if (!isCorrectPassword) {
            throw new Error(ErrorCode.IncorrectEmailPassword);
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    ...(IS_GOOGLE_LOGIN_ENABLED
      ? [
          GoogleProvider({
            clientId: GOOGLE_CLIENT_ID!,
            clientSecret: GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `AUTH_OPTIONS` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
  authOptions?: AuthOptions;
}) => {
  const { req, res, authOptions = AUTH_OPTIONS } = ctx;
  return getServerSession(req, res, authOptions);
};
