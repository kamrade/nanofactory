"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ProjectRenderer } from "@/components/projects/project-renderer";
import { UIButton } from "@/components/ui/button";
import type { PageContent } from "@/db/schema";
import { DEFAULT_THEME_KEY, THEME_OPTIONS, type ThemeKey } from "@/lib/themes";

type ShowcaseTab = "uikit" | "sections";
type ShowcaseMode = "light" | "dark";

type ShowcaseClientProps = {
  content: PageContent;
  activeTab: ShowcaseTab;
};

export function ShowcaseClient({ content, activeTab }: ShowcaseClientProps) {
  const router = useRouter();
  const [themeKey, setThemeKey] = useState<ThemeKey>(DEFAULT_THEME_KEY);
  const [mode, setMode] = useState<ShowcaseMode>("light");
  const buttonThemes = ["base", "primary"] as const;
  const buttonVariants = ["text", "contained", "outlined"] as const;
  const buttonSizes = ["sm", "lg"] as const;

  function handleTabChange(nextTab: ShowcaseTab) {
    router.push(`/showcase/${nextTab}`);
  }

  return (
    <div>
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-4 text-zinc-900">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">Showcase controls</p>
            <div className="flex flex-wrap items-center gap-2">
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

              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                <span>Mode</span>
                <select
                  name="showcaseMode"
                  value={mode}
                  onChange={(event) => setMode(event.target.value as ShowcaseMode)}
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
            </div>
          </div>

          <div role="tablist" aria-label="Showcase tabs" className="flex flex-wrap items-center gap-2">
            <UIButton
              role="tab"
              aria-selected={activeTab === "uikit"}
              onClick={() => handleTabChange("uikit")}
              theme={activeTab === "uikit" ? "primary" : "base"}
              variant={activeTab === "uikit" ? "contained" : "outlined"}
              size="sm"
            >
              UIKit
            </UIButton>
            <UIButton
              role="tab"
              aria-selected={activeTab === "sections"}
              onClick={() => handleTabChange("sections")}
              theme={activeTab === "sections" ? "primary" : "base"}
              variant={activeTab === "sections" ? "contained" : "outlined"}
              size="sm"
            >
              Sections
            </UIButton>
          </div>
        </div>
      </div>

      {activeTab === "uikit" ? (
        <section data-theme={themeKey} data-mode={mode} className="bg-bg px-4 py-8 text-text-main">
          <div className="mx-auto grid w-full max-w-5xl gap-4 rounded-3xl border border-line bg-surface p-6">
            <h2 className="text-lg font-semibold">UIKit · Buttons</h2>
            <p className="text-sm text-text-muted">
              Themes: <code>base</code>, <code>primary</code> · Variants: <code>text</code>,{" "}
              <code>contained</code>, <code>outlined</code> · Sizes: <code>sm</code>, <code>lg</code>
            </p>

            {buttonThemes.map((buttonTheme) => (
              <div key={buttonTheme} className="grid gap-3">
                <p className="text-sm font-medium capitalize text-text-muted">Theme: {buttonTheme}</p>
                {buttonVariants.map((variant) => (
                  <div key={`${buttonTheme}-${variant}`} className="flex flex-wrap items-center gap-3">
                    <span className="w-20 text-xs uppercase tracking-[0.12em] text-text-placeholder">
                      {variant}
                    </span>
                    {buttonSizes.map((size) => (
                      <UIButton
                        key={`${buttonTheme}-${variant}-${size}`}
                        theme={buttonTheme}
                        variant={variant}
                        size={size}
                      >
                        {buttonTheme} · {variant} · {size}
                      </UIButton>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "sections" ? (
        <ProjectRenderer
          name="Component Showcase"
          themeKey={themeKey}
          mode={mode}
          content={content}
          assets={[]}
        />
      ) : null}
    </div>
  );
}
