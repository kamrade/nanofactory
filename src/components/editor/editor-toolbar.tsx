"use client";

import type { BlockVariant, SupportedBlockType } from "@/lib/editor/blocks";
import { UIButton } from "@/components/ui/button";
import { UIMenu, UIMenuItem, UIMenuLabel, UIMenuSeparator } from "@/components/ui/menu";

type AddBlockGroup = {
  type: SupportedBlockType;
  label: string;
  variants: Array<{
    type: SupportedBlockType;
    variant: BlockVariant;
    label: string;
    description?: string;
  }>;
};

type EditorToolbarProps = {
  addBlockGroups: AddBlockGroup[];
  isPending: boolean;
  serializedContent: string;
  formAction: (payload: FormData) => void;
  onAddBlock: (type: SupportedBlockType, variant: BlockVariant) => void;
};

export function EditorToolbar({
  addBlockGroups,
  isPending,
  serializedContent,
  formAction,
  onAddBlock,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="mx-auto container flex flex-wrap items-center gap-3 mb-12">
        <UIMenu
          ariaLabel="Add block"
          placement="bottom-start"
          size="sm"
          trigger={
            <UIButton type="button" theme="base" variant="contained" size="lg">
              Add block
            </UIButton>
          }
          >
          {addBlockGroups.map((group, groupIndex) => (
            <div key={group.type} className="grid gap-0.5">
              {groupIndex > 0 ? <UIMenuSeparator /> : null}
              <UIMenuLabel className="text-[11px] uppercase tracking-[0.18em]">
                {group.label}
              </UIMenuLabel>
              {group.variants.map((definition) => (
                <UIMenuItem
                  key={`${definition.type}:${definition.variant}`}
                  onSelect={() => onAddBlock(definition.type, definition.variant)}
                >
                  <span className="text-sm font-medium text-text-main">{definition.label}</span>
                </UIMenuItem>
              ))}
            </div>
          ))}
        </UIMenu>

        <form action={formAction} className="flex items-center gap-3">
          <input type="hidden" name="content" value={serializedContent} />
          <UIButton
            type="submit"
            disabled={isPending}
            theme="primary"
            variant="contained"
            size="lg"
          >
            {isPending ? "Saving..." : "Save"}
          </UIButton>
        </form>
      </div>
    </div>
  );
}
