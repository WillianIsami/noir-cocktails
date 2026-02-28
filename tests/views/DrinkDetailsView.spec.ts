import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';

import DrinkDetailsView from '@/views/DrinkDetailsView.vue';
import { createTestI18n, createTestRouter } from '../helpers';

vi.mock('@/services/cocktailService', () => ({
  cocktailService: {
    getById: vi.fn(),
  },
}));

const drinkResponse = {
  id: '11007',
  name: 'Margarita',
  thumbnail: 'thumb.jpg',
  category: 'Cocktail',
  alcoholic: 'Alcoholic',
  glass: 'Cocktail glass',
  instructions: 'Shake with ice.',
  instructionsTranslations: {
    en: 'Shake with ice.',
    es: null,
  },
  tags: [],
  ingredients: [],
  videoUrl: null,
};

describe('DrinkDetailsView', () => {
  it('loads and renders drink details', async () => {
    const { cocktailService } = await import('@/services/cocktailService');
    vi.mocked(cocktailService.getById).mockResolvedValue(drinkResponse);

    const router = createTestRouter();
    await router.push('/drink/11007');
    await router.isReady();

    const wrapper = mount(DrinkDetailsView, {
      global: {
        plugins: [createTestI18n('en-US'), createPinia(), router],
      },
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(cocktailService.getById).toHaveBeenCalledWith('11007');
    expect(wrapper.text()).toContain('Margarita');
  });

  it('shows error state when drink is not found', async () => {
    const { cocktailService } = await import('@/services/cocktailService');
    vi.mocked(cocktailService.getById).mockResolvedValue(null);

    const router = createTestRouter();
    await router.push('/drink/999');
    await router.isReady();

    const wrapper = mount(DrinkDetailsView, {
      global: {
        plugins: [createTestI18n('en-US'), createPinia(), router],
      },
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(wrapper.text()).toContain('This drink was not found.');
  });
});
