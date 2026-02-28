import { ApiClientError, apiClient } from '@/services/apiClient';

function createResponse<T>(overrides: Partial<Response> & { json?: () => Promise<T> }) {
  return {
    ok: true,
    status: 200,
    json: async () => ({} as T),
    ...overrides,
  } as unknown as Response;
}

describe('apiClient', () => {
  it('returns parsed JSON on successful requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createResponse({
        json: async () => ({ drinks: [{ idDrink: '1' }] }),
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(apiClient.get('search.php?f=a')).resolves.toEqual({
      drinks: [{ idDrink: '1' }],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a',
      { signal: undefined },
    );
  });

  it('throws ApiClientError on non-ok responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createResponse({ ok: false, status: 503 })),
    );

    await expect(apiClient.get('list.php?c=list')).rejects.toEqual(
      expect.objectContaining<ApiClientError>({
        name: 'ApiClientError',
        message: 'Request failed with status 503',
        status: 503,
      }),
    );
  });

  it('throws ApiClientError when response JSON parsing fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createResponse({
          json: async () => {
            throw new Error('bad json');
          },
        }),
      ),
    );

    await expect(apiClient.get('lookup.php?i=11007')).rejects.toEqual(
      expect.objectContaining<ApiClientError>({
        message: 'Unable to parse API response',
      }),
    );
  });
});
