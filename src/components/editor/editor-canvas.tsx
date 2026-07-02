"use client";

import type { PageContent } from "@/db/schema";
import type { VariantUndo } from "@/components/editor/project-editor-variants";
import { UIButton } from "@/components/ui/button";
import type { PageBlock } from "@/features/blocks/shared/content";

type EditorCanvasProps = {
  content: PageContent;
  activeBlockId: string | null;
  lastVariantUndo: VariantUndo | null;
  onUndoVariantSwitch: () => void;
  onDismissVariantUndo: () => void;
  onSelectBlock: (blockId: string) => void;
  renderBlockPreview: (block: PageBlock) => React.ReactNode;
  formatDefinitionLabel: (definition: {
    typeLabel: string;
    label: string;
    variant: string;
  }) => string;
  getBlockDefinition: (type: PageBlock["type"], variant: PageBlock["variant"]) => {
    typeLabel: string;
    label: string;
    variant: string;
  } | null;
};

export function EditorCanvas({
  content,
  activeBlockId,
  lastVariantUndo,
  onUndoVariantSwitch,
  onDismissVariantUndo,
  onSelectBlock,
  renderBlockPreview,
  formatDefinitionLabel,
  getBlockDefinition,
}: EditorCanvasProps) {
  return (
    <div className="grid gap-12 mx-auto container">
      {lastVariantUndo ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-neutral-300 px-4 py-3 text-sm text-text-main">
          <span>
            Variant switched for {lastVariantUndo.typeLabel}: {lastVariantUndo.fromLabel} →{" "}
            {lastVariantUndo.toLabel}.
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <UIButton
              type="button"
              theme="base"
              onClick={onUndoVariantSwitch}
            >
              Undo
            </UIButton>
            <UIButton
              type="button"
              theme="base"
              onClick={onDismissVariantUndo}
              aria-label="Dismiss"
              title="Dismiss"
            >
              ×
            </UIButton>
          </div>
        </div>
      ) : null}

      {content.blocks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 px-5 py-8 text-sm text-zinc-500">
          No blocks yet. Use `Add block` in the Info panel to choose a block type and variant.
        </div>
      ) : (
        content.blocks.map((block, index) => {
          const definition = getBlockDefinition(block.type, block.variant);
          if (!definition) {
            return null;
          }

          return (
            <div
              data-testid="Variant"
              key={block.id}
              data-editor-block-id={block.id}
              role="button"
              tabIndex={0}
              aria-label={`Edit block ${index + 1}: ${formatDefinitionLabel(definition)}`}
              onClick={() => onSelectBlock(block.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectBlock(block.id);
                }
              }}
              className={
                block.id === activeBlockId
                  ? "cursor-pointer rounded-[2rem] bg-neutral-100 p-1 transition focus:outline-none"
                  : "cursor-pointer transition focus:outline-none"
              }
            >
              <div data-testid="RenderedBlockInEditor">{renderBlockPreview(block)}</div>
            </div>
          );
        })
      )}
    </div>
  );
}
