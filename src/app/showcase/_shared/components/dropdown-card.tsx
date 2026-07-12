"use client";

import { useState } from "react";
import { FiChevronDown, FiCopy, FiEdit2, FiMoreHorizontal, FiTrash2 } from "react-icons/fi";

import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIDropdown } from "@/components/ui/dropdown";
import { cx } from "@/lib/cn";

import type { UiSize } from "@/app/showcase/_shared/uikit-sections";

type DropdownCardProps = {
  uiSize: UiSize;
  borderRadius: "none" | "md" | "lg";
};

const sizeClasses = {
  sm: {
    panel: "p-1",
    content: "p-4",
    list: "gap-0.5",
    item: "min-h-7 px-2 py-1 text-sm leading-5",
    action: "h-7 px-3 text-sm leading-5",
    meta: "text-sm leading-5",
  },
  md: {
    panel: "p-1",
    content: "p-5",
    list: "gap-0.5",
    item: "min-h-10 px-3 py-2 text-sm leading-5",
    action: "h-10 px-3.5 text-sm leading-5",
    meta: "text-sm leading-5",
  },
  lg: {
    panel: "p-1.5",
    content: "p-6",
    list: "gap-0.5",
    item: "min-h-14 px-4 py-3 text-base leading-6",
    action: "h-14 px-4 text-base leading-6",
    meta: "text-base leading-6",
  },
} as const;

const radiusClassName = {
  none: "rounded-none",
  md: "rounded-lg",
  lg: "rounded-xl",
} as const;

export function DropdownCard({ uiSize, borderRadius }: DropdownCardProps) {
  const [primaryOpen, setPrimaryOpen] = useState(false);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const [primaryAction, setPrimaryAction] = useState("none");
  const [secondaryAction, setSecondaryAction] = useState("none");

  const radius = radiusClassName[borderRadius];
  const resolvedSizeClasses = sizeClasses[uiSize];

  return (
    <UICard title="Dropdown">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <p className="text-sm font-medium text-text-muted">Menu dropdown</p>
          <div className="flex flex-wrap items-center gap-4">
            <UIDropdown
              ariaLabel="Primary dropdown"
              open={primaryOpen}
              onOpenChange={setPrimaryOpen}
              placement="bottom-start"
              offsetPx={10}
              trigger={
                <UIButton theme="base" variant="outlined" size={uiSize} borderRadius={borderRadius}>
                  Actions
                  <FiChevronDown aria-hidden className="h-4 w-4" />
                </UIButton>
              }
            >
              <div
                className={cx(
                  "min-w-52 border border-line bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
                  radius,
                  resolvedSizeClasses.panel
                )}
              >
                <div className={cx("flex flex-col", resolvedSizeClasses.content, resolvedSizeClasses.list)}>
                  <UIButton
                    type="button"
                    theme="base"
                    variant="text"
                    size={uiSize}
                    borderRadius={borderRadius}
                    block
                    className={cx("justify-start gap-2", resolvedSizeClasses.item)}
                    onClick={() => setPrimaryAction("edit")}
                  >
                    <FiEdit2 aria-hidden className="h-4 w-4" />
                    Edit item
                  </UIButton>
                  <UIButton
                    type="button"
                    theme="base"
                    variant="text"
                    size={uiSize}
                    borderRadius={borderRadius}
                    block
                    className={cx("justify-start gap-2", resolvedSizeClasses.item)}
                    onClick={() => setPrimaryAction("duplicate")}
                  >
                    <FiCopy aria-hidden className="h-4 w-4" />
                    Duplicate
                  </UIButton>
                  <UIButton
                    type="button"
                    theme="danger"
                    variant="text"
                    size={uiSize}
                    borderRadius={borderRadius}
                    block
                    className={cx("justify-start gap-2", resolvedSizeClasses.item)}
                    onClick={() => setPrimaryAction("delete")}
                  >
                    <FiTrash2 aria-hidden className="h-4 w-4" />
                    Delete
                  </UIButton>
                </div>
              </div>
            </UIDropdown>

            <p className={cx("text-text-muted", resolvedSizeClasses.meta)}>Action: {primaryAction}</p>
          </div>
        </div>

        <div className="grid gap-3">
          <p className="text-sm font-medium text-text-muted">Text dropdown</p>
          <div className="flex flex-wrap items-center gap-4">
            <UIDropdown
              ariaLabel="Secondary dropdown"
              open={secondaryOpen}
              onOpenChange={setSecondaryOpen}
              placement="bottom-start"
              offsetPx={10}
              trigger={
                <UIButton theme="primary" variant="contained" size={uiSize} borderRadius={borderRadius}>
                  Open dropdown
                  <FiMoreHorizontal aria-hidden className="h-4 w-4" />
                </UIButton>
              }
            >
              <div
                className={cx(
                  "min-w-64 border border-line bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
                  radius,
                  resolvedSizeClasses.panel
                )}
              >
                <div className={cx("grid gap-3", resolvedSizeClasses.content, resolvedSizeClasses.list)}>
                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-text-main">Dropdown content</span>
                    <span className="text-sm text-text-muted">
                      This panel follows the shared `size` and `borderRadius` showcase controls.
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <UIButton
                      type="button"
                      theme="base"
                      variant="contained"
                      size={uiSize}
                      borderRadius={borderRadius}
                      className={cx("justify-start gap-2", resolvedSizeClasses.action)}
                      onClick={() => setSecondaryAction("confirm")}
                    >
                      Confirm
                    </UIButton>
                    <UIButton
                      type="button"
                      theme="base"
                      variant="outlined"
                      size={uiSize}
                      borderRadius={borderRadius}
                      className={cx("justify-start gap-2", resolvedSizeClasses.action)}
                      onClick={() => setSecondaryAction("cancel")}
                    >
                      Cancel
                    </UIButton>
                  </div>
                </div>
              </div>
            </UIDropdown>

            <p className={cx("text-text-muted", resolvedSizeClasses.meta)}>Action: {secondaryAction}</p>
          </div>
        </div>
      </div>
    </UICard>
  );
}
