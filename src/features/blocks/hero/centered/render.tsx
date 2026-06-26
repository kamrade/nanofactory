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

export function HeroCenteredRender({
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
    "--hero-centered-radius-shell",
    "--hero-centered-radius-button",
  ]);

  return (
    <section
      data-testid="HeroCenteredComponent"
      data-spacing-scale={effectiveSpacingScale}
      data-content-position={contentPosition}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      {lightAsset || darkAsset ? (
        <div className={styles.mediaBg} aria-hidden>
          {sameImages ? (
            lightAsset ? (
              <Image
                src={lightAsset.publicUrl}
                alt=""
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
                  alt=""
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                  className={styles.imageLight}
                />
              ) : null}
              {darkAsset ? (
                <Image
                  src={darkAsset.publicUrl}
                  alt=""
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

      <div className={styles.shell}>
        <HeroContent
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          buttonText={buttonText}
          buttonAnchor={buttonAnchor}
          animateMainText={animateMainText}
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
