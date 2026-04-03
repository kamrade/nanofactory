import type { ComponentType } from "react";

import type { ProjectAssetRecord } from "@/lib/assets";

import type { BlockVariant, PageBlock, SupportedBlockType } from "./content";

export type BlockFieldDefinition = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "string-list";
  placeholder?: string;
};

export type BlockTheme = {
  muted: string;
  button: string;
};

export type BlockRenderProps = {
  block: PageBlock;
  assetMap: Map<string, ProjectAssetRecord>;
  theme: BlockTheme;
};

export type BlockEditorProps = {
  block: PageBlock;
  assets: ProjectAssetRecord[];
  definition: Pick<BlockVariantDefinition, "fields" | "supportsAssetSelection">;
  onChange: (nextProps: Record<string, unknown>) => void;
};

export type BlockVariantDefinition = {
  type: SupportedBlockType;
  typeLabel: string;
  variant: BlockVariant;
  label: string;
  description?: string;
  supportsAssetSelection?: boolean;
  fields: BlockFieldDefinition[];
  createDefaultProps: () => Record<string, unknown>;
  normalizeProps: (input: unknown) => Record<string, unknown>;
  Editor: ComponentType<BlockEditorProps>;
  Renderer: ComponentType<BlockRenderProps>;
};
