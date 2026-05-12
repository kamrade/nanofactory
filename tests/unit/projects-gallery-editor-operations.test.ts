import { describe, expect, it } from "vitest";

import {
  addImageEntry,
  addMarkdownEntry,
  removeEntry,
  updateEntry,
} from "@/features/blocks/projects-gallery/default/editor-operations";
import type {
  ProjectsGalleryEntryItem,
  ProjectsGalleryProjectItem,
} from "@/features/blocks/projects-gallery/default/model";

function createEntry(
  kind: ProjectsGalleryEntryItem["kind"],
  patch?: Partial<ProjectsGalleryEntryItem>
): ProjectsGalleryEntryItem {
  return {
    kind,
    assetId: undefined,
    entryAnchor: undefined,
    title: "",
    description: "",
    contentMd: "",
    price: "",
    meta: "",
    ...patch,
  };
}

function createProject(): ProjectsGalleryProjectItem {
  return {
    projectAnchor: "project-1",
    galleryAnchor: "gallery-1",
    title: "Project 1",
    description: "",
    descriptionMd: "",
    price: "",
    meta: "",
    imageAssetId: undefined,
    galleryItems: [
      createEntry("image", { title: "Image 1", entryAnchor: "entry-1" }),
      createEntry("markdown", { title: "Markdown 2", entryAnchor: "entry-2" }),
    ],
  };
}

describe("projects-gallery editor operations", () => {
  it("addImageEntry appends empty image entry", () => {
    const next = addImageEntry(createProject());

    expect(next.galleryItems).toHaveLength(3);
    expect(next.galleryItems[2]).toMatchObject({
      kind: "image",
      assetId: undefined,
      entryAnchor: undefined,
      contentMd: "",
    });
  });

  it("addMarkdownEntry appends empty markdown entry", () => {
    const next = addMarkdownEntry(createProject());

    expect(next.galleryItems).toHaveLength(3);
    expect(next.galleryItems[2]).toMatchObject({
      kind: "markdown",
      assetId: undefined,
      entryAnchor: undefined,
      contentMd: "",
    });
  });

  it("updateEntry replaces entry by index", () => {
    const project = createProject();
    const nextEntry = createEntry("image", { title: "Updated", entryAnchor: "entry-updated" });

    const next = updateEntry(project, 1, nextEntry);

    expect(next.galleryItems[0].title).toBe("Image 1");
    expect(next.galleryItems[1]).toEqual(nextEntry);
  });

  it("updateEntry returns original project for invalid index", () => {
    const project = createProject();
    const next = updateEntry(project, 99, createEntry("image"));
    expect(next).toBe(project);
  });

  it("removeEntry removes entry by index", () => {
    const next = removeEntry(createProject(), 0);

    expect(next.galleryItems).toHaveLength(1);
    expect(next.galleryItems[0].entryAnchor).toBe("entry-2");
  });

  it("removeEntry returns original project for invalid index", () => {
    const project = createProject();
    const next = removeEntry(project, -1);
    expect(next).toBe(project);
  });
});

