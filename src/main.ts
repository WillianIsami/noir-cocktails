import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { i18n, initializeI18nLocale } from './i18n';
import router from './router';
import './styles/main.scss';

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.use(router);

initializeI18nLocale();
app.mount('#app');
