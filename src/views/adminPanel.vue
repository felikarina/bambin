<script setup lang="ts">
import administration from "../components/administration.vue";
import NavigationSidebar from "./../components/NavigationSidebar.vue";
import headerGallery from "./../components/headerGallery.vue";
import headerAdmin from "./../components/headerAdmin.vue";
</script>

<template>
  <main class="columns">
    <div class="left-part column is-one-quarter pr-2 is-hidden-mobile">
      <NavigationSidebar />
    </div>
    <div class="right-part column p-4">
      <div class="column">
        <headerAdmin class="mx-4 is-hidden-tablet" />
      </div>
      <div class="column">
        <administration />
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
