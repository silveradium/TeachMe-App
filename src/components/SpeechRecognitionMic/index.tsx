import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import MicButton from "~/components/MicButton/MicButton";

interface SpeechRecognitionProps {
  setValue: Dispatch<SetStateAction<string>>;
}

export default function SpeechRecognitionMic({ setValue }: SpeechRecognitionProps) {
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      return;
    }

    const appId = process.env.SPEECHLY_APP_ID;
    if (appId) {
      const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
      SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    void SpeechRecognition.stopListening();
  }, []);

  useEffect(() => {
    setValue(transcript);
  }, [setValue, transcript]);

  const toggleListening = useCallback(() => {
    if (listening) {
      return void SpeechRecognition.stopListening();
    }

    return void SpeechRecognition.startListening({ continuous: false });
  }, [listening]);

  return (
    <div className="relative h-10 w-10">
      <MicButton onClick={toggleListening} listening={listening} className="h-10 w-10" />
    </div>
  );
}
