import type { BlockVariant, SupportedBlockType } from "@/lib/editor/blocks";

export const EDITOR_ADD_BLOCK_EVENT = "project-editor:add-block";

export type EditorAddBlockEventDetail = {
  blockType: SupportedBlockType;
  variant: BlockVariant;
};
