import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ShowcaseClient } from "@/app/showcase/showcase-client";
import { COMPONENTS_SECTION_PAGE_KEYS } from "./section-pages";
import { getServerAuthSession } from "@/auth";
import { showcaseContent } from "@/app/showcase/showcase-content";
import { UI_MODE_COOKIE, UI_THEME_COOKIE, resolveModePreference, resolveThemePreference } from "@/lib/ui-preferences";

export const metadata: Metadata = {
  title: "Components Showcase · Nanofactory",
  description: "Internal components showcase for Nanofactory components.",
};

export default async function ShowcaseComponentsIndexPage() {
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
      activeComponentSection={COMPONENTS_SECTION_PAGE_KEYS[0]}
    />
  );
}
