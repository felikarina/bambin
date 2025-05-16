<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <router-link to="/galerie-photo">Galerie Photo</router-link>
  <div class="greetings">
    <h1>Hello world</h1>
    <img
      src="@/assets/chatpoulpe.jpg"
      width="600"
      alt="dessin de la mascotte de github et d'un lapin qui fume"
    />
  </div>
</template>

<style scoped></style>
