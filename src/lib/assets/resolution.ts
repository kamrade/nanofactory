export type ResolvableAsset = {
  id: string;
  publicUrl: string;
};

export function buildAssetMap<T extends ResolvableAsset>(assets: T[]) {
  return new Map(assets.map((asset) => [asset.id, asset] as const));
}

export function resolveAssetById<T extends ResolvableAsset>(
  assetId: unknown,
  assetMap: Map<string, T>
) {
  if (typeof assetId !== "string" || assetId.trim().length === 0) {
    return null;
  }

  return assetMap.get(assetId) ?? null;
}
