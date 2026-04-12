import { ctaDefinitions } from "../cta";
import { featuresDefinitions } from "../features";
import { heroDefinitions } from "../hero";
import { createBlockId } from "./base";
import type { BlockVariantDefinition } from "./types";
import type { BlockVariant, PageBlock, SupportedBlockType } from "./content";

const definitions = [...heroDefinitions, ...featuresDefinitions, ...ctaDefinitions];
const blockTypeLabels = new Map<SupportedBlockType, string>(
  definitions.reduce<Array<[SupportedBlockType, string]>>((acc, definition) => {
    if (!acc.find(([type]) => type === definition.type)) {
      acc.push([definition.type, definition.typeLabel]);
    }
    return acc;
  }, [])
);

const definitionMap = new Map<string, BlockVariantDefinition>(
  definitions.map((definition) => [`${definition.type}:${definition.variant}`, definition])
);

export const blockDefinitions = definitions;

export function getBlockDefinitions() {
  return definitions;
}

export function getBlockDefinition(type: string, variant?: string): BlockVariantDefinition | null {
  const safeVariant = typeof variant === "string" && variant.trim().length > 0 ? variant : "default";

  return definitionMap.get(`${type}:${safeVariant}`) ?? null;
}

export function getBlockVariants(type: SupportedBlockType) {
  return definitions.filter((definition) => definition.type === type);
}

export function getBlockTypes() {
  return Array.from(blockTypeLabels.entries()).map(([type, label]) => ({
    type,
    label,
  }));
}

export function createPageBlock(
  type: SupportedBlockType,
  variant: BlockVariant = "default"
): PageBlock {
  const definition = getBlockDefinition(type, variant);

  if (!definition) {
    throw new Error(`Unknown block definition: ${type}:${variant}`);
  }

  return {
    id: createBlockId(),
    type: definition.type,
    variant: definition.variant,
    fullBleed: false,
    props: definition.createDefaultProps(),
  };
}
