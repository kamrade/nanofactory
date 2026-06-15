"use client";

import { useRef, useState } from "react";

import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UICheckbox } from "@/components/ui/checkbox";
import {
  UIDialog,
  UIDialogContent,
  UIDialogDescription,
  UIDialogFooter,
  UIDialogHeader,
  UIDialogTitle,
} from "@/components/ui/dialog";
import { UIMultiSelect } from "@/components/ui/multi-select";
import { UISegmentedControl } from "@/components/ui/segmented-control";
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
  const segmentedContainerRef = useRef<HTMLDivElement | null>(null);
  const multiSelectContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectValue, setSelectValue] = useState("react");
  const [nameValue, setNameValue] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [switcherEnabled, setSwitcherEnabled] = useState(true);
  const [appearance, setAppearance] = useState<"light" | "dark">("light");
  const [tags, setTags] = useState<string[]>(["nextjs", "typescript"]);
  const [showErrors, setShowErrors] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const errors = {
    framework: selectValue.trim().length > 0 ? "" : "Framework is required.",
    projectName: nameValue.trim().length > 0 ? "" : "Project name is required.",
    published: isPublished ? "" : "Please confirm Published.",
    liveMode: switcherEnabled ? "" : "Live mode must be enabled.",
    appearance: appearance ? "" : "Appearance is required.",
    tags: tags.length > 0 ? "" : "Select at least one tag.",
  };

  const isValid = Object.values(errors).every((message) => message.length === 0);

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
      <UikitSectionAnchor id="form-layout">
        <UICard title="UIKit · Form Layout (Label Left)">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FormRow
              label="Framework"
              labelId="framework-label"
              onLabelClick={() => focusFirstButton(selectContainerRef.current)}
              error={showErrors ? errors.framework : undefined}
            >
              <div ref={selectContainerRef}>
                <UISelect
                  size={uiSize}
                  value={selectValue}
                  onValueChange={setSelectValue}
                  invalid={showErrors && !!errors.framework}
                  validationState={showErrors && errors.framework ? "error" : "default"}
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
              label="Project name"
              labelId="project-name-label"
              htmlFor="project-name-field"
              error={showErrors ? errors.projectName : undefined}
            >
              <UITextInput
                id="project-name-field"
                size={uiSize}
                value={nameValue}
                onValueChange={setNameValue}
                invalid={showErrors && !!errors.projectName}
                validationState={showErrors && errors.projectName ? "error" : "default"}
                placeholder="Type project name"
              />
            </FormRow>

            <FormRow
              label="Published"
              labelId="published-label"
              htmlFor="published-field"
              error={showErrors ? errors.published : undefined}
            >
              <UICheckbox
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
              error={showErrors ? errors.liveMode : undefined}
            >
              <UISwitcher
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
              error={showErrors ? errors.appearance : undefined}
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

            <FormRow
              label="Tags"
              labelId="tags-label"
              onLabelClick={() => focusFirstButton(multiSelectContainerRef.current)}
              error={showErrors ? errors.tags : undefined}
            >
              <div ref={multiSelectContainerRef}>
                <UIMultiSelect
                  ariaLabel="Tags"
                  size={uiSize}
                  searchable
                  clearable
                  invalid={showErrors && !!errors.tags}
                  validationState={showErrors && errors.tags ? "error" : "default"}
                  searchPlaceholder="Search tags..."
                  value={tags}
                  onValueChange={setTags}
                  options={[
                    { value: "nextjs", label: "Next.js", textValue: "next js" },
                    { value: "typescript", label: "TypeScript", textValue: "typescript" },
                    { value: "tailwind", label: "Tailwind CSS", textValue: "tailwind" },
                    { value: "drizzle", label: "Drizzle ORM", textValue: "drizzle" },
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
                  projectName: nameValue,
                  published: isPublished,
                  liveMode: switcherEnabled,
                  appearance,
                  tags,
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
