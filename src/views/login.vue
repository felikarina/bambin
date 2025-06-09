<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  error.value = ''
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })
  const data = await res.json()
  if (!res.ok) {
    error.value = data.error || 'Erreur'
    return
  }
  localStorage.setItem('token', data.token)
  localStorage.setItem('role', data.role)
  if (data.role === 'admin') router.push('/')
  else if (data.role === 'parent') router.push('/galerie-photo')
  else if (data.role === 'nurseryStaff') router.push('/journal-activite')
}
</script>

<template>
  <main class="main">
    <div class="field box p-6">
      <h1 class="title is-1">Bienvenue</h1>
      <p class="subtitle is-4">connectez-vous</p>
      <br />
      <label for="label">Mail</label>
      <div class="control has-icons-left">
        <input v-model="email" class="input is-info" type="email" placeholder="exemple@mail.com" />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>
      <br />
      <label for="label">Mot de passe</label>
      <div class="control has-icons-left">
        <input
          v-model="password"
          class="input is-info"
          type="password"
          placeholder="mot de passe"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
      <button class="button is-link mt-6" @click="login">Se connecter</button>
      <p v-if="error" style="color: red">{{ error }}</p>
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
  @media (max-width: 600px) {
    width: 100%;
    height: auto;
  }
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
