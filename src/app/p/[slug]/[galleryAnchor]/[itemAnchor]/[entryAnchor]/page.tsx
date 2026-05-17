import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { GalleryItemKeyboardNav } from "../gallery-item-keyboard-nav";
import { GalleryItemNav } from "../gallery-item-nav";
import { getAssetsByProjectId } from "@/lib/assets";
import { buildAssetMap, resolveAssetById } from "@/lib/assets/resolution";
import { normalizePageContent } from "@/lib/editor/content";
import {
  readModeCookieValue,
  resolveGalleryItemMode,
} from "@/lib/gallery-item/mode";
import { getPublishedProjectBySlug } from "@/lib/projects";
import {
  type ResolvedProjectsGalleryEntry,
  resolveProjectsGalleryEntryFromContent,
} from "@/lib/projects-gallery/resolve";
import { buildProjectsGalleryEntryNavHrefs } from "@/lib/projects-gallery/navigation";
import { resolveGalleryItemLinkModeByHost } from "@/lib/routing/gallery-link-mode";
import { DEFAULT_THEME_KEY, isThemeKey } from "@/lib/themes";
import { stripMarkdownForMeta } from "@/lib/markdown/meta";
import { enforceModeByPolicy } from "@/lib/projects/mode-policy";

type ProjectsGalleryEntryPageProps = {
  params: Promise<{
    slug: string;
    galleryAnchor: string;
    itemAnchor: string;
    entryAnchor: string;
  }>;
  searchParams?: Promise<{
    mode?: string;
  }>;
};

type ResolvedPublishedProjectsGalleryEntry = ResolvedProjectsGalleryEntry & {
  projectSlug: string;
  projectName: string;
  projectThemeKey: string;
};

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
      containerClassName: "container mx-auto grid max-w-4xl gap-4 px-3",
      controlClassName: "px-2 py-1.5 text-xs",
      controlBarClassName: "px-2 py-2",
      cardClassName: "grid gap-2 border border-line bg-surface p-3",
      h1ClassName: "text-xl font-semibold tracking-tight text-text-main",
      bodyClassName: "text-xs leading-5 text-text-muted",
      priceClassName: "text-xs font-semibold text-text-main",
      metaClassName: "text-[11px] text-text-muted",
      imageFallbackClassName: "flex min-h-64 items-center justify-center text-sm text-text-muted",
    };
  }
  if (spacingScale === "lg") {
    return {
      pageClassName: "min-h-screen bg-bg py-12 text-text-main",
      containerClassName: "container mx-auto grid max-w-5xl gap-8 px-6",
      controlClassName: "px-4 py-3 text-base",
      controlBarClassName: "px-5 py-4",
      cardClassName: "grid gap-4 border border-line bg-surface p-6",
      h1ClassName: "text-3xl font-semibold tracking-tight text-text-main",
      bodyClassName: "text-base leading-8 text-text-muted",
      priceClassName: "text-lg font-semibold text-text-main",
      metaClassName: "text-sm text-text-muted",
      imageFallbackClassName: "flex min-h-64 items-center justify-center text-base text-text-muted",
    };
  }
  return {
    pageClassName: "min-h-screen bg-bg py-10 text-text-main",
    containerClassName: "container mx-auto grid max-w-4xl gap-6 px-4",
    controlClassName: "px-3 py-2 text-sm",
    controlBarClassName: "px-4 py-3",
    cardClassName: "grid gap-2 border border-line bg-surface p-5",
    h1ClassName: "text-2xl font-semibold tracking-tight text-text-main",
    bodyClassName: "text-sm leading-7 text-text-muted",
    priceClassName: "text-base font-semibold text-text-main",
    metaClassName: "text-xs text-text-muted",
    imageFallbackClassName: "flex min-h-64 items-center justify-center text-sm text-text-muted",
  };
}

async function resolvePublishedProjectsGalleryEntry(
  slug: string,
  projectAnchor: string,
  nestedGalleryAnchor: string,
  entryAnchor: string
): Promise<ResolvedPublishedProjectsGalleryEntry | null> {
  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    return null;
  }

  const content = normalizePageContent(project.contentJson);
  const resolved = resolveProjectsGalleryEntryFromContent(
    content,
    projectAnchor,
    nestedGalleryAnchor,
    entryAnchor
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
}: ProjectsGalleryEntryPageProps): Promise<Metadata> {
  const { slug, galleryAnchor, itemAnchor, entryAnchor } = await params;
  const resolved = await resolvePublishedProjectsGalleryEntry(
    slug,
    galleryAnchor,
    itemAnchor,
    entryAnchor
  );

  if (!resolved) {
    return {
      title: "Gallery item not found",
    };
  }

  const title = resolved.title.trim().length > 0 ? resolved.title : "Gallery item";
  const rawDescription =
    resolved.kind === "markdown" ? resolved.contentMd : resolved.description;
  const description =
    rawDescription.trim().length > 0
      ? stripMarkdownForMeta(rawDescription)
      : `${resolved.projectName} project gallery item`;

  return {
    title: `${title} · ${resolved.projectName}`,
    description,
  };
}

export default async function ProjectsGalleryEntryPage({
  params,
  searchParams,
}: ProjectsGalleryEntryPageProps) {
  const { slug, galleryAnchor, itemAnchor, entryAnchor } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestHeaders = await headers();
  const linkMode = resolveGalleryItemLinkModeByHost(requestHeaders.get("host"));
  const cookieStore = await cookies();
  let resolvedMode = resolveGalleryItemMode({
    searchMode: resolvedSearchParams.mode,
    referer: requestHeaders.get("referer"),
    cookieMode: readModeCookieValue(cookieStore),
  });
  const resolved = await resolvePublishedProjectsGalleryEntry(
    slug,
    galleryAnchor,
    itemAnchor,
    entryAnchor
  );
  if (!resolved) {
    notFound();
  }

  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    notFound();
  }
  resolvedMode = enforceModeByPolicy(project.modePolicy, resolvedMode);

  const assets = await getAssetsByProjectId(project.id);
  const assetMap = buildAssetMap(assets);
  const asset = resolveAssetById(resolved.assetId, assetMap);
  const { backHref, previousHref, nextHref } = buildProjectsGalleryEntryNavHrefs({
    linkMode,
    projectSlug: resolved.projectSlug,
    projectAnchor: resolved.projectAnchor,
    galleryAnchor: resolved.galleryAnchor,
    previousEntryAnchor: resolved.previousEntryAnchor,
    nextEntryAnchor: resolved.nextEntryAnchor,
    mode: resolvedMode,
  });
  if (resolved.kind !== "image") {
    if (nextHref) {
      redirect(nextHref);
    }
    if (previousHref) {
      redirect(previousHref);
    }
    redirect(backHref);
  }
  const previewRadiusClass = getProjectRadiusClass(project.borderRadiusPolicy);
  const controlRadiusClass = getProjectControlRadiusClass(project.borderRadiusPolicy);
  const spacing = getProjectSpacingClasses(project.spacingScale);

  return (
    <main
      data-testid="projects-gallery-entry-mode-container"
      data-theme={resolved.projectThemeKey}
      data-mode={resolvedMode}
      data-border-radius={project.borderRadiusPolicy}
      className={spacing.pageClassName}
    >
      <GalleryItemKeyboardNav previousHref={previousHref} nextHref={nextHref} />

      <div className={spacing.containerClassName}>
        <GalleryItemNav
          backHref={backHref}
          counterText={`Item ${resolved.imageEntryIndex + 1} of ${resolved.totalImageEntries}`}
          previousHref={previousHref}
          nextHref={nextHref}
          radiusClassName={controlRadiusClass}
          controlClassName={spacing.controlClassName}
          controlBarClassName={spacing.controlBarClassName}
          testIdPrefix="projects-gallery-entry"
        />

        <section
          className={`overflow-hidden border border-line bg-surface-alt ${previewRadiusClass}`}
        >
          {asset ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.publicUrl}
              alt={asset.alt ?? asset.originalFilename}
              className="h-auto w-full object-contain"
            />
          ) : (
            <div className={spacing.imageFallbackClassName}>
              No image
            </div>
          )}
        </section>

        <section className={`${spacing.cardClassName} ${previewRadiusClass}`}>
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
