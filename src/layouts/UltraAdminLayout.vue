<template>
  <div class="ua-shell" :class="{ 'nav-open': navOpen }">
    <!-- ✅ overlay only used on mobile/tablet when nav is open -->
    <div class="ua-overlay" @click="navOpen = false"></div>

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

        <button class="ua-link" :class="{ active: isActive('staff') }" @click="go('staff')">
          <font-awesome-icon icon="users" /> <span>Staff</span>
        </button>

        <button class="ua-link" :class="{ active: isActive('patients') }" @click="go('patients')">
          <font-awesome-icon icon="hospital-user" /> <span>Patients</span>
        </button>

        <button class="ua-link" :class="{ active: isActive('appointments') }" @click="go('appointments')">
          <font-awesome-icon icon="calendar-check" /> <span>Appointments</span>
        </button>

        <button class="ua-link" :class="{ active: isActive('billing') }" @click="go('billing')">
          <font-awesome-icon icon="money-bill-wave" /> <span>Billing</span>
        </button>

        <button class="ua-link" :class="{ active: isActive('reports') }" @click="go('reports')">
          <font-awesome-icon icon="chart-column" /> <span>Reports</span>
        </button>

        <button class="ua-link" :class="{ active: isActive('admin-management') }" @click="go('admin-management')">
          <font-awesome-icon icon="user-gear" /> <span>Admin Management</span>
        </button>

        <button class="ua-link" :class="{ active: isActive('settings') }" @click="go('settings')">
          <font-awesome-icon icon="gear" /> <span>Settings</span>
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <main class="ua-main">
      <header class="ua-topbar">
        <div class="ua-title">
          <button class="ua-burger" type="button" @click="navOpen = !navOpen" aria-label="Toggle navigation">
            <font-awesome-icon icon="bars" />
          </button>

          <h1>{{ pageTitle }}</h1>
        </div>

        <div class="ua-actions">
          <!-- Notifications -->
          <div class="ua-notif" ref="notifRef" @click.stop>
            <button class="ua-icon-btn" type="button" @click.stop="toggleNotifMenu" aria-label="Notifications">
              <span class="ua-badge" v-if="notifCount > 0">{{ notifCount }}</span>
              <font-awesome-icon icon="bell" />
            </button>

            <div class="ua-notif-menu" v-if="notifOpen">
              <div class="ua-notif-head">
                <div class="ua-notif-title">Notifications</div>
                <button
                  class="ua-notif-action"
                  type="button"
                  @click="markAllRead"
                  :disabled="notifCount === 0"
                >
                  Mark all as read
                </button>
              </div>

              <div class="ua-notif-list" v-if="notifications.length">
                <button
                  class="ua-notif-item"
                  v-for="n in notifications"
                  :key="n.id"
                  type="button"
                  @click="openNotif(n)"
                >
                  <span class="ua-notif-dot" :class="{ on: !n.read }"></span>
                  <div class="ua-notif-body">
                    <div class="ua-notif-msg">{{ n.text }}</div>
                    <div class="ua-notif-time">{{ n.time }}</div>
                  </div>
                </button>
              </div>

              <div class="ua-notif-empty" v-else>
                You’re all caught up ✨
              </div>

              <div class="ua-notif-foot">
                <button class="ua-notif-viewall" type="button" @click="viewAllNotifs">
                  View all
                </button>
              </div>
            </div>
          </div>

          <!-- Profile -->
          <div class="ua-profile">
            <img class="ua-avatar" :src="avatarUrl" alt="avatar" />
            <div class="ua-user">
              <div class="ua-user-name">John Evans</div>
              <div class="ua-user-role">System Administrator</div>
            </div>

            <button class="ua-icon-btn" type="button" @click="logout" aria-label="Logout">
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
  { id: 1, text: "New staff member request submitted.", time: "Just now", read: false },
  { id: 2, text: "System backup completed successfully.", time: "10 min ago", read: false },
  { id: 3, text: "Reminder: Review department updates.", time: "1 hr ago", read: true },
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
const avatarUrl = "https://i.pravatar.cc/64?img=12"; // placeholder

const pageTitle = computed(() => {
  const p = route.path;
  if (p.includes("/departments")) return "Departments Overview";
  if (p.includes("/staff")) return "Staff";
  if (p.includes("/patients")) return "patients";
  if (p.includes("/appointments")) return "appointments";
  if (p.includes("/billing")) return "billing";
  if (p.includes("/reports")) return "reports";
  if (p.includes("/settings")) return "settings";
  if (p.includes("/admin-management")) return "Admin Management";
  return "Dashboard";
});

function go(child) {
  navOpen.value = false; // ✅ close on nav click (mobile)
  const to = `/dashboard/ultra-admin/${child}`;
  if (route.path === to) return;
  router.push(to).catch(() => {});
}

function isActive(child) {
  return route.path.includes(`/dashboard/ultra-admin/${child}`);
}

function notReady(name) {
  window.alert(`${name} page not built yet. Send the UI design and we’ll implement it.`);
}

function logout() {
  localStorage.removeItem("medsystem_logged_in");
  localStorage.removeItem("medsystem_role");
  router.push("/login");
}

/* ✅ safety: close overlay + notif when route changes */
watch(
  () => route.fullPath,
  () => {
    navOpen.value = false;
    closeNotifMenu();
  }
);
</script>

<style scoped>
/* ✅ keep your original desktop layout intact */
.ua-shell{
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;   /* ✅ desktop grid */
  background: radial-gradient(circle at 30% 30%, #f7faff, var(--bg));
}

/* Sidebar - desktop */
.ua-sidebar{
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color: white;
  padding: 14px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 10;
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

/* Main */
.ua-main{
  padding: 18px 18px 22px;
  min-width: 0;
}
.ua-content{
  margin-top: 14px;
  min-width: 0;
}

/* ✅ glassy topbar */
.ua-topbar{
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

.ua-title{
  display:flex;
  align-items:center;
  gap: 12px;
  min-width: 0;
}
.ua-title h1{
  margin:0;
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ua-actions{
  display:flex;
  align-items:center;
  gap: 12px;
}

/* Icon buttons */
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

/* Profile */
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

/* ✅ burger hidden on desktop */
.ua-burger{
  display:none;
  width: 42px; height: 42px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fff;
  cursor: pointer;
}

/* ✅ overlay default off (prevents “covering”) */
.ua-overlay{
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.35);
  opacity: 0;
  pointer-events: none;
  transition: opacity .18s ease;
  z-index: 90;
}

/* =========================
   Notifications dropdown UI
   ========================= */
.ua-notif{ position: relative; }

.ua-notif-menu{
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

.ua-notif-head{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 12px;
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.85));
  border-bottom: 1px solid rgba(226,232,244,0.9);
}

.ua-notif-title{
  font-weight: 900;
  color: #0f172a;
}

.ua-notif-action{
  border: 1px solid rgba(226,232,244,0.95);
  background: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 900;
  color: #1e5fb7;
}
.ua-notif-action:disabled{
  opacity: .45;
  cursor: not-allowed;
}

.ua-notif-list{
  max-height: 300px;
  overflow: auto;
}

.ua-notif-item{
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
.ua-notif-item:hover{ background: #f6f9ff; }

.ua-notif-dot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 6px;
  background: rgba(148,163,184,0.55);
  flex: 0 0 auto;
}
.ua-notif-dot.on{
  background: #2d76d6;
  box-shadow: 0 0 0 4px rgba(45,118,214,0.12);
}

.ua-notif-body{ min-width: 0; }
.ua-notif-msg{
  font-weight: 900;
  color: #0f172a;
  font-size: 13px;
  line-height: 1.2;
}
.ua-notif-time{
  margin-top: 4px;
  font-size: 11px;
  color: #64748b;
  font-weight: 800;
}

.ua-notif-empty{
  padding: 16px 12px;
  color: #64748b;
  font-weight: 900;
}

.ua-notif-foot{
  padding: 10px 12px;
  background: rgba(245,248,255,0.65);
}
.ua-notif-viewall{
  width: 100%;
  border: 1px solid rgba(226,232,244,0.95);
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 900;
  color: #0f172a;
}
.ua-notif-viewall:hover{ background: #f6f9ff; }

/* =========================
   ✅ TABLET/MOBILE OFFCANVAS
   (does NOT break desktop)
   ========================= */
@media (max-width: 980px){
  .ua-shell{
    grid-template-columns: 1fr;
  }

  .ua-burger{
    display:inline-flex;
    align-items:center;
    justify-content:center;
  }

  .ua-sidebar{
    position: fixed;
    left: 0; top: 0;
    width: 260px;
    height: 100vh;
    transform: translateX(-105%);
    transition: transform .18s ease;
    z-index: 110;
  }

  .ua-shell.nav-open .ua-sidebar{
    transform: translateX(0);
  }

  .ua-shell.nav-open .ua-overlay{
    opacity: 1;
    pointer-events: auto;
  }
}

/* Small screens: tighten topbar spacing */
@media (max-width: 640px){
  .ua-topbar{ padding: 12px; }
  .ua-user{ display:none; } /* optional: comment out if you want name visible on mobile */
}
</style>
