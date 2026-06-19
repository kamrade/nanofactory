"use client";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";
import { UIFormRow } from "@/components/ui/form-row";
import { UISelect } from "@/components/ui/select";
import { UITextInput } from "@/components/ui/text-input";
import { Card } from "@/components/ui/card";

function readStringProp(props: Record<string, unknown>, key: string) {
  return typeof props[key] === "string" ? props[key] : "";
}

export function HeroDefaultEditor({
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
    <div data-testid="hero-default-editor">
      <Card className="bg-surface">
        <div className="grid gap-0">
          <UIFormRow label="Eyebrow" htmlFor="hero-default-eyebrow" borderless>
            <UITextInput
              id="hero-default-eyebrow"
              size="sm"
              value={eyebrow}
              borderless
              placeholder="Optional eyebrow text"
              onValueChange={(value) => updateField("eyebrow", value)}
            />
          </UIFormRow>

          <UIFormRow label="Title" htmlFor="hero-default-title" borderless>
            <UITextInput
              id="hero-default-title"
              size="sm"
              value={title}
              borderless
              placeholder="Launch your next page faster"
              onValueChange={(value) => updateField("title", value)}
            />
          </UIFormRow>

          <UIFormRow label="Subtitle" htmlFor="hero-default-subtitle" borderless>
            <textarea
              id="hero-default-subtitle"
              value={subtitle}
              rows={4}
              placeholder="Describe the core value of the page in one short paragraph."
              onChange={(event) => updateField("subtitle", event.target.value)}
              className="min-h-24 w-full rounded-xl bg-surface px-4 py-3 text-sm text-text-main outline-none transition placeholder:text-text-placeholder focus:ring-2 focus:ring-focus/50"
            />
          </UIFormRow>

          <UIFormRow label="Button text" htmlFor="hero-default-button-text" borderless>
            <UITextInput
              id="hero-default-button-text"
              size="sm"
              value={buttonText}
              borderless
              placeholder="Get started"
              onValueChange={(value) => updateField("buttonText", value)}
            />
          </UIFormRow>

          <UIFormRow label="Button anchor" htmlFor="hero-default-button-anchor" borderless>
            <UISelect
              id="hero-default-button-anchor"
              ariaLabel="Hero button anchor"
              size="sm"
              borderless
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
          </UIFormRow>

          <UIFormRow label="Content position" htmlFor="hero-default-content-position" borderless>
            <UISelect
              id="hero-default-content-position"
              ariaLabel="Hero content position"
              size="sm"
              borderless
              className="w-full"
              value={contentPosition}
              onValueChange={(value) => updateField("contentPosition", String(value))}
              options={[
                { value: "top", label: "Top", textValue: "Top" },
                { value: "centered", label: "Centered", textValue: "Centered" },
                { value: "bottom", label: "Bottom", textValue: "Bottom" },
                { value: "stretch", label: "Stretch", textValue: "Stretch" },
              ]}
            />
          </UIFormRow>
        </div>
      </Card>

      <div className="grid gap-4 py-5">
        <AssetPicker
          assets={assets}
          selectedAssetId={
            typeof block.props.imageAssetId === "string" ? block.props.imageAssetId : undefined
          }
          onSelect={(assetId) => selectAsset("imageAssetId", assetId)}
          onClear={() => selectAsset("imageAssetId", undefined)}
          title="Hero image asset"
          description="Select one of the uploaded project assets."
          emptyMessage="Upload an asset in the project assets panel below to use it in this block."
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
          emptyMessage="Upload an asset in the project assets panel below to use it in this block."
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
          emptyMessage="Upload an asset in the project assets panel below to use it in this block."
          clearLabel="Remove dark image"
          selectLabel="Use in dark mode"
          layout="grid"
          compact
        />
      </div>
    </div>
  );
}
