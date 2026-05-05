export function buildGalleryItemNavigationHrefs(input: {
  galleryAnchor: string;
  previousItemAnchor?: string;
  nextItemAnchor?: string;
  backHref?: string;
}) {
  return {
    backHref: input.backHref ?? `../..#${input.galleryAnchor}`,
    previousHref: input.previousItemAnchor ? `./${input.previousItemAnchor}` : undefined,
    nextHref: input.nextItemAnchor ? `./${input.nextItemAnchor}` : undefined,
  };
}
