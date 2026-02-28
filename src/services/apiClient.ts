const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}/${path}`, { signal });

  if (!response.ok) {
    throw new ApiClientError(
      `Request failed with status ${response.status}`,
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiClientError('Unable to parse API response');
  }
}

export const apiClient = {
  get,
};
