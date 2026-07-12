"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

import { UIDropdown } from "@/components/ui/dropdown";
import { cx } from "@/lib/cn";

import styles from "./select.module.css";

type UISelectSize = "sm" | "md" | "lg";
type UISelectBorderRadius = "none" | "md" | "lg";
type ValidationState = "default" | "error" | "success";

export type UISelectOption = {
  value: string;
  label: ReactNode;
  textValue?: string;
  disabled?: boolean;
};

export type UISelectProps = {
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: UISelectOption[];
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  invalid?: boolean;
  validationState?: ValidationState;
  borderless?: boolean;
  size?: UISelectSize;
  borderRadius?: UISelectBorderRadius;
  prefix?: ReactNode;
  suffix?: ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyLabel?: ReactNode;
  name?: string;
  className?: string;
  ariaLabel?: string;
};

function getOptionText(option: UISelectOption) {
  return (option.textValue ?? (typeof option.label === "string" ? option.label : "")).toLowerCase();
}

function filterOptions(options: UISelectOption[], searchable: boolean, normalizedSearch: string) {
  if (!searchable || normalizedSearch.length === 0) {
    return options.map((option, index) => ({ option, index, disabled: option.disabled }));
  }

  return options
    .map((option, index) => ({ option, index, disabled: option.disabled }))
    .filter(({ option }) => getOptionText(option).includes(normalizedSearch));
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

function getFirstEnabledIndex<T extends { disabled?: boolean }>(options: T[]) {
  return options.findIndex((option) => !option.disabled);
}

function focusWithoutScroll(element: HTMLElement | null | undefined) {
  element?.focus({ preventScroll: true });
}

const sizeClassName = {
  sm: {
    trigger: styles.triggerSm,
    triggerPadding: styles.triggerPaddingSm,
    text: styles.triggerTextSm,
    gap: styles.triggerGapSm,
    icon: styles.triggerIconSm,
    clear: styles.clearSm,
    list: styles.optionSm,
  },
  md: {
    trigger: styles.triggerMd,
    triggerPadding: styles.triggerPaddingMd,
    text: styles.triggerTextSm,
    gap: styles.triggerGapMd,
    icon: styles.triggerIconMd,
    clear: styles.clearMd,
    list: styles.optionMd,
  },
  lg: {
    trigger: styles.triggerLg,
    triggerPadding: styles.triggerPaddingLg,
    text: styles.triggerTextLg,
    gap: styles.triggerGapMd,
    icon: styles.triggerIconLg,
    clear: styles.clearLg,
    list: styles.optionLg,
  },
} as const;

const radiusClassName = {
  none: styles.triggerRadiusNone,
  md: styles.triggerRadiusMd,
  lg: styles.triggerRadiusLg,
} as const;

export function UISelect({
  id,
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select an option",
  disabled,
  readOnly,
  clearable = false,
  invalid = false,
  validationState = "default",
  borderless = false,
  size = "lg",
  borderRadius = "lg",
  prefix,
  suffix,
  searchable = false,
  searchPlaceholder = "Search...",
  emptyLabel = "No options",
  name,
  className,
  ariaLabel = "Select",
}: UISelectProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const triggerId = useId();
  const resolvedTriggerId = id ?? triggerId;
  const listboxId = `${resolvedTriggerId}-listbox`;
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const typeaheadBufferRef = useRef("");
  const typeaheadTimerRef = useRef<number | null>(null);

  const currentValue = isControlled ? String(value ?? "") : uncontrolledValue;
  const selectedIndex = options.findIndex((option) => option.value === currentValue);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;
  const isInvalid = invalid || validationState === "error";
  const isSuccess = !isInvalid && validationState === "success";
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredOptions = useMemo(
    () => filterOptions(options, searchable, normalizedSearch),
    [normalizedSearch, options, searchable]
  );
  const selectedFilteredIndex = filteredOptions.findIndex(({ option }) => option.value === currentValue);

  const canClear = clearable && !disabled && !readOnly && selectedOption;

  function commitValue(nextValue: string) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  function clearValue() {
    commitValue("");
  }

  function focusOption(index: number) {
    if (index < 0) {
      return;
    }
    setActiveIndex(index);
    focusWithoutScroll(optionRefs.current[index]);
  }

  function openDropdown(initialIndex?: number) {
    if (disabled || readOnly) {
      return;
    }
    setOpen(true);
    if (typeof initialIndex === "number") {
      setActiveIndex(initialIndex);
      return;
    }
    setActiveIndex(
      selectedFilteredIndex >= 0 ? selectedFilteredIndex : getFirstEnabledIndex(filteredOptions)
    );
  }

  function closeDropdown() {
    setOpen(false);
    setSearchQuery("");
    setActiveIndex(-1);
  }

  function getLastEnabledIndex(source: Array<{ disabled?: boolean }>) {
    for (let i = source.length - 1; i >= 0; i -= 1) {
      if (!source[i]?.disabled) {
        return i;
      }
    }
    return -1;
  }

  function moveSelection(direction: 1 | -1) {
    const baseIndex =
      activeIndex >= 0
        ? activeIndex
        : selectedFilteredIndex >= 0
          ? selectedFilteredIndex
          : getFirstEnabledIndex(filteredOptions);
    if (baseIndex < 0) {
      return;
    }
    const nextIndex = findNextEnabledIndex(filteredOptions, baseIndex, direction);
    if (nextIndex >= 0) {
      focusOption(nextIndex);
    }
  }

  function handleTypeahead(key: string) {
    typeaheadBufferRef.current += key.toLowerCase();
    if (typeaheadTimerRef.current) {
      window.clearTimeout(typeaheadTimerRef.current);
    }
    typeaheadTimerRef.current = window.setTimeout(() => {
      typeaheadBufferRef.current = "";
      typeaheadTimerRef.current = null;
    }, 350);

    const buffer = typeaheadBufferRef.current;
    const source = open ? filteredOptions : options.map((option, index) => ({ option, index }));
    const startIndex = open
      ? activeIndex >= 0
        ? activeIndex
        : selectedFilteredIndex
      : selectedIndex;

    for (let step = 1; step <= source.length; step += 1) {
      const index = (Math.max(startIndex, -1) + step) % source.length;
      const option = source[index]?.option;
      if (!option || option.disabled) {
        continue;
      }
      const text = getOptionText(option);
      if (text.startsWith(buffer)) {
        if (open) {
          focusOption(index);
        } else {
          commitValue(option.value);
        }
        return;
      }
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (searchable && searchInputRef.current) {
        focusWithoutScroll(searchInputRef.current);
        return;
      }

      if (activeIndex >= 0) {
        focusWithoutScroll(optionRefs.current[activeIndex]);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, open, searchable]);

  useEffect(() => {
    return () => {
      if (typeaheadTimerRef.current) {
        window.clearTimeout(typeaheadTimerRef.current);
      }
    };
  }, []);

  const triggerLabel = useMemo(() => {
    if (selectedOption) {
      return selectedOption.label;
    }
    return <span className={styles.placeholder}>{placeholder}</span>;
  }, [placeholder, selectedOption]);

  return (
    <div className={styles.root}>
      <UIDropdown
        trigger={
          <button
            id={resolvedTriggerId}
            type="button"
            role="combobox"
            aria-label={ariaLabel}
            aria-invalid={isInvalid || undefined}
            aria-autocomplete={searchable ? "list" : "none"}
            aria-expanded={open}
            disabled={disabled}
            aria-controls={listboxId}
            aria-activedescendant={
              open && activeIndex >= 0
                ? `${listboxId}-option-${filteredOptions[activeIndex]?.index ?? activeIndex}`
                : undefined
            }
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
            onKeyDown={(event) => {
              if (disabled || readOnly) {
                return;
              }

              if (event.key === "ArrowDown") {
                event.preventDefault();
                if (!open) {
                  openDropdown(selectedFilteredIndex >= 0 ? selectedFilteredIndex : getFirstEnabledIndex(filteredOptions));
                } else {
                  moveSelection(1);
                }
                return;
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                if (!open) {
                  openDropdown(selectedFilteredIndex >= 0 ? selectedFilteredIndex : getLastEnabledIndex(filteredOptions));
                } else {
                  moveSelection(-1);
                }
                return;
              }

              if (event.key === "Home" && open) {
                event.preventDefault();
                focusOption(getFirstEnabledIndex(filteredOptions));
                return;
              }

              if (event.key === "End" && open) {
                event.preventDefault();
                focusOption(getLastEnabledIndex(filteredOptions));
                return;
              }

              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!open) {
                  openDropdown();
                } else if (activeIndex >= 0 && !filteredOptions[activeIndex]?.option.disabled) {
                  commitValue(filteredOptions[activeIndex].option.value);
                  closeDropdown();
                }
                return;
              }

              if (event.key === "Escape") {
                if (open) {
                  event.preventDefault();
                  closeDropdown();
                }
                return;
              }

              if (event.key.length === 1 && /\S/.test(event.key)) {
                handleTypeahead(event.key);
              }
            }}
          >
            {prefix ? (
              <span className={cx(styles.icon, sizeClassName[size].icon)}>{prefix}</span>
            ) : null}

            <span className="min-w-0 flex-1 truncate text-left">{triggerLabel}</span>

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
                  clearValue();
                }}
                onKeyDown={(event) => {
                  if (!canClear) {
                    return;
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    clearValue();
                  }
                }}
                className={cx(
                  styles.icon,
                  sizeClassName[size].clear,
                  canClear ? undefined : styles.clearButtonHidden
                )}
                aria-label="Clear select"
              >
                ×
              </span>
            ) : null}

            {suffix ? (
              <span className={cx(styles.icon, sizeClassName[size].icon)}>{suffix}</span>
            ) : null}

            <span
              aria-hidden
              className={cx(styles.icon, sizeClassName[size].icon, open && styles.iconRotated)}
            >
              ▾
            </span>
          </button>
        }
        hasPopup="listbox"
        open={open}
        onOpenChange={(nextOpen) => {
          if (disabled || readOnly) {
            return;
          }
          setOpen(nextOpen);
          if (nextOpen) {
            const nextIndex =
              selectedFilteredIndex >= 0 ? selectedFilteredIndex : getFirstEnabledIndex(filteredOptions);
            setActiveIndex(nextIndex);
          } else {
            setSearchQuery("");
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
            !borderless && styles.listBordered,
            styles.listPadding
          )}
          onKeyDown={(event) => {
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
              focusOption(getLastEnabledIndex(filteredOptions));
              return;
            }
            if (event.key === "Escape") {
              event.preventDefault();
              closeDropdown();
              return;
            }
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (activeIndex >= 0 && !filteredOptions[activeIndex]?.option.disabled) {
                commitValue(filteredOptions[activeIndex].option.value);
                closeDropdown();
              }
              return;
            }
            if (event.key.length === 1 && /\S/.test(event.key)) {
              handleTypeahead(event.key);
            }
          }}
        >
          {searchable ? (
            <div className={styles.listPadding}>
              <input
                ref={searchInputRef}
                type="text"
                className={cx(
                  styles.trigger,
                  styles.triggerBordered,
                  sizeClassName[size].trigger,
                  sizeClassName[size].triggerPadding,
                  sizeClassName[size].text,
                  sizeClassName[size].gap,
                  styles.triggerRadiusMd,
                  styles.triggerDefault
                )}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                value={searchQuery}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setSearchQuery(nextQuery);
                  const nextFiltered = filterOptions(options, searchable, nextQuery.trim().toLowerCase());
                  setActiveIndex(getFirstEnabledIndex(nextFiltered));
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    closeDropdown();
                  }
                }}
              />
            </div>
          ) : null}

          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-text-muted">{emptyLabel}</div>
          ) : null}

          {filteredOptions.map((option, index) => {
            const selected = option.option.value === currentValue;
            const active = index === activeIndex;
            return (
              <button
                key={option.option.value}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={disabled || option.option.disabled}
                tabIndex={active ? 0 : -1}
                onFocus={() => setActiveIndex(index)}
                onMouseEnter={() => {
                  if (!option.option.disabled && !disabled) {
                    setActiveIndex(index);
                  }
                }}
                onClick={() => {
                  if (disabled || option.option.disabled) {
                    return;
                  }
                  commitValue(option.option.value);
                  closeDropdown();
                }}
                data-size={size}
                data-border-radius={borderRadius}
                className={cx(
                  styles.option,
                  sizeClassName[size].list,
                  radiusClassName[borderRadius],
                  (disabled || option.option.disabled) && styles.optionDisabled,
                  !disabled && !option.option.disabled && styles.optionHover,
                  selected && styles.optionSelected,
                  active && !disabled && !option.option.disabled && styles.optionSelected
                )}
              >
                {option.option.label}
              </button>
            );
          })}
        </div>
      </UIDropdown>
      {name ? <input type="hidden" name={name} value={currentValue} /> : null}
    </div>
  );
}
