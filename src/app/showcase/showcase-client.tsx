"use client";

import { useEffect, useState } from "react";

import { DialogDemoCard, MarkdownDemoCard, ModalDemoCard } from "@/app/showcase/demo-cards";
import {
  ControlsAndMenusSection,
  FeedbackAndSheetSection,
  FormLayoutSection,
  InputsSection,
  type UiSize,
  TypographyButtonsBadgesSection,
} from "@/app/showcase/uikit-sections";
import { AppStickyHeader } from "@/components/navigation/app-sticky-header";
import { ProjectRenderer } from "@/components/projects/project-renderer";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UITabs } from "@/components/ui/tabs";
import type { PageContent } from "@/db/schema";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_THEME_KEY, THEME_OPTIONS, type ThemeKey } from "@/lib/themes";
import { UI_COOKIE_MAX_AGE, UI_MODE_COOKIE, UI_THEME_COOKIE } from "@/lib/ui-preferences";

type ShowcaseTab = "uikit" | "sections";
type ShowcaseMode = "light" | "dark";

type ShowcaseClientProps = {
  content: PageContent;
  activeTab: ShowcaseTab;
  isAdmin?: boolean;
  initialThemeKey?: ThemeKey;
  initialMode?: ShowcaseMode;
};

export function ShowcaseClient({
  content,
  activeTab,
  isAdmin = false,
  initialThemeKey = DEFAULT_THEME_KEY,
  initialMode = "light",
}: ShowcaseClientProps) {
  const { showToast, clearToasts } = useToast();
  const [themeKey, setThemeKey] = useState<ThemeKey>(initialThemeKey);
  const [mode, setMode] = useState<ShowcaseMode>(initialMode);
  const [uiSize, setUiSize] = useState<UiSize>("sm");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeKey);
    document.documentElement.setAttribute("data-mode", mode);
    document.cookie = `${UI_THEME_COOKIE}=${themeKey}; path=/; max-age=${UI_COOKIE_MAX_AGE}; samesite=lax`;
    document.cookie = `${UI_MODE_COOKIE}=${mode}; path=/; max-age=${UI_COOKIE_MAX_AGE}; samesite=lax`;
  }, [mode, themeKey]);

  return (
    <div data-theme={themeKey} data-mode={mode} className="bg-bg text-text-main">
      <AppStickyHeader
        isAdmin={isAdmin}
        revealOnScrollUp
        controls={
          <>
            <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <span>Theme</span>
              <UISegmentedControl
                ariaLabel="Showcase theme"
                value={themeKey}
                onValueChange={setThemeKey}
                options={THEME_OPTIONS.map((theme) => ({ value: theme.key, label: theme.label }))}
              />
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <span>Mode</span>
              <UISegmentedControl
                ariaLabel="Showcase mode"
                value={mode}
                onValueChange={setMode}
                options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
              />
            </div>

            {activeTab === "uikit" ? (
              <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
                <span>Size</span>
                <UISegmentedControl
                  ariaLabel="UIKit size"
                  value={uiSize}
                  onValueChange={setUiSize}
                  options={[{ value: "sm", label: "Small" }, { value: "lg", label: "Large" }]}
                />
              </div>
            ) : null}
          </>
        }
      />

      <div className="pt-4">
        <div className="mx-auto container px-4">
          <UITabs
            ariaLabel="Showcase tabs"
            items={[
              { label: "UIKit", href: "/showcase/uikit", active: activeTab === "uikit" },
              { label: "Sections", href: "/showcase/sections", active: activeTab === "sections" },
            ]}
          />
        </div>
      </div>

      {activeTab === "uikit" ? (
        <section className="bg-bg py-8 text-text-main">
          <div className="mx-auto grid container px-4 gap-8">
            <TypographyButtonsBadgesSection uiSize={uiSize} />
            <ControlsAndMenusSection uiSize={uiSize} />
            <InputsSection uiSize={uiSize} />
            <FormLayoutSection uiSize={uiSize} />
            <FeedbackAndSheetSection uiSize={uiSize} showToast={showToast} clearToasts={clearToasts} />
            <DialogDemoCard uiSize={uiSize} />
            <ModalDemoCard uiSize={uiSize} />
            <MarkdownDemoCard />
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
