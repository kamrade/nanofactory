import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ShowcaseClient } from "@/app/showcase/_shared/showcase-client";
import { resolveFeatureBlocksOptionsFromSearchParams } from "@/app/showcase/_shared/feature-blocks/url-state";
import { getServerAuthSession } from "@/auth";
import { showcaseContent } from "@/app/showcase/_shared/showcase-content";
import { UI_MODE_COOKIE, UI_THEME_COOKIE, resolveModePreference, resolveThemePreference } from "@/lib/ui-preferences";

export const metadata: Metadata = {
  title: "Feature Blocks Showcase · Nanofactory",
  description: "Internal feature blocks showcase for Nanofactory page blocks.",
};

type ShowcaseSectionsPageProps = {
  searchParams?: Promise<{
    borderRadius?: string | string[];
    spacingScale?: string | string[];
    surfaceStyle?: string | string[];
    headingFont?: string | string[];
  }>;
};

export default async function ShowcaseSectionsPage({ searchParams }: ShowcaseSectionsPageProps) {
  const session = await getServerAuthSession();
  const cookieStore = await cookies();
  const initialThemeKey = resolveThemePreference(cookieStore.get(UI_THEME_COOKIE)?.value);
  const initialMode = resolveModePreference(cookieStore.get(UI_MODE_COOKIE)?.value);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialFeatureBlocksOptions = resolveFeatureBlocksOptionsFromSearchParams(resolvedSearchParams);

  return (
    <ShowcaseClient
      content={showcaseContent}
      activeTab="sections"
      isAdmin={session?.user?.role === "admin"}
      initialThemeKey={initialThemeKey}
      initialMode={initialMode}
      initialFeatureBlocksOptions={initialFeatureBlocksOptions}
    />
  );
}
