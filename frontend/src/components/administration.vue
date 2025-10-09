<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getRole, getUserId } from "../utils/auth";
import UserFormSection from "./UserFormSection.vue";
import ChildFormSection from "./ChildFormSection.vue";
import UserListSection from "./UserListSection.vue";
import ChildListSection from "./ChildListSection.vue";
import {
  fetchUsers as fetchUsersApi,
  addUserApi,
  deleteUserApi,
  resetUserPasswordApi,
  type User,
  fetchChildren as fetchChildrenApi,
  addChildApi,
  deleteChildApi,
  type Child,
  fetchSections as fetchSectionsApi,
  addChildSectionApi,
  fetchChildSections as fetchChildSectionsApi,
  type Section,
  type ChildSection,
} from "../utils/api";
import {
  fakeUsers,
  fakeChildren,
  fakeSections,
  fakeChildSections,
} from "../utils/mock-data";
import { capitalizeFirstLetter } from "../utils/capitalize";

const users = ref<User[]>([]);
const children = ref<Child[]>([]);
const sections = ref<Section[]>([]);
const childSections = ref<ChildSection[]>([]);
const selectedSectionId = ref<string>("");

const newUser = ref({
  firstname: "",
  lastname: "",
  email: "",
  role: "parent",
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
const generatedPassword = ref("");
const createSuccessMsgChild = ref("");

const showModal = ref(false);
const showModalChild = ref(false);
const showResetModal = ref(false);
const userToDelete = ref<User | null>(null);
const userToReset = ref<User | null>(null);
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
    newUser.value.firstname = capitalizeFirstLetter(
      newUser.value.firstname || ""
    );
    newUser.value.lastname = capitalizeFirstLetter(
      newUser.value.lastname || ""
    );
    const result = await addUserApi(newUser.value);
    generatedPassword.value = result?.initialPassword || "";
    newUser.value = {
      firstname: "",
      lastname: "",
      email: "",
      role: "parent",
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

const onResetPassword = async (user: User) => {
  if (!user.idUser) return;
  try {
    const { initialPassword } = await resetUserPasswordApi(user.idUser);
    generatedPassword.value = initialPassword;
    userToReset.value = user;
    showResetModal.value = true;
  } catch (e: any) {
    errorMsg.value = e.message || "Erreur lors de la réinitialisation";
  }
};

const closeResetModal = () => {
  showResetModal.value = false;
  generatedPassword.value = "";
  userToReset.value = null;
};

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(generatedPassword.value);
    successMsg.value = "Mot de passe copié";
    setTimeout(() => (successMsg.value = ""), 1500);
  } catch {}
};

const fetchChildren = async () => {
  try {
    children.value = await fetchChildrenApi();
  } catch (e: any) {
    errorMsgChild.value = e.message;
  }
};

const fetchSections = async () => {
  try {
    sections.value = await fetchSectionsApi();
  } catch (e: any) {
    console.error("Erreur lors du fetch des sections:", e);
  }
};

const fetchChildSections = async () => {
  try {
    childSections.value = await fetchChildSectionsApi();
  } catch (e: any) {
    console.error("Erreur lors du fetch des associations enfant-section:", e);
  }
};

const addChild = async () => {
  isLoadingChild.value = true;
  errorMsgChild.value = "";
  try {
    newChild.value.firstname = capitalizeFirstLetter(
      newChild.value.firstname || ""
    );
    newChild.value.lastname = capitalizeFirstLetter(
      newChild.value.lastname || ""
    );
    const createdChild = await addChildApi(newChild.value);
    if (selectedSectionId.value) {
      await addChildSectionApi({
        childId: createdChild.idChild,
        sectionName: selectedSectionId.value,
      });
    }
    newChild.value = {
      firstname: "",
      lastname: "",
      birthDate: "",
      userId: "",
      userId2: undefined,
    };
    selectedSectionId.value = "";
    await fetchChildren();
    await fetchChildSections();
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

const getChildSection = (childId: string) => {
  if (isDemo.value) {
    const childSection = fakeChildSections.find((cs) => cs.childId === childId);
    if (childSection && childSection.sectionName) {
      return { name: childSection.sectionName };
    }
  } else {
    const childSection = childSections.value.find(
      (cs) => cs.childId === childId
    );
    if (childSection && childSection.sectionId) {
      return { name: childSection.sectionId };
    }
  }
  return { name: "" };
};

const getUserChildren = (userId: string) => {
  if (isDemo.value) {
    return fakeChildren.filter(
      (child) => child.userId === userId || child.userId2 === userId
    );
  }
  return children.value.filter(
    (child) => child.userId === userId || child.userId2 === userId
  );
};

const getChildParents = (child: Child) => {
  let parent1, parent2;

  if (isDemo.value) {
    parent1 = fakeUsers.find((u) => u.idUser === child.userId);
    parent2 = child.userId2
      ? fakeUsers.find((u) => u.idUser === child.userId2)
      : null;
  } else {
    parent1 = users.value.find((u) => u.idUser === child.userId);
    parent2 = child.userId2
      ? users.value.find((u) => u.idUser === child.userId2)
      : null;
  }

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
  const role = getRole();
  isDemo.value = role === "demo";

  newChild.value.userId = getUserId();
  fetchUsers();
  fetchChildren();
  fetchSections();
  fetchChildSections();
});
</script>
<template>
  <UserFormSection
    :newUser="newUser"
    :isLoading="isLoading"
    :errorMsg="errorMsg"
    :createSuccessMsg="createSuccessMsg"
    @addUser="addUser"
  />
  <ChildFormSection
    :newChild="newChild"
    :isLoadingChild="isLoadingChild"
    :errorMsgChild="errorMsgChild"
    :createSuccessMsgChild="createSuccessMsgChild"
    :users="users"
    :selectedSectionId="selectedSectionId"
    @addChild="addChild"
    @update:selectedSectionId="selectedSectionId = $event"
  />
  <UserListSection
    :users="users"
    :isDemo="isDemo"
    :fakeUsers="fakeUsers"
    :getUserChildren="getUserChildren"
    :askDeleteUser="askDeleteUser"
    :onResetPassword="onResetPassword"
  />
  <ChildListSection
    :children="children"
    :isDemo="isDemo"
    :fakeChildren="fakeChildren"
    :getChildParents="getChildParents"
    :getChildSection="getChildSection"
    :askDeleteChild="askDeleteChild"
  />
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
  <!-- Reset password modal -->
  <div
    v-if="showResetModal"
    class="modal-overlay is-flex is-justify-content-center is-align-items-center"
    v-disable-demo
  >
    <div class="modal-box has-text-centered py-6 px-5">
      <h3>Mot de passe réinitialisé</h3>
      <p class="mt-3">
        Utilisateur: <b>{{ userToReset?.email }}</b>
      </p>
      <p class="mt-2">
        Nouveau mot de passe:
        <code style="user-select: all">{{ generatedPassword }}</code>
      </p>
      <div class="is-flex is-justify-content-space-between mt-5 gap-4">
        <button class="btn-cancel" @click="closeResetModal">Fermer</button>
        <button class="btn-confirm" @click="copyPassword">Copier</button>
      </div>
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
</style>
