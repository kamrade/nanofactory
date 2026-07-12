import type { KeyboardEvent, ReactNode } from "react";

import { cx } from "@/lib/cn";

export type UISegmentedControlSize = "sm" | "md" | "lg";
export type UISegmentedControlBorderRadius = "none" | "md" | "lg";

type UISegmentedControlOption<T extends string> = {
  value: T;
  label: ReactNode;
  disabled?: boolean;
};

export type UISegmentedControlProps<T extends string> = {
  value: T;
  options: UISegmentedControlOption<T>[];
  onValueChange?: (value: T) => void;
  size?: UISegmentedControlSize;
  borderRadius?: UISegmentedControlBorderRadius;
  borderless?: boolean;
  ariaLabel?: string;
  className?: string;
};

const sizeClasses = {
  sm: {
    group: "h-7 p-0.5",
    item: "px-2.5 text-sm leading-5",
  },
  md: {
    group: "h-10 p-1",
    item: "px-3.5 text-sm leading-5",
  },
  lg: {
    group: "h-14 p-1.5",
    item: "px-4 text-base leading-6",
  },
} as const;

const borderRadiusClassName = {
  none: "rounded-none",
  md: "rounded-lg",
  lg: "rounded-xl",
} as const;

export function UISegmentedControl<T extends string>({
  value,
  options,
  onValueChange,
  size = "sm",
  borderRadius = "lg",
  borderless = false,
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
      className={cx(
        "inline-flex items-stretch gap-1",
        borderless ? "bg-transparent" : "border border-line bg-surface",
        sizeClasses[size].group,
        borderRadiusClassName[borderRadius],
        className
      )}
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
              "inline-flex h-full items-center justify-center font-medium transition outline-none",
              sizeClasses[size].item,
              borderRadiusClassName[borderRadius],
              !borderless && "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg",
              !borderless &&
                "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-0 focus:ring-offset-bg",
              option.disabled && "cursor-not-allowed opacity-50",
              active
                ? borderless
                  ? "border border-transparent bg-neutral-100 text-text-main"
                  : "border border-transparent bg-surface-alt text-text-main"
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
