"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type UIMenuItem = {
  id: string;
  label: ReactNode;
  textValue?: string;
  icon?: ReactNode;
  tone?: "default" | "danger";
  disabled?: boolean;
  onSelect?: () => void;
};

export type UIMenuListProps = {
  items: UIMenuItem[];
  onAction?: (id: string) => void;
  onRequestClose?: () => void;
  closeOnSelect?: boolean;
  size?: "sm" | "lg";
  ariaLabel?: string;
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getFirstEnabledIndex(items: UIMenuItem[]) {
  return items.findIndex((item) => !item.disabled);
}

export function UIMenuList({
  items,
  onAction,
  onRequestClose,
  closeOnSelect = true,
  size = "lg",
  ariaLabel = "Menu",
  className,
}: UIMenuListProps) {
  const [activeIndex, setActiveIndex] = useState(() => getFirstEnabledIndex(items));
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const typeaheadBuffer = useRef("");
  const typeaheadResetTimer = useRef<number | null>(null);
  const sizeClasses =
    size === "sm"
      ? {
          item: "min-h-7 rounded-md px-2 py-1 text-sm",
          icon: "mr-1.5 h-3.5 w-3.5",
        }
      : {
          item: "min-h-10 rounded-lg px-3 py-2.5 text-sm",
          icon: "mr-2 h-4 w-4",
        };

  function setAndFocus(index: number) {
    setActiveIndex(index);
    itemRefs.current[index]?.focus();
  }

  function moveSelection(direction: 1 | -1) {
    if (items.length === 0) {
      return;
    }

    const currentIndex = activeIndex >= 0 ? activeIndex : getFirstEnabledIndex(items);
    if (currentIndex < 0) {
      return;
    }

    for (let step = 1; step <= items.length; step += 1) {
      const nextIndex = (currentIndex + direction * step + items.length) % items.length;
      if (!items[nextIndex]?.disabled) {
        setAndFocus(nextIndex);
        return;
      }
    }
  }

  function handleSelect(item: UIMenuItem) {
    if (item.disabled) {
      return;
    }

    item.onSelect?.();
    onAction?.(item.id);
    if (closeOnSelect) {
      onRequestClose?.();
    }
  }

  function handleTypeahead(key: string) {
    typeaheadBuffer.current += key.toLowerCase();

    if (typeaheadResetTimer.current) {
      window.clearTimeout(typeaheadResetTimer.current);
    }

    typeaheadResetTimer.current = window.setTimeout(() => {
      typeaheadBuffer.current = "";
      typeaheadResetTimer.current = null;
    }, 350);

    const buffer = typeaheadBuffer.current;
    const currentIndex = activeIndex >= 0 ? activeIndex : 0;
    for (let step = 1; step <= items.length; step += 1) {
      const index = (currentIndex + step) % items.length;
      const item = items[index];
      if (item?.disabled) {
        continue;
      }
      const text = (item.textValue ?? (typeof item.label === "string" ? item.label : "")).toLowerCase();
      if (text.startsWith(buffer)) {
        setAndFocus(index);
        return;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first = getFirstEnabledIndex(items);
      if (first >= 0) {
        setAndFocus(first);
      }
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      for (let index = items.length - 1; index >= 0; index -= 1) {
        if (!items[index]?.disabled) {
          setAndFocus(index);
          break;
        }
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onRequestClose?.();
      return;
    }

    if (event.key.length === 1 && /\S/.test(event.key)) {
      handleTypeahead(event.key);
    }
  }

  return (
    <div
      role="menu"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cx(
        "flex min-w-44 max-h-[min(24rem,calc(100vh-2rem))] flex-col gap-[2px] overflow-y-auto rounded-xl border border-line bg-surface p-1",
        className
      )}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          type="button"
          role="menuitem"
          tabIndex={activeIndex === index ? 0 : -1}
          disabled={item.disabled}
          onMouseEnter={() => {
            if (!item.disabled) {
              setActiveIndex(index);
            }
          }}
          onClick={() => handleSelect(item)}
          className={cx(
            "flex w-full items-center text-left transition outline-none",
            sizeClasses.item,
            "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-surface",
            "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-0 focus-visible:ring-offset-surface",
            item.disabled
              ? "cursor-not-allowed text-text-placeholder opacity-60"
              : item.tone === "danger"
                ? "text-danger hover:bg-danger-100 active:bg-danger-200"
                : "text-text-main hover:bg-surface-alt active:bg-neutral-100"
          )}
        >
          {item.icon ? (
            <span className={cx("inline-flex shrink-0 items-center justify-center", sizeClasses.icon)}>
              {item.icon}
            </span>
          ) : null}
          {item.label}
        </button>
      ))}
    </div>
  );
}
