import { useRouter } from "next/router";
import MicButton from "~/components/MicButton/MicButton";
import { api } from "~/utils/api";

export default function StartSessionButton() {
  const router = useRouter();
  const { mutate: createSessionRecord, isLoading: createSessionRecordInProgress } =
    api.sessionRecords.create.useMutation({
      onSuccess(data) {
        void router.push(`/dashboard/sessions/${data.id}`);
      },
    });

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <MicButton
        onClick={() => {
          void createSessionRecord();
        }}
        loading={createSessionRecordInProgress}
        className="h-48 w-48 hover:bg-gray-50 active:scale-95 active:bg-gray-100"
      />
      <div className="mt-3 text-xl font-medium tracking-wider text-red-500">Start Session</div>
    </div>
  );
}
