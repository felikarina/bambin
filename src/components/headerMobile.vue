<script setup lang="ts"></script>
<template>
  <div class="header box p-0 is-flex is-flex-direction-row is-justify-content-space-between">
    <button class="button is-large">photo</button>
    <button class="button is-large">activité</button>
    <div class="is-flex is-flex-direction-column is-align-items-center">
      <button class="button barIcon mb-2 is-info" aria-label="Menu">
        <span class="icon">
          <i class="fas fa-bars" aria-hidden="true"></i>
        </span>
      </button>
      <button class="button bellIcon is-info" aria-label="Notifications">
        <span class="icon">
          <i class="fas fa-bell" aria-hidden="true"></i>
        </span>
      </button>
    </div>
  </div>
</template>
<style scoped>
.header {
  background-color: white;
}

.button {
  background-color: var(--blue-lighter);
  color: black;
}

.barIcon,
.bellIcon {
  background-color: var(--blue-light);
}
</style>
