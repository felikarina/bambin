<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formattedDate } from '../utils/formattedDate.ts'

interface Activity {
  id_activity?: number
  date?: string
  title?: string
  description?: string
}

const activities = ref<Activity[]>([])

const fetchActivities = async () => {
  const response = await fetch('/api/activities')
  const data = await response.json()
  activities.value = data
}

onMounted(fetchActivities)
</script>
<template>
  <div class="gallery">
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div class="cell" v-for="activity in activities" :key="activity.id_activity">
          <div class="card my-4">
            <div class="card-header">
              <p class="card-header-title">{{ formattedDate(activity.date) }}</p>
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
