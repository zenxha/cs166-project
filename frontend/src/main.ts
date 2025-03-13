import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// import { worker } from './mocks/browser';

// if (import.meta.env.MODE === 'development') {
//   console.log('Starting server in development mode');
// }

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
