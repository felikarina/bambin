import { createRouter, createWebHashHistory } from "vue-router";
import PhotoGallery from "../views/PhotoGallery.vue";
import HelloWorld from "../components/HelloWorld.vue";
import activityBook from "../views/activityBook.vue";
import login from "../views/login.vue";
import adminPanel from "../views/adminPanel.vue";
import uploadPhoto from "../views/uploadPhoto.vue";
import WriteActivity from "../views/writeActivity.vue";
import MobileNavigation from "../views/mobileNavigation.vue";

const routes = [
  {
    path: "/easter-egg",
    name: "EasterEgg",
    component: HelloWorld,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/",
    name: "Login",
    component: login,
  },
  {
    path: "/navigation",
    name: "mobileNavigation",
    component: MobileNavigation,
  },
  {
    path: "/galerie-photo",
    name: "PhotoGallery",
    component: PhotoGallery,
  },
  {
    path: "/ajout-photo",
    name: "uploadPhoto",
    component: uploadPhoto,
  },
  {
    path: "/journal-activite",
    name: "activityBook",
    component: activityBook,
  },
  {
    path: "/ajout-activite",
    name: "writeActivity",
    component: WriteActivity,
  },
  {
    path: "/administration",
    name: "adminPanel",
    component: adminPanel,
    meta: { requiresAuth: true, role: ["admin", "demo"] },
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
      next("/");
    } else {
      if (to.meta.role) {
        if (Array.isArray(to.meta.role)) {
          if (!to.meta.role.includes(role)) {
            next("/");
            return;
          }
        } else if (to.meta.role !== role) {
          next("/");
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
