import type { PageContent } from "@/db/schema";
import {
  buildEffectivePageAnchors,
  getGalleryItemEffectiveAnchor,
  normalizeAnchorId,
} from "@/lib/editor/anchor-id";

export type ResolvedGalleryItem = {
  galleryAnchor: string;
  itemAnchor: string;
  itemIndex: number;
  totalItems: number;
  previousItemAnchor?: string;
  nextItemAnchor?: string;
  title: string;
  description: string;
  price: string;
  meta: string;
  assetId?: string;
};

export function resolveGalleryItemFromContent(
  content: PageContent,
  galleryAnchor: string,
  itemAnchor: string
): ResolvedGalleryItem | null {
  const effectiveAnchors = buildEffectivePageAnchors(content.blocks);
  const normalizedGalleryAnchor = normalizeAnchorId(galleryAnchor);
  const normalizedItemAnchor = normalizeAnchorId(itemAnchor);

  const galleryBlock = content.blocks.find(
    (block) =>
      block.type === "gallery" &&
      effectiveAnchors.blockAnchors.get(block.id) === normalizedGalleryAnchor &&
      Array.isArray(block.props.items)
  );

  if (!galleryBlock || !Array.isArray(galleryBlock.props.items)) {
    return null;
  }

  const galleryItemIndex = galleryBlock.props.items.findIndex((item, index) => {
    const effectiveItemAnchor = getGalleryItemEffectiveAnchor(
      effectiveAnchors.galleryItemAnchors,
      galleryBlock.id,
      index
    );
    return effectiveItemAnchor === normalizedItemAnchor;
  });

  if (galleryItemIndex < 0) {
    return null;
  }

  const allGalleryAnchors = galleryBlock.props.items.map((_, index) =>
    getGalleryItemEffectiveAnchor(effectiveAnchors.galleryItemAnchors, galleryBlock.id, index)
  );

  const rawItem = galleryBlock.props.items[galleryItemIndex];
  if (typeof rawItem !== "object" || rawItem === null) {
    return null;
  }

  const item = rawItem as Record<string, unknown>;
  return {
    galleryAnchor: normalizedGalleryAnchor,
    itemAnchor: normalizedItemAnchor,
    itemIndex: galleryItemIndex,
    totalItems: galleryBlock.props.items.length,
    previousItemAnchor:
      galleryItemIndex > 0 ? allGalleryAnchors[galleryItemIndex - 1] ?? undefined : undefined,
    nextItemAnchor:
      galleryItemIndex < galleryBlock.props.items.length - 1
        ? allGalleryAnchors[galleryItemIndex + 1] ?? undefined
        : undefined,
    title: typeof item.title === "string" ? item.title : "",
    description: typeof item.description === "string" ? item.description : "",
    price: typeof item.price === "string" ? item.price : "",
    meta: typeof item.meta === "string" ? item.meta : "",
    assetId: typeof item.assetId === "string" ? item.assetId : undefined,
  };
}

