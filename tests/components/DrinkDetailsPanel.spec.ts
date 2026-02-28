import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';

import DrinkDetailsPanel from '@/components/DrinkDetailsPanel.vue';
import type { DrinkDetails } from '@/types/cocktail';
import { createTestI18n } from '../helpers';

vi.mock('@/services/translationService', () => ({
  translationService: {
    translateFromEnglish: vi.fn(),
  },
}));

const drink: DrinkDetails = {
  id: '11007',
  name: 'Margarita',
  thumbnail: 'https://cdn.test/margarita.jpg',
  category: 'Cocktail',
  alcoholic: 'Alcoholic',
  glass: 'Cocktail glass',
  instructions: 'Shake with ice.',
  instructionsTranslations: {
    en: 'Shake with ice.',
    es: null,
  },
  tags: ['IBA'],
  ingredients: [
    {
      name: 'Tequila',
      measure: '2 oz',
      thumbnail: 'https://www.thecocktaildb.com/images/ingredients/Tequila-small.png',
    },
  ],
  videoUrl: 'https://youtu.be/abc123',
};

describe('DrinkDetailsPanel', () => {
  it('translates instructions for pt-BR when translation is available', async () => {
    const { translationService } = await import('@/services/translationService');
    vi.mocked(translationService.translateFromEnglish).mockResolvedValue('Agite com gelo.');

    const wrapper = mount(DrinkDetailsPanel, {
      props: { drink },
      global: {
        plugins: [createTestI18n('pt-BR'), createPinia()],
      },
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(wrapper.text()).toContain('Agite com gelo.');
    expect(wrapper.text()).toContain('Ingredientes');
    expect(wrapper.find('iframe').exists()).toBe(true);
  });

  it('shows source hint when fallback remains in english', async () => {
    const { translationService } = await import('@/services/translationService');
    vi.mocked(translationService.translateFromEnglish).mockResolvedValue(null);

    const wrapper = mount(DrinkDetailsPanel, {
      props: { drink },
      global: {
        plugins: [createTestI18n('pt-BR'), createPinia()],
      },
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(wrapper.text()).toContain('Shake with ice.');
    expect(wrapper.text()).toContain('Exibindo texto original da API em inglês.');
  });
});
