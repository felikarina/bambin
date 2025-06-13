import { createRouter, createWebHashHistory } from "vue-router";
import PhotoGallery from "../views/PhotoGallery.vue";
import HelloWorld from "../components/HelloWorld.vue";
import activityBook from "../views/activityBook.vue";
import login from "../views/login.vue";

const routes = [
  {
    path: "/",
    name: "Acceuil",
    component: HelloWorld,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/connexion",
    name: "Login",
    component: login,
  },
  {
    path: "/galerie-photo",
    name: "PhotoGallery",
    component: PhotoGallery,
  },
  {
    path: "/journal-activite",
    name: "activityBook",
    component: activityBook,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export function authGuard(to: any, from: any, next: any) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (to.meta.requiresAuth) {
    if (!token) {
      next("/connexion");
    } else {
      if (to.meta.role) {
        if (Array.isArray(to.meta.role)) {
          if (!to.meta.role.includes(role)) {
            next("/connexion");
            return;
          }
        } else if (to.meta.role !== role) {
          next("/connexion");
          return;
        }
      }
      next();
    }
  } else {
    next();
  }
}

router.beforeEach(authGuard);

export default router;
