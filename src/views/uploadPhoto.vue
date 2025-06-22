<script setup lang="ts">
import NavigationSidebar from "./../components/NavigationSidebar.vue";
import upload from "../components/upload.vue";
</script>

<template>
  <main class="columns">
    <div class="pr-2 column is-one-quarter left-part is-hidden-touch">
      <NavigationSidebar />
    </div>
    <div class="column right-part">
      <upload class="m-4" />
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
