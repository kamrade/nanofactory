import { UI_MODE_COOKIE } from "@/lib/ui-preferences";

export type GalleryItemMode = "light" | "dark";

type ResolveGalleryItemModeInput = {
  searchMode?: string;
  referer?: string | null;
  cookieMode?: string;
};

export function resolveGalleryItemMode({
  searchMode,
  referer,
  cookieMode,
}: ResolveGalleryItemModeInput): GalleryItemMode {
  if (searchMode === "dark") {
    return "dark";
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.searchParams.get("mode") === "dark") {
        return "dark";
      }
    } catch {
      // ignore malformed referrer
    }
  }

  return cookieMode === "dark" ? "dark" : "light";
}

export function readModeCookieValue(cookieStore: {
  get: (name: string) => { value: string } | undefined;
}) {
  return cookieStore.get(UI_MODE_COOKIE)?.value;
}

