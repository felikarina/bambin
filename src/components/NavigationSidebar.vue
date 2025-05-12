<script setup lang="ts"></script>

<template>
  <div class="container mt-5">
    <div class="columns">
      <div class="column is-one-quarter">
        <aside class="menu">
          <p class="menu-label">Navigation</p>
          <ul class="menu-list">
            <li><router-link to="/galerie-photo">Galerie photo</router-link></li>
            <li><router-link to="/galerie-photo">Journal d'activité</router-link></li>
            <li><router-link to="/galerie-photo">Messagerie</router-link></li>
            <li><router-link to="/galerie-photo">Paramètres</router-link></li>
            <li><router-link to="/galerie-photo">Déconnexion</router-link></li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <div class="greetings">
          <h1>Cheese</h1>
        </div>
        <router-link to="/">Hello world</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
