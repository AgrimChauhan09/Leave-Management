import { createApp } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import "./styles.css";
import App from "./App.vue";
import { routes } from "./router.js";
import { useAuthStore } from "./stores/auth.js";

const pinia = createPinia();
setActivePinia(pinia);

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta?.requiresAuth && !auth.isAuthenticated) return { name: "login" };
  if (to.meta?.role && auth.user?.role !== to.meta.role) return { name: "home" };
  return true;
});

createApp(App).use(pinia).use(router).mount("#app");

