import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Onest } from "next/font/google";

import { UI_MODE_COOKIE, UI_THEME_COOKIE, resolveModePreference, resolveThemePreference } from "@/lib/ui-preferences";
import { AppProviders } from "./providers";
import "./globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: "Nanofactory",
  description: "Nanofactory helps you create landing pages in 10 minutes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = resolveThemePreference(cookieStore.get(UI_THEME_COOKIE)?.value);
  const mode = resolveModePreference(cookieStore.get(UI_MODE_COOKIE)?.value);

  return (
    <html
      lang="en"
      data-theme={theme}
      data-mode={mode}
      className={`${onest.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
