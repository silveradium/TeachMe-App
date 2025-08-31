import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { HiExclamationCircle } from "react-icons/hi2";
import { classNames } from "~/lib/classNames";

import styles from "./Input.module.scss";

const inputVariants = cva(
  "border-none bg-white text-base transition-colors [border-bottom-style:solid] focus:shadow-none",
  {
    variants: {
      variant: {
        default: "border-b-gray-500",
        error: "border-b-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string | boolean | null;
  wrapperClassName?: string;
  labelClassName?: string;
}

export default function Input({
  id,
  className,
  name,
  onChange,
  value,
  placeholder,
  disabled,
  variant,
  label,
  error,
  wrapperClassName,
  labelClassName,
  ...props
}: InputProps) {
  return (
    <div className={classNames("relative", wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={classNames(disabled ? "text-gray-300" : "text-gray-700", labelClassName)}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={classNames(styles.container, inputVariants({ variant }), className)}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
      {error && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
          {typeof error === "string" && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </>
      )}
    </div>
  );
}
