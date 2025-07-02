<script setup lang="ts">
import { defineProps } from "vue";
import type { Child } from "../utils/api";

const props = defineProps<{
  children: Child[];
  isDemo: boolean;
  fakeChildren: Child[];
  getChildParents: (child: Child) => string;
  getChildSection: (childId: string) => { name: string } | null;
  askDeleteChild: (child: Child) => void;
}>();
</script>
<template>
  <div class="main mt-4" v-disable-demo>
    <div v-if="props.isDemo" class="demo-info mb-3">
      (liste d'enfants factice)
    </div>
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div
          class="cell"
          v-for="child in props.isDemo ? props.fakeChildren : props.children"
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
                  @click="props.isDemo ? null : props.askDeleteChild(child)"
                  ><span class="icon"> <i class="fas fa-trash"></i></span>
                </span>
              </div>
              <div class="mt-2">
                <p class="is-size-6">
                  <strong class="blue-dark"
                    >Parents : {{ props.getChildParents(child) }}</strong
                  >
                </p>
                <p class="is-size-6">
                  <strong class="blue-dark"
                    >Section :
                    {{
                      props.getChildSection(child.idChild || "")?.name ||
                      "Non assignée"
                    }}</strong
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  background-color: var(--blue-lighter);
  border-radius: 20px;
  border: 2px solid var(--primary);
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

.birth-date {
  color: var(--primary);
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
</style>

<script lang="ts">
export default {};
</script>
