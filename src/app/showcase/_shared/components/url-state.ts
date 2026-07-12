import type { UiSize } from "@/app/showcase/_shared/uikit-sections";
import { resolveShowcaseStateFromSearchParams } from "@/app/showcase/_shared/showcase-state";

export type ComponentsShowcaseState = {
  uiSize: UiSize;
  borderRadius: "none" | "md" | "lg";
};

export type ComponentsShowcaseSearchParams = {
  size?: string | string[];
  borderRadius?: string | string[];
  uiBorderRadius?: string | string[];
  uiBorderRadiusPolicy?: string | string[];
  borderRadiusPolicy?: string | string[];
};

const COMPONENTS_QUERY_KEYS = {
  uiSize: "size",
  borderRadius: "borderRadius",
} as const;

export function resolveComponentsShowcaseStateFromSearchParams(
  searchParams: ComponentsShowcaseSearchParams
): ComponentsShowcaseState {
  const state = resolveShowcaseStateFromSearchParams(searchParams, {
    size: "sm",
    borderRadius: "lg",
  });

  return {
    uiSize: state.size,
    borderRadius: state.borderRadius,
  };
}

export function applyComponentsShowcaseStateToSearchParams(
  searchParams: URLSearchParams,
  state: ComponentsShowcaseState
) {
  searchParams.set(COMPONENTS_QUERY_KEYS.uiSize, state.uiSize);
  searchParams.set(COMPONENTS_QUERY_KEYS.borderRadius, state.borderRadius);
}

export function appendComponentsShowcaseStateToPath(path: string, state: ComponentsShowcaseState) {
  const [pathWithQuery, hash = ""] = path.split("#");
  const [pathname, queryString = ""] = pathWithQuery.split("?");
  const searchParams = new URLSearchParams(queryString);

  applyComponentsShowcaseStateToSearchParams(searchParams, state);

  const query = searchParams.toString();
  const withQuery = query.length > 0 ? `${pathname}?${query}` : pathname;
  return hash.length > 0 ? `${withQuery}#${hash}` : withQuery;
}
