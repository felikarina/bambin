<script setup lang="ts">
import { defineProps } from "vue";
import type { User, Child } from "../utils/api";

const props = defineProps<{
  users: User[];
  isDemo: boolean;
  fakeUsers: User[];
  getUserChildren: (userId: string) => Child[];
  askDeleteUser: (user: User) => void;
}>();
</script>
<template>
  <div class="main mt-4" v-disable-demo>
    <div v-if="props.isDemo" class="demo-info mb-3">
      (liste d'utilisateurs factice)
    </div>
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div
          class="cell"
          v-for="user in props.isDemo ? props.fakeUsers : props.users"
          :key="user.idUser"
        >
          <div class="card">
            <div
              class="card-header is-flex is-align-items-center is-justify-content-space-between has-text-weight-semibold"
            >
              <div class="card-header-title pl-4">
                <p class="firstname pr-4">{{ user.firstname }}</p>
                <p>{{ user.lastname }}</p>
              </div>
              <p class="role pr-4">{{ user.role }}</p>
            </div>
            <div class="card-content">
              <div
                class="content has-text-weight-semibold is-flex is-align-items-center is-justify-content-space-between"
              >
                <p class="mr-2">{{ user.email }}</p>
                <span
                  class="button is-danger is-outlined"
                  title="Supprimer l'utilisateur"
                  @click="props.isDemo ? null : props.askDeleteUser(user)"
                  ><span class="icon"> <i class="fas fa-trash"></i></span>
                </span>
              </div>
              <div
                v-if="
                  user.role === 'parent' &&
                  props.getUserChildren(user.idUser || '').length > 0
                "
              >
                <p class="has-text-weight-bold blue-dark mb-2">
                  {{
                    props.getUserChildren(user.idUser || "").length === 1
                      ? "Enfant :"
                      : "Enfants :"
                  }}
                </p>
                <div
                  v-for="child in props.getUserChildren(user.idUser || '')"
                  :key="child.idChild"
                  class="ml-3 mb-1"
                >
                  <p class="is-size-6 blue-dark has-text-weight-bold">
                    {{ child.firstname }} {{ child.lastname }} -
                    {{ child.birthDate }}
                  </p>
                </div>
              </div>
              <div v-else-if="user.role === 'parent'">
                <p class="is-size-7 has-text-grey">Aucun enfant enregistré</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  background-color: var(--blue-lighter);
  border-radius: 20px;
  border: 2px solid var(--primary);
}

.cell {
  padding: 1%;
}

.card {
  background-color: var(--blue-light);
}

.card-content {
  background-color: white;
}

.card-content h1 {
  color: var(--primary);
}

p {
  color: black;
}

.firstname {
  color: rgb(89, 89, 89);
}

.role {
  color: var(--primary);
}

.demo-info {
  background: #e3f1ff;
  color: #2563eb;
  text-align: center;
  border-radius: 12px;
  padding: 8px 0;
  font-weight: 500;
  margin-bottom: 16px;
}

.blue-dark {
  color: var(--primary);
}
</style>

<script lang="ts">
export default {};
</script>
