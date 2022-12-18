import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import EventView from "@/views/EventView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: EventView,
    },
    {
      path: "/create-event",
      name: "CreateEvent",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    // {
    //   path: "/",
    //   name: "Eventi",
    //   component: EventView,
    // },
  ],
});

export default router;
