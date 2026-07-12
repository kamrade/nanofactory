import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ShowcaseClient } from "@/app/showcase/_shared/showcase-client";
import { resolveComponentsShowcaseStateFromSearchParams } from "@/app/showcase/_shared/components/url-state";
import { resolveFeatureBlocksOptionsFromSearchParams } from "@/app/showcase/_shared/feature-blocks/url-state";
import { getServerAuthSession } from "@/auth";
import { showcaseContent } from "@/app/showcase/_shared/showcase-content";
import { resolveShowcaseStateFromSearchParams } from "@/app/showcase/_shared/showcase-url-state";
import { UI_MODE_COOKIE, UI_THEME_COOKIE, resolveModePreference, resolveThemePreference } from "@/lib/ui-preferences";
import {
  getComponentsSectionPageTitle,
  resolveComponentsSectionPageKey,
} from "@/app/showcase/_shared/components/section-pages";

type ComponentsSectionPageProps = {
  params: Promise<{
    section: string;
  }>;
  searchParams?: Promise<{
    theme?: string | string[];
    mode?: string | string[];
    size?: string | string[];
    borderRadius?: string | string[];
    spacingScale?: string | string[];
    surfaceStyle?: string | string[];
    headingFont?: string | string[];
  }>;
};

export async function generateMetadata({ params }: ComponentsSectionPageProps): Promise<Metadata> {
  const { section } = await params;
  const resolvedSection = resolveComponentsSectionPageKey(section);

  return {
    title: `${getComponentsSectionPageTitle(resolvedSection)} · Components Showcase · Nanofactory`,
    description: "Internal components showcase for Nanofactory components.",
  };
}

export default async function ShowcaseComponentsSectionPage({ params, searchParams }: ComponentsSectionPageProps) {
  const { section } = await params;
  const session = await getServerAuthSession();
  const cookieStore = await cookies();
  const initialThemeKey = resolveThemePreference(cookieStore.get(UI_THEME_COOKIE)?.value);
  const initialMode = resolveModePreference(cookieStore.get(UI_MODE_COOKIE)?.value);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const showcaseState = resolveShowcaseStateFromSearchParams(resolvedSearchParams, {
    theme: initialThemeKey,
    mode: initialMode,
  });
  const initialComponentState = resolveComponentsShowcaseStateFromSearchParams(resolvedSearchParams);
  const initialFeatureBlocksOptions = resolveFeatureBlocksOptionsFromSearchParams(resolvedSearchParams);

  return (
    <ShowcaseClient
      content={showcaseContent}
      activeTab="components"
      isAdmin={session?.user?.role === "admin"}
      initialThemeKey={showcaseState.theme}
      initialMode={showcaseState.mode}
      initialFeatureBlocksOptions={initialFeatureBlocksOptions}
      initialComponentState={initialComponentState}
      activeComponentSection={resolveComponentsSectionPageKey(section)}
    />
  );
}
