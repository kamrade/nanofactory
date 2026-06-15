"use client";

import { useEffect, useRef, useState, useTransition } from "react";

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
  showLabel?: boolean;
  borderless?: boolean;
};

export function ProjectThemeForm({
  initialThemeKey,
  options,
  action,
  showLabel = true,
  borderless = false,
}: ProjectThemeFormProps) {
  const [themeKey, setThemeKey] = useState(initialThemeKey);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, startTransition] = useTransition();
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
    if (nextThemeKey === themeKey) {
      return;
    }
    setThemeKey(nextThemeKey);
    containerRef.current
      ?.closest("main[data-theme]")
      ?.setAttribute("data-theme", nextThemeKey);
    startTransition(() => {
      const formData = new FormData();
      formData.set("themeKey", nextThemeKey);
      void action(formData);
    });
  }

  const select = (
    <div ref={containerRef} className="w-full">
      <UISelect
        key={initialThemeKey}
        ariaLabel="Theme"
        size="sm"
        value={themeKey}
        onValueChange={applyTheme}
        borderless={borderless}
        options={options.map((theme) => ({
          value: theme.key,
          label: theme.label,
          textValue: theme.label,
        }))}
      />
    </div>
  );

  if (!showLabel) {
    return select;
  }

  return (
    <div className="flex items-end gap-2">
      <label className="text-sm text-text-muted w-full">
        <span>Theme</span>
        {select}
      </label>
    </div>
  );
}
