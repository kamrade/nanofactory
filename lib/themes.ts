export const THEME_KEYS = ["sunwash", "nightfall"] as const;

export type ThemeKey = (typeof THEME_KEYS)[number];

export const DEFAULT_THEME_KEY: ThemeKey = "sunwash";

export const THEME_OPTIONS: Array<{
  key: ThemeKey;
  label: string;
}> = [
  { key: "sunwash", label: "Sunwash" },
  { key: "nightfall", label: "Nightfall" },
];

export function isThemeKey(value: string): value is ThemeKey {
  return (THEME_KEYS as readonly string[]).includes(value);
}
