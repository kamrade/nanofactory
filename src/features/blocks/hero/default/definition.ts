import { readOptionalString, readString, isPlainObject } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { HeroDefaultEditor } from "./editor";
import { HeroDefaultRender } from "./render";

export const heroDefaultDefinition: BlockVariantDefinition = {
  type: "hero",
  typeLabel: "Hero",
  variant: "default",
  label: "Split image",
  description: "Two-column hero with content on the left and image on the right.",
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
  Editor: HeroDefaultEditor,
  createDefaultProps: () => ({
    title: "Build a page that ships this afternoon",
    subtitle:
      "Write the core message, add a call to action, and publish a focused landing page without a long setup.",
    buttonText: "Start now",
    buttonAnchor: "",
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
      buttonAnchor: readString(props.buttonAnchor, ""),
      imageAssetId: readOptionalString(props.imageAssetId),
    };
  },
  Renderer: HeroDefaultRender,
};
