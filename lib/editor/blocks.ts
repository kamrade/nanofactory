import type { PageBlock } from "@/db/schema";

export type SupportedBlockType = "hero" | "features" | "cta";

export type BlockFieldDefinition = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "string-list";
  placeholder?: string;
};

type BlockDefinition = {
  type: SupportedBlockType;
  label: string;
  fields: BlockFieldDefinition[];
  supportsAssetSelection?: boolean;
  createDefaultProps: () => Record<string, unknown>;
  normalizeProps: (input: unknown) => Record<string, unknown>;
};

function isPlainObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function readString(input: unknown, fallback: string) {
  return typeof input === "string" ? input : fallback;
}

function readOptionalString(input: unknown) {
  if (typeof input !== "string") {
    return undefined;
  }

  const value = input.trim();
  return value.length > 0 ? value : undefined;
}

function readStringList(input: unknown, fallback: string[]) {
  if (!Array.isArray(input)) {
    return fallback;
  }

  const items = input
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

function createBlockId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const blockRegistry: Record<SupportedBlockType, BlockDefinition> = {
  hero: {
    type: "hero",
    label: "Hero",
    supportsAssetSelection: true,
    fields: [
      {
        key: "title",
        label: "Title",
        kind: "text",
        placeholder: "Launch your next page faster",
      },
      {
        key: "subtitle",
        label: "Subtitle",
        kind: "textarea",
        placeholder: "Describe the core value of the page in one short paragraph.",
      },
      {
        key: "buttonText",
        label: "Button text",
        kind: "text",
        placeholder: "Get started",
      },
    ],
    createDefaultProps: () => ({
      title: "Build a page that ships this afternoon",
      subtitle: "Write the core message, add a call to action, and publish a focused landing page without a long setup.",
      buttonText: "Start now",
      imageAssetId: undefined,
    }),
    normalizeProps: (input) => {
      const props = isPlainObject(input) ? input : {};

      return {
        title: readString(props.title, "Build a page that ships this afternoon"),
        subtitle: readString(
          props.subtitle,
          "Write the core message, add a call to action, and publish a focused landing page without a long setup."
        ),
        buttonText: readString(props.buttonText, "Start now"),
        imageAssetId: readOptionalString(props.imageAssetId),
      };
    },
  },
  features: {
    type: "features",
    label: "Features",
    fields: [
      {
        key: "sectionTitle",
        label: "Section title",
        kind: "text",
        placeholder: "Why teams choose Nanofactory",
      },
      {
        key: "items",
        label: "Items",
        kind: "string-list",
        placeholder: "One feature per line",
      },
    ],
    createDefaultProps: () => ({
      sectionTitle: "Why teams choose Nanofactory",
      items: [
        "Fast page setup with a small editing surface",
        "Reusable sections built around clear page structure",
        "Simple publishing workflow ready for expansion",
      ],
    }),
    normalizeProps: (input) => {
      const props = isPlainObject(input) ? input : {};

      return {
        sectionTitle: readString(props.sectionTitle, "Why teams choose Nanofactory"),
        items: readStringList(props.items, [
          "Fast page setup with a small editing surface",
          "Reusable sections built around clear page structure",
          "Simple publishing workflow ready for expansion",
        ]),
      };
    },
  },
  cta: {
    type: "cta",
    label: "Call to action",
    fields: [
      {
        key: "title",
        label: "Title",
        kind: "text",
        placeholder: "Ready to create your page?",
      },
      {
        key: "buttonText",
        label: "Button text",
        kind: "text",
        placeholder: "Start building",
      },
    ],
    createDefaultProps: () => ({
      title: "Ready to create your page?",
      buttonText: "Start building",
    }),
    normalizeProps: (input) => {
      const props = isPlainObject(input) ? input : {};

      return {
        title: readString(props.title, "Ready to create your page?"),
        buttonText: readString(props.buttonText, "Start building"),
      };
    },
  },
};

export const supportedBlockTypes = Object.keys(blockRegistry) as SupportedBlockType[];

export const blockDefinitions = supportedBlockTypes.map((type) => blockRegistry[type]);

export function isSupportedBlockType(value: string): value is SupportedBlockType {
  return value in blockRegistry;
}

export function getBlockDefinition(type: string) {
  if (!isSupportedBlockType(type)) {
    return null;
  }

  return blockRegistry[type];
}

export function createPageBlock(type: SupportedBlockType): PageBlock {
  const definition = blockRegistry[type];

  return {
    id: createBlockId(),
    type,
    props: definition.createDefaultProps(),
  };
}
