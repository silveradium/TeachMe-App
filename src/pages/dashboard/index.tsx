import type { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import { DashboardLayout, SessionRecordsPreviewsList, StartSessionButton, UserProfile } from "~/components";
import { getServerAuthSession } from "~/server/auth";
import { ssrInit } from "~/server/lib/ssr";
import type { inferSSRProps } from "~/types/inferSSRProps";

export default function Dashboard({}: inferSSRProps<typeof getServerSideProps>) {
  return (
    <>
      <NextSeo title="Dashboard | TeachMe" />
      <DashboardLayout>
        <div
          className="flex h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${BackgroundPatternTransparent.src})` }}>
          <div className="flex flex-auto flex-col overflow-auto px-8 py-8 lg:flex-row lg:px-12 lg:pb-0">
            <div className="flex flex-1 flex-col">
              <section>
                <UserProfile />
              </section>
              <section className="my-8 flex flex-auto items-center justify-center">
                <StartSessionButton />
              </section>
              <section className="-ml-12 hidden max-w-3xl rounded-tr-3xl bg-white px-8 py-4 text-xl shadow lg:block">
                “If you can&apos;t explain it <span className="text-red-500">simply</span>, you don&apos;t
                understand it well enough”
              </section>
            </div>
            <div className="mx-auto flex w-full max-w-xl flex-auto items-center justify-center lg:mx-12 lg:py-12">
              <section className="flex h-full w-full flex-col rounded-3xl bg-gray-50 px-4 py-8 shadow">
                <div className="mb-2 px-2 text-2xl">Session Records</div>
                <hr className="mb-2 h-[0.35rem] bg-red-500"></hr>
                <SessionRecordsPreviewsList />
              </section>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssr = await ssrInit(ctx);

  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      trpcState: ssr.dehydrate(),
    },
  };
};
