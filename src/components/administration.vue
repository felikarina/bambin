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

const newUser = ref({
  firstname: "",
  lastname: "",
  email: "",
  role: "",
  password: "",
});
const isLoading = ref(false);
const errorMsg = ref("");

const fetchUsers = async () => {
  const response = await fetch("/api/users");
  const data = await response.json();
  users.value = data;
};

const addUser = async () => {
  isLoading.value = true;
  errorMsg.value = "";
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser.value),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Erreur lors de l'ajout");
    }
    newUser.value = {
      firstname: "",
      lastname: "",
      email: "",
      role: "",
      password: "",
    };
    await fetchUsers();
  } catch (e: any) {
    errorMsg.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchUsers);
</script>
<template>
  <div class="user-form-container p-4 mt-2">
    <form class="user-form" @submit.prevent="addUser">
      <input v-model="newUser.firstname" placeholder="Prénom" required />
      <input v-model="newUser.lastname" placeholder="Nom" required />
      <input
        v-model="newUser.email"
        placeholder="Email"
        type="email"
        required
      />
      <select v-model="newUser.role" required>
        <option value="parent">Parent</option>
        <option value="admin">Admin</option>
        <option value="nurseryStaff">Personnel</option>
      </select>
      <input
        v-model="newUser.password"
        placeholder="Mot de passe"
        type="password"
        required
      />
      <button type="submit" :disabled="isLoading">Ajouter</button>
      <span v-if="errorMsg" class="error">{{ errorMsg }}</span>
    </form>
  </div>
  <div class="main mt-4">
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
  border: 2px solid var(--primary);
}

.user-form-container {
  background-color: var(--blue-light);
  border-radius: 12px;
  border: 2px solid fuchsia;
}

.user-form {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 24px;
}
.user-form input,
.user-form select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.user-form button {
  background: var(--primary, #5a95f4);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  cursor: pointer;
}
.user-form .error {
  color: red;
  margin-left: 12px;
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
