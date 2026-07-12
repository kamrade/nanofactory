import { resolveProjectBorderRadiusPolicy, type ProjectBorderRadiusPolicy } from "@/lib/projects/border-radius-policy";
import type { UiSize } from "@/app/showcase/_shared/uikit-sections";
import {
  resolveShowcaseStateFromSearchParams as resolveFullShowcaseStateFromSearchParams,
} from "./showcase-state";

export type ShowcaseUiState = {
  uiSize: UiSize;
  borderRadius: ProjectBorderRadiusPolicy;
};

export type ShowcaseUiSearchParams = {
  size?: string | string[];
  borderRadius?: string | string[];
  uiBorderRadius?: string | string[];
  borderRadiusPolicy?: string | string[];
  uiBorderRadiusPolicy?: string | string[];
};

export function resolveShowcaseUiStateFromSearchParams(
  searchParams: ShowcaseUiSearchParams
): ShowcaseUiState {
  const state = resolveFullShowcaseStateFromSearchParams(searchParams, {
    size: "sm",
    borderRadius: "lg",
  });

  return {
    uiSize: state.size,
    borderRadius: state.borderRadius,
  };
}

export function applyShowcaseUiStateToSearchParams(searchParams: URLSearchParams, state: ShowcaseUiState) {
  searchParams.set("size", state.uiSize);
  searchParams.set("borderRadius", resolveProjectBorderRadiusPolicy(state.borderRadius));
}
