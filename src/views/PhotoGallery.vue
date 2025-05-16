<script setup lang="ts">
import NavigationSidebar from './../components/NavigationSidebar.vue'
import gallery from './../components/gallery.vue'
</script>

<template>
  <main class="columns">
    <div class="pr-2 column is-one-third">
      <NavigationSidebar class="is-hidden-mobile" />
    </div>
    <div class="column">
      <gallery class="mt-6 mx-4" />
    </div>
  </main>
</template>

<style scoped></style>
