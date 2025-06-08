<script setup lang="ts"></script>
<template>
  <div
    class="header box p-0 is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
  >
    <div class="divMainButton is-flex is-justify-content-space-around is-flex-grow-1">
      <router-link to="/galerie-photo" class="mainButton button is-large">photo</router-link>
      <router-link to="/journal-activite" class="mainButton button is-large">activité</router-link>
    </div>
    <div class="is-flex is-flex-direction-column is-align-items-center">
      <!-- <button class="button barIcon mb-2 is-info" aria-label="Menu">
        <span class="icon">
          <i class="fas fa-bars" aria-hidden="true"></i>
        </span>
      </button> -->
      <!-- <button class="button bellIcon is-info" aria-label="Notifications">
        <span class="icon">
          <i class="fas fa-bell" aria-hidden="true"></i>
        </span>
      </button> -->
    </div>
  </div>
</template>
<style scoped>
.header {
  background-color: white;
}

.mainButton {
  font-size: 2rem;
  min-height: 100px;
  @media (max-width: 600px) {
    padding: 3rem;
    font-size: 1.5rem;
    max-height: 80px;
  }
  @media (max-width: 480px) {
    padding: 2rem;
    font-size: 1rem;
    max-height: 30px;
    max-width: 100px;
  }
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
