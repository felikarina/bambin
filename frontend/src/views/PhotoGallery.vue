<script setup lang="ts">
import NavigationSidebar from "../components/NavigationSidebar.vue";
import gallery from "../components/gallery.vue";
import headerGallery from "../components/headerGallery.vue";
import headerMobile from "../components/headerMobile.vue";
</script>

<template>
  <main class="columns">
    <div class="pr-2 column is-one-quarter left-part is-hidden-mobile">
      <NavigationSidebar class="" />
    </div>
    <div class="column right-part">
      <div class="column sticky-header">
        <headerGallery class="mx-4 is-hidden-mobile" />
        <headerMobile class="mx-4 is-hidden-tablet" />
      </div>
      <div class="column">
        <gallery class="mt-2 mx-4" />
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
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
}
</style>
