import { loadFromStorage, saveToStorage } from '@/utils/storage';

describe('storage utilities', () => {
  it('loads persisted JSON data', () => {
    window.localStorage.setItem('key', JSON.stringify({ ok: true }));
    expect(loadFromStorage('key', { ok: false })).toEqual({ ok: true });
  });

  it('returns fallback when key is missing or invalid JSON', () => {
    expect(loadFromStorage('missing', ['fallback'])).toEqual(['fallback']);

    window.localStorage.setItem('bad-json', '{');
    expect(loadFromStorage('bad-json', ['fallback'])).toEqual(['fallback']);
  });

  it('saves payload to localStorage', () => {
    saveToStorage('drinks', [{ id: '1' }]);
    expect(window.localStorage.getItem('drinks')).toBe('[{"id":"1"}]');
  });
});
