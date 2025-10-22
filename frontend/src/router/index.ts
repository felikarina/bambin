import { createRouter, createWebHashHistory } from "vue-router";
import { jwtDecode } from "jwt-decode";
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
    meta: { requiresAuth: true, role: ["admin", "demo", "nurseryStaff"] },
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
    meta: { requiresAuth: true, role: ["admin", "demo", "nurseryStaff"] },
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

export async function authGuard(to: any, from: any, next: any) {
  // Ask the server who the current user is (uses HttpOnly cookie)
  let current = { role: null as string | null, userId: null as string | null };
  try {
    const res = await fetch("/api/current-user", { credentials: "include" });
    if (res.ok) current = await res.json();
  } catch (e) {
    // ignore
  }

  const role = current.role ?? "";

  if (to.meta.requiresAuth) {
    if (!role) {
      next("/");
      return;
    }
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
  } else {
    next();
  }
}

router.beforeEach(authGuard);

export default router;
