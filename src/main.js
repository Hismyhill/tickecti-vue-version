import { createApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";

import "./style.css";
import App from "./App.vue";

// Create pinia instance
const pinia = createPinia();

// Create and mount the app
const app = createApp(App);

app.use(pinia);

// Initialize auth store
const authStore = useAuthStore();
authStore.initialize();

app.use(router);

app.mount("#app");
