"use client";

import { useEffect, useState, type CSSProperties } from "react";

import {
  BorderlessFormLayoutSection,
  FormLayoutSection,
  type UiSize,
} from "@/app/showcase/uikit-sections";
import { AnimationsSection } from "@/app/showcase/animation-sections";
import { animationsSectionNavItems } from "@/app/showcase/animation-sections/nav";
import { ComponentsShowcaseSection } from "@/app/showcase/components/components-showcase-section";
import { COMPONENTS_SECTION_PAGE_KEYS, type ComponentsSectionPageKey } from "@/app/showcase/components/section-pages";
import { FeatureBlocksShowcaseSection } from "@/app/showcase/feature-blocks/showcase-section";
import type { FeatureBlocksOptionState } from "@/app/showcase/feature-blocks/options-panel";
import { FeatureBlocksOptionsPanel } from "@/app/showcase/feature-blocks/options-panel";
import { LayoutsShowcaseSection } from "@/app/showcase/layouts/layouts-showcase-section";
import { LAYOUTS_SECTION_PAGE_KEYS, type LayoutsSectionPageKey } from "@/app/showcase/layouts/section-pages";
import { ShowcaseSidebar } from "@/app/showcase/showcase-sidebar";
import { ShowcaseTabSettings } from "@/app/showcase/showcase-tab-settings";
import { ShowcaseTabToolbar } from "@/app/showcase/showcase-tab-toolbar";
import { AppStickyHeader } from "@/components/navigation/app-sticky-header";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UITabs } from "@/components/ui/tabs";
import type { PageContent } from "@/db/schema";
import {
  PROJECT_BORDER_RADIUS_POLICIES,
  type ProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";
import { DEFAULT_THEME_KEY, THEME_OPTIONS, type ThemeKey } from "@/lib/themes";
import { UI_COOKIE_MAX_AGE, UI_MODE_COOKIE, UI_THEME_COOKIE } from "@/lib/ui-preferences";

type ShowcaseTab = "components" | "layouts" | "animations" | "sections";
type ShowcaseMode = "light" | "dark";

type ShowcaseClientProps = {
  content: PageContent;
  activeTab: ShowcaseTab;
  isAdmin?: boolean;
  initialThemeKey?: ThemeKey;
  initialMode?: ShowcaseMode;
  activeComponentSection?: ComponentsSectionPageKey;
  activeLayoutSection?: LayoutsSectionPageKey;
};

export function ShowcaseClient({
  content,
  activeTab,
  isAdmin = false,
  initialThemeKey = DEFAULT_THEME_KEY,
  initialMode = "light",
  activeComponentSection = COMPONENTS_SECTION_PAGE_KEYS[0],
  activeLayoutSection = LAYOUTS_SECTION_PAGE_KEYS[0],
}: ShowcaseClientProps) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(initialThemeKey);
  const [mode, setMode] = useState<ShowcaseMode>(initialMode);
  const [uiSize, setUiSize] = useState<UiSize>("sm");
  const [borderRadiusPolicy, setBorderRadiusPolicy] = useState<ProjectBorderRadiusPolicy>("lg");
  const [featureBlocksOptions, setFeatureBlocksOptions] = useState<FeatureBlocksOptionState>({
    borderRadiusPolicy: "lg",
    spacingScale: "md",
    surfaceStyle: "default",
    headingFont: "onest",
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeKey);
    document.documentElement.setAttribute("data-mode", mode);
    document.cookie = `${UI_THEME_COOKIE}=${themeKey}; path=/; max-age=${UI_COOKIE_MAX_AGE}; samesite=lax`;
    document.cookie = `${UI_MODE_COOKIE}=${mode}; path=/; max-age=${UI_COOKIE_MAX_AGE}; samesite=lax`;
  }, [mode, themeKey]);

  const cardRadiusByPolicy: Record<ProjectBorderRadiusPolicy, string> = {
    none: "0px",
    md: "0.75rem",
    lg: "1.5rem",
  };
  const showcaseTabs = [
    { label: "Components", href: "/showcase/components/typography-headings", active: activeTab === "components" },
    { label: "Layouts", href: "/showcase/layouts/form-layout", active: activeTab === "layouts" },
    { label: "Animations", href: "/showcase/animations", active: activeTab === "animations" },
    { label: "Sections", href: "/showcase/sections", active: activeTab === "sections" },
  ];
  return (
    <div
      data-theme={themeKey}
      data-mode={mode}
      className="bg-bg text-text-main"
      style={
        {
          "--showcase-card-radius": cardRadiusByPolicy[borderRadiusPolicy],
        } as CSSProperties
      }
    >
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

          </>
        }
      />

      <ShowcaseTabToolbar>
        <UITabs ariaLabel="Showcase tabs" items={showcaseTabs} />
      </ShowcaseTabToolbar>

      {activeTab === "layouts" ? (
        <>
          <ShowcaseTabToolbar>
            <ShowcaseTabSettings
              uiSize={uiSize}
              borderRadiusPolicy={borderRadiusPolicy}
              onUiSizeChange={setUiSize}
              onBorderRadiusPolicyChange={setBorderRadiusPolicy}
            />
          </ShowcaseTabToolbar>
          <LayoutsShowcaseSection activeSection={activeLayoutSection} uiSize={uiSize} />
        </>
      ) : null}

      {activeTab === "animations" ? (
        <>
          <ShowcaseTabToolbar>
            <ShowcaseTabSettings
              uiSize={uiSize}
              borderRadiusPolicy={borderRadiusPolicy}
              onUiSizeChange={setUiSize}
              onBorderRadiusPolicyChange={setBorderRadiusPolicy}
            />
          </ShowcaseTabToolbar>
          <section className="bg-bg py-8 text-text-main">
            <div className="mx-auto container px-4">
              <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
                <ShowcaseSidebar sections={animationsSectionNavItems} title="Animations" ariaLabel="Animations sections" />
                <AnimationsSection uiSize={uiSize} />
              </div>
            </div>
          </section>
        </>
      ) : null}

      {activeTab === "components" ? (
        <>
          <ShowcaseTabToolbar>
            <ShowcaseTabSettings
              uiSize={uiSize}
              borderRadiusPolicy={borderRadiusPolicy}
              onUiSizeChange={setUiSize}
              onBorderRadiusPolicyChange={setBorderRadiusPolicy}
            />
          </ShowcaseTabToolbar>
          <ComponentsShowcaseSection activeSection={activeComponentSection} uiSize={uiSize} />
        </>
      ) : null}

      {activeTab === "sections" ? (
        <>
          <ShowcaseTabToolbar>
            <FeatureBlocksOptionsPanel value={featureBlocksOptions} onChange={setFeatureBlocksOptions} />
          </ShowcaseTabToolbar>
          <FeatureBlocksShowcaseSection content={content} themeKey={themeKey} mode={mode} options={featureBlocksOptions} />
        </>
      ) : null}
    </div>
  );
}
