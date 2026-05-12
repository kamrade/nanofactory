import Link from "next/link";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GalleryItemKeyboardNav } from "./gallery-item-keyboard-nav";

import { MdRenderer } from "@/components/md-renderer";
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
import { resolveProjectsGalleryProjectFromContent } from "@/lib/projects-gallery/resolve";
import { buildModeQuery } from "@/lib/routing/mode-query";
import { resolveGalleryItemLinkModeByHost } from "@/lib/routing/gallery-link-mode";
import { enforceModeByPolicy } from "@/lib/projects/mode-policy";

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

type ResolvedPublishedProjectsGalleryProject = {
  projectSlug: string;
  projectName: string;
  projectThemeKey: string;
} & NonNullable<
  ReturnType<typeof resolveProjectsGalleryProjectFromContent>
>;

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

async function resolvePublishedProjectsGalleryProject(
  slug: string,
  projectAnchor: string,
  galleryAnchor: string
): Promise<ResolvedPublishedProjectsGalleryProject | null> {
  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    return null;
  }

  const content = normalizePageContent(project.contentJson);
  const resolved = resolveProjectsGalleryProjectFromContent(
    content,
    projectAnchor,
    galleryAnchor
  );
  if (!resolved) {
    return null;
  }

  return {
    projectSlug: project.slug,
    projectName: project.name,
    projectThemeKey: project.themeKey,
    ...resolved,
  };
}

export async function generateMetadata({ params }: GalleryItemPageProps): Promise<Metadata> {
  const { slug, galleryAnchor, itemAnchor } = await params;
  const resolvedProjectGallery = await resolvePublishedProjectsGalleryProject(
    slug,
    galleryAnchor,
    itemAnchor
  );
  if (resolvedProjectGallery) {
    const title =
      resolvedProjectGallery.title.trim().length > 0
        ? resolvedProjectGallery.title
        : "Project";
    const description =
      resolvedProjectGallery.description.trim().length > 0
        ? resolvedProjectGallery.description
        : `${resolvedProjectGallery.projectName} project gallery`;
    return {
      title: `${title} · ${resolvedProjectGallery.projectName}`,
      description,
    };
  }

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
  const linkMode = resolveGalleryItemLinkModeByHost(requestHeaders.get("host"));
  const cookieStore = await cookies();
  let resolvedMode = resolveGalleryItemMode({
    searchMode: resolvedSearchParams.mode,
    referer: requestHeaders.get("referer"),
    cookieMode: readModeCookieValue(cookieStore),
  });
  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    notFound();
  }
  resolvedMode = enforceModeByPolicy(project.modePolicy, resolvedMode);

  const resolvedProjectGallery = await resolvePublishedProjectsGalleryProject(
    slug,
    galleryAnchor,
    itemAnchor
  );

  if (resolvedProjectGallery) {
    const assets = await getAssetsByProjectId(project.id);
    const assetMap = buildAssetMap(assets);
    const modeQuery = buildModeQuery(resolvedMode);
    const previewImageItems = resolvedProjectGallery.galleryItems.filter(
      (item) => item.kind === "image"
    );
    const backHref =
      linkMode === "relative"
        ? `../..${modeQuery}#${resolvedProjectGallery.blockAnchor}`
        : `/p/${resolvedProjectGallery.projectSlug}${modeQuery}#${resolvedProjectGallery.blockAnchor}`;

    return (
      <main
        data-testid="projects-gallery-mode-container"
        data-theme={resolvedProjectGallery.projectThemeKey}
        data-mode={resolvedMode}
        className="min-h-screen bg-bg py-10 text-text-main"
      >
        <div className="container mx-auto grid max-w-5xl gap-6 px-4">
          <div data-testid="project-header" className="flex flex-wrap items-center justify-between gap-3">
            <Link
              data-testid="projects-gallery-back-to-projects"
              href={backHref}
              className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:bg-surface-alt"
            >
              Back to projects
            </Link>
            <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-muted">
              <span data-testid="projects-gallery-entry-count">
                {previewImageItems.length} items
              </span>
            </div>
          </div>

          <section className="grid gap-3 rounded-2xl border border-line bg-surface p-5">
            <h1 className="text-2xl font-semibold tracking-tight text-text-main">
              {resolvedProjectGallery.title.trim().length > 0
                ? resolvedProjectGallery.title
                : `Project ${resolvedProjectGallery.itemIndex + 1}`}
            </h1>
            {resolvedProjectGallery.descriptionMd.trim().length > 0 ? (
              <MdRenderer
                content={resolvedProjectGallery.descriptionMd}
                className="text-sm text-text-muted"
              />
            ) : null}
            {resolvedProjectGallery.price.trim().length > 0 ? (
              <p className="text-base font-semibold text-text-main">{resolvedProjectGallery.price}</p>
            ) : null}
            {resolvedProjectGallery.meta.trim().length > 0 ? (
              <p className="text-xs text-text-muted">{resolvedProjectGallery.meta}</p>
            ) : null}
          </section>

          <section
            data-testid="projects-gallery-all-entries"
            className="grid gap-3 rounded-2xl border border-line bg-surface p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-text-main">All entries</h2>
              <span className="text-sm text-text-muted">
                {resolvedProjectGallery.galleryItems.length} total
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resolvedProjectGallery.galleryItems.map((item, index) => {
                const asset = resolveAssetById(item.assetId, assetMap);
                const href =
                  linkMode === "relative"
                    ? `./${item.entryAnchor}${modeQuery}`
                    : `/p/${resolvedProjectGallery.projectSlug}/${resolvedProjectGallery.projectAnchor}/${resolvedProjectGallery.galleryAnchor}/${item.entryAnchor}${modeQuery}`;

                return (
                  <article
                    key={`all-${resolvedProjectGallery.projectAnchor}-${item.entryAnchor}-${index}`}
                    className={`relative overflow-hidden rounded-2xl border border-line bg-surface-alt ${
                      item.kind === "markdown" ? "md:col-span-2 lg:col-span-3" : ""
                    }`}
                  >
                    {item.kind === "markdown" ? (
                      <div className="flex min-h-56 items-start bg-surface p-4">
                        {item.contentMd.trim().length > 0 ? (
                          <MdRenderer content={item.contentMd} className="text-sm text-text-muted" />
                        ) : (
                          <p className="text-sm text-text-muted">No markdown content</p>
                        )}
                      </div>
                    ) : asset ? (
                      <Link href={href} className="block transition hover:opacity-95">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset.publicUrl}
                          alt={asset.alt ?? asset.originalFilename}
                          className="h-56 w-full object-cover"
                        />
                      </Link>
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center bg-surface text-sm text-text-muted">
                        No image
                      </div>
                    )}

                    {(item.title || item.description || item.price || item.meta) ? (
                      <div className="space-y-2 p-4">
                        {item.title.trim().length > 0 ? (
                          <p className="text-base font-semibold text-text-main">{item.title}</p>
                        ) : null}
                        {item.description.trim().length > 0 ? (
                          <p className="text-sm leading-6 text-text-muted">{item.description}</p>
                        ) : null}
                        {item.price.trim().length > 0 ? (
                          <p className="text-sm font-semibold text-text-main">{item.price}</p>
                        ) : null}
                        {item.meta.trim().length > 0 ? (
                          <p className="text-xs text-text-muted">{item.meta}</p>
                        ) : null}
                      </div>
                    ) : null}

                    <Link
                      href={href}
                      aria-label={`Open ${item.title.trim().length > 0 ? item.title : `entry ${index + 1}`}`}
                      className="absolute inset-0 z-20"
                    >
                      <span className="sr-only">
                        Open {item.title.trim().length > 0 ? item.title : `entry ${index + 1}`}
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    );
  }

  const resolved = await resolvePublishedGalleryItem(slug, galleryAnchor, itemAnchor);

  if (!resolved) {
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
      data-testid="gallery-entry-mode-container"
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
            data-testid="gallery-back-link"
            href={viewModel.navigationHrefs.backHref}
            className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:bg-surface-alt"
          >
            Back to gallery
          </Link>
          <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-muted">
            <span data-testid="gallery-item-counter">
              Item {resolved.itemIndex + 1} of {resolved.totalItems}
            </span>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-line bg-surface-alt">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
            {viewModel.navigationHrefs.previousHref ? (
              <Link
                data-testid="gallery-nav-previous"
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
                data-testid="gallery-nav-next"
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
