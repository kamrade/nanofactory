import type { KeyboardEvent, ReactNode } from "react";

import { cx } from "@/lib/cn";

import styles from "./segmented-control.module.css";

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

const sizeClassName = {
  sm: {
    group: styles.groupSm,
    item: styles.itemSm,
  },
  md: {
    group: styles.groupMd,
    item: styles.itemMd,
  },
  lg: {
    group: styles.groupLg,
    item: styles.itemLg,
  },
} as const;

const borderRadiusClassName = {
  none: styles.groupRadiusNone,
  md: styles.groupRadiusMd,
  lg: styles.groupRadiusLg,
} as const;

const itemRadiusClassName = {
  none: styles.itemRadiusNone,
  md: styles.itemRadiusMd,
  lg: styles.itemRadiusLg,
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
      data-size={size}
      data-border-radius={borderRadius}
      data-borderless={borderless ? "true" : undefined}
      className={cx(
        styles.root,
        borderless ? styles.groupBorderless : styles.groupBordered,
        sizeClassName[size].group,
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
            data-size={size}
            data-border-radius={borderRadius}
            className={cx(
              styles.item,
              sizeClassName[size].item,
              itemRadiusClassName[borderRadius],
              !borderless && "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg",
              !borderless &&
                "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-0 focus:ring-offset-bg",
              option.disabled && styles.itemDisabled,
              active
                ? borderless
                  ? styles.itemActiveBorderless
                  : styles.itemActiveBordered
                : styles.itemInactive
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
