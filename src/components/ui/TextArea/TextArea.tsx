import { forwardRef, useMemo } from "react";
import { HiExclamationCircle } from "react-icons/hi2";
import type { TextareaAutosizeProps } from "react-textarea-autosize";
import TextareaAutosize from "react-textarea-autosize";
import { classNames } from "~/lib/classNames";

import styles from "./TextArea.module.scss";

export type TextAreaProps = Omit<TextareaAutosizeProps, "ref"> & {
  id: string;
  label?: string;
  error?: string | boolean | null;
  disabled?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
};

export default forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { id, label, className, error, disabled, wrapperClassName, labelClassName, placeholder = label, ...props },
  ref
) {
  const classes = useMemo(() => {
    const differingClasses = [];

    if (error) {
      differingClasses.push(
        "border-2",
        "border-red-300",
        "text-red-900",
        "placeholder-red-300",
        "focus:ring-red-500",
        "focus:border-red-500"
      );
    }

    if (disabled) {
      differingClasses.push("text-gray-700, opacity-75");
    }

    return classNames([
      "block",
      "w-full",
      "border-none",
      "shadow-sm",
      "py-2",
      "px-3",
      "focus:outline-none",
      "focus:shadow-none",
      "sm:text-sm",
      differingClasses,
    ]);
  }, [disabled, error]);

  return (
    <div
      className={classNames(
        "relative",
        disabled ? "pointer-events-none bg-gray-700 p-2.5" : "",
        wrapperClassName
      )}>
      {label && (
        <label
          htmlFor={id}
          className={classNames(
            "block text-sm font-medium",
            disabled ? "text-gray-300" : "text-gray-700",
            labelClassName
          )}>
          {label}
        </label>
      )}
      <div className="relative">
        <TextareaAutosize
          ref={ref}
          id={id}
          name={id}
          className={classNames(classes, styles.container, className)}
          placeholder={placeholder}
          readOnly={disabled}
          {...props}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
});
