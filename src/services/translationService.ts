const TRANSLATION_ENDPOINT = 'https://translate.googleapis.com/translate_a/single';

const translationCache = new Map<string, string>();

type TranslationTargetLanguage = 'pt' | 'es';

function buildCacheKey(text: string, targetLanguage: TranslationTargetLanguage): string {
  return `${targetLanguage}:${text}`;
}

function parseTranslatedText(payload: unknown): string | null {
  if (!Array.isArray(payload) || payload.length === 0) {
    return null;
  }

  const segments = payload[0];
  if (!Array.isArray(segments)) {
    return null;
  }

  const translatedText = segments
    .map((segment) => {
      if (!Array.isArray(segment) || segment.length === 0) {
        return '';
      }

      const fragment = segment[0];
      return typeof fragment === 'string' ? fragment : '';
    })
    .join('')
    .trim();

  return translatedText.length > 0 ? translatedText : null;
}

async function requestTranslation(
  text: string,
  targetLanguage: TranslationTargetLanguage,
  signal?: AbortSignal,
): Promise<string | null> {
  const query = new URLSearchParams({
    client: 'gtx',
    sl: 'en',
    tl: targetLanguage,
    dt: 't',
    q: text,
  });

  const response = await fetch(`${TRANSLATION_ENDPOINT}?${query.toString()}`, { signal });
  if (!response.ok) {
    return null;
  }

  const payload: unknown = await response.json();
  return parseTranslatedText(payload);
}

export const translationService = {
  async translateFromEnglish(
    text: string,
    targetLanguage: TranslationTargetLanguage,
    signal?: AbortSignal,
  ): Promise<string | null> {
    const normalizedText = text.trim();
    if (normalizedText.length === 0) {
      return null;
    }

    const cacheKey = buildCacheKey(normalizedText, targetLanguage);
    const cachedValue = translationCache.get(cacheKey);
    if (cachedValue) {
      return cachedValue;
    }

    const translatedText = await requestTranslation(normalizedText, targetLanguage, signal);
    if (!translatedText) {
      return null;
    }

    translationCache.set(cacheKey, translatedText);
    return translatedText;
  },
};

