import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();
//umjesto da koristim localstorage za state koristim pinia plugin
//zašto? da vidim kako radi i vjerojatno ako radim stvari putem pinie imati
//ću na raspolaganju neki devtools za debugging (valjda)
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

app.mount("#app");
