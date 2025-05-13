<script setup lang="ts"></script>

<template>
  <div class="box m-2">
    <ul>
      <li>
        <router-link
          to="/galerie-photo"
          class="button is-fullwidth is-outlined my-2 has-background-white has-background-white"
        >
          Galerie photo
        </router-link>
      </li>
      <li>
        <router-link
          to="/galerie-photo"
          class="button is-fullwidth is-outlined my-2 has-background-white"
          >Journal d'activité</router-link
        >
      </li>
      <li>
        <router-link
          to="/galerie-photo"
          class="button is-fullwidth is-outlined my-2 has-background-white"
          >Messagerie</router-link
        >
      </li>
      <li>
        <router-link
          to="/galerie-photo"
          class="button is-fullwidth is-outlined my-2 has-background-white"
          >Paramètres</router-link
        >
      </li>
      <li>
        <router-link
          to="/galerie-photo"
          class="button is-fullwidth is-outlined my-2 has-background-white"
          >Déconnexion</router-link
        >
      </li>
    </ul>
  </div>
  <router-link to="/">Hello world</router-link>
</template>

<style scoped>
.box {
  background-color: #b2c3df;
  color: #5a95f4;
  width: 350px;
  height: 1024px;
}
.button {
  color: #5a95f4;
}
</style>
