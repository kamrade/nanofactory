import type { KeyboardEvent, ReactNode } from "react";

type UISegmentedControlOption<T extends string> = {
  value: T;
  label: ReactNode;
  disabled?: boolean;
};

export type UISegmentedControlProps<T extends string> = {
  value: T;
  options: UISegmentedControlOption<T>[];
  onValueChange?: (value: T) => void;
  ariaLabel?: string;
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function UISegmentedControl<T extends string>({
  value,
  options,
  onValueChange,
  ariaLabel = "Segmented control",
  className,
}: UISegmentedControlProps<T>) {
  function moveSelection(direction: 1 | -1) {
    const currentIndex = options.findIndex((option) => option.value === value);
    if (currentIndex < 0) {
      return;
    }

    for (let step = 1; step <= options.length; step += 1) {
      const nextIndex = (currentIndex + direction * step + options.length) % options.length;
      const next = options[nextIndex];
      if (!next.disabled) {
        onValueChange?.(next.value);
        return;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveSelection(1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveSelection(-1);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx("inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-1", className)}
      onKeyDown={handleKeyDown}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={option.disabled}
            onClick={() => {
              if (!option.disabled) {
                onValueChange?.(option.value);
              }
            }}
            className={cx(
              "inline-flex min-h-8 items-center justify-center rounded-lg px-3 text-sm font-medium transition outline-none",
              "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg",
              "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-0 focus-visible:ring-offset-bg",
              option.disabled && "cursor-not-allowed opacity-50",
              active
                ? "border border-transparent bg-surface-alt text-text-main"
                : "border border-transparent text-text-muted hover:bg-surface-alt hover:text-text-main active:bg-neutral-100"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
