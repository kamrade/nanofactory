import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { resolveAssetById } from "@/lib/assets/resolution";
import { buildModeQuery } from "@/lib/routing/mode-query";
import type { BlockRenderProps } from "../../shared/types";

type GalleryItem = {
  assetId: string | undefined;
  entryAnchor: string | undefined;
  title: string;
  description: string;
  price: string;
  meta: string;
};

type GalleryImageHeightMode = "fixed" | "natural";
type BorderRadiusPolicy = "none" | "md" | "lg";
type SpacingScale = "sm" | "md" | "lg";

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

function readImageHeightMode(props: Record<string, unknown>): GalleryImageHeightMode {
  return props.imageHeightMode === "natural" ? "natural" : "fixed";
}

const GRID_COLUMNS_CLASS: Record<1 | 2 | 3 | 4, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

const MASONRY_COLUMNS_CLASS: Record<1 | 2 | 3 | 4, string> = {
  1: "md:columns-1",
  2: "md:columns-2",
  3: "md:columns-3",
  4: "md:columns-4",
};

const GALLERY_SPACING: Record<
  SpacingScale,
  {
    sectionClassName: string;
    titleClassName: string;
    gapClassName: string;
    masonryCardGapClassName: string;
    fixedImageClassName: string;
    cardContentClassName: string;
    cardTitleClassName: string;
    cardDescriptionClassName: string;
    cardPriceClassName: string;
    cardMetaClassName: string;
  }
> = {
  sm: {
    sectionClassName: "space-y-4 p-3 md:p-5",
    titleClassName: "text-xl font-semibold tracking-tight text-text-main",
    gapClassName: "gap-2",
    masonryCardGapClassName: "mb-2",
    fixedImageClassName: "h-56 w-full object-cover",
    cardContentClassName: "space-y-1 p-3",
    cardTitleClassName: "text-sm font-semibold text-text-main",
    cardDescriptionClassName: "text-xs leading-5",
    cardPriceClassName: "text-xs font-semibold text-text-main",
    cardMetaClassName: "text-[11px] text-text-muted",
  },
  md: {
    sectionClassName: "space-y-6 p-4 md:p-8",
    titleClassName: "text-2xl font-semibold tracking-tight text-text-main",
    gapClassName: "gap-4",
    masonryCardGapClassName: "mb-4",
    fixedImageClassName: "h-56 w-full object-cover",
    cardContentClassName: "space-y-2 p-4",
    cardTitleClassName: "text-base font-semibold text-text-main",
    cardDescriptionClassName: "text-sm leading-6",
    cardPriceClassName: "text-sm font-semibold text-text-main",
    cardMetaClassName: "text-xs text-text-muted",
  },
  lg: {
    sectionClassName: "space-y-8 p-6 md:p-10",
    titleClassName: "text-3xl font-semibold tracking-tight text-text-main",
    gapClassName: "gap-5",
    masonryCardGapClassName: "mb-5",
    fixedImageClassName: "h-56 w-full object-cover",
    cardContentClassName: "space-y-3 p-5",
    cardTitleClassName: "text-lg font-semibold text-text-main",
    cardDescriptionClassName: "text-base leading-7",
    cardPriceClassName: "text-base font-semibold text-text-main",
    cardMetaClassName: "text-sm text-text-muted",
  },
};

export function GalleryDefaultRender({
  block,
  assetMap,
  theme,
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
  const effectiveSpacingScale: SpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";
  const spacing = GALLERY_SPACING[effectiveSpacingScale];
  const effectiveBorderRadius: BorderRadiusPolicy =
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
    <section className={spacing.sectionClassName} style={radiusVars as CSSProperties}>
      {sectionTitle.trim().length > 0 ? (
        <h2 className={spacing.titleClassName}>{sectionTitle}</h2>
      ) : null}

      <div
        className={
          imageHeightMode === "natural"
            ? `columns-1 ${spacing.gapClassName} ${MASONRY_COLUMNS_CLASS[columns]}`
            : `grid grid-cols-1 items-start ${spacing.gapClassName} ${GRID_COLUMNS_CLASS[columns]}`
        }
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
              className={
                imageHeightMode === "natural"
                  ? `relative ${spacing.masonryCardGapClassName} break-inside-avoid overflow-hidden border border-line bg-surface-alt [border-radius:var(--gallery-radius-card)]`
                  : "relative self-start overflow-hidden border border-line bg-surface-alt [border-radius:var(--gallery-radius-card)]"
              }
            >
              {asset ? itemHref ? (
                <Link href={itemHref} className="block transition hover:opacity-95">
                  <Image
                    src={asset.publicUrl}
                    alt={asset.alt ?? asset.originalFilename}
                    width={800}
                    height={600}
                    unoptimized
                    className={
                      imageHeightMode === "natural"
                        ? "h-auto w-full object-contain"
                        : spacing.fixedImageClassName
                    }
                  />
                </Link>
              ) : (
                <Image
                  src={asset.publicUrl}
                  alt={asset.alt ?? asset.originalFilename}
                  width={800}
                  height={600}
                  unoptimized
                  className={
                    imageHeightMode === "natural"
                      ? "h-auto w-full object-contain"
                      : spacing.fixedImageClassName
                  }
                />
              ) : (
                  <div
                    className={
                      imageHeightMode === "natural"
                        ? "flex min-h-56 w-full items-center justify-center bg-surface text-sm text-text-muted"
                        : `flex ${spacing.fixedImageClassName.replace("object-cover", "")} items-center justify-center bg-surface text-sm text-text-muted`
                    }
                    style={{ borderRadius: "var(--gallery-radius-media)" }}
                  >
                    No image
                  </div>
                )}

              {(item.title || item.description || item.price || item.meta) ? (
                <div className={spacing.cardContentClassName}>
                  {item.title.trim().length > 0 ? (
                    <p className={spacing.cardTitleClassName}>{item.title}</p>
                  ) : null}
                  {item.description.trim().length > 0 ? (
                    <p className={`${spacing.cardDescriptionClassName} ${theme.muted}`}>{item.description}</p>
                  ) : null}
                  {item.price.trim().length > 0 ? (
                    <p className={spacing.cardPriceClassName}>{item.price}</p>
                  ) : null}
                  {item.meta.trim().length > 0 ? (
                    <p className={spacing.cardMetaClassName}>{item.meta}</p>
                  ) : null}
                </div>
              ) : null}

              {itemHref ? (
                <Link
                  href={itemHref}
                  aria-label={`Open ${item.title.trim().length > 0 ? item.title : `gallery item ${index + 1}`}`}
                  className="absolute inset-0 z-20"
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
