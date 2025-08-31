import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { Button, Tooltip } from "~/components/ui";
import { classNames } from "~/lib/classNames";
import { api } from "~/utils/api";

interface RetrySessionButtonProps {
  id: string;
  size?: "sm" | "xs";
  disabled?: boolean;
  className?: string;
}

export default function RetrySessionButton({
  id,
  size = "xs",
  disabled,
  className,
}: RetrySessionButtonProps) {
  const router = useRouter();
  const { mutate: retrySessionRecord, isLoading: retrySessionRecordInProgress } =
    api.sessionRecords.retry.useMutation({
      onSuccess(data) {
        void router.push(`/dashboard/sessions/${data.id}`);
      },
    });

  const onClick = useCallback(() => {
    retrySessionRecord({ id });
  }, [id, retrySessionRecord]);

  const element = useMemo(
    () => (
      <Button
        size={size}
        onClick={onClick}
        className={classNames(className)}
        loading={retrySessionRecordInProgress}
        disabled={disabled}>
        Retry session
      </Button>
    ),
    [className, disabled, onClick, retrySessionRecordInProgress, size]
  );

  if (disabled) {
    return <Tooltip content="Please finish your ongoing sessions first">{element}</Tooltip>;
  }

  return element;
}
