"use client";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";
import { UITextInput } from "@/components/ui/text-input";

function readStringProp(props: Record<string, unknown>, key: string) {
  return typeof props[key] === "string" ? props[key] : "";
}

export function HeroCenteredEditor({
  block,
  assets,
  onChange,
}: BlockEditorProps) {
  const title = readStringProp(block.props, "title");
  const subtitle = readStringProp(block.props, "subtitle");
  const buttonText = readStringProp(block.props, "buttonText");

  function updateField(key: "title" | "subtitle" | "buttonText", value: string) {
    onChange({
      ...block.props,
      [key]: value,
    });
  }

  function selectAsset(assetId?: string) {
    onChange({
      ...block.props,
      imageAssetId: assetId,
    });
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5">

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
      </div>

      <div className="grid gap-4 py-5">
        <AssetPicker
          assets={assets}
          selectedAssetId={
            typeof block.props.imageAssetId === "string" ? block.props.imageAssetId : undefined
          }
          onSelect={selectAsset}
          onClear={() => selectAsset(undefined)}
          title="Optional image"
          description="This variant works without media. Add an image only when it strengthens the centered message."
          emptyMessage="Upload an asset in the project assets panel below to use it here."
          clearLabel="Remove image"
          selectLabel="Use image"
          layout="grid"
          compact
        />
      </div>
    </div>
  );
}
