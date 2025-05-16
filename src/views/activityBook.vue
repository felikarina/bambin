<script setup lang="ts">
import NavigationSidebar from './../components/NavigationSidebar.vue'
import book from './../components/book.vue'
import headerGallery from './../components/headerGallery.vue'
</script>

<template>
  <main class="columns">
    <div class="pr-2 column is-one-quarter left-part is-hidden-touch">
      <NavigationSidebar class="" />
    </div>
    <div class="column right-part">
      <div class="column">
        <headerGallery class="mx-4 is-hidden-touch" />
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
  overflow: auto;
}
.right-part {
  height: 102vh;
  overflow: auto;
}
</style>
