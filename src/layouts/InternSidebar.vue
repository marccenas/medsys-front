<template>
  <div class="ia-shell" :class="{ 'nav-open': navOpen }">
    <div class="ia-overlay" @click="navOpen = false"></div>

    <!-- Sidebar (mixed into shell) -->
    <aside class="ia-sidebar">
      <div class="ia-brand">
        <div class="logo-mark"></div>
        <div class="ia-brand-name">MedSystem</div>
      </div>

      <nav class="ia-nav">
        <button class="ia-link" :class="{ active: isActive('dashboard') }" @click="go('dashboard')">
          <font-awesome-icon icon="gauge" />
          <span>Dashboard</span>
        </button>

        <button class="ia-link" :class="{ active: isActive('patients') }" @click="go('patients')">
          <font-awesome-icon icon="hospital-user" />
          <span>Patients</span>
        </button>

        <button class="ia-link" :class="{ active: isActive('tasks') }" @click="go('tasks')">
          <font-awesome-icon icon="list-check" />
          <span>Tasks</span>
        </button>

        <button class="ia-link" :class="{ active: isActive('schedule') }" @click="go('schedule')">
          <font-awesome-icon icon="calendar-days" />
          <span>Schedule</span>
        </button>

        <button class="ia-link" :class="{ active: isActive('learning') }" @click="go('learning')">
          <font-awesome-icon icon="graduation-cap" />
          <span>Learning</span>
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <main class="ia-main">
      <header class="ia-topbar">
        <div class="ia-title">
          <button
            class="ia-burger"
            type="button"
            @click="navOpen = !navOpen"
            aria-label="Toggle navigation"
          >
            <font-awesome-icon icon="bars" />
          </button>

          <div class="ia-title-text">
            <h1>{{ pageTitle }}</h1>
            <div class="ia-subtitle">Interns</div>
          </div>
        </div>

        <div class="ia-actions">
          <button class="ia-icon-btn" type="button" aria-label="Notifications">
            <span class="ia-badge">6</span>
            <font-awesome-icon icon="bell" />
          </button>

          <div class="ia-profile">
            <img class="ia-avatar" :src="avatarUrl" alt="avatar" />
            <div class="ia-user">
              <div class="ia-user-name">John Carter</div>
              <div class="ia-user-role">Medical Intern</div>
            </div>

            <button class="ia-icon-btn" type="button" @click="logout" aria-label="Logout">
              <font-awesome-icon icon="right-from-bracket" />
            </button>
          </div>
        </div>
      </header>

      <section class="ia-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const navOpen = ref(false);

const avatarUrl = "https://i.pravatar.cc/64?img=32";

const pageTitle = computed(() => {
  const p = route.path;
  if (p.includes("/patients")) return "Patients";
  if (p.includes("/tasks")) return "Tasks";
  if (p.includes("/schedule")) return "Schedule";
  if (p.includes("/learning")) return "Learning";
  return "Dashboard";
});

function go(child) {
  navOpen.value = false;
  const to = `/dashboard/intern/${child}`;
  if (route.path === to) return;
  router.push(to).catch(() => {});
}

function isActive(child) {
  return route.path.includes(`/dashboard/intern/${child}`);
}

function logout() {
  localStorage.removeItem("medsystem_logged_in");
  localStorage.removeItem("medsystem_role");
  router.push("/login");
}

watch(
  () => route.fullPath,
  () => {
    navOpen.value = false;
  }
);
</script>

<style scoped>
/* ===== SHELL ===== */
.ia-shell{
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: radial-gradient(circle at 30% 30%, #f7faff, #eef2ff);
}

/* ===== OVERLAY ===== */
.ia-overlay{
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.35);
  opacity: 0;
  pointer-events: none;
  transition: opacity .18s ease;
  z-index: 90;
}

/* ===== SIDEBAR ===== */
.ia-sidebar{
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color: #fff;
  padding: 14px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 10;
}

.ia-brand{
  display:flex;
  align-items:center;
  gap:10px;
  padding: 10px 10px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  margin-bottom: 10px;
}
.ia-brand-name{ font-weight: 900; letter-spacing: .2px; }

.ia-nav{
  display:grid;
  gap: 8px;
  padding-top: 10px;
}

.ia-link{
  width:100%;
  display:flex;
  align-items:center;
  gap:10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 0;
  cursor: pointer;
  color: rgba(255,255,255,0.92);
  background: transparent;
  font-weight: 700;
}
.ia-link:hover{ background: rgba(255,255,255,0.12); }
.ia-link.active{ background: rgba(255,255,255,0.18); }

/* ===== MAIN ===== */
.ia-main{
  padding: 18px 18px 22px;
  min-width: 0;
}
.ia-content{
  margin-top: 14px;
  min-width: 0;
}

/* ===== TOPBAR (glassy) ===== */
.ia-topbar{
  background: rgba(255,255,255,0.70);
  border: 1px solid rgba(226,232,244,0.95);
  border-radius: 14px;
  box-shadow: 0 10px 22px rgba(15,23,42,0.08);
  padding: 14px 16px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
}

.ia-title{
  display:flex;
  align-items:center;
  gap: 12px;
  min-width: 0;
}
.ia-title-text{ min-width: 0; }
.ia-title h1{
  margin:0;
  font-size: 22px;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ia-subtitle{
  margin-top: 2px;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
}

/* ===== ACTIONS ===== */
.ia-actions{
  display:flex;
  align-items:center;
  gap: 12px;
}

/* icon btn */
.ia-icon-btn{
  position: relative;
  width: 40px; height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.95);
  background: #fff;
  cursor: pointer;
}
.ia-badge{
  position:absolute;
  top:-6px; right:-6px;
  background: #ff3b30;
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  border-radius: 999px;
  padding: 2px 6px;
  border: 2px solid #fff;
}

/* profile */
.ia-profile{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 6px 6px 6px 10px;
  border: 1px solid rgba(226,232,244,0.95);
  border-radius: 12px;
  background: #fff;
}
.ia-avatar{
  width: 34px; height: 34px;
  border-radius: 999px;
  object-fit: cover;
}
.ia-user{ line-height: 1.1; }
.ia-user-name{ font-weight: 900; font-size: 13px; }
.ia-user-role{ font-size: 11px; color: #64748b; font-weight: 700; }

/* burger hidden desktop */
.ia-burger{
  display:none;
  width: 42px; height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.95);
  background: #fff;
  cursor: pointer;
}

/* ===== OFFCANVAS (tablet/mobile) ===== */
@media (max-width: 980px){
  .ia-shell{ grid-template-columns: 1fr; }

  .ia-burger{
    display:inline-flex;
    align-items:center;
    justify-content:center;
  }

  .ia-sidebar{
    position: fixed;
    left: 0; top: 0;
    width: 260px;
    height: 100vh;
    transform: translateX(-105%);
    transition: transform .18s ease;
    z-index: 110;
  }

  .ia-shell.nav-open .ia-sidebar{ transform: translateX(0); }

  .ia-shell.nav-open .ia-overlay{
    opacity: 1;
    pointer-events: auto;
  }
}

/* small screens */
@media (max-width: 640px){
  .ia-topbar{ padding: 12px; }
  .ia-user{ display:none; } /* optional */
}
</style>
