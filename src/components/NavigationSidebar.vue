<script setup lang="ts"></script>

<template>
  <div
    class="box m-2 full-height is-flex is-flex-direction-column is-justify-content-space-between"
  >
    <div class="">
      <ul>
        <li>
          <router-link
            to="/galerie-photo"
            class="button is-fullwidth is-outlined is-link mb-4 p-3 has-background-white is-justify-content-space-between"
          >
            <span class="icon">
              <i class="fas fa-image"></i>
            </span>
            Galerie photo
            <span class="icon">
              <i class="fas fa-arrow-right"></i>
            </span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/journal-activite"
            class="button is-fullwidth is-outlined is-link my-4 p-3 has-background-white is-justify-content-space-between"
          >
            <span class="icon">
              <i class="fas fa-pen-to-square"></i>
            </span>
            Journal d'activité
            <span class="icon">
              <i class="fas fa-arrow-right"></i>
            </span>
          </router-link>
        </li>
        <!-- <li>
          <router-link
            to="/galerie-photo"
            class="button is-fullwidth is-outlined is-link my-4 p-3 has-background-white is-justify-content-space-between"
          >
            <span class="icon">
              <i class="fas fa-envelope"></i>
            </span>
            Messagerie
            <span class="icon">
              <i class="fas fa-arrow-right"></i>
            </span>
          </router-link>
        </li> -->
      </ul>
    </div>
    <div class="">
      <ul>
        <!-- <li>
          <router-link
            to="/galerie-photo"
            class="button is-fullwidth is-outlined is-link my-4 p-3 has-background-white is-justify-content-space-between"
          >
            <span class="icon">
              <i class="fas fa-gear"></i>
            </span>
            Paramètres
            <span class="icon">
              <i class="fas fa-arrow-right"></i>
            </span>
          </router-link>
        </li> -->
        <li class="">
          <router-link
            to="/"
            class="button is-fullwidth is-outlined is-link mt-4 p-3 has-background-white is-justify-content-space-between"
          >
            <span class="icon">
              <i class="fas fa-power-off"></i>
            </span>
            Déconnexion
            <span class="icon">
              <i class="fas fa-arrow-right"></i>
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.box {
  background-color: #b2c3df;
  color: #5a95f4;
  max-width: 350px;
  height: 98vh;
}
.icon {
  color: #5a95f4;
}
</style>
