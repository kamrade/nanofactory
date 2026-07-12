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
  getLayoutsSectionPageTitle,
  resolveLayoutsSectionPageKey,
} from "@/app/showcase/_shared/layouts/section-pages";

type LayoutsSectionPageProps = {
  params: Promise<{
    section: string;
  }>;
  searchParams?: Promise<{
    theme?: string | string[];
    mode?: string | string[];
    size?: string | string[];
    borderRadius?: string | string[];
    surfaceStyle?: string | string[];
    headingFont?: string | string[];
  }>;
};

export async function generateMetadata({ params }: LayoutsSectionPageProps): Promise<Metadata> {
  const { section } = await params;
  const resolvedSection = resolveLayoutsSectionPageKey(section);

  return {
    title: `${getLayoutsSectionPageTitle(resolvedSection)} · Layouts Showcase · Nanofactory`,
    description: "Internal layouts showcase for Nanofactory layouts.",
  };
}

export default async function ShowcaseLayoutsSectionPage({ params, searchParams }: LayoutsSectionPageProps) {
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
      activeTab="layouts"
      isAdmin={session?.user?.role === "admin"}
      initialThemeKey={showcaseState.theme}
      initialMode={showcaseState.mode}
      initialFeatureBlocksOptions={initialFeatureBlocksOptions}
      initialComponentState={initialComponentState}
      activeLayoutSection={resolveLayoutsSectionPageKey(section)}
    />
  );
}
