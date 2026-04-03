"use client";

import type { BlockFieldDefinition, BlockEditorProps } from "./types";
import { AssetPicker } from "./asset-picker";

function readFieldValue(
  props: Record<string, unknown>,
  field: BlockFieldDefinition
) {
  const value = props[field.key];

  if (field.kind === "string-list") {
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string").join("\n")
      : "";
  }

  return typeof value === "string" ? value : "";
}

export function GenericBlockEditor({
  block,
  assets,
  definition,
  onChange,
}: BlockEditorProps) {
  function handleUpdateField(field: BlockFieldDefinition, nextValue: string) {
    onChange({
      ...block.props,
      [field.key]:
        field.kind === "string-list"
          ? nextValue
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
          : nextValue,
    });
  }

  function handleSelectAsset(assetId?: string) {
    onChange({
      ...block.props,
      imageAssetId: assetId,
    });
  }

  return (
    <div className="grid gap-4">
      {definition.fields.map((field) => {
        const value = readFieldValue(block.props, field);

        return (
          <label key={field.key} className="grid gap-1.5 text-sm">
            <span className="font-medium text-zinc-700">{field.label}</span>
            {field.kind === "textarea" || field.kind === "string-list" ? (
              <textarea
                value={value}
                rows={field.kind === "string-list" ? 5 : 4}
                placeholder={field.placeholder}
                onChange={(event) => handleUpdateField(field, event.target.value)}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            ) : (
              <input
                type="text"
                value={value}
                placeholder={field.placeholder}
                onChange={(event) => handleUpdateField(field, event.target.value)}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
            )}
            {field.kind === "string-list" ? (
              <span className="text-xs text-zinc-500">Enter one list item per line.</span>
            ) : null}
          </label>
        );
      })}

      {definition.supportsAssetSelection ? (
        <AssetPicker
          assets={assets}
          selectedAssetId={
            typeof block.props.imageAssetId === "string" ? block.props.imageAssetId : undefined
          }
          onSelect={handleSelectAsset}
          onClear={() => handleSelectAsset(undefined)}
          title="Hero image asset"
          description="Select one of the uploaded project assets. The editor stores only the asset id in `content_json`."
          emptyMessage="Upload an asset in the project assets panel below to use it in this block."
        />
      ) : null}
    </div>
  );
}
