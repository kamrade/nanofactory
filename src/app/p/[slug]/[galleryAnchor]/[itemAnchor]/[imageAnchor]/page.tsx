import Link from "next/link";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { GalleryItemKeyboardNav } from "../gallery-item-keyboard-nav";
import { getAssetsByProjectId } from "@/lib/assets";
import { buildAssetMap, resolveAssetById } from "@/lib/assets/resolution";
import { normalizePageContent } from "@/lib/editor/content";
import {
  readModeCookieValue,
  resolveGalleryItemMode,
} from "@/lib/gallery-item/mode";
import { getPublishedProjectBySlug } from "@/lib/projects";
import {
  type ResolvedProjectsGalleryImage,
  resolveProjectsGalleryImageFromContent,
} from "@/lib/projects-gallery/resolve";
import { resolveGalleryItemLinkModeByHost } from "@/lib/routing/gallery-link-mode";
import { DEFAULT_THEME_KEY, isThemeKey } from "@/lib/themes";

type ProjectsGalleryImagePageProps = {
  params: Promise<{
    slug: string;
    galleryAnchor: string;
    itemAnchor: string;
    imageAnchor: string;
  }>;
  searchParams?: Promise<{
    mode?: string;
  }>;
};

type ResolvedPublishedProjectsGalleryImage = ResolvedProjectsGalleryImage & {
  projectSlug: string;
  projectName: string;
  projectThemeKey: string;
};

async function resolvePublishedProjectsGalleryImage(
  slug: string,
  projectAnchor: string,
  nestedGalleryAnchor: string,
  imageAnchor: string
): Promise<ResolvedPublishedProjectsGalleryImage | null> {
  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    return null;
  }

  const content = normalizePageContent(project.contentJson);
  const resolved = resolveProjectsGalleryImageFromContent(
    content,
    projectAnchor,
    nestedGalleryAnchor,
    imageAnchor
  );
  if (!resolved) {
    return null;
  }

  return {
    projectSlug: project.slug,
    projectName: project.name,
    projectThemeKey: isThemeKey(project.themeKey) ? project.themeKey : DEFAULT_THEME_KEY,
    ...resolved,
  };
}

export async function generateMetadata({
  params,
}: ProjectsGalleryImagePageProps): Promise<Metadata> {
  const { slug, galleryAnchor, itemAnchor, imageAnchor } = await params;
  const resolved = await resolvePublishedProjectsGalleryImage(
    slug,
    galleryAnchor,
    itemAnchor,
    imageAnchor
  );

  if (!resolved) {
    return {
      title: "Gallery image not found",
    };
  }

  const title = resolved.title.trim().length > 0 ? resolved.title : "Gallery image";
  const description =
    resolved.description.trim().length > 0
      ? resolved.description
      : `${resolved.projectName} project gallery image`;

  return {
    title: `${title} · ${resolved.projectName}`,
    description,
  };
}

export default async function ProjectsGalleryImagePage({
  params,
  searchParams,
}: ProjectsGalleryImagePageProps) {
  const { slug, galleryAnchor, itemAnchor, imageAnchor } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestHeaders = await headers();
  const linkMode = resolveGalleryItemLinkModeByHost(requestHeaders.get("host"));
  const cookieStore = await cookies();
  const resolvedMode = resolveGalleryItemMode({
    searchMode: resolvedSearchParams.mode,
    referer: requestHeaders.get("referer"),
    cookieMode: readModeCookieValue(cookieStore),
  });
  const resolved = await resolvePublishedProjectsGalleryImage(
    slug,
    galleryAnchor,
    itemAnchor,
    imageAnchor
  );
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
  const modeQuery = resolvedMode === "dark" ? "?mode=dark" : "";
  const backHref =
    linkMode === "relative"
      ? `../..${modeQuery}`
      : `/p/${resolved.projectSlug}/${resolved.projectAnchor}/${resolved.galleryAnchor}${modeQuery}`;
  const previousHref = resolved.previousImageAnchor
    ? linkMode === "relative"
      ? `../${resolved.previousImageAnchor}${modeQuery}`
      : `/p/${resolved.projectSlug}/${resolved.projectAnchor}/${resolved.galleryAnchor}/${resolved.previousImageAnchor}${modeQuery}`
    : undefined;
  const nextHref = resolved.nextImageAnchor
    ? linkMode === "relative"
      ? `../${resolved.nextImageAnchor}${modeQuery}`
      : `/p/${resolved.projectSlug}/${resolved.projectAnchor}/${resolved.galleryAnchor}/${resolved.nextImageAnchor}${modeQuery}`
    : undefined;

  return (
    <main
      data-theme={resolved.projectThemeKey}
      data-mode={resolvedMode}
      className="min-h-screen bg-bg py-10 text-text-main"
    >
      <GalleryItemKeyboardNav previousHref={previousHref} nextHref={nextHref} />

      <div className="container mx-auto grid max-w-4xl gap-6 px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={backHref}
            className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:bg-surface-alt"
          >
            Back to gallery
          </Link>
          <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-muted">
            <span>
              Item {resolved.imageIndex + 1} of {resolved.totalImages}
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
              Gallery image
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

