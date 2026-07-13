"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

import { cx } from "@/lib/cn";

import {
  menuRadiusStyles,
  resolveMenuBorderRadiusValue,
  type UIMenuBorderRadius,
} from "./menu-radius";
import { UIMenuItemSizeClassName, type UIMenuSize } from "./menu-size";
import styles from "./menu.module.css";

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
  size?: UIMenuSize;
  borderRadius?: UIMenuBorderRadius;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

function getFirstEnabledIndex(items: UIMenuItem[]) {
  return items.findIndex((item) => !item.disabled);
}

export function UIMenuList({
  items,
  onAction,
  onRequestClose,
  closeOnSelect = true,
  size = "lg",
  borderRadius = "lg",
  ariaLabel = "Menu",
  className,
  style,
}: UIMenuListProps) {
  const [activeIndex, setActiveIndex] = useState(() => getFirstEnabledIndex(items));
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const typeaheadBuffer = useRef("");
  const typeaheadResetTimer = useRef<number | null>(null);
  const sizeClasses = UIMenuItemSizeClassName[size];

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
      data-component='UIMenuList'
      role="menu"
      aria-label={ariaLabel}
      data-border-radius={borderRadius}
      onKeyDown={handleKeyDown}
      className={cx(styles.surface, className)}
      style={{
        ...menuRadiusStyles[borderRadius],
        borderRadius: resolveMenuBorderRadiusValue(borderRadius),
        ...style,
      }}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          type="button"
          role="menuitem"
          data-size={size}
          data-tone={item.tone ?? "default"}
          tabIndex={activeIndex === index ? 0 : -1}
          disabled={item.disabled}
          onMouseEnter={() => {
            if (!item.disabled) {
              setActiveIndex(index);
            }
          }}
          onClick={() => handleSelect(item)}
          style={{ borderRadius: resolveMenuBorderRadiusValue(borderRadius) }}
          className={cx(
            styles.item,
            sizeClasses.item,
            item.disabled ? styles.itemDisabled : item.tone === "danger" ? styles.toneDanger : styles.toneDefault
          )}
        >
          {item.icon ? (
            <span
              className={cx(styles.icon, sizeClasses.icon)}
              data-size={size}
              aria-hidden
            >
              {item.icon}
            </span>
          ) : null}
          {item.label}
        </button>
      ))}
    </div>
  );
}
