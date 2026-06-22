import { readOptionalString, readString, isPlainObject } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { HeroCenteredEditor } from "./editor";
import { HeroCenteredRender } from "./render";

const HERO_CONTENT_POSITIONS = ["top", "bottom", "centered"] as const;
type HeroContentPosition = (typeof HERO_CONTENT_POSITIONS)[number];

function readContentPosition(input: unknown): HeroContentPosition {
  return typeof input === "string" &&
    (HERO_CONTENT_POSITIONS as readonly string[]).includes(input)
    ? (input as HeroContentPosition)
    : "centered";
}

export const heroCenteredDefinition: BlockVariantDefinition = {
  type: "hero",
  typeLabel: "Hero",
  variant: "centered",
  label: "Centered",
  description: "Centered headline with optional image and CTA.",
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
  Editor: HeroCenteredEditor,
  createDefaultProps: () => ({
    eyebrow: "",
    title: "Ship a polished launch page this week",
    subtitle:
      "Lead with a focused headline, support it with one strong paragraph, and keep the call to action visible.",
    buttonText: "See how it works",
    buttonAnchor: "",
    contentPosition: "centered",
    imageAssetId: undefined,
    imageLightAssetId: undefined,
    imageDarkAssetId: undefined,
    animateMainText: false,
    animateContent: false,
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};

    return {
      eyebrow: readString(props.eyebrow, ""),
      title: readString(props.title, "Ship a polished launch page this week"),
      subtitle: readString(
        props.subtitle,
        "Lead with a focused headline, support it with one strong paragraph, and keep the call to action visible."
      ),
      buttonText: readString(props.buttonText, "See how it works"),
      buttonAnchor: readString(props.buttonAnchor, ""),
      contentPosition: readContentPosition(props.contentPosition),
      imageAssetId: readOptionalString(props.imageAssetId),
      imageLightAssetId: readOptionalString(props.imageLightAssetId),
      imageDarkAssetId: readOptionalString(props.imageDarkAssetId),
      animateMainText: props.animateMainText === true,
      animateContent: props.animateContent === true,
    };
  },
  Renderer: HeroCenteredRender,
};
