import type { PageContent } from "@/db/schema";
import type { BlockVariant, PageBlock } from "@/features/blocks/shared/content";
import type {
  BlockFieldDefinition,
  BlockVariantDefinition,
} from "@/features/blocks/shared/types";

export type PendingVariantSwitch = {
  blockId: string;
  nextVariant: BlockVariant;
  lostKeys: string[];
  lostLabels: string[];
  previousBlock: PageBlock;
  nextDefinition: BlockVariantDefinition;
};

export type VariantUndo = {
  blockId: string;
  previousBlock: PageBlock;
  fromLabel: string;
  toLabel: string;
  typeLabel: string;
};

function getDefinitionPropKeys(definition: BlockVariantDefinition) {
  const keys = definition.fields.map((field) => field.key);

  if (definition.supportsAssetSelection) {
    keys.push("imageAssetId");
  }

  return keys;
}

function isMeaningfulValue(value: unknown) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return true;
}

function getFieldLabel(fieldKey: string, fields: BlockFieldDefinition[]) {
  if (fieldKey === "imageAssetId") {
    return "Image asset";
  }

  return fields.find((field) => field.key === fieldKey)?.label ?? fieldKey;
}

function mapPropsToDefinition(
  props: Record<string, unknown>,
  definition: BlockVariantDefinition
) {
  const allowedKeys = new Set(getDefinitionPropKeys(definition));
  const nextProps: Record<string, unknown> = {};

  Object.entries(props).forEach(([key, value]) => {
    if (allowedKeys.has(key)) {
      nextProps[key] = value;
    }
  });

  return definition.normalizeProps(nextProps);
}

export function createPendingVariantSwitch(
  block: PageBlock,
  currentDefinition: BlockVariantDefinition,
  nextVariant: BlockVariant,
  getDefinition: (type: string, variant?: string) => BlockVariantDefinition | null
): PendingVariantSwitch | null {
  if (currentDefinition.variant === nextVariant) {
    return null;
  }

  const nextDefinition = getDefinition(block.type, nextVariant);

  if (!nextDefinition) {
    return null;
  }

  const allowedKeys = new Set(getDefinitionPropKeys(nextDefinition));
  const lostKeys = Object.keys(block.props).filter(
    (key) => !allowedKeys.has(key) && isMeaningfulValue(block.props[key])
  );
  const lostLabels = lostKeys.map((key) => getFieldLabel(key, currentDefinition.fields));

  return {
    blockId: block.id,
    nextVariant,
    lostKeys,
    lostLabels,
    previousBlock: block,
    nextDefinition,
  };
}

export function applyVariantSwitchToContent(
  content: PageContent,
  blockId: string,
  nextDefinition: BlockVariantDefinition,
  getDefinition: (type: string, variant?: string) => BlockVariantDefinition | null
) {
  const targetBlock = content.blocks.find((block) => block.id === blockId);

  if (!targetBlock) {
    return {
      content,
      undo: null,
    };
  }

  const currentDefinition = getDefinition(targetBlock.type, targetBlock.variant);
  const fromLabel = currentDefinition?.label ?? targetBlock.variant ?? "default";
  const toLabel = nextDefinition.label ?? nextDefinition.variant;
  const typeLabel = currentDefinition?.typeLabel ?? nextDefinition.typeLabel;

  return {
    content: {
      blocks: content.blocks.map((block) => {
        if (block.id !== blockId) {
          return block;
        }

        return {
          ...block,
          variant: nextDefinition.variant,
          props: mapPropsToDefinition(block.props, nextDefinition),
        };
      }),
    },
    undo: {
      blockId,
      previousBlock: targetBlock,
      fromLabel,
      toLabel,
      typeLabel,
    } satisfies VariantUndo,
  };
}

export function undoVariantSwitchInContent(content: PageContent, undo: VariantUndo): PageContent {
  return {
    blocks: content.blocks.map((block) =>
      block.id === undo.blockId ? undo.previousBlock : block
    ),
  };
}
