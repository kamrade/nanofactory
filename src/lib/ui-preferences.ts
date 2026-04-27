import { DEFAULT_THEME_KEY, isThemeKey, type ThemeKey } from "@/lib/themes";

export type UiMode = "light" | "dark";

export const UI_THEME_COOKIE = "nf_theme";
export const UI_MODE_COOKIE = "nf_mode";
export const UI_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function resolveThemePreference(value: string | null | undefined): ThemeKey {
  return value && isThemeKey(value) ? value : DEFAULT_THEME_KEY;
}

export function resolveModePreference(value: string | null | undefined): UiMode {
  return value === "dark" ? "dark" : "light";
}

