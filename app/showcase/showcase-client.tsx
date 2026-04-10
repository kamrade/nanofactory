"use client";

import { useState } from "react";

import { ProjectRenderer } from "@/components/projects/project-renderer";
import type { PageContent } from "@/db/schema";
import { DEFAULT_THEME_KEY, THEME_OPTIONS, type ThemeKey } from "@/lib/themes";

type ShowcaseClientProps = {
  content: PageContent;
};

export function ShowcaseClient({ content }: ShowcaseClientProps) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(DEFAULT_THEME_KEY);

  return (
    <div>
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-4 text-zinc-900">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">Showcase controls</p>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <span>Theme</span>
            <select
              name="showcaseThemeKey"
              value={themeKey}
              onChange={(event) => setThemeKey(event.target.value as ThemeKey)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            >
              {THEME_OPTIONS.map((theme) => (
                <option key={theme.key} value={theme.key}>
                  {theme.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <ProjectRenderer
        name="Component Showcase"
        themeKey={themeKey}
        content={content}
        assets={[]}
      />
    </div>
  );
}
