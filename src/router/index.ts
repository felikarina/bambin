import { createRouter, createWebHashHistory } from 'vue-router'
import PhotoGallery from '../views/PhotoGallery.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import activityBook from '@/views/activityBook.vue'

const routes = [
  {
    path: '/',
    name: 'Acceuil',
    component: HelloWorld,
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
