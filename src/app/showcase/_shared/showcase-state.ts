import { type UiSize } from "@/app/showcase/_shared/uikit-sections";
import {
  resolveProjectBorderRadiusPolicy,
  type ProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";
import { resolveProjectHeadingFont, type ProjectHeadingFont } from "@/lib/projects/heading-font";
import { resolveProjectSurfaceStyle, type ProjectSurfaceStyle } from "@/lib/projects/surface-style";
import { DEFAULT_THEME_KEY, isThemeKey, type ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";

export type ShowcaseState = {
  theme: ThemeKey;
  mode: UiMode;
  size: UiSize;
  borderRadius: ProjectBorderRadiusPolicy;
  surfaceStyle: ProjectSurfaceStyle;
  headingFont: ProjectHeadingFont;
};

export type ShowcaseStateSearchParams = {
  theme?: string | string[];
  mode?: string | string[];
  size?: string | string[];
  borderRadius?: string | string[];
  surfaceStyle?: string | string[];
  headingFont?: string | string[];
  spacingScale?: string | string[];
  uiBorderRadius?: string | string[];
  borderRadiusPolicy?: string | string[];
  uiBorderRadiusPolicy?: string | string[];
};

export const DEFAULT_SHOWCASE_STATE: ShowcaseState = {
  theme: DEFAULT_THEME_KEY,
  mode: "light",
  size: "md",
  borderRadius: "lg",
  surfaceStyle: "default",
  headingFont: "onest",
};

function readSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function resolveTheme(value?: string | string[], fallback: ThemeKey = DEFAULT_SHOWCASE_STATE.theme) {
  const resolvedValue = readSearchParam(value);
  return resolvedValue && isThemeKey(resolvedValue) ? resolvedValue : fallback;
}

function resolveMode(value?: string | string[], fallback: UiMode = DEFAULT_SHOWCASE_STATE.mode) {
  const resolvedValue = readSearchParam(value);
  return resolvedValue === "light" || resolvedValue === "dark" ? resolvedValue : fallback;
}

function resolveSize(value?: string | string[], fallback: UiSize = DEFAULT_SHOWCASE_STATE.size) {
  const resolvedValue = readSearchParam(value);
  return resolvedValue === "sm" || resolvedValue === "md" || resolvedValue === "lg" ? resolvedValue : fallback;
}

export function resolveShowcaseStateFromSearchParams(
  searchParams: ShowcaseStateSearchParams,
  fallback: Partial<ShowcaseState> = DEFAULT_SHOWCASE_STATE
): ShowcaseState {
  const size = searchParams.size ?? searchParams.spacingScale;
  const borderRadius =
    searchParams.borderRadius ??
    searchParams.uiBorderRadius ??
    searchParams.borderRadiusPolicy ??
    searchParams.uiBorderRadiusPolicy;

  return {
    theme: resolveTheme(searchParams.theme, fallback.theme ?? DEFAULT_SHOWCASE_STATE.theme),
    mode: resolveMode(searchParams.mode, fallback.mode ?? DEFAULT_SHOWCASE_STATE.mode),
    size: resolveSize(size, fallback.size ?? DEFAULT_SHOWCASE_STATE.size),
    borderRadius: readSearchParam(borderRadius)
      ? resolveProjectBorderRadiusPolicy(readSearchParam(borderRadius))
      : fallback.borderRadius ?? DEFAULT_SHOWCASE_STATE.borderRadius,
    surfaceStyle: readSearchParam(searchParams.surfaceStyle)
      ? resolveProjectSurfaceStyle(readSearchParam(searchParams.surfaceStyle))
      : fallback.surfaceStyle ?? DEFAULT_SHOWCASE_STATE.surfaceStyle,
    headingFont: readSearchParam(searchParams.headingFont)
      ? resolveProjectHeadingFont(readSearchParam(searchParams.headingFont))
      : fallback.headingFont ?? DEFAULT_SHOWCASE_STATE.headingFont,
  };
}

export function applyShowcaseStateToSearchParams(searchParams: URLSearchParams, state: ShowcaseState) {
  searchParams.set("theme", state.theme);
  searchParams.set("mode", state.mode);
  searchParams.set("size", state.size);
  searchParams.set("borderRadius", state.borderRadius);
  searchParams.set("surfaceStyle", state.surfaceStyle);
  searchParams.set("headingFont", state.headingFont);
}
