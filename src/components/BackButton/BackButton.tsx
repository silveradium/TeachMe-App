import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { HiChevronLeft } from "react-icons/hi2";
import { classNames } from "~/lib/classNames";

import styles from "./BackButton.module.scss";

interface BackButtonProps {
  href?: string;
  className?: string;
}

export default function BackButton({ href, className }: BackButtonProps) {
  const router = useRouter();
  const classes = useMemo(
    () =>
      classNames(
        "inline-flex w-fit items-center space-x-1 transition-colors",
        styles["back-button"],
        className
      ),
    [className]
  );
  const children = useMemo(
    () => (
      <>
        <HiChevronLeft className="h-6 w-6" aria-hidden="true" />
        <span>Back</span>
      </>
    ),
    []
  );

  if ((globalThis.window?.history?.state as { idx: number })?.idx <= 0) {
    return null;
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={() => router.back()} className={classes}>
      {children}
    </button>
  );
}
