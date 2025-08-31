import { SessionRecordStatus } from "@prisma/client";
import type { ChangeEvent, Dispatch, FormEventHandler, SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";
import { HiChevronRight } from "react-icons/hi2";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import Logo from "~/assets/logo.webp";
import { Avatar, BackButton } from "~/components";
import SpeechRecognitionMic from "~/components/SpeechRecognitionMic";
import { Input, Loader } from "~/components/ui";
import { classNames } from "~/lib/classNames";
import { api } from "~/utils/api";

import styles from "./SessionStart.module.scss";

interface SessionStartProps {
  id: string;
  setSessionRecordStatus: Dispatch<SetStateAction<SessionRecordStatus | null>>;
}

export default function SessionStart({ id, setSessionRecordStatus }: SessionStartProps) {
  const { mutate: startSession, isLoading: startSessionInProgress } = api.sessionRecords.start.useMutation({
    onSuccess() {
      setSessionRecordStatus(SessionRecordStatus.STARTED);
    },
  });
  const [topicInput, setTopicInput] = useState("");
  const disabled = useMemo(() => !topicInput.trim(), [topicInput]);

  const onTopicInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTopicInput(event.target.value);
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      if (disabled) {
        return;
      }

      event.preventDefault();
      void startSession({ id, topicInput: topicInput.trim() });
    },
    [disabled, id, startSession, topicInput]
  );

  return (
    <div
      className="flex h-full flex-col space-y-4 bg-white bg-opacity-25 bg-cover bg-center bg-no-repeat px-4 pt-6 bg-blend-color"
      style={{ backgroundImage: `url(${BackgroundPatternTransparent.src})` }}>
      <BackButton />
      <div className="mx-8 flex flex-auto flex-col rounded-t-3xl bg-gray-50 bg-opacity-80 px-4 py-8 shadow">
        <div className="flex w-1/2 flex-1 space-x-5">
          <Avatar imageSrc={Logo.src} alt="Your study partner" size="mdLg" />
          <div className="h-fit w-80 rounded-t-2xl rounded-br-2xl bg-primary-500 px-8 py-4 shadow">
            <span className="text-lg text-white">What are you going to teach me today?</span>
          </div>
        </div>
        <div className="flex-1 self-center">
          <form
            onSubmit={handleSubmit}
            className="flex h-fit max-w-lg items-center justify-center border-b-2 border-red-500 py-1">
            <Input
              value={topicInput}
              onChange={onTopicInputChange}
              placeholder="Enter your topic"
              className="bg-transparent text-3xl"
              wrapperClassName="space-y-4"
            />
            <div className="flex items-center space-x-4">
              <SpeechRecognitionMic setValue={setTopicInput} />
              <NextButton loading={startSessionInProgress} disabled={disabled} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface NextButtonProps {
  loading?: boolean;
  disabled?: boolean;
}

function NextButton({ loading, disabled }: NextButtonProps) {
  return (
    <button type="submit" className={classNames(styles["next-button"])} disabled={loading || disabled}>
      {loading ? (
        <Loader className="text-inherit" />
      ) : (
        <HiChevronRight className="h-8 w-8 " aria-hidden="true" />
      )}
    </button>
  );
}
