"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ProjectRenderer } from "@/components/projects/project-renderer";
import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UICheckbox } from "@/components/ui/checkbox";
import { UISwitcher } from "@/components/ui/switcher";
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
  const [isSmallButtonSize, setIsSmallButtonSize] = useState(true);
  const [switcherValues, setSwitcherValues] = useState({
    enabled: true,
  });

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
          <div className="mx-auto grid w-full max-w-5xl gap-8">
            <UICard title="Typography · Headings">
              <div className="grid gap-3">
                <div>
                  <h1 className="text-h1">Pride and Prejudice</h1>
                </div>
                <div>
                  <h2 className="text-h2 text-text-placeholder">Chapter I</h2>
                </div>
                <div>
                  <h3 className="text-h3">It is a truth universally acknowledged</h3>
                </div>
                <div>
                  <p>It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.</p>
                </div>
              </div>
            </UICard>

            <UICard title="UIKit · Buttons">
              <p className="text-sm text-text-muted">
                Themes: <code>base</code>, <code>primary</code> · Variants: <code>text</code>,{" "}
                <code>contained</code>, <code>outlined</code> · Sizes: <code>sm</code>, <code>lg</code>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <UISwitcher
                  checked={isSmallButtonSize}
                  onCheckedChange={setIsSmallButtonSize}
                  label={`Small: ${isSmallButtonSize ? "yes" : "no"}`}
                />
              </div>

              {buttonThemes.map((buttonTheme) => (
                <div key={buttonTheme} className="grid gap-3">
                  <p className="text-sm font-medium capitalize text-text-muted">Theme: {buttonTheme}</p>
                  {buttonVariants.map((variant) => (
                    <div key={`${buttonTheme}-${variant}`} className="flex flex-wrap items-center gap-3">
                      <span className="w-20 text-xs uppercase tracking-[0.12em] text-text-placeholder">
                        {variant}
                      </span>
                      <UIButton
                        key={`${buttonTheme}-${variant}-${isSmallButtonSize ? "sm" : "lg"}`}
                        theme={buttonTheme}
                        variant={variant}
                        size={isSmallButtonSize ? "sm" : "lg"}
                      >
                        {buttonTheme} · {variant} · {isSmallButtonSize ? "sm" : "lg"}
                      </UIButton>
                    </div>
                  ))}
                </div>
              ))}
            </UICard>

            <UICard title="UIKit · Checkbox">
              <div className="flex flex-wrap items-center gap-6">
                <UICheckbox defaultChecked label="Default checkbox" />
                <UICheckbox label="Unchecked checkbox" />
                <UICheckbox defaultChecked disabled label="Disabled" />
              </div>
            </UICard>

            <UICard title="UIKit · Switcher">
              <p className="text-sm text-text-muted">
                Single size
              </p>

              <div className="grid gap-3">
                <div className="flex flex-wrap items-center gap-6">
                  <UISwitcher
                    checked={switcherValues.enabled}
                    onCheckedChange={(checked) =>
                      setSwitcherValues((prev) => ({ ...prev, enabled: checked }))
                    }
                    label="Enabled"
                  />
                  <UISwitcher checked disabled label="Disabled" />
                </div>
              </div>
            </UICard>
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
