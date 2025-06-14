<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  fetchUsers as fetchUsersApi,
  addUserApi,
  deleteUserApi,
  type User,
} from "../utils/api";

const users = ref<User[]>([]);

const newUser = ref({
  firstname: "",
  lastname: "",
  email: "",
  role: "parent",
  password: "",
});
const isLoading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const createSuccessMsg = ref("");

const showModal = ref(false);
const userToDelete = ref<User | null>(null);

const fetchUsers = async () => {
  try {
    users.value = await fetchUsersApi();
  } catch (e: any) {
    errorMsg.value = e.message;
  }
};

const addUser = async () => {
  isLoading.value = true;
  errorMsg.value = "";
  try {
    await addUserApi(newUser.value);
    newUser.value = {
      firstname: "",
      lastname: "",
      email: "",
      role: "parent",
      password: "",
    };
    await fetchUsers();
    createSuccessMsg.value = "Utilisateur créé avec succès";
    setTimeout(() => {
      createSuccessMsg.value = "";
    }, 2000);
  } catch (e: any) {
    errorMsg.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

const askDeleteUser = (user: User) => {
  userToDelete.value = user;
  showModal.value = true;
};

const confirmDeleteUser = async () => {
  if (!userToDelete.value || !userToDelete.value.idUser) return;
  try {
    await deleteUserApi(userToDelete.value.idUser);
    await fetchUsers();
    successMsg.value = "Utilisateur supprimé avec succès";
    setTimeout(() => {
      successMsg.value = "";
    }, 2000);
  } catch (e: any) {
    alert(e.message);
  } finally {
    showModal.value = false;
    userToDelete.value = null;
  }
};

const cancelDeleteUser = () => {
  showModal.value = false;
  userToDelete.value = null;
};

onMounted(fetchUsers);
</script>
<template>
  <div class="user-form-container p-4 mt-2">
    <p class="mb-4 has-text-weight-bold">Création d'un nouvel utilisateur</p>
    <form
      class="user-form is-flex is-align-items-center mb-5"
      @submit.prevent="addUser"
    >
      <input v-model="newUser.firstname" placeholder="Prénom" required />
      <input v-model="newUser.lastname" placeholder="Nom" required />
      <input
        v-model="newUser.email"
        placeholder="Email"
        type="email"
        required
      />
      <select v-model="newUser.role" required>
        <option value="" disabled selected>Sélectionner un rôle</option>
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
      <span v-if="errorMsg" class="error ml-3">{{ errorMsg }}</span>
    </form>
  </div>
  <div class="main mt-4">
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div class="cell" v-for="user in users" :key="user.idUser">
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
                  @click="askDeleteUser(user)"
                  ><span class="icon"> <i class="fas fa-trash"></i></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showModal"
    class="modal-overlay is-flex is-justify-content-center is-align-items-center"
  >
    <div class="modal-box has-text-centered py-6 px-5">
      <h3>Suppression d'utilisateur</h3>
      <p>
        Voulez-vous vraiment supprimer l'utilisateur
        <b>{{ userToDelete?.email }}</b> ?
      </p>
      <div class="is-flex is-justify-content-space-between mt-5 gap-4">
        <button class="btn-cancel" @click="cancelDeleteUser">Annuler</button>
        <button class="btn-confirm" @click="confirmDeleteUser">
          Supprimer
        </button>
      </div>
    </div>
  </div>
  <div
    v-if="successMsg"
    class="modal-overlay is-flex is-justify-content-center is-align-items-center"
  >
    <div
      class="modal-box success-modal has-text-centered has-text-weight-bold py-6 px-5"
    >
      {{ successMsg }}
    </div>
  </div>
  <div
    v-if="createSuccessMsg"
    class="modal-overlay is-flex is-justify-content-center is-align-items-center"
  >
    <div
      class="modal-box success-modal has-text-centered has-text-weight-bold py-6 px-5"
    >
      {{ createSuccessMsg }}
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.modal-box {
  background: white;
  border-radius: 10px;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}

.btn-cancel {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  cursor: pointer;
}
.btn-confirm {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  cursor: pointer;
}
.btn-confirm:hover {
  background: #c0392b;
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
