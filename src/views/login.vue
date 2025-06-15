<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const emailInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);

const login = async () => {
  error.value = "";
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.value, password: password.value }),
  });
  const data = (await res.json()) as {
    error?: string;
    token?: string;
    role?: string;
    userId?: string;
  };
  if (!res.ok) {
    error.value = data.error || "Erreur";
    return;
  }
  localStorage.setItem("token", data.token ?? "");
  localStorage.setItem("role", data.role ?? "");
  localStorage.setItem("userId", data.userId ?? "");
  if (data.role === "admin") router.push("/administration");
  else if (data.role === "parent") router.push("/galerie-photo");
  else if (data.role === "nurseryStaff") router.push("/ajout-activite");
};

const loginDemo = async () => {
  error.value = "";
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "demo@test.com", password: "test" }),
  });
  const data = (await res.json()) as {
    error?: string;
    token?: string;
    role?: string;
    userId?: string;
  };
  if (!res.ok) {
    error.value = data.error || "Erreur";
    return;
  }
  localStorage.setItem("token", data.token ?? "");
  localStorage.setItem("role", data.role ?? "");
  router.push("/galerie-photo");
};

const focusPassword = async () => {
  await nextTick();
  passwordInput.value?.focus();
};
</script>

<template>
  <main class="main">
    <div class="field box p-6">
      <h1 class="title is-1">Bienvenue</h1>
      <p class="subtitle is-4">connectez-vous</p>
      <br />
      <label for="label">Mail</label>
      <div class="control has-icons-left">
        <input
          v-model="email"
          class="input is-info"
          type="email"
          placeholder="exemple@mail.com"
          @keyup.enter="focusPassword"
          ref="emailInput"
        />
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
          @keyup.enter="login"
          ref="passwordInput"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
      <div class="error-space">
        <p v-if="error" style="color: red; margin: 0">{{ error }}</p>
      </div>
      <button class="button is-link mt-6" @click="login">Se connecter</button>
      <button class="button button-demo mt-4" @click="loginDemo">
        Démo visiteur
      </button>
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

.error-space {
  height: 0.5rem;
  margin-bottom: 0.5em;
}

.button-demo {
  background-color: violet;
  color: white;
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  animation: demo-border-pulse 1.5s infinite;
}

@keyframes demo-border-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(180, 0, 255, 0.7);
  }
  40% {
    box-shadow: 0 0 0 8px rgba(255, 0, 80, 0.3);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(255, 0, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(180, 0, 255, 0);
  }
}
</style>

///
<reference lib="dom" />
