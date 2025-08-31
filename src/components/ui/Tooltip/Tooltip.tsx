import type { Placement } from "@floating-ui/react";
import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import type { HTMLProps, ReactNode, Ref } from "react";
import { createContext, forwardRef, useContext, useMemo, useState } from "react";
import { classNames } from "~/lib/classNames";

export enum TooltipTheme {
  Light,
  Dark,
}

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?:
    | number
    | Partial<{
        open: number;
        close: number;
      }>;
  interactive?: boolean;
}

export function useTooltip({
  initialOpen = false,
  placement = "top",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  delay,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift({ padding: 5 }),
    ],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
    delay,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data]
  );
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = createContext<ContextType>(null);

const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (context == null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />");
  }

  return context;
};

interface TooltipProps extends TooltipOptions {
  children: ReactNode & { ref?: Ref<HTMLElement> };
  content: ReactNode;
  theme?: TooltipTheme;
}

export default function Tooltip({ children, content, theme, ...options }: TooltipProps) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent theme={theme}>{content}</TooltipContent>
    </TooltipContext.Provider>
  );
}

interface TooltipTriggerProps extends Omit<HTMLProps<HTMLElement>, "children"> {
  children: ReactNode & { ref?: Ref<HTMLElement> };
}

const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(function TooltipTrigger(
  { children, ...props },
  propRef
) {
  const context = useTooltipContext();
  const ref = useMergeRefs([context.refs.setReference, propRef, ...(children?.ref ? [children?.ref] : [])]);
  return (
    <div
      ref={ref}
      // The user can style the trigger based on the state
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}>
      {children}
    </div>
  );
});

interface TooltipContentProps extends HTMLProps<HTMLDivElement> {
  theme?: TooltipTheme;
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  { theme = TooltipTheme.Dark, ...props },
  propRef
) {
  const context = useTooltipContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.open) return null;

  return (
    <FloatingPortal>
      <div
        ref={ref}
        className={classNames("pointer-events-none z-50 rounded-md px-2 py-1 text-sm shadow", {
          "bg-white text-gray-700": theme === TooltipTheme.Light,
          "bg-gray-700 text-white": theme === TooltipTheme.Dark,
        })}
        style={{
          position: context.strategy,
          top: context.y ?? 0,
          left: context.x ?? 0,
          ...props.style,
        }}
        {...context.getFloatingProps(props)}
      />
    </FloatingPortal>
  );
});
