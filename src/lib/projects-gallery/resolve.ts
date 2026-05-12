import type { PageContent } from "@/db/schema";
import { normalizeAnchorId } from "@/lib/editor/anchor-id";
import {
  getEffectiveNestedGalleryAnchor,
  getEffectiveProjectAnchor,
  getEffectiveProjectGalleryEntryAnchor,
  readProjectsGalleryProps,
} from "@/features/blocks/projects-gallery/default/model";

export type ResolvedProjectsGalleryProject = {
  projectAnchor: string;
  galleryAnchor: string;
  blockAnchor: string;
  sectionTitle: string;
  itemIndex: number;
  title: string;
  description: string;
  descriptionMd: string;
  price: string;
  meta: string;
  imageAssetId?: string;
  galleryItems: Array<{
    kind: "image" | "markdown";
    entryAnchor: string;
    assetId?: string;
    title: string;
    description: string;
    contentMd: string;
    price: string;
    meta: string;
  }>;
};

export type ResolvedProjectsGalleryEntry = {
  kind: "image" | "markdown";
  projectAnchor: string;
  galleryAnchor: string;
  entryAnchor: string;
  blockAnchor: string;
  projectTitle: string;
  projectDescription: string;
  projectPrice: string;
  projectMeta: string;
  entryIndex: number;
  totalEntries: number;
  previousEntryAnchor?: string;
  nextEntryAnchor?: string;
  title: string;
  description: string;
  contentMd: string;
  price: string;
  meta: string;
  assetId?: string;
};

export function resolveProjectsGalleryProjectFromContent(
  content: PageContent,
  projectAnchor: string,
  galleryAnchor: string
): ResolvedProjectsGalleryProject | null {
  const normalizedProjectAnchor = normalizeAnchorId(projectAnchor);
  const normalizedGalleryAnchor = normalizeAnchorId(galleryAnchor);

  for (const block of content.blocks) {
    if (block.type !== "projects-gallery") {
      continue;
    }

    const props = readProjectsGalleryProps(block.props);
    for (let projectIndex = 0; projectIndex < props.items.length; projectIndex += 1) {
      const item = props.items[projectIndex];
      const effectiveProjectAnchor = getEffectiveProjectAnchor(item, projectIndex);
      const effectiveGalleryAnchor = getEffectiveNestedGalleryAnchor(item, projectIndex);

      if (
        effectiveProjectAnchor !== normalizedProjectAnchor ||
        effectiveGalleryAnchor !== normalizedGalleryAnchor
      ) {
        continue;
      }

      return {
        projectAnchor: normalizedProjectAnchor,
        galleryAnchor: normalizedGalleryAnchor,
        blockAnchor: props.galleryAnchor ?? "projects",
        sectionTitle: props.sectionTitle,
        itemIndex: projectIndex,
        title: item.title,
        description: item.description,
        descriptionMd: item.descriptionMd,
        price: item.price,
        meta: item.meta,
        imageAssetId: item.imageAssetId,
        galleryItems: item.galleryItems.map((galleryItem, entryIndex) => ({
          kind: galleryItem.kind,
          entryAnchor: getEffectiveProjectGalleryEntryAnchor(item, projectIndex, entryIndex),
          assetId: galleryItem.assetId,
          title: galleryItem.title,
          description: galleryItem.description,
          contentMd: galleryItem.contentMd,
          price: galleryItem.price,
          meta: galleryItem.meta,
        })),
      };
    }
  }

  return null;
}

export function resolveProjectsGalleryEntryFromContent(
  content: PageContent,
  projectAnchor: string,
  galleryAnchor: string,
  entryAnchor: string
): ResolvedProjectsGalleryEntry | null {
  const resolvedProject = resolveProjectsGalleryProjectFromContent(
    content,
    projectAnchor,
    galleryAnchor
  );
  if (!resolvedProject) {
    return null;
  }

  const normalizedEntryAnchor = normalizeAnchorId(entryAnchor);
  const entryIndex = resolvedProject.galleryItems.findIndex(
    (item) => item.entryAnchor === normalizedEntryAnchor
  );
  if (entryIndex < 0) {
    return null;
  }

  const imageItem = resolvedProject.galleryItems[entryIndex];

  return {
    projectAnchor: resolvedProject.projectAnchor,
    galleryAnchor: resolvedProject.galleryAnchor,
    kind: imageItem.kind,
    entryAnchor: normalizedEntryAnchor,
    blockAnchor: resolvedProject.blockAnchor,
    projectTitle: resolvedProject.title,
    projectDescription: resolvedProject.description,
    projectPrice: resolvedProject.price,
    projectMeta: resolvedProject.meta,
    entryIndex,
    totalEntries: resolvedProject.galleryItems.length,
    previousEntryAnchor:
      entryIndex > 0
        ? resolvedProject.galleryItems[entryIndex - 1]?.entryAnchor
        : undefined,
    nextEntryAnchor:
      entryIndex < resolvedProject.galleryItems.length - 1
        ? resolvedProject.galleryItems[entryIndex + 1]?.entryAnchor
        : undefined,
    title: imageItem.title,
    description: imageItem.description,
    contentMd: imageItem.contentMd,
    price: imageItem.price,
    meta: imageItem.meta,
    assetId: imageItem.assetId,
  };
}
