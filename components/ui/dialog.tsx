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
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type UIDialogContextValue = {
  open: boolean;
  setOpen: (nextOpen: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  setHasTitle: (value: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
};

const UIDialogContext = createContext<UIDialogContextValue | null>(null);

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [] as HTMLElement[];
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("disabled") && element.tabIndex !== -1);
}

type UIDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (nextOpen: boolean) => void;
  children: ReactNode;
};

export function UIDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: UIDialogProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
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

  const contextValue: UIDialogContextValue = {
    open: currentOpen,
    setOpen,
    triggerRef,
    contentRef,
    titleId,
    descriptionId,
    hasTitle,
    setHasTitle,
    hasDescription,
    setHasDescription,
  };

  return <UIDialogContext.Provider value={contextValue}>{children}</UIDialogContext.Provider>;
}

function useDialogContext() {
  const context = useContext(UIDialogContext);
  if (!context) {
    throw new Error("UIDialog compound components must be used inside UIDialog.");
  }
  return context;
}

export function UIDialogTrigger({
  children,
}: {
  children: ReactElement;
}) {
  const { open, setOpen, triggerRef } = useDialogContext();

  if (!isValidElement(children)) {
    return null;
  }

  return cloneElement(children, {
    ref: triggerRef,
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      children.props.onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      setOpen(true);
    },
  });
}

type UIDialogContentProps = HTMLAttributes<HTMLDivElement> & {
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  ariaLabel?: string;
};

export function UIDialogContent({
  className,
  children,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  ariaLabel,
  ...props
}: UIDialogContentProps) {
  const {
    open,
    setOpen,
    triggerRef,
    contentRef,
    titleId,
    descriptionId,
    hasTitle,
    hasDescription,
  } = useDialogContext();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousActive = document.activeElement as HTMLElement | null;
    const triggerElement = triggerRef.current;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      const focusables = getFocusableElements(contentRef.current);
      if (focusables.length > 0) {
        focusables[0]?.focus();
      } else {
        contentRef.current?.focus();
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = bodyOverflow;
      if (triggerElement) {
        triggerElement.focus();
      } else {
        previousActive?.focus();
      }
    };
  }, [contentRef, open, triggerRef]);

  if (!open) {
    return null;
  }

  const layer = (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/35"
      />
      <div
        className="relative flex min-h-full items-center justify-center p-4"
        onMouseDown={(event) => {
          if (!closeOnOverlayClick) {
            return;
          }
          if (event.target === event.currentTarget) {
            setOpen(false);
          }
        }}
      >
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          tabIndex={-1}
          className={cx(
            "w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-[0_16px_48px_rgba(0,0,0,0.2)] outline-none",
            "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0",
            className
          )}
          onMouseDown={(event) => event.stopPropagation()}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (closeOnEscape && event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              return;
            }

            if (event.key === "Tab") {
              const focusables = getFocusableElements(contentRef.current);
              if (focusables.length === 0) {
                event.preventDefault();
                return;
              }
              const first = focusables[0];
              const last = focusables[focusables.length - 1];
              const active = document.activeElement as HTMLElement | null;

              if (event.shiftKey && active === first) {
                event.preventDefault();
                last?.focus();
                return;
              }

              if (!event.shiftKey && active === last) {
                event.preventDefault();
                first?.focus();
              }
            }
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return layer;
  }

  return createPortal(layer, document.body);
}

export function UIDialogClose({
  children,
}: {
  children: ReactElement;
}) {
  const { setOpen } = useDialogContext();

  if (!isValidElement(children)) {
    return null;
  }

  return cloneElement(children, {
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      children.props.onClick?.(event);
      if (!event.defaultPrevented) {
        setOpen(false);
      }
    },
  });
}

export function UIDialogHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("grid gap-1.5", className)} {...props} />;
}

export function UIDialogTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  const { titleId, setHasTitle } = useDialogContext();

  useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return <h2 id={titleId} className={cx("text-lg font-semibold text-text-main", className)} {...props} />;
}

export function UIDialogDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId, setHasDescription } = useDialogContext();

  useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return <p id={descriptionId} className={cx("text-sm text-text-muted", className)} {...props} />;
}

export function UIDialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("mt-6 flex flex-wrap items-center justify-end gap-2", className)} {...props} />
  );
}
