<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  fetchUsers as fetchUsersApi,
  addUserApi,
  deleteUserApi,
  type User,
  fetchChildren as fetchChildrenApi,
  addChildApi,
  deleteChildApi,
  type Child,
} from "../utils/api";
import { fakeUsers, fakeChildren } from "../utils/mockData";

const users = ref<User[]>([]);
const children = ref<Child[]>([]);

const newUser = ref({
  firstname: "",
  lastname: "",
  email: "",
  role: "parent",
  password: "",
});

const newChild = ref<Child>({
  firstname: "",
  lastname: "",
  birthDate: "",
  userId: "",
  userId2: undefined,
});

const isLoading = ref(false);
const isLoadingChild = ref(false);
const errorMsg = ref("");
const errorMsgChild = ref("");
const successMsg = ref("");
const successMsgChild = ref("");
const createSuccessMsg = ref("");
const createSuccessMsgChild = ref("");

const showModal = ref(false);
const showModalChild = ref(false);
const userToDelete = ref<User | null>(null);
const childToDelete = ref<Child | null>(null);
const isDemo = ref(false);

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
    console.error(e.message);
  } finally {
    showModal.value = false;
    userToDelete.value = null;
  }
};

const cancelDeleteUser = () => {
  showModal.value = false;
  userToDelete.value = null;
};

const fetchChildren = async () => {
  try {
    children.value = await fetchChildrenApi();
  } catch (e: any) {
    errorMsgChild.value = e.message;
  }
};

const addChild = async () => {
  isLoadingChild.value = true;
  errorMsgChild.value = "";
  try {
    await addChildApi(newChild.value);
    newChild.value = {
      firstname: "",
      lastname: "",
      birthDate: "",
      userId: "",
      userId2: undefined,
    };
    await fetchChildren();
    createSuccessMsgChild.value = "Enfant créé avec succès";
    setTimeout(() => {
      createSuccessMsgChild.value = "";
    }, 2000);
  } catch (e: any) {
    errorMsgChild.value = e.message;
  } finally {
    isLoadingChild.value = false;
  }
};

const askDeleteChild = (child: Child) => {
  childToDelete.value = child;
  showModalChild.value = true;
};

const confirmDeleteChild = async () => {
  if (!childToDelete.value || !childToDelete.value.idChild) return;
  try {
    await deleteChildApi(childToDelete.value.idChild);
    await fetchChildren();
    successMsgChild.value = "Enfant supprimé avec succès";
    setTimeout(() => {
      successMsgChild.value = "";
    }, 2000);
  } catch (e: any) {
    console.error(e.message);
  } finally {
    showModalChild.value = false;
    childToDelete.value = null;
  }
};

const cancelDeleteChild = () => {
  showModalChild.value = false;
  childToDelete.value = null;
};

const getUserChildren = (userId: string) => {
  return children.value.filter(
    (child) => child.userId === userId || child.userId2 === userId
  );
};

const getChildParents = (child: Child) => {
  const parent1 = users.value.find((u) => u.idUser === child.userId);
  const parent2 = child.userId2
    ? users.value.find((u) => u.idUser === child.userId2)
    : null;

  if (parent1 && parent2) {
    return `${parent1.firstname} ${parent1.lastname} et ${parent2.firstname} ${parent2.lastname}`;
  } else if (parent1) {
    return `${parent1.firstname} ${parent1.lastname}`;
  } else if (parent2) {
    return `${parent2.firstname} ${parent2.lastname}`;
  }
  return "Parent non défini";
};

onMounted(() => {
  isDemo.value = localStorage.getItem("role") === "demo";
  newChild.value.userId = localStorage.getItem("userId") || "";
  fetchUsers();
  fetchChildren();
});
</script>
<template>
  <!-- User section -->
  <div class="user-form-container p-4 mt-2" v-disable-demo>
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

  <!-- Children section -->
  <div class="child-form-container p-4 mt-4" v-disable-demo>
    <p class="mb-4 has-text-weight-bold">Création d'un nouvel enfant</p>
    <form
      class="child-form is-flex is-align-items-center mb-5"
      @submit.prevent="addChild"
    >
      <input v-model="newChild.firstname" placeholder="Prénom" required />
      <input v-model="newChild.lastname" placeholder="Nom" required />
      <input
        v-model="newChild.birthDate"
        placeholder="Date de naissance"
        type="date"
        required
      />
      <select v-model="newChild.userId" required>
        <option value="" disabled selected>Parent 1</option>
        <option
          v-for="user in users.filter((u) => u.role === 'parent')"
          :key="user.idUser"
          :value="user.idUser"
        >
          {{ user.firstname }} {{ user.lastname }}
        </option>
      </select>
      <select v-model="newChild.userId2">
        <option value="">Parent 2</option>
        <option
          v-for="user in users.filter(
            (u) => u.role === 'parent' && u.idUser !== newChild.userId
          )"
          :key="user.idUser"
          :value="user.idUser"
        >
          {{ user.firstname }} {{ user.lastname }}
        </option>
      </select>
      <button type="submit" :disabled="isLoadingChild">Ajouter</button>
      <span v-if="errorMsgChild" class="error ml-3">{{ errorMsgChild }}</span>
    </form>
  </div>

  <!-- User section -->
  <div class="main mt-4" v-disable-demo>
    <div v-if="isDemo" class="demo-info mb-3">
      (liste d'utilisateurs factice)
    </div>
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div
          class="cell"
          v-for="user in isDemo
            ? fakeUsers.map((u, idx) => ({ ...u, idUser: `fake-${idx}` }))
            : users"
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
                  @click="isDemo ? null : askDeleteUser(user)"
                  ><span class="icon"> <i class="fas fa-trash"></i></span>
                </span>
              </div>
              <!-- Display children for parents -->
              <div
                v-if="
                  user.role === 'parent' &&
                  getUserChildren(user.idUser || '').length > 0
                "
              >
                <p class="has-text-weight-bold blue-dark mb-2">
                  {{
                    getUserChildren(user.idUser || "").length === 1
                      ? "Enfant :"
                      : "Enfants :"
                  }}
                </p>
                <div
                  v-for="child in getUserChildren(user.idUser || '')"
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
  <!-- Children section -->
  <div class="main mt-4" v-disable-demo>
    <div v-if="isDemo" class="demo-info mb-3">(liste d'enfants factice)</div>
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div
          class="cell"
          v-for="child in isDemo
            ? fakeChildren.map((c, idx) => ({ ...c, idChild: `fake-${idx}` }))
            : children"
          :key="child.idChild"
        >
          <div class="card">
            <div
              class="card-header is-flex is-align-items-center is-justify-content-space-between has-text-weight-semibold"
            >
              <div class="card-header-title pl-4">
                <p class="firstname pr-4">{{ child.firstname }}</p>
                <p>{{ child.lastname }}</p>
              </div>
              <p class="birth-date pr-4">{{ child.birthDate }}</p>
            </div>
            <div class="card-content">
              <div
                class="content has-text-weight-semibold is-flex is-align-items-center is-justify-content-space-between"
              >
                <p class="mr-2">{{ child.firstname }} {{ child.lastname }}</p>
                <span
                  class="button is-danger is-outlined"
                  title="Supprimer l'enfant"
                  @click="isDemo ? null : askDeleteChild(child)"
                  ><span class="icon"> <i class="fas fa-trash"></i></span>
                </span>
              </div>
              <div class="mt-2">
                <p class="is-size-6">
                  <strong class="blue-dark"
                    >Parents : {{ getChildParents(child) }}</strong
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- User modals -->
  <div
    v-if="showModal"
    class="modal-overlay is-flex is-justify-content-center is-align-items-center"
    v-disable-demo
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
    v-disable-demo
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
    v-disable-demo
  >
    <div
      class="modal-box success-modal has-text-centered has-text-weight-bold py-6 px-5"
    >
      {{ createSuccessMsg }}
    </div>
  </div>

  <!-- Children modals -->
  <div
    v-if="showModalChild"
    class="modal-overlay is-flex is-justify-content-center is-align-items-center"
    v-disable-demo
  >
    <div class="modal-box has-text-centered py-6 px-5">
      <h3>Suppression d'enfant</h3>
      <p>
        Voulez-vous vraiment supprimer l'enfant
        <b>{{ childToDelete?.firstname }} {{ childToDelete?.lastname }}</b> ?
      </p>
      <div class="is-flex is-justify-content-space-between mt-5 gap-4">
        <button class="btn-cancel" @click="cancelDeleteChild">Annuler</button>
        <button class="btn-confirm" @click="confirmDeleteChild">
          Supprimer
        </button>
      </div>
    </div>
  </div>
  <div
    v-if="successMsgChild"
    class="modal-overlay is-flex is-justify-content-center is-align-items-center"
    v-disable-demo
  >
    <div
      class="modal-box success-modal has-text-centered has-text-weight-bold py-6 px-5"
    >
      {{ successMsgChild }}
    </div>
  </div>
  <div
    v-if="createSuccessMsgChild"
    class="modal-overlay is-flex is-justify-content-center is-align-items-center"
    v-disable-demo
  >
    <div
      class="modal-box success-modal has-text-centered has-text-weight-bold py-6 px-5"
    >
      {{ createSuccessMsgChild }}
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

.cell {
  padding: 1%;
}
</style>
