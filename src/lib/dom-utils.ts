export type ThemeMode = "light" | "dark";

function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark";
}

function resolveThemeRoot(element: HTMLElement | null | undefined) {
  if (typeof document === "undefined") {
    return element?.closest("[data-theme]") ?? null;
  }
  const mainRoot = document.querySelector<HTMLElement>("main[data-theme]");
  if (mainRoot) {
    return mainRoot;
  }
  return element?.closest("[data-theme]") ?? document.querySelector<HTMLElement>("[data-theme]");
}

/**
 * Read the current mode (light/dark) from the nearest `main[data-theme]` ancestor.
 * Falls back to "light" if the element or attribute is missing.
 */
export function readModeFromRoot(element: HTMLElement | null | undefined): ThemeMode {
  const root = resolveThemeRoot(element);
  const rootMode = root?.getAttribute("data-mode");
  return isThemeMode(rootMode) ? rootMode : "light";
}

/**
 * Apply a mode (light/dark) to the nearest `main[data-theme]` ancestor.
 */
export function applyModeToRoot(element: HTMLElement | null | undefined, mode: ThemeMode) {
  resolveThemeRoot(element)?.setAttribute("data-mode", mode);
}
