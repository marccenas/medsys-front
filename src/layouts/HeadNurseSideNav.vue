<!-- src/layouts/HeadNurseSideNav.vue -->
<template>
  <div class="hn-shell" :class="{ 'nav-open': navOpen }">
    <div class="hn-overlay" @click="navOpen = false"></div>

    <!-- Sidebar -->
    <aside class="hn-sidebar">
      <div class="hn-brand">
        <div class="logo-mark"></div>
        <div class="hn-brand-name">MedSystem</div>
      </div>

      <nav class="hn-nav">
        <button class="hn-link" :class="{ active: isActive('dashboard') }" @click="go('dashboard')">
          <font-awesome-icon icon="gauge" /> <span>Dashboard</span>
        </button>

        <button class="hn-link" :class="{ active: isActive('patients') }" @click="go('patients')">
          <font-awesome-icon icon="hospital-user" /> <span>Patients</span>
        </button>

        <button class="hn-link" :class="{ active: isActive('staff') }" @click="go('staff')">
          <font-awesome-icon icon="users" /> <span>Staff</span>
        </button>

        <button class="hn-link" :class="{ active: isActive('reports') }" @click="go('reports')">
          <font-awesome-icon icon="chart-column" /> <span>Reports</span>
        </button>

        <button class="hn-link" :class="{ active: isActive('supplies') }" @click="go('supplies')">
          <font-awesome-icon icon="pills" /> <span>Supplies</span>
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <main class="hn-main">
      <header class="hn-topbar">
        <div class="hn-title">
          <button class="hn-burger" type="button" @click="navOpen = !navOpen" aria-label="Toggle navigation">
            <font-awesome-icon icon="bars" />
          </button>

          <h1>{{ pageTitle }}</h1>
        </div>

        <div class="hn-actions">
          <!-- Notifications -->
          <div class="hn-notif" ref="notifRef" @click.stop>
            <button class="hn-icon-btn" type="button" @click.stop="toggleNotifMenu" aria-label="Notifications">
              <span class="hn-badge" v-if="notifCount > 0">{{ notifCount }}</span>
              <font-awesome-icon icon="bell" />
            </button>

            <div class="hn-notif-menu" v-if="notifOpen">
              <div class="hn-notif-head">
                <div class="hn-notif-title">Notifications</div>
                <button class="hn-notif-action" type="button" @click="markAllRead" :disabled="notifCount === 0">
                  Mark all as read
                </button>
              </div>

              <div class="hn-notif-list" v-if="notifications.length">
                <button
                  class="hn-notif-item"
                  v-for="n in notifications"
                  :key="n.id"
                  type="button"
                  @click="openNotif(n)"
                >
                  <span class="hn-notif-dot" :class="{ on: !n.read }"></span>
                  <div class="hn-notif-body">
                    <div class="hn-notif-msg">{{ n.text }}</div>
                    <div class="hn-notif-time">{{ n.time }}</div>
                  </div>
                </button>
              </div>

              <div class="hn-notif-empty" v-else>
                You’re all caught up ✨
              </div>

              <div class="hn-notif-foot">
                <button class="hn-notif-viewall" type="button" @click="viewAllNotifs">
                  View all
                </button>
              </div>
            </div>
          </div>

          <!-- Profile -->
          <div class="hn-profile">
            <img class="hn-avatar" :src="avatarUrl" alt="avatar" />
            <div class="hn-user">
              <div class="hn-user-name">Sarah Thompson</div>
              <div class="hn-user-role">Head Nurse / Nurse Unit Manager</div>
            </div>

            <button class="hn-icon-btn" type="button" @click="logout" aria-label="Logout">
              <font-awesome-icon icon="right-from-bracket" />
            </button>
          </div>
        </div>
      </header>

      <section class="hn-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const navOpen = ref(false);

/* =========================
   Notifications dropdown
   ========================= */
const notifRef = ref(null);
const notifOpen = ref(false);

const notifications = ref([
  { id: 1, text: "New shift swap request submitted.", time: "Just now", read: false },
  { id: 2, text: "Supply inventory report is ready.", time: "12 min ago", read: false },
  { id: 3, text: "Reminder: Review staff assignments.", time: "1 hr ago", read: true },
]);

const notifCount = computed(() => notifications.value.filter((n) => !n.read).length);

function toggleNotifMenu() {
  notifOpen.value = !notifOpen.value;
}
function closeNotifMenu() {
  notifOpen.value = false;
}
function markAllRead() {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
}
function openNotif(n) {
  notifications.value = notifications.value.map((x) => (x.id === n.id ? { ...x, read: true } : x));
  closeNotifMenu();
}
function viewAllNotifs() {
  closeNotifMenu();
  window.alert("View all notifications (UI only).");
}

/* Close notif dropdown on outside click / Esc */
function onWindowClick(e) {
  if (!notifOpen.value) return;
  const el = notifRef.value;
  if (el && !el.contains(e.target)) closeNotifMenu();
}
function onEsc(e) {
  if (e.key === "Escape") closeNotifMenu();
}
onMounted(() => {
  window.addEventListener("click", onWindowClick, true);
  window.addEventListener("keydown", onEsc);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", onWindowClick, true);
  window.removeEventListener("keydown", onEsc);
});

/* =========================
   Layout / routing
   ========================= */
const avatarUrl = "https://i.pravatar.cc/64?img=47"; // placeholder

const pageTitle = computed(() => {
  const p = route.path;
  if (p.includes("/patients")) return "Patients";
  if (p.includes("/staff")) return "Staff";
  if (p.includes("/reports")) return "Reports";
  if (p.includes("/supplies")) return "Supplies";
  return "Dashboard";
});

function go(child) {
  navOpen.value = false;
  const to = `/dashboard/head-nurse/${child}`;
  if (route.path === to) return;
  router.push(to).catch(() => {});
}

function isActive(child) {
  return route.path.includes(`/dashboard/head-nurse/${child}`);
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
    closeNotifMenu();
  }
);
</script>

<style scoped>
.hn-shell{
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: radial-gradient(circle at 30% 30%, #f7faff, var(--bg));
}

/* Sidebar - desktop */
.hn-sidebar{
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color: white;
  padding: 14px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 10;
}

.hn-brand{
  display:flex;
  align-items:center;
  gap:10px;
  padding: 10px 10px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  margin-bottom: 10px;
}
.hn-brand-name{ font-weight:900; letter-spacing:0.2px; }

.hn-nav{ display:grid; gap: 8px; padding-top: 10px; }

.hn-link{
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
.hn-link:hover{ background: rgba(255,255,255,0.12); }
.hn-link.active{ background: rgba(255,255,255,0.18); }

/* Main */
.hn-main{
  padding: 18px 18px 22px;
  min-width: 0;
}
.hn-content{
  margin-top: 14px;
  min-width: 0;
}

/* glassy topbar */
.hn-topbar{
  background: rgba(255,255,255,0.70);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 14px 16px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
}

.hn-title{
  display:flex;
  align-items:center;
  gap: 12px;
  min-width: 0;
}
.hn-title h1{
  margin:0;
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hn-actions{
  display:flex;
  align-items:center;
  gap: 12px;
}

/* Icon buttons */
.hn-icon-btn{
  position: relative;
  width: 40px; height: 40px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #fff;
  cursor: pointer;
}
.hn-badge{
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

/* Profile */
.hn-profile{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 6px 6px 6px 10px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
}
.hn-avatar{ width: 34px; height: 34px; border-radius: 999px; object-fit: cover; }
.hn-user{ line-height: 1.1; }
.hn-user-name{ font-weight: 900; font-size: 13px; }
.hn-user-role{ font-size: 11px; color: var(--muted); }

/* burger hidden on desktop */
.hn-burger{
  display:none;
  width: 42px; height: 42px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fff;
  cursor: pointer;
}

/* overlay default off */
.hn-overlay{
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.35);
  opacity: 0;
  pointer-events: none;
  transition: opacity .18s ease;
  z-index: 90;
}

/* Notifications dropdown */
.hn-notif{ position: relative; }

.hn-notif-menu{
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: min(360px, 88vw);
  background: #fff;
  border: 1px solid rgba(226,232,244,0.95);
  border-radius: 14px;
  box-shadow: 0 22px 44px rgba(15,23,42,0.18);
  overflow: hidden;
  z-index: 999;
}

.hn-notif-head{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 12px;
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.85));
  border-bottom: 1px solid rgba(226,232,244,0.9);
}

.hn-notif-title{
  font-weight: 900;
  color: #0f172a;
}

.hn-notif-action{
  border: 1px solid rgba(226,232,244,0.95);
  background: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 900;
  color: #1e5fb7;
}
.hn-notif-action:disabled{
  opacity: .45;
  cursor: not-allowed;
}

.hn-notif-list{
  max-height: 300px;
  overflow: auto;
}

.hn-notif-item{
  width: 100%;
  display:flex;
  gap: 10px;
  padding: 12px;
  background: #fff;
  border: 0;
  text-align:left;
  cursor: pointer;
  border-bottom: 1px solid rgba(226,232,244,0.75);
}
.hn-notif-item:hover{ background: #f6f9ff; }

.hn-notif-dot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 6px;
  background: rgba(148,163,184,0.55);
  flex: 0 0 auto;
}
.hn-notif-dot.on{
  background: #2d76d6;
  box-shadow: 0 0 0 4px rgba(45,118,214,0.12);
}

.hn-notif-body{ min-width: 0; }
.hn-notif-msg{
  font-weight: 900;
  color: #0f172a;
  font-size: 13px;
  line-height: 1.2;
}
.hn-notif-time{
  margin-top: 4px;
  font-size: 11px;
  color: #64748b;
  font-weight: 800;
}

.hn-notif-empty{
  padding: 16px 12px;
  color: #64748b;
  font-weight: 900;
}

.hn-notif-foot{
  padding: 10px 12px;
  background: rgba(245,248,255,0.65);
}
.hn-notif-viewall{
  width: 100%;
  border: 1px solid rgba(226,232,244,0.95);
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 900;
  color: #0f172a;
}
.hn-notif-viewall:hover{ background: #f6f9ff; }

/* Tablet/Mobile offcanvas */
@media (max-width: 980px){
  .hn-shell{
    grid-template-columns: 1fr;
  }

  .hn-burger{
    display:inline-flex;
    align-items:center;
    justify-content:center;
  }

  .hn-sidebar{
    position: fixed;
    left: 0; top: 0;
    width: 260px;
    height: 100vh;
    transform: translateX(-105%);
    transition: transform .18s ease;
    z-index: 110;
  }

  .hn-shell.nav-open .hn-sidebar{
    transform: translateX(0);
  }

  .hn-shell.nav-open .hn-overlay{
    opacity: 1;
    pointer-events: auto;
  }
}

/* Small screens */
@media (max-width: 640px){
  .hn-topbar{ padding: 12px; }
  .hn-user{ display:none; }
}
</style>
