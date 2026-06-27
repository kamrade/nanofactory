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

export function HeroDefaultRender({
  block,
  assetMap,
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
    animate,
  } = readHeroRenderContent(block);

  const { defaultImageId, lightImageId, darkImageId } = readHeroImageIds(block);
  const lightAsset = resolveAssetById(lightImageId ?? defaultImageId, assetMap);
  const darkAsset = resolveAssetById(darkImageId ?? defaultImageId, assetMap);
  const sameImages = !lightAsset || !darkAsset || lightAsset.id === darkAsset.id;

  const heroImages = sameImages
    ? lightAsset
      ? [{ src: lightAsset.publicUrl, alt: lightAsset.alt ?? lightAsset.originalFilename }]
      : []
    : [
        ...(lightAsset
          ? [
              {
                src: lightAsset.publicUrl,
                alt: lightAsset.alt ?? lightAsset.originalFilename,
                className: styles.imageLight,
              },
            ]
          : []),
        ...(darkAsset
          ? [
              {
                src: darkAsset.publicUrl,
                alt: darkAsset.alt ?? darkAsset.originalFilename,
                className: styles.imageDark,
              },
            ]
          : []),
      ];

  const effectiveSpacingScale = resolveHeroSpacingScale(projectSpacingScale);
  const effectiveBorderRadius = resolveHeroBorderRadiusPolicy(projectBorderRadiusPolicy);
  const radiusVars = createHeroRadiusVars(effectiveBorderRadius, [
    "--hero-radius-media",
    "--hero-radius-button",
    "--hero-radius-panel",
  ]);

  return (
    <section
      data-component-id="hero:default"
      data-spacing-scale={effectiveSpacingScale}
      data-content-position={contentPosition}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      {heroImages.length > 0 ? (
        <HeroMedia panelClassName={styles.mediaPanel} images={heroImages} animate={animate} />
      ) : null}

      <div className={styles.contentPanel}>
        <HeroContent
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          buttonText={buttonText}
          buttonAnchor={buttonAnchor}
          animate={animate}
          headlineVariant="default"
          contentStackClassName={styles.contentStack}
          eyebrowClassName={styles.eyebrow}
          headingGroupClassName={styles.headingGroup}
          subtitleClassName={styles.subtitle}
          buttonClassName={styles.button}
          buttonRadiusVar="--hero-radius-button"
        />
      </div>
    </section>
  );
}
