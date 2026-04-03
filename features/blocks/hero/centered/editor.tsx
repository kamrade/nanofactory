"use client";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";

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
      <div className="grid gap-5 rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Centered hero copy
          </h4>
          <p className="text-sm leading-6 text-zinc-600">
            Lead with the headline first. Keep the subtitle tight and the CTA short.
          </p>
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Headline</span>
          <input
            type="text"
            value={title}
            placeholder="Ship a polished launch page this week"
            onChange={(event) => updateField("title", event.target.value)}
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base outline-none transition focus:border-zinc-400"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Supporting copy</span>
          <textarea
            value={subtitle}
            rows={4}
            placeholder="Lead with a focused headline, support it with one strong paragraph, and keep the call to action visible."
            onChange={(event) => updateField("subtitle", event.target.value)}
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">CTA label</span>
          <input
            type="text"
            value={buttonText}
            placeholder="See how it works"
            onChange={(event) => updateField("buttonText", event.target.value)}
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          />
        </label>
      </div>

      <div className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Optional image
          </h4>
          <p className="text-sm leading-6 text-zinc-600">
            This variant works without media. Add an image only when it strengthens the
            centered message.
          </p>
        </div>

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
