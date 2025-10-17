<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { getRole, getUserId } from "../utils/auth";

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
  localStorage.setItem("userId", data.userId ?? "");
  const role = getRole();
  const userId = getUserId();

  if (role === "admin") router.push("/administration");
  else if (role === "parent") router.push("/galerie-photo");
  else if (role === "nurseryStaff") router.push("/ajout-activite");
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
  localStorage.setItem("userId", data.userId ?? "");
  const role = getRole();
  const userId = getUserId();

  if (role === "admin") router.push("/administration");
  else if (role === "parent") router.push("/galerie-photo");
  else if (role === "nurseryStaff") router.push("/ajout-activite");
  else router.push("/galerie-photo");
};

const focusPassword = async () => {
  await nextTick();
  passwordInput.value?.focus();
};
</script>

<template>
  <main class="main">
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="login-container">
      <h1 class="title is-1 has-text-white">Bambin</h1>
      <div class="field box p-6">
        <h1 class="title is-1">
          Bienvenue
          <img
            src="@/assets/logo-bambin.svg"
            alt="logo de Bambin"
            class="logo"
            width="60"
          />
        </h1>
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
    </div>
  </main>
</template>

<style scoped>
.main {
  background-color: var(--primary);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.main::before {
  content: "";
  position: absolute;
  top: 10%;
  left: 10%;
  width: 100px;
  height: 100px;
  background-color: #fff;
  border-radius: 50%;
  opacity: 0.35;
  animation: float 6s ease-in-out infinite;
}

.main::after {
  content: "";
  position: absolute;
  top: 60%;
  right: 15%;
  width: 80px;
  height: 80px;
  background-color: #fff;
  border-radius: 50%;
  opacity: 0.25;
  animation: float 8s ease-in-out infinite reverse;
}

.bubble {
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  opacity: 0.25;
  animation: float 7s ease-in-out infinite;
}

.bubble:nth-child(1) {
  top: 20%;
  right: 20%;
  width: 60px;
  height: 60px;
  animation-delay: 0s;
}

.bubble:nth-child(2) {
  top: 70%;
  left: 20%;
  width: 40px;
  height: 40px;
  animation-delay: 2s;
}

.bubble:nth-child(3) {
  top: 40%;
  left: 5%;
  width: 70px;
  height: 70px;
  animation-delay: 4s;
}

.bubble:nth-child(4) {
  top: 15%;
  left: 60%;
  width: 50px;
  height: 50px;
  animation-delay: 1s;
}

.bubble:nth-child(5) {
  top: 80%;
  right: 10%;
  width: 90px;
  height: 90px;
  animation-delay: 3s;
}

.bubble:nth-child(6) {
  top: 30%;
  right: 5%;
  width: 30px;
  height: 30px;
  animation-delay: 5s;
}

.bubble:nth-child(7) {
  top: 85%;
  left: 40%;
  width: 55px;
  height: 55px;
  animation-delay: 2s;
}

.bubble:nth-child(8) {
  top: 10%;
  left: 30%;
  width: 45px;
  height: 45px;
  animation-delay: 6s;
}

.bubble:nth-child(9) {
  top: 75%;
  right: 30%;
  width: 35px;
  height: 35px;
  animation-delay: 4s;
}

.bubble:nth-child(10) {
  top: 50%;
  left: 15%;
  width: 65px;
  height: 65px;
  animation-delay: 1s;
}

.bubble:nth-child(11) {
  top: 25%;
  right: 40%;
  width: 40px;
  height: 40px;
  animation-delay: 3s;
}

.bubble:nth-child(12) {
  top: 90%;
  left: 10%;
  width: 75px;
  height: 75px;
  animation-delay: 5s;
}

.bubble:nth-child(13) {
  top: 5%;
  right: 25%;
  width: 25px;
  height: 25px;
  animation-delay: 2s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: white;
}

.field {
  background-color: white;
  color: var(--primary);
  height: 500px;
  width: 500px;
  border: solid 1px green;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
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
