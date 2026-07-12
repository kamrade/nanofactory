import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ShowcaseClient } from "@/app/showcase/_shared/showcase-client";
import { getServerAuthSession } from "@/auth";
import { showcaseContent } from "@/app/showcase/_shared/showcase-content";
import { UI_MODE_COOKIE, UI_THEME_COOKIE, resolveModePreference, resolveThemePreference } from "@/lib/ui-preferences";
import { LAYOUTS_SECTION_PAGE_KEYS } from "@/app/showcase/_shared/layouts/section-pages";

export const metadata: Metadata = {
  title: "Layouts Showcase · Nanofactory",
  description: "Internal layouts showcase for Nanofactory layouts.",
};

export default async function ShowcaseLayoutsIndexPage() {
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
      activeLayoutSection={LAYOUTS_SECTION_PAGE_KEYS[0]}
    />
  );
}
