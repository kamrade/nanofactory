"use client";

import { useId, useMemo, useState, type ReactNode } from "react";

import { UIDropdown } from "@/components/ui/dropdown";
import { cx } from "@/lib/cn";


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

  const sizeClasses =
    size === "sm"
      ? {
          container: "h-7 px-2",
          borderlessContainer: "h-7",
          icon: "h-3.5 w-3.5",
          clear: "h-5 w-5",
          input: "text-sm leading-5",
          listPadding: "p-1",
          option: "min-h-7 px-2 py-1 text-sm leading-5",
          gap: "gap-1.5",
        }
      : size === "md"
        ? {
            container: "h-10 px-3",
            borderlessContainer: "h-10",
            icon: "h-4 w-4",
            clear: "h-6 w-6",
            input: "text-sm leading-5",
            listPadding: "p-1",
            option: "min-h-10 px-3 py-2 text-sm leading-5",
            gap: "gap-2",
          }
        : {
            container: "h-14 px-4",
            borderlessContainer: "h-14",
            icon: "h-4 w-4",
            clear: "h-7 w-7",
            input: "text-base leading-6",
            listPadding: "p-1",
            option: "min-h-14 px-4 py-3 text-base leading-6",
            gap: "gap-2",
          };

  const radiusClassName =
    borderRadius === "none" ? "rounded-none" : borderRadius === "md" ? "rounded-lg" : "rounded-xl";

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

  const canClear = clearable && !disabled && !readOnly && currentValue.length > 0;

  return (
    <div className="w-full">
      <UIDropdown
        trigger={
          <div
            className={cx(
              "flex w-full items-center outline-none transition",
              borderless ? sizeClasses.borderlessContainer : sizeClasses.container,
              radiusClassName,
              sizeClasses.gap,
              !borderless && "border",
              !borderless && "focus-within:ring-2 focus-within:ring-focus/50 focus-within:ring-offset-0",
              disabled && "cursor-not-allowed opacity-60",
              borderless
                ? isInvalid
                  ? "bg-danger-100"
                  : "bg-surface"
                : isInvalid
                  ? "border-danger-line bg-danger-100"
                  : isSuccess
                    ? "border-primary-line bg-surface"
                    : "border-line bg-surface",
              !isInvalid && readOnly && "bg-surface-alt",
              className
            )}
          >
            <input
              id={resolvedInputId}
              name={name}
              type="text"
              role="combobox"
              aria-label={ariaLabel}
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
                "w-full min-w-0 bg-transparent text-text-main outline-none placeholder:text-text-placeholder",
                sizeClasses.input,
                disabled && "cursor-not-allowed"
              )}
            />

            {loading ? (
              <span
                aria-hidden
                className={cx(
                  "shrink-0 animate-spin rounded-full border-2 border-line border-t-primary-200",
                  sizeClasses.icon
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
                  "inline-flex shrink-0 items-center justify-center rounded-md text-text-muted transition",
                  sizeClasses.clear,
                  canClear
                    ? "cursor-pointer opacity-100 hover:bg-surface-alt hover:text-text-main"
                    : "pointer-events-none opacity-0"
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
          className={cx(
            "flex min-w-44 flex-col gap-0.5 border border-line bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
            radiusClassName,
            sizeClasses.listPadding
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
                className={cx(
                  "flex w-full items-center text-left transition outline-none",
                  radiusClassName,
                  sizeClasses.option,
                  item.disabled
                    ? "cursor-not-allowed text-text-placeholder opacity-60"
                    : "text-text-main hover:bg-surface-alt",
                  active && !item.disabled && "bg-surface-alt"
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
