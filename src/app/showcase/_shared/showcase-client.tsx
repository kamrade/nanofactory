"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { type UiSize } from "@/app/showcase/_shared/uikit-sections";
import { AnimationsSection } from "@/app/showcase/_shared/animation-sections";
import { ComponentsShowcaseSection } from "@/app/showcase/_shared/components/components-showcase-section";
import { ComponentsSidebarControls } from "@/app/showcase/_shared/components/sidebar-controls";
import {
  COMPONENTS_SECTION_PAGE_KEYS,
  type ComponentsSectionPageKey,
} from "@/app/showcase/_shared/components/section-pages";
import { FeatureBlocksShowcaseSection } from "@/app/showcase/_shared/feature-blocks/showcase-section";
import type { FeatureBlocksOptionState } from "@/app/showcase/_shared/feature-blocks/options-panel";
import {
  DEFAULT_FEATURE_BLOCKS_OPTIONS,
} from "@/app/showcase/_shared/feature-blocks/url-state";
import { LayoutsShowcaseSection } from "@/app/showcase/_shared/layouts/layouts-showcase-section";
import {
  LAYOUTS_SECTION_PAGE_KEYS,
  type LayoutsSectionPageKey,
} from "@/app/showcase/_shared/layouts/section-pages";
import { appendSearchParamsToPath } from "@/app/showcase/_shared/showcase-url-state";
import {
  applyShowcaseStateToSearchParams,
  resolveShowcaseStateFromSearchParams,
} from "@/app/showcase/_shared/showcase-state";
import { FeatureBlocksSidebarControls } from "@/app/showcase/_shared/feature-blocks/sidebar-controls";
import { AppStickyHeader } from "@/components/navigation/app-sticky-header";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UITabs } from "@/components/ui/tabs";
import type { PageContent } from "@/db/schema";
import { DEFAULT_THEME_KEY, THEME_OPTIONS, type ThemeKey } from "@/lib/themes";
import { UI_COOKIE_MAX_AGE, UI_MODE_COOKIE, UI_THEME_COOKIE } from "@/lib/ui-preferences";
import { ShowcaseTabToolbar } from "@/app/showcase/_shared/showcase-tab-toolbar";

type ShowcaseTab = "components" | "layouts" | "animations" | "sections";
type ShowcaseMode = "light" | "dark";
type BorderRadiusOption = "none" | "md" | "lg";

type ShowcaseClientProps = {
  content: PageContent;
  activeTab: ShowcaseTab;
  isAdmin?: boolean;
  initialThemeKey?: ThemeKey;
  initialMode?: ShowcaseMode;
  initialFeatureBlocksOptions?: FeatureBlocksOptionState;
  initialComponentState?: {
    uiSize: UiSize;
    borderRadius: BorderRadiusOption;
  };
  activeComponentSection?: ComponentsSectionPageKey;
  activeLayoutSection?: LayoutsSectionPageKey;
};

export function ShowcaseClient({
  content,
  activeTab,
  isAdmin = false,
  initialThemeKey = DEFAULT_THEME_KEY,
  initialMode = "light",
  initialFeatureBlocksOptions = DEFAULT_FEATURE_BLOCKS_OPTIONS,
  initialComponentState = { uiSize: "sm", borderRadius: "lg" },
  activeComponentSection = COMPONENTS_SECTION_PAGE_KEYS[0],
  activeLayoutSection = LAYOUTS_SECTION_PAGE_KEYS[0],
}: ShowcaseClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [themeKey, setThemeKey] = useState<ThemeKey>(initialThemeKey);
  const [mode, setMode] = useState<ShowcaseMode>(initialMode);
  const [uiSize, setUiSize] = useState<UiSize>(initialComponentState.uiSize);
  const [borderRadius, setBorderRadius] = useState<BorderRadiusOption>(initialComponentState.borderRadius);
  const [featureBlocksOptions, setFeatureBlocksOptions] = useState<FeatureBlocksOptionState>(
    initialFeatureBlocksOptions
  );
  const lastSyncedSearchRef = useRef(searchParams.toString());
  const pendingSearchRef = useRef<string | null>(null);
  const currentSearchString = searchParams.toString();

  const resolvedUrlShowcaseState = resolveShowcaseStateFromSearchParams(
    {
      theme: searchParams.get("theme") ?? undefined,
      mode: searchParams.get("mode") ?? undefined,
      size: searchParams.get("size") ?? undefined,
      borderRadius:
        searchParams.get("borderRadius") ??
        searchParams.get("uiBorderRadius") ??
        searchParams.get("borderRadiusPolicy") ??
        searchParams.get("uiBorderRadiusPolicy") ??
        undefined,
      surfaceStyle: searchParams.get("surfaceStyle") ?? undefined,
      headingFont: searchParams.get("headingFont") ?? undefined,
    },
    {
      theme: themeKey,
      mode,
      size: uiSize,
      borderRadius,
      surfaceStyle: featureBlocksOptions.surfaceStyle,
      headingFont: featureBlocksOptions.headingFont,
    }
  );

  useEffect(() => {
    if (currentSearchString === lastSyncedSearchRef.current) {
      return;
    }

    if (pendingSearchRef.current !== null && currentSearchString !== pendingSearchRef.current) {
      return;
    }

    setThemeKey((current) =>
      current === resolvedUrlShowcaseState.theme ? current : resolvedUrlShowcaseState.theme
    );
    setMode((current) => (current === resolvedUrlShowcaseState.mode ? current : resolvedUrlShowcaseState.mode));
    setUiSize((current) => (current === resolvedUrlShowcaseState.size ? current : resolvedUrlShowcaseState.size));
    setBorderRadius((current) =>
      current === resolvedUrlShowcaseState.borderRadius ? current : resolvedUrlShowcaseState.borderRadius
    );
    setFeatureBlocksOptions((current) => ({
      ...current,
      size: resolvedUrlShowcaseState.size,
      borderRadiusPolicy: resolvedUrlShowcaseState.borderRadius,
      surfaceStyle: resolvedUrlShowcaseState.surfaceStyle,
      headingFont: resolvedUrlShowcaseState.headingFont,
    }));
    lastSyncedSearchRef.current = currentSearchString;
    if (pendingSearchRef.current === currentSearchString) {
      pendingSearchRef.current = null;
    }
  }, [
    currentSearchString,
    resolvedUrlShowcaseState.borderRadius,
    resolvedUrlShowcaseState.headingFont,
    resolvedUrlShowcaseState.mode,
    resolvedUrlShowcaseState.size,
    resolvedUrlShowcaseState.surfaceStyle,
    resolvedUrlShowcaseState.theme,
  ]);

  const showcaseSearchParams = useMemo(() => {
    const nextSearchParams = new URLSearchParams();
    applyShowcaseStateToSearchParams(nextSearchParams, {
      theme: themeKey,
      mode,
      size: activeTab === "sections" ? featureBlocksOptions.size : uiSize,
      borderRadius: activeTab === "sections" ? featureBlocksOptions.borderRadiusPolicy : borderRadius,
      surfaceStyle: featureBlocksOptions.surfaceStyle,
      headingFont: featureBlocksOptions.headingFont,
    });
    return nextSearchParams;
  }, [activeTab, borderRadius, featureBlocksOptions, mode, themeKey, uiSize]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeKey);
    document.documentElement.setAttribute("data-mode", mode);
    document.cookie = `${UI_THEME_COOKIE}=${themeKey}; path=/; max-age=${UI_COOKIE_MAX_AGE}; samesite=lax`;
    document.cookie = `${UI_MODE_COOKIE}=${mode}; path=/; max-age=${UI_COOKIE_MAX_AGE}; samesite=lax`;
  }, [mode, themeKey]);

  useEffect(() => {
    const nextSearchParams = new URLSearchParams();
    applyShowcaseStateToSearchParams(nextSearchParams, {
      theme: themeKey,
      mode,
      size: activeTab === "sections" ? featureBlocksOptions.size : uiSize,
      borderRadius: activeTab === "sections" ? featureBlocksOptions.borderRadiusPolicy : borderRadius,
      surfaceStyle: featureBlocksOptions.surfaceStyle,
      headingFont: featureBlocksOptions.headingFont,
    });

    const nextSearch = nextSearchParams.toString();
    if (nextSearch !== currentSearchString) {
      pendingSearchRef.current = nextSearch;
      router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname);
    }
  }, [activeTab, borderRadius, currentSearchString, featureBlocksOptions, mode, pathname, router, themeKey, uiSize]);

  const cardRadiusByPolicy: Record<BorderRadiusOption, string> = {
    none: "0px",
    md: "0.75rem",
    lg: "1.5rem",
  };
  const showcaseTabs = [
    {
      label: "Components",
      href: appendSearchParamsToPath("/showcase/components/typography-headings", showcaseSearchParams),
      active: activeTab === "components",
    },
    {
      label: "Layouts",
      href: appendSearchParamsToPath("/showcase/layouts/form-layout", showcaseSearchParams),
      active: activeTab === "layouts",
    },
    {
      label: "Animations",
      href: appendSearchParamsToPath("/showcase/animations", showcaseSearchParams),
      active: activeTab === "animations",
    },
    {
      label: "Sections",
      href: appendSearchParamsToPath("/showcase/sections", showcaseSearchParams),
      active: activeTab === "sections",
    },
  ];

  const sidebarControls = (
    <ComponentsSidebarControls
      uiSize={uiSize}
      borderRadius={borderRadius}
      onUiSizeChange={setUiSize}
      onBorderRadiusChange={setBorderRadius}
    />
  );

  return (
    <div
      data-theme={themeKey}
      data-mode={mode}
      className="bg-bg text-text-main"
      style={
        {
          "--showcase-card-radius": cardRadiusByPolicy[borderRadius],
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
        <LayoutsShowcaseSection
          activeSection={activeLayoutSection}
          uiSize={uiSize}
          borderRadius={borderRadius}
          linkSearchParams={showcaseSearchParams}
          topContent={sidebarControls}
        />
      ) : null}

      {activeTab === "animations" ? (
        <AnimationsSection uiSize={uiSize} topContent={sidebarControls} />
      ) : null}

      {activeTab === "components" ? (
        <ComponentsShowcaseSection
          activeSection={activeComponentSection}
          uiSize={uiSize}
          borderRadius={borderRadius}
          topContent={
            <ComponentsSidebarControls
              uiSize={uiSize}
              borderRadius={borderRadius}
              onUiSizeChange={setUiSize}
              onBorderRadiusChange={setBorderRadius}
            />
          }
          linkSearchParams={showcaseSearchParams}
        />
      ) : null}

      {activeTab === "sections" ? (
        <FeatureBlocksShowcaseSection
          content={content}
          themeKey={themeKey}
          mode={mode}
          options={featureBlocksOptions}
          topContent={<FeatureBlocksSidebarControls value={featureBlocksOptions} onChange={setFeatureBlocksOptions} />}
        />
      ) : null}
    </div>
  );
}
