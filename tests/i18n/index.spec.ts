describe('i18n setup', () => {
  it('loads locale from localStorage when available', async () => {
    vi.resetModules();
    window.localStorage.setItem('noir-cocktails-locale', 'es-ES');

    const { i18n } = await import('@/i18n');
    expect(i18n.global.locale.value).toBe('es-ES');
  });

  it('updates document lang and persists locale changes', async () => {
    vi.resetModules();
    const { isSupportedLocale, setAppLocale } = await import('@/i18n');

    expect(isSupportedLocale('pt-BR')).toBe(true);
    expect(isSupportedLocale('fr-FR')).toBe(false);

    setAppLocale('en-US');

    expect(document.documentElement.lang).toBe('en-US');
    expect(window.localStorage.getItem('noir-cocktails-locale')).toBe('en-US');
  });
});
