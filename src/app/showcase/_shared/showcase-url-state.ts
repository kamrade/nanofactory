import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";
import {
  resolveShowcaseStateFromSearchParams as resolveFullShowcaseStateFromSearchParams,
} from "./showcase-state";

export type ShowcaseQueryState = {
  theme: ThemeKey;
  mode: UiMode;
};

export type ShowcaseSearchParams = {
  theme?: string | string[];
  mode?: string | string[];
};

const SHOWCASE_QUERY_KEYS = {
  theme: "theme",
  mode: "mode",
} as const;

export function resolveShowcaseStateFromSearchParams(
  searchParams: ShowcaseSearchParams,
  fallback: ShowcaseQueryState
): ShowcaseQueryState {
  const state = resolveFullShowcaseStateFromSearchParams(searchParams, fallback);
  return { theme: state.theme, mode: state.mode };
}

export function applyShowcaseStateToSearchParams(searchParams: URLSearchParams, state: ShowcaseQueryState) {
  searchParams.set(SHOWCASE_QUERY_KEYS.theme, state.theme);
  searchParams.set(SHOWCASE_QUERY_KEYS.mode, state.mode);
}

export function appendShowcaseStateToPath(path: string, state: ShowcaseQueryState) {
  const [pathWithQuery, hash = ""] = path.split("#");
  const [pathname, queryString = ""] = pathWithQuery.split("?");
  const searchParams = new URLSearchParams(queryString);

  applyShowcaseStateToSearchParams(searchParams, state);

  const query = searchParams.toString();
  const withQuery = query.length > 0 ? `${pathname}?${query}` : pathname;
  return hash.length > 0 ? `${withQuery}#${hash}` : withQuery;
}

export function appendSearchParamsToPath(path: string, searchParams: URLSearchParams) {
  const [pathWithQuery, hash = ""] = path.split("#");
  const [pathname, queryString = ""] = pathWithQuery.split("?");
  const nextSearchParams = new URLSearchParams(queryString);

  searchParams.forEach((value, key) => {
    nextSearchParams.set(key, value);
  });

  const query = nextSearchParams.toString();
  const withQuery = query.length > 0 ? `${pathname}?${query}` : pathname;
  return hash.length > 0 ? `${withQuery}#${hash}` : withQuery;
}
