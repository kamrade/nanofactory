"use client";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";
import { EditorFieldRow } from "@/components/editor/editor-field-row";
import { UISelect } from "@/components/ui/select";
import { UITextInput } from "@/components/ui/text-input";

function readStringProp(props: Record<string, unknown>, key: string) {
  return typeof props[key] === "string" ? props[key] : "";
}

export function HeroCenteredEditor({
  block,
  assets,
  onChange,
  availableAnchors = [],
}: BlockEditorProps) {
  const eyebrow = readStringProp(block.props, "eyebrow");
  const title = readStringProp(block.props, "title");
  const subtitle = readStringProp(block.props, "subtitle");
  const buttonText = readStringProp(block.props, "buttonText");
  const buttonAnchor = readStringProp(block.props, "buttonAnchor");
  const contentPosition = readStringProp(block.props, "contentPosition") || "centered";

  function updateField(
    key:
      | "eyebrow"
      | "title"
      | "subtitle"
      | "buttonText"
      | "buttonAnchor"
      | "contentPosition",
    value: string
  ) {
    onChange({
      ...block.props,
      [key]: value,
    });
  }

  function selectAsset(
    key: "imageAssetId" | "imageLightAssetId" | "imageDarkAssetId",
    assetId?: string
  ) {
    onChange({
      ...block.props,
      [key]: assetId,
    });
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5">
        <EditorFieldRow label="Eyebrow" htmlFor="hero-centered-eyebrow">
          <UITextInput
            id="hero-centered-eyebrow"
            size="lg"
            value={eyebrow}
            placeholder="Optional eyebrow text"
            onValueChange={(value) => updateField("eyebrow", value)}
          />
        </EditorFieldRow>

        <EditorFieldRow label="Headline" htmlFor="hero-centered-title">
          <UITextInput
            id="hero-centered-title"
            size="lg"
            value={title}
            placeholder="Ship a polished launch page this week"
            onValueChange={(value) => updateField("title", value)}
          />
        </EditorFieldRow>

        <EditorFieldRow label="Supporting copy" htmlFor="hero-centered-subtitle">
          <UITextInput
            id="hero-centered-subtitle"
            size="lg"
            value={subtitle}
            placeholder="Lead with a focused headline, support it with one strong paragraph, and keep the call to action visible."
            onValueChange={(value) => updateField("subtitle", value)}
          />
        </EditorFieldRow>

        <EditorFieldRow label="CTA label" htmlFor="hero-centered-button-text">
          <UITextInput
            id="hero-centered-button-text"
            size="lg"
            value={buttonText}
            placeholder="See how it works"
            onValueChange={(value) => updateField("buttonText", value)}
          />
        </EditorFieldRow>

        <EditorFieldRow label="Button anchor" htmlFor="hero-centered-button-anchor">
          <UISelect
            id="hero-centered-button-anchor"
            ariaLabel="Hero button anchor"
            size="sm"
            className="w-full"
            value={buttonAnchor}
            onValueChange={(value) => updateField("buttonAnchor", String(value))}
            placeholder={availableAnchors.length === 0 ? "No anchors available" : "Select anchor"}
            options={availableAnchors.map((anchor) => ({
              value: anchor.id,
              label: anchor.label,
              textValue: anchor.label,
            }))}
            clearable
          />
        </EditorFieldRow>

        <EditorFieldRow label="Content position" htmlFor="hero-centered-content-position">
          <UISelect
            id="hero-centered-content-position"
            ariaLabel="Hero content position"
            size="sm"
            className="w-full"
            value={contentPosition}
            onValueChange={(value) => updateField("contentPosition", String(value))}
            options={[
              { value: "top", label: "Top", textValue: "Top" },
              { value: "centered", label: "Centered", textValue: "Centered" },
              { value: "bottom", label: "Bottom", textValue: "Bottom" },
            ]}
          />
        </EditorFieldRow>
      </div>

      <div className="grid gap-4 py-5">
        <AssetPicker
          assets={assets}
          selectedAssetId={
            typeof block.props.imageAssetId === "string" ? block.props.imageAssetId : undefined
          }
          onSelect={(assetId) => selectAsset("imageAssetId", assetId)}
          onClear={() => selectAsset("imageAssetId", undefined)}
          title="Optional image"
          description="This variant works without media. Add an image only when it strengthens the centered message."
          emptyMessage="Upload an asset in the project assets panel below to use it here."
          clearLabel="Remove image"
          selectLabel="Use image"
          layout="grid"
          compact
        />
        <AssetPicker
          assets={assets}
          selectedAssetId={
            typeof block.props.imageLightAssetId === "string"
              ? block.props.imageLightAssetId
              : undefined
          }
          onSelect={(assetId) => selectAsset("imageLightAssetId", assetId)}
          onClear={() => selectAsset("imageLightAssetId", undefined)}
          title="Light mode image"
          description="Optional override for light mode."
          emptyMessage="Upload an asset in the project assets panel below to use it here."
          clearLabel="Remove light image"
          selectLabel="Use in light mode"
          layout="grid"
          compact
        />
        <AssetPicker
          assets={assets}
          selectedAssetId={
            typeof block.props.imageDarkAssetId === "string"
              ? block.props.imageDarkAssetId
              : undefined
          }
          onSelect={(assetId) => selectAsset("imageDarkAssetId", assetId)}
          onClear={() => selectAsset("imageDarkAssetId", undefined)}
          title="Dark mode image"
          description="Optional override for dark mode."
          emptyMessage="Upload an asset in the project assets panel below to use it here."
          clearLabel="Remove dark image"
          selectLabel="Use in dark mode"
          layout="grid"
          compact
        />
      </div>
    </div>
  );
}
