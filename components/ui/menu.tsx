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
import { UIMenuList, type UIMenuItem } from "@/components/ui/menu-list";

export type { UIMenuItem };

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type UIMenuCommonProps = {
  trigger: ReactElement;
  placement?: Placement;
  offsetPx?: number;
  ariaLabel?: string;
  className?: string;
};

type UIMenuItemsProps = UIMenuCommonProps & {
  items: UIMenuItem[];
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

type MenuContextValue = {
  requestClose: () => void;
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;
};

const MenuContext = createContext<MenuContextValue>({
  requestClose: () => undefined,
  activeItemId: null,
  setActiveItemId: () => undefined,
});

type UIMenuItemButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  textValue?: string;
  tone?: "default" | "danger";
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
  disabled,
  closeOnSelect = true,
  className,
  onSelect,
}: UIMenuItemButtonProps) {
  const id = useId();
  const { requestClose, activeItemId, setActiveItemId } = useContext(MenuContext);

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
        "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition outline-none",
        "focus:ring-2 focus:ring-focus/50 focus:ring-offset-2 focus:ring-offset-surface",
        "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        disabled
          ? "cursor-not-allowed text-text-placeholder opacity-60"
          : tone === "danger"
            ? "text-danger hover:bg-danger-100 active:bg-danger-200"
            : "text-text-main hover:bg-surface-alt active:bg-neutral-100",
        className
      )}
    >
      {icon ? <span className="mr-2 inline-flex h-4 w-4 shrink-0 items-center justify-center">{icon}</span> : null}
      {children}
    </button>
  );
}

export function UIMenuSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cx("my-1 h-px bg-line", className)} />;
}

export function UIMenuLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "px-3 py-1 text-sm font-medium text-text-muted",
        className
      )}
    >
      {children}
    </div>
  );
}

export function UIMenu({
  trigger,
  placement = "bottom-end",
  offsetPx = 8,
  ariaLabel = "Menu",
  className,
  ...props
}: UIMenuProps) {
  const [open, setOpen] = useState(false);
  const [manualActiveItemId, setManualActiveItemId] = useState<string | null>(null);
  const isItemsMode = "items" in props;
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

  return (
    <UIDropdown
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      placement={placement}
      offsetPx={offsetPx}
      ariaLabel={ariaLabel}
    >
      {isItemsMode ? (
        <UIMenuList
          items={props.items}
          onAction={props.onAction}
          onRequestClose={requestClose}
          closeOnSelect={props.closeOnSelect}
          ariaLabel={ariaLabel}
          className={cx("shadow-[0_10px_30px_rgba(0,0,0,0.12)]", className)}
        />
      ) : (
        <MenuContext.Provider
          value={{
            requestClose,
            activeItemId: manualActiveItemId,
            setActiveItemId: setManualActiveItemId,
          }}
        >
          <div
            ref={manualContainerRef}
            role="menu"
            aria-label={ariaLabel}
            onKeyDown={handleManualKeyDown}
            className={cx(
              "min-w-44 rounded-xl border border-line bg-surface p-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
              className
            )}
          >
            {props.children}
          </div>
        </MenuContext.Provider>
      )}
    </UIDropdown>
  );
}
