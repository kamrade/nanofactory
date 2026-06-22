"use client";

import type { CSSProperties } from "react";

import styles from "./render.module.css";

import type { ProjectSpacingScale } from "@/lib/projects/spacing-scale";

import type { BlockRenderProps } from "../../shared/types";
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

const HERO_CENTERED_SPACING: Record<
  ProjectSpacingScale,
  {
    shellClassName: string;
    contentClassName: string;
    stackClassName: string;
    eyebrowClassName: string;
    headingClassName: string;
    subtitleClassName: string;
    buttonClassName: string;
  }
> = {
  sm: {
    shellClassName: "m-auto flex min-h-[16rem] max-w-2xl flex-col items-center gap-3 py-6 text-center md:min-h-[20rem]",
    contentClassName: "space-y-3",
    stackClassName: "",
    eyebrowClassName: "text-xs font-semibold uppercase tracking-[0.12em]",
    headingClassName: "break-words text-2xl font-semibold tracking-tight sm:text-4xl",
    subtitleClassName: "mx-auto max-w-2xl break-words text-sm leading-6",
    buttonClassName: "px-3 py-2 text-xs",
  },
  md: {
    shellClassName: "m-auto flex min-h-[22rem] max-w-3xl flex-col items-center gap-6 py-12 text-center md:min-h-[28rem]",
    contentClassName: "space-y-5",
    stackClassName: "",
    eyebrowClassName: "text-sm font-semibold uppercase tracking-[0.14em]",
    headingClassName: "break-words text-4xl font-semibold tracking-tight sm:text-6xl",
    subtitleClassName: "mx-auto max-w-2xl break-words text-base leading-7",
    buttonClassName: "px-5 py-3 text-sm",
  },
  lg: {
    shellClassName: "m-auto flex min-h-[26rem] max-w-4xl flex-col items-center gap-8 py-14 text-center md:min-h-[32rem]",
    contentClassName: "space-y-7",
    stackClassName: "",
    eyebrowClassName: "text-base font-semibold uppercase tracking-[0.16em]",
    headingClassName: "break-words text-5xl font-semibold tracking-tight sm:text-7xl",
    subtitleClassName: "mx-auto max-w-3xl break-words text-lg leading-8",
    buttonClassName: "px-7 py-4 text-base",
  },
};

function getContentPositionClass(contentPosition: string) {
  if (contentPosition === "top") {
    return "justify-start";
  }
  if (contentPosition === "bottom") {
    return "justify-end";
  }
  return "justify-center";
}

export function HeroCenteredRender({
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
  const spacing = HERO_CENTERED_SPACING[effectiveSpacingScale];
  const effectiveBorderRadius = resolveHeroBorderRadiusPolicy(projectBorderRadiusPolicy);
  const radiusVars = createHeroRadiusVars(effectiveBorderRadius, [
    "--hero-centered-radius-shell",
    "--hero-centered-radius-button",
  ]);

  return (
    <section
      ref={sectionRef}
      data-testid="HeroCenteredComponent"
      className={`${styles.backgroundImage} overflow-hidden [border-radius:var(--hero-centered-radius-shell)]`}
      style={
        {
          ...radiusVars,
          ...(heroImageAsset ? { backgroundImage: `url(${heroImageAsset.publicUrl})` } : {}),
        } as CSSProperties
      }
    >
      <div className={`${spacing.shellClassName} ${getContentPositionClass(contentPosition)}`}>
        <div ref={visibleRef} className={spacing.contentClassName}>
          <HeroEyebrow
            text={eyebrow}
            className={`${spacing.eyebrowClassName} ${theme.kicker}`}
            animateContent={animateContent}
            startDelay={eyebrowDelay}
            visible={visible}
            duration={DURATION}
          />
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
          <div>
            <HeroCta
              buttonText={buttonText}
              buttonAnchor={buttonAnchor}
              buttonClassName={`${theme.buttonTone} ${spacing.buttonClassName}`}
              buttonRadiusVar="--hero-centered-radius-button"
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
