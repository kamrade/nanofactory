"use client";

import { useId, useState, type ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";

import { cx } from "@/lib/cn";

type UIAccordionSize = "sm" | "lg";

export type UIAccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type UIAccordionProps = {
  items: UIAccordionItem[];
  ariaLabel?: string;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  collapsible?: boolean;
  size?: UIAccordionSize;
  className?: string;
};

export function UIAccordion({
  items,
  ariaLabel = "Accordion",
  value,
  defaultValue = null,
  onValueChange,
  collapsible = true,
  size = "lg",
  className,
}: UIAccordionProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue);
  const currentValue = isControlled ? value ?? null : uncontrolledValue;
  const baseId = useId();

  function setValue(nextValue: string | null) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  return (
    <div
      className={cx(
        "overflow-hidden rounded-[1.25rem] border border-line bg-surface",
        className
      )}
    >
      <div role="region" aria-label={ariaLabel} className="divide-y divide-line">
        {items.map((item) => {
          const panelId = `${baseId}-${item.id}-panel`;
          const triggerId = `${baseId}-${item.id}-trigger`;
          const open = currentValue === item.id;

          return (
            <div
              key={item.id}
              className={cx(
                "transition-colors",
                open ? "bg-neutral-100" : "bg-surface"
              )}
            >
              <button
                id={triggerId}
                type="button"
                disabled={item.disabled}
                aria-expanded={open}
                aria-controls={panelId}
                className={cx(
                  "group flex w-full items-start justify-between gap-4 text-left transition outline-none",
                  "focus-visible:bg-surface-alt focus-visible:shadow-[inset_0_0_0_1px_var(--color-focus)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  size === "sm" ? "px-4 py-3" : "px-5 py-4"
                )}
                onClick={() => {
                  if (open) {
                    setValue(collapsible ? null : item.id);
                    return;
                  }
                  setValue(item.id);
                }}
              >
                <span className="grid gap-1">
                  <h4
                    className={cx(
                      "font-medium text-text-main",
                      size === "sm" ? "text-sm leading-5" : "text-base leading-6"
                    )}
                  >
                    {item.title}
                  </h4>
                  {item.description ? (
                    <span
                      className={cx(
                        "text-text-muted",
                        size === "sm" ? "text-sm leading-6" : "text-base leading-7"
                      )}
                    >
                      {item.description}
                    </span>
                  ) : null}
                </span>
                <FiChevronDown
                  aria-hidden
                  className={cx(
                    "mt-0.5 shrink-0 text-text-muted transition-transform group-focus-visible:text-text-main",
                    size === "sm" ? "h-4 w-4" : "h-5 w-5",
                    open && "rotate-180"
                  )}
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!open}
                className="px-5 pb-4"
              >
                <div
                  className={cx(
                    "border-t border-line pt-4 text-text-muted",
                    size === "sm" ? "text-sm leading-6" : "text-base leading-7"
                  )}
                >
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
