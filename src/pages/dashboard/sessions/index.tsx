import { SessionRecordStatus } from "@prisma/client";
import { NextSeo } from "next-seo";
import Link from "next/link";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import { BackButton, DashboardLayout, RetrySessionButton, SessionRecordStatusBadge } from "~/components";
import { Button, Loader, LoaderSize } from "~/components/ui";
import { roundNumber } from "~/lib/roundNumber";
import { api } from "~/utils/api";

export default function SessionsList() {
  const { data: user } = api.me.useQuery();
  const {
    data: sessionRecords,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = api.sessionRecords.list.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <>
      <NextSeo title="Session Records | TeachMe" />
      <DashboardLayout>
        <div
          className="flex h-full flex-col space-y-4 bg-white bg-opacity-25 bg-cover bg-center bg-no-repeat px-4 pt-6 bg-blend-color"
          style={{ backgroundImage: `url(${BackgroundPatternTransparent.src})` }}>
          <BackButton />
          <div className="mx-8 flex flex-auto flex-col items-center overflow-hidden pt-8">
            <div className="mx-8 mb-4 self-start">
              <span className="text-3xl underline decoration-primary-500">Session Records</span>
            </div>
            {status === "error" ? (
              <p>Error: {error.message}</p>
            ) : (
              <div className="relative mb-12 mt-2 flex w-full flex-auto flex-col items-center space-y-4 overflow-hidden">
                {sessionRecords?.pages?.[0]?.items.length === 0 && (
                  <span className="ml-8 self-start">No sessions to show</span>
                )}
                {sessionRecords?.pages.map(({ items: sessionRecords }, i) => (
                  <ul className="h-full w-full space-y-1 overflow-y-auto overflow-x-hidden px-4" key={i}>
                    {sessionRecords.map((sessionRecord) => (
                      <li key={sessionRecord.id}>
                        <Link
                          href={`/dashboard/sessions/${sessionRecord.id}${
                            sessionRecord.status === SessionRecordStatus.FINISHED ? "/summary" : ""
                          }`}
                          className="flex h-28 items-center justify-between rounded bg-white px-6 py-5 shadow hover:bg-gray-50 active:bg-gray-100">
                          <div className="space-y-0.5">
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
                            <SessionRecordStatusBadge status={sessionRecord.status} />
                          </div>
                          {sessionRecord.status === SessionRecordStatus.FINISHED ? (
                            <div className="w-40 space-x-2">
                              <span className="mr-1">Score:</span>
                              <span className="w-fit rounded-2xl bg-rose-50 px-2 py-1 font-semibold text-red-500">
                                <span>{roundNumber(sessionRecord.score)} / 100</span>
                              </span>
                            </div>
                          ) : (
                            <div className="w-28" />
                          )}
                          <RetrySessionButton
                            id={sessionRecord.id}
                            disabled={!!user?.activeSessionRecordId}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
                <div>
                  {hasNextPage && (
                    <Button onClick={() => void fetchNextPage()} loading={isFetchingNextPage} size="sm">
                      Load more sessions
                    </Button>
                  )}
                </div>
                {status === "loading" || (isFetching && !isFetchingNextPage) ? (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Loader size={LoaderSize.Five} />
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
