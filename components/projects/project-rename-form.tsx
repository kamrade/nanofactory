"use client";

import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";

import { UIButton } from "@/components/ui/button";
import { UIModalForm } from "@/components/ui/modal";
import { UITextInput } from "@/components/ui/text-input";

type ProjectRenameFormProps = {
  initialName: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function ProjectRenameForm({ initialName, action }: ProjectRenameFormProps) {
  const [name, setName] = useState(initialName);

  return (
    <UIModalForm
      size="md"
      action={action}
      trigger={
        <UIButton theme="base" variant="outlined" size="sm">
          <FiEdit2 aria-hidden className="h-4 w-4" />
          <span>Rename</span>
        </UIButton>
      }
      title="Rename project"
      description="Update the project name shown in dashboard and project header."
      submitLabel="Save name"
    >
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Project name</span>
        <UITextInput
          name="name"
          value={name}
          onValueChange={setName}
          size="sm"
          placeholder="Project name"
          required
        />
      </label>
    </UIModalForm>
  );
}
