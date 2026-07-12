import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "@/lib/cn";

import styles from "./switcher.module.css";

export type UISwitcherSize = "sm" | "md" | "lg";

export type UISwitcherProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  size?: UISwitcherSize;
};

const sizeClassName = {
  sm: {
    track: styles.trackSm,
    thumb: styles.thumbSm,
    thumbChecked: styles.thumbCheckedSm,
    label: styles.labelSm,
  },
  md: {
    track: styles.trackMd,
    thumb: styles.thumbMd,
    thumbChecked: styles.thumbCheckedMd,
    label: styles.labelMd,
  },
  lg: {
    track: styles.trackLg,
    thumb: styles.thumbLg,
    thumbChecked: styles.thumbCheckedLg,
    label: styles.labelLg,
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
      className={cx(styles.root, disabled && styles.rootDisabled, className)}
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
        data-size={size}
        className={cx(
          styles.track,
          checked ? styles.trackOn : styles.trackOff,
          sizeClassName[size].track
        )}
        aria-hidden
      >
        <span
          className={cx(
            styles.thumb,
            checked ? styles.thumbOn : styles.thumbOff,
            sizeClassName[size].thumb,
            checked && sizeClassName[size].thumbChecked
          )}
        />
      </span>
      {label ? <span className={sizeClassName[size].label}>{label}</span> : null}
    </button>
  );
}
