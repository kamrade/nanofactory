"use client";

import type { PageContent } from "@/db/schema";
import type { VariantUndo } from "@/components/editor/project-editor-variants";
import { UIButton } from "@/components/ui/button";
import type { PageBlock } from "@/features/blocks/shared/content";

type EditorCanvasProps = {
  content: PageContent;
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
  lastVariantUndo,
  onUndoVariantSwitch,
  onDismissVariantUndo,
  onSelectBlock,
  renderBlockPreview,
  formatDefinitionLabel,
  getBlockDefinition,
}: EditorCanvasProps) {
  return (
    <div className="grid gap-12">
      {lastVariantUndo ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>
            Variant switched for {lastVariantUndo.typeLabel}: {lastVariantUndo.fromLabel} →{" "}
            {lastVariantUndo.toLabel}.
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <UIButton
              type="button"
              onClick={onUndoVariantSwitch}
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              Undo
            </UIButton>
            <UIButton
              type="button"
              onClick={onDismissVariantUndo}
              aria-label="Dismiss"
              title="Dismiss"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-white text-lg font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              ×
            </UIButton>
          </div>
        </div>
      ) : null}

      {content.blocks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 px-5 py-8 text-sm text-zinc-500">
          No blocks yet. Use `Add block` in the header to choose a block type and variant.
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
              className="cursor-pointer transition focus:outline-none"
            >
              <div data-testid="RenderedBlockInEditor">{renderBlockPreview(block)}</div>
            </div>
          );
        })
      )}
    </div>
  );
}
