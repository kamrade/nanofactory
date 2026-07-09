import type { BlockVariantDefinition } from "../../shared/types";
import {
  createHeroDefaultProps,
  normalizeHeroProps,
} from "../shared/model";
import { HeroCenteredEditor } from "./editor";
import { HeroCenteredRender } from "./render";

const HERO_CENTERED_TITLE = "Ship a polished launch page this week";
const HERO_CENTERED_SUBTITLE =
  "Lead with a focused headline, support it with one strong paragraph, and keep the call to action visible.";
const HERO_CENTERED_BUTTON_TEXT = "See how it works";

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
  ],
  Editor: HeroCenteredEditor,
  createDefaultProps: () =>
    createHeroDefaultProps({
      title: HERO_CENTERED_TITLE,
      subtitle: HERO_CENTERED_SUBTITLE,
      buttonText: HERO_CENTERED_BUTTON_TEXT,
    }),
  normalizeProps: (input) =>
    normalizeHeroProps(input, {
      title: HERO_CENTERED_TITLE,
      subtitle: HERO_CENTERED_SUBTITLE,
      buttonText: HERO_CENTERED_BUTTON_TEXT,
    }),
  Renderer: HeroCenteredRender,
};
