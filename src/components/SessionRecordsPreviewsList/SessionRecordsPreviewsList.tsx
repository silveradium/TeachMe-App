import { SessionRecordStatus } from "@prisma/client";
import Link from "next/link";
import { SessionRecordStatusBadge } from "~/components";
import { Button, Loader } from "~/components/ui";
import { roundNumber } from "~/lib/roundNumber";
import { api } from "~/utils/api";

export default function SessionRecordsPreviewsList() {
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

  return status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="relative mt-2 flex h-96 flex-auto flex-col items-center overflow-hidden">
      {sessionRecords?.pages?.[0]?.items.length === 0 && (
        <span className="self-start">No sessions to show</span>
      )}
      {sessionRecords?.pages.map(({ items: sessionRecords }, i) => (
        <ul className="w-full flex-auto space-y-2 overflow-auto" key={i}>
          {sessionRecords.map((sessionRecord) => (
            <li key={sessionRecord.id}>
              <Link
                href={`/dashboard/sessions/${sessionRecord.id}/summary`}
                className="grid grid-cols-2 items-center rounded-lg bg-white py-4 pl-6 pr-8 text-sm shadow hover:bg-gray-50 active:bg-gray-100">
                <div className="space-y-1">
                  <div className="space-x-2">
                    <span>Title:</span>
                    <span className="font-semibold">{sessionRecord.topic}</span>
                  </div>
                  <div className="space-x-2 text-gray-500">
                    <span>Date:</span>
                    <span className="font-semibold">
                      {sessionRecord.createdAt.toLocaleString("en-UK", {
                        dateStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center justify-between">
                  <span className="space-x-2">
                    <SessionRecordStatusBadge status={sessionRecord.status} size="sm" />
                  </span>
                  {sessionRecord.status === SessionRecordStatus.FINISHED && (
                    <span className="h-fit w-24 rounded-2xl bg-rose-50 px-2 py-1 text-center font-semibold text-red-500">
                      <span>{roundNumber(sessionRecord.score)} / 100</span>
                    </span>
                  )}
                </div>
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
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {status === "loading" || (isFetching && !isFetchingNextPage) ? <Loader /> : null}
      </div>
    </div>
  );
}
