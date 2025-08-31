import { SessionRecordStatus } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";
import { DashboardLayout, SessionConversation, SessionStart } from "~/components";
import { Loader, LoaderSize } from "~/components/ui";
import { ssrInit } from "~/server/lib/ssr";
import { api } from "~/utils/api";

export default function Session() {
  const router = useRouter();
  const { id } = router.query;
  const [sessionRecordStatus, setSessionRecordStatus] = useState<SessionRecordStatus | null>(null);
  const { data: sessionRecord } = api.sessionRecords.get.useQuery(
    { id: id as string },
    {
      enabled: !!id,
      onSuccess(data) {
        if (!data) {
          return;
        }

        setSessionRecordStatus(data.status);
      },
    }
  );

  return (
    <>
      <NextSeo title={`${sessionRecord?.topic || "New"} - Sessions | TeachMe`} />
      <DashboardLayout>
        {(() => {
          if (!id || Array.isArray(id)) {
            return null;
          }

          if (!sessionRecordStatus) {
            return (
              <div className="relative h-full w-full">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Loader size={LoaderSize.Five} />
                </div>
              </div>
            );
          }

          if (sessionRecordStatus === SessionRecordStatus.PENDING) {
            return <SessionStart id={id} setSessionRecordStatus={setSessionRecordStatus} />;
          }

          return <SessionConversation id={id} status={sessionRecordStatus} />;
        })()}
      </DashboardLayout>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const ssr = await ssrInit(ctx);
  return { props: { trpcState: ssr.dehydrate() } };
}
