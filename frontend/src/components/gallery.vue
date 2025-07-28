<script setup lang="ts">
import { formattedDate } from "../utils/formatted-date";
import { ref, onMounted } from "vue";
import {
  fetchPictures,
  type Picture,
  fetchChildren,
  type Child,
} from "../utils/api";
type PictureWithChildren = Picture & {
  children?: { idChild: string; firstname: string; lastname: string }[];
};

const pictures = ref<PictureWithChildren[]>([]);
const filteredPictures = ref<PictureWithChildren[]>([]);

// For the enlarged image modal
const selectedPicture = ref<PictureWithChildren | null>(null);
const openModal = (picture: PictureWithChildren) => {
  selectedPicture.value = picture;
};
const closeModal = () => {
  selectedPicture.value = null;
};

const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

const fetchPicturesAndSet = async () => {
  try {
    let allPictures = await fetchPictures();
    // Sort by date descending (most recent first)
    allPictures = allPictures.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (role === "parent" && userId) {
      // Fetch all children and keep only those belonging to the parent
      const allChildren: Child[] = await fetchChildren();
      const myChildrenIds = allChildren
        .filter((c) => c.userId === userId || c.userId2 === userId)
        .map((c) => c.idChild);
      // Filter pictures: no tag or at least one tag matches a child of the parent
      filteredPictures.value = allPictures.filter((pic: any) => {
        if (!pic.children || pic.children.length === 0) return true;
        return pic.children.some((child: any) =>
          myChildrenIds.includes(child.idChild)
        );
      });
    } else {
      filteredPictures.value = allPictures;
    }
    pictures.value = allPictures;
  } catch (e: any) {
    console.error("Error fetching pictures:", e.message);
  }
};

onMounted(fetchPicturesAndSet);
</script>
<template>
  <div class="gallery">
    <div class="fixed-grid has-1-cols-mobile">
      <div class="grid">
        <div
          class="cell"
          v-for="picture in filteredPictures"
          :key="picture.idPicture"
        >
          <div class="card my-4">
            <div class="card-image">
              <div
                class="card-header-title is-flex is-justify-content-space-between"
              >
                <p>{{ formattedDate(picture.date) }}</p>
                <p>{{ picture.title }}</p>
              </div>
              <figure>
                <img
                  v-lazy="picture.media"
                  class="image is-4by3"
                  alt="photo"
                  @click="openModal(picture)"
                  style="cursor: zoom-in"
                />
              </figure>
            </div>
            <div class="card-content">
              <div class="content has-text-weight-bold">
                <!-- Display associated children if any -->
                <div
                  v-if="picture.children && picture.children.length > 0"
                  class="children-list mt-2"
                >
                  <span
                    v-for="child in picture.children"
                    :key="child.idChild"
                    class="child-name-tag"
                  >
                    {{ child.firstname }} {{ child.lastname }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Enlarged image modal -->
    <div v-if="selectedPicture" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">&times;</button>
        <img
          :src="selectedPicture.media"
          :alt="selectedPicture.title"
          class="modal-image"
        />
        <div class="modal-caption">
          <p>{{ selectedPicture.title }}</p>
          <p>{{ formattedDate(selectedPicture.date) }}</p>
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
}

.card {
  background-color: var(--blue-light);
}

.content {
  color: var(--primary);
}

p {
  color: black;
}
.children-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.child-name-tag {
  background: #b3d4fc;
  color: #155fa0;
  border-radius: 12px;
  padding: 4px 12px;
  margin-left: 4px;
  font-size: 0.98em;
  font-weight: 500;
  border: 1px solid #1976d2;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 24px 24px 12px 24px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-image {
  max-width: 80vw;
  max-height: 70vh;
  border-radius: 8px;
  margin-bottom: 12px;
}
.modal-caption {
  text-align: center;
  color: #155fa0;
  font-weight: 500;
}
.modal-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #1976d2;
  cursor: pointer;
}
</style>
