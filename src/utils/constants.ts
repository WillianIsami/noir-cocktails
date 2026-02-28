export const STORAGE_KEYS = {
  favorites: 'noir-cocktails-favorites',
} as const;

export const ALPHABET = Array.from({ length: 26 }, (_, index) =>
  String.fromCharCode(65 + index),
);

export const FALLBACK_LETTER = 'A';
