describe('translationService', () => {
  it('translates english text and caches by target language', async () => {
    vi.resetModules();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [[['Agite com gelo.', 'Shake with ice.', null, null, 3]]],
    });
    vi.stubGlobal('fetch', fetchMock);

    const { translationService } = await import('@/services/translationService');

    await expect(
      translationService.translateFromEnglish('Shake with ice.', 'pt'),
    ).resolves.toBe('Agite com gelo.');
    await expect(
      translationService.translateFromEnglish('Shake with ice.', 'pt'),
    ).resolves.toBe('Agite com gelo.');

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns null for failed requests or empty input', async () => {
    vi.resetModules();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      }),
    );

    const { translationService } = await import('@/services/translationService');

    await expect(translationService.translateFromEnglish('   ', 'es')).resolves.toBeNull();
    await expect(translationService.translateFromEnglish('Serve cold', 'es')).resolves.toBeNull();
  });
});
