"use client";

import { cx } from "@/lib/cn";

import styles from "./index.module.css";

export function UIMenuSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cx(styles.separator, className)} />;
}
