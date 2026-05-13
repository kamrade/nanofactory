export type ThemeMode = "light" | "dark";

function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark";
}

/**
 * Read the current mode (light/dark) from the nearest `main[data-theme]` ancestor.
 * Falls back to "light" if the element or attribute is missing.
 */
export function readModeFromRoot(element: HTMLElement | null | undefined): ThemeMode {
  const root = element?.closest("[data-theme]");
  const rootMode = root?.getAttribute("data-mode");
  return isThemeMode(rootMode) ? rootMode : "light";
}

/**
 * Apply a mode (light/dark) to the nearest `main[data-theme]` ancestor.
 */
export function applyModeToRoot(element: HTMLElement | null | undefined, mode: ThemeMode) {
  element?.closest("[data-theme]")?.setAttribute("data-mode", mode);
}
