"use client";

import { useState, type FormEvent } from "react";
import { FiEdit2 } from "react-icons/fi";

import { UIButton } from "@/components/ui/button";
import { UIModalForm } from "@/components/ui/modal";
import { UITextInput } from "@/components/ui/text-input";

type ProjectRenameFormProps = {
  initialName: string;
  initialSlug: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function ProjectRenameForm({ initialName, initialSlug, action }: ProjectRenameFormProps) {
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(initialSlug);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const nameIsValid = name.trim().length > 0;
  const slugIsValid = /^[A-Za-z0-9-]+$/.test(slug);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setSubmitAttempted(true);

    if (!nameIsValid || !slugIsValid) {
      event.preventDefault();
    }
  }

  return (
    <UIModalForm
      data-testid="ProjectNameDialog"
      size="md"
      action={action}
      trigger={
        <UIButton theme="base" variant="outlined" size="sm">
          <FiEdit2 aria-hidden className="h-4 w-4" />
          <span>Rename</span>
        </UIButton>
      }
      title="Rename project"
      submitLabel="Save changes"
      onSubmit={handleSubmit}
    >
      <label className="grid gap-1 text-sm mb-3">
        <span className="font-medium text-text-main">Project name</span>
        <UITextInput
          name="name"
          value={name}
          onValueChange={setName}
          invalid={submitAttempted && !nameIsValid}
          size="lg"
          placeholder="Project name"
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-text-main">Project slug</span>
        <UITextInput
          name="slug"
          value={slug}
          onValueChange={setSlug}
          invalid={submitAttempted && !slugIsValid}
          size="lg"
          placeholder="project-slug"
          pattern="[A-Za-z0-9-]+"
          title="Use only Latin letters, numbers, and hyphens"
          required
        />
        <span
          className={
            submitAttempted && !slugIsValid ? "text-xs text-danger-text" : "text-sm text-text-muted"
          }
        >
          Only Latin letters, numbers, and hyphens. No spaces.
        </span>
      </label>
    </UIModalForm>
  );
}
