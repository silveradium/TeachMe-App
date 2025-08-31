import hotToast from "react-hot-toast";
import { FiCheck, FiInfo } from "react-icons/fi";
import { classNames } from "~/lib/classNames";

type IToast = {
  message: string;
  toastVisible: boolean;
};

export const SuccessToast = ({ message, toastVisible }: IToast) => (
  <div
    className={classNames(
      "mb-2 flex h-auto items-center space-x-2 rounded-md bg-white p-3 text-sm font-semibold text-primary-700 shadow-md rtl:space-x-reverse md:max-w-sm",
      toastVisible && "animate-fade-in-up"
    )}>
    <span>
      <FiCheck className="h-4 w-4" />
    </span>
    <p data-testid="toast-success">{message}</p>
  </div>
);

export const ErrorToast = ({ message, toastVisible }: IToast) => (
  <div
    className={classNames(
      "mb-2 flex h-auto animate-fade-in-up items-center space-x-2 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800 shadow-md rtl:space-x-reverse md:max-w-sm",
      toastVisible && "animate-fade-in-up"
    )}>
    <span>
      <FiInfo className="h-4 w-4" />
    </span>
    <p data-testid="toast-error">{message}</p>
  </div>
);

export const WarningToast = ({ message, toastVisible }: IToast) => (
  <div
    className={classNames(
      "mb-2 flex h-auto animate-fade-in-up items-center space-x-2 rounded-md bg-gray-700 p-3 text-sm font-semibold text-white shadow-md rtl:space-x-reverse md:max-w-sm",
      toastVisible && "animate-fade-in-up"
    )}>
    <span>
      <FiInfo className="h-4 w-4" />
    </span>
    <p data-testid="toast-warning">{message}</p>
  </div>
);

export const DefaultToast = ({ message, toastVisible }: IToast) => (
  <div
    className={classNames(
      "mb-2 flex h-auto animate-fade-in-up items-center space-x-2 rounded-md bg-gray-700 p-3 text-sm font-semibold text-white shadow-md rtl:space-x-reverse md:max-w-sm",
      toastVisible && "animate-fade-in-up"
    )}>
    <span>
      <FiCheck className="h-4 w-4" />
    </span>
    <p>{message}</p>
  </div>
);

const TOAST_VISIBLE_DURATION = 6000;

export default function toast(
  message: string,
  variant: "success" | "warning" | "error",
  duration = TOAST_VISIBLE_DURATION
) {
  switch (variant) {
    case "success":
      hotToast.custom((t) => <SuccessToast message={message} toastVisible={t.visible} />, { duration });
      break;
    case "error":
      hotToast.custom((t) => <ErrorToast message={message} toastVisible={t.visible} />, { duration });
      break;
    case "warning":
      hotToast.custom((t) => <WarningToast message={message} toastVisible={t.visible} />, { duration });
      break;
    default:
      hotToast.custom((t) => <DefaultToast message={message} toastVisible={t.visible} />, { duration });
      break;
  }
}
