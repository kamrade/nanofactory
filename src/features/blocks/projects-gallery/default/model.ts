import { isPlainObject, readOptionalString, readString } from "../../shared/base";
import { isValidAnchorId, normalizeAnchorId } from "@/lib/editor/anchor-id";

export type ProjectsGalleryImageItem = {
  assetId: string | undefined;
  imageAnchor: string | undefined;
  title: string;
  description: string;
  price: string;
  meta: string;
};

export type ProjectsGalleryProjectItem = {
  projectAnchor: string | undefined;
  galleryAnchor: string | undefined;
  title: string;
  description: string;
  price: string;
  meta: string;
  imageAssetId: string | undefined;
  galleryItems: ProjectsGalleryImageItem[];
};

export type ProjectsGalleryProps = {
  sectionTitle: string;
  galleryAnchor: string | undefined;
  items: ProjectsGalleryProjectItem[];
};

export function getEffectiveProjectsGalleryAnchor(props: ProjectsGalleryProps) {
  return props.galleryAnchor ?? "projects";
}

export function getEffectiveProjectAnchor(item: ProjectsGalleryProjectItem, index: number) {
  return item.projectAnchor ?? `project-${index + 1}`;
}

export function getEffectiveNestedGalleryAnchor(item: ProjectsGalleryProjectItem, index: number) {
  return item.galleryAnchor ?? `gallery-${index + 1}`;
}

export function getEffectiveProjectGalleryImageAnchor(
  item: ProjectsGalleryProjectItem,
  projectIndex: number,
  imageIndex: number
) {
  const projectAnchor = getEffectiveProjectAnchor(item, projectIndex);
  const galleryAnchor = getEffectiveNestedGalleryAnchor(item, projectIndex);
  return item.galleryItems[imageIndex]?.imageAnchor ?? `${projectAnchor}-${galleryAnchor}-item-${imageIndex + 1}`;
}

function readImageItems(input: unknown): ProjectsGalleryImageItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isPlainObject(item)) {
        return null;
      }

      const rawImageAnchor = readOptionalString(item.imageAnchor);
      const imageAnchor = rawImageAnchor ? normalizeAnchorId(rawImageAnchor) : undefined;

      return {
        assetId: readOptionalString(item.assetId),
        imageAnchor: imageAnchor && isValidAnchorId(imageAnchor) ? imageAnchor : undefined,
        title: readString(item.title, ""),
        description: readString(item.description, ""),
        price: readString(item.price, ""),
        meta: readString(item.meta, ""),
      };
    })
    .filter((item): item is ProjectsGalleryImageItem => item !== null);
}

function readProjectItems(input: unknown): ProjectsGalleryProjectItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isPlainObject(item)) {
        return null;
      }

      const rawProjectAnchor = readOptionalString(item.projectAnchor);
      const projectAnchor = rawProjectAnchor ? normalizeAnchorId(rawProjectAnchor) : undefined;
      const rawGalleryAnchor = readOptionalString(item.galleryAnchor);
      const galleryAnchor = rawGalleryAnchor ? normalizeAnchorId(rawGalleryAnchor) : undefined;

      return {
        projectAnchor: projectAnchor && isValidAnchorId(projectAnchor) ? projectAnchor : undefined,
        galleryAnchor: galleryAnchor && isValidAnchorId(galleryAnchor) ? galleryAnchor : undefined,
        title: readString(item.title, ""),
        description: readString(item.description, ""),
        price: readString(item.price, ""),
        meta: readString(item.meta, ""),
        imageAssetId: readOptionalString(item.imageAssetId),
        galleryItems: readImageItems(item.galleryItems),
      };
    })
    .filter((item): item is ProjectsGalleryProjectItem => item !== null);
}

function defaultGalleryItems(projectAnchorBase: string): ProjectsGalleryImageItem[] {
  return [
    {
      assetId: undefined,
      imageAnchor: `${projectAnchorBase}-item-1`,
      title: "Gallery image 1",
      description: "",
      price: "",
      meta: "",
    },
    {
      assetId: undefined,
      imageAnchor: `${projectAnchorBase}-item-2`,
      title: "Gallery image 2",
      description: "",
      price: "",
      meta: "",
    },
  ];
}

function defaultItems(): ProjectsGalleryProjectItem[] {
  return [
    {
      projectAnchor: "project-1",
      galleryAnchor: "gallery-1",
      title: "Project 1",
      description: "Project description.",
      price: "",
      meta: "",
      imageAssetId: undefined,
      galleryItems: defaultGalleryItems("project-1-gallery-1"),
    },
  ];
}

export function readProjectsGalleryProps(input: unknown): ProjectsGalleryProps {
  const props = isPlainObject(input) ? input : {};
  const rawGalleryAnchor = readOptionalString(props.galleryAnchor);
  const galleryAnchor = rawGalleryAnchor ? normalizeAnchorId(rawGalleryAnchor) : undefined;
  const items = readProjectItems(props.items);

  return {
    sectionTitle: readString(props.sectionTitle, "Projects"),
    galleryAnchor: galleryAnchor && isValidAnchorId(galleryAnchor) ? galleryAnchor : undefined,
    items: items.length > 0 ? items : defaultItems(),
  };
}

export function createDefaultProjectsGalleryProps(): ProjectsGalleryProps {
  return {
    sectionTitle: "Projects",
    galleryAnchor: "projects",
    items: defaultItems(),
  };
}
