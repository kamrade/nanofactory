import {
  resolveProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";
import { resolveProjectHeadingFont } from "@/lib/projects/heading-font";
import { resolveProjectSpacingScale } from "@/lib/projects/spacing-scale";
import {
  resolveProjectSurfaceStyle,
} from "@/lib/projects/surface-style";
import { resolveShowcaseStateFromSearchParams } from "@/app/showcase/_shared/showcase-state";

import type { FeatureBlocksOptionState } from "./options-panel";

export const DEFAULT_FEATURE_BLOCKS_OPTIONS: FeatureBlocksOptionState = {
  borderRadiusPolicy: "lg",
  size: "md",
  surfaceStyle: "default",
  headingFont: "onest",
};

export const FEATURE_BLOCKS_QUERY_KEYS = {
  borderRadiusPolicy: "borderRadius",
  size: "size",
  surfaceStyle: "surfaceStyle",
  headingFont: "headingFont",
} as const;

type FeatureBlocksSearchParams = {
  borderRadius?: string | string[];
  size?: string | string[];
  spacingScale?: string | string[];
  surfaceStyle?: string | string[];
  headingFont?: string | string[];
};

export function resolveFeatureBlocksOptionsFromSearchParams(
  searchParams: FeatureBlocksSearchParams
): FeatureBlocksOptionState {
  const state = resolveShowcaseStateFromSearchParams(searchParams, {
    size: DEFAULT_FEATURE_BLOCKS_OPTIONS.size,
    borderRadius: DEFAULT_FEATURE_BLOCKS_OPTIONS.borderRadiusPolicy,
    surfaceStyle: DEFAULT_FEATURE_BLOCKS_OPTIONS.surfaceStyle,
    headingFont: DEFAULT_FEATURE_BLOCKS_OPTIONS.headingFont,
  });

  return {
    borderRadiusPolicy: resolveProjectBorderRadiusPolicy(state.borderRadius),
    size: resolveProjectSpacingScale(state.size),
    surfaceStyle: resolveProjectSurfaceStyle(state.surfaceStyle),
    headingFont: resolveProjectHeadingFont(state.headingFont),
  };
}

export function applyFeatureBlocksOptionsToSearchParams(
  searchParams: URLSearchParams,
  options: FeatureBlocksOptionState
) {
  searchParams.set(FEATURE_BLOCKS_QUERY_KEYS.borderRadiusPolicy, options.borderRadiusPolicy);
  searchParams.set(FEATURE_BLOCKS_QUERY_KEYS.size, options.size);
  searchParams.set(FEATURE_BLOCKS_QUERY_KEYS.surfaceStyle, options.surfaceStyle);
  searchParams.set(FEATURE_BLOCKS_QUERY_KEYS.headingFont, options.headingFont);
}
