import { useMemo } from "react";
import { classNames } from "~/lib/classNames";

export enum LoaderSize {
  One,
  Two,
  Three,
  Four,
  Five,
}

export enum LoaderColor {
  Primary = "primary",
  White = "white",
}

type Props = {
  size?: LoaderSize;
  color?: LoaderColor;
  className?: string;
};

export default function Loader({ size = LoaderSize.Three, color = LoaderColor.Primary, className }: Props) {
  const classes = useMemo(() => {
    const differingClasses = [];

    switch (size) {
      case LoaderSize.One:
        differingClasses.push(...["w-2.5", "h-2.5"]);
        break;
      case LoaderSize.Two:
        differingClasses.push(...["w-3", "h-3"]);
        break;
      case LoaderSize.Three:
        differingClasses.push(...["w-5", "h-5"]);
        break;
      case LoaderSize.Four:
        differingClasses.push(...["w-6", "h-6"]);
        break;
      case LoaderSize.Five:
        differingClasses.push(...["w-", "h-7"]);
        break;
    }

    switch (color) {
      case LoaderColor.Primary:
        differingClasses.push("text-primary-700");
        break;
      case LoaderColor.White:
        differingClasses.push("text-white");
    }

    return classNames("animate-spin", ...differingClasses, className);
  }, [className, color, size]);

  return (
    <svg className={classes} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
