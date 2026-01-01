<template>
  <div class="ua-shell">
    <!-- Sidebar -->
    <aside class="ua-sidebar">
      <div class="ua-brand">
        <div class="logo-mark"></div>
        <div class="ua-brand-name">MedSystem</div>
      </div>

      <nav class="ua-nav">
        <button class="ua-link" :class="{ active: isActive('dashboard') }" @click="go('dashboard')">
          <font-awesome-icon icon="gauge" /> <span>Dashboard</span>
        </button>

        <button class="ua-link" :class="{ active: isActive('departments') }" @click="go('departments')">
          <font-awesome-icon icon="building" /> <span>Departments</span>
        </button>

        <button class="ua-link" @click="notReady('Staff')">
          <font-awesome-icon icon="users" /> <span>Staff</span>
        </button>

        <button class="ua-link" @click="notReady('Patients')">
          <font-awesome-icon icon="hospital-user" /> <span>Patients</span>
        </button>

        <button class="ua-link" @click="notReady('Appointments')">
          <font-awesome-icon icon="calendar-check" /> <span>Appointments</span>
        </button>

        <button class="ua-link" @click="notReady('Billing')">
          <font-awesome-icon icon="money-bill-wave" /> <span>Billing</span>
        </button>

        <button class="ua-link" @click="notReady('Reports')">
          <font-awesome-icon icon="chart-column" /> <span>Reports</span>
        </button>

        <button class="ua-link" :class="{ active: isActive('admin-management') }" @click="go('admin-management')">
          <font-awesome-icon icon="user-gear" /> <span>Admin Management</span>
        </button>

        <button class="ua-link" @click="notReady('Settings')">
          <font-awesome-icon icon="gear" /> <span>Settings</span>
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <main class="ua-main">
      <header class="ua-topbar">
        <div class="ua-title">
          <h1>{{ pageTitle }}</h1>
        </div>

        <div class="ua-actions">
          <button class="ua-icon-btn" type="button" @click="toggleNotif">
            <span class="ua-badge" v-if="notifCount > 0">{{ notifCount }}</span>
            <font-awesome-icon icon="bell" />
          </button>

          <div class="ua-profile">
            <img class="ua-avatar" :src="avatarUrl" alt="avatar" />
            <div class="ua-user">
              <div class="ua-user-name">John Evans</div>
              <div class="ua-user-role">System Administrator</div>
            </div>
            <button class="ua-icon-btn" type="button" @click="logout">
              <font-awesome-icon icon="right-from-bracket" />
            </button>
          </div>
        </div>
      </header>

      <section class="ua-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const notifCount = ref(3);
const avatarUrl =
  "https://i.pravatar.cc/64?img=12"; // frontend placeholder (ok to replace later)

const pageTitle = computed(() => {
  const p = route.path;
  if (p.includes("/departments")) return "Departments Overview";
  if (p.includes("/admin-management")) return "Admin Management";
  return "Dashboard";
});

function go(child) {
  router.push(`/dashboard/ultra-admin/${child}`);
}

function isActive(child) {
  return route.path.includes(`/dashboard/ultra-admin/${child}`);
}

function notReady(name) {
  alert(`${name} page not built yet. Send the UI design and we’ll implement it.`);
}

function toggleNotif() {
  notifCount.value = 0;
}

function logout() {
  localStorage.removeItem("medsystem_logged_in");
  localStorage.removeItem("medsystem_role");
  router.push("/login");
}
</script>

<style scoped>
.ua-shell{
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: radial-gradient(circle at 30% 30%, #f7faff, var(--bg));
}
.ua-sidebar{
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color: white;
  padding: 14px;
  position: sticky;
  top: 0;
  height: 100vh;
}
.ua-brand{
  display:flex;
  align-items:center;
  gap:10px;
  padding: 10px 10px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  margin-bottom: 10px;
}
.ua-brand-name{ font-weight:900; letter-spacing:0.2px; }

.ua-nav{ display:grid; gap: 8px; padding-top: 10px; }
.ua-link{
  width: 100%;
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
.ua-link:hover{ background: rgba(255,255,255,0.12); }
.ua-link.active{ background: rgba(255,255,255,0.18); }

.ua-main{ padding: 18px 18px 22px; }
.ua-topbar{
  background: rgba(255,255,255,0.70);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 14px 16px;
  display:flex;
  align-items:center;
  justify-content: space-between;
}
.ua-title h1{
  margin:0;
  font-size: 20px;
}
.ua-actions{ display:flex; align-items:center; gap: 12px; }

.ua-icon-btn{
  position: relative;
  width: 40px; height: 40px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #fff;
  cursor: pointer;
}
.ua-badge{
  position:absolute;
  top:-6px; right:-6px;
  background: #ff3b30;
  color: white;
  font-size: 11px;
  font-weight: 900;
  border-radius: 999px;
  padding: 2px 6px;
  border: 2px solid #fff;
}

.ua-profile{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 6px 6px 6px 10px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
}
.ua-avatar{ width: 34px; height: 34px; border-radius: 999px; object-fit: cover; }
.ua-user{ line-height: 1.1; }
.ua-user-name{ font-weight: 900; font-size: 13px; }
.ua-user-role{ font-size: 11px; color: var(--muted); }

.ua-content{
  margin-top: 14px;
}
@media (max-width: 980px){
  .ua-shell{ grid-template-columns: 84px 1fr; }
  .ua-brand-name, .ua-link span{ display:none; }
}
</style>
