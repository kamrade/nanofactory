"use client";

import type { ReactNode } from "react";

import { cx } from "@/lib/cn";

type EditorFieldRowProps = {
  label: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  controlClassName?: string;
};

export function EditorFieldRow({
  label,
  htmlFor,
  children,
  className,
  labelClassName,
  controlClassName,
}: EditorFieldRowProps) {
  return (
    <div className={cx("grid gap-1.5 md:flex md:items-start md:gap-4", className)}>
      <label
        htmlFor={htmlFor}
        className={cx(
          "pt-1 text-sm font-medium text-text-main md:w-44 md:shrink-0",
          labelClassName
        )}
      >
        {label}
      </label>
      <div className={cx("min-w-0 flex-1", controlClassName)}>{children}</div>
    </div>
  );
}
