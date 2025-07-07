<script setup lang="ts">
import { defineProps } from "vue";
import type { User } from "../utils/api";

const props = defineProps<{
  newUser: User;
  isLoading: boolean;
  errorMsg: string;
  createSuccessMsg: string;
}>();
const emit = defineEmits(["update:newUser", "addUser"]);
</script>
<template>
  <div class="user-form-container p-4 mt-2" v-disable-demo>
    <p class="mb-4 has-text-weight-bold">Création d'un nouvel utilisateur</p>
    <form
      class="user-form is-flex is-align-items-center mb-5"
      @submit.prevent="$emit('addUser')"
    >
      <input v-model="props.newUser.firstname" placeholder="Prénom" required />
      <input v-model="props.newUser.lastname" placeholder="Nom" required />
      <input
        v-model="props.newUser.email"
        placeholder="Email"
        type="email"
        required
      />
      <select v-model="props.newUser.role" required>
        <option value="" disabled selected>Sélectionner un rôle</option>
        <option value="parent">Parent</option>
        <option value="admin">Admin</option>
        <option value="nurseryStaff">Personnel</option>
      </select>
      <input
        v-model="props.newUser.password"
        placeholder="Mot de passe"
        type="password"
        required
      />
      <button type="submit" :disabled="props.isLoading">Ajouter</button>
      <span v-if="props.errorMsg" class="error ml-3">{{ props.errorMsg }}</span>
    </form>
    <div
      v-if="props.createSuccessMsg"
      class="modal-box success-modal has-text-centered has-text-weight-bold py-6 px-5"
    >
      {{ props.createSuccessMsg }}
    </div>
  </div>
</template>

<style scoped>
.user-form-container {
  background-color: var(--blue-light);
  border-radius: 12px;
  border: 2px solid red;
}

.user-form {
  flex-wrap: wrap;
  gap: 8px;
}
.user-form input,
.user-form select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 120px;
  flex: 1 1 160px;
  box-sizing: border-box;
}
.user-form button {
  background: var(--primary, #5a95f4);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  cursor: pointer;
  flex: 1 1 120px;
  min-width: 120px;
  box-sizing: border-box;
}
.user-form .error {
  color: red;
}

.success-modal {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 10px;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  font-size: 1.1em;
}
</style>

<script lang="ts">
export default {};
</script>
