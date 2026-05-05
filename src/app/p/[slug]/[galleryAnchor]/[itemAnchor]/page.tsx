import Link from "next/link";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GalleryItemKeyboardNav } from "./gallery-item-keyboard-nav";

import { getAssetsByProjectId } from "@/lib/assets";
import { buildAssetMap, resolveAssetById } from "@/lib/assets/resolution";
import { normalizePageContent } from "@/lib/editor/content";
import {
  readModeCookieValue,
  resolveGalleryItemMode,
} from "@/lib/gallery-item/mode";
import {
  type ResolvedGalleryItem,
  resolveGalleryItemFromContent,
} from "@/lib/gallery-item/resolve";
import { buildGalleryItemPageViewModel } from "@/lib/gallery-item/view-model";
import { getPublishedProjectBySlug } from "@/lib/projects";

type GalleryItemPageProps = {
  params: Promise<{
    slug: string;
    galleryAnchor: string;
    itemAnchor: string;
  }>;
  searchParams?: Promise<{
    mode?: string;
  }>;
};

type ResolvedPublishedGalleryItem = ResolvedGalleryItem & {
  projectSlug: string;
  projectName: string;
};

export async function resolvePublishedGalleryItem(
  slug: string,
  galleryAnchor: string,
  itemAnchor: string
): Promise<ResolvedPublishedGalleryItem | null> {
  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    return null;
  }

  const content = normalizePageContent(project.contentJson);
  const resolved = resolveGalleryItemFromContent(content, galleryAnchor, itemAnchor);
  if (!resolved) {
    return null;
  }

  return {
    projectSlug: project.slug,
    projectName: project.name,
    ...resolved,
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

export default async function PublishedGalleryItemPage({
  params,
  searchParams,
}: GalleryItemPageProps) {
  const { slug, galleryAnchor, itemAnchor } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const resolvedMode = resolveGalleryItemMode({
    searchMode: resolvedSearchParams.mode,
    referer: requestHeaders.get("referer"),
    cookieMode: readModeCookieValue(cookieStore),
  });
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
  const viewModel = buildGalleryItemPageViewModel({
    resolvedItem: resolved,
    projectThemeKey: project.themeKey,
    mode: resolvedMode,
    host: requestHeaders.get("host"),
  });

  return (
    <main
      data-theme={viewModel.resolvedThemeKey}
      data-mode={resolvedMode}
      className="min-h-screen bg-bg py-10 text-text-main"
    >
      <GalleryItemKeyboardNav
        previousHref={viewModel.navigationHrefs.previousHref}
        nextHref={viewModel.navigationHrefs.nextHref}
      />
      <div className="container mx-auto grid max-w-4xl gap-6 px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={viewModel.navigationHrefs.backHref}
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
            {viewModel.navigationHrefs.previousHref ? (
              <Link
                href={viewModel.navigationHrefs.previousHref}
                className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:bg-surface-alt"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center rounded-xl border border-line bg-surface-alt px-3 py-2 text-sm font-medium text-text-placeholder">
                Previous
              </span>
            )}

            {viewModel.navigationHrefs.nextHref ? (
              <Link
                href={viewModel.navigationHrefs.nextHref}
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
