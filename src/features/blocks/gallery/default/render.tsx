import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { resolveAssetById } from "@/lib/assets/resolution";
import { buildModeQuery } from "@/lib/routing/mode-query";
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
  publicProjectSlug,
  galleryItemLinkMode = "absolute",
  effectiveBlockAnchorId,
  effectiveGalleryItemAnchors,
}: BlockRenderProps) {
  const sectionTitle = readSectionTitle(block.props);
  const columns = readColumns(block.props);
  const imageHeightMode = readImageHeightMode(block.props);
  const items = readItems(block.props);
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
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      <BlockSectionTitle title={sectionTitle} />

      <div
        className={styles.grid}
        data-image-height-mode={imageHeightMode}
        data-columns={columns}
      >
        {items.map((item, index) => {
          const asset = resolveAssetById(item.assetId, assetMap);
          const itemAnchorId = effectiveGalleryItemAnchors?.get(index);
          const itemHref =
            publicProjectSlug && effectiveBlockAnchorId && itemAnchorId
              ? galleryItemLinkMode === "relative"
                ? `./${effectiveBlockAnchorId}/${itemAnchorId}${modeQuery}`
                : `/p/${publicProjectSlug}/${effectiveBlockAnchorId}/${itemAnchorId}${modeQuery}`
              : null;

          return (
            <article
              key={`${block.id}-gallery-${index}`}
              id={itemAnchorId}
              className={styles.card}
            >
              {asset ? (
                itemHref ? (
                  <Link href={itemHref} className={styles.imageLink}>
                    <Image
                      src={asset.publicUrl}
                      alt={asset.alt ?? asset.originalFilename}
                      width={800}
                      height={600}
                      unoptimized
                      className={styles.cardImage}
                    />
                  </Link>
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

              {itemHref ? (
                <Link
                  href={itemHref}
                  aria-label={`Open ${item.title.trim().length > 0 ? item.title : `gallery item ${index + 1}`}`}
                  className={styles.overlayLink}
                >
                  <span className="sr-only">
                    Open {item.title.trim().length > 0 ? item.title : `gallery item ${index + 1}`}
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
