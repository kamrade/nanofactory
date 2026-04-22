import { isPlainObject, readString } from "../../shared/base";
import { GenericBlockEditor } from "../../shared/generic-editor";
import type { BlockVariantDefinition } from "../../shared/types";
import { CtaDefaultRender } from "./render";

export const ctaDefaultDefinition: BlockVariantDefinition = {
  type: "cta",
  typeLabel: "Call to action",
  variant: "default",
  label: "Default",
  description: "Centered closing call to action with a single button.",
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
  Editor: GenericBlockEditor,
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
  Renderer: CtaDefaultRender,
};
