import Image from "next/image";
import Link from "next/link";

import { resolveAssetById } from "@/lib/assets/resolution";
import type { BlockRenderProps } from "../../shared/types";
import {
  getEffectiveNestedGalleryAnchor,
  getEffectiveProjectAnchor,
  readProjectsGalleryProps,
} from "./model";

export function ProjectsGalleryDefaultRender({
  block,
  assetMap,
  theme,
  mode = "light",
  publicProjectSlug,
  galleryItemLinkMode = "absolute",
}: BlockRenderProps) {
  const props = readProjectsGalleryProps(block.props);
  const modeQuery = `?mode=${mode}`;

  return (
    <section className="space-y-6 p-4 md:p-8">
      {props.sectionTitle.trim().length > 0 ? (
        <h2 className="text-2xl font-semibold tracking-tight text-text-main">{props.sectionTitle}</h2>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              className="relative overflow-hidden rounded-2xl border border-line bg-surface-alt"
            >
              {imageAsset ? resolvedHref ? (
                <Link href={resolvedHref} className="block transition hover:opacity-95">
                  <Image
                    src={imageAsset.publicUrl}
                    alt={imageAsset.alt ?? imageAsset.originalFilename}
                    width={800}
                    height={600}
                    unoptimized
                    className="h-56 w-full object-cover"
                  />
                </Link>
              ) : (
                <Image
                  src={imageAsset.publicUrl}
                  alt={imageAsset.alt ?? imageAsset.originalFilename}
                  width={800}
                  height={600}
                  unoptimized
                  className="h-56 w-full object-cover"
                />
              ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-surface text-sm text-text-muted">
                    No image
                  </div>
                )}

              <div className="space-y-2 p-4">
                {item.title.trim().length > 0 ? (
                  <p className="text-base font-semibold text-text-main">{item.title}</p>
                ) : (
                  <p className="text-base font-semibold text-text-main">Project {index + 1}</p>
                )}

                {item.description.trim().length > 0 ? (
                  <p className={`text-sm leading-6 ${theme.muted}`}>{item.description}</p>
                ) : null}

                {item.price.trim().length > 0 ? (
                  <p className="text-sm font-semibold text-text-main">{item.price}</p>
                ) : null}

                {item.meta.trim().length > 0 ? (
                  <p className="text-xs text-text-muted">{item.meta}</p>
                ) : null}

                <p className="pt-1 text-xs text-text-muted">
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
