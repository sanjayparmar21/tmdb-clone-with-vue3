import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./styles/app.css";

import "./assets/main.css";

import { vue3Debounce } from "vue-debounce";

const app = createApp(App);

app.directive("debounce", vue3Debounce({ lock: true }));
app.use(router);
app.use(store);
app.mount("#app");
