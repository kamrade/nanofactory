import { isPlainObject, readString } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { AppHeaderDefaultEditor } from "./editor";
import { AppHeaderDefaultRender } from "./render";

export const appHeaderDefaultDefinition: BlockVariantDefinition = {
  type: "app-header",
  typeLabel: "App Header",
  variant: "default",
  label: "Default",
  description: "Basic App Header block template.",
  fields: [
    {
      key: "title",
      label: "Title",
      kind: "text",
      placeholder: "App Header title",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      kind: "textarea",
      placeholder: "Add supporting text for this block.",
    },
    {
      key: "buttonText",
      label: "Button text",
      kind: "text",
      placeholder: "Learn more",
    },
  ],
  Editor: AppHeaderDefaultEditor,
  createDefaultProps: () => ({
    title: "App Header title",
    subtitle: "Add supporting text for this block.",
    buttonText: "Learn more",
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};
    return {
      title: readString(props.title, "App Header title"),
      subtitle: readString(props.subtitle, "Add supporting text for this block."),
      buttonText: readString(props.buttonText, "Learn more"),
    };
  },
  Renderer: AppHeaderDefaultRender,
};
