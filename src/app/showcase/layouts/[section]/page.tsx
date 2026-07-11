import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ShowcaseClient } from "@/app/showcase/showcase-client";
import { getServerAuthSession } from "@/auth";
import { showcaseContent } from "@/app/showcase/showcase-content";
import { UI_MODE_COOKIE, UI_THEME_COOKIE, resolveModePreference, resolveThemePreference } from "@/lib/ui-preferences";

import { getLayoutsSectionPageTitle, resolveLayoutsSectionPageKey } from "../section-pages";

type LayoutsSectionPageProps = {
  params: Promise<{
    section: string;
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

export default async function ShowcaseLayoutsSectionPage({ params }: LayoutsSectionPageProps) {
  const { section } = await params;
  const session = await getServerAuthSession();
  const cookieStore = await cookies();
  const initialThemeKey = resolveThemePreference(cookieStore.get(UI_THEME_COOKIE)?.value);
  const initialMode = resolveModePreference(cookieStore.get(UI_MODE_COOKIE)?.value);

  return (
    <ShowcaseClient
      content={showcaseContent}
      activeTab="layouts"
      isAdmin={session?.user?.role === "admin"}
      initialThemeKey={initialThemeKey}
      initialMode={initialMode}
      activeLayoutSection={resolveLayoutsSectionPageKey(section)}
    />
  );
}
