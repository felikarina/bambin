<script setup lang="ts">
import { formattedDate } from "../utils/formatted-date";
import { ref, onMounted, computed } from "vue";
import {
  fetchPictures,
  deletePictureApi,
  addPictureApi,
  fetchChildren,
  fetchChildSections,
  addPictureTagsApi,
  type Picture,
  type Child,
  type ChildSection,
} from "../utils/api";
import { supabase } from "../utils/supabase";

const pictures = ref<Picture[]>([]);
const showModalDelete = ref(false);
const pictureToDelete = ref<Picture | null>(null);
const successMsg = ref("");
const date = ref("");
const title = ref("");
const file = ref<File | null>(null);
const loading = ref(false);
const message = ref("");
const userId = ref("");
const errors = ref({ date: "", title: "", file: "" });
const children = ref<Child[]>([]);
const selectedChildIds = ref<string[]>([]);
const sectionFilter = ref("");
const childSections = ref<ChildSection[]>([]);

function toggleChildSelection(id: string) {
  const idx = selectedChildIds.value.indexOf(id);
  if (idx === -1) selectedChildIds.value.push(id);
  else selectedChildIds.value.splice(idx, 1);
}

const fetchPicturesAndSet = async () => {
  try {
    pictures.value = await fetchPictures();
  } catch (e: any) {
    console.error("Error fetching pictures:", e.message);
  }
};

const filteredChildren = computed(() => {
  let arr = children.value.slice();
  if (sectionFilter.value) {
    const ids = childSections.value
      .filter((cs) => cs.sectionId === sectionFilter.value)
      .map((cs) => cs.childId);
    arr = arr.filter((child) => ids.includes(child.idChild));
  }
  return arr.sort((a, b) =>
    (a.firstname || "").localeCompare(b.firstname || "")
  );
});

const sortedPictures = computed(() => {
  // Sort pictures from most recent to oldest
  return pictures.value
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date ?? "1970-01-01").getTime() -
        new Date(a.date ?? "1970-01-01").getTime()
    );
});

onMounted(async () => {
  try {
    const res = await fetch("/api/current-user", { credentials: "include" });
    if (res.ok) {
      const json = await res.json();
      userId.value = json?.userId || "";
    } else {
      userId.value = "";
    }
  } catch (e) {
    // fallback to empty if request fails
    userId.value = "";
  }

  await fetchPicturesAndSet();
  try {
    children.value = await fetchChildren();
  } catch (e: any) {
    console.error("Error fetching children:", e.message);
  }
  try {
    childSections.value = await fetchChildSections();
  } catch (e: any) {
    console.error("Error fetching child sections:", e.message);
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  date.value = `${yyyy}-${mm}-${dd}`;
});

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  file.value = target.files ? target.files[0] : null;
}

async function submitPicture() {
  errors.value = { date: "", title: "", file: "" };
  let hasError = false;
  if (!date.value) {
    errors.value.date = "Veuillez choisir une date";
    hasError = true;
  }
  if (!title.value) {
    errors.value.title = "Veuillez saisir un titre";
    hasError = true;
  }
  if (!file.value) {
    errors.value.file = "Veuillez sélectionner une photo";
    hasError = true;
  }
  if (hasError) return;
  loading.value = true;
  try {
    // Upload to Supabase Storage
    const fileName = `${Date.now()}_${file.value!.name}`;
    const { error } = await supabase.storage
      .from("picture")
      .upload(fileName, file.value!);
    if (error) throw new Error("Erreur upload Supabase: " + error.message);
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("picture")
      .getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;
    // Send to API with URL
    const created = await addPictureApi({
      date: date.value,
      title: title.value,
      media: publicUrl,
      userId: userId.value,
    });
    // Add picture tags if children are selected
    if (selectedChildIds.value.length > 0 && created.idPicture) {
      await addPictureTagsApi(created.idPicture, selectedChildIds.value);
    }
    await fetchPicturesAndSet();
    message.value = "Photo ajoutée avec succès";
    // Reset form but keep today's date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    date.value = `${yyyy}-${mm}-${dd}`;
    title.value = "";
    file.value = null;
    selectedChildIds.value = [];
    setTimeout(() => {
      message.value = "";
    }, 2000);
    fetchPicturesAndSet();
  } catch (err: any) {
    message.value = err.message || "Erreur lors de l'ajout de la photo.";
  } finally {
    loading.value = false;
  }
}

function askDeletePhoto(picture: Picture) {
  pictureToDelete.value = picture;
  showModalDelete.value = true;
}

function cancelDeletePhoto() {
  showModalDelete.value = false;
  pictureToDelete.value = null;
}

async function confirmDeletePhoto() {
  if (!pictureToDelete.value || !pictureToDelete.value.idPicture) return;
  try {
    await deletePictureApi(String(pictureToDelete.value.idPicture));
    await fetchPicturesAndSet();
    successMsg.value = "Photo supprimée avec succès";
    setTimeout(() => {
      successMsg.value = "";
    }, 2000);
  } catch (e: any) {
    console.error(e.message);
  } finally {
    showModalDelete.value = false;
    pictureToDelete.value = null;
  }
}
</script>
<template>
  <div class="gallery mt-4" v-bind="$attrs">
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div class="cell cell-panel">
          <div class="card">
            <div class="card-header">
              <p class="card-header-title">Ajouter une photo</p>
            </div>
            <div class="card-content-panel card-content">
              <div class="content has-text-weight-semibold">
                <label for="date">Date :</label>
                <span v-if="errors.date" class="error-message">
                  {{ errors.date }}
                </span>
                <input
                  id="date"
                  type="date"
                  v-model="date"
                  class="input mb-2"
                />
                <label for="title">Titre :</label>
                <span v-if="errors.title" class="error-message">
                  {{ errors.title }}
                </span>
                <input
                  id="title"
                  type="text"
                  v-model="title"
                  class="input mb-2"
                  placeholder="Titre de la photo"
                />
                <label for="file">Photo :</label>
                <span v-if="errors.file" class="error-message">
                  {{ errors.file }}
                </span>
                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  class="input mb-2"
                />
                <label for="section-filter"
                  >Enfants visibles s'il y en a :</label
                >
                <select
                  id="section-filter"
                  v-model="sectionFilter"
                  class="input mb-2"
                >
                  <option value="">
                    Sélectionner une section pour filtrer
                  </option>
                  <option value="petit">petit</option>
                  <option value="moyen">moyen</option>
                  <option value="grand">grand</option>
                </select>
                <div class="tag-list mb-2">
                  <span
                    v-for="child in filteredChildren"
                    :key="child.idChild"
                    class="child-tag"
                    :class="{
                      selected: selectedChildIds.includes(
                        String(child.idChild)
                      ),
                    }"
                    @click="toggleChildSelection(String(child.idChild))"
                  >
                    {{ child.firstname }} {{ child.lastname }}
                  </span>
                </div>
                <button
                  class="button is-primary mt-2"
                  :disabled="loading"
                  @click="submitPicture"
                >
                  {{ loading ? "Ajout..." : "Ajouter" }}
                </button>
                <div v-if="message" class="mt-2">{{ message }}</div>
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
        <h3>Suppression de photo</h3>
        <p>Voulez-vous vraiment supprimer cette photo ?</p>
        <div class="is-flex is-justify-content-space-between mt-5 gap-4">
          <button class="btn-cancel" @click="cancelDeletePhoto">Annuler</button>
          <button class="btn-confirm" @click="confirmDeletePhoto">
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
  </div>
  <div class="gallery mt-4">
    <div class="fixed-grid has-1-cols-mobile">
      <p class="p-2 has-text-weight-bold has-text-centered">
        Liste des photos de la galerie
      </p>
      <div class="grid">
        <div
          class="cell"
          v-for="picture in sortedPictures"
          :key="picture.idPicture"
        >
          <span
            class="button is-danger is-outlined is-centered"
            title="Supprimer la photo"
            @click="askDeletePhoto(picture)"
            ><span class="icon"> <i class="fas fa-trash"></i></span>
          </span>
          <div class="card my-4">
            <div class="card-image">
              <div
                class="card-header-title is-flex is-justify-content-space-between"
              >
                <p>{{ formattedDate(picture.date) }}</p>
                <p>{{ picture.title }}</p>
              </div>
              <figure>
                <img v-lazy="picture.media" class="image is-4by3" alt="photo" />
              </figure>
            </div>
            <div class="card-content">
              <div class="content has-text-weight-bold"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.gallery {
  background-color: var(--blue-lighter);
  border-radius: 20px;
}

.cell {
  padding: 10%;
  border: 2px solid red;
}

.cell-panel {
  margin: 0;
  border: none;
}

input {
  background-color: var(--blue-light);
  color: black;
  border-radius: 5px;
}
input::placeholder {
  color: white;
  opacity: 0.7;
}

.card {
  background-color: var(--blue-light);
}

.content {
  color: black;
}

.card-content-panel {
  background-color: white;
}

p {
  color: black;
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
.error-message {
  color: #e74c3c;
  font-size: 0.9em;
  margin-top: -5px;
  margin-bottom: 10px;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.child-tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 16px;
  background: #b3d4fc;
  color: #155fa0;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  transition:
    background 0.2s,
    color 0.2s;
  border: 1px solid #1976d2;
}
.child-tag.selected {
  background: #1976d2;
  color: #fff;
  border: 1px solid #1976d2;
}
#section-filter {
  background-color: var(--blue-light);
  color: black;
  border-radius: 5px;
}
label[for="section-filter"] {
  color: black;
}
</style>
