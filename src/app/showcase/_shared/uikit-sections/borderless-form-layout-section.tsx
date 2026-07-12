"use client";

import { useRef, useState } from "react";

import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UICheckbox } from "@/components/ui/checkbox";
import { UIAutocomplete } from "@/components/ui/autocomplete";
import {
  UIDialog,
  UIDialogContent,
  UIDialogDescription,
  UIDialogFooter,
  UIDialogHeader,
  UIDialogTitle,
} from "@/components/ui/dialog";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UISelect } from "@/components/ui/select";
import { UISlider } from "@/components/ui/slider";
import { UISwitcher } from "@/components/ui/switcher";
import { UIFormRow } from "@/components/ui/form-row";
import { UITextInput } from "@/components/ui/text-input";
import { UIMultiSelect } from "@/components/ui/multi-select";

import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "./types";

export function BorderlessFormLayoutSection({ uiSize }: { uiSize: UiSize }) {
  const selectContainerRef = useRef<HTMLDivElement | null>(null);
  const autocompleteContainerRef = useRef<HTMLDivElement | null>(null);
  const multiSelectContainerRef = useRef<HTMLDivElement | null>(null);
  const segmentedContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectValue, setSelectValue] = useState("react");
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteSelection, setAutocompleteSelection] = useState("none");
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>(["react"]);
  const [intensityValue, setIntensityValue] = useState(65);
  const [nameValue, setNameValue] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [switcherEnabled, setSwitcherEnabled] = useState(true);
  const [appearance, setAppearance] = useState<"light" | "dark">("light");
  const [showErrors, setShowErrors] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const frameworkError = selectValue.trim().length > 0 ? "" : "Framework is required.";
  const projectNameError = nameValue.trim().length > 0 ? "" : "Project name is required.";
  const publishedError = isPublished ? "" : "Please confirm Published.";
  const liveModeError = switcherEnabled ? "" : "Live mode must be enabled.";
  const appearanceError = appearance ? "" : "Appearance is required.";

  const isValid =
    frameworkError.length === 0 &&
    projectNameError.length === 0 &&
    publishedError.length === 0 &&
    liveModeError.length === 0 &&
    appearanceError.length === 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowErrors(true);

    if (!isValid) {
      return;
    }

    setIsResultOpen(true);
  }

  function focusFirstButton(container: HTMLDivElement | null) {
    container?.querySelector<HTMLButtonElement>("button")?.focus();
  }

  return (
    <>
      <UikitSectionAnchor id="form-layout-borderless-inputs">
        <UICard title="Form Layout (Label Left, Borderless Inputs)">
          <form className="grid" onSubmit={handleSubmit}>
            
            {/* SELECT */}
            <UIFormRow
              label="Framework"
              labelId="framework-label-borderless"
              onLabelClick={() => focusFirstButton(selectContainerRef.current)}
              error={showErrors ? frameworkError : undefined}
              underline
              contentClassName="max-w-none"
            >
              <div ref={selectContainerRef}>
                <UISelect
                  size={uiSize}
                  value={selectValue}
                  onValueChange={setSelectValue}
                  invalid={showErrors && !!frameworkError}
                  validationState={showErrors && frameworkError ? "error" : "default"}
                  borderless
                  placeholder="Select framework"
                  options={[
                    { value: "react", label: "React", textValue: "react" },
                    { value: "nextjs", label: "Next.js", textValue: "next js" },
                    { value: "svelte", label: "Svelte", textValue: "svelte" },
                    { value: "vue", label: "Vue", textValue: "vue" },
                  ]}
                />
              </div>
            </UIFormRow>

            <UIFormRow
              label="Framework search"
              labelId="framework-search-label-borderless"
              onLabelClick={() => focusFirstButton(autocompleteContainerRef.current)}
              error={undefined}
              underline
              contentClassName="max-w-none"
            >
              <div ref={autocompleteContainerRef}>
                <UIAutocomplete
                  size={uiSize}
                  value={autocompleteValue}
                  onValueChange={setAutocompleteValue}
                  onSelect={(item) => setAutocompleteSelection(item.value)}
                  borderless
                  clearable
                  placeholder="Type to filter frameworks..."
                  ariaLabel="Framework autocomplete borderless"
                  items={[
                    { value: "react", label: "React" },
                    { value: "nextjs", label: "Next.js", textValue: "next js" },
                    { value: "svelte", label: "Svelte" },
                    { value: "vue", label: "Vue" },
                    { value: "solid", label: "Solid", disabled: true },
                  ]}
                />
              </div>
            </UIFormRow>

            <UIFormRow
              label="Framework tags"
              labelId="framework-tags-label-borderless"
              onLabelClick={() => focusFirstButton(multiSelectContainerRef.current)}
              error={undefined}
              underline
              contentClassName="max-w-none"
            >
              <div ref={multiSelectContainerRef}>
                <UIMultiSelect
                  size={uiSize}
                  value={multiSelectValue}
                  onValueChange={setMultiSelectValue}
                  borderless
                  searchable
                  clearable
                  searchPlaceholder="Search options..."
                  ariaLabel="Framework multi select borderless"
                  options={[
                    { value: "react", label: "React" },
                    { value: "nextjs", label: "Next.js", textValue: "next js" },
                    { value: "typescript", label: "TypeScript" },
                    { value: "tailwind", label: "Tailwind CSS" },
                    { value: "drizzle", label: "Drizzle ORM", disabled: true },
                  ]}
                />
              </div>
            </UIFormRow>

            <UIFormRow
              label="Intensity"
              labelId="intensity-label-borderless"
              error={undefined}
              underline
              contentClassName="max-w-none"
            >
              <UISlider
                ariaLabel="Intensity"
                value={intensityValue}
                onValueChange={setIntensityValue}
                min={0}
                max={100}
                step={1}
                showValue
                valueFormatter={(value) => `${value}%`}
              />
            </UIFormRow>

            {/* TEXTINPUT */}
            <UIFormRow
              label="Project name"
              labelId="project-name-label-borderless"
              htmlFor="project-name-field-borderless"
              error={showErrors ? projectNameError : undefined}
              underline
              contentClassName="max-w-none"
            >
              <UITextInput
                id="project-name-field-borderless"
                size={uiSize}
                value={nameValue}
                onValueChange={setNameValue}
                invalid={showErrors && !!projectNameError}
                validationState={showErrors && projectNameError ? "error" : "default"}
                borderless
                placeholder="Type project name"
              />
            </UIFormRow>

            {/* CHECKBOX */}
            <UIFormRow
              label="Published"
              labelId="published-label-borderless"
              htmlFor="published-field-borderless"
              error={showErrors ? publishedError : undefined}
              underline
            >
              <UICheckbox
                size={uiSize}
                id="published-field-borderless"
                checked={isPublished}
                onChange={(event) => setIsPublished(event.currentTarget.checked)}
                aria-label="Published"
              />
            </UIFormRow>

            {/* SWITCHER */}
            <UIFormRow
              label="Live mode"
              labelId="live-mode-label-borderless"
              htmlFor="live-mode-field-borderless"
              error={showErrors ? liveModeError : undefined}
              underline
            >
              <UISwitcher
                size={uiSize}
                id="live-mode-field-borderless"
                aria-labelledby="live-mode-label-borderless"
                checked={switcherEnabled}
                onCheckedChange={setSwitcherEnabled}
                aria-label="Live mode"
              />
            </UIFormRow>

            {/* SEGMENTED CONTROL */}
            <UIFormRow
              label="Appearance"
              labelId="appearance-label-borderless"
              onLabelClick={() => focusFirstButton(segmentedContainerRef.current)}
              error={showErrors ? appearanceError : undefined}
              underline
            >
              <div ref={segmentedContainerRef}>
                <UISegmentedControl
                  ariaLabel="Appearance"
                  size={uiSize}
                  value={appearance}
                  onValueChange={setAppearance}
                  borderless
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                  ]}
                />
              </div>
            </UIFormRow>

            <div className="pt-2">
              <UIButton type="submit" size={uiSize} theme="primary" variant="contained">
                Submit
              </UIButton>
            </div>
          </form>
        </UICard>
      </UikitSectionAnchor>

      <UIDialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <UIDialogContent className="max-w-xl" ariaLabel="Submitted form data">
          <UIDialogHeader>
            <UIDialogTitle>Form submitted</UIDialogTitle>
            <UIDialogDescription>All required fields are valid.</UIDialogDescription>
          </UIDialogHeader>
          <div className="mt-4 rounded-xl border border-line bg-surface-alt p-4 text-sm text-text-main">
            <pre className="overflow-auto whitespace-pre-wrap wrap-break-word">
              {JSON.stringify(
                {
                  framework: selectValue,
                  frameworkSearch: autocompleteValue,
                  frameworkSearchSelected: autocompleteSelection,
                  frameworkTags: multiSelectValue,
                  projectName: nameValue,
                  published: isPublished,
                  liveMode: switcherEnabled,
                  appearance,
                },
                null,
                2
              )}
            </pre>
          </div>
          <UIDialogFooter>
            <UIButton type="button" size={uiSize} theme="base" variant="outlined" onClick={() => setIsResultOpen(false)}>
              Close
            </UIButton>
          </UIDialogFooter>
        </UIDialogContent>
      </UIDialog>
    </>
  );
}
