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
import { UIMultiSelect } from "@/components/ui/multi-select";
import { UISelect } from "@/components/ui/select";
import { UISwitcher } from "@/components/ui/switcher";
import { UITextInput } from "@/components/ui/text-input";

import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "./types";

type FormRowProps = {
  label: string;
  labelId?: string;
  htmlFor?: string;
  onLabelClick?: () => void;
  error?: string;
  children: React.ReactNode;
};

function FormRow({ label, labelId, htmlFor, onLabelClick, error, children }: FormRowProps) {
  return (
    <div className="grid gap-1.5 md:grid-cols-[12rem_minmax(0,1fr)] md:items-start md:gap-4">
      {htmlFor ? (
        <label id={labelId} htmlFor={htmlFor} className="text-sm font-medium text-text-muted">
          {label}
        </label>
      ) : (
        <button
          type="button"
          id={labelId}
          onClick={onLabelClick}
          className="text-left text-sm font-medium text-text-muted"
        >
          {label}
        </button>
      )}
      <div className="max-w-xl">
        {children}
        {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
      </div>
    </div>
  );
}

export function FormLayoutSection({ uiSize }: { uiSize: UiSize }) {
  const selectContainerRef = useRef<HTMLDivElement | null>(null);
  const multiSelectContainerRef = useRef<HTMLDivElement | null>(null);
  const segmentedContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectValue, setSelectValue] = useState("react");
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteSelection, setAutocompleteSelection] = useState("none");
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>(["react", "typescript"]);
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

  function focusFirstFocusable(container: HTMLDivElement | null) {
    container?.querySelector<HTMLElement>("input, button")?.focus();
  }

  return (
    <>
      <UikitSectionAnchor id="form-layout">
        <UICard title="UIKit · Form Layout (Label Left)">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FormRow
              label="Framework"
              labelId="framework-label"
              onLabelClick={() => focusFirstButton(selectContainerRef.current)}
              error={showErrors ? frameworkError : undefined}
            >
              <div ref={selectContainerRef}>
                <UISelect
                  size={uiSize}
                  value={selectValue}
                  onValueChange={setSelectValue}
                  invalid={showErrors && !!frameworkError}
                  validationState={showErrors && frameworkError ? "error" : "default"}
                  placeholder="Select framework"
                  options={[
                    { value: "react", label: "React", textValue: "react" },
                    { value: "nextjs", label: "Next.js", textValue: "next js" },
                    { value: "svelte", label: "Svelte", textValue: "svelte" },
                    { value: "vue", label: "Vue", textValue: "vue" },
                  ]}
                />
              </div>
            </FormRow>

            <FormRow
              label="Framework search"
              labelId="framework-search-label"
              htmlFor="framework-search-field"
              error={undefined}
            >
              <UIAutocomplete
                id="framework-search-field"
                size={uiSize}
                value={autocompleteValue}
                onValueChange={setAutocompleteValue}
                onSelect={(item) => setAutocompleteSelection(item.value)}
                placeholder="Type to filter frameworks..."
                clearable
                items={[
                  { value: "react", label: "React" },
                  { value: "nextjs", label: "Next.js", textValue: "next js" },
                  { value: "svelte", label: "Svelte" },
                  { value: "vue", label: "Vue" },
                  { value: "solid", label: "Solid", disabled: true },
                ]}
              />
            </FormRow>

            <FormRow
              label="Framework tags"
              labelId="framework-tags-label"
              onLabelClick={() => focusFirstFocusable(multiSelectContainerRef.current)}
              error={undefined}
            >
              <div ref={multiSelectContainerRef}>
                <UIMultiSelect
                  size={uiSize}
                  value={multiSelectValue}
                  onValueChange={setMultiSelectValue}
                  searchable
                  clearable
                  searchPlaceholder="Search options..."
                  ariaLabel="Framework multi select"
                  options={[
                    { value: "react", label: "React" },
                    { value: "nextjs", label: "Next.js", textValue: "next js" },
                    { value: "typescript", label: "TypeScript" },
                    { value: "tailwind", label: "Tailwind CSS" },
                    { value: "drizzle", label: "Drizzle ORM", disabled: true },
                  ]}
                />
              </div>
            </FormRow>

            <FormRow
              label="Project name"
              labelId="project-name-label"
              htmlFor="project-name-field"
              error={showErrors ? projectNameError : undefined}
            >
              <UITextInput
                id="project-name-field"
                size={uiSize}
                value={nameValue}
                onValueChange={setNameValue}
                invalid={showErrors && !!projectNameError}
                validationState={showErrors && projectNameError ? "error" : "default"}
                placeholder="Type project name"
              />
            </FormRow>

            <FormRow
              label="Published"
              labelId="published-label"
              htmlFor="published-field"
              error={showErrors ? publishedError : undefined}
            >
              <UICheckbox
                size={uiSize}
                id="published-field"
                checked={isPublished}
                onChange={(event) => setIsPublished(event.currentTarget.checked)}
                aria-label="Published"
              />
            </FormRow>

            <FormRow
              label="Live mode"
              labelId="live-mode-label"
              htmlFor="live-mode-field"
              error={showErrors ? liveModeError : undefined}
            >
              <UISwitcher
                size={uiSize}
                id="live-mode-field"
                aria-labelledby="live-mode-label"
                checked={switcherEnabled}
                onCheckedChange={setSwitcherEnabled}
                aria-label="Live mode"
              />
            </FormRow>

            <FormRow
              label="Appearance"
              labelId="appearance-label"
              onLabelClick={() => focusFirstButton(segmentedContainerRef.current)}
              error={showErrors ? appearanceError : undefined}
            >
              <div ref={segmentedContainerRef}>
                <UISegmentedControl
                  ariaLabel="Appearance"
                  size={uiSize}
                  value={appearance}
                  onValueChange={setAppearance}
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                  ]}
                />
              </div>
            </FormRow>

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
