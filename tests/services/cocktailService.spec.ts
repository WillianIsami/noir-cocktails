import type { CocktailDbDrinkDto, CocktailDbListResponse } from '@/types/api';

async function loadServiceWithApiMock(
  getMock: ReturnType<typeof vi.fn>,
): Promise<typeof import('@/services/cocktailService')> {
  vi.resetModules();
  vi.doMock('@/services/apiClient', () => ({
    apiClient: {
      get: getMock,
    },
  }));

  return import('@/services/cocktailService');
}

function createDrink(id: string, name: string): CocktailDbDrinkDto {
  return {
    idDrink: id,
    strDrink: name,
    strDrinkThumb: `https://cdn.test/${id}.jpg`,
  };
}

describe('cocktailService', () => {
  it('fetches categories and maps identifiers', async () => {
    const getMock = vi.fn().mockResolvedValue({
      drinks: [{ strCategory: 'Coffee / Tea' }],
    });
    const { cocktailService } = await loadServiceWithApiMock(getMock);

    await expect(cocktailService.listCategories()).resolves.toEqual([
      { id: 'coffee-/-tea', name: 'Coffee / Tea' },
    ]);
    expect(getMock).toHaveBeenCalledWith('list.php?c=list', undefined);
  });

  it('normalizes name search query before requesting API', async () => {
    const getMock = vi
      .fn()
      .mockResolvedValue({ drinks: [createDrink('11000', 'Pina Colada')] });
    const { cocktailService } = await loadServiceWithApiMock(getMock);

    await cocktailService.searchByName('piñha colada');

    expect(getMock).toHaveBeenCalledWith('search.php?s=pina%20colada', undefined);
  });

  it('aggregates all drinks from A-Z, deduplicates, and reuses cache', async () => {
    const getMock = vi.fn(
      async (path: string): Promise<CocktailDbListResponse<CocktailDbDrinkDto>> => {
        if (path === 'search.php?f=a') {
          return { drinks: [createDrink('1', 'A1')] };
        }
        if (path === 'search.php?f=b') {
          return { drinks: [createDrink('1', 'A1'), createDrink('2', 'B2')] };
        }
        return { drinks: null };
      },
    );

    const { cocktailService } = await loadServiceWithApiMock(getMock);

    const firstFetch = await cocktailService.listAllDrinks();
    const secondFetch = await cocktailService.listAllDrinks();

    expect(firstFetch).toHaveLength(2);
    expect(firstFetch.map((drink) => drink.id)).toEqual(['1', '2']);
    expect(secondFetch).toEqual(firstFetch);
    expect(getMock).toHaveBeenCalledTimes(26);
  });

  it('returns null when drink details endpoint returns empty payload', async () => {
    const getMock = vi.fn().mockResolvedValue({ drinks: null });
    const { cocktailService } = await loadServiceWithApiMock(getMock);

    await expect(cocktailService.getById('123')).resolves.toBeNull();
    expect(getMock).toHaveBeenCalledWith('lookup.php?i=123', undefined);
  });
});
