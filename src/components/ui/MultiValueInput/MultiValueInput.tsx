import type {
  ChangeEventHandler,
  DetailedHTMLProps,
  Dispatch,
  InputHTMLAttributes,
  KeyboardEventHandler,
  SetStateAction,
} from "react";
import { useState } from "react";
import { classNames } from "~/lib/classNames";

import styles from "./MultiValueInput.module.scss";

interface MultiValueInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
  valueOnInputField: string;
  setValueOnInputField: Dispatch<SetStateAction<string>>;
  wrapperClassName?: string;
  label?: string;
  labelClassName?: string;
}

export default function MultiValueInput({
  id,
  values,
  setValues,
  valueOnInputField,
  setValueOnInputField,
  className,
  wrapperClassName,
  label,
  labelClassName,
  ...props
}: MultiValueInputProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const onValueChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    setValueOnInputField(event.target.value);
  };

  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== "," && event.key !== "Enter") {
      return;
    }
    event.preventDefault();

    const trimmed = valueOnInputField.trim();
    if (!trimmed || values.includes(trimmed)) {
      return;
    }

    setValues([...values, trimmed]);
    setValueOnInputField("");
  };

  const onSelectedEmailKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();

      setValues(values.filter((_, index) => index !== selectedIndex));
      setSelectedIndex(null);
    }
  };

  return (
    <div
      className={classNames(
        "flex flex-col overflow-y-auto border-b border-gray-500",
        styles.container,
        wrapperClassName
      )}>
      {label && (
        <label htmlFor={id} className={classNames("text-gray-700", labelClassName)}>
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {values.map((value, valueIdx) => (
          <div
            key={value}
            tabIndex={0}
            onFocus={() => setSelectedIndex(valueIdx)}
            onBlur={() => setSelectedIndex(null)}
            onKeyDown={onSelectedEmailKeyDown}
            className={classNames("w-fit cursor-default rounded-md border border-gray-200 px-2 py-0.5", {
              "bg-primary-500 text-white": valueIdx === selectedIndex,
            })}>
            {value}
          </div>
        ))}
      </div>
      <input
        id={id}
        onChange={onValueChange}
        value={valueOnInputField}
        onKeyDown={onInputKeyDown}
        className={classNames("border-none bg-transparent pl-4 outline-none focus:shadow-none", className)}
        {...props}
      />
    </div>
  );
}
