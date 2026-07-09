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
        buttonTargetTypeInputId: "hero-centered-button-target-type",
        animateInputId: "hero-centered-animate",
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
        assetPickers: [
          {
            key: "imageAssetId",
            title: "Optional image",
            emptyMessage: "Upload an asset in the project assets panel below to use it here.",
            clearLabel: "Remove image",
            selectLabel: "Use image",
          },
          {
            key: "imageLightAssetId",
            title: "Light mode image",
            emptyMessage: "Upload an asset in the project assets panel below to use it here.",
            clearLabel: "Remove light image",
            selectLabel: "Use in light mode",
          },
          {
            key: "imageDarkAssetId",
            title: "Dark mode image",
            emptyMessage: "Upload an asset in the project assets panel below to use it here.",
            clearLabel: "Remove dark image",
            selectLabel: "Use in dark mode",
          },
        ],
      }}
    />
  );
}
