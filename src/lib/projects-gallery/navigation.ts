import type { GalleryItemLinkMode } from "@/lib/routing/gallery-link-mode";
import { buildModeQuery } from "@/lib/routing/mode-query";

type BuildProjectsGalleryEntryHrefInput = {
  linkMode: GalleryItemLinkMode;
  projectSlug: string;
  projectAnchor: string;
  galleryAnchor: string;
  entryAnchor: string;
  mode?: "light" | "dark";
};

type BuildProjectsGalleryEntryNavHrefsInput = {
  linkMode: GalleryItemLinkMode;
  projectSlug: string;
  projectAnchor: string;
  galleryAnchor: string;
  previousEntryAnchor?: string;
  nextEntryAnchor?: string;
  mode?: "light" | "dark";
};

export function buildProjectsGalleryEntryHref(
  input: BuildProjectsGalleryEntryHrefInput
): string {
  const modeQuery = buildModeQuery(input.mode ?? "light");

  if (input.linkMode === "relative") {
    return `./${input.galleryAnchor}/${input.entryAnchor}${modeQuery}`;
  }

  return `/p/${input.projectSlug}/${input.projectAnchor}/${input.galleryAnchor}/${input.entryAnchor}${modeQuery}`;
}

export function buildProjectsGalleryEntryNavHrefs(
  input: BuildProjectsGalleryEntryNavHrefsInput
) {
  const modeQuery = buildModeQuery(input.mode ?? "light");

  const backHref =
    input.linkMode === "relative"
      ? `..${modeQuery}`
      : `/p/${input.projectSlug}/${input.projectAnchor}/${input.galleryAnchor}${modeQuery}`;

  const previousHref = input.previousEntryAnchor
    ? input.linkMode === "relative"
      ? `./${input.previousEntryAnchor}${modeQuery}`
      : `/p/${input.projectSlug}/${input.projectAnchor}/${input.galleryAnchor}/${input.previousEntryAnchor}${modeQuery}`
    : undefined;

  const nextHref = input.nextEntryAnchor
    ? input.linkMode === "relative"
      ? `./${input.nextEntryAnchor}${modeQuery}`
      : `/p/${input.projectSlug}/${input.projectAnchor}/${input.galleryAnchor}/${input.nextEntryAnchor}${modeQuery}`
    : undefined;

  return {
    backHref,
    previousHref,
    nextHref,
  };
}
