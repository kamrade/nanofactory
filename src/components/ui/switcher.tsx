import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cn";


export type UISwitcherSize = "sm" | "md" | "lg";

export type UISwitcherProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  size?: UISwitcherSize;
};

const sizeClasses = {
  sm: {
    track: "h-4 w-7 p-[2px]",
    thumb: "h-3 w-3",
    thumbChecked: "translate-x-3",
    label: "text-sm leading-5",
  },
  md: {
    track: "h-5 w-9 p-[2px]",
    thumb: "h-3.5 w-3.5",
    thumbChecked: "translate-x-4",
    label: "text-sm leading-5",
  },
  lg: {
    track: "h-6 w-10 p-[3px]",
    thumb: "h-4 w-4",
    thumbChecked: "translate-x-4",
    label: "text-base leading-6",
  },
} as const;

export function UISwitcher({
  checked,
  onCheckedChange,
  label,
  className,
  disabled,
  size = "lg",
  onClick,
  ...props
}: UISwitcherProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-3 text-left text-text-main transition",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) {
          return;
        }
        onCheckedChange?.(!checked);
      }}
      {...props}
    >
      <span
        className={cx(
          "inline-flex shrink-0 items-center rounded-full border transition",
          "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-0 focus-visible:ring-offset-bg",
          sizeClasses[size].track,
          checked ? "border-transparent bg-primary-100" : "border-neutral-line bg-surface"
        )}
        aria-hidden
      >
        <span
          className={cx(
            "rounded-full transition-transform",
            sizeClasses[size].thumb,
            checked ? "bg-text-inverted-main" : "bg-text-main",
            checked && sizeClasses[size].thumbChecked
          )}
        />
      </span>
      {label ? <span className={sizeClasses[size].label}>{label}</span> : null}
    </button>
  );
}
