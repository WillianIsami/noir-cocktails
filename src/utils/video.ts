export function toYoutubeEmbedUrl(videoUrl: string | null): string | null {
  if (!videoUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(videoUrl);

    if (parsedUrl.hostname.includes('youtu.be')) {
      const videoId = parsedUrl.pathname.replace('/', '').trim();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsedUrl.hostname.includes('youtube.com')) {
      const videoId = parsedUrl.searchParams.get('v')?.trim();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
}
