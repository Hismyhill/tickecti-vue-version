import { createRouter, createWebHistory } from "vue-router";
import LandingView from "../pages/LandingView.vue";
import LoginView from "../pages/LoginView.vue";
import SignupView from "../pages/SignupView.vue";
import DashboardView from "../pages/DashboardView.vue";
import TicketsView from "../pages/TicketsView.vue";
import { useAuthStore } from "../stores/auth";
import Tickets from "../pages/Tickets.vue";

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingView,
    },
    {
      path: "/auth/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/auth/signup",
      name: "signup",
      component: SignupView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/tickets",
      name: "tickets",
      component: Tickets,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.user) {
    next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
