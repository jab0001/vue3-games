import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import store from "@/store/index";

const routes = [
  {
    path: "/",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = (store.getters.getToken || localStorage.getItem("token"));
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
