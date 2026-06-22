"use client";

import { useEffect, useRef, useState } from "react";

import { useVisibleOnce } from "@/hooks/use-visible-once";
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
  animateMainText: boolean;
  animateContent: boolean;
};

type HeroImageIds = {
  defaultImageId?: string;
  lightImageId?: string;
  darkImageId?: string;
};

type HeroAnimationState = {
  visibleRef: ReturnType<typeof useVisibleOnce>["ref"];
  visible: boolean;
  eyebrowDelay: number;
  titleDelay: number;
  subtitleDelay: number;
  buttonDelay: number;
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
    animateMainText: block.props.animateMainText === true,
    animateContent: block.props.animateContent === true,
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

export function useHeroAnimationState(
  eyebrow: string,
  animateContent: boolean
): HeroAnimationState {
  const { ref: visibleRef, visible } = useVisibleOnce();
  const hasEyebrow = eyebrow.trim().length > 0;
  const delayFor = (index: number) => (animateContent && visible ? index * 100 : 10_000_000);

  return {
    visibleRef,
    visible,
    eyebrowDelay: delayFor(0),
    titleDelay: delayFor(hasEyebrow ? 1 : 0),
    subtitleDelay: delayFor(hasEyebrow ? 2 : 1),
    buttonDelay: delayFor(hasEyebrow ? 3 : 2),
  };
}

export function useHeroObservedMode(mode: "light" | "dark") {
  const sectionRef = useRef<HTMLElement>(null);
  const [observedMode, setObservedMode] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const host = sectionRef.current?.closest("main[data-theme]");
    if (!host) {
      return;
    }

    const syncMode = () => {
      const nextMode = host.getAttribute("data-mode");
      setObservedMode(nextMode === "dark" ? "dark" : "light");
    };

    syncMode();
    const observer = new MutationObserver(syncMode);
    observer.observe(host, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => observer.disconnect();
  }, []);

  return {
    sectionRef,
    activeMode: observedMode ?? mode,
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
