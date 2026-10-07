export const getWebpUrl = (originalUrl: string): string => {
  if (!originalUrl) return originalUrl;
  
  // Images dans /images/
  if (originalUrl.startsWith('/images/')) {
    return originalUrl
      .replace(/\.jpg$/i, '.webp')
      .replace(/\.jpeg$/i, '.webp')
      .replace(/\.png$/i, '.webp')
      .replace(/\.gif$/i, '.webp')
      .replace(/\.bmp$/i, '.webp')
      .replace(/\.tiff$/i, '.webp');
  }
  
  return originalUrl;
};

export const getVideoWebmUrl = (mp4Url?: string): string | undefined => {
  if (!mp4Url) return undefined;
  if (mp4Url.endsWith('.webm')) return mp4Url;
  return mp4Url.replace(/\.mp4$/i, '.webm');
};

export const getOptimizedImageUrl = (originalUrl: string): string => {
  return getWebpUrl(originalUrl);
};

export const getOptimizedVideoUrls = (mp4Url?: string) => {
  if (!mp4Url) return { webm: undefined, mp4: mp4Url };
  const webm = getVideoWebmUrl(mp4Url);
  return { webm, mp4: mp4Url };
};
