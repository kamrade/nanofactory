import { readOptionalString, readString, isPlainObject } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { HeroCenteredEditor } from "./editor";
import { HeroCenteredRender } from "./render";

export const heroCenteredDefinition: BlockVariantDefinition = {
  type: "hero",
  typeLabel: "Hero",
  variant: "centered",
  label: "Centered",
  description: "Centered headline with optional image and CTA.",
  supportsAssetSelection: true,
  fields: [
    {
      key: "title",
      label: "Title",
      kind: "text",
      placeholder: "Ship a polished launch page this week",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      kind: "textarea",
      placeholder: "Lead with a focused headline, support it with one strong paragraph, and keep the call to action visible.",
    },
    {
      key: "buttonText",
      label: "Button text",
      kind: "text",
      placeholder: "See how it works",
    },
  ],
  Editor: HeroCenteredEditor,
  createDefaultProps: () => ({
    title: "Ship a polished launch page this week",
    subtitle:
      "Lead with a focused headline, support it with one strong paragraph, and keep the call to action visible.",
    buttonText: "See how it works",
    imageAssetId: undefined,
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};

    return {
      title: readString(props.title, "Ship a polished launch page this week"),
      subtitle: readString(
        props.subtitle,
        "Lead with a focused headline, support it with one strong paragraph, and keep the call to action visible."
      ),
      buttonText: readString(props.buttonText, "See how it works"),
      imageAssetId: readOptionalString(props.imageAssetId),
    };
  },
  Renderer: HeroCenteredRender,
};
