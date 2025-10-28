import { createApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";

import "./style.css";
import App from "./App.vue";

// Create pinia instance
const pinia = createPinia();

// Create router instance

// Create and mount the app
const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
