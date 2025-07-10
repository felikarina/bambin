<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formattedDate } from "../utils/formatted-date";
import { fetchActivities, type Activity } from "../utils/api";
import {
  fetchChildren,
  fetchChildSections,
  fetchSectionActivities,
  fetchSections,
  type Child,
  type ChildSection,
  type SectionActivity,
  type Section,
} from "../utils/api";

const activities = ref<Activity[]>([]);
const filteredActivities = ref<Activity[]>([]);
const sections = ref<Section[]>([]);
const activityToSection = ref<Record<string, string | undefined>>({});

const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

const fetchAllAndFilter = async () => {
  try {
    const allActivities = await fetchActivities();
    const allSections = await fetchSections();
    sections.value = allSections;
    const allSectionActivities: SectionActivity[] =
      await fetchSectionActivities();
    activityToSection.value = {};
    allSectionActivities.forEach((sa) => {
      if (sa.activityId)
        activityToSection.value[String(sa.activityId)] = sa.sectionId;
    });
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
      filteredActivities.value = allActivities.filter((act) => {
        if (!act.idActivity) return true;
        const sectionId = activityToSection.value[String(act.idActivity)];
        return !sectionId || mySectionIds.includes(String(sectionId));
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

function getSectionNameForActivity(activityId?: string | number) {
  if (!activityId) return null;
  const sectionId = activityToSection.value[String(activityId)];
  if (!sectionId) return null;
  const section = sections.value.find(
    (s) => String(s.idSection) === String(sectionId)
  );
  return section?.name || sectionId;
}
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
              <div
                v-if="getSectionNameForActivity(activity.idActivity)"
                class="section-tag-bottom"
              >
                Section : {{ getSectionNameForActivity(activity.idActivity) }}
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
  display: flex;
  flex-direction: column;
  min-height: 120px;
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

.section-tag {
  background: #b3d4fc;
  color: #155fa0;
  border-radius: 12px;
  padding: 4px 12px;
  margin-left: 12px;
  font-size: 0.98em;
  font-weight: 500;
  border: 1px solid #1976d2;
  display: inline-block;
  white-space: nowrap;
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
</style>
