import { ALPHABET, FALLBACK_LETTER, STORAGE_KEYS } from '@/utils/constants';

describe('constants', () => {
  it('exposes alphabet and storage keys', () => {
    expect(ALPHABET).toHaveLength(26);
    expect(ALPHABET[0]).toBe('A');
    expect(ALPHABET[25]).toBe('Z');
    expect(FALLBACK_LETTER).toBe('A');
    expect(STORAGE_KEYS.favorites).toBe('noir-cocktails-favorites');
  });
});
