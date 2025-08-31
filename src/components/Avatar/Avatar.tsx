import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { Maybe } from "@trpc/server";
import { useState } from "react";
import { classNames } from "~/lib/classNames";
import { UserLevel } from "~/server/lib/user-level";

import styles from "./Avatar.module.scss";

type AvatarSize = "xs" | "sm" | "md" | "mdLg" | "lg" | "xl" | "2xl" | "240";

export interface AvatarProps {
  size: AvatarSize;
  className?: string;
  imageSrc?: Maybe<string>;
  alt: string;
  levelDetails?: {
    points: number;
    level: UserLevel;
    pointsOfNextLevel: number;
  };
}

const sizesPropsBySize: { [key in AvatarSize]: string } = {
  xs: "w-4 h-4", // 16px
  sm: "w-6 h-6", // 24px
  md: "w-8 h-8", // 32px
  mdLg: "w-10 h-10", //40px
  lg: "w-16 h-16", // 64px
  xl: "w-24 h-24", // 96px,
  "2xl": "w-32 h-32", // 128px,
  240: "w-60 h-60", // 240px
} as const;

const textPropsBySize: { [key in AvatarSize]: string } = {
  xs: "text-xs", // 12px
  sm: "text-xs", // 12px
  md: "text-xs", // 12px
  mdLg: "text-xs", //12px
  lg: "text-xs", // 12px
  xl: "text-sm", // 14px,
  "2xl": "text-4xl", // 16px,
  240: "text-6xl", // 60px
} as const;

export default function Avatar({ imageSrc, size, alt, className, levelDetails }: AvatarProps) {
  const [loading, setLoading] = useState(true);

  return (
    <span className={classNames("relative h-fit w-32", sizesPropsBySize[size])}>
      <AvatarPrimitive.Root
        className={classNames(
          "item-center relative inline-flex aspect-square justify-center overflow-hidden rounded-full bg-white shadow",
          className,
          sizesPropsBySize[size]
        )}>
        <AvatarPrimitive.Image
          src={imageSrc ?? undefined}
          alt={alt}
          onLoad={() => {
            setLoading(false);
          }}
          className={classNames(
            "relative z-10 aspect-square rounded-full",
            { "scale-90": !!levelDetails },
            sizesPropsBySize[size]
          )}
        />
        {!loading && levelDetails && (
          <div
            className="absolute left-0 top-0 z-0 h-full w-full rotate-180 bg-primary-500"
            style={{
              backgroundImage: `conic-gradient(red ${
                (levelDetails.points / levelDetails.pointsOfNextLevel) * 360
              }deg, white 0deg)`,
            }}
          />
        )}
      </AvatarPrimitive.Root>
      {!loading && levelDetails && (
        <div
          className={classNames("absolute z-40 h-1/4 w-1/4 rounded-full", {
            "right-0 top-0 bg-gray-300": size !== "2xl" && size !== "240",
            "left-1/2 -translate-x-1/2 font-serif text-white": size === "2xl" || size === "240",
            "bottom-2.5": size === "2xl",
            "bottom-4": size === "240",
          })}>
          <span
            className={classNames(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-default",
              { [styles["level-text-xl"] as string]: size === "2xl" || size === "240" },
              textPropsBySize[size]
            )}>
            {LEVEL_ROMAN_NUMERALS[levelDetails.level]}
          </span>
        </div>
      )}
    </span>
  );
}

const LEVEL_ROMAN_NUMERALS: { [key in UserLevel]: string } = {
  [UserLevel.ONE]: "I",
  [UserLevel.TWO]: "II",
  [UserLevel.THREE]: "III",
  [UserLevel.FOUR]: "IV",
  [UserLevel.FIVE]: "V",
};
