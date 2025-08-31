import type { ReactNode } from "react";
import { classNames } from "~/lib/classNames";

import styles from "./Checkbox.module.scss";

const CheckboxFieldLabel = ({
  children,
  field,
  hasError,
  className,
  textClassName,
  checkMarkClassName,
  hideBorder = false,
  transparentBackground,
}: {
  children: ReactNode;
  field: string;
  hasError: boolean;
  className?: string;
  checkMarkClassName?: string;
  textClassName?: string;
  hideBorder?: boolean;
  transparentBackground?: boolean;
}) => (
  <label
    htmlFor={field}
    className={classNames(
      "group",
      "flex w-full cursor-pointer select-none items-center gap-2 overflow-hidden rounded-md px-3 py-2 text-gray-700 transition-colors",
      {
        "bg-transparent": transparentBackground,
        "bg-white shadow-sm hover:bg-blue-800": !!children && !transparentBackground,
        border: !hideBorder,
      },
      hasError ? "border-red-300" : "border-gray-300",
      className
    )}>
    <span
      className={classNames(
        "align-middle group-hover:border-blue-600",
        "relative h-[1.125rem] min-h-[1.125rem] w-[1.125rem] min-w-[1.125rem] scale-100 transform rounded border border-gray-600",
        {
          "bg-transparent": transparentBackground,
          "bg-white": !transparentBackground,
        },
        checkMarkClassName
      )}>
      <svg>
        <polyline points="1.5 6 4.5 9 10.5 1" />
      </svg>
    </span>
    {children && (
      <span
        className={classNames("align-middle text-sm", textClassName)}
        style={{ transform: "translate3d(0, 0, 0)" }}>
        {children}
      </span>
    )}
  </label>
);

interface CheckboxProps {
  field: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
  children?: ReactNode;
  defaultChecked?: boolean;
  hasError?: boolean;
  tabIndex?: number;
  className?: string;
  checkMarkClassName?: string;
  textClassName?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;
  hideBorder?: boolean;
  transparentBackground?: boolean;
}

const Checkbox = ({
  field,
  checked,
  onChange,
  children,
  hasError = false,
  tabIndex,
  className,
  checkMarkClassName,
  textClassName,
  wrapperClassName,
  style,
  hideBorder = false,
  transparentBackground = false,
}: CheckboxProps) => {
  return (
    <div style={style} className={classNames("relative", wrapperClassName)}>
      <input
        id={field}
        type="checkbox"
        name={field}
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
        className={classNames("peer absolute opacity-0", styles.checkbox)}
        tabIndex={tabIndex}
      />

      <CheckboxFieldLabel
        field={field}
        hasError={hasError}
        className={className}
        checkMarkClassName={checkMarkClassName}
        textClassName={textClassName}
        hideBorder={hideBorder}
        transparentBackground={transparentBackground}>
        {children}
      </CheckboxFieldLabel>
    </div>
  );
};

export default Checkbox;
