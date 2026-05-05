const ANCHOR_ID_PATTERN = /^[a-z][a-z0-9-]*$/;

export function normalizeAnchorId(value: string) {
  return value.trim().toLowerCase();
}

export function isValidAnchorId(value: string) {
  return ANCHOR_ID_PATTERN.test(value);
}

function sanitizeAnchorToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildAutoAnchorBase(blockType: string) {
  const token = sanitizeAnchorToken(blockType);
  if (token.length === 0) {
    return "section";
  }
  return /^[a-z]/.test(token) ? token : `section-${token}`;
}

function ensureUniqueAnchor(base: string, used: Set<string>) {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }

  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  const next = `${base}-${suffix}`;
  used.add(next);
  return next;
}

function getGalleryItemMapKey(blockId: string, itemIndex: number) {
  return `${blockId}:${itemIndex}`;
}

export function buildEffectivePageAnchors(
  blocks: Array<{ id: string; type: string; anchorId?: string; props?: Record<string, unknown> }>
) {
  const used = new Set<string>();
  const blockAnchors = new Map<string, string>();
  const galleryItemAnchors = new Map<string, string>();

  for (const block of blocks) {
    if (typeof block.anchorId !== "string" || block.anchorId.trim().length === 0) {
      continue;
    }
    const normalized = normalizeAnchorId(block.anchorId);
    if (!isValidAnchorId(normalized) || used.has(normalized)) {
      continue;
    }
    used.add(normalized);
    blockAnchors.set(block.id, normalized);
  }

  for (const block of blocks) {
    if (block.type !== "gallery" || !block.props || !Array.isArray(block.props.items)) {
      continue;
    }
    block.props.items.forEach((item, itemIndex) => {
      if (typeof item !== "object" || item === null) {
        return;
      }
      const raw = (item as { imageAnchor?: unknown }).imageAnchor;
      if (typeof raw !== "string" || raw.trim().length === 0) {
        return;
      }
      const normalized = normalizeAnchorId(raw);
      if (!isValidAnchorId(normalized) || used.has(normalized)) {
        return;
      }
      used.add(normalized);
      galleryItemAnchors.set(getGalleryItemMapKey(block.id, itemIndex), normalized);
    });
  }

  const typeCounts = new Map<string, number>();
  for (const block of blocks) {
    const nextCount = (typeCounts.get(block.type) ?? 0) + 1;
    typeCounts.set(block.type, nextCount);

    if (blockAnchors.has(block.id)) {
      continue;
    }
    const typeBase = buildAutoAnchorBase(block.type);
    const base = `${typeBase}-${nextCount}`;
    blockAnchors.set(block.id, ensureUniqueAnchor(base, used));
  }

  for (const block of blocks) {
    if (block.type !== "gallery" || !Array.isArray(block.props?.items)) {
      continue;
    }
    const blockAnchor = blockAnchors.get(block.id) ?? "gallery";
    block.props.items.forEach((_, itemIndex) => {
      const key = getGalleryItemMapKey(block.id, itemIndex);
      if (galleryItemAnchors.has(key)) {
        return;
      }
      const base = `${blockAnchor}-item-${itemIndex + 1}`;
      galleryItemAnchors.set(key, ensureUniqueAnchor(base, used));
    });
  }

  return { blockAnchors, galleryItemAnchors };
}

export function buildEffectiveAnchorMap(
  blocks: Array<{ id: string; type: string; anchorId?: string; props?: Record<string, unknown> }>
) {
  return buildEffectivePageAnchors(blocks).blockAnchors;
}

export function getGalleryItemEffectiveAnchor(
  galleryItemAnchors: Map<string, string>,
  blockId: string,
  itemIndex: number
) {
  return galleryItemAnchors.get(getGalleryItemMapKey(blockId, itemIndex));
}
