<script setup lang="ts">
import { ref, onMounted } from "vue";
const role = ref<string | null>(null);
onMounted(() => {
  role.value = localStorage.getItem("role");
});
</script>

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
        <li
          v-if="role === 'admin' || role === 'nurseryStaff' || role === 'demo'"
        >
          <router-link
            to="/ajout-photo"
            class="button is-fullwidth is-outlined is-danger my-4 p-3 has-background-white is-justify-content-space-between"
          >
            <span class="icon-danger">
              <i class="fas fa-upload"></i>
            </span>
            Ajouter des photos
            <span class="icon-danger">
              <i class="fas fa-arrow-right"></i>
            </span>
          </router-link>
        </li>
        <li
          v-if="role === 'admin' || role === 'nurseryStaff' || role === 'demo'"
        >
          <router-link
            to="/ajout-activite"
            class="button is-fullwidth is-outlined is-danger my-4 p-3 has-background-white is-justify-content-space-between"
          >
            <span class="icon-danger">
              <i class="fas fa-pen-fancy"></i>
            </span>
            Ecrire une activité
            <span class="icon-danger">
              <i class="fas fa-arrow-right"></i>
            </span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="">
      <ul>
        <li v-if="role === 'admin' || role === 'demo'">
          <router-link
            to="/administration"
            class="button is-fullwidth is-outlined is-danger my-4 p-3 has-background-white is-justify-content-space-between"
          >
            <span class="icon-danger">
              <i class="fas fa-gear"></i>
            </span>
            Administration
            <span class="icon-danger">
              <i class="fas fa-arrow-right"></i>
            </span>
          </router-link>
        </li>
        <li class="">
          <router-link
            to="/easter-egg"
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
.icon-danger {
  color: red;
}
.button.is-fullwidth {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  min-width: 0;
  overflow: hidden;
}
.button.is-fullwidth span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 500px) {
  .box {
    max-width: 100vw;
    height: auto;
  }
  .button.is-fullwidth {
    font-size: 0.95em;
    padding: 0.5em 0.7em;
  }
}
</style>
