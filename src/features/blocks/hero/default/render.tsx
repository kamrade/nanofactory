
import type { CSSProperties } from "react";
import Image from "next/image";

import styles from "./render.module.css";

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

export function HeroDefaultRender({
  block,
  assetMap,
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
  const heroImageAsset = resolveHeroImageAsset({ block, assetMap, mode: activeMode });
  const effectiveSpacingScale = resolveHeroSpacingScale(projectSpacingScale);
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
      data-spacing-scale={effectiveSpacingScale}
      data-content-position={contentPosition}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      {heroImageAsset ? (
        <div className={styles.mediaPanel}>
          <Image
            src={heroImageAsset.publicUrl}
            alt={heroImageAsset.alt ?? heroImageAsset.originalFilename}
            fill
            unoptimized
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : null}

      <div className={styles.contentPanel}>
        <div ref={visibleRef} className={styles.contentStack}>
          <HeroEyebrow
            text={eyebrow}
            className={styles.eyebrow}
            animateContent={animateContent}
            startDelay={eyebrowDelay}
            visible={visible}
            duration={DURATION}
          />
          <div className={styles.headingGroup}>
            <HeroHeadline
              text={title}
              className={styles.heading}
              animateContent={animateContent}
              animateMainText={animateMainText}
              startDelay={titleDelay}
              visible={visible}
              duration={DURATION}
            />
            <HeroSubtitle
              text={subtitle}
              className={styles.subtitle}
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
              buttonClassName={styles.button}
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
