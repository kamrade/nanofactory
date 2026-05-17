"use client";

import { useEffect, useRef, useState } from "react";

import { UIButton } from "@/components/ui/button";
import { UISelect } from "@/components/ui/select";
import { useThemeModeFromDom } from "@/hooks/use-theme-mode-from-dom";
import { resolveThemePreference } from "@/lib/ui-preferences";

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
  const { themeKey: domThemeKey } = useThemeModeFromDom({
    rootSelector: "main[data-theme]",
    fallbackThemeKey: resolveThemePreference(initialThemeKey),
  });

  useEffect(() => {
    setThemeKey(initialThemeKey);
  }, [initialThemeKey]);

  useEffect(() => {
    setThemeKey(domThemeKey);
  }, [domThemeKey]);

  function applyTheme(nextThemeKey: string) {
    setThemeKey(nextThemeKey);
    containerRef.current
      ?.closest("main[data-theme]")
      ?.setAttribute("data-theme", nextThemeKey);
  }

  return (
    <div>
      
      <form action={action} className="flex items-end gap-2">
        <label className="text-sm text-text-muted w-full">
          <span>Theme</span>
          <div ref={containerRef} className="w-full">
        <UISelect
          key={initialThemeKey}
          ariaLabel="Theme"
          size="sm"
          value={themeKey}
              onValueChange={applyTheme}
              
              options={options.map((theme) => ({
                value: theme.key,
                label: theme.label,
                textValue: theme.label,
              }))}
            />
          </div>
        </label>
        <input type="hidden" name="themeKey" value={themeKey} />
        <UIButton type="submit" theme="base" variant="outlined" size="sm">
          Apply theme
        </UIButton>
      </form>
    </div>
  );
}
