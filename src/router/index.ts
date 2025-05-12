import { createRouter, createWebHashHistory } from 'vue-router'
import PhotoGallery from '../views/PhotoGallery.vue'
import HelloWorld from '@/components/HelloWorld.vue'

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
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
