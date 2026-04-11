"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

import { UIDropdown } from "@/components/ui/dropdown";

type UISelectSize = "sm" | "lg";
type ValidationState = "default" | "error" | "success";

export type UISelectOption = {
  value: string;
  label: ReactNode;
  textValue?: string;
  disabled?: boolean;
};

export type UISelectProps = {
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
  size?: UISelectSize;
  prefix?: ReactNode;
  suffix?: ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyLabel?: ReactNode;
  name?: string;
  className?: string;
  ariaLabel?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getOptionText(option: UISelectOption) {
  return (option.textValue ?? (typeof option.label === "string" ? option.label : "")).toLowerCase();
}

function filterOptions(
  options: UISelectOption[],
  searchable: boolean,
  normalizedSearch: string
) {
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

export function UISelect({
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
  size = "lg",
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
  const listboxId = `${triggerId}-listbox`;
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
  const selectedFilteredIndex = filteredOptions.findIndex(
    ({ option }) => option.value === currentValue
  );

  const sizeClasses =
    size === "sm"
      ? {
          container: "h-7 rounded-lg px-2 gap-1.5",
          icon: "h-3.5 w-3.5",
          clear: "h-5 w-5",
          text: "text-sm",
          listPadding: "p-1",
          option: "px-2 py-1.5 text-sm",
          searchInput: "h-7 text-sm",
        }
      : {
          container: "h-10 rounded-xl px-3 gap-2",
          icon: "h-4 w-4",
          clear: "h-6 w-6",
          text: "text-sm",
          listPadding: "p-1",
          option: "px-3 py-2 text-sm",
          searchInput: "h-8 text-sm",
        };

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
    optionRefs.current[index]?.focus();
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
      selectedFilteredIndex >= 0
        ? selectedFilteredIndex
        : getFirstEnabledIndex(filteredOptions)
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
        searchInputRef.current.focus();
        return;
      }

      if (activeIndex >= 0) {
        optionRefs.current[activeIndex]?.focus();
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
    return <span className="text-text-placeholder">{placeholder}</span>;
  }, [placeholder, selectedOption]);

  return (
    <div className="w-full">
      <UIDropdown
        trigger={
          <button
            id={triggerId}
            type="button"
            role="combobox"
            aria-label={ariaLabel}
            aria-autocomplete={searchable ? "list" : "none"}
            aria-expanded={open}
            disabled={disabled}
            aria-controls={listboxId}
            aria-activedescendant={
              open && activeIndex >= 0
                ? `${listboxId}-option-${filteredOptions[activeIndex]?.index ?? activeIndex}`
                : undefined
            }
            className={cx(
              "flex w-full items-center border bg-surface outline-none transition",
              "focus:ring-2 focus:ring-focus/50 focus:ring-offset-2 focus:ring-offset-bg",
              "focus:outline-none focus-visible:outline-none",
              sizeClasses.container,
              sizeClasses.text,
              disabled && "cursor-not-allowed opacity-60",
              readOnly && "bg-surface-alt",
              isInvalid && "border-danger-line",
              isSuccess && "border-primary-line",
              !isInvalid && !isSuccess && "border-line",
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
              <span className={cx("inline-flex shrink-0 items-center justify-center text-text-muted", sizeClasses.icon)}>
                {prefix}
              </span>
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
                  "inline-flex shrink-0 items-center justify-center rounded-md text-text-muted transition",
                  sizeClasses.clear,
                  canClear
                    ? "cursor-pointer opacity-100 hover:bg-surface-alt hover:text-text-main"
                    : "pointer-events-none opacity-0"
                )}
                aria-label="Clear select"
              >
                ×
              </span>
            ) : null}

            {suffix ? (
              <span className={cx("inline-flex shrink-0 items-center justify-center text-text-muted", sizeClasses.icon)}>
                {suffix}
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
        hasPopup="listbox"
        open={open}
        onOpenChange={(nextOpen) => {
          if (disabled || readOnly) {
            return;
          }
          setOpen(nextOpen);
          if (nextOpen) {
            const nextIndex =
              selectedFilteredIndex >= 0
                ? selectedFilteredIndex
                : getFirstEnabledIndex(filteredOptions);
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
          className={cx(
            "min-w-44 rounded-xl border border-line bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
            sizeClasses.listPadding
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
              for (let i = filteredOptions.length - 1; i >= 0; i -= 1) {
                if (!filteredOptions[i]?.option.disabled) {
                  focusOption(i);
                  break;
                }
              }
              return;
            }
            if (event.key === "Enter") {
              event.preventDefault();
              if (activeIndex >= 0 && !filteredOptions[activeIndex]?.option.disabled) {
                commitValue(filteredOptions[activeIndex].option.value);
                closeDropdown();
              }
              return;
            }
            if (event.key === "Escape") {
              event.preventDefault();
              closeDropdown();
              return;
            }
            if (event.key.length === 1 && /\S/.test(event.key)) {
              handleTypeahead(event.key);
            }
          }}
        >
          {searchable ? (
            <div className="px-1 pb-1">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  const nextFiltered = filterOptions(
                    options,
                    searchable,
                    nextQuery.trim().toLowerCase()
                  );
                  const nextSelectedIndex = nextFiltered.findIndex(
                    ({ option }) => option.value === currentValue
                  );
                  setSearchQuery(nextQuery);
                  setActiveIndex(
                    nextSelectedIndex >= 0
                      ? nextSelectedIndex
                      : getFirstEnabledIndex(nextFiltered)
                  );
                }}
                placeholder={searchPlaceholder}
                className={cx(
                  "w-full rounded-lg border border-line bg-surface px-2 text-text-main outline-none placeholder:text-text-placeholder",
                  "focus:ring-2 focus:ring-focus/50 focus:ring-offset-2 focus:ring-offset-surface",
                  sizeClasses.searchInput
                )}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    moveSelection(1);
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    moveSelection(-1);
                  }
                }}
              />
            </div>
          ) : null}
          {filteredOptions.length === 0 ? (
            <div className={cx("px-3 py-2 text-sm text-text-muted", sizeClasses.option)}>
              {emptyLabel}
            </div>
          ) : null}
          {filteredOptions.map(({ option, index: optionIndex }, index) => {
            const selected = option.value === currentValue;
            const active = index === activeIndex;
            return (
              <button
                key={option.value}
                id={`${listboxId}-option-${optionIndex}`}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={active ? 0 : -1}
                disabled={option.disabled}
                onMouseEnter={() => {
                  if (!option.disabled) {
                    setActiveIndex(index);
                  }
                }}
                onFocus={() => {
                  if (!option.disabled) {
                    setActiveIndex(index);
                  }
                }}
                onClick={() => {
                  if (option.disabled) {
                    return;
                  }
                  commitValue(option.value);
                  closeDropdown();
                }}
                className={cx(
                  "flex w-full items-center rounded-lg text-left transition outline-none",
                  sizeClasses.option,
                  "focus:ring-2 focus:ring-focus/50 focus:ring-offset-2 focus:ring-offset-surface",
                  option.disabled
                    ? "cursor-not-allowed text-text-placeholder opacity-60"
                    : selected
                      ? "bg-surface-alt text-text-main"
                      : "text-text-main hover:bg-surface-alt",
                  active && !option.disabled && "bg-surface-alt"
                )}
              >
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      </UIDropdown>
      {name ? <input type="hidden" name={name} value={currentValue} /> : null}
    </div>
  );
}
