import type { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import { BackButton, DashboardLayout, StartSessionButton } from "~/components";
import { classNames } from "~/lib/classNames";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { ssrInit } from "~/server/lib/ssr";
import type { inferSSRProps } from "~/types/inferSSRProps";

export default function NewSession({}: inferSSRProps<typeof getServerSideProps>) {
  return (
    <>
      <NextSeo title="New Session | TeachMe" />
      <DashboardLayout>
        <div
          className={classNames(
            "flex h-full flex-col space-y-4 bg-white bg-opacity-25 bg-cover bg-center bg-no-repeat px-4 pt-6 bg-blend-color"
          )}
          style={{ backgroundImage: `url(${BackgroundPatternTransparent.src})` }}>
          <BackButton />
          <StartSessionButton />
        </div>
      </DashboardLayout>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const ssr = await ssrInit(ctx);

  const session = await getServerAuthSession(ctx);
  const user = await prisma.user.findFirst({ where: { id: session?.user.id } });
  if (user?.activeSessionRecordId) {
    return {
      redirect: { destination: `/dashboard/sessions/${user.activeSessionRecordId}`, permanent: false },
    };
  }

  return {
    props: {
      trpcState: ssr.dehydrate(),
    },
  };
}
