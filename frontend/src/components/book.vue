<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formattedDate } from "../utils/formatted-date";
import { fetchActivities, type Activity } from "../utils/api";

const activities = ref<Activity[]>([]);

const fetchActivitiesAndSet = async () => {
  try {
    activities.value = await fetchActivities();
  } catch (e: any) {
    console.error("Error fetching activities:", e.message);
  }
};

onMounted(fetchActivitiesAndSet);
</script>
<template>
  <div class="gallery">
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div
          class="cell"
          v-for="activity in activities"
          :key="activity.idActivity"
        >
          <div class="card my-4">
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
                <h1>{{ activity.title }}</h1>
                {{ activity.description }}
              </div>
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
  padding: 4%;
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
</style>
