import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ShowcaseClient } from "@/app/showcase/_shared/showcase-client";
import { COMPONENTS_SECTION_PAGE_KEYS } from "@/app/showcase/_shared/components/section-pages";
import { resolveComponentsShowcaseStateFromSearchParams } from "@/app/showcase/_shared/components/url-state";
import { resolveFeatureBlocksOptionsFromSearchParams } from "@/app/showcase/_shared/feature-blocks/url-state";
import { getServerAuthSession } from "@/auth";
import { showcaseContent } from "@/app/showcase/_shared/showcase-content";
import { resolveShowcaseStateFromSearchParams } from "@/app/showcase/_shared/showcase-url-state";
import { UI_MODE_COOKIE, UI_THEME_COOKIE, resolveModePreference, resolveThemePreference } from "@/lib/ui-preferences";

export const metadata: Metadata = {
  title: "Showcase · Nanofactory",
  description: "Internal showcase for Nanofactory components.",
};

type ShowcaseIndexPageProps = {
  searchParams?: Promise<{
    theme?: string | string[];
    mode?: string | string[];
    size?: string | string[];
    borderRadius?: string | string[];
    surfaceStyle?: string | string[];
    headingFont?: string | string[];
  }>;
};

export default async function ShowcaseIndexPage({ searchParams }: ShowcaseIndexPageProps) {
  const session = await getServerAuthSession();
  const cookieStore = await cookies();
  const initialThemeKey = resolveThemePreference(cookieStore.get(UI_THEME_COOKIE)?.value);
  const initialMode = resolveModePreference(cookieStore.get(UI_MODE_COOKIE)?.value);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const showcaseState = resolveShowcaseStateFromSearchParams(resolvedSearchParams, {
    theme: initialThemeKey,
    mode: initialMode,
  });
  const initialFeatureBlocksOptions = resolveFeatureBlocksOptionsFromSearchParams(resolvedSearchParams);
  const initialComponentState = resolveComponentsShowcaseStateFromSearchParams(resolvedSearchParams);

  return (
    <ShowcaseClient
      content={showcaseContent}
      activeTab="components"
      isAdmin={session?.user?.role === "admin"}
      initialThemeKey={showcaseState.theme}
      initialMode={showcaseState.mode}
      initialFeatureBlocksOptions={initialFeatureBlocksOptions}
      initialComponentState={initialComponentState}
      activeComponentSection={COMPONENTS_SECTION_PAGE_KEYS[0]}
    />
  );
}
