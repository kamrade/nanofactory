export type ThemeModeParam = "light" | "dark";

export function buildModeQuery(mode: ThemeModeParam) {
  return `?mode=${mode}`;
}

export function appendModeToPath(path: string, mode: ThemeModeParam) {
  const [pathWithQuery, hash = ""] = path.split("#");
  const separator = pathWithQuery.includes("?") ? "&" : "?";
  const withMode = `${pathWithQuery}${separator}mode=${mode}`;
  return hash.length > 0 ? `${withMode}#${hash}` : withMode;
}
