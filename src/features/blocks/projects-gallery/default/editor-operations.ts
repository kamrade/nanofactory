import type { ProjectsGalleryEntryItem, ProjectsGalleryProjectItem } from "./model";

function createEmptyEntry(kind: ProjectsGalleryEntryItem["kind"]): ProjectsGalleryEntryItem {
  return {
    kind,
    assetId: undefined,
    entryAnchor: undefined,
    title: "",
    description: "",
    contentMd: "",
    price: "",
    meta: "",
  };
}

export function addImageEntry(project: ProjectsGalleryProjectItem): ProjectsGalleryProjectItem {
  return {
    ...project,
    galleryItems: [...project.galleryItems, createEmptyEntry("image")],
  };
}

export function addMarkdownEntry(project: ProjectsGalleryProjectItem): ProjectsGalleryProjectItem {
  return {
    ...project,
    galleryItems: [...project.galleryItems, createEmptyEntry("markdown")],
  };
}

export function updateEntry(
  project: ProjectsGalleryProjectItem,
  entryIndex: number,
  nextEntry: ProjectsGalleryEntryItem
): ProjectsGalleryProjectItem {
  if (entryIndex < 0 || entryIndex >= project.galleryItems.length) {
    return project;
  }

  return {
    ...project,
    galleryItems: project.galleryItems.map((entry, index) =>
      index === entryIndex ? nextEntry : entry
    ),
  };
}

export function removeEntry(
  project: ProjectsGalleryProjectItem,
  entryIndex: number
): ProjectsGalleryProjectItem {
  if (entryIndex < 0 || entryIndex >= project.galleryItems.length) {
    return project;
  }

  return {
    ...project,
    galleryItems: project.galleryItems.filter((_, index) => index !== entryIndex),
  };
}

