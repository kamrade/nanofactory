"use client";

import { useContext, type ReactNode } from "react";

import { cx } from "@/lib/cn";

import { MenuContext } from "../menu-context";
import type { UIMenuSize } from "../menu-size";
import styles from "./index.module.css";

const labelSizeClassName: Record<UIMenuSize, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

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
  const sizeClassName = labelSizeClassName[resolvedSize];

  return (
    <div data-size={resolvedSize} className={cx(styles.label, sizeClassName, className)}>
      {children}
    </div>
  );
}
