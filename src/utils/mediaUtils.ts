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
  // Les WebM sont dans un sous-dossier /webm/ à côté des MP4. Sans ce
  // segment, la source pointait vers un fichier inexistant, le navigateur
  // faisait un 404 et retombait sur le MP4 — donc sur 12 Mo au lieu de 3,6.
  const dir = mp4Url.slice(0, mp4Url.lastIndexOf('/') + 1);
  const name = mp4Url.slice(dir.length).replace(/\.mp4$/i, '.webm');
  return `${dir}webm/${name}`;
};

export const getOptimizedImageUrl = (originalUrl: string): string => {
  return getWebpUrl(originalUrl);
};

export const getOptimizedVideoUrls = (mp4Url?: string) => {
  if (!mp4Url) return { webm: undefined, mp4: mp4Url };
  const webm = getVideoWebmUrl(mp4Url);
  return { webm, mp4: mp4Url };
};
