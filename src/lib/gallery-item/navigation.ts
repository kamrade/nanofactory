export function buildGalleryItemNavigationHrefs(input: {
  galleryAnchor: string;
  previousItemAnchor?: string;
  nextItemAnchor?: string;
  backHref?: string;
  mode?: "light" | "dark";
}) {
  const modeQuery = `?mode=${input.mode ?? "light"}`;

  return {
    backHref: input.backHref ?? `../..${modeQuery}#${input.galleryAnchor}`,
    previousHref: input.previousItemAnchor
      ? `./${input.previousItemAnchor}${modeQuery}`
      : undefined,
    nextHref: input.nextItemAnchor ? `./${input.nextItemAnchor}${modeQuery}` : undefined,
  };
}
