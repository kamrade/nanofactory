export type GalleryItemLinkMode = "absolute" | "relative";

export function resolveGalleryItemLinkModeByHost(host: string | null | undefined): GalleryItemLinkMode {
  const normalizedHost = host?.split(":")[0]?.toLowerCase() ?? "";
  const isPlatformHost =
    normalizedHost === "app.olala.beauty" ||
    normalizedHost === "localhost" ||
    normalizedHost === "127.0.0.1";

  return isPlatformHost ? "absolute" : "relative";
}

