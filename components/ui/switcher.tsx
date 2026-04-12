import type { ButtonHTMLAttributes, ReactNode } from "react";

export type UISwitcherProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function UISwitcher({
  checked,
  onCheckedChange,
  label,
  className,
  disabled,
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
          "h-[22px] w-[34px]",
          checked ? "border-transparent bg-primary-100" : "border-neutral-line bg-surface"
        )}
        aria-hidden
      >
        <span
          className={cx(
            "rounded-full transition-transform",
            "h-4 w-4",
            checked ? "bg-text-inverted-main" : "bg-text-main",
            checked && "translate-x-3"
          )}
        />
      </span>
      {label ? <span className="text-sm">{label}</span> : null}
    </button>
  );
}
