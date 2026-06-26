import type { CSSProperties } from "react";
import Image from "next/image";

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
    animateMainText,
  } = readHeroRenderContent(block);

  const { defaultImageId, lightImageId, darkImageId } = readHeroImageIds(block);
  const lightAsset = resolveAssetById(lightImageId ?? defaultImageId, assetMap);
  const darkAsset = resolveAssetById(darkImageId ?? defaultImageId, assetMap);
  const sameImages = !lightAsset || !darkAsset || lightAsset.id === darkAsset.id;

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
      {lightAsset || darkAsset ? (
        <div className={styles.mediaPanel}>
          {sameImages ? (
            lightAsset ? (
              <Image
                src={lightAsset.publicUrl}
                alt={lightAsset.alt ?? lightAsset.originalFilename}
                fill
                unoptimized
                style={{ objectFit: "cover" }}
              />
            ) : null
          ) : (
            <>
              {lightAsset ? (
                <Image
                  src={lightAsset.publicUrl}
                  alt={lightAsset.alt ?? lightAsset.originalFilename}
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                  className={styles.imageLight}
                />
              ) : null}
              {darkAsset ? (
                <Image
                  src={darkAsset.publicUrl}
                  alt={darkAsset.alt ?? darkAsset.originalFilename}
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                  className={styles.imageDark}
                />
              ) : null}
            </>
          )}
        </div>
      ) : null}

      <div className={styles.contentPanel}>
        <HeroContent
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          buttonText={buttonText}
          buttonAnchor={buttonAnchor}
          animateMainText={animateMainText}
          contentStackClassName={styles.contentStack}
          eyebrowClassName={styles.eyebrow}
          headingGroupClassName={styles.headingGroup}
          headingClassName={styles.heading}
          subtitleClassName={styles.subtitle}
          buttonClassName={styles.button}
          buttonRadiusVar="--hero-radius-button"
        />
      </div>
    </section>
  );
}
