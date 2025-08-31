import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode, SVGProps } from "react";
import { forwardRef } from "react";
import type { NavigationItem } from "~/components/DashboardLayout/DashboardLayout";
import { classNames } from "~/lib/classNames";

export default forwardRef<
  HTMLAnchorElement,
  NavigationItem & { children?: ReactNode; className?: string; mobile?: boolean }
>(function SidebarButton({ icon: iconSrc, current, href, name, children, className, mobile }, ref) {
  return (
    <Link ref={ref} href={href} className={className} aria-current={current ? "page" : undefined}>
      <SidebarIcon src={iconSrc} alt={name} current={current} mobile={mobile} />
      {children}
    </Link>
  );
});

interface SidebarIconProps {
  src: ((props: SVGProps<SVGSVGElement>) => JSX.Element) | StaticImageData;
  alt: string;
  current: boolean;
  mobile?: boolean;
}

function SidebarIcon({ src, alt, current, mobile }: SidebarIconProps) {
  if (typeof src === "function") {
    const Src = src;
    return (
      <Src
        className={classNames(
          "h-5 w-5",
          mobile
            ? current
              ? "text-primary-500"
              : "text-gray-800 group-hover:text-primary-500"
            : current
            ? "text-white"
            : "text-primary-900 group-hover:text-white"
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={classNames(
        "h-5 w-5",
        mobile
          ? {
              "[filter:invert(19%)_sepia(93%)_saturate(4066%)_hue-rotate(347deg)_brightness(96%)_contrast(89%)]":
                current,
              "[filter:invert(12%)_sepia(5%)_saturate(4597%)_hue-rotate(176deg)_brightness(97%)_contrast(89%)] group-hover:[filter:invert(19%)_sepia(93%)_saturate(4066%)_hue-rotate(347deg)_brightness(96%)_contrast(89%)]":
                !current,
            }
          : {
              invert: current,
              "[filter:invert(11%)_sepia(96%)_saturate(3169%)_hue-rotate(350deg)_brightness(85%)_contrast(107%)] group-hover:invert":
                !current,
            }
      )}
      aria-hidden="true"
    />
  );
}
