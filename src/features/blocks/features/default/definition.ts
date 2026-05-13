import { isPlainObject, readOptionalString, readString } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { FeaturesCardsEditor } from "../cards/editor";
import { FeaturesDefaultRender } from "./render";

type FeatureCardItem = {
  title: string;
  content: string;
  imageAssetId: string | undefined;
};

type FeatureBorderRadius = "none" | "md" | "lg";

const defaultItems: FeatureCardItem[] = [
  {
    title: "Fast page setup with a small editing surface",
    content: "Build and ship pages quickly without wrestling with complex structure.",
    imageAssetId: undefined,
  },
  {
    title: "Reusable sections built around clear page structure",
    content: "Keep content organized with consistent, predictable building blocks.",
    imageAssetId: undefined,
  },
  {
    title: "Simple publishing workflow ready for expansion",
    content: "Move from draft to live with a straightforward release flow.",
    imageAssetId: undefined,
  },
];

export const featuresDefaultDefinition: BlockVariantDefinition = {
  type: "features",
  typeLabel: "Features",
  variant: "default",
  label: "Default",
  description: "Simple stacked list of supporting points.",
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
    sectionTitle: "Why teams choose Nanofactory",
    items: defaultItems,
    borderRadius: "lg" as FeatureBorderRadius,
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};
    const rawItems = Array.isArray(props.items) ? props.items : [];
    const normalizedItems = rawItems
      .map((item) => {
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
      .filter((item): item is FeatureCardItem => item !== null);

    return {
      sectionTitle: readString(props.sectionTitle, "Why teams choose Nanofactory"),
      items: normalizedItems.length > 0 ? normalizedItems : defaultItems,
      borderRadius:
        props.borderRadius === "none" || props.borderRadius === "md" || props.borderRadius === "lg"
          ? props.borderRadius
          : "lg",
    };
  },
  Renderer: FeaturesDefaultRender,
};
