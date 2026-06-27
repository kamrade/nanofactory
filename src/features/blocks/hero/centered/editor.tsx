"use client";

import { HeroBaseEditor } from "../shared/editor";
import type { BlockEditorProps } from "../../shared/types";

export function HeroCenteredEditor(props: BlockEditorProps) {
  return (
    <HeroBaseEditor
      {...props}
      config={{
        testId: "hero-centered-editor",
        buttonTextLabel: "CTA label",
        buttonTextInputId: "hero-centered-button-text",
        buttonTextPlaceholder: "See how it works",
        buttonTextSize: "lg",
        buttonAnchorInputId: "hero-centered-button-anchor",
        animateInputId: "hero-centered-animate",
        contentPositionInputId: "hero-centered-content-position",
        textFields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            inputId: "hero-centered-eyebrow",
            placeholder: "Optional eyebrow text",
            inputKind: "input",
            inputSize: "lg",
          },
          {
            key: "title",
            label: "Headline",
            inputId: "hero-centered-title",
            placeholder: "Ship a polished launch page this week",
            inputKind: "input",
            inputSize: "lg",
          },
          {
            key: "subtitle",
            label: "Supporting copy",
            inputId: "hero-centered-subtitle",
            placeholder:
              "Lead with a focused headline, support it with one strong paragraph, and keep the call to action visible.",
            inputKind: "input",
            inputSize: "lg",
          },
        ],
        contentPositionOptions: [
          { value: "top", label: "Top", textValue: "Top" },
          { value: "centered", label: "Centered", textValue: "Centered" },
          { value: "bottom", label: "Bottom", textValue: "Bottom" },
        ],
        assetPickers: [
          {
            key: "imageAssetId",
            title: "Optional image",
            description:
              "This variant works without media. Add an image only when it strengthens the centered message.",
            emptyMessage: "Upload an asset in the project assets panel below to use it here.",
            clearLabel: "Remove image",
            selectLabel: "Use image",
          },
          {
            key: "imageLightAssetId",
            title: "Light mode image",
            description: "Optional override for light mode.",
            emptyMessage: "Upload an asset in the project assets panel below to use it here.",
            clearLabel: "Remove light image",
            selectLabel: "Use in light mode",
          },
          {
            key: "imageDarkAssetId",
            title: "Dark mode image",
            description: "Optional override for dark mode.",
            emptyMessage: "Upload an asset in the project assets panel below to use it here.",
            clearLabel: "Remove dark image",
            selectLabel: "Use in dark mode",
          },
        ],
      }}
    />
  );
}
