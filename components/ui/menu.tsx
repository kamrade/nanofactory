"use client";

import {
  createContext,
  useEffect,
  useId,
  useRef,
  useContext,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import type { Placement } from "@floating-ui/react";

import { UIDropdown } from "@/components/ui/dropdown";
import { UIMenuList, type UIMenuItem as UIMenuDataItem } from "@/components/ui/menu-list";

export type { UIMenuDataItem };
export type UIMenuSize = "sm" | "lg";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type UIMenuCommonProps = {
  trigger: ReactElement;
  placement?: Placement;
  offsetPx?: number;
  size?: UIMenuSize;
  ariaLabel?: string;
  className?: string;
};

type UIMenuItemsProps = UIMenuCommonProps & {
  items: UIMenuDataItem[];
  onAction?: (id: string) => void;
  closeOnSelect?: boolean;
  children?: never;
};

type UIMenuChildrenProps = UIMenuCommonProps & {
  children: ReactNode;
  items?: never;
  onAction?: never;
  closeOnSelect?: never;
};

export type UIMenuProps = UIMenuItemsProps | UIMenuChildrenProps;

function isItemsProps(props: UIMenuProps): props is UIMenuItemsProps {
  return "items" in props;
}

type MenuContextValue = {
  requestClose: () => void;
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;
  size: UIMenuSize;
};

const MenuContext = createContext<MenuContextValue>({
  requestClose: () => undefined,
  activeItemId: null,
  setActiveItemId: () => undefined,
  size: "lg",
});

type UIMenuItemButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  textValue?: string;
  tone?: "default" | "danger";
  size?: UIMenuSize;
  disabled?: boolean;
  closeOnSelect?: boolean;
  className?: string;
  onSelect?: () => void;
};

export function UIMenuItem({
  children,
  icon,
  textValue,
  tone = "default",
  size,
  disabled,
  closeOnSelect = true,
  className,
  onSelect,
}: UIMenuItemButtonProps) {
  const id = useId();
  const { requestClose, activeItemId, setActiveItemId, size: contextSize } = useContext(MenuContext);
  const resolvedSize = size ?? contextSize;
  const sizeClasses =
    resolvedSize === "sm"
      ? {
          item: "min-h-7 rounded-md px-2 py-1 text-sm",
          icon: "mr-1.5 h-3.5 w-3.5",
        }
      : {
          item: "min-h-10 rounded-lg px-3 py-2.5 text-sm",
          icon: "mr-2 h-4 w-4",
        };

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onSelect?.();
    if (closeOnSelect) {
      requestClose();
    }
  }

  const menuText = textValue ?? (typeof children === "string" ? children : "");

  return (
    <button
      type="button"
      role="menuitem"
      data-menu-item="true"
      data-menu-item-id={id}
      data-menu-text={menuText}
      disabled={disabled}
      tabIndex={activeItemId ? (activeItemId === id ? 0 : -1) : 0}
      onFocus={() => setActiveItemId(id)}
      onMouseEnter={() => {
        if (!disabled) {
          setActiveItemId(id);
        }
      }}
      onClick={handleClick}
      className={cx(
        "flex w-full items-center text-left transition outline-none",
        sizeClasses.item,
        "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-surface",
        "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-0 focus-visible:ring-offset-surface",
        disabled
          ? "cursor-not-allowed text-text-placeholder opacity-60"
          : tone === "danger"
            ? "text-danger hover:bg-danger-100 active:bg-danger-200"
            : "text-text-main hover:bg-surface-alt active:bg-neutral-100",
        className
      )}
    >
      {icon ? (
        <span className={cx("inline-flex shrink-0 items-center justify-center", sizeClasses.icon)}>
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}

export function UIMenuSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cx("my-1 h-px bg-line", className)} />;
}

export function UIMenuLabel({
  children,
  size,
  className,
}: {
  children: ReactNode;
  size?: UIMenuSize;
  className?: string;
}) {
  const { size: contextSize } = useContext(MenuContext);
  const resolvedSize = size ?? contextSize;
  return (
    <div
      className={cx(
        resolvedSize === "sm"
          ? "px-2 py-1 text-sm font-medium text-text-muted"
          : "px-3 py-1 text-sm font-medium text-text-muted",
        className
      )}
    >
      {children}
    </div>
  );
}

export function UIMenu(allProps: UIMenuProps) {
  const {
    trigger,
    placement = "bottom-end",
    offsetPx = 8,
    size = "lg",
    ariaLabel = "Menu",
    className,
  } = allProps;
  const [open, setOpen] = useState(false);
  const [manualActiveItemId, setManualActiveItemId] = useState<string | null>(null);
  const requestClose = () => setOpen(false);
  const manualContainerRef = useRef<HTMLDivElement | null>(null);
  const typeaheadBufferRef = useRef("");
  const typeaheadTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (typeaheadTimerRef.current) {
        window.clearTimeout(typeaheadTimerRef.current);
      }
    };
  }, []);

  function getEnabledManualItems() {
    if (!manualContainerRef.current) {
      return [] as HTMLButtonElement[];
    }

    return Array.from(
      manualContainerRef.current.querySelectorAll<HTMLButtonElement>('[data-menu-item="true"]:not(:disabled)')
    );
  }

  function focusManualItem(item: HTMLButtonElement | null) {
    if (!item) {
      return;
    }
    item.focus();
    setManualActiveItemId(item.dataset.menuItemId ?? null);
  }

  function handleManualTypeahead(key: string) {
    const items = getEnabledManualItems();
    if (items.length === 0) {
      return;
    }

    typeaheadBufferRef.current += key.toLowerCase();

    if (typeaheadTimerRef.current) {
      window.clearTimeout(typeaheadTimerRef.current);
    }
    typeaheadTimerRef.current = window.setTimeout(() => {
      typeaheadBufferRef.current = "";
      typeaheadTimerRef.current = null;
    }, 350);

    const buffer = typeaheadBufferRef.current;
    const currentIndex = items.findIndex(
      (item) => item.dataset.menuItemId === manualActiveItemId
    );

    for (let step = 1; step <= items.length; step += 1) {
      const index = (Math.max(currentIndex, -1) + step) % items.length;
      const item = items[index];
      const text = (item.dataset.menuText ?? "").toLowerCase();
      if (text.startsWith(buffer)) {
        focusManualItem(item);
        return;
      }
    }
  }

  function handleManualKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const items = getEnabledManualItems();
    if (items.length === 0) {
      return;
    }

    const currentIndex = items.findIndex(
      (item) => item.dataset.menuItemId === manualActiveItemId
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
      focusManualItem(items[nextIndex]);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex =
        currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
      focusManualItem(items[nextIndex]);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusManualItem(items[0]);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusManualItem(items[items.length - 1]);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      requestClose();
      return;
    }

    if (event.key.length === 1 && /\S/.test(event.key)) {
      handleManualTypeahead(event.key);
    }
  }

  let menuContent: ReactNode;
  if (isItemsProps(allProps)) {
    menuContent = (
      <UIMenuList
        items={allProps.items}
        onAction={allProps.onAction}
        onRequestClose={requestClose}
        closeOnSelect={allProps.closeOnSelect}
        size={size}
        ariaLabel={ariaLabel}
        className={cx("shadow-[0_10px_30px_rgba(0,0,0,0.12)]", className)}
      />
    );
  } else {
    menuContent = (
      <MenuContext.Provider
        value={{
          requestClose,
          activeItemId: manualActiveItemId,
          setActiveItemId: setManualActiveItemId,
          size,
        }}
      >
        <div
          ref={manualContainerRef}
          role="menu"
          aria-label={ariaLabel}
          onKeyDown={handleManualKeyDown}
          className={cx(
            "flex min-w-44 max-h-[min(24rem,calc(100vh-2rem))] flex-col gap-[2px] overflow-y-auto rounded-xl border border-line bg-surface p-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
            className
          )}
        >
          {allProps.children}
        </div>
      </MenuContext.Provider>
    );
  }

  return (
    <UIDropdown
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      placement={placement}
      offsetPx={offsetPx}
      ariaLabel={ariaLabel}
    >
      {menuContent}
    </UIDropdown>
  );
}
