<script setup lang="ts">
import NavigationSidebar from "../components/NavigationSidebar.vue";
import book from "../components/book.vue";
import headerGallery from "../components/headerGallery.vue";
import headerMobile from "../components/headerMobile.vue";
</script>

<template>
  <main class="columns">
    <div class="pr-2 column is-one-quarter left-part is-hidden-mobile">
      <NavigationSidebar />
    </div>
    <div class="column right-part">
      <div class="column">
        <headerGallery class="mx-4 is-hidden-mobile" />
      </div>
      <div class="column">
        <headerMobile class="mx-4 is-hidden-tablet" />
      </div>
      <div class="column">
        <book class="mt-2 mx-4" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.left-part {
  height: 102vh;
}
.right-part {
  height: 102vh;
  overflow: auto;
}
</style>
