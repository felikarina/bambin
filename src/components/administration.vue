<script setup lang="ts">
import { ref, onMounted } from "vue";
interface User {
  id_user?: number;
  firstname?: string;
  lastname?: string;
  role?: string;
  email?: string;
}
const users = ref<User[]>([]);

const fetchUsers = async () => {
  const response = await fetch("/api/users");
  const data = await response.json();
  users.value = data;
};

onMounted(fetchUsers);
</script>
<template>
  <div class="main">
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div class="cell" v-for="user in users" :key="user.id_user">
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
              <div class="content has-text-weight-semibold">
                <p>{{ user.email }}</p>
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
  border: 2px solid red;
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
</style>
