"use client";

import { HeroBaseEditor } from "../shared/editor";
import type { BlockEditorProps } from "../../shared/types";

export function HeroDefaultEditor(props: BlockEditorProps) {
  return (
    <HeroBaseEditor
      {...props}
      config={{
        testId: "hero-default-editor",
        buttonTextLabel: "Button text",
        buttonTextInputId: "hero-default-button-text",
        buttonTextPlaceholder: "Get started",
        buttonTextSize: "sm",
        buttonAnchorInputId: "hero-default-button-anchor",
        buttonTargetTypeInputId: "hero-default-button-target-type",
        animateInputId: "hero-default-animate",
        contentPositionInputId: "hero-default-content-position",
        textFields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            inputId: "hero-default-eyebrow",
            placeholder: "Optional eyebrow text",
            inputKind: "input",
            inputSize: "sm",
          },
          {
            key: "title",
            label: "Title",
            inputId: "hero-default-title",
            placeholder: "Launch your next page faster",
            inputKind: "input",
            inputSize: "sm",
          },
          {
            key: "subtitle",
            label: "Subtitle",
            inputId: "hero-default-subtitle",
            placeholder: "Describe the core value of the page in one short paragraph.",
            inputKind: "textarea",
            inputSize: "lg",
          },
        ],
        contentPositionOptions: [
          { value: "top", label: "Top", textValue: "Top" },
          { value: "centered", label: "Centered", textValue: "Centered" },
          { value: "bottom", label: "Bottom", textValue: "Bottom" },
          { value: "stretch", label: "Stretch", textValue: "Stretch" },
        ],
        assetPickers: [
          {
            key: "imageAssetId",
            title: "Hero image asset",
            description: "Select one of the uploaded project assets.",
            emptyMessage:
              "Upload an asset in the project assets panel below to use it in this block.",
          },
          {
            key: "imageLightAssetId",
            title: "Light mode image",
            description: "Optional override for light mode.",
            emptyMessage:
              "Upload an asset in the project assets panel below to use it in this block.",
            clearLabel: "Remove light image",
            selectLabel: "Use in light mode",
          },
          {
            key: "imageDarkAssetId",
            title: "Dark mode image",
            description: "Optional override for dark mode.",
            emptyMessage:
              "Upload an asset in the project assets panel below to use it in this block.",
            clearLabel: "Remove dark image",
            selectLabel: "Use in dark mode",
          },
        ],
      }}
    />
  );
}
