<script setup lang="ts">
import { formattedDate } from "../utils/formatted-date";
import { ref, onMounted } from "vue";
import { fetchPictures, type Picture } from "../utils/api";

const pictures = ref<Picture[]>([]);

const fetchPicturesAndSet = async () => {
  try {
    pictures.value = await fetchPictures();
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
        <div class="cell" v-for="picture in pictures" :key="picture.idPicture">
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
              <div class="content has-text-weight-bold">#tag</div>
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
</style>
