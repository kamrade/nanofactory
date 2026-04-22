import type { Metadata } from "next";

import { ShowcaseClient } from "@/app/showcase/showcase-client";
import { showcaseContent } from "@/app/showcase/showcase-content";
import { DEFAULT_THEME_KEY, isThemeKey } from "@/lib/themes";

export const metadata: Metadata = {
  title: "Sections Showcase · Nanofactory",
  description: "Internal sections showcase for Nanofactory page blocks.",
};

type ShowcaseSectionsPageProps = {
  searchParams?: Promise<{
    theme?: string;
    mode?: string;
  }>;
};

export default async function ShowcaseSectionsPage({ searchParams }: ShowcaseSectionsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestedTheme = resolvedSearchParams.theme;
  const requestedMode = resolvedSearchParams.mode;

  const initialThemeKey = requestedTheme && isThemeKey(requestedTheme) ? requestedTheme : DEFAULT_THEME_KEY;
  const initialMode = requestedMode === "dark" ? "dark" : "light";

  return (
    <ShowcaseClient
      content={showcaseContent}
      activeTab="sections"
      initialThemeKey={initialThemeKey}
      initialMode={initialMode}
    />
  );
}
