import Image from "next/image";
import Link from "next/link";

import { resolveAssetById } from "@/lib/assets/resolution";
import type { BlockRenderProps } from "../../shared/types";

type GalleryItem = {
  assetId: string | undefined;
  imageAnchor: string | undefined;
  title: string;
  description: string;
  price: string;
  meta: string;
};

type GalleryImageHeightMode = "fixed" | "natural";

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
        imageAnchor: typeof record.imageAnchor === "string" ? record.imageAnchor : undefined,
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

export function GalleryDefaultRender({
  block,
  assetMap,
  theme,
  publicProjectSlug,
  effectiveBlockAnchorId,
  effectiveGalleryItemAnchors,
}: BlockRenderProps) {
  const sectionTitle = readSectionTitle(block.props);
  const columns = readColumns(block.props);
  const imageHeightMode = readImageHeightMode(block.props);
  const items = readItems(block.props);

  return (
    <section className="space-y-6 p-4 md:p-8">
      {sectionTitle.trim().length > 0 ? (
        <h2 className="text-2xl font-semibold tracking-tight text-text-main">{sectionTitle}</h2>
      ) : null}

      <div
        className={
          imageHeightMode === "natural"
            ? `columns-1 gap-4 ${MASONRY_COLUMNS_CLASS[columns]}`
            : `grid grid-cols-1 items-start gap-4 ${GRID_COLUMNS_CLASS[columns]}`
        }
      >
        {items.map((item, index) => {
          const asset = resolveAssetById(item.assetId, assetMap);
          const itemAnchorId = effectiveGalleryItemAnchors?.get(index);
          const itemHref =
            publicProjectSlug && effectiveBlockAnchorId && itemAnchorId
              ? `/p/${publicProjectSlug}/${effectiveBlockAnchorId}/${itemAnchorId}`
              : null;
          return (
            <article
              key={`${block.id}-gallery-${index}`}
              id={itemAnchorId}
              className={
                imageHeightMode === "natural"
                  ? "relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-line bg-surface-alt"
                  : "relative self-start overflow-hidden rounded-2xl border border-line bg-surface-alt"
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
                        : "h-56 w-full object-cover"
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
                      : "h-56 w-full object-cover"
                  }
                />
              ) : (
                  <div
                    className={
                      imageHeightMode === "natural"
                        ? "flex min-h-40 w-full items-center justify-center bg-surface text-sm text-text-muted"
                        : "flex h-56 w-full items-center justify-center bg-surface text-sm text-text-muted"
                    }
                  >
                    No image
                  </div>
                )}

              {(item.title || item.description || item.price || item.meta) ? (
                <div className="space-y-2 p-4">
                  {item.title.trim().length > 0 ? (
                    <p className="text-base font-semibold text-text-main">{item.title}</p>
                  ) : null}
                  {item.description.trim().length > 0 ? (
                    <p className={`text-sm leading-6 ${theme.muted}`}>{item.description}</p>
                  ) : null}
                  {item.price.trim().length > 0 ? (
                    <p className="text-sm font-semibold text-text-main">{item.price}</p>
                  ) : null}
                  {item.meta.trim().length > 0 ? (
                    <p className="text-xs text-text-muted">{item.meta}</p>
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
