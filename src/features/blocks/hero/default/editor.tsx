"use client";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";
import { UISelect } from "@/components/ui/select";
import { UITextInput } from "@/components/ui/text-input";

function readStringProp(props: Record<string, unknown>, key: string) {
  return typeof props[key] === "string" ? props[key] : "";
}

export function HeroDefaultEditor({
  block,
  assets,
  onChange,
  availableAnchors = [],
}: BlockEditorProps) {
  const title = readStringProp(block.props, "title");
  const subtitle = readStringProp(block.props, "subtitle");
  const buttonText = readStringProp(block.props, "buttonText");
  const buttonAnchor = readStringProp(block.props, "buttonAnchor");

  function updateField(
    key: "title" | "subtitle" | "buttonText" | "buttonAnchor",
    value: string
  ) {
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
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Title</span>
        <UITextInput
          size="sm"
          value={title}
          placeholder="Launch your next page faster"
          onValueChange={(value) => updateField("title", value)}
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Subtitle</span>
        <textarea
          value={subtitle}
          rows={4}
          placeholder="Describe the core value of the page in one short paragraph."
          onChange={(event) => updateField("subtitle", event.target.value)}
          className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-text-main outline-none transition placeholder:text-text-placeholder focus:ring-2 focus:ring-focus/50"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Button text</span>
        <UITextInput
          size="sm"
          value={buttonText}
          placeholder="Get started"
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

      <div className="grid gap-4 py-5">
        <AssetPicker
          assets={assets}
          selectedAssetId={
            typeof block.props.imageAssetId === "string" ? block.props.imageAssetId : undefined
          }
          onSelect={selectAsset}
          onClear={() => selectAsset(undefined)}
          title="Hero image asset"
          description="Select one of the uploaded project assets."
          emptyMessage="Upload an asset in the project assets panel below to use it in this block."
          layout="grid"
          compact
        />
      </div>
    </div>
  );
}
