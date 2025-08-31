import type { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import Logo from "~/assets/logo.webp";
import { AuthLayout, SignUpForm } from "~/components";
import { Button } from "~/components/ui";
import { IS_GOOGLE_LOGIN_ENABLED } from "~/lib/constants";
import { getServerAuthSession } from "~/server/auth";
import { ssrInit } from "~/server/lib/ssr";
import type { inferSSRProps } from "~/types/inferSSRProps";

export default function SignUp({ isGoogleLoginEnabled }: inferSSRProps<typeof getServerSideProps>) {
  return (
    <>
      <NextSeo title="Sign up | TeachMe" />
      <AuthLayout>
        <div className="relative mx-auto h-screen max-w-2xl py-12">
          <div className="flex flex-col space-y-8 px-8 lg:space-y-48">
            <div className="flex justify-between pl-8 lg:justify-end">
              <Image
                src={Logo}
                alt="TeachMe"
                className="mt-36 block h-32 w-32 lg:hidden"
                aria-hidden="true"
              />
              <Link href="/login" className="h-fit">
                <Button className="px-6 text-sm">Already member?</Button>
              </Link>
            </div>
            <div className="space-y-12 px-8">
              <div className="text-4xl font-semibold">Sign up</div>
              <SignUpForm isGoogleLoginEnabled={isGoogleLoginEnabled} />
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssr = await ssrInit(ctx);

  const session = await getServerAuthSession(ctx);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      isGoogleLoginEnabled: IS_GOOGLE_LOGIN_ENABLED,
      trpcState: ssr.dehydrate(),
    },
  };
};
