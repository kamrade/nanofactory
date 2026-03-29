import "server-only";

import { getStorageConfig } from "@/lib/storage/config";

function normalizeStorageKey(storageKey: string) {
  const trimmedStorageKey = storageKey.trim().replace(/^\/+/, "");

  if (!trimmedStorageKey) {
    throw new Error("buildPublicAssetUrl requires a storageKey");
  }

  return trimmedStorageKey
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function buildPublicAssetUrl(storageKey: string) {
  const config = getStorageConfig();
  return `${config.publicBaseUrl}/${normalizeStorageKey(storageKey)}`;
}
