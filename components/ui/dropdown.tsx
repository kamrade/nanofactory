"use client";

import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  type Placement,
} from "@floating-ui/react";
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type HTMLProps,
  type ReactElement,
  type ReactNode,
} from "react";

type ThemeAttrs = {
  theme?: string;
  mode?: string;
};

export type UIDropdownProps = {
  trigger: ReactElement;
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  placement?: Placement;
  offsetPx?: number;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function UIDropdown({
  trigger,
  open,
  onOpenChange,
  placement = "bottom-end",
  offsetPx = 8,
  ariaLabel = "Dropdown",
  className,
  children,
}: UIDropdownProps) {
  const [themeAttrs, setThemeAttrs] = useState<ThemeAttrs>({});

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(offsetPx), flip({ padding: 8 }), shift({ padding: 8 })],
  });

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const setReference = useCallback(
    (node: HTMLElement | null) => {
      refs.setReference(node);
      if (!node) {
        setThemeAttrs({});
        return;
      }

      const scope = node.closest("[data-theme]") as HTMLElement | null;
      if (!scope) {
        setThemeAttrs({});
        return;
      }

      setThemeAttrs({
        theme: scope.dataset.theme,
        mode: scope.dataset.mode,
      });
    },
    [refs]
  );

  const setFloating = useCallback(
    (node: HTMLElement | null) => {
      refs.setFloating(node);
    },
    [refs]
  );

  useEffect(() => {
    const node = refs.reference.current as HTMLElement | null;
    if (!node) {
      return;
    }

    const scope = node.closest("[data-theme]") as HTMLElement | null;
    if (!scope) {
      return;
    }

    const observer = new MutationObserver(() => {
      setThemeAttrs({
        theme: scope.dataset.theme,
        mode: scope.dataset.mode,
      });
    });
    observer.observe(scope, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    return () => observer.disconnect();
  }, [open, refs.reference]);

  const referenceProps = getReferenceProps({
    "aria-haspopup": "menu",
    "aria-expanded": open,
  });

  const dropdownTrigger = useMemo(() => {
    if (!isValidElement(trigger)) {
      return null;
    }

    return cloneElement(trigger as ReactElement<HTMLProps<HTMLElement>>, {
      ...referenceProps,
      ref: setReference,
    });
  }, [trigger, referenceProps, setReference]);

  return (
    <>
      {dropdownTrigger}
      {open ? (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <div
              ref={setFloating}
              style={floatingStyles}
              data-theme={themeAttrs.theme}
              data-mode={themeAttrs.mode}
              className={cx("z-50", className)}
              {...getFloatingProps({ "aria-label": ariaLabel })}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}
