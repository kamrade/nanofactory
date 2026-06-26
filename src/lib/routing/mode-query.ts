export type ThemeModeParam = "light" | "dark";

export function buildModeQuery(mode: ThemeModeParam) {
  return `?mode=${mode}`;
}

export function appendModeToPath(path: string, mode: ThemeModeParam) {
  const [pathWithQuery, hash = ""] = path.split("#");
  const [pathname, queryString = ""] = pathWithQuery.split("?");
  const params = new URLSearchParams(queryString);
  params.set("mode", mode);
  const query = params.toString();
  const withMode = query.length > 0 ? `${pathname}?${query}` : `${pathname}?mode=${mode}`;
  return hash.length > 0 ? `${withMode}#${hash}` : withMode;
}
