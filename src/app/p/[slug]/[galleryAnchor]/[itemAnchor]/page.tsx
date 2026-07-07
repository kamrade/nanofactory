import Link from "next/link";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GalleryItemKeyboardNav } from "./gallery-item-keyboard-nav";
import { GalleryItemImageNav } from "./gallery-item-image-nav";
import { GalleryItemNav } from "./gallery-item-nav";

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
import { buildProjectsGalleryEntryHref } from "@/lib/projects-gallery/navigation";
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

function getProjectRadiusClass(borderRadiusPolicy: "none" | "md" | "lg") {
  if (borderRadiusPolicy === "none") {
    return "rounded-none";
  }
  if (borderRadiusPolicy === "md") {
    return "rounded-xl";
  }
  return "rounded-2xl";
}

function getProjectControlRadiusClass(borderRadiusPolicy: "none" | "md" | "lg") {
  if (borderRadiusPolicy === "none") {
    return "rounded-none";
  }
  if (borderRadiusPolicy === "md") {
    return "rounded-lg";
  }
  return "rounded-xl";
}

function getProjectSpacingClasses(spacingScale: "sm" | "md" | "lg") {
  if (spacingScale === "sm") {
    return {
      pageClassName: "min-h-screen bg-bg py-6 text-text-main",
      containerClassName: "container mx-auto grid max-w-5xl gap-4 px-3",
      controlClassName: "px-2 py-1.5 text-xs",
      controlBarClassName: "px-2 py-2",
      cardClassName: "grid gap-2 border border-line bg-surface p-3",
      h1ClassName: "text-xl font-semibold tracking-tight text-text-main",
      h2ClassName: "text-base font-semibold tracking-tight text-text-main",
      bodyClassName: "text-xs leading-5 text-text-muted",
      priceClassName: "text-xs font-semibold text-text-main",
      metaClassName: "text-[11px] text-text-muted",
      imageClassName: "h-56 w-full object-cover",
      markdownPreviewClassName: "flex min-h-56 items-start bg-surface p-3",
      listGridClassName: "grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3",
      itemContentClassName: "space-y-1 p-3",
      itemTitleClassName: "text-sm font-semibold text-text-main",
      itemDescriptionClassName: "text-xs leading-5 text-text-muted",
      itemPriceClassName: "text-xs font-semibold text-text-main",
      itemMetaClassName: "text-[11px] text-text-muted",
      itemCountClassName: "text-xs text-text-muted",
      imageFallbackClassName: "flex h-56 w-full items-center justify-center bg-surface text-sm text-text-muted",
      singleImageFallbackClassName: "flex min-h-64 items-center justify-center text-sm text-text-muted",
    };
  }
  if (spacingScale === "lg") {
    return {
      pageClassName: "min-h-screen bg-bg py-12 text-text-main",
      containerClassName: "container mx-auto grid gap-8 px-6",
      controlClassName: "px-4 py-3 text-base",
      controlBarClassName: "px-5 py-4",
      cardClassName: "grid gap-4 border border-line bg-surface p-6",
      h1ClassName: "text-3xl font-semibold tracking-tight text-text-main",
      h2ClassName: "text-2xl font-semibold tracking-tight text-text-main",
      bodyClassName: "text-base leading-8 text-text-muted",
      priceClassName: "text-lg font-semibold text-text-main",
      metaClassName: "text-sm text-text-muted",
      imageClassName: "h-56 w-full object-cover",
      markdownPreviewClassName: "flex min-h-56 items-start bg-surface p-6",
      listGridClassName: "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3",
      itemContentClassName: "space-y-3 p-5",
      itemTitleClassName: "text-lg font-semibold text-text-main",
      itemDescriptionClassName: "text-base leading-7 text-text-muted",
      itemPriceClassName: "text-base font-semibold text-text-main",
      itemMetaClassName: "text-sm text-text-muted",
      itemCountClassName: "text-base text-text-muted",
      imageFallbackClassName: "flex h-56 w-full items-center justify-center bg-surface text-base text-text-muted",
      singleImageFallbackClassName: "flex min-h-64 items-center justify-center text-base text-text-muted",
    };
  }
  return {
    pageClassName: "min-h-screen bg-bg py-10 text-text-main",
    containerClassName: "container mx-auto grid max-w-5xl gap-6 px-4",
    controlClassName: "px-3 py-2 text-sm",
    controlBarClassName: "px-4 py-3",
    cardClassName: "grid gap-3 border border-line bg-surface p-5",
    h1ClassName: "text-2xl font-semibold tracking-tight text-text-main",
    h2ClassName: "text-lg font-semibold tracking-tight text-text-main",
    bodyClassName: "text-sm leading-7 text-text-muted",
    priceClassName: "text-base font-semibold text-text-main",
    metaClassName: "text-xs text-text-muted",
    imageClassName: "h-56 w-full object-cover",
    markdownPreviewClassName: "flex min-h-56 items-start bg-surface p-4",
    listGridClassName: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
    itemContentClassName: "space-y-2 p-4",
    itemTitleClassName: "text-base font-semibold text-text-main",
    itemDescriptionClassName: "text-sm leading-6 text-text-muted",
    itemPriceClassName: "text-sm font-semibold text-text-main",
    itemMetaClassName: "text-xs text-text-muted",
    itemCountClassName: "text-sm text-text-muted",
    imageFallbackClassName: "flex h-56 w-full items-center justify-center bg-surface text-sm text-text-muted",
    singleImageFallbackClassName: "flex min-h-64 items-center justify-center text-sm text-text-muted",
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
    const previewRadiusClass = getProjectRadiusClass(project.borderRadiusPolicy);
    const controlRadiusClass = getProjectControlRadiusClass(project.borderRadiusPolicy);
    const spacing = getProjectSpacingClasses(project.spacingScale);
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
        data-border-radius={project.borderRadiusPolicy}
        data-heading-font={project.headingFont}
        className={spacing.pageClassName}
      >
        <div className={spacing.containerClassName}>
          <div data-testid="project-header" className="flex flex-wrap items-center justify-between gap-3">
            <Link
              data-testid="projects-gallery-back-to-projects"
              href={backHref}
              className={`inline-flex items-center justify-center border border-line bg-surface font-medium text-text-main transition hover:bg-surface-alt ${spacing.controlClassName} ${controlRadiusClass}`}
            >
              Back to projects
            </Link>
            <div className={`inline-flex items-center gap-2 border border-line bg-surface text-text-muted ${spacing.controlClassName} ${controlRadiusClass}`}>
              <span data-testid="projects-gallery-entry-count">
                {previewImageItems.length} items
              </span>
            </div>
          </div>

          <section className={`${spacing.cardClassName} ${previewRadiusClass}`}>
            <h1 className={spacing.h1ClassName}>
              {resolvedProjectGallery.title.trim().length > 0
                ? resolvedProjectGallery.title
                : `Project ${resolvedProjectGallery.itemIndex + 1}`}
            </h1>
            {resolvedProjectGallery.descriptionMd.trim().length > 0 ? (
              <MdRenderer
                content={resolvedProjectGallery.descriptionMd}
                className={spacing.bodyClassName}
              />
            ) : null}
            {resolvedProjectGallery.price.trim().length > 0 ? (
              <p className={spacing.priceClassName}>{resolvedProjectGallery.price}</p>
            ) : null}
            {resolvedProjectGallery.meta.trim().length > 0 ? (
              <p className={spacing.metaClassName}>{resolvedProjectGallery.meta}</p>
            ) : null}
          </section>

          <section
            data-testid="projects-gallery-all-entries"
            className={`${spacing.cardClassName} ${previewRadiusClass}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className={spacing.h2ClassName}>All entries</h2>
              <span className={spacing.itemCountClassName}>
                {resolvedProjectGallery.galleryItems.length} total
              </span>
            </div>

            <div className={spacing.listGridClassName}>
              {resolvedProjectGallery.galleryItems.map((item, index) => {
                const asset = resolveAssetById(item.assetId, assetMap);
                const href =
                  buildProjectsGalleryEntryHref({
                    linkMode,
                    projectSlug: resolvedProjectGallery.projectSlug,
                    projectAnchor: resolvedProjectGallery.projectAnchor,
                    galleryAnchor: resolvedProjectGallery.galleryAnchor,
                    entryAnchor: item.entryAnchor,
                    mode: resolvedMode,
                  });

                return (
                  <article
                    key={`all-${resolvedProjectGallery.projectAnchor}-${item.entryAnchor}-${index}`}
                    className={`relative overflow-hidden border border-line bg-surface-alt ${previewRadiusClass} ${
                      item.kind === "markdown" ? "md:col-span-2 lg:col-span-3" : ""
                    }`}
                  >
                    {item.kind === "markdown" ? (
                      <div className={spacing.markdownPreviewClassName}>
                        {item.contentMd.trim().length > 0 ? (
                          <MdRenderer content={item.contentMd} className={spacing.bodyClassName} />
                        ) : (
                          <p className={spacing.bodyClassName}>No markdown content</p>
                        )}
                      </div>
                    ) : asset ? (
                      <Link href={href} className="block transition hover:opacity-95">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset.publicUrl}
                          alt={asset.alt ?? asset.originalFilename}
                          className={spacing.imageClassName}
                        />
                      </Link>
                    ) : (
                      <div className={spacing.imageFallbackClassName}>
                        No image
                      </div>
                    )}

                    {(item.title || item.description || item.price || item.meta) ? (
                      <div className={spacing.itemContentClassName}>
                        {item.title.trim().length > 0 ? (
                          <p className={spacing.itemTitleClassName}>{item.title}</p>
                        ) : null}
                        {item.description.trim().length > 0 ? (
                          <p className={spacing.itemDescriptionClassName}>{item.description}</p>
                        ) : null}
                        {item.price.trim().length > 0 ? (
                          <p className={spacing.itemPriceClassName}>{item.price}</p>
                        ) : null}
                        {item.meta.trim().length > 0 ? (
                          <p className={spacing.itemMetaClassName}>{item.meta}</p>
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
  const previewRadiusClass = getProjectRadiusClass(project.borderRadiusPolicy);
  const controlRadiusClass = getProjectControlRadiusClass(project.borderRadiusPolicy);
  const spacing = getProjectSpacingClasses(project.spacingScale);
  const previewPageClassName = `${spacing.pageClassName} py-6`;
  const previewContainerClassName = `${spacing.containerClassName} gap-4`;
  const previewCardClassName = `${spacing.cardClassName} p-4`;
  const previewImageFrameClassName =
    "flex h-[calc(100dvh-24rem)] min-h-[14rem] items-center justify-center overflow-hidden";
  const previewImageClassName = "block max-h-full max-w-full w-auto object-contain";

  return (
    <main
      data-testid="gallery-entry-mode-container"
      data-theme={viewModel.resolvedThemeKey}
      data-mode={resolvedMode}
      data-border-radius={project.borderRadiusPolicy}
      data-heading-font={project.headingFont}
      className={previewPageClassName}
    >
      <GalleryItemKeyboardNav
        previousHref={viewModel.navigationHrefs.previousHref}
        nextHref={viewModel.navigationHrefs.nextHref}
      />
      <div className={previewContainerClassName}>
        <GalleryItemNav
          backHref={viewModel.navigationHrefs.backHref}
          counterText={`Item ${resolved.itemIndex + 1} of ${resolved.totalItems}`}
          previousHref={viewModel.navigationHrefs.previousHref}
          nextHref={viewModel.navigationHrefs.nextHref}
          showStepNavigation={false}
          radiusClassName={controlRadiusClass}
          controlClassName={spacing.controlClassName}
          controlBarClassName={spacing.controlBarClassName}
        />

        <section
          className={`relative overflow-hidden border border-line bg-surface-alt ${previewRadiusClass} ${previewImageFrameClassName}`}
        >
          <GalleryItemImageNav
            previousHref={viewModel.navigationHrefs.previousHref}
            nextHref={viewModel.navigationHrefs.nextHref}
          />
          {asset ? (
            <a
              href={asset.publicUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-full w-full items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.publicUrl}
                alt={asset.alt ?? asset.originalFilename}
                className={previewImageClassName}
              />
            </a>
          ) : (
            <div className={spacing.singleImageFallbackClassName}>
              No image
            </div>
          )}
        </section>

        <section className={`${previewCardClassName} ${previewRadiusClass}`}>
          {resolved.title.trim().length > 0 ? (
            <h1 className={spacing.h1ClassName}>{resolved.title}</h1>
          ) : (
            <h1 className={spacing.h1ClassName}>
              Gallery item
            </h1>
          )}
          {resolved.description.trim().length > 0 ? (
            <p className={spacing.bodyClassName}>{resolved.description}</p>
          ) : null}
          {resolved.price.trim().length > 0 ? (
            <p className={spacing.priceClassName}>{resolved.price}</p>
          ) : null}
          {resolved.meta.trim().length > 0 ? (
            <p className={spacing.metaClassName}>{resolved.meta}</p>
          ) : null}
        </section>

      </div>
    </main>
  );
}
