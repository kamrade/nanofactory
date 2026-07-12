"use client";

import { useId, useMemo, useState, type ReactNode } from "react";

import { UIDropdown } from "@/components/ui/dropdown";
import { cx } from "@/lib/cn";

import styles from "./autocomplete.module.css";

type UIAutocompleteSize = "sm" | "md" | "lg";
type UIAutocompleteBorderRadius = "none" | "md" | "lg";
type ValidationState = "default" | "error" | "success";

export type UIAutocompleteItem = {
  value: string;
  label: ReactNode;
  textValue?: string;
  disabled?: boolean;
};

export type UIAutocompleteProps = {
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items: UIAutocompleteItem[];
  onSelect?: (item: UIAutocompleteItem) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  loading?: boolean;
  invalid?: boolean;
  validationState?: ValidationState;
  borderless?: boolean;
  size?: UIAutocompleteSize;
  borderRadius?: UIAutocompleteBorderRadius;
  emptyLabel?: ReactNode;
  ariaLabel?: string;
  className?: string;
  name?: string;
};

function getItemText(item: UIAutocompleteItem) {
  return item.textValue ?? (typeof item.label === "string" ? item.label : item.value);
}

function getFirstEnabledIndex<T extends { disabled?: boolean }>(items: T[]) {
  return items.findIndex((item) => !item.disabled);
}

function getLastEnabledIndex<T extends { disabled?: boolean }>(items: T[]) {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (!items[i]?.disabled) {
      return i;
    }
  }
  return -1;
}

function findNextEnabledIndex<T extends { disabled?: boolean }>(
  items: T[],
  startIndex: number,
  direction: 1 | -1
) {
  if (items.length === 0) {
    return -1;
  }
  for (let step = 1; step <= items.length; step += 1) {
    const index = (startIndex + direction * step + items.length) % items.length;
    if (!items[index]?.disabled) {
      return index;
    }
  }
  return -1;
}

const sizeClassName = {
  sm: {
    trigger: styles.triggerSm,
    triggerPadding: styles.triggerPaddingSm,
    text: styles.triggerTextSm,
    gap: styles.triggerGapSm,
    icon: styles.triggerIconSm,
    clear: styles.clearSm,
    option: styles.optionSm,
  },
  md: {
    trigger: styles.triggerMd,
    triggerPadding: styles.triggerPaddingMd,
    text: styles.triggerTextSm,
    gap: styles.triggerGapMd,
    icon: styles.triggerIconMd,
    clear: styles.clearMd,
    option: styles.optionMd,
  },
  lg: {
    trigger: styles.triggerLg,
    triggerPadding: styles.triggerPaddingLg,
    text: styles.triggerTextLg,
    gap: styles.triggerGapMd,
    icon: styles.triggerIconLg,
    clear: styles.clearLg,
    option: styles.optionLg,
  },
} as const;

const radiusClassName = {
  none: styles.triggerRadiusNone,
  md: styles.triggerRadiusMd,
  lg: styles.triggerRadiusLg,
} as const;

export function UIAutocomplete({
  id,
  value,
  defaultValue,
  onValueChange,
  items,
  onSelect,
  placeholder = "Search...",
  disabled,
  readOnly,
  clearable = false,
  loading = false,
  invalid = false,
  validationState = "default",
  borderless = false,
  size = "lg",
  borderRadius = "lg",
  emptyLabel = "No results",
  ariaLabel = "Autocomplete",
  className,
  name,
}: UIAutocompleteProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputId = useId();
  const resolvedInputId = id ?? inputId;
  const listboxId = `${resolvedInputId}-listbox`;

  const currentValue = isControlled ? String(value ?? "") : uncontrolledValue;
  const normalizedValue = currentValue.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    if (normalizedValue.length === 0) {
      return items;
    }
    return items.filter((item) => getItemText(item).toLowerCase().includes(normalizedValue));
  }, [items, normalizedValue]);

  const isInvalid = invalid || validationState === "error";
  const isSuccess = !isInvalid && validationState === "success";
  const canClear = clearable && !disabled && !readOnly && currentValue.length > 0;

  function commitValue(nextValue: string) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  function handleSelect(item: UIAutocompleteItem) {
    if (item.disabled) {
      return;
    }
    commitValue(getItemText(item));
    onSelect?.(item);
    setOpen(false);
    setActiveIndex(-1);
  }

  function moveSelection(direction: 1 | -1) {
    const baseIndex = activeIndex >= 0 ? activeIndex : getFirstEnabledIndex(filteredItems);
    if (baseIndex < 0) {
      return;
    }
    const nextIndex = findNextEnabledIndex(filteredItems, baseIndex, direction);
    if (nextIndex >= 0) {
      setActiveIndex(nextIndex);
    }
  }

  return (
    <div className={styles.root}>
      <UIDropdown
        trigger={
          <div
            data-size={size}
            data-border-radius={borderRadius}
            data-borderless={borderless ? "true" : undefined}
            data-invalid={isInvalid ? "true" : undefined}
            className={cx(
              styles.trigger,
              borderless ? styles.triggerBorderless : styles.triggerBordered,
              sizeClassName[size].trigger,
              sizeClassName[size].triggerPadding,
              sizeClassName[size].gap,
              radiusClassName[borderRadius],
              disabled && styles.triggerDisabled,
              borderless
                ? styles.triggerDefault
                : isInvalid
                  ? styles.triggerInvalid
                  : isSuccess
                    ? styles.triggerSuccess
                    : styles.triggerDefault,
              !isInvalid && readOnly && styles.triggerReadOnly,
              className
            )}
          >
            <input
              id={resolvedInputId}
              name={name}
              type="text"
              role="combobox"
              aria-label={ariaLabel}
              aria-invalid={isInvalid || undefined}
              aria-expanded={open}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={
                open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
              }
              value={currentValue}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              onFocus={() => {
                if (disabled || readOnly) {
                  return;
                }
                setOpen(true);
                setActiveIndex(getFirstEnabledIndex(filteredItems));
              }}
              onChange={(event) => {
                const nextValue = event.target.value;
                commitValue(nextValue);
                if (disabled || readOnly) {
                  return;
                }
                setOpen(true);
                const nextFiltered = items.filter((item) =>
                  getItemText(item).toLowerCase().includes(nextValue.trim().toLowerCase())
                );
                setActiveIndex(getFirstEnabledIndex(nextFiltered));
              }}
              onKeyDown={(event) => {
                if (disabled || readOnly) {
                  return;
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  if (!open) {
                    setOpen(true);
                    setActiveIndex(getFirstEnabledIndex(filteredItems));
                  } else {
                    moveSelection(1);
                  }
                  return;
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  if (!open) {
                    setOpen(true);
                    setActiveIndex(getLastEnabledIndex(filteredItems));
                  } else {
                    moveSelection(-1);
                  }
                  return;
                }

                if (event.key === "Home" && open) {
                  event.preventDefault();
                  setActiveIndex(getFirstEnabledIndex(filteredItems));
                  return;
                }

                if (event.key === "End" && open) {
                  event.preventDefault();
                  setActiveIndex(getLastEnabledIndex(filteredItems));
                  return;
                }

                if (event.key === "Enter") {
                  if (!open) {
                    return;
                  }
                  event.preventDefault();
                  if (activeIndex >= 0 && !filteredItems[activeIndex]?.disabled) {
                    handleSelect(filteredItems[activeIndex]);
                  }
                  return;
                }

                if (event.key === "Escape") {
                  if (open) {
                    event.preventDefault();
                    setOpen(false);
                    setActiveIndex(-1);
                  }
                  return;
                }

                if (event.key === "Tab") {
                  setOpen(false);
                }
              }}
              className={cx(
                styles.option,
                sizeClassName[size].text,
                "min-w-0 flex-1 truncate bg-transparent text-left text-text-main outline-none",
                disabled && "cursor-not-allowed"
              )}
            />

            {loading ? (
              <span
                aria-hidden
                className={cx(
                  "shrink-0 animate-spin rounded-full border-2 border-line border-t-primary-200",
                  sizeClassName[size].icon
                )}
              />
            ) : null}

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
                  commitValue("");
                  setOpen(true);
                  setActiveIndex(getFirstEnabledIndex(items));
                }}
                className={cx(
                  styles.clearButton,
                  sizeClassName[size].clear,
                  canClear ? undefined : styles.clearButtonHidden
                )}
                aria-label="Clear autocomplete"
              >
                ×
              </span>
            ) : null}
          </div>
        }
        hasPopup="listbox"
        disableClick
        open={open}
        onOpenChange={(nextOpen) => {
          if (disabled || readOnly) {
            return;
          }
          setOpen(nextOpen);
          if (!nextOpen) {
            setActiveIndex(-1);
          }
        }}
        placement="bottom-start"
        offsetPx={6}
        ariaLabel={ariaLabel}
      >
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          data-borderless={borderless ? "true" : undefined}
          data-invalid={isInvalid ? "true" : undefined}
          data-size={size}
          data-border-radius={borderRadius}
          className={cx(
            styles.listbox,
            radiusClassName[borderRadius],
            sizeClassName[size].option,
            styles.listPadding,
            !borderless && styles.listBordered
          )}
        >
          {filteredItems.length === 0 ? (
            <div className="px-3 py-2 text-sm text-text-muted">{emptyLabel}</div>
          ) : null}
          {filteredItems.map((item, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={item.value}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={active}
                tabIndex={-1}
                disabled={item.disabled}
                onMouseEnter={() => {
                  if (!item.disabled) {
                    setActiveIndex(index);
                  }
                }}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(item)}
                data-size={size}
                data-border-radius={borderRadius}
                className={cx(
                  styles.option,
                  sizeClassName[size].option,
                  radiusClassName[borderRadius],
                  item.disabled
                    ? styles.optionDisabled
                    : styles.optionHover,
                  active && !item.disabled && styles.optionActive
                )}
              >
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </UIDropdown>
    </div>
  );
}
