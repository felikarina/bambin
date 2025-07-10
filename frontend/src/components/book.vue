<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formattedDate } from "../utils/formatted-date";
import { fetchActivities, type Activity } from "../utils/api";
import {
  fetchChildren,
  fetchChildSections,
  fetchSectionActivities,
  type Child,
  type ChildSection,
  type SectionActivity,
} from "../utils/api";

const activities = ref<Activity[]>([]);
const filteredActivities = ref<Activity[]>([]);

const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

const fetchAllAndFilter = async () => {
  try {
    const allActivities = await fetchActivities();
    if (role === "parent" && userId) {
      const allChildren: Child[] = await fetchChildren();
      const myChildrenIds = allChildren
        .filter((c) => c.userId === userId || c.userId2 === userId)
        .map((c) => c.idChild as string);
      const allChildSections: ChildSection[] = await fetchChildSections();
      const mySectionIds = allChildSections
        .filter((cs) => cs.childId && myChildrenIds.includes(cs.childId))
        .map((cs) => cs.sectionId)
        .filter((id): id is string => !!id);
      const allSectionActivities: SectionActivity[] =
        await fetchSectionActivities();
      const activityToSection: Record<string, string | undefined> = {};
      allSectionActivities.forEach((sa) => {
        if (sa.activityId) activityToSection[sa.activityId] = sa.sectionId;
      });
      filteredActivities.value = allActivities.filter((act) => {
        if (!act.idActivity) return true;
        const sectionId = activityToSection[act.idActivity];
        return !sectionId || mySectionIds.includes(sectionId);
      });
    } else {
      filteredActivities.value = allActivities;
    }
    activities.value = allActivities;
  } catch (e: any) {
    console.error("Error fetching activities:", e.message);
  }
};

onMounted(fetchAllAndFilter);
</script>
<template>
  <div class="gallery">
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div
          class="cell"
          v-for="activity in filteredActivities"
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
