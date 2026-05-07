import type { PageBlock, PageContent } from "@/db/schema";

import { isPlainObject, readOptionalString } from "@/features/blocks/shared/base";
import { getBlockDefinition } from "@/lib/editor/blocks";
import { isValidAnchorId, normalizeAnchorId } from "@/lib/editor/anchor-id";

type ValidationSuccess = {
  success: true;
  data: PageContent;
};

type ValidationFailure = {
  success: false;
  error: string;
};

export type PageContentValidationResult = ValidationSuccess | ValidationFailure;

function normalizeBlock(input: unknown): PageBlock | null {
  if (!isPlainObject(input)) {
    return null;
  }

  const { id, type, variant, props, anchorId, backgroundSceneId } = input;

  if (typeof id !== "string" || id.trim().length === 0) {
    return null;
  }

  if (typeof type !== "string") {
    return null;
  }

  const definition = getBlockDefinition(type, typeof variant === "string" ? variant : undefined);

  if (!definition) {
    return null;
  }

  return {
    id,
    type: definition.type,
    variant: definition.variant,
    anchorId: readOptionalString(anchorId),
    backgroundSceneId: readOptionalString(backgroundSceneId),
    props: definition.normalizeProps(props),
  };
}

export function validatePageContent(input: unknown): PageContentValidationResult {
  if (!isPlainObject(input)) {
    return {
      success: false,
      error: "Content payload must be an object.",
    };
  }

  if (!Array.isArray(input.blocks)) {
    return {
      success: false,
      error: "Content payload must include a blocks array.",
    };
  }

  const blocks: PageBlock[] = [];
  const seenAnchorIds = new Set<string>();

  for (const blockInput of input.blocks) {
    const block = normalizeBlock(blockInput);

    if (!block) {
      return {
        success: false,
        error: "Each block must include a valid id, type, and props object.",
      };
    }

    if (block.anchorId) {
      const normalizedAnchorId = normalizeAnchorId(block.anchorId);
      if (!isValidAnchorId(normalizedAnchorId)) {
        return {
          success: false,
          error: "Anchor id must contain only lowercase Latin letters, numbers, and hyphens, and start with a letter.",
        };
      }

      if (seenAnchorIds.has(normalizedAnchorId)) {
        return {
          success: false,
          error: "Anchor id values must be unique within the page.",
        };
      }

      seenAnchorIds.add(normalizedAnchorId);
      block.anchorId = normalizedAnchorId;
    }

    if (block.type === "gallery" && Array.isArray(block.props.items)) {
      const normalizedItems = block.props.items.map((item) => {
        if (!isPlainObject(item)) {
          return item;
        }

        const nextItem = { ...item };
        const rawImageAnchor = readOptionalString(nextItem.imageAnchor);
        if (!rawImageAnchor) {
          return nextItem;
        }

        const normalizedImageAnchor = normalizeAnchorId(rawImageAnchor);
        if (!isValidAnchorId(normalizedImageAnchor)) {
          return {
            __anchorValidationError:
              "Image anchor must contain only lowercase Latin letters, numbers, and hyphens, and start with a letter.",
          };
        }

        if (seenAnchorIds.has(normalizedImageAnchor)) {
          return {
            __anchorValidationError: "Anchor id values must be unique within the page.",
          };
        }

        seenAnchorIds.add(normalizedImageAnchor);
        nextItem.imageAnchor = normalizedImageAnchor;
        return nextItem;
      });

      const itemAnchorError = normalizedItems.find(
        (item) =>
          isPlainObject(item) &&
          typeof (item as { __anchorValidationError?: unknown }).__anchorValidationError === "string"
      ) as { __anchorValidationError: string } | undefined;
      if (itemAnchorError) {
        return {
          success: false,
          error: itemAnchorError.__anchorValidationError,
        };
      }

      block.props.items = normalizedItems;
    }

    if (block.type === "projects-gallery" && Array.isArray(block.props.items)) {
      const projectAnchors = new Set<string>();

      const normalizedProjects = block.props.items.map((projectItem) => {
        if (!isPlainObject(projectItem)) {
          return projectItem;
        }

        const nextProject = { ...projectItem };
        const rawProjectAnchor = readOptionalString(nextProject.projectAnchor);
        if (rawProjectAnchor) {
          const normalizedProjectAnchor = normalizeAnchorId(rawProjectAnchor);
          if (!isValidAnchorId(normalizedProjectAnchor)) {
            return {
              __anchorValidationError:
                "Project anchor must contain only lowercase Latin letters, numbers, and hyphens, and start with a letter.",
            };
          }
          if (projectAnchors.has(normalizedProjectAnchor)) {
            return {
              __anchorValidationError: "Project anchors must be unique within Projects Gallery.",
            };
          }
          projectAnchors.add(normalizedProjectAnchor);
          nextProject.projectAnchor = normalizedProjectAnchor;
        }

        const rawGalleryAnchor = readOptionalString(nextProject.galleryAnchor);
        if (rawGalleryAnchor) {
          const normalizedGalleryAnchor = normalizeAnchorId(rawGalleryAnchor);
          if (!isValidAnchorId(normalizedGalleryAnchor)) {
            return {
              __anchorValidationError:
                "Nested gallery anchor must contain only lowercase Latin letters, numbers, and hyphens, and start with a letter.",
            };
          }
          nextProject.galleryAnchor = normalizedGalleryAnchor;
        }

        if (Array.isArray(nextProject.galleryItems)) {
          const imageAnchors = new Set<string>();
          const normalizedImages = nextProject.galleryItems.map((imageItem) => {
            if (!isPlainObject(imageItem)) {
              return imageItem;
            }
            const nextImageItem = { ...imageItem };
            const rawImageAnchor = readOptionalString(nextImageItem.imageAnchor);
            if (!rawImageAnchor) {
              return nextImageItem;
            }
            const normalizedImageAnchor = normalizeAnchorId(rawImageAnchor);
            if (!isValidAnchorId(normalizedImageAnchor)) {
              return {
                __anchorValidationError:
                  "Image anchor must contain only lowercase Latin letters, numbers, and hyphens, and start with a letter.",
              };
            }
            if (imageAnchors.has(normalizedImageAnchor)) {
              return {
                __anchorValidationError:
                  "Image anchors must be unique within a nested project gallery.",
              };
            }
            imageAnchors.add(normalizedImageAnchor);
            nextImageItem.imageAnchor = normalizedImageAnchor;
            return nextImageItem;
          });

          const imageAnchorError = normalizedImages.find(
            (item) =>
              isPlainObject(item) &&
              typeof (item as { __anchorValidationError?: unknown }).__anchorValidationError ===
                "string"
          ) as { __anchorValidationError: string } | undefined;
          if (imageAnchorError) {
            return {
              __anchorValidationError: imageAnchorError.__anchorValidationError,
            };
          }

          nextProject.galleryItems = normalizedImages;
        }

        return nextProject;
      });

      const projectAnchorError = normalizedProjects.find(
        (item) =>
          isPlainObject(item) &&
          typeof (item as { __anchorValidationError?: unknown }).__anchorValidationError ===
            "string"
      ) as { __anchorValidationError: string } | undefined;
      if (projectAnchorError) {
        return {
          success: false,
          error: projectAnchorError.__anchorValidationError,
        };
      }

      block.props.items = normalizedProjects;
    }

    blocks.push(block);
  }

  return {
    success: true,
    data: {
      blocks,
    },
  };
}

export function parsePageContentJson(input: string): PageContentValidationResult {
  try {
    const parsed = JSON.parse(input) as unknown;
    return validatePageContent(parsed);
  } catch {
    return {
      success: false,
      error: "Content payload must be valid JSON.",
    };
  }
}

export function normalizePageContent(input: unknown): PageContent {
  const result = validatePageContent(input);

  if (!result.success) {
    return {
      blocks: [],
    };
  }

  return result.data;
}
