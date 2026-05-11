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
  if (searchMode === "light") {
    return "light";
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererMode = refererUrl.searchParams.get("mode");
      if (refererMode === "dark") {
        return "dark";
      }
      if (refererMode === "light") {
        return "light";
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
