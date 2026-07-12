"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { UICheckboxMark } from "@/components/ui/checkbox";
import { cx } from "@/lib/cn";


type ValidationState = "default" | "error" | "success";
type UIMultiSelectListSize = "sm" | "md" | "lg";
type UIMultiSelectBorderRadius = "none" | "md" | "lg";

export type UIMultiSelectListOption = {
  value: string;
  label: ReactNode;
  textValue?: string;
  disabled?: boolean;
};

export type UIMultiSelectListProps = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  options: UIMultiSelectListOption[];
  size?: UIMultiSelectListSize;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  validationState?: ValidationState;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyLabel?: ReactNode;
  ariaLabel?: string;
  className?: string;
  name?: string;
  borderRadius?: UIMultiSelectBorderRadius;
};

function getOptionText(option: UIMultiSelectListOption) {
  return (option.textValue ?? (typeof option.label === "string" ? option.label : "")).toLowerCase();
}

function getFirstEnabledIndex<T extends { disabled?: boolean }>(options: T[]) {
  return options.findIndex((option) => !option.disabled);
}

function findNextEnabledIndex<T extends { disabled?: boolean }>(
  options: T[],
  startIndex: number,
  direction: 1 | -1
) {
  if (options.length === 0) {
    return -1;
  }

  for (let step = 1; step <= options.length; step += 1) {
    const index = (startIndex + direction * step + options.length) % options.length;
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function focusWithoutScroll(element: HTMLElement | null | undefined) {
  element?.focus({ preventScroll: true });
}

export function UIMultiSelectList({
  value,
  defaultValue,
  onValueChange,
  options,
  size = "lg",
  disabled = false,
  readOnly = false,
  invalid = false,
  validationState = "default",
  searchable = false,
  searchPlaceholder = "Search...",
  emptyLabel = "No options",
  ariaLabel = "Multi select list",
  className,
  name,
  borderRadius = "lg",
}: UIMultiSelectListProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const currentValue = useMemo(
    () => (isControlled ? value ?? [] : uncontrolledValue),
    [isControlled, uncontrolledValue, value]
  );
  const selectedSet = useMemo(() => new Set(currentValue), [currentValue]);
  const isInvalid = invalid || validationState === "error";
  const isSuccess = !isInvalid && validationState === "success";
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredOptions = useMemo(() => {
    if (!searchable || normalizedSearch.length === 0) {
      return options;
    }
    return options.filter((option) => getOptionText(option).includes(normalizedSearch));
  }, [normalizedSearch, options, searchable]);

  const sizeClasses =
    size === "sm"
      ? {
          option: "min-h-7 px-2 py-1 text-sm leading-5",
          search: "h-7 px-2 text-sm leading-5",
        }
      : size === "md"
        ? {
            option: "min-h-10 px-3 py-2 text-sm leading-5",
            search: "h-10 px-3 text-sm leading-5",
          }
        : {
            option: "min-h-14 px-4 py-3 text-base leading-6",
            search: "h-14 px-4 text-base leading-6",
          };

  const radiusClassName =
    borderRadius === "none" ? "rounded-none" : borderRadius === "md" ? "rounded-lg" : "rounded-xl";

  function commitValue(nextValue: string[]) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  function toggleValue(optionValue: string) {
    if (disabled || readOnly) {
      return;
    }

    const next = selectedSet.has(optionValue)
      ? currentValue.filter((item) => item !== optionValue)
      : [...currentValue, optionValue];
    commitValue(next);
  }

  function focusOption(index: number) {
    if (index < 0 || index >= filteredOptions.length) {
      return;
    }
    setActiveIndex(index);
    focusWithoutScroll(optionRefs.current[index]);
  }

  function moveSelection(direction: 1 | -1) {
    const baseIndex = activeIndex >= 0 ? activeIndex : getFirstEnabledIndex(filteredOptions);
    if (baseIndex < 0) {
      return;
    }
    const nextIndex = findNextEnabledIndex(filteredOptions, baseIndex, direction);
    if (nextIndex >= 0) {
      focusOption(nextIndex);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled || readOnly) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusOption(getFirstEnabledIndex(filteredOptions));
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      for (let i = filteredOptions.length - 1; i >= 0; i -= 1) {
        if (!filteredOptions[i]?.disabled) {
          focusOption(i);
          break;
        }
      }
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (activeIndex >= 0 && !filteredOptions[activeIndex]?.disabled) {
        toggleValue(filteredOptions[activeIndex].value);
      }
    }
  }

  return (
    <div className={cx("grid gap-2", className)}>
      {searchable ? (
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => {
            const nextQuery = event.target.value;
            const nextNormalizedSearch = nextQuery.trim().toLowerCase();
            const nextFiltered =
              !searchable || nextNormalizedSearch.length === 0
                ? options
                : options.filter((option) => getOptionText(option).includes(nextNormalizedSearch));
            setSearchQuery(nextQuery);
            setActiveIndex(getFirstEnabledIndex(nextFiltered));
          }}
          placeholder={searchPlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          className={cx(
            "w-full border bg-surface text-text-main outline-none transition placeholder:text-text-placeholder",
            "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg",
            radiusClassName,
            sizeClasses.search,
            isInvalid
              ? "border-danger-line bg-danger-100"
              : isSuccess
                ? "border-primary-line bg-surface"
                : "border-line bg-surface"
          )}
        />
      ) : null}

      <div
        role="listbox"
        aria-label={ariaLabel}
        aria-multiselectable="true"
        tabIndex={0}
        onKeyDown={handleKeyDown}
          className={cx(
          "scrollbar-macos flex max-h-[min(24rem,calc(100vh-2rem))] w-full flex-col gap-0.5 overflow-y-auto bg-surface p-1 outline-none",
          "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg",
          radiusClassName,
          disabled && "cursor-not-allowed opacity-60",
          isInvalid
            ? "border-danger-line bg-danger-100"
            : isSuccess
              ? "border-primary-line bg-surface"
              : "border-line bg-surface"
        )}
      >
        {filteredOptions.length === 0 ? (
          <div className="px-3 py-2 text-sm text-text-muted">{emptyLabel}</div>
        ) : null}

        {filteredOptions.map((option, index) => {
          const selected = selectedSet.has(option.value);
          const active = index === activeIndex;
          return (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="option"
              aria-selected={selected}
              disabled={disabled || option.disabled}
              tabIndex={active ? 0 : -1}
              onFocus={() => setActiveIndex(index)}
              onMouseEnter={() => {
                if (!option.disabled && !disabled) {
                  setActiveIndex(index);
                }
              }}
              onClick={() => toggleValue(option.value)}
              className={cx(
                "flex w-full items-center gap-2 text-left transition outline-none",
                "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-surface",
                radiusClassName,
                sizeClasses.option,
                (disabled || option.disabled) && "cursor-not-allowed opacity-60",
                !disabled && !option.disabled && "hover:bg-surface-alt",
                selected ? "bg-surface-alt text-text-main" : "text-text-main",
                active && !disabled && !option.disabled && "bg-surface-alt"
              )}
            >
              <UICheckboxMark size={size} borderRadius={borderRadius} checked={selected} />
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
            </button>
          );
        })}
      </div>

      {name
        ? currentValue.map((item) => <input key={item} type="hidden" name={name} value={item} />)
        : null}
    </div>
  );
}
