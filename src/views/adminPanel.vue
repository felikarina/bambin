<script setup lang="ts">
import administration from "../components/administration.vue";
import NavigationSidebar from "./../components/NavigationSidebar.vue";
</script>

<template>
  <main class="columns">
    <div class="left-part column is-one-quarter pr-2">
      <NavigationSidebar class="" />
    </div>
    <div class="right-part column p-4">
      <administration />
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
