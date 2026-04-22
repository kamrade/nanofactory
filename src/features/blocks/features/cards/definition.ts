import { isPlainObject, readString, readStringList } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { FeaturesCardsEditor } from "./editor";
import { FeaturesCardsRender } from "./render";

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
    items: [
      "A tighter page structure with fewer moving parts",
      "Clean ownership between content, layout, and assets",
      "A publishing flow that stays easy to reason about",
    ],
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};

    return {
      sectionTitle: readString(props.sectionTitle, "What makes this workflow fast"),
      items: readStringList(props.items, [
        "A tighter page structure with fewer moving parts",
        "Clean ownership between content, layout, and assets",
        "A publishing flow that stays easy to reason about",
      ]),
    };
  },
  Renderer: FeaturesCardsRender,
};
