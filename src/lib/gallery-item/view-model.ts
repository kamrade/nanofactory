import type { ResolvedGalleryItem } from "@/lib/gallery-item/resolve";
import { buildGalleryItemNavigationHrefs } from "@/lib/gallery-item/navigation";
import type { GalleryItemMode } from "@/lib/gallery-item/mode";
import { resolveGalleryItemLinkModeByHost } from "@/lib/routing/gallery-link-mode";
import { DEFAULT_THEME_KEY, isThemeKey } from "@/lib/themes";

export type BuildGalleryItemPageViewModelInput = {
  resolvedItem: ResolvedGalleryItem & {
    projectSlug: string;
    projectName: string;
  };
  projectThemeKey: string;
  mode: GalleryItemMode;
  host: string | null;
};

export function buildGalleryItemPageViewModel(input: BuildGalleryItemPageViewModelInput) {
  const { resolvedItem, projectThemeKey, mode, host } = input;
  const resolvedThemeKey = isThemeKey(projectThemeKey) ? projectThemeKey : DEFAULT_THEME_KEY;
  const backLinkMode = resolveGalleryItemLinkModeByHost(host);

  const navigationHrefs = buildGalleryItemNavigationHrefs({
    galleryAnchor: resolvedItem.galleryAnchor,
    previousItemAnchor: resolvedItem.previousItemAnchor,
    nextItemAnchor: resolvedItem.nextItemAnchor,
    mode,
    backHref:
      backLinkMode === "absolute"
        ? `/p/${resolvedItem.projectSlug}?mode=${mode}#${resolvedItem.galleryAnchor}`
        : undefined,
  });

  return {
    resolvedThemeKey,
    navigationHrefs,
  };
}
