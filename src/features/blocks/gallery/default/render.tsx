import Image from "next/image";
import type { CSSProperties } from "react";

import { ModeAwareLink } from "@/components/projects/mode-aware-link";
import { resolveAssetById } from "@/lib/assets/resolution";
import type { BlockRenderProps } from "../../shared/types";
import { BlockSectionTitle } from "../../shared/components/block-section-title/block-section-title";
import styles from "./render.module.css";

type GalleryItem = {
  assetId: string | undefined;
  entryAnchor: string | undefined;
  title: string;
  description: string;
  price: string;
  meta: string;
};

function readSectionTitle(props: Record<string, unknown>) {
  return typeof props.sectionTitle === "string" ? props.sectionTitle : "";
}

function readColumns(props: Record<string, unknown>): 1 | 2 | 3 | 4 {
  const raw = Number(props.columns);
  if (raw === 1 || raw === 2 || raw === 3 || raw === 4) {
    return raw;
  }
  return 3;
}

function readItems(props: Record<string, unknown>): GalleryItem[] {
  if (!Array.isArray(props.items)) {
    return [];
  }

  return props.items
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;
      return {
        assetId: typeof record.assetId === "string" ? record.assetId : undefined,
        entryAnchor:
          typeof record.entryAnchor === "string"
            ? record.entryAnchor
            : typeof record.imageAnchor === "string"
              ? record.imageAnchor
              : undefined,
        title: typeof record.title === "string" ? record.title : "",
        description: typeof record.description === "string" ? record.description : "",
        price: typeof record.price === "string" ? record.price : "",
        meta: typeof record.meta === "string" ? record.meta : "",
      };
    })
    .filter((item): item is GalleryItem => item !== null);
}

function readImageHeightMode(props: Record<string, unknown>): "fixed" | "natural" {
  return props.imageHeightMode === "natural" ? "natural" : "fixed";
}

export function GalleryDefaultRender({
  block,
  assetMap,
  mode = "light",
  projectBorderRadiusPolicy,
  projectSpacingScale,
  projectSurfaceStyle,
  publicProjectSlug,
  galleryItemLinkMode = "absolute",
  effectiveBlockAnchorId,
  effectiveGalleryItemAnchors,
}: BlockRenderProps) {
  const sectionTitle = readSectionTitle(block.props);
  const animate = block.props.animate !== false;
  const columns = readColumns(block.props);
  const imageHeightMode = readImageHeightMode(block.props);
  const items = readItems(block.props);

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
          "--gallery-radius-card": "0px",
          "--gallery-radius-media": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--gallery-radius-card": "0.75rem",
            "--gallery-radius-media": "0.5rem",
          }
        : {
            "--gallery-radius-card": "1rem",
            "--gallery-radius-media": "1rem",
          };

  return (
    <section
      data-spacing-scale={effectiveSpacingScale}
      data-surface-style={projectSurfaceStyle ?? "default"}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      <BlockSectionTitle title={sectionTitle} animate={animate} />

      <div
        className={styles.grid}
        data-image-height-mode={imageHeightMode}
        data-columns={columns}
      >
        {items.map((item, index) => {
          const asset = resolveAssetById(item.assetId, assetMap);
          const itemAnchorId = effectiveGalleryItemAnchors?.get(index);
          const baseHref =
            publicProjectSlug && effectiveBlockAnchorId && itemAnchorId
              ? galleryItemLinkMode === "relative"
                ? `./${effectiveBlockAnchorId}/${itemAnchorId}`
                : `/p/${publicProjectSlug}/${effectiveBlockAnchorId}/${itemAnchorId}`
              : null;

          return (
            <article
              key={`${block.id}-gallery-${index}`}
              id={itemAnchorId}
              className={styles.card}
            >
              {asset ? (
                baseHref ? (
                  <ModeAwareLink href={baseHref} className={styles.imageLink} fallbackMode={mode}>
                    <Image
                      src={asset.publicUrl}
                      alt={asset.alt ?? asset.originalFilename}
                      width={800}
                      height={600}
                      unoptimized
                      className={styles.cardImage}
                    />
                  </ModeAwareLink>
                ) : (
                  <Image
                    src={asset.publicUrl}
                    alt={asset.alt ?? asset.originalFilename}
                    width={800}
                    height={600}
                    unoptimized
                    className={styles.cardImage}
                  />
                )
              ) : (
                <div className={styles.cardPlaceholder}>No image</div>
              )}

              {(item.title || item.description || item.price || item.meta) ? (
                <div className={styles.cardContent}>
                  {item.title.trim().length > 0 ? (
                    <p className={styles.cardTitle}>{item.title}</p>
                  ) : null}
                  {item.description.trim().length > 0 ? (
                    <p className={styles.cardDescription}>{item.description}</p>
                  ) : null}
                  {item.price.trim().length > 0 ? (
                    <p className={styles.cardPrice}>{item.price}</p>
                  ) : null}
                  {item.meta.trim().length > 0 ? (
                    <p className={styles.cardMeta}>{item.meta}</p>
                  ) : null}
                </div>
              ) : null}

              {baseHref ? (
                <ModeAwareLink
                  href={baseHref}
                  aria-label={`Open ${item.title.trim().length > 0 ? item.title : `gallery item ${index + 1}`}`}
                  className={styles.overlayLink}
                  fallbackMode={mode}
                >
                  <span className="sr-only">
                    Open {item.title.trim().length > 0 ? item.title : `gallery item ${index + 1}`}
                  </span>
                </ModeAwareLink>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
