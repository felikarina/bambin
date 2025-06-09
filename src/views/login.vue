<script setup lang="ts"></script>

<template>
  <main class="main">
    <div class="field box p-6">
      <h1 class="title is-1">Bienvenue</h1>
      <p class="subtitle is-4">connectez-vous</p>
      <br />
      <label for="label">Mail</label>
      <div class="control has-icons-left">
        <input class="input is-info" type="email" placeholder="exemple@mail.com" />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>
      <br />
      <label for="label">Mot de passe</label>
      <div class="control has-icons-left">
        <input class="input is-info" type="password" placeholder="mot de passe" />
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
      <button class="button is-link mt-6">Se connecter</button>
    </div>
  </main>
</template>

<style scoped>
.main {
  background-color: var(--blue-light);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.field {
  background-color: white;
  color: var(--primary);
  height: 500px;
  width: 500px;
  border: solid 1px green;
}

.field .button {
  width: 100%;
  display: block;
}

.is-info {
  background-color: white;
}

.input {
  color: var(--primary);
}

.title,
.subtitle {
  color: var(--primary);
}
</style>
