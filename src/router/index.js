import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/movieList",
      name: "movieList",
      component: () => import("../components/movieList.vue"),
    },
    {
      path: "/tvList",
      name: "tvList",
      component: () => import("../components/tvList.vue"),
    },
    {
      path: "/movieDetails/:movieDetails",
      name: "movieDetails",
      component: () => import("../components/movieDetails.vue"),
    },
    {
      path: "/TVDetails/:TVDetails",
      name: "TVDetails",
      component: () => import("../components/TVDetails.vue"),
    },
    {
      path: "/aboutPage",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
