<template>
  <div class="phys-shell" :class="{ 'nav-open': navOpen }">
    <!-- MOBILE OVERLAY -->
    <button
      v-if="navOpen"
      class="nav-overlay"
      type="button"
      aria-label="Close navigation"
      @click="navOpen = false"
    ></button>

    <!-- SIDENAV -->
    <aside class="sidenav" :class="{ open: navOpen }">
      <div class="brand">
        <div class="logo-mark" aria-hidden="true"></div>
        <div class="brand-name">MedSystem</div>
      </div>

      <nav class="nav">
        <button class="nav-item" :class="{ active: isActive('dashboard') }" @click="goAndClose('dashboard')">
          <font-awesome-icon icon="gauge" />
          <span>Dashboard</span>
        </button>

        <button class="nav-item" :class="{ active: isActive('patients') }" @click="goAndClose('patients')">
          <font-awesome-icon icon="user-injured" />
          <span>Patients</span>
        </button>

        <button class="nav-item" :class="{ active: isActive('appointments') }" @click="goAndClose('appointments')">
          <font-awesome-icon icon="calendar-check" />
          <span>Appointments</span>
        </button>

        <button class="nav-item" :class="{ active: isActive('lab-results') }" @click="goAndClose('lab-results')">
          <font-awesome-icon icon="flask" />
          <span>Lab Results</span>
        </button>

        <button class="nav-item" :class="{ active: isActive('settings') }" @click="goAndClose('settings')">
          <font-awesome-icon icon="gear" />
          <span>Settings</span>
        </button>
      </nav>
    </aside>

    <!-- MAIN -->
    <main class="main">
      <header class="topbar">
        <!-- LEFT: hamburger on mobile/tablet -->
        <div class="left-top">
          <button class="hamburger" type="button" aria-label="Open navigation" @click="navOpen = true">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>

          <div class="welcome">
            <h1>Welcome, Dr. Sarah Mitchell</h1>
            <div class="sub">Attending Physician</div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="top-actions">
          <button class="icon-btn" type="button" aria-label="Notifications">
            <font-awesome-icon icon="bell" />
            <span class="badge">3</span>
          </button>

          <!-- USER DROPDOWN -->
          <div class="user" ref="userRef">
            <button class="user-btn" type="button" @click.stop="toggleUserMenu">
              <img class="avatar" src="https://i.pravatar.cc/80?img=47" alt="avatar" />
              <div class="user-meta">
                <div class="user-name">Dr. Sarah Mitchell</div>
                <div class="user-role">Attending Physician</div>
              </div>
              <font-awesome-icon class="caret" icon="chevron-down" />
            </button>

            <div v-if="userMenuOpen" class="user-menu" @click.stop>
              <button class="menu-item danger" type="button" @click="logout">
                <font-awesome-icon icon="right-from-bracket" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, useRoute, useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from "vue";

const route = useRoute();
const router = useRouter();

const userMenuOpen = ref(false);
const userRef = ref(null);

/* ✅ responsive sidenav */
const navOpen = ref(false);

/* Ultra Admin–style navigation */
function go(section) {
  router.push(`/dashboard/physician/${section}`);
}

function goAndClose(section) {
  go(section);
  navOpen.value = false;
}

function isActive(section) {
  return route.path.startsWith(`/dashboard/physician/${section}`);
}

/* dropdown */
function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value;
}

function logout() {
  userMenuOpen.value = false;
  navOpen.value = false;
  router.push("/login");
}

function onDocClick(e) {
  if (userMenuOpen.value && userRef.value && !userRef.value.contains(e.target)) {
    userMenuOpen.value = false;
  }
}

function onEsc(e) {
  if (e.key === "Escape") {
    userMenuOpen.value = false;
    navOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onDocClick, true);
  document.addEventListener("keydown", onEsc, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick, true);
  document.removeEventListener("keydown", onEsc, true);
});
</script>

<style scoped>
.phys-shell{
  min-height: 100vh;
  background:#eef3fb;
  display:flex;
}

/* SIDENAV */
.sidenav{
  width:240px;
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
  padding:16px 14px;
  box-shadow: 0 18px 40px rgba(17,36,80,.18);
  flex: 0 0 auto;
}

.brand{
  display:flex;
  align-items:center;
  gap:10px;
  padding:8px 8px 16px;
  margin-bottom:6px;
}

.brand-name{
  font-weight:900;
  letter-spacing:.2px;
  color:#fff;
}

/* NAV */
.nav{
  display:flex;
  flex-direction:column;
  gap:8px;
  padding:6px;
}
.nav-item{
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px;
  border-radius:10px;
  background:transparent;
  border:0;
  color:rgba(255,255,255,.92);
  font-weight:800;
  cursor:pointer;
  text-align:left;
}
.nav-item:hover{ background: rgba(255,255,255,.14); }
.nav-item.active{ background: rgba(255,255,255,.18); }

/* MAIN */
.main{ flex:1; padding:22px 22px 18px; }

/* TOPBAR */
.topbar{
  display:flex;
  justify-content:space-between;
  gap:14px;
  margin-bottom:14px;
  align-items: flex-start;
}

.left-top{
  display:flex;
  align-items:flex-start;
  gap:12px;
}

/* ✅ HAMBURGER (fixed: always renders bars) */
.hamburger{
  display:none; /* shown on mobile via media query */
  width:42px;
  height:42px;
  border-radius:12px;
  border:1px solid rgba(45,78,140,.14);
  background:#f6f8ff;
  cursor:pointer;

  padding:10px;

  /* FORCE layout for bars */
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap:6px;
}

.hamburger .bar{
  display:block !important;
  width:100% !important;
  height:3px !important;
  background:#1f2a44 !important;
  border-radius:3px !important;
}

/* welcome */
.welcome h1{
  margin:0;
  font-size:30px;
  font-weight:900;
  color:#1f2a44;
}
.sub{ margin-top:6px; color:#5c6b86; font-weight:700; }

/* actions */
.top-actions{ display:flex; align-items:center; gap:12px; }

.icon-btn{
  position:relative;
  width:40px;
  height:40px;
  border-radius:12px;
  border:1px solid rgba(45,78,140,.14);
  background:#f6f8ff;
  cursor:pointer;
}
.badge{
  position:absolute;
  top:-6px;
  right:-6px;
  background:#ff5a5a;
  color:#fff;
  font-size:12px;
  font-weight:900;
  border-radius:999px;
  padding:2px 6px;
}

/* user */
.user{ position:relative; }
.user-btn{
  display:flex;
  align-items:center;
  gap:10px;
  background:#f6f8ff;
  border:1px solid rgba(45,78,140,.14);
  border-radius:14px;
  padding:8px 10px;
  cursor:pointer;
}
.avatar{
  width:34px;
  height:34px;
  border-radius:999px;
  border:2px solid #dbe6ff;
}
.user-name{ font-weight:900; font-size:13px; }
.user-role{ font-weight:800; font-size:12px; color:#6b7a95; }
.caret{ font-size:12px; opacity:.6; }

.user-menu{
  position:absolute;
  top:calc(100% + 10px);
  right:0;
  min-width:180px;
  background:#fff;
  border:1px solid rgba(45,78,140,.16);
  border-radius:12px;
  padding:8px;
  z-index: 200;
  box-shadow:0 18px 40px rgba(17,36,80,.18);
}

.menu-item{
  width:100%;
  display:flex;
  gap:10px;
  padding:10px 12px;
  border-radius:8px;
  border:0;
  background:transparent;
  font-weight:900;
  cursor:pointer;
}
.menu-item:hover{ background:#eef4ff; }
.menu-item.danger{ color:#b42318; }

/* =========================
   Responsive: Tablet
========================= */
@media (max-width: 1100px){
  .sidenav{ width:220px; }
  .main{ padding:18px 18px 16px; }

  .welcome h1{ font-size:26px; }
  .sub{ font-size:14px; }
}

/* =========================
   Responsive: Mobile + Off-canvas nav
========================= */
@media (max-width: 860px){
  /* ✅ SHOW hamburger properly */
  .hamburger{
    display:flex; /* IMPORTANT: not inline-flex */
  }

  /* off-canvas sidenav */
  .sidenav{
    position:fixed;
    top:0;
    left:0;
    height:100vh;
    z-index:300;
    transform: translateX(-110%);
    transition: transform .22s ease;
    width:240px;
  }
  .sidenav.open{
    transform: translateX(0);
  }

  /* overlay */
  .nav-overlay{
    position:fixed;
    inset:0;
    z-index:250;
    background: rgba(13,24,48,.35);
    border:0;
    padding:0;
    margin:0;
  }

  .main{ padding:16px 12px 16px; }

  .welcome h1{ font-size:22px; }
  .sub{ font-size:13px; margin-top:4px; }

  .user-meta{ display:none; }
  .user-btn{ padding:8px; }
}

/* Extra small */
@media (max-width: 420px){
  .icon-btn{ width:38px; height:38px; border-radius:12px; }
  .hamburger{ width:40px; height:40px; border-radius:12px; }
}
</style>
