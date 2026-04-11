import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

export type UICheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  label?: ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function UICheckbox({
  id,
  className,
  label,
  disabled,
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
      <span
        className={cx(
          "inline-flex shrink-0 items-center justify-center border transition",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg",
          "h-5 w-5 rounded-lg",
          "border-neutral-line bg-surface text-transparent peer-checked:border-text-main peer-checked:bg-text-main peer-checked:text-text-inverted-main"
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 16 16"
          className="h-3 w-3 transition"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 8.5L6.6 11.4L12.5 5.5" />
        </svg>
      </span>
      {label ? <span className="text-sm">{label}</span> : null}
    </label>
  );
}
