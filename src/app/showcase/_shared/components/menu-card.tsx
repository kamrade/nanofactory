"use client";

import { useState } from "react";
import { FiArchive, FiCopy, FiEdit2, FiMoreVertical, FiTrash2 } from "react-icons/fi";

import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIDivider } from "@/components/ui/divider";
import { UIMenu, UIMenuItem, UIMenuLabel, UIMenuSeparator } from "@/components/ui/menu";

import type { UiSize } from "@/app/showcase/_shared/uikit-sections";
import {
  menuRadiusStyles,
  resolveMenuBorderRadiusValue,
  type UIMenuBorderRadius,
} from "@/components/ui/menu/menu-radius";

type MenuActionContentProps = {
  size: UiSize;
  borderRadius: UIMenuBorderRadius;
  closeOnSelect?: boolean;
  onAction: (action: "edit" | "duplicate" | "archive" | "delete") => void;
};

function MenuActionContent({ size, borderRadius, closeOnSelect = true, onAction }: MenuActionContentProps) {
  return (
    <>
      <UIMenuLabel size={size}>Actions</UIMenuLabel>
      <UIMenuItem
        size={size}
        borderRadius={borderRadius}
        icon={<FiEdit2 aria-hidden className="h-4 w-4" />}
        closeOnSelect={closeOnSelect}
        onSelect={() => onAction("edit")}
      >
        Edit
      </UIMenuItem>
      <UIMenuItem
        size={size}
        borderRadius={borderRadius}
        icon={<FiCopy aria-hidden className="h-4 w-4" />}
        closeOnSelect={closeOnSelect}
        onSelect={() => onAction("duplicate")}
      >
        Duplicate
      </UIMenuItem>
      <UIMenuSeparator />
      <UIMenuLabel size={size}>Danger Zone</UIMenuLabel>
      <UIMenuItem
        size={size}
        borderRadius={borderRadius}
        icon={<FiArchive aria-hidden className="h-4 w-4" />}
        closeOnSelect={closeOnSelect}
        onSelect={() => onAction("archive")}
      >
        Archive
      </UIMenuItem>
      <UIMenuItem
        size={size}
        borderRadius={borderRadius}
        tone="danger"
        icon={<FiTrash2 aria-hidden className="h-4 w-4" />}
        closeOnSelect={closeOnSelect}
        onSelect={() => onAction("delete")}
      >
        Delete
      </UIMenuItem>
    </>
  );
}

export function MenuCard({ uiSize, borderRadius }: { uiSize: UiSize; borderRadius: UIMenuBorderRadius }) {
  const [menuAction, setMenuAction] = useState("none");
  const [manualMenuAction, setManualMenuAction] = useState("none");
  const [inlineMenuAction, setInlineMenuAction] = useState("none");

  return (
    <UICard title="Menu">
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <UIMenu
            ariaLabel="Card actions"
            placement="bottom-start"
            size={uiSize}
            borderRadius={borderRadius}
            onAction={setMenuAction}
            items={[
              { id: "edit", label: "Edit", textValue: "Edit", icon: <FiEdit2 aria-hidden className="h-4 w-4" /> },
              { id: "duplicate", label: "Duplicate", textValue: "Duplicate", icon: <FiCopy aria-hidden className="h-4 w-4" /> },
              { id: "archive", label: "Archive", textValue: "Archive", icon: <FiArchive aria-hidden className="h-4 w-4" /> },
              { id: "delete", label: "Delete", textValue: "Delete", icon: <FiTrash2 aria-hidden className="h-4 w-4" />, tone: "danger" },
            ]}
            trigger={
              <UIButton
                aria-label="Open menu"
                theme="base"
                variant="outlined"
                size={uiSize}
                borderRadius={borderRadius}
                iconButton
              >
                <FiMoreVertical aria-hidden className="h-4 w-4" />
              </UIButton>
            }
          />
          <p className="text-sm text-text-muted">Dropdown action: {menuAction}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <UIMenu
            ariaLabel="Card actions manual"
            placement="bottom-start"
            size={uiSize}
            borderRadius={borderRadius}
            trigger={
              <UIButton
                aria-label="Open manual menu"
                theme="base"
                variant="outlined"
                size={uiSize}
                borderRadius={borderRadius}
                iconButton
              >
                <FiMoreVertical aria-hidden className="h-4 w-4" />
              </UIButton>
            }
          >
            <MenuActionContent size={uiSize} borderRadius={borderRadius} onAction={setManualMenuAction} />
          </UIMenu>
          <p className="text-sm text-text-muted">Dropdown manual action: {manualMenuAction}</p>
        </div>

        <UIDivider stripped spacing="sm" />

        <div className="grid gap-3">
          <p className="text-sm font-medium text-text-muted">Inline Menu List (without Dropdown)</p>
          <div className="max-w-56">
            <div
              className="flex min-w-44 flex-col gap-[2px] border border-line bg-surface p-1"
              role="menu"
              aria-label="Inline card actions"
              style={{
                ...menuRadiusStyles[borderRadius],
                borderRadius: resolveMenuBorderRadiusValue(borderRadius),
              }}
            >
              <MenuActionContent
                size={uiSize}
                borderRadius={borderRadius}
                closeOnSelect={false}
                onAction={setInlineMenuAction}
              />
            </div>
          </div>
          <p
            className="inline-flex w-fit border border-line bg-surface px-2 py-1 text-sm text-text-muted"
            style={{ borderRadius: resolveMenuBorderRadiusValue(borderRadius) }}
          >
            Inline action: {inlineMenuAction}
          </p>
        </div>
      </div>
    </UICard>
  );
}
