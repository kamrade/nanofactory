import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ShowcaseClient } from "@/app/showcase/showcase-client";
import { getServerAuthSession } from "@/auth";
import { showcaseContent } from "@/app/showcase/showcase-content";
import { UI_MODE_COOKIE, UI_THEME_COOKIE, resolveModePreference, resolveThemePreference } from "@/lib/ui-preferences";

import { getComponentsSectionPageTitle, resolveComponentsSectionPageKey } from "../section-pages";

type ComponentsSectionPageProps = {
  params: Promise<{
    section: string;
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

export default async function ShowcaseComponentsSectionPage({ params }: ComponentsSectionPageProps) {
  const { section } = await params;
  const session = await getServerAuthSession();
  const cookieStore = await cookies();
  const initialThemeKey = resolveThemePreference(cookieStore.get(UI_THEME_COOKIE)?.value);
  const initialMode = resolveModePreference(cookieStore.get(UI_MODE_COOKIE)?.value);

  return (
    <ShowcaseClient
      content={showcaseContent}
      activeTab="components"
      isAdmin={session?.user?.role === "admin"}
      initialThemeKey={initialThemeKey}
      initialMode={initialMode}
      activeComponentSection={resolveComponentsSectionPageKey(section)}
    />
  );
}
