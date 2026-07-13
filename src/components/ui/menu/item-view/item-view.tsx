"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cx } from "@/lib/cn";

import { resolveMenuBorderRadiusValue, type UIMenuBorderRadius } from "../menu-radius";
import type { UIMenuSize } from "../menu-size";
import styles from "./index.module.css";

type MenuItemViewProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled"> & {
  children: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "danger";
  size?: UIMenuSize;
  borderRadius?: UIMenuBorderRadius;
  disabled?: boolean;
  className?: string;
};

const sizeClassName: Record<UIMenuSize, { item: string; icon: string }> = {
  sm: { item: styles.itemSm, icon: styles.iconSm },
  md: { item: styles.itemMd, icon: styles.iconMd },
  lg: { item: styles.itemLg, icon: styles.iconLg },
};

export const MenuItemView = forwardRef<HTMLButtonElement, MenuItemViewProps>(function MenuItemView(
  {
    children,
    icon,
    tone = "default",
    size = "lg",
    borderRadius = "lg",
    disabled,
    className,
    type = "button",
    ...buttonProps
  },
  ref
) {
  const resolvedSize = sizeClassName[size];

  return (
    <button
    data-component="MenuItemView"
      {...buttonProps}
      ref={ref}
      type={type}
      disabled={disabled}
      style={{ borderRadius: resolveMenuBorderRadiusValue(borderRadius) }}
      className={cx(
        styles.item,
        resolvedSize.item,
        disabled ? styles.itemDisabled : tone === "danger" ? styles.toneDanger : styles.toneDefault,
        className
      )}
    >
      {icon ? <span className={cx(styles.icon, resolvedSize.icon)} aria-hidden>{icon}</span> : null}
      {children}
    </button>
  );
});
