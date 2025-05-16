<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style>
:global(html) {
  background-color: white !important;
}
@media (prefers-color-scheme: dark) {
  html,
  body {
    background-color: white !important;
    color: black !important;
  }
}
</style>
