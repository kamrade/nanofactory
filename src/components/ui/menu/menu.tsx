"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from "react";
import type { Placement } from "@floating-ui/react";

import { UIDropdown } from "@/components/ui/dropdown";
import { cx } from "@/lib/cn";

import { MenuContext } from "./menu-context";
import { UIMenuList, type UIMenuItem as UIMenuDataItem } from "./list";
import { menuRadiusStyles, resolveMenuBorderRadiusValue, type UIMenuBorderRadius } from "./menu-radius";
import type { UIMenuSize } from "./menu-size";
import styles from "./menu.module.css";

export type { UIMenuDataItem };
export type { UIMenuBorderRadius } from "./menu-radius";

type UIMenuCommonProps = {
  trigger: ReactElement;
  placement?: Placement;
  offsetPx?: number;
  size?: UIMenuSize;
  borderRadius?: UIMenuBorderRadius;
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

export function UIMenu(allProps: UIMenuProps) {
  const {
    trigger,
    placement = "bottom-end",
    offsetPx = 8,
    size = "lg",
    borderRadius = "lg",
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
    const currentIndex = items.findIndex((item) => item.dataset.menuItemId === manualActiveItemId);

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

    const currentIndex = items.findIndex((item) => item.dataset.menuItemId === manualActiveItemId);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
      focusManualItem(items[nextIndex]);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
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
        borderRadius={borderRadius}
        ariaLabel={ariaLabel}
        className={cx(styles.shadow, className)}
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
          borderRadius,
        }}
      >
        <div
          ref={manualContainerRef}
          role="menu"
          aria-label={ariaLabel}
          data-border-radius={borderRadius}
          onKeyDown={handleManualKeyDown}
          className={cx(styles.surface, styles.shadow, className)}
          style={{ ...menuRadiusStyles[borderRadius], borderRadius: resolveMenuBorderRadiusValue(borderRadius) }}
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
