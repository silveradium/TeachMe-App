import { Listbox, Transition } from "@headlessui/react";
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useCallback, useMemo } from "react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";
import { classNames } from "~/lib/classNames";

import styles from "./Select.module.scss";

export interface SelectItem<T = string> {
  id: number;
  name: T;
  title?: string;
  disabled?: boolean;
}

export type SelectStateType<T = string> = SelectItem<T> | undefined;

interface Props<T> {
  state: [SelectStateType<T>, Dispatch<SetStateAction<SelectStateType<T>>>];
  items: SelectItem<T>[];
  onChange?: (changedTo: SelectItem<T>, changedFrom?: SelectItem<T>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  optionsListClassName?: string;
}

export default function Select<T extends string>({
  state,
  items,
  onChange,
  placeholder = "Select",
  label,
  className,
  wrapperClassName,
  labelClassName,
  optionsListClassName,
}: Props<T>) {
  const [selected, setSelected] = useMemo(() => state, [state]);

  const getTitle = useCallback((item: SelectStateType<T>) => item?.title ?? item?.name, []);

  const handleChange = useCallback(
    (value: SelectItem<T>) => {
      onChange && onChange(value, selected);
      setSelected(value);
    },
    [onChange, selected, setSelected]
  );

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className={classNames("relative", wrapperClassName)}>
        {label && (
          <Listbox.Label
            className={classNames("mb-1 block text-sm font-medium text-gray-700", labelClassName)}>
            {label}
          </Listbox.Label>
        )}
        <Listbox.Button className="relative w-full cursor-default border-b border-gray-500 bg-white pl-4 pr-10 text-left shadow-sm focus:outline-none sm:text-sm">
          <span className={classNames("block truncate text-gray-900", className)} title={getTitle(selected)}>
            {getTitle(selected) ?? <span className={styles.placeholder}>{placeholder}</span>}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Listbox.Options
            className={classNames(
              "absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
              optionsListClassName
            )}>
            {items.map((item) => (
              <SelectOption key={item.id} item={item} title={item.title ?? item.name} />
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

interface SelectOptionProps {
  item: SelectItem;
  title: string;
}

function SelectOption({ item, title }: SelectOptionProps) {
  const { disabled = false } = item;
  return (
    <Listbox.Option
      className={({ active }) =>
        classNames(
          !disabled && (active ? "bg-primary-700 text-white" : "text-gray-800"),
          "relative cursor-default select-none py-2.5 pl-3 pr-9",
          {
            "bg-gray-200 text-gray-600": disabled,
          }
        )
      }
      title={title}
      value={item}
      disabled={disabled ?? false}>
      {({ selected: isSelected, active }) => (
        <>
          <span className="inline-flex w-full items-center gap-x-2">
            <span className={classNames(isSelected ? "font-semibold" : "font-normal", "block truncate")}>
              {item.title ?? item.name}
            </span>
          </span>
          <CheckIfSelected active={active} />
        </>
      )}
    </Listbox.Option>
  );
}

function CheckIfSelected({ active }: { active: boolean }) {
  if (!active) {
    return null;
  }
  return (
    <span
      className={classNames(
        active ? "text-white" : "text-primary-700",
        "absolute inset-y-0 right-0 flex items-center pr-4"
      )}>
      <HiCheck className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}
