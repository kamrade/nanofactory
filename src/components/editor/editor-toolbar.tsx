"use client";

import type { BlockVariant, SupportedBlockType } from "@/lib/editor/blocks";
import { UIButton } from "@/components/ui/button";
import { UIMenu, UIMenuItem, UIMenuLabel } from "@/components/ui/menu";

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
      <div className="mx-4 flex flex-wrap items-center gap-3">
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
          {addBlockGroups.map((group) => (
            <div key={group.type} className="grid gap-[2px]">
              <UIMenuLabel>{group.label}</UIMenuLabel>
              {group.variants.map((definition) => (
                <UIMenuItem
                  key={`${definition.type}:${definition.variant}`}
                  onSelect={() => onAddBlock(definition.type, definition.variant)}
                  className="grid gap-0.5"
                >
                  <span className="text-sm font-medium text-text-main">{definition.label}</span>
                  {definition.description ? (
                    <span className="text-xs leading-5 text-text-muted">
                      {definition.description}
                    </span>
                  ) : null}
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
