import { SessionRecordAnswerGrade } from "@prisma/client";
import Image from "next/image";
import GradeA from "~/assets/session-record-answer-grade-a.webp";
import GradeB from "~/assets/session-record-answer-grade-b.webp";
import GradeC from "~/assets/session-record-answer-grade-c.webp";
import GradeD from "~/assets/session-record-answer-grade-d.webp";
import GradeF from "~/assets/session-record-answer-grade-f.webp";
import { classNames } from "~/lib/classNames";

export default function SessionRecordAnswerGradeBadge({
  grade,
  className,
}: {
  grade: SessionRecordAnswerGrade;
  className?: string;
}) {
  return (
    <Image
      className={classNames("h-7 w-7", className)}
      src={(() => {
        switch (grade) {
          case SessionRecordAnswerGrade.A: {
            return GradeA;
          }
          case SessionRecordAnswerGrade.B: {
            return GradeB;
          }
          case SessionRecordAnswerGrade.C: {
            return GradeC;
          }
          case SessionRecordAnswerGrade.D: {
            return GradeD;
          }
          case SessionRecordAnswerGrade.F: {
            return GradeF;
          }
        }
      })()}
      alt={grade}
    />
  );
}
