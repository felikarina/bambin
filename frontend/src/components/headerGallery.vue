<script setup lang="ts">
const today = new Date();
const options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric" };
const formattedDate = today.toLocaleDateString("fr-FR", options);
</script>
<template>
  <div
    class="header box is-flex is-flex-direction-row is-justify-content-space-evenly"
  >
    <button class="button is-large is-focused">{{ formattedDate }}</button>
    <button class="button is-large">
      Bambin
      <img
        src="@/assets/logo-blue.svg"
        alt="logo de Bambin"
        class="logo"
        width="60"
      />
    </button>
  </div>
</template>
<style scoped>
.header {
  background-color: white;
}

.button {
  height: 60px;
  width: 240px;
  background-color: var(--blue-lighter);
  color: var(--primary);
  cursor: default;
}
</style>
