<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { Child, User } from "../utils/api";

const props = defineProps<{
  newChild: Child;
  isLoadingChild: boolean;
  errorMsgChild: string;
  createSuccessMsgChild: string;
  users: User[];
  selectedSectionId: string;
}>();
const emit = defineEmits([
  "update:newChild",
  "addChild",
  "update:selectedSectionId",
]);

const handleSectionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (target) {
    emit("update:selectedSectionId", target.value);
  }
};
</script>
<template>
  <div class="child-form-container p-4 mt-4" v-disable-demo>
    <p class="mb-4 has-text-weight-bold">Création d'un nouvel enfant</p>
    <form
      class="child-form is-flex is-align-items-center mb-5"
      @submit.prevent="$emit('addChild')"
    >
      <input v-model="props.newChild.firstname" placeholder="Prénom" required />
      <input v-model="props.newChild.lastname" placeholder="Nom" required />
      <input
        v-model="props.newChild.birthDate"
        placeholder="Date de naissance"
        type="date"
        required
      />
      <select v-model="props.newChild.userId" required>
        <option value="" disabled selected>Parent 1</option>
        <option
          v-for="user in props.users.filter((u) => u.role === 'parent')"
          :key="user.idUser"
          :value="user.idUser"
        >
          {{ user.firstname }} {{ user.lastname }}
        </option>
      </select>
      <select v-model="props.newChild.userId2">
        <option value="">Parent 2</option>
        <option
          v-for="user in props.users.filter(
            (u) => u.role === 'parent' && u.idUser !== props.newChild.userId
          )"
          :key="user.idUser"
          :value="user.idUser"
        >
          {{ user.firstname }} {{ user.lastname }}
        </option>
      </select>
      <select :value="props.selectedSectionId" @change="handleSectionChange">
        <option value="" disabled selected>Sélectionner une section</option>
        <option value="petit">Petit</option>
        <option value="moyen">Moyen</option>
        <option value="grand">Grand</option>
      </select>
      <button type="submit" :disabled="props.isLoadingChild">Ajouter</button>
      <span v-if="props.errorMsgChild" class="error ml-3">{{
        props.errorMsgChild
      }}</span>
    </form>
    <div
      v-if="props.createSuccessMsgChild"
      class="modal-box success-modal has-text-centered has-text-weight-bold py-6 px-5"
    >
      {{ props.createSuccessMsgChild }}
    </div>
  </div>
</template>

<style scoped>
.child-form-container {
  background-color: var(--blue-light);
  border-radius: 12px;
  border: 2px solid orange;
}

.child-form {
  flex-wrap: wrap;
  gap: 8px;
}
.child-form input,
.child-form select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 120px;
  flex: 1 1 160px;
  box-sizing: border-box;
}
.child-form button {
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
.child-form .error {
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
