"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { DialogDemoCard, MarkdownDemoCard, ModalDemoCard } from "@/app/showcase/demo-cards";
import {
  AccordionSection,
  ControlsAndMenusSection,
  BorderlessFormLayoutSection,
  FeedbackAndSheetSection,
  FormLayoutSection,
  InputsSection,
  TimelineSection,
  type UiSize,
  TypographyButtonsBadgesSection,
} from "@/app/showcase/uikit-sections";
import { AnimationsSection } from "@/app/showcase/animation-sections";
import { animationsSectionNavItems } from "@/app/showcase/animation-sections/nav";
import { FeatureBlocksShowcaseSection } from "@/app/showcase/feature-blocks/showcase-section";
import type { FeatureBlocksOptionState } from "@/app/showcase/feature-blocks/options-panel";
import { uikitSectionNavItems } from "@/app/showcase/uikit-sections/nav";
import { UikitSidebar } from "@/app/showcase/uikit-sidebar";
import { ShowcaseSidebarControls } from "@/app/showcase/showcase-sidebar-controls";
import { AppStickyHeader } from "@/components/navigation/app-sticky-header";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UITabs } from "@/components/ui/tabs";
import type { PageContent } from "@/db/schema";
import { useToast } from "@/hooks/use-toast";
import {
  PROJECT_BORDER_RADIUS_POLICIES,
  type ProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";
import { DEFAULT_THEME_KEY, THEME_OPTIONS, type ThemeKey } from "@/lib/themes";
import { UI_COOKIE_MAX_AGE, UI_MODE_COOKIE, UI_THEME_COOKIE } from "@/lib/ui-preferences";

type ShowcaseTab = "uikit" | "animations" | "sections";
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
    { label: "UIKit", href: "/showcase/uikit", active: activeTab === "uikit" },
    { label: "Animations", href: "/showcase/animations", active: activeTab === "animations" },
    { label: "Sections", href: "/showcase/sections", active: activeTab === "sections" },
  ];
  const showcaseSidebarControls = (
    <ShowcaseSidebarControls
      uiSize={uiSize}
      onUiSizeChange={setUiSize}
      borderRadiusPolicy={borderRadiusPolicy}
      onBorderRadiusPolicyChange={setBorderRadiusPolicy}
    />
  );

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

      <div className="pt-4">
        <div className="mx-auto container px-4">
          <UITabs ariaLabel="Showcase tabs" items={showcaseTabs} />
        </div>
      </div>

      {activeTab === "uikit" ? (
        <section className="bg-bg py-8 text-text-main">
          <div className="mx-auto container px-4">
            <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
              <UikitSidebar
                sections={uikitSectionNavItems}
                ariaLabel="UIKit sections"
                topContent={showcaseSidebarControls}
              />
              <div className="grid gap-8">
                <TypographyButtonsBadgesSection uiSize={uiSize} />
                <ControlsAndMenusSection uiSize={uiSize} />
                <AccordionSection uiSize={uiSize} />
                <TimelineSection uiSize={uiSize} borderRadiusPolicy={borderRadiusPolicy} />
                <InputsSection uiSize={uiSize} />
                <FormLayoutSection uiSize={uiSize} />
                <BorderlessFormLayoutSection uiSize={uiSize} />
                <FeedbackAndSheetSection uiSize={uiSize} showToast={showToast} clearToasts={clearToasts} />
                <DialogDemoCard uiSize={uiSize} />
                <ModalDemoCard uiSize={uiSize} />
                <MarkdownDemoCard />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "animations" ? (
        <section className="bg-bg py-8 text-text-main">
          <div className="mx-auto container px-4">
            <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
              <UikitSidebar
                sections={animationsSectionNavItems}
                title="Animations"
                ariaLabel="Animations sections"
                topContent={showcaseSidebarControls}
              />
              <AnimationsSection uiSize={uiSize} />
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "sections" ? (
        <FeatureBlocksShowcaseSection
          content={content}
          themeKey={themeKey}
          mode={mode}
          options={featureBlocksOptions}
          onOptionsChange={setFeatureBlocksOptions}
        />
      ) : null}
    </div>
  );
}
