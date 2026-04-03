import { isPlainObject, readString, readStringList } from "../../shared/base";
import { GenericBlockEditor } from "../../shared/generic-editor";
import type { BlockVariantDefinition } from "../../shared/types";
import { FeaturesDefaultRender } from "./render";

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
  Editor: GenericBlockEditor,
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
  Renderer: FeaturesDefaultRender,
};
