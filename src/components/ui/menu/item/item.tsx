"use client";

import { useContext, useId, type MouseEvent, type ReactNode } from "react";

import { MenuContext } from "../menu-context";
import { MenuItemView } from "../item-view";
import type { UIMenuBorderRadius } from "../menu-radius";
import type { UIMenuSize } from "../menu-size";

export type UIMenuItemProps = {
  children: ReactNode;
  icon?: ReactNode;
  textValue?: string;
  tone?: "default" | "danger";
  size?: UIMenuSize;
  borderRadius?: UIMenuBorderRadius;
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
  borderRadius,
  disabled,
  closeOnSelect = true,
  className,
  onSelect,
}: UIMenuItemProps) {
  const id = useId();
  const {
    requestClose,
    activeItemId,
    setActiveItemId,
    size: contextSize,
    borderRadius: contextBorderRadius,
  } = useContext(MenuContext);
  const resolvedSize = size ?? contextSize;
  const resolvedBorderRadius = borderRadius ?? contextBorderRadius;

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
    <MenuItemView
      data-component="UIMenuItem"
      role="menuitem"
      data-menu-item="true"
      data-menu-item-id={id}
      data-menu-text={menuText}
      data-size={resolvedSize}
      data-tone={tone}
      tabIndex={activeItemId ? (activeItemId === id ? 0 : -1) : 0}
      onFocus={() => setActiveItemId(id)}
      onMouseEnter={() => {
        if (!disabled) {
          setActiveItemId(id);
        }
      }}
      onClick={handleClick}
      disabled={disabled}
      size={resolvedSize}
      borderRadius={resolvedBorderRadius}
      tone={tone}
      icon={icon}
      className={className}
    >
      {children}
    </MenuItemView>
  );
}
