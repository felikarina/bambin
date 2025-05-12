<script setup lang="ts">
import NavigationSidebar from './../components/NavigationSidebar.vue'
</script>

<template>
  <div id="app">
    <header>
      <div class="wrapper">
        <NavigationSidebar />
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
