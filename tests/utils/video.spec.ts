import { toYoutubeEmbedUrl } from '@/utils/video';

describe('video utilities', () => {
  it('converts youtu.be URLs', () => {
    expect(toYoutubeEmbedUrl('https://youtu.be/abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    );
  });

  it('converts youtube watch URLs', () => {
    expect(toYoutubeEmbedUrl('https://www.youtube.com/watch?v=xyz789')).toBe(
      'https://www.youtube.com/embed/xyz789',
    );
  });

  it('returns null for unsupported or invalid URLs', () => {
    expect(toYoutubeEmbedUrl('https://example.com/video')).toBeNull();
    expect(toYoutubeEmbedUrl('not-a-url')).toBeNull();
    expect(toYoutubeEmbedUrl(null)).toBeNull();
  });
});
