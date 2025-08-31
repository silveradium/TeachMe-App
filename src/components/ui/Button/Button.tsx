import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useMemo, type ButtonHTMLAttributes, type DetailedHTMLProps } from "react";
import { Loader } from "~/components/ui";
import { classNames } from "~/lib/classNames";

const buttonVariants = cva(
  "h-ft w-fit active:scale-95 inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-700 rounded-[62px] disabled:bg-gray-400 shadow",
        secondary: "text-primary-500 hover:text-primary-700 disabled:text-gray-600",
      },
      size: {
        base: "px-8 py-2 text-base",
        sm: "px-6 py-2 text-sm",
        xs: "px-4 py-2 text-xs",
        lg: "px-12 py-2 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
    },
  }
);

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
}

export default forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, loading = false, loadingText, className, disabled, variant, size, onClick, ...props },
  ref
) {
  const mergedClasses = useMemo(
    () =>
      classNames(buttonVariants({ variant, size, className }), {
        "pointer-events-none transition duration-150 ease-in-out space-x-2.5": loading,
      }),
    [className, loading, size, variant]
  );

  return (
    <button
      ref={ref}
      className={mergedClasses}
      onClick={(event) => onClick && !loading && onClick(event)}
      disabled={disabled}
      {...props}>
      {loading && (
        <Loader
          className={classNames("text-white", {
            "h-4 w-4": size === "xs",
          })}
        />
      )}
      {loading && loadingText ? (
        <span>{loadingText}</span>
      ) : typeof children === "string" ? (
        <span>{children}</span>
      ) : (
        children
      )}
    </button>
  );
});
