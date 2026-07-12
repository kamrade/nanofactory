"use client";

import { useMemo, useState } from "react";

import { UIDropdown } from "@/components/ui/dropdown";
import {
  UIMultiSelectList,
  type UIMultiSelectListOption,
} from "@/components/ui/multi-select-list";
import { cx } from "@/lib/cn";

import styles from "./multi-select.module.css";

type UIMultiSelectSize = "sm" | "md" | "lg";
type UIMultiSelectBorderRadius = "none" | "md" | "lg";
type ValidationState = "default" | "error" | "success";

export type UIMultiSelectProps = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  options: UIMultiSelectListOption[];
  placeholder?: string;
  size?: UIMultiSelectSize;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  validationState?: ValidationState;
  borderless?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyLabel?: string;
  clearable?: boolean;
  borderRadius?: UIMultiSelectBorderRadius;
  name?: string;
  ariaLabel?: string;
  className?: string;
};

const sizeClassName = {
  sm: {
    trigger: styles.triggerSm,
    triggerPadding: styles.triggerPaddingSm,
    text: styles.triggerTextSm,
    gap: styles.triggerGapSm,
    icon: styles.triggerIconSm,
    clear: styles.clearSm,
  },
  md: {
    trigger: styles.triggerMd,
    triggerPadding: styles.triggerPaddingMd,
    text: styles.triggerTextSm,
    gap: styles.triggerGapMd,
    icon: styles.triggerIconMd,
    clear: styles.clearMd,
  },
  lg: {
    trigger: styles.triggerLg,
    triggerPadding: styles.triggerPaddingLg,
    text: styles.triggerTextLg,
    gap: styles.triggerGapMd,
    icon: styles.triggerIconLg,
    clear: styles.clearLg,
  },
} as const;

const radiusClassName = {
  none: styles.triggerRadiusNone,
  md: styles.triggerRadiusMd,
  lg: styles.triggerRadiusLg,
} as const;

export function UIMultiSelect({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select options",
  size = "lg",
  disabled,
  readOnly,
  invalid = false,
  validationState = "default",
  borderless = false,
  searchable = false,
  searchPlaceholder = "Search...",
  emptyLabel = "No options",
  clearable = false,
  borderRadius = "lg",
  name,
  ariaLabel = "Multi select",
  className,
}: UIMultiSelectProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? []);
  const [open, setOpen] = useState(false);

  const currentValue = useMemo(
    () => (isControlled ? value ?? [] : uncontrolledValue),
    [isControlled, uncontrolledValue, value]
  );
  const isInvalid = invalid || validationState === "error";
  const isSuccess = !isInvalid && validationState === "success";

  function commitValue(nextValue: string[]) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  const selectedText = useMemo(() => {
    if (currentValue.length === 0) {
      return <span className="text-text-placeholder">{placeholder}</span>;
    }

    const labelMap = new Map(options.map((option) => [option.value, option.label]));
    const selectedLabels = currentValue.map((item) => labelMap.get(item)).filter(Boolean);

    if (selectedLabels.length <= 2 && selectedLabels.every((item) => typeof item === "string")) {
      return selectedLabels.join(", ");
    }

    return `${currentValue.length} selected`;
  }, [currentValue, options, placeholder]);

  const canClear = clearable && !disabled && !readOnly && currentValue.length > 0;

  return (
    <div className={cx(styles.root, className)}>
      <UIDropdown
        hasPopup="listbox"
        open={open}
        onOpenChange={(nextOpen) => {
          if (disabled || readOnly) {
            return;
          }
          setOpen(nextOpen);
        }}
        placement="bottom-start"
        offsetPx={6}
        ariaLabel={ariaLabel}
        className={styles.list}
        trigger={
          <button
            type="button"
            disabled={disabled}
            data-size={size}
            data-border-radius={borderRadius}
            data-borderless={borderless ? "true" : undefined}
            data-invalid={isInvalid ? "true" : undefined}
            className={cx(
              styles.trigger,
              borderless ? styles.triggerBorderless : styles.triggerBordered,
              sizeClassName[size].trigger,
              sizeClassName[size].triggerPadding,
              sizeClassName[size].text,
              sizeClassName[size].gap,
              radiusClassName[borderRadius],
              disabled && "cursor-not-allowed opacity-60",
              borderless
                ? styles.triggerDefault
                : isInvalid
                  ? styles.triggerInvalid
                  : isSuccess
                    ? styles.triggerSuccess
                    : styles.triggerDefault,
              !isInvalid && readOnly && styles.triggerReadOnly
            )}
            onKeyDown={(event) => {
              if (disabled || readOnly) {
                return;
              }
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                setOpen(true);
              }
            }}
          >
            <span className="min-w-0 flex-1 truncate text-left">{selectedText}</span>

            {clearable ? (
              <span
                role="button"
                tabIndex={canClear ? 0 : -1}
                onMouseDown={(event) => {
                  if (!canClear) {
                    return;
                  }
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  if (!canClear) {
                    return;
                  }
                  event.preventDefault();
                  event.stopPropagation();
                  commitValue([]);
                }}
                className={cx(
                  styles.clearButton,
                  sizeClassName[size].clear,
                  canClear ? undefined : styles.clearButtonHidden
                )}
                aria-label="Clear selected options"
              >
                ×
              </span>
            ) : null}

            <span
              aria-hidden
              className={cx(styles.icon, sizeClassName[size].icon, open && styles.iconRotated)}
            >
              ▾
            </span>
          </button>
        }
      >
        <UIMultiSelectList
          ariaLabel={ariaLabel}
          value={currentValue}
          onValueChange={commitValue}
          options={options}
          size={size}
          disabled={disabled}
          readOnly={readOnly}
          invalid={invalid}
          validationState={validationState}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          emptyLabel={emptyLabel}
          name={name}
          borderRadius={borderRadius}
          data-borderless={borderless ? "true" : undefined}
          data-invalid={isInvalid ? "true" : undefined}
          className={cx("bg-surface p-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)]", radiusClassName[borderRadius])}
        />
      </UIDropdown>
      {name ? currentValue.map((item) => <input key={item} type="hidden" name={name} value={item} />) : null}
    </div>
  );
}
