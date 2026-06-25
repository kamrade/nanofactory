"use client";

import type { BlockFieldDefinition, BlockEditorProps } from "../types";
import { AssetPicker } from "./asset-picker";
import { UIFormRow } from "@/components/ui/form-row";
import { UITextInput } from "@/components/ui/text-input";
import { UITextArea } from "@/components/ui/textarea";
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
      <div className="grid gap-0">
        {definition.fields.map((field) => {
          const value = readFieldValue(block.props, field);
          const fieldId = `generic-field-${field.key}`;

          return field.kind === "textarea" || field.kind === "string-list" ? (
            <UIFormRow key={field.key} label={field.label} htmlFor={fieldId} borderless>
              <div className="grid gap-1.5">
                <UITextArea
                  id={fieldId}
                  size="lg"
                  borderless
                  value={value}
                  rows={field.kind === "string-list" ? 5 : 4}
                  placeholder={field.placeholder}
                  onChange={(event) => handleUpdateField(field, event.target.value)}
                />
                {field.kind === "string-list" ? (
                  <span className="text-xs text-text-muted">Enter one list item per line.</span>
                ) : null}
              </div>
            </UIFormRow>
          ) : (
            <UIFormRow key={field.key} label={field.label} htmlFor={fieldId} borderless>
              <UITextInput
                id={fieldId}
                size="sm"
                borderless
                value={value}
                placeholder={field.placeholder}
                onValueChange={(nextValue) => handleUpdateField(field, nextValue)}
              />
            </UIFormRow>
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
