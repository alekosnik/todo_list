import { RouteConfig } from "vue-router";

const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/todo.vue"),
        beforeEnter: (to, from, next) => {
          if (!localStorage.getItem("usertoken")) {
            next("/login");
          } else {
            next();
          }
        }
      }
    ]
  },

  {
    path: "/login",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/login.vue"),
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem("usertoken")) {
            next("/");
          } else {
            next();
          }
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
