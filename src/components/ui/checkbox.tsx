import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { cx } from "@/lib/cn";


export type UICheckboxSize = "sm" | "md" | "lg";
export type UICheckboxBorderRadius = "none" | "md" | "lg";

export type UICheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  label?: ReactNode;
  size?: UICheckboxSize;
  borderRadius?: UICheckboxBorderRadius;
};

const sizeClasses = {
  sm: {
    box: "h-4 w-4",
    icon: "h-2.5 w-2.5",
    label: "text-sm leading-5",
  },
  md: {
    box: "h-5 w-5",
    icon: "h-3 w-3",
    label: "text-sm leading-5",
  },
  lg: {
    box: "h-6 w-6",
    icon: "h-3.5 w-3.5",
    label: "text-base leading-6",
  },
} as const;

export function UICheckboxMark({
  size = "lg",
  borderRadius = "lg",
  checked = false,
  className,
}: {
  size?: UICheckboxSize;
  borderRadius?: UICheckboxBorderRadius;
  checked?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center justify-center border transition",
        sizeClasses[size].box,
        borderRadius === "none" ? "rounded-none" : borderRadius === "md" ? "rounded-[4px]" : "rounded-[6px]",
        checked ? "border-transparent bg-primary-100 text-text-inverted-main" : "border-neutral-line bg-surface text-transparent",
        "peer-checked:border-transparent peer-checked:bg-primary-100 peer-checked:text-text-inverted-main",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 16 16"
        className={cx("transition", sizeClasses[size].icon)}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 8.5L6.6 11.4L12.5 5.5" />
      </svg>
    </span>
  );
}

export function UICheckbox({
  id,
  className,
  label,
  disabled,
  size = "lg",
  borderRadius = "lg",
  ...props
}: UICheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={cx(
        "inline-flex items-center gap-3 text-text-main",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <input id={checkboxId} type="checkbox" className="peer sr-only" disabled={disabled} {...props} />
      <UICheckboxMark
        size={size}
        borderRadius={borderRadius}
        checked={Boolean(props.checked ?? props.defaultChecked)}
        className="peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-0 peer-focus-visible:ring-offset-bg"
      />
      {label ? <span className={sizeClasses[size].label}>{label}</span> : null}
    </label>
  );
}
