import './assets/styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import specific icons */
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(faClockRotateLeft);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
