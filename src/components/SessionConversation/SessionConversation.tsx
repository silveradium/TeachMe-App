import type { SessionRecordAnswer, SessionRecordQuestion, User } from "@prisma/client";
import { SessionRecordStatus } from "@prisma/client";
import Link from "next/link";
import type { ChangeEvent, FormEventHandler } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import Logo from "~/assets/logo.webp";
import SendIcon from "~/assets/send-icon";
import { Avatar, BackButton } from "~/components";
import SpeechRecognitionMic from "~/components/SpeechRecognitionMic";
import { Button, Loader, LoaderSize, TextArea } from "~/components/ui";
import { classNames } from "~/lib/classNames";
import { api } from "~/utils/api";

interface SessionConversationProps {
  id: string;
  status: SessionRecordStatus;
}

export default function SessionConversation({ id, status }: SessionConversationProps) {
  const { data: user } = api.me.useQuery();
  const {
    data: sessionRecord,
    isLoading: sessionRecordLoading,
    refetch: refetchSessionRecord,
  } = api.sessionRecords.get.useQuery({ id });
  const { mutate: answerQuestion, isLoading: answerQuestionInProgress } =
    api.sessionRecords.answerQuestion.useMutation({
      onSuccess() {
        setAnswerInput("");
        void refetchSessionRecord();
      },
    });
  const { mutate: endSessionRecord, isLoading: endSessionRecordInProgress } =
    api.sessionRecords.end.useMutation({
      onSuccess() {
        setAnswerInput("");
        void refetchSessionRecord();
      },
    });
  const [answerInput, setAnswerInput] = useState("");
  const characterLimitExceeded = useMemo(() => answerInput.length >= 5000, [answerInput]);
  const disabled = useMemo(
    () => answerInput.trim().length === 0 || characterLimitExceeded,
    [characterLimitExceeded, answerInput]
  );
  const messages = useMemo(() => {
    if (!sessionRecord || sessionRecord.currentQuestionIndex == null) {
      return [];
    }

    const questions = sessionRecord.questions.slice(0, sessionRecord.currentQuestionIndex + 1);
    return questions.map((question, index) => ({ question, answer: sessionRecord.answers[index] }));
  }, [sessionRecord]);
  const messagesListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!messagesListRef.current) {
        return;
      }
      messagesListRef.current.scrollTo({
        behavior: "smooth",
        top: messagesListRef.current.scrollHeight,
      });
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [messages, messagesListRef]);

  const onAnswerInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerInput(event.target.value);
  }, []);

  const handleAnswerQuestion: FormEventHandler<HTMLFormElement> = (event) => {
    if (status === SessionRecordStatus.FINISHED) {
      return;
    }

    event.preventDefault();
    answerQuestion({ id, answerInput: answerInput.trim() });
  };

  return (
    <div
      className="flex h-full flex-col space-y-4 bg-white bg-opacity-25 bg-cover bg-center bg-no-repeat px-4 pt-6 bg-blend-color"
      style={{ backgroundImage: `url(${BackgroundPatternTransparent.src})` }}>
      <BackButton />
      <div className="mx-8 flex flex-auto flex-col items-center space-y-6 overflow-hidden pt-8">
        <div className="flex w-full items-center justify-between self-start px-8">
          <span className="text-3xl underline decoration-primary-500">{sessionRecord?.topic || ""}</span>
          <Button
            onClick={() => {
              void endSessionRecord({ id });
            }}
            loading={endSessionRecordInProgress}>
            End Session
          </Button>
        </div>
        <div className="relative flex w-full flex-auto overflow-hidden rounded-b-sm rounded-t-3xl bg-gray-50 bg-opacity-80 shadow">
          <ul ref={messagesListRef} className="w-full space-y-6 overflow-y-auto overflow-x-hidden px-4 py-8">
            {user &&
              messages.map((message) => (
                <li key={message.question.id}>
                  <MessageBlock user={user} {...message} />
                </li>
              ))}
          </ul>
          {sessionRecordLoading && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader size={LoaderSize.Five} className="text-gray-500" />
            </div>
          )}
        </div>
        {status === SessionRecordStatus.FINISHED && (
          <div className="my-6">
            <Link href={`/dashboard/sessions/${id}/summary`}>
              <Button>Go to session summary</Button>
            </Link>
          </div>
        )}
        <form
          onSubmit={handleAnswerQuestion}
          className="flex w-full items-center justify-between rounded-sm bg-white px-4 shadow">
          <TextArea
            id="sessionRecord.answer"
            className="resize-none px-2 py-4 !leading-normal"
            wrapperClassName="w-full px-px pt-1"
            value={answerInput}
            onChange={onAnswerInputChange}
            placeholder={
              status === SessionRecordStatus.FINISHED ? "This session has ended." : "Type your answer here"
            }
            minRows={3}
            maxRows={6}
            readOnly={
              answerQuestionInProgress || sessionRecordLoading || status === SessionRecordStatus.FINISHED
            }
            error={characterLimitExceeded}
          />
          <div className="mr-4 h-12 w-1 bg-gray-300" />
          <SpeechRecognitionMic setValue={setAnswerInput} />
          <div className="mx-4 h-12 w-1 bg-gray-300" />
          <SendAnswerButton loading={answerQuestionInProgress} disabled={disabled} />
        </form>
      </div>
    </div>
  );
}

function MessageBlock({
  user,
  question,
  answer,
}: {
  user: Pick<User, "name" | "avatar">;
  question: SessionRecordQuestion;
  answer: SessionRecordAnswer | undefined;
}) {
  const userAvatar = useMemo(
    () => <Avatar imageSrc={user?.avatar} alt={user?.name || "You"} size="mdLg" />,
    [user?.avatar, user?.name]
  );
  const botAvatar = useMemo(() => <Avatar imageSrc={Logo.src} alt="Your study partner" size="mdLg" />, []);
  const [expanded, setExpanded] = useState(false);
  const questionText = useMemo(() => question.payload, [question.payload]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-end space-x-2.5">
        <div className="w-1/2 max-w-sm rounded-t-2xl rounded-bl-2xl bg-primary-500 px-6 py-3 shadow">
          <p className="text-white">{questionText}</p>
        </div>
        {botAvatar}
      </div>
      {answer && (
        <div className="flex space-x-2.5">
          {userAvatar}
          <div className="w-1/2 max-w-sm space-y-1 divide-y rounded-t-2xl rounded-br-2xl bg-white px-6 py-3 shadow">
            <p className="text-gray-700">
              {expanded ? answer.payload : `${answer.payload.slice(0, 100)}...`}
            </p>
            {answer.payload.length > 100 && (
              <div>
                <label
                  htmlFor={`sessionRecord.${answer.id}`}
                  className="cursor-pointer text-xs hover:underline">
                  {expanded ? "See Less" : "See All"}
                </label>
                <input
                  id={`sessionRecord.${answer.id}`}
                  type="checkbox"
                  className="opacity-0"
                  onChange={(event) => setExpanded(event.currentTarget.checked)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SendAnswerButtonProps {
  loading?: boolean;
  disabled?: boolean;
}

function SendAnswerButton({ loading, disabled }: SendAnswerButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={classNames(
        disabled
          ? "text-gray-300"
          : "text-primary-500 transition-colors hover:text-primary-700 active:scale-95"
      )}>
      {loading ? <Loader className="h-6 w-6" /> : <SendIcon className="h-6 w-6" aria-hidden="true" />}
    </button>
  );
}
