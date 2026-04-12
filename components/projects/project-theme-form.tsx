"use client";

import { useState } from "react";

import { UIButton } from "@/components/ui/button";
import { UISelect } from "@/components/ui/select";

type ThemeOption = {
  key: string;
  label: string;
};

type ProjectThemeFormProps = {
  initialThemeKey: string;
  options: ThemeOption[];
  action: (formData: FormData) => void | Promise<void>;
};

export function ProjectThemeForm({
  initialThemeKey,
  options,
  action,
}: ProjectThemeFormProps) {
  const [themeKey, setThemeKey] = useState(initialThemeKey);

  return (
    <form action={action} className="flex items-center gap-2">
      <UISelect
        ariaLabel="Theme"
        value={themeKey}
        onValueChange={setThemeKey}
        options={options.map((theme) => ({
          value: theme.key,
          label: theme.label,
          textValue: theme.label,
        }))}
        size="sm"
        name="themeKey"
      />
      <UIButton type="submit" theme="base" variant="outlined" size="sm">
        Apply theme
      </UIButton>
    </form>
  );
}
