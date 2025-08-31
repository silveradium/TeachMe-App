import MicIcon from "~/assets/mic-icon";
import { Loader } from "~/components/ui";
import { classNames } from "~/lib/classNames";

interface MicButtonProps {
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  listening?: boolean;
}

export default function MicButton({ onClick, className, loading, listening }: MicButtonProps) {
  return (
    <button
      type={"button"}
      onClick={onClick}
      className={classNames(
        "relative h-16 w-16 rounded-full bg-white shadow",
        { "flex items-center justify-center": listening },
        className
      )}>
      {listening && (
        <span className="relative z-10 inline-flex h-2/3 w-2/3 animate-ping rounded-full bg-primary-500 opacity-75"></span>
      )}
      <div className="absolute left-1/2 top-1/2 z-20 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500">
        {loading ? (
          <div className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2">
            <Loader className="h-full w-full text-white" />
          </div>
        ) : (
          <MicIcon className="absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 text-white" />
        )}
      </div>
    </button>
  );
}
