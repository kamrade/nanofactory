import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GalleryItemKeyboardNav } from "./gallery-item-keyboard-nav";

import { getAssetsByProjectId } from "@/lib/assets";
import { buildAssetMap, resolveAssetById } from "@/lib/assets/resolution";
import { normalizePageContent } from "@/lib/editor/content";
import {
  buildEffectivePageAnchors,
  getGalleryItemEffectiveAnchor,
  normalizeAnchorId,
} from "@/lib/editor/anchor-id";
import { getPublishedProjectBySlug } from "@/lib/projects";

type GalleryItemPageProps = {
  params: Promise<{
    slug: string;
    galleryAnchor: string;
    itemAnchor: string;
  }>;
};

type ResolvedGalleryItem = {
  projectSlug: string;
  projectName: string;
  galleryAnchor: string;
  itemAnchor: string;
  itemIndex: number;
  totalItems: number;
  previousItemAnchor?: string;
  nextItemAnchor?: string;
  title: string;
  description: string;
  price: string;
  meta: string;
  assetId?: string;
};

async function resolvePublishedGalleryItem(
  slug: string,
  galleryAnchor: string,
  itemAnchor: string
): Promise<ResolvedGalleryItem | null> {
  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    return null;
  }

  const content = normalizePageContent(project.contentJson);
  const effectiveAnchors = buildEffectivePageAnchors(content.blocks);
  const normalizedGalleryAnchor = normalizeAnchorId(galleryAnchor);
  const normalizedItemAnchor = normalizeAnchorId(itemAnchor);

  const galleryBlock = content.blocks.find(
    (block) =>
      block.type === "gallery" &&
      effectiveAnchors.blockAnchors.get(block.id) === normalizedGalleryAnchor &&
      Array.isArray(block.props.items)
  );

  if (!galleryBlock || !Array.isArray(galleryBlock.props.items)) {
    return null;
  }

  const galleryItemIndex = galleryBlock.props.items.findIndex((item, index) => {
    const effectiveItemAnchor = getGalleryItemEffectiveAnchor(
      effectiveAnchors.galleryItemAnchors,
      galleryBlock.id,
      index
    );
    return effectiveItemAnchor === normalizedItemAnchor;
  });

  if (galleryItemIndex < 0) {
    return null;
  }

  const allGalleryAnchors = galleryBlock.props.items.map((_, index) =>
    getGalleryItemEffectiveAnchor(effectiveAnchors.galleryItemAnchors, galleryBlock.id, index)
  );

  const rawItem = galleryBlock.props.items[galleryItemIndex];
  if (typeof rawItem !== "object" || rawItem === null) {
    return null;
  }

  const item = rawItem as Record<string, unknown>;

  return {
    projectSlug: project.slug,
    projectName: project.name,
    galleryAnchor: normalizedGalleryAnchor,
    itemAnchor: normalizedItemAnchor,
    itemIndex: galleryItemIndex,
    totalItems: galleryBlock.props.items.length,
    previousItemAnchor:
      galleryItemIndex > 0 ? allGalleryAnchors[galleryItemIndex - 1] ?? undefined : undefined,
    nextItemAnchor:
      galleryItemIndex < galleryBlock.props.items.length - 1
        ? allGalleryAnchors[galleryItemIndex + 1] ?? undefined
        : undefined,
    title: typeof item.title === "string" ? item.title : "",
    description: typeof item.description === "string" ? item.description : "",
    price: typeof item.price === "string" ? item.price : "",
    meta: typeof item.meta === "string" ? item.meta : "",
    assetId: typeof item.assetId === "string" ? item.assetId : undefined,
  };
}

export async function generateMetadata({ params }: GalleryItemPageProps): Promise<Metadata> {
  const { slug, galleryAnchor, itemAnchor } = await params;
  const resolved = await resolvePublishedGalleryItem(slug, galleryAnchor, itemAnchor);

  if (!resolved) {
    return {
      title: "Gallery item not found",
    };
  }

  const title = resolved.title.trim().length > 0 ? resolved.title : "Gallery item";
  const description =
    resolved.description.trim().length > 0
      ? resolved.description
      : `${resolved.projectName} gallery item`;

  return {
    title: `${title} · ${resolved.projectName}`,
    description,
  };
}

export default async function PublishedGalleryItemPage({ params }: GalleryItemPageProps) {
  const { slug, galleryAnchor, itemAnchor } = await params;
  const resolved = await resolvePublishedGalleryItem(slug, galleryAnchor, itemAnchor);

  if (!resolved) {
    notFound();
  }

  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const assets = await getAssetsByProjectId(project.id);
  const assetMap = buildAssetMap(assets);
  const asset = resolveAssetById(resolved.assetId, assetMap);
  const previousHref = resolved.previousItemAnchor
    ? `../${resolved.previousItemAnchor}`
    : undefined;
  const nextHref = resolved.nextItemAnchor
    ? `../${resolved.nextItemAnchor}`
    : undefined;

  return (
    <main className="min-h-screen bg-bg py-10 text-text-main">
      <GalleryItemKeyboardNav previousHref={previousHref} nextHref={nextHref} />
      <div className="container mx-auto grid max-w-4xl gap-6 px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`../..#${resolved.galleryAnchor}`}
            className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:bg-surface-alt"
          >
            Back to gallery
          </Link>
          <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-muted">
            <span>
              Item {resolved.itemIndex + 1} of {resolved.totalItems}
            </span>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-line bg-surface-alt">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
            {previousHref ? (
              <Link
                href={previousHref}
                className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:bg-surface-alt"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center rounded-xl border border-line bg-surface-alt px-3 py-2 text-sm font-medium text-text-placeholder">
                Previous
              </span>
            )}

            {nextHref ? (
              <Link
                href={nextHref}
                className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:bg-surface-alt"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center rounded-xl border border-line bg-surface-alt px-3 py-2 text-sm font-medium text-text-placeholder">
                Next
              </span>
            )}
          </div>
          {asset ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.publicUrl}
              alt={asset.alt ?? asset.originalFilename}
              className="h-auto w-full object-contain"
            />
          ) : (
            <div className="flex min-h-64 items-center justify-center text-sm text-text-muted">
              No image
            </div>
          )}
        </section>

        <section className="grid gap-2 rounded-2xl border border-line bg-surface p-5">
          {resolved.title.trim().length > 0 ? (
            <h1 className="text-2xl font-semibold tracking-tight text-text-main">{resolved.title}</h1>
          ) : (
            <h1 className="text-2xl font-semibold tracking-tight text-text-main">
              Gallery item
            </h1>
          )}
          {resolved.description.trim().length > 0 ? (
            <p className="text-sm leading-7 text-text-muted">{resolved.description}</p>
          ) : null}
          {resolved.price.trim().length > 0 ? (
            <p className="text-base font-semibold text-text-main">{resolved.price}</p>
          ) : null}
          {resolved.meta.trim().length > 0 ? (
            <p className="text-xs text-text-muted">{resolved.meta}</p>
          ) : null}
        </section>

      </div>
    </main>
  );
}
