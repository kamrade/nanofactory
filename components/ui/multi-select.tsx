"use client";

import { useMemo, useState } from "react";

import { UIDropdown } from "@/components/ui/dropdown";
import {
  UIMultiSelectList,
  type UIMultiSelectListOption,
} from "@/components/ui/multi-select-list";

type UIMultiSelectSize = "sm" | "lg";
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
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyLabel?: string;
  clearable?: boolean;
  name?: string;
  ariaLabel?: string;
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

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
  searchable = false,
  searchPlaceholder = "Search...",
  emptyLabel = "No options",
  clearable = false,
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

  const sizeClasses =
    size === "sm"
      ? {
          container: "h-7 rounded-lg px-2 gap-1.5",
          icon: "h-3.5 w-3.5",
          clear: "h-5 w-5",
          text: "text-sm",
        }
      : {
          container: "h-10 rounded-xl px-3 gap-2",
          icon: "h-4 w-4",
          clear: "h-6 w-6",
          text: "text-sm",
        };

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
    const selectedLabels = currentValue
      .map((item) => labelMap.get(item))
      .filter(Boolean);

    if (selectedLabels.length <= 2 && selectedLabels.every((item) => typeof item === "string")) {
      return selectedLabels.join(", ");
    }

    return `${currentValue.length} selected`;
  }, [currentValue, options, placeholder]);

  const canClear = clearable && !disabled && !readOnly && currentValue.length > 0;

  return (
    <div className={cx("w-full", className)}>
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
        className="w-[min(100vw-2rem,26rem)]"
        trigger={
          <button
            type="button"
            disabled={disabled}
            className={cx(
              "flex w-full items-center border outline-none transition",
              "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg",
              "focus:outline-none focus-visible:outline-none",
              sizeClasses.container,
              sizeClasses.text,
              disabled && "cursor-not-allowed opacity-60",
              isInvalid
                ? "border-danger-line bg-danger-100"
                : isSuccess
                  ? "border-primary-line bg-surface"
                  : "border-line bg-surface",
              !isInvalid && readOnly && "bg-surface-alt"
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
                  "inline-flex shrink-0 items-center justify-center rounded-md text-text-muted transition",
                  sizeClasses.clear,
                  canClear
                    ? "cursor-pointer opacity-100 hover:bg-surface-alt hover:text-text-main"
                    : "pointer-events-none opacity-0"
                )}
                aria-label="Clear selected options"
              >
                ×
              </span>
            ) : null}

            <span
              aria-hidden
              className={cx(
                "inline-flex shrink-0 items-center justify-center text-text-muted transition-transform",
                sizeClasses.icon,
                open && "rotate-180"
              )}
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
          className="rounded-xl bg-surface p-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
        />
      </UIDropdown>
      {name ? currentValue.map((item) => <input key={item} type="hidden" name={name} value={item} />) : null}
    </div>
  );
}
