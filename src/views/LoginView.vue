<template>
  <div class="container-center">
    <div class="card" style="width: 520px; max-width: 100%;">
      <div class="header" style="justify-content:center;">
        <div class="logo-mark"></div>
        <div style="font-weight:800; font-size:20px; color: var(--blue);">MedSystem</div>
      </div>

      <div style="padding: 26px 26px 24px;">
        <h1 class="h1" style="text-align:center;">Login to MedSystem</h1>

        <div class="field">
            <span class="icon">
             <font-awesome-icon icon="envelope" />
            </span>
            <input class="input" v-model.trim="email" type="email" placeholder="Email Address" />
        </div>

        <div class="field">
            <span class="icon">
                <font-awesome-icon icon="lock" />
            </span>
            <input class="input" v-model="password" type="password" placeholder="Password" />
        </div>

        <label class="checkbox-row">
          <input type="checkbox" v-model="remember" />
          Remember Me
        </label>

        <button class="btn" @click="handleLogin">Login</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const remember = ref(true);

onMounted(() => {
  // simulate "remember me"
  const savedEmail = localStorage.getItem("medsystem_email");
  if (savedEmail) email.value = savedEmail;
});

function handleLogin() {
  // Frontend-only: no validation from backend.
  // Minimal checks (optional):
  if (!email.value || !password.value) {
    alert("Please enter email and password (frontend-only).");
    return;
  }

  if (remember.value) localStorage.setItem("medsystem_email", email.value);
  else localStorage.removeItem("medsystem_email");

  // store a fake session flag
  localStorage.setItem("medsystem_logged_in", "true");

  router.push("/roles");
}
</script>
