import { SessionRecordStatus } from "@prisma/client";
import { useMemo } from "react";
import { classNames } from "~/lib/classNames";

export default function SessionRecordStatusBadge({
  status,
  size = "md",
}: {
  status: SessionRecordStatus;
  size?: "sm" | "md";
}) {
  const text = useMemo(() => {
    switch (status) {
      case SessionRecordStatus.PENDING: {
        return "Waiting to Begin";
      }
      case SessionRecordStatus.STARTED: {
        return "Ongoing";
      }
      case SessionRecordStatus.FINISHED: {
        return "Finished";
      }
    }
  }, [status]);

  return (
    <div
      className={classNames("w-fit rounded-2xl font-semibold text-white shadow", {
        "bg-yellow-600": status === SessionRecordStatus.PENDING,
        "bg-green-600": status === SessionRecordStatus.STARTED,
        "bg-slate-600": status === SessionRecordStatus.FINISHED,
        "px-5 py-1.5 text-sm": size === "md",
        "px-3 py-1 text-xs": size === "sm",
      })}>
      {text}
    </div>
  );
}
