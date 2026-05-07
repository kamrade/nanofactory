"use client";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";
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
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Eyebrow</span>
          <UITextInput
            size="lg"
            value={eyebrow}
            placeholder="Optional eyebrow text"
            onValueChange={(value) => updateField("eyebrow", value)}
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium text-text-main">Headline</span>
          <UITextInput
            size="lg"
            value={title}
            placeholder="Ship a polished launch page this week"
            onValueChange={(value) => updateField("title", value)}
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Supporting copy</span>
          <UITextInput
            size="lg"
            value={subtitle}
            placeholder="Lead with a focused headline, support it with one strong paragraph, and keep the call to action visible."
            onValueChange={(value) => updateField("subtitle", value)}
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">CTA label</span>
          <UITextInput
            size="lg"
            value={buttonText}
            placeholder="See how it works"
            onValueChange={(value) => updateField("buttonText", value)}
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Button anchor</span>
          <UISelect
            ariaLabel="Hero button anchor"
            size="sm"
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
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Content position</span>
          <UISelect
            ariaLabel="Hero content position"
            size="sm"
            value={contentPosition}
            onValueChange={(value) => updateField("contentPosition", String(value))}
            options={[
              { value: "top", label: "Top", textValue: "Top" },
              { value: "centered", label: "Centered", textValue: "Centered" },
              { value: "bottom", label: "Bottom", textValue: "Bottom" },
            ]}
          />
        </label>
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
