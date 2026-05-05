import { isPlainObject, readOptionalString, readString } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { FeaturesCardsEditor } from "./editor";
import { FeaturesCardsRender } from "./render";

type FeatureCardItem = {
  title: string;
  content: string;
  imageAssetId: string | undefined;
};

const defaultItems: FeatureCardItem[] = [
  {
    title: "A tighter page structure with fewer moving parts",
    content: "Ship quickly with a focused set of building blocks and less setup overhead.",
    imageAssetId: undefined,
  },
  {
    title: "Clean ownership between content, layout, and assets",
    content: "Keep editing responsibilities clear so teams can collaborate without collisions.",
    imageAssetId: undefined,
  },
  {
    title: "A publishing flow that stays easy to reason about",
    content: "Move from draft to live confidently with a predictable, testable workflow.",
    imageAssetId: undefined,
  },
];

export const featuresCardsDefinition: BlockVariantDefinition = {
  type: "features",
  typeLabel: "Features",
  variant: "cards",
  label: "Cards",
  description: "Three-up feature cards with short supporting copy.",
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
  Editor: FeaturesCardsEditor,
  createDefaultProps: () => ({
    sectionTitle: "What makes this workflow fast",
    items: defaultItems,
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};
    const rawItems = Array.isArray(props.items) ? props.items : [];
    const normalizedItems = rawItems
      .map((item) => {
        // Backward compatibility: old data stored items as string[] (title-only).
        if (typeof item === "string") {
          const title = readOptionalString(item);
          if (!title) {
            return null;
          }
          return {
            title,
            content: "",
            imageAssetId: undefined,
          };
        }

        if (!isPlainObject(item)) {
          return null;
        }

        const title = readOptionalString(item.title);
        const content = readOptionalString(item.content) ?? "";

        if (!title) {
          return null;
        }

        return {
          title,
          content,
          imageAssetId: readOptionalString(item.imageAssetId),
        };
      })
      .filter(
        (item): item is FeatureCardItem =>
          item !== null
      );

    return {
      sectionTitle: readString(props.sectionTitle, "What makes this workflow fast"),
      items:
        normalizedItems.length > 0
          ? normalizedItems
          : defaultItems,
    };
  },
  Renderer: FeaturesCardsRender,
};
