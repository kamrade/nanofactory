"use client";

import { useRef, useState } from "react";

import { UIButton } from "@/components/ui/button";
import { UISegmentedControl } from "@/components/ui/segmented-control";

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
  const containerRef = useRef<HTMLDivElement | null>(null);

  function applyTheme(nextThemeKey: string) {
    setThemeKey(nextThemeKey);
    containerRef.current
      ?.closest("main[data-theme]")
      ?.setAttribute("data-theme", nextThemeKey);
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <div ref={containerRef}>
        <UISegmentedControl
        ariaLabel="Theme"
        size="sm"
        value={themeKey}
        onValueChange={applyTheme}
        options={options.map((theme) => ({
          value: theme.key,
          label: theme.label,
        }))}
      />
      </div>
      <input type="hidden" name="themeKey" value={themeKey} />
      <UIButton type="submit" theme="base" variant="outlined" size="sm">
        Apply theme
      </UIButton>
    </form>
  );
}
