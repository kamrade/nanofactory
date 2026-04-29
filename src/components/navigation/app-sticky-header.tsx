"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { UIStickyHeader } from "@/components/ui/sticky-header";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { THEME_OPTIONS, type ThemeKey } from "@/lib/themes";
import {
  UI_COOKIE_MAX_AGE,
  UI_MODE_COOKIE,
  UI_THEME_COOKIE,
  resolveModePreference,
  resolveThemePreference,
  type UiMode,
} from "@/lib/ui-preferences";

type AppStickyHeaderProps = {
  isAdmin?: boolean;
  controls?: ReactNode;
  revealOnScrollUp?: boolean;
  initialThemeKey?: ThemeKey;
  initialMode?: UiMode;
};

function linkClass(active: boolean) {
  return [
    "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition",
    active
      ? "border-text-main bg-surface text-text-main"
      : "border-line bg-surface-alt text-text-muted hover:border-text-placeholder hover:text-text-main",
  ].join(" ");
}

function DashboardThemeModeControls({
  themeKey,
  mode,
  onThemeChange,
  onModeChange,
}: {
  themeKey: ThemeKey;
  mode: UiMode;
  onThemeChange: (value: ThemeKey) => void;
  onModeChange: (value: UiMode) => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
        <span>Theme</span>
        <UISegmentedControl
          ariaLabel="Theme"
          value={themeKey}
          onValueChange={onThemeChange}
          options={THEME_OPTIONS.map((theme) => ({
            value: theme.key,
            label: theme.label,
          }))}
        />
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
        <span>Mode</span>
        <UISegmentedControl
          ariaLabel="Mode"
          value={mode}
          onValueChange={onModeChange}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </div>
    </>
  );
}

export function AppStickyHeader({
  isAdmin = false,
  controls,
  revealOnScrollUp = false,
  initialThemeKey,
  initialMode,
}: AppStickyHeaderProps) {
  const pathname = usePathname();
  const isProjectPreview = /^\/projects\/[^/]+\/preview$/.test(pathname);
  const isProjectSettingsPage = /^\/projects\/[^/]+$/.test(pathname);
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/projects/");
  const isShowcase = pathname.startsWith("/showcase");
  const isBgLab = pathname.startsWith("/background-library");
  const showThemeModeControls = pathname === "/dashboard" || pathname.startsWith("/background-library");
  const [themeKey, setThemeKey] = useState<ThemeKey>(() =>
    resolveThemePreference(initialThemeKey)
  );
  const [mode, setMode] = useState<UiMode>(() => resolveModePreference(initialMode));

  useEffect(() => {
    setThemeKey(resolveThemePreference(initialThemeKey));
  }, [initialThemeKey]);

  useEffect(() => {
    setMode(resolveModePreference(initialMode));
  }, [initialMode]);

  function applyUiPreference(nextTheme: ThemeKey, nextMode: UiMode) {
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.setAttribute("data-mode", nextMode);
    document.cookie = `${UI_THEME_COOKIE}=${nextTheme}; path=/; max-age=${UI_COOKIE_MAX_AGE}; samesite=lax`;
    document.cookie = `${UI_MODE_COOKIE}=${nextMode}; path=/; max-age=${UI_COOKIE_MAX_AGE}; samesite=lax`;
  }

  function handleThemeChange(value: ThemeKey) {
    setThemeKey(value);
    applyUiPreference(value, mode);
  }

  function handleModeChange(value: UiMode) {
    setMode(value);
    applyUiPreference(themeKey, value);
  }

  if (isProjectPreview || isProjectSettingsPage) {
    return null;
  }

  return (
    <UIStickyHeader revealOnScrollUp={revealOnScrollUp}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap items-center gap-2" aria-label="Primary">
          <Link href="/dashboard" className={linkClass(isDashboard)}>
            Dashboard
          </Link>
          <Link href="/showcase/uikit" className={linkClass(isShowcase)}>
            Showcase
          </Link>
          {isAdmin ? (
            <Link href="/background-library" className={linkClass(isBgLab)}>
              BG Lab
            </Link>
          ) : null}
        </nav>

        {controls ? <div className="flex flex-wrap items-center gap-2">{controls}</div> : null}
        {!controls && showThemeModeControls ? (
          <div className="flex flex-wrap items-center gap-2">
            <DashboardThemeModeControls
              themeKey={themeKey}
              mode={mode}
              onThemeChange={handleThemeChange}
              onModeChange={handleModeChange}
            />
          </div>
        ) : null}
      </div>
    </UIStickyHeader>
  );
}
