import { createRouter, createWebHashHistory } from 'vue-router'
import PhotoGallery from '../views/PhotoGallery.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import activityBook from '@/views/activityBook.vue'
import login from '@/views/login.vue'

const routes = [
  {
    path: '/',
    name: 'Acceuil',
    component: HelloWorld,
  },
  {
    path: '/connexion',
    name: 'Login',
    component: login,
  },
  {
    path: '/galerie-photo',
    name: 'PhotoGallery',
    component: PhotoGallery,
  },
  {
    path: '/journal-activite',
    name: 'activityBook',
    component: activityBook,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
