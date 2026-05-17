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
type BorderRadiusPolicy = "none" | "md" | "lg";
type SpacingScale = "sm" | "md" | "lg";

const PROJECTS_GALLERY_SPACING: Record<
  SpacingScale,
  {
    sectionClassName: string;
    titleClassName: string;
    gridClassName: string;
    mediaClassName: string;
    mediaPlaceholderClassName: string;
    cardContentClassName: string;
    cardTitleClassName: string;
    cardDescriptionClassName: string;
    cardPriceClassName: string;
    cardMetaClassName: string;
    nestedCountClassName: string;
  }
> = {
  sm: {
    sectionClassName: "space-y-4 p-3 md:p-5",
    titleClassName: "text-xl font-semibold tracking-tight text-text-main",
    gridClassName: "grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3",
    mediaClassName: "h-56 w-full object-cover [border-radius:var(--projects-gallery-radius-media)]",
    mediaPlaceholderClassName:
      "flex h-56 w-full items-center justify-center bg-surface text-sm text-text-muted [border-radius:var(--projects-gallery-radius-media)]",
    cardContentClassName: "space-y-1 p-3",
    cardTitleClassName: "text-sm font-semibold text-text-main",
    cardDescriptionClassName: "text-xs leading-5",
    cardPriceClassName: "text-xs font-semibold text-text-main",
    cardMetaClassName: "text-[11px] text-text-muted",
    nestedCountClassName: "pt-1 text-[11px] text-text-muted",
  },
  md: {
    sectionClassName: "space-y-6 p-4 md:p-8",
    titleClassName: "text-2xl font-semibold tracking-tight text-text-main",
    gridClassName: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
    mediaClassName: "h-56 w-full object-cover [border-radius:var(--projects-gallery-radius-media)]",
    mediaPlaceholderClassName:
      "flex h-56 w-full items-center justify-center bg-surface text-sm text-text-muted [border-radius:var(--projects-gallery-radius-media)]",
    cardContentClassName: "space-y-2 p-4",
    cardTitleClassName: "text-base font-semibold text-text-main",
    cardDescriptionClassName: "text-sm leading-6",
    cardPriceClassName: "text-sm font-semibold text-text-main",
    cardMetaClassName: "text-xs text-text-muted",
    nestedCountClassName: "pt-1 text-xs text-text-muted",
  },
  lg: {
    sectionClassName: "space-y-8 p-6 md:p-10",
    titleClassName: "text-3xl font-semibold tracking-tight text-text-main",
    gridClassName: "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3",
    mediaClassName: "h-56 w-full object-cover [border-radius:var(--projects-gallery-radius-media)]",
    mediaPlaceholderClassName:
      "flex h-56 w-full items-center justify-center bg-surface text-base text-text-muted [border-radius:var(--projects-gallery-radius-media)]",
    cardContentClassName: "space-y-3 p-5",
    cardTitleClassName: "text-lg font-semibold text-text-main",
    cardDescriptionClassName: "text-base leading-7",
    cardPriceClassName: "text-base font-semibold text-text-main",
    cardMetaClassName: "text-sm text-text-muted",
    nestedCountClassName: "pt-1 text-sm text-text-muted",
  },
};

export function ProjectsGalleryDefaultRender({
  block,
  assetMap,
  theme,
  mode = "light",
  projectBorderRadiusPolicy,
  projectSpacingScale,
  publicProjectSlug,
  galleryItemLinkMode = "absolute",
}: BlockRenderProps) {
  const props = readProjectsGalleryProps(block.props);
  const modeQuery = buildModeQuery(mode);
  const effectiveSpacingScale: SpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";
  const spacing = PROJECTS_GALLERY_SPACING[effectiveSpacingScale];
  const effectiveBorderRadius: BorderRadiusPolicy =
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
    <section className={spacing.sectionClassName} style={radiusVars as CSSProperties}>
      {props.sectionTitle.trim().length > 0 ? (
        <h2 className={spacing.titleClassName}>{props.sectionTitle}</h2>
      ) : null}

      <div className={spacing.gridClassName}>
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
              className="relative overflow-hidden border border-line bg-surface-alt [border-radius:var(--projects-gallery-radius-card)]"
            >
              {imageAsset ? resolvedHref ? (
                <Link href={resolvedHref} className="block transition hover:opacity-95">
                  <Image
                  src={imageAsset.publicUrl}
                  alt={imageAsset.alt ?? imageAsset.originalFilename}
                  width={800}
                  height={600}
                  unoptimized
                  className={spacing.mediaClassName}
                />
              </Link>
              ) : (
                <Image
                  src={imageAsset.publicUrl}
                  alt={imageAsset.alt ?? imageAsset.originalFilename}
                  width={800}
                  height={600}
                  unoptimized
                  className={spacing.mediaClassName}
                />
              ) : (
                  <div className={spacing.mediaPlaceholderClassName}>
                    No image
                  </div>
                )}

              <div className={spacing.cardContentClassName}>
                {item.title.trim().length > 0 ? (
                  <p className={spacing.cardTitleClassName}>{item.title}</p>
                ) : (
                  <p className={spacing.cardTitleClassName}>Project {index + 1}</p>
                )}

                {item.description.trim().length > 0 ? (
                  <p className={`${spacing.cardDescriptionClassName} ${theme.muted}`}>{item.description}</p>
                ) : null}

                {item.price.trim().length > 0 ? (
                  <p className={spacing.cardPriceClassName}>{item.price}</p>
                ) : null}

                {item.meta.trim().length > 0 ? (
                  <p className={spacing.cardMetaClassName}>{item.meta}</p>
                ) : null}

                <p className={spacing.nestedCountClassName}>
                  Nested gallery items: {item.galleryItems.length}
                </p>
              </div>
              {resolvedHref ? (
                <Link
                  href={resolvedHref}
                  aria-label={`Open ${item.title.trim().length > 0 ? item.title : `project ${index + 1}`}`}
                  className="absolute inset-0 z-20"
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
