import NextAuth from "next-auth";
import { AUTH_OPTIONS } from "~/server/auth";

export default NextAuth(AUTH_OPTIONS);
