import { resolveAssetById } from "@/lib/assets/resolution";
import {
  resolveProjectBorderRadiusPolicy,
  type ProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";
import {
  resolveProjectSpacingScale,
  type ProjectSpacingScale,
} from "@/lib/projects/spacing-scale";

import type { BlockRenderProps } from "../../shared/types";

type HeroRenderContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAnchor: string;
  contentPosition: string;
  animate: boolean;
};

type HeroImageIds = {
  defaultImageId?: string;
  lightImageId?: string;
  darkImageId?: string;
};

export function readHeroRenderContent(block: BlockRenderProps["block"]): HeroRenderContent {
  return {
    eyebrow: typeof block.props.eyebrow === "string" ? block.props.eyebrow : "",
    title: typeof block.props.title === "string" ? block.props.title : "",
    subtitle: typeof block.props.subtitle === "string" ? block.props.subtitle : "",
    buttonText: typeof block.props.buttonText === "string" ? block.props.buttonText : "",
    buttonAnchor: typeof block.props.buttonAnchor === "string" ? block.props.buttonAnchor : "",
    contentPosition:
      typeof block.props.contentPosition === "string" ? block.props.contentPosition : "centered",
    // Backward compat: the flag was previously stored as `animateMainText`.
    animate: block.props.animate === true || block.props.animateMainText === true,
  };
}

export function readHeroImageIds(block: BlockRenderProps["block"]): HeroImageIds {
  return {
    defaultImageId:
      typeof block.props.imageAssetId === "string" ? block.props.imageAssetId : undefined,
    lightImageId:
      typeof block.props.imageLightAssetId === "string"
        ? block.props.imageLightAssetId
        : undefined,
    darkImageId:
      typeof block.props.imageDarkAssetId === "string" ? block.props.imageDarkAssetId : undefined,
  };
}

export function resolveHeroImageAsset({
  block,
  assetMap,
  mode,
}: Pick<BlockRenderProps, "block" | "assetMap" | "mode">) {
  const { defaultImageId, lightImageId, darkImageId } = readHeroImageIds(block);
  const selectedImageId =
    mode === "dark" ? darkImageId ?? defaultImageId : lightImageId ?? defaultImageId;

  return resolveAssetById(selectedImageId, assetMap);
}

export function resolveHeroSpacingScale(value: unknown): ProjectSpacingScale {
  return resolveProjectSpacingScale(value);
}

export function resolveHeroBorderRadiusPolicy(value: unknown): ProjectBorderRadiusPolicy {
  return resolveProjectBorderRadiusPolicy(value);
}

export function createHeroRadiusVars(
  policy: ProjectBorderRadiusPolicy,
  variableNames: readonly string[]
): Record<string, string> {
  const radiusValue =
    policy === "none" ? "0px" : policy === "md" ? "0.75rem" : "1rem";

  return Object.fromEntries(variableNames.map((variableName) => [variableName, radiusValue]));
}
