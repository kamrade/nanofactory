import {
  resolveProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";
import { resolveProjectHeadingFont } from "@/lib/projects/heading-font";
import { resolveProjectSpacingScale } from "@/lib/projects/spacing-scale";
import {
  resolveProjectSurfaceStyle,
} from "@/lib/projects/surface-style";

import type { FeatureBlocksOptionState } from "./options-panel";

export const DEFAULT_FEATURE_BLOCKS_OPTIONS: FeatureBlocksOptionState = {
  borderRadiusPolicy: "lg",
  spacingScale: "md",
  surfaceStyle: "default",
  headingFont: "onest",
};

export const FEATURE_BLOCKS_QUERY_KEYS = {
  borderRadiusPolicy: "borderRadius",
  spacingScale: "spacingScale",
  surfaceStyle: "surfaceStyle",
  headingFont: "headingFont",
} as const;

type FeatureBlocksSearchParams = {
  borderRadius?: string | string[];
  spacingScale?: string | string[];
  surfaceStyle?: string | string[];
  headingFont?: string | string[];
};

function readSearchParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function resolveFeatureBlocksOptionsFromSearchParams(
  searchParams: FeatureBlocksSearchParams
): FeatureBlocksOptionState {
  return {
    borderRadiusPolicy: resolveProjectBorderRadiusPolicy(readSearchParam(searchParams.borderRadius)),
    spacingScale: resolveProjectSpacingScale(readSearchParam(searchParams.spacingScale)),
    surfaceStyle: resolveProjectSurfaceStyle(readSearchParam(searchParams.surfaceStyle)),
    headingFont: resolveProjectHeadingFont(readSearchParam(searchParams.headingFont)),
  };
}

export function applyFeatureBlocksOptionsToSearchParams(
  searchParams: URLSearchParams,
  options: FeatureBlocksOptionState
) {
  searchParams.set(FEATURE_BLOCKS_QUERY_KEYS.borderRadiusPolicy, options.borderRadiusPolicy);
  searchParams.set(FEATURE_BLOCKS_QUERY_KEYS.spacingScale, options.spacingScale);
  searchParams.set(FEATURE_BLOCKS_QUERY_KEYS.surfaceStyle, options.surfaceStyle);
  searchParams.set(FEATURE_BLOCKS_QUERY_KEYS.headingFont, options.headingFont);
}
