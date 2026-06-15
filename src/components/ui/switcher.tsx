import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cn";


export type UISwitcherProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  size?: "sm" | "lg";
};

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
          "inline-flex shrink-0 items-center rounded-full border p-[3px] transition",
          "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-0 focus-visible:ring-offset-bg",
          size === "sm" ? "h-[18px] w-[28px]" : "h-[22px] w-[36px]",
          checked ? "border-transparent bg-primary-100" : "border-neutral-line bg-surface"
        )}
        aria-hidden
      >
        <span
          className={cx(
            "rounded-full transition-transform",
            size === "sm" ? "h-3 w-3" : "h-4 w-4",
            checked ? "bg-text-inverted-main" : "bg-text-main",
            checked && (size === "sm" ? "translate-x-2" : "translate-x-3")
          )}
        />
      </span>
      {label ? <span className="text-sm">{label}</span> : null}
    </button>
  );
}
