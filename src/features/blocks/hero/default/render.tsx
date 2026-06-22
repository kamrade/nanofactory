"use client";

import type { CSSProperties } from "react";
import Image from "next/image";

import type { BlockRenderProps } from "../../shared/types";
import type { ProjectSpacingScale } from "@/lib/projects/spacing-scale";
import { HeroCta, HeroEyebrow, HeroHeadline, HeroSubtitle } from "../shared/content";
import {
  createHeroRadiusVars,
  readHeroRenderContent,
  resolveHeroBorderRadiusPolicy,
  resolveHeroImageAsset,
  resolveHeroSpacingScale,
  useHeroAnimationState,
  useHeroObservedMode,
} from "../shared/render";

const HERO_DEFAULT_SPACING: Record<
  ProjectSpacingScale,
  {
    rootClassName: string;
    contentPanelClassName: string;
    contentStackClassName: string;
    eyebrowClassName: string;
    headingClassName: string;
    subtitleClassName: string;
    buttonClassName: string;
  }
> = {
  sm: {
    rootClassName: "grid gap-4 lg:grid-cols-[1.05fr_0.95fr]",
    contentPanelClassName: "flex min-h-[16rem] flex-col p-3 md:min-h-[20rem] md:p-3 justify-center [border-radius:var(--hero-radius-panel)]",
    contentStackClassName: "space-y-3 py-4",
    eyebrowClassName: "text-xs font-semibold uppercase tracking-[0.12em]",
    headingClassName: "break-words text-2xl font-semibold tracking-tight sm:text-3xl",
    subtitleClassName: "max-w-3xl break-words text-sm leading-6",
    buttonClassName: "px-3 py-2 text-xs",
  },
  md: {
    rootClassName: "grid gap-8 lg:grid-cols-[1.05fr_0.95fr]",
    contentPanelClassName: "flex min-h-[20rem] flex-col p-4 md:min-h-[26rem] md:p-4 justify-center [border-radius:var(--hero-radius-panel)]",
    contentStackClassName: "space-y-5 py-8",
    eyebrowClassName: "text-sm font-semibold uppercase tracking-[0.14em]",
    headingClassName: "break-words text-4xl font-semibold tracking-tight sm:text-5xl",
    subtitleClassName: "max-w-3xl break-words text-base leading-7",
    buttonClassName: "px-5 py-3 text-sm",
  },
  lg: {
    rootClassName: "grid gap-10 lg:grid-cols-[1.05fr_0.95fr]",
    contentPanelClassName: "flex min-h-[24rem] flex-col p-6 md:min-h-[30rem] md:p-6 justify-center [border-radius:var(--hero-radius-panel)]",
    contentStackClassName: "space-y-7 py-10",
    eyebrowClassName: "text-base font-semibold uppercase tracking-[0.16em]",
    headingClassName: "break-words text-5xl font-semibold tracking-tight sm:text-6xl",
    subtitleClassName: "max-w-3xl break-words text-lg leading-8",
    buttonClassName: "px-7 py-4 text-base",
  },
};

function getContentPositionClass(contentPosition: string) {
  if (contentPosition === "top") {
    return "items-start";
  }
  if (contentPosition === "bottom") {
    return "items-end";
  }
  if (contentPosition === "stretch") {
    return "items-stretch";
  }
  return "items-center";
}

export function HeroDefaultRender({
  block,
  assetMap,
  theme,
  mode = "light",
  projectBorderRadiusPolicy,
  projectSpacingScale,
}: BlockRenderProps) {
  const {
    eyebrow,
    title,
    subtitle,
    buttonText,
    buttonAnchor,
    contentPosition,
    animateMainText,
    animateContent,
  } = readHeroRenderContent(block);
  const { sectionRef, activeMode } = useHeroObservedMode(mode);
  const { visibleRef, visible, eyebrowDelay, titleDelay, subtitleDelay, buttonDelay } =
    useHeroAnimationState(eyebrow, animateContent);

  const DURATION = 3000;
  const heroImageAsset = resolveHeroImageAsset({
    block,
    assetMap,
    mode: activeMode,
  });
  const effectiveSpacingScale = resolveHeroSpacingScale(projectSpacingScale);
  const spacing = HERO_DEFAULT_SPACING[effectiveSpacingScale];
  const effectiveBorderRadius = resolveHeroBorderRadiusPolicy(projectBorderRadiusPolicy);
  const radiusVars = createHeroRadiusVars(effectiveBorderRadius, [
    "--hero-radius-media",
    "--hero-radius-button",
    "--hero-radius-panel",
  ]);

  return (
    <section
      ref={sectionRef}
      data-component-id="hero:default"
      className={`${spacing.rootClassName} ${getContentPositionClass(contentPosition)}`}
      style={radiusVars as CSSProperties}
    >
      {heroImageAsset ? (
        <div className="overflow-hidden bg-surface-alt [border-radius:var(--hero-radius-media)]">
          <Image
            src={heroImageAsset.publicUrl}
            alt={heroImageAsset.alt ?? heroImageAsset.originalFilename}
            width={1200}
            height={900}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div
        className={`${spacing.contentPanelClassName} ${contentPosition === "stretch" ? "h-full" : ""}`}
      >
        <div
          ref={visibleRef}
          className={`${spacing.contentStackClassName} ${contentPosition === "stretch" ? "h-full flex justify-between flex-col" : ""}`}
        >
          <HeroEyebrow
            text={eyebrow}
            className={`${spacing.eyebrowClassName} ${theme.kicker}`}
            animateContent={animateContent}
            startDelay={eyebrowDelay}
            visible={visible}
            duration={DURATION}
          />
          <div className="flex flex-col gap-4">
            <HeroHeadline
              text={title}
              className={spacing.headingClassName}
              animateContent={animateContent}
              animateMainText={animateMainText}
              startDelay={titleDelay}
              visible={visible}
              duration={DURATION}
            />
            <HeroSubtitle
              text={subtitle}
              className={`${spacing.subtitleClassName} ${theme.muted}`}
              animateContent={animateContent}
              startDelay={subtitleDelay}
              visible={visible}
              duration={DURATION}
            />
          </div>
          <div>
            <HeroCta
              buttonText={buttonText}
              buttonAnchor={buttonAnchor}
              buttonClassName={`${theme.buttonTone} ${spacing.buttonClassName}`}
              buttonRadiusVar="--hero-radius-button"
              animateContent={animateContent}
              startDelay={buttonDelay}
              visible={visible}
              duration={DURATION}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
