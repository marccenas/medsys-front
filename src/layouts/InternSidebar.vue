<template>
  <aside class="ua-sidebar">
    <!-- Brand -->
    <div class="ua-brand">
      <div class="logo-mark" aria-hidden="true"></div>
      <div class="ua-brand-name">MedSystem</div>
    </div>

    <!-- Nurse Nav -->
    <nav class="ua-nav" aria-label="Nurse navigation">
      <button
        class="ua-link"
        :class="{ active: isActive('dashboard') }"
        @click="go('dashboard')"
        type="button"
      >
        <font-awesome-icon icon="gauge" />
        <span>Dashboard</span>
      </button>

      <button
        class="ua-link"
        :class="{ active: isActive('patients') }"
        @click="go('patients')"
        type="button"
      >
        <font-awesome-icon icon="hospital-user" />
        <span>Patients</span>
      </button>

      <button
        class="ua-link"
        :class="{ active: isActive('tasks') }"
        @click="go('tasks')"
        type="button"
      >
        <font-awesome-icon icon="list-check" />
        <span>Tasks</span>
      </button>

      <button
        class="ua-link"
        :class="{ active: isActive('schedule') }"
        @click="go('schedule')"
        type="button"
      >
        <font-awesome-icon icon="calendar-days" />
        <span>Schedule</span>
      </button>

      <button
        class="ua-link"
        :class="{ active: isActive('learning') }"
        @click="go('learning')"
        type="button"
      >
        <font-awesome-icon icon="graduation-cap" />
        <span>Learning</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

/**
 * Nurse base route.
 * Expected:
 *  /dashboard/nurse/dashboard
 *  /dashboard/nurse/patients
 *  /dashboard/nurse/tasks
 *  /dashboard/nurse/schedule
 *  /dashboard/nurse/learning
 */
const BASE = "/dashboard/nurse";

function go(child) {
  const to = `${BASE}/${child}`;
  if (route.path === to) return;
  router.push(to).catch(() => {});
}

function isActive(child) {
  return route.path.includes(`${BASE}/${child}`);
}
</script>

<style scoped>
/* Sidebar container */
.ua-sidebar {
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color: #fff;
  padding: 14px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 10;
}

/* Brand */
.ua-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 10px;
}

.logo-mark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
}

.ua-brand-name {
  font-weight: 900;
  letter-spacing: 0.2px;
  font-size: 16px;
}

/* Nav */
.ua-nav {
  display: grid;
  gap: 8px;
  padding-top: 10px;
}

.ua-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;
  border-radius: 10px;
  border: 0;

  cursor: pointer;
  background: transparent;
  color: rgba(255, 255, 255, 0.92);

  font-weight: 800;
  font-size: 14px;
  text-align: left;
}

.ua-link :deep(svg) {
  width: 16px;
  height: 16px;
  opacity: 0.95;
}

.ua-link:hover {
  background: rgba(255, 255, 255, 0.12);
}

.ua-link.active {
  background: rgba(255, 255, 255, 0.18);
}

.ua-link span {
  line-height: 1.1;
}
</style>
