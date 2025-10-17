<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { formattedDate } from "../utils/formatted-date";
import { capitalizeFirstLetter } from "../utils/capitalize";
import {
  fetchActivities,
  addActivityApi,
  deleteActivityApi,
  updateActivityApi,
  fetchSections,
  fetchSectionActivities,
  type Activity,
  type Section,
  type SectionActivity,
} from "../utils/api";

const activities = ref<Activity[]>([]);
const sections = ref<Section[]>([]);
const activityToSection = ref<Record<string, string | undefined>>({});

const fetchActivitiesAndSet = async () => {
  try {
    activities.value = await fetchActivities();
    sections.value = await fetchSections();
    const allSectionActivities: SectionActivity[] =
      await fetchSectionActivities();
    activityToSection.value = {};
    allSectionActivities.forEach((sa) => {
      if (sa.activityId)
        activityToSection.value[String(sa.activityId)] = sa.sectionId;
    });
  } catch (e: any) {
    console.error("Error fetching activities:", e.message);
  }
};

function getSectionNameForActivity(activityId?: string | number) {
  if (!activityId) return null;
  const sectionId = activityToSection.value[String(activityId)];
  if (!sectionId) return "aucun";
  const section = sections.value.find(
    (s) => String(s.idSection) === String(sectionId)
  );
  return section?.name || sectionId;
}

onMounted(fetchActivitiesAndSet);
const date = ref("");
const titre = ref("");
const description = ref("");
const category = ref("");
const message = ref("");
const loading = ref(false);
const userId = ref("");
const userRole = ref("");
const showModal = ref(false);
const showModalDelete = ref(false);
const activityToDelete = ref<Activity | null>(null);
const successMsg = ref("");
const section = ref("");
const editingActivityId = ref<string | number | null>(null);
const editFields = ref({
  date: "",
  titre: "",
  description: "",
  category: "",
  section: "",
});

function editActivity(activity: Activity) {
  editingActivityId.value = activity.idActivity ?? null;
  editFields.value = {
    date: activity.date || "",
    titre: activity.title || "",
    description: activity.description || "",
    category: activity.category || "",
    section: activityToSection.value[String(activity.idActivity)] || "",
  };
}

async function saveEditActivity(activity: Activity) {
  if (!editingActivityId.value) return;
  if (
    !editFields.value.titre ||
    !editFields.value.date ||
    !editFields.value.description ||
    !editFields.value.category
  ) {
    message.value = "Tous les champs obligatoires doivent être remplis.";
    return;
  }
  loading.value = true;
  try {
    await updateActivityApi(editingActivityId.value, {
      title: capitalizeFirstLetter(editFields.value.titre),
      date: editFields.value.date,
      description: editFields.value.description,
      category: editFields.value.category,
      section: editFields.value.section || undefined,
      userId: activity.userId,
    });
    await fetchActivitiesAndSet();
    editingActivityId.value = null;
    message.value = "";
    successMsg.value = "Activité modifiée avec succès";
    setTimeout(() => {
      successMsg.value = "";
    }, 2000);
  } catch (err: any) {
    message.value = err.message || "Erreur lors de la modification.";
  } finally {
    loading.value = false;
  }
}

function cancelEditActivity() {
  editingActivityId.value = null;
}
const errors = ref({
  date: "",
  titre: "",
  description: "",
  category: "",
  section: "",
});

onMounted(() => {
  userId.value = localStorage.getItem("userId") || "";
  userRole.value = localStorage.getItem("role") || "";
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  date.value = `${yyyy}-${mm}-${dd}`;
});

watch(date, (val) => {
  if (val && errors.value.date) errors.value.date = "";
});
watch(titre, (val) => {
  if (val && errors.value.titre) errors.value.titre = "";
});
watch(description, (val) => {
  if (val && errors.value.description) errors.value.description = "";
});
watch(category, (val) => {
  if (val && errors.value.category) errors.value.category = "";
});
watch(section, (val) => {
  if (val && errors.value.section) errors.value.section = "";
});

async function submitActivity() {
  errors.value = {
    date: "",
    titre: "",
    description: "",
    category: "",
    section: "",
  };
  let hasError = false;
  if (!date.value) {
    errors.value.date = "Veuillez choisir une date";
    hasError = true;
  }
  if (!titre.value) {
    errors.value.titre = "Veuillez saisir un titre";
    hasError = true;
  }
  if (!description.value) {
    errors.value.description = "Veuillez saisir une description";
    hasError = true;
  }
  if (!category.value) {
    errors.value.category = "Veuillez choisir une catégorie";
    hasError = true;
  }
  if (hasError) return;
  loading.value = true;
  try {
    // Capitalize the first letter of the title before sending
    titre.value = capitalizeFirstLetter(titre.value);
    await addActivityApi({
      date: date.value,
      title: titre.value,
      description: description.value,
      category: category.value,
      section: section.value || undefined,
      userId: userId.value,
    } as any);
    await fetchActivitiesAndSet();
    showModal.value = true;
    date.value = "";
    titre.value = "";
    description.value = "";
    category.value = "";
    section.value = "";
    setTimeout(() => {
      showModal.value = false;
    }, 2000);
  } catch (err: any) {
    message.value = err.message || "Erreur lors de la création de l'activité.";
  } finally {
    loading.value = false;
  }
}

const filteredActivities = computed(() => {
  return activities.value
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date ?? "1970-01-01").getTime() -
        new Date(a.date ?? "1970-01-01").getTime()
    );
});

const askDeleteActivity = (activity: Activity) => {
  activityToDelete.value = activity;
  showModalDelete.value = true;
};

const cancelDeleteActivity = () => {
  showModalDelete.value = false;
  activityToDelete.value = null;
};

const confirmDeleteActivity = async () => {
  if (!activityToDelete.value || !activityToDelete.value.idActivity) return;
  try {
    await deleteActivityApi(String(activityToDelete.value.idActivity));
    await fetchActivitiesAndSet();
    successMsg.value = "Activité supprimée avec succès";
    setTimeout(() => {
      successMsg.value = "";
    }, 2000);
  } catch (e: any) {
    console.error(e.message);
  } finally {
    showModalDelete.value = false;
    activityToDelete.value = null;
  }
};
</script>
<template>
  <div class="gallery mt-4" v-bind="$attrs">
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div class="cell">
          <div class="card">
            <div class="card-header">
              <p class="card-header-title">Créer une activité</p>
            </div>
            <div class="card-content">
              <div class="content has-text-weight-semibold">
                <label for="date">Date :</label>
                <span v-if="errors.date" class="error-message">
                  {{ errors.date }}
                </span>
                <input
                  name="date"
                  id="date"
                  type="date"
                  v-model="date"
                  class="input mb-2"
                />
                <label for="titre">Titre :</label>
                <span v-if="errors.titre" class="error-message">
                  {{ errors.titre }}
                </span>
                <input
                  name="titre"
                  id="titre"
                  type="text"
                  v-model="titre"
                  class="input mb-2"
                  placeholder="Titre de l'activité"
                />
                <label for="description">Description :</label>
                <span v-if="errors.description" class="error-message">
                  {{ errors.description }}
                </span>
                <textarea
                  name="description"
                  id="description"
                  v-model="description"
                  class="textarea mb-2"
                  placeholder="Description de l'activité"
                ></textarea>
                <label for="category">Catégorie :</label>
                <span v-if="errors.category" class="error-message">
                  {{ errors.category }}
                </span>
                <select
                  name="categorie"
                  id="category"
                  v-model="category"
                  class="input mb-2"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="motricité">Motricité</option>
                  <option value="artistique">Artistique</option>
                  <option value="lecture">Lecture</option>
                  <option value="sortie">Sortie</option>
                  <option value="autre">Autre</option>
                </select>
                <label for="section">Section (optionnel) :</label>
                <select
                  name="section"
                  id="section"
                  v-model="section"
                  class="input mb-2"
                >
                  <option value="">Aucune section</option>
                  <option value="petit">Petit</option>
                  <option value="moyen">Moyen</option>
                  <option value="grand">Grand</option>
                </select>
                <button
                  class="button is-primary mt-2"
                  :disabled="loading"
                  @click="submitActivity"
                >
                  {{ loading ? "Création..." : "Créer" }}
                </button>
                <div v-if="message" class="mt-2">{{ message }}</div>
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
      <div
        class="modal-box success-modal has-text-centered has-text-weight-bold py-6 px-5"
      >
        Activité ajoutée au journal
      </div>
    </div>
  </div>
  <div class="gallery mt-4">
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <p class="p-2 has-text-weight-bold has-text-centered">
          Liste des activités inscrites dans le journal
        </p>
        <div
          class="cell"
          v-for="activity in filteredActivities"
          :key="activity.idActivity"
        >
          <div class="card">
            <div class="card-header">
              <div
                class="card-header-title is-flex is-justify-content-space-between is-align-items-center"
              >
                <p>{{ formattedDate(activity.date) }}</p>
                <p>#{{ activity.category }}</p>
              </div>
            </div>
            <div class="card-content">
              <div class="content has-text-weight-semibold">
                <div
                  class="is-flex is-justify-content-space-between is-align-items-center"
                >
                  <template v-if="editingActivityId === activity.idActivity">
                    <input
                      class="input mr-2"
                      v-model="editFields.titre"
                      type="text"
                      style="max-width: 220px"
                    />
                  </template>
                  <template v-else>
                    <h1>{{ activity.title }}</h1>
                  </template>
                  <div class="is-flex is-align-items-center">
                    <template v-if="editingActivityId === activity.idActivity">
                      <span
                        class="button is-success is-outlined mr-2"
                        title="Valider la modification"
                        @click="saveEditActivity(activity)"
                      >
                        <span class="icon"> <i class="fas fa-check"></i></span>
                      </span>
                      <span
                        class="button is-warning is-outlined mr-2"
                        title="Annuler"
                        @click="cancelEditActivity"
                      >
                        <span class="icon"> <i class="fas fa-times"></i></span>
                      </span>
                    </template>
                    <template v-else>
                      <span
                        class="button is-info is-outlined mr-2"
                        title="Éditer l'activité"
                        @click="editActivity(activity)"
                      >
                        <span class="icon"> <i class="fas fa-edit"></i></span>
                      </span>
                    </template>
                    <span
                      class="button is-danger is-outlined"
                      title="Supprimer l'activité"
                      @click="askDeleteActivity(activity)"
                    >
                      <span class="icon"> <i class="fas fa-trash"></i></span>
                    </span>
                  </div>
                </div>
                <template v-if="editingActivityId === activity.idActivity">
                  <textarea
                    class="textarea mb-2 mt-2"
                    v-model="editFields.description"
                    style="min-height: 60px"
                  ></textarea>
                  <div class="is-flex mb-2 mt-2" style="gap: 10px">
                    <input
                      class="input"
                      v-model="editFields.date"
                      type="date"
                    />
                    <select
                      id="category"
                      class="input"
                      v-model="editFields.category"
                    >
                      <option value="">Catégorie</option>
                      <option value="motricité">Motricité</option>
                      <option value="artistique">Artistique</option>
                      <option value="lecture">Lecture</option>
                      <option value="sortie">Sortie</option>
                      <option value="autre">Autre</option>
                    </select>
                    <select
                      id="section"
                      class="input"
                      v-model="editFields.section"
                    >
                      <option value="">Aucune section</option>
                      <option value="petit">Petit</option>
                      <option value="moyen">Moyen</option>
                      <option value="grand">Grand</option>
                    </select>
                  </div>
                </template>
                <template v-else>
                  <p class="description-text">{{ activity.description }}</p>
                  <div class="section-tag-bottom">
                    Section :
                    {{ getSectionNameForActivity(activity.idActivity) }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showModalDelete"
    class="modal-overlay is-flex is-justify-content-center is-align-items-center"
  >
    <div class="modal-box has-text-centered py-6 px-5">
      <h3>Suppression d'activité</h3>
      <p>Voulez-vous vraiment supprimer l'activité ?</p>
      <div class="is-flex is-justify-content-space-between mt-5 gap-4">
        <button class="btn-cancel" @click="cancelDeleteActivity">
          Annuler
        </button>
        <button class="btn-confirm" @click="confirmDeleteActivity">
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
</template>
<style scoped>
.gallery {
  background-color: var(--blue-lighter);
  border-radius: 20px;
}
.cell {
  padding: 2%;
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
.content {
  color: black;
}
p {
  color: black;
}
input,
textarea {
  background-color: var(--blue-light);
  color: black;
  border-radius: 5px;
}
input::placeholder,
textarea::placeholder {
  color: white;
  opacity: 0.7;
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
.success-modal {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 10px;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  font-size: 1.1em;
}
#category,
#section {
  background-color: var(--blue-light);
  color: black;
  border-radius: 5px;
}
.error-message {
  color: #e74c3c;
  font-size: 0.95em;
  margin-left: 8px;
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

.section-tag-bottom {
  background: #b3d4fc;
  color: #155fa0;
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 0.98em;
  font-weight: 500;
  border: 1px solid #1976d2;
  display: inline-block;
  white-space: nowrap;
  align-self: flex-end;
  margin-top: 12px;
}

.description-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
