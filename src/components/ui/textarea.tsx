"use client";

import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

import { cx } from "@/lib/cn";

type UITextAreaSize = "sm" | "lg";

export type UITextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  size?: UITextAreaSize;
  invalid?: boolean;
  borderless?: boolean;
  onValueChange?: (value: string) => void;
};

export const UITextArea = forwardRef<HTMLTextAreaElement, UITextAreaProps>(function UITextArea(
  {
    className,
    size = "lg",
    invalid = false,
    borderless = false,
    onChange,
    onValueChange,
    ...props
  },
  ref
) {
  const sizeClasses =
    size === "sm"
      ? {
          base: borderless ? "min-h-20 rounded-lg py-2" : "min-h-20 rounded-lg px-3 py-2",
          text: "text-sm",
        }
      : {
          base: borderless ? "min-h-24 rounded-xl py-3" : "min-h-24 rounded-xl px-4 py-3",
          text: "text-sm",
        };

  return (
    <textarea
      {...props}
      ref={ref}
      aria-invalid={invalid || undefined}
      onChange={(event) => {
        onValueChange?.(event.target.value);
        onChange?.(event);
      }}
      className={cx(
        "w-full bg-surface text-text-main outline-none transition placeholder:text-text-placeholder focus:ring-2 focus:ring-focus/50",
        sizeClasses.base,
        sizeClasses.text,
        borderless ? "px-0" : "border border-line",
        invalid && "border-danger-line bg-danger-100",
        className
      )}
    />
  );
});
