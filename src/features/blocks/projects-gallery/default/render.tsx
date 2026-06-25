import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { resolveAssetById } from "@/lib/assets/resolution";
import { buildModeQuery } from "@/lib/routing/mode-query";
import type { BlockRenderProps } from "../../shared/types";
import {
  getEffectiveNestedGalleryAnchor,
  getEffectiveProjectAnchor,
  readProjectsGalleryProps,
} from "./model";
import { BlockSectionTitle } from "../../shared/components/block-section-title/block-section-title";
import styles from "./render.module.css";

export function ProjectsGalleryDefaultRender({
  block,
  assetMap,
  mode = "light",
  projectBorderRadiusPolicy,
  projectSpacingScale,
  publicProjectSlug,
  galleryItemLinkMode = "absolute",
}: BlockRenderProps) {
  const props = readProjectsGalleryProps(block.props);
  const modeQuery = buildModeQuery(mode);

  const effectiveSpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";
  const effectiveBorderRadius =
    projectBorderRadiusPolicy === "none" ||
    projectBorderRadiusPolicy === "md" ||
    projectBorderRadiusPolicy === "lg"
      ? projectBorderRadiusPolicy
      : "lg";

  const radiusVars =
    effectiveBorderRadius === "none"
      ? {
          "--projects-gallery-radius-card": "0px",
          "--projects-gallery-radius-media": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--projects-gallery-radius-card": "0.75rem",
            "--projects-gallery-radius-media": "0.5rem",
          }
        : {
            "--projects-gallery-radius-card": "1rem",
            "--projects-gallery-radius-media": "1rem",
          };

  return (
    <section
      data-spacing-scale={effectiveSpacingScale}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      <BlockSectionTitle title={props.sectionTitle} />

      <div className={styles.grid}>
        {props.items.map((item, index) => {
          const imageAsset = resolveAssetById(item.imageAssetId, assetMap);
          const projectAnchor = getEffectiveProjectAnchor(item, index);
          const galleryAnchor = getEffectiveNestedGalleryAnchor(item, index);
          const resolvedHref =
            projectAnchor && galleryAnchor
              ? publicProjectSlug
                ? galleryItemLinkMode === "relative"
                  ? `./${projectAnchor}/${galleryAnchor}${modeQuery}`
                  : `/p/${publicProjectSlug}/${projectAnchor}/${galleryAnchor}${modeQuery}`
                : null
              : null;

          return (
            <article
              key={`${block.id}-project-gallery-${index}`}
              className={styles.card}
            >
              {imageAsset ? (
                resolvedHref ? (
                  <Link href={resolvedHref} className={styles.imageLink}>
                    <Image
                      src={imageAsset.publicUrl}
                      alt={imageAsset.alt ?? imageAsset.originalFilename}
                      width={800}
                      height={600}
                      unoptimized
                      className={styles.media}
                    />
                  </Link>
                ) : (
                  <Image
                    src={imageAsset.publicUrl}
                    alt={imageAsset.alt ?? imageAsset.originalFilename}
                    width={800}
                    height={600}
                    unoptimized
                    className={styles.media}
                  />
                )
              ) : (
                <div className={styles.mediaPlaceholder}>No image</div>
              )}

              <div className={styles.cardContent}>
                {item.title.trim().length > 0 ? (
                  <p className={styles.cardTitle}>{item.title}</p>
                ) : (
                  <p className={styles.cardTitle}>Project {index + 1}</p>
                )}

                {item.description.trim().length > 0 ? (
                  <p className={styles.cardDescription}>{item.description}</p>
                ) : null}

                {item.price.trim().length > 0 ? (
                  <p className={styles.cardPrice}>{item.price}</p>
                ) : null}

                {item.meta.trim().length > 0 ? (
                  <p className={styles.cardMeta}>{item.meta}</p>
                ) : null}

                <p className={styles.nestedCount}>
                  Nested gallery items: {item.galleryItems.length}
                </p>
              </div>

              {resolvedHref ? (
                <Link
                  href={resolvedHref}
                  aria-label={`Open ${item.title.trim().length > 0 ? item.title : `project ${index + 1}`}`}
                  className={styles.overlayLink}
                >
                  <span className="sr-only">
                    Open {item.title.trim().length > 0 ? item.title : `project ${index + 1}`}
                  </span>
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
