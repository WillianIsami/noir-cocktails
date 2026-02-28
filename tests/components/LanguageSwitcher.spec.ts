import { mount } from '@vue/test-utils';

import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import * as i18nModule from '@/i18n';
import { createTestI18n } from '../helpers';

describe('LanguageSwitcher', () => {
  it('renders supported locale options and triggers locale update', async () => {
    const setLocaleSpy = vi.spyOn(i18nModule, 'setAppLocale').mockImplementation(() => {});

    const wrapper = mount(LanguageSwitcher, {
      global: {
        plugins: [createTestI18n('en-US')],
      },
    });

    expect(wrapper.findAll('option')).toHaveLength(3);

    await wrapper.find('select').setValue('es-ES');
    expect(setLocaleSpy).toHaveBeenCalledWith('es-ES');
  });
});
