"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type UISheetSide = "left" | "right";

type UISheetContextValue = {
  open: boolean;
  setOpen: (nextOpen: boolean) => void;
  triggerElement: HTMLElement | null;
  setTriggerElement: (element: HTMLElement | null) => void;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  setHasTitle: (value: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
};

const UISheetContext = createContext<UISheetContextValue | null>(null);

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type UISheetProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (nextOpen: boolean) => void;
  children: ReactNode;
};

export function UISheet({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: UISheetProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const currentOpen = isControlled ? Boolean(open) : uncontrolledOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <UISheetContext.Provider
      value={{
        open: currentOpen,
        setOpen,
        triggerElement,
        setTriggerElement,
        titleId,
        descriptionId,
        hasTitle,
        setHasTitle,
        hasDescription,
        setHasDescription,
      }}
    >
      {children}
    </UISheetContext.Provider>
  );
}

function useSheetContext() {
  const context = useContext(UISheetContext);
  if (!context) {
    throw new Error("UISheet compound components must be used inside UISheet.");
  }
  return context;
}

export function UISheetTrigger({ children }: { children: ReactElement }) {
  const { open, setOpen, setTriggerElement } = useSheetContext();

  if (!isValidElement(children)) {
    return null;
  }

  const child = children as ReactElement<{
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
    "aria-haspopup"?: "dialog";
    "aria-expanded"?: boolean;
  }>;

  return cloneElement(child, {
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      setTriggerElement(event.currentTarget);
      child.props.onClick?.(event);
      if (!event.defaultPrevented) {
        setOpen(true);
      }
    },
  });
}

type UISheetContentProps = HTMLAttributes<HTMLDivElement> & {
  side?: UISheetSide;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  modal?: boolean;
  ariaLabel?: string;
};

export function UISheetContent({
  side = "right",
  className,
  children,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  modal = true,
  ariaLabel,
  ...props
}: UISheetContentProps) {
  const {
    open,
    setOpen,
    triggerElement,
    titleId,
    descriptionId,
    hasTitle,
    hasDescription,
  } = useSheetContext();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousActive = document.activeElement as HTMLElement | null;
    const bodyOverflow = document.body.style.overflow;
    if (modal) {
      document.body.style.overflow = "hidden";
    }

    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (modal) {
        document.body.style.overflow = bodyOverflow;
      }
      if (triggerElement) {
        triggerElement.focus();
      } else {
        previousActive?.focus();
      }
    };
  }, [modal, open, triggerElement]);

  const panel = (
    <div
      className={cx(
        "fixed inset-0 z-50",
        open ? (modal ? "pointer-events-auto" : "pointer-events-none") : "pointer-events-none"
      )}
      onKeyDown={(event) => {
        if (closeOnEscape && event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
        }
      }}
    >
      <div
        className={cx(
          "absolute inset-0 bg-black/35 transition-opacity duration-200 ease-out",
          modal && open ? "pointer-events-auto" : "pointer-events-none",
          open ? "opacity-100" : "opacity-0"
        )}
        onMouseDown={() => {
          if (closeOnOverlayClick) {
            setOpen(false);
          }
        }}
      />
      <div
        className={cx(
          "absolute top-0 h-full w-full max-w-md transform-gpu border border-line bg-surface shadow-[0_16px_48px_rgba(0,0,0,0.2)] outline-none will-change-transform [contain:layout_paint] transition-transform duration-200 ease-out",
          open ? "pointer-events-auto" : "pointer-events-none",
          side === "right" ? "right-0" : "left-0",
          side === "right"
            ? open
              ? "translate-x-0"
              : "translate-x-full"
            : open
              ? "translate-x-0"
              : "-translate-x-full"
        )}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal={modal ? "true" : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          tabIndex={-1}
          className={cx("h-full overflow-y-auto p-6", className)}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return panel;
  }

  return createPortal(panel, document.body);
}

export function UISheetClose({ children }: { children: ReactElement }) {
  const { setOpen } = useSheetContext();

  if (!isValidElement(children)) {
    return null;
  }

  const child = children as ReactElement<{
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  }>;

  return cloneElement(child, {
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      child.props.onClick?.(event);
      if (!event.defaultPrevented) {
        setOpen(false);
      }
    },
  });
}

export function UISheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("grid gap-1.5", className)} {...props} />;
}

export function UISheetTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const { titleId, setHasTitle } = useSheetContext();

  useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return <h2 id={titleId} className={cx("text-lg font-semibold text-text-main", className)} {...props} />;
}

export function UISheetDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId, setHasDescription } = useSheetContext();

  useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return <p id={descriptionId} className={cx("text-sm text-text-muted", className)} {...props} />;
}

export function UISheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("mt-6 flex flex-wrap items-center justify-end gap-2", className)} {...props} />;
}
