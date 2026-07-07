import type { CSSProperties } from "react";

import styles from "./render.module.css";

import type { BlockRenderProps } from "../../shared/types";
import { resolveAssetById } from "@/lib/assets/resolution";
import {
  createHeroRadiusVars,
  readHeroImageIds,
  readHeroRenderContent,
  resolveHeroBorderRadiusPolicy,
  resolveHeroSpacingScale,
} from "../shared/helpers";
import { HeroContent } from "../shared/hero-content";
import { HeroMedia } from "../shared/hero-media";

export function HeroCenteredRender({
  block,
  assetMap,
  projectBorderRadiusPolicy,
  projectSpacingScale,
  projectSurfaceStyle,
}: BlockRenderProps) {
  const {
    eyebrow,
    title,
    subtitle,
    buttonText,
    buttonAnchor,
    buttonTargetType,
    contentPosition,
    animate,
  } = readHeroRenderContent(block);

  const { defaultImageId, lightImageId, darkImageId } = readHeroImageIds(block);
  const lightAsset = resolveAssetById(lightImageId ?? defaultImageId, assetMap);
  const darkAsset = resolveAssetById(darkImageId ?? defaultImageId, assetMap);
  const sameImages = !lightAsset || !darkAsset || lightAsset.id === darkAsset.id;

  const heroImages = sameImages
    ? lightAsset
      ? [{ src: lightAsset.publicUrl, alt: "" }]
      : []
    : [
        ...(lightAsset
          ? [{ src: lightAsset.publicUrl, alt: "", className: styles.imageLight }]
          : []),
        ...(darkAsset
          ? [{ src: darkAsset.publicUrl, alt: "", className: styles.imageDark }]
          : []),
      ];

  const effectiveSpacingScale = resolveHeroSpacingScale(projectSpacingScale);
  const effectiveBorderRadius = resolveHeroBorderRadiusPolicy(projectBorderRadiusPolicy);
  const radiusVars = createHeroRadiusVars(effectiveBorderRadius, [
    "--hero-centered-radius-shell",
    "--hero-centered-radius-button",
  ]);

  return (
    <section
      data-testid="HeroCenteredComponent"
      data-spacing-scale={effectiveSpacingScale}
      data-surface-style={projectSurfaceStyle ?? "default"}
      data-content-position={contentPosition}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      {heroImages.length > 0 ? (
        <HeroMedia panelClassName={styles.mediaBg} ariaHidden images={heroImages} animate={animate} />
      ) : null}

      <div className={styles.shell}>
        <HeroContent
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          buttonText={buttonText}
          buttonAnchor={buttonAnchor}
          buttonTargetType={buttonTargetType}
          animate={animate}
          headlineVariant="centered"
          contentStackClassName={styles.content}
          eyebrowClassName={styles.eyebrow}
          subtitleClassName={styles.subtitle}
          buttonClassName={styles.button}
          buttonRadiusVar="--hero-centered-radius-button"
        />
      </div>
    </section>
  );
}
