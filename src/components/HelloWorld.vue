<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

interface Tab {
  name: string;
  icon: string;
  route: string;
}

const tabs = ref<Tab[]>([
  { name: "Galerie photo", icon: "fas fa-image", route: "/galerie-photo" },
  {
    name: "Journal d'activité",
    icon: "fas fa-pen-to-square",
    route: "/journal-activite",
  },
  { name: "connexion", icon: "fas fa-power-off", route: "/" },
]);

const route = useRoute();
</script>

<template>
  <div class="home is-flex is-flex-direction-column is-align-items-center mt-6">
    <div class="tabs is-toggle is-fullwidth">
      <ul>
        <li
          v-for="tab in tabs"
          :key="tab.name"
          :class="{ 'is-active': route.path === tab.route }"
        >
          <router-link :to="tab.route">
            <span class="icon is-small">
              <i :class="tab.icon" aria-hidden="true"></i>
            </span>
            <span>{{ tab.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="card my-4">
      <div class="card-image">
        <p class="card-header-title">chat poulpe</p>
        <figure class="image is-16by9">
          <img src="@/assets/chatpoulpe.jpg" alt="Placeholder image" />
        </figure>
      </div>
      <div class="card-content">
        <div class="content">
          Hello world.
          <br />
          <time datetime="2016-1-1">14:50 - 16 Mai 2025</time>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 50%;
  box-shadow: 0px 0px 62px rgba(0, 0, 0, 0.6);
}

.tabs li a {
  color: green;
}

.tabs li a:hover {
  background-color: #98e198;
}
</style>
