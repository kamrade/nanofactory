import type { PageBlock, PageContent } from "@/db/schema";

import { isPlainObject } from "@/features/blocks/shared/base";
import { getBlockDefinition } from "@/lib/editor/blocks";

type ValidationSuccess = {
  success: true;
  data: PageContent;
};

type ValidationFailure = {
  success: false;
  error: string;
};

export type PageContentValidationResult = ValidationSuccess | ValidationFailure;

function normalizeBlock(input: unknown): PageBlock | null {
  if (!isPlainObject(input)) {
    return null;
  }

  const { id, type, variant, props } = input;

  if (typeof id !== "string" || id.trim().length === 0) {
    return null;
  }

  if (typeof type !== "string") {
    return null;
  }

  const definition = getBlockDefinition(type, typeof variant === "string" ? variant : undefined);

  if (!definition) {
    return null;
  }

  return {
    id,
    type: definition.type,
    variant: definition.variant,
    props: definition.normalizeProps(props),
  };
}

export function validatePageContent(input: unknown): PageContentValidationResult {
  if (!isPlainObject(input)) {
    return {
      success: false,
      error: "Content payload must be an object.",
    };
  }

  if (!Array.isArray(input.blocks)) {
    return {
      success: false,
      error: "Content payload must include a blocks array.",
    };
  }

  const blocks: PageBlock[] = [];

  for (const blockInput of input.blocks) {
    const block = normalizeBlock(blockInput);

    if (!block) {
      return {
        success: false,
        error: "Each block must include a valid id, type, and props object.",
      };
    }

    blocks.push(block);
  }

  return {
    success: true,
    data: {
      blocks,
    },
  };
}

export function parsePageContentJson(input: string): PageContentValidationResult {
  try {
    const parsed = JSON.parse(input) as unknown;
    return validatePageContent(parsed);
  } catch {
    return {
      success: false,
      error: "Content payload must be valid JSON.",
    };
  }
}

export function normalizePageContent(input: unknown): PageContent {
  const result = validatePageContent(input);

  if (!result.success) {
    return {
      blocks: [],
    };
  }

  return result.data;
}
