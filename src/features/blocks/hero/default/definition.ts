import type { BlockVariantDefinition } from "../../shared/types";
import {
  createHeroDefaultProps,
  normalizeHeroProps,
} from "../shared/model";
import { HeroDefaultEditor } from "./editor";
import { HeroDefaultRender } from "./render";

const HERO_DEFAULT_TITLE = "Build a page that ships this afternoon";
const HERO_DEFAULT_SUBTITLE =
  "Write the core message, add a call to action, and publish a focused landing page without a long setup.";
const HERO_DEFAULT_BUTTON_TEXT = "Start now";

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
  ],
  Editor: HeroDefaultEditor,
  createDefaultProps: () =>
    createHeroDefaultProps({
      title: HERO_DEFAULT_TITLE,
      subtitle: HERO_DEFAULT_SUBTITLE,
      buttonText: HERO_DEFAULT_BUTTON_TEXT,
    }),
  normalizeProps: (input) =>
    normalizeHeroProps(input, {
      title: HERO_DEFAULT_TITLE,
      subtitle: HERO_DEFAULT_SUBTITLE,
      buttonText: HERO_DEFAULT_BUTTON_TEXT,
    }),
  Renderer: HeroDefaultRender,
};
