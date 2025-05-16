<script setup lang="ts"></script>
<template>
  <div class="gallery">
    <div class="fixed-grid">
      <div class="grid">
        <div class="cell">photo</div>
        <div class="cell">photo</div>
        <div class="cell">photo</div>
        <div class="cell">photo</div>
        <div class="cell">photo</div>
        <div class="cell">photo</div>
        <div class="cell">photo</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.gallery {
  background-color: var(--blue-lighter);
  height: 100%;
  border-radius: 20px;
}

.cell {
  padding: 10%;
}
</style>
