import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getServerAuthSession } from "@/auth";
import { AppStickyHeader } from "@/components/navigation/app-sticky-header";
import { UI_MODE_COOKIE, UI_THEME_COOKIE, resolveModePreference, resolveThemePreference } from "@/lib/ui-preferences";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/login");
  }
  const cookieStore = await cookies();
  const themeKey = resolveThemePreference(cookieStore.get(UI_THEME_COOKIE)?.value);
  const mode = resolveModePreference(cookieStore.get(UI_MODE_COOKIE)?.value);

  return (
    <>
      <AppStickyHeader
        isAdmin={session.user.role === "admin"}
        revealOnScrollUp
        initialThemeKey={themeKey}
        initialMode={mode}
      />
      {children}
    </>
  );
}
