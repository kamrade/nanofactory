import { readOptionalString, readString, isPlainObject } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { HeroDefaultEditor } from "./editor";
import { HeroDefaultRender } from "./render";

const HERO_CONTENT_POSITIONS = ["top", "bottom", "centered"] as const;
type HeroContentPosition = (typeof HERO_CONTENT_POSITIONS)[number];

function readContentPosition(input: unknown): HeroContentPosition {
  return typeof input === "string" &&
    (HERO_CONTENT_POSITIONS as readonly string[]).includes(input)
    ? (input as HeroContentPosition)
    : "centered";
}

export const heroDefaultDefinition: BlockVariantDefinition = {
  type: "hero",
  typeLabel: "Hero",
  variant: "default",
  label: "Split image",
  description: "Two-column hero with content on the left and image on the right.",
  supportsAssetSelection: true,
  fields: [
    {
      key: "eyebrow",
      label: "Eyebrow",
      kind: "text",
      placeholder: "Optional eyebrow text",
    },
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
    {
      key: "buttonAnchor",
      label: "Button anchor",
      kind: "text",
      placeholder: "section-id",
    },
    {
      key: "contentPosition",
      label: "Content position",
      kind: "text",
      placeholder: "centered",
    },
  ],
  Editor: HeroDefaultEditor,
  createDefaultProps: () => ({
    eyebrow: "",
    title: "Build a page that ships this afternoon",
    subtitle:
      "Write the core message, add a call to action, and publish a focused landing page without a long setup.",
    buttonText: "Start now",
    buttonAnchor: "",
    contentPosition: "centered",
    imageAssetId: undefined,
    imageLightAssetId: undefined,
    imageDarkAssetId: undefined,
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};

    return {
      eyebrow: readString(props.eyebrow, ""),
      title: readString(props.title, "Build a page that ships this afternoon"),
      subtitle: readString(
        props.subtitle,
        "Write the core message, add a call to action, and publish a focused landing page without a long setup."
      ),
      buttonText: readString(props.buttonText, "Start now"),
      buttonAnchor: readString(props.buttonAnchor, ""),
      contentPosition: readContentPosition(props.contentPosition),
      imageAssetId: readOptionalString(props.imageAssetId),
      imageLightAssetId: readOptionalString(props.imageLightAssetId),
      imageDarkAssetId: readOptionalString(props.imageDarkAssetId),
    };
  },
  Renderer: HeroDefaultRender,
};
