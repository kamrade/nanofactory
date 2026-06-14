"use client";

import type { BlockFieldDefinition, BlockEditorProps } from "./types";
import { EditorFieldRow } from "@/components/editor/editor-field-row";
import { AssetPicker } from "./asset-picker";
import { UITextInput } from "@/components/ui/text-input";
import { Card } from "@/components/ui/card";

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
    <Card>
      <div className="grid gap-4">
        {definition.fields.map((field) => {
          const value = readFieldValue(block.props, field);
          const fieldId = `generic-field-${field.key}`;

          return field.kind === "textarea" || field.kind === "string-list" ? (
            <EditorFieldRow key={field.key} label={field.label} htmlFor={fieldId}>
              <div className="grid gap-1.5">
                <textarea
                  id={fieldId}
                  value={value}
                  rows={field.kind === "string-list" ? 5 : 4}
                  placeholder={field.placeholder}
                  onChange={(event) => handleUpdateField(field, event.target.value)}
                  className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
                />
                {field.kind === "string-list" ? (
                  <span className="text-xs text-text-muted">Enter one list item per line.</span>
                ) : null}
              </div>
            </EditorFieldRow>
          ) : (
            <EditorFieldRow key={field.key} label={field.label} htmlFor={fieldId}>
              <UITextInput
                id={fieldId}
                size="sm"
                value={value}
                placeholder={field.placeholder}
                onValueChange={(nextValue) => handleUpdateField(field, nextValue)}
              />
            </EditorFieldRow>
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
    </Card>
  );
}
