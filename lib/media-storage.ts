export function getMediaUrl(assetKey: string): string {
  return `/uploads/${assetKey}`;
}

export function getAssetKeyFromUrl(url: string): string | undefined {
  const prefix = "/uploads/";

  if (!url.startsWith(prefix)) {
    return undefined;
  }

  return url.slice(prefix.length);
}
