"use client";

import { Card } from "@/components/ui/card";
import { UICheckbox } from "@/components/ui/checkbox";
import { UIFormRow } from "@/components/ui/form-row";
import { UISelect } from "@/components/ui/select";
import { UISegmentedControl } from "@/components/ui/segmented-control";

import { AssetPicker } from "../../shared/editor/asset-picker";
import { DebouncedTextArea, DebouncedTextInput } from "../../shared/editor/debounced-text-field";
import type { BlockEditorProps } from "../../shared/types";

type HeroFieldKey =
  | "eyebrow"
  | "title"
  | "subtitle"
  | "buttonText"
  | "buttonAnchor"
  | "buttonTargetType"
  | "contentPosition";

type HeroAssetKey = "imageAssetId" | "imageLightAssetId" | "imageDarkAssetId";

type HeroTextFieldConfig = {
  key: Extract<HeroFieldKey, "eyebrow" | "title" | "subtitle" | "buttonText">;
  label: string;
  inputId: string;
  placeholder: string;
  inputKind: "input" | "textarea";
  inputSize: "sm" | "lg";
};

type HeroAssetPickerConfig = {
  key: HeroAssetKey;
  title: string;
  description: string;
  emptyMessage: string;
  clearLabel?: string;
  selectLabel?: string;
};

type HeroEditorConfig = {
  testId: string;
  buttonTextLabel: string;
  buttonTextInputId: string;
  buttonTextPlaceholder: string;
  buttonTextSize: "sm" | "lg";
  buttonAnchorInputId: string;
  buttonTargetTypeInputId: string;
  animateInputId: string;
  contentPositionInputId: string;
  textFields: HeroTextFieldConfig[];
  contentPositionOptions: Array<{
    value: string;
    label: string;
    textValue: string;
  }>;
  assetPickers: HeroAssetPickerConfig[];
};

function readStringProp(props: Record<string, unknown>, key: string) {
  return typeof props[key] === "string" ? props[key] : "";
}

function renderTextField(
  field: HeroTextFieldConfig,
  value: string,
  onValueChange: (value: string) => void
) {
  if (field.inputKind === "textarea") {
    return (
      <DebouncedTextArea
        id={field.inputId}
        size={field.inputSize}
        borderless
        value={value}
        placeholder={field.placeholder}
        onCommit={onValueChange}
      />
    );
  }

  return (
    <DebouncedTextInput
      id={field.inputId}
      size={field.inputSize}
      value={value}
      borderless
      placeholder={field.placeholder}
      onCommit={onValueChange}
    />
  );
}

export function HeroBaseEditor({
  block,
  assets,
  onChange,
  availableAnchors = [],
  config,
}: BlockEditorProps & { config: HeroEditorConfig }) {
  const eyebrow = readStringProp(block.props, "eyebrow");
  const title = readStringProp(block.props, "title");
  const subtitle = readStringProp(block.props, "subtitle");
  const buttonText = readStringProp(block.props, "buttonText");
  const buttonAnchor = readStringProp(block.props, "buttonAnchor");
  const buttonTargetType =
    block.props.buttonTargetType === "link" ||
    (block.props.buttonTargetType !== "inner-anchor" &&
      /^(#|\/|https?:\/\/|mailto:|tel:)/i.test(buttonAnchor.trim()))
      ? "link"
      : "inner-anchor";
  const contentPosition = readStringProp(block.props, "contentPosition") || "centered";
  // Backward compat: the flag was previously stored as `animateMainText`.
  const animate = block.props.animate === true || block.props.animateMainText === true;

  const fieldValues: Record<HeroTextFieldConfig["key"], string> = {
    eyebrow,
    title,
    subtitle,
    buttonText,
  };

  function updateField(key: HeroFieldKey, value: string) {
    onChange({
      ...block.props,
      [key]: value,
    });
  }

  function updateBooleanField(key: "animate", value: boolean) {
    onChange({
      ...block.props,
      [key]: value,
    });
  }

  function selectAsset(key: HeroAssetKey, assetId?: string) {
    onChange({
      ...block.props,
      [key]: assetId,
    });
  }

  return (
    <div data-testid={config.testId}>
      <Card className="bg-surface">
        <div className="grid gap-0">
          {config.textFields.map((field) => (
            <UIFormRow key={field.key} label={field.label} htmlFor={field.inputId} borderless>
              {renderTextField(field, fieldValues[field.key], (value) => updateField(field.key, value))}
            </UIFormRow>
          ))}

          <UIFormRow label={config.buttonTextLabel} htmlFor={config.buttonTextInputId} borderless>
            <DebouncedTextInput
              id={config.buttonTextInputId}
              size={config.buttonTextSize}
              value={buttonText}
              borderless
              placeholder={config.buttonTextPlaceholder}
              onCommit={(value) => updateField("buttonText", value)}
            />
          </UIFormRow>

          <UIFormRow label="Button target" borderless>
            <UISegmentedControl
              value={buttonTargetType}
              ariaLabel="Hero button target"
              size="sm"
              borderless
              className="w-full"
              onValueChange={(value) => updateField("buttonTargetType", value)}
              options={[
                { value: "inner-anchor", label: "Inner anchor" },
                { value: "link", label: "Link" },
              ]}
            />
          </UIFormRow>

          <UIFormRow
            label={buttonTargetType === "link" ? "Button link" : "Button anchor"}
            htmlFor={config.buttonAnchorInputId}
            borderless
          >
            {buttonTargetType === "link" ? (
              <DebouncedTextInput
                id={config.buttonAnchorInputId}
                size="sm"
                value={buttonAnchor}
                borderless
                placeholder="https://example.com or /contact"
                onCommit={(value) => updateField("buttonAnchor", value)}
              />
            ) : (
              <UISelect
                id={config.buttonAnchorInputId}
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
            )}
          </UIFormRow>

          <UIFormRow label="Animate" htmlFor={config.animateInputId} borderless>
            <UICheckbox
              id={config.animateInputId}
              checked={animate}
              onChange={(event) => updateBooleanField("animate", event.currentTarget.checked)}
            />
          </UIFormRow>

          <UIFormRow label="Content position" htmlFor={config.contentPositionInputId} borderless>
            <UISelect
              id={config.contentPositionInputId}
              ariaLabel="Hero content position"
              size="sm"
              borderless
              className="w-full"
              value={contentPosition}
              onValueChange={(value) => updateField("contentPosition", String(value))}
              options={config.contentPositionOptions}
            />
          </UIFormRow>
        </div>
      </Card>

      <div className="grid gap-4 py-5">
        {config.assetPickers.map((picker) => (
          <AssetPicker
            key={picker.key}
            assets={assets}
            selectedAssetId={
              typeof block.props[picker.key] === "string" ? String(block.props[picker.key]) : undefined
            }
            onSelect={(assetId) => selectAsset(picker.key, assetId)}
            onClear={() => selectAsset(picker.key, undefined)}
            title={picker.title}
            description={picker.description}
            emptyMessage={picker.emptyMessage}
            clearLabel={picker.clearLabel}
            selectLabel={picker.selectLabel}
            layout="grid"
            compact
          />
        ))}
      </div>
    </div>
  );
}
