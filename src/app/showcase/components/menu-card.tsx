"use client";

import { useState } from "react";
import { FiArchive, FiCopy, FiEdit2, FiMoreVertical, FiTrash2 } from "react-icons/fi";

import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIDivider } from "@/components/ui/divider";
import { UIMenu, UIMenuItem, UIMenuLabel, UIMenuSeparator } from "@/components/ui/menu";

import type { UiSize } from "../uikit-sections";

export function MenuCard({ uiSize }: { uiSize: UiSize }) {
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
            onAction={setMenuAction}
            items={[
              { id: "edit", label: "Edit", textValue: "Edit", icon: <FiEdit2 aria-hidden className="h-4 w-4" /> },
              { id: "duplicate", label: "Duplicate", textValue: "Duplicate", icon: <FiCopy aria-hidden className="h-4 w-4" /> },
              { id: "archive", label: "Archive", textValue: "Archive", icon: <FiArchive aria-hidden className="h-4 w-4" /> },
              { id: "delete", label: "Delete", textValue: "Delete", icon: <FiTrash2 aria-hidden className="h-4 w-4" />, tone: "danger" },
            ]}
            trigger={
              <UIButton aria-label="Open menu" theme="base" variant="outlined" size={uiSize} iconButton>
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
            trigger={
              <UIButton aria-label="Open manual menu" theme="base" variant="outlined" size={uiSize} iconButton>
                <FiMoreVertical aria-hidden className="h-4 w-4" />
              </UIButton>
            }
          >
            <UIMenuLabel>Actions</UIMenuLabel>
            <UIMenuItem icon={<FiEdit2 aria-hidden className="h-4 w-4" />} onSelect={() => setManualMenuAction("edit")}>
              Edit
            </UIMenuItem>
            <UIMenuItem icon={<FiCopy aria-hidden className="h-4 w-4" />} onSelect={() => setManualMenuAction("duplicate")}>
              Duplicate
            </UIMenuItem>
            <UIMenuSeparator />
            <UIMenuLabel>Danger Zone</UIMenuLabel>
            <UIMenuItem icon={<FiArchive aria-hidden className="h-4 w-4" />} onSelect={() => setManualMenuAction("archive")}>
              Archive
            </UIMenuItem>
            <UIMenuItem tone="danger" icon={<FiTrash2 aria-hidden className="h-4 w-4" />} onSelect={() => setManualMenuAction("delete")}>
              Delete
            </UIMenuItem>
          </UIMenu>
          <p className="text-sm text-text-muted">Dropdown manual action: {manualMenuAction}</p>
        </div>

        <UIDivider spacing="sm" />

        <div className="grid gap-3">
          <p className="text-sm font-medium text-text-muted">Inline Menu List (without Dropdown)</p>
          <div className="max-w-56">
            <div
              className="flex min-w-44 flex-col gap-[2px] rounded-xl border border-line bg-surface p-1"
              role="menu"
              aria-label="Inline card actions"
            >
              <UIMenuLabel size={uiSize}>Actions</UIMenuLabel>
              <UIMenuItem size={uiSize} icon={<FiEdit2 aria-hidden className="h-4 w-4" />} closeOnSelect={false} onSelect={() => setInlineMenuAction("edit")}>
                Edit
              </UIMenuItem>
              <UIMenuItem size={uiSize} icon={<FiCopy aria-hidden className="h-4 w-4" />} closeOnSelect={false} onSelect={() => setInlineMenuAction("duplicate")}>
                Duplicate
              </UIMenuItem>
              <UIMenuSeparator />
              <UIMenuLabel size={uiSize}>Danger Zone</UIMenuLabel>
              <UIMenuItem size={uiSize} icon={<FiArchive aria-hidden className="h-4 w-4" />} closeOnSelect={false} onSelect={() => setInlineMenuAction("archive")}>
                Archive
              </UIMenuItem>
              <UIMenuItem size={uiSize} tone="danger" icon={<FiTrash2 aria-hidden className="h-4 w-4" />} closeOnSelect={false} onSelect={() => setInlineMenuAction("delete")}>
                Delete
              </UIMenuItem>
            </div>
          </div>
          <p className="text-sm text-text-muted">Inline action: {inlineMenuAction}</p>
        </div>
      </div>
    </UICard>
  );
}
