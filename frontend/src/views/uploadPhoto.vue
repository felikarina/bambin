<script setup lang="ts">
import NavigationSidebar from "../components/NavigationSidebar.vue";
import upload from "../components/upload.vue";
import headerGallery from "../components/headerGallery.vue";
import headerAdmin from "../components/headerAdmin.vue";
</script>

<template>
  <main class="columns">
    <div class="pr-2 column is-one-quarter left-part is-hidden-mobile">
      <NavigationSidebar />
    </div>
    <div class="column right-part">
      <div class="column">
        <headerAdmin class="mx-4 is-hidden-tablet" />
      </div>
      <div class="column" v-disable-demo>
        <upload class="m-4" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.left-part {
  height: 100vh;
}
.right-part {
  height: 100vh;
  overflow: auto;
}
</style>
