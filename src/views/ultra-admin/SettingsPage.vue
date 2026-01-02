<template>
  <div class="settings-ui">
    <!-- HEADER -->
    <div class="topbar">
      <div class="title-col">
        <h1 class="page-title">Settings</h1>
        <div class="breadcrumb">
          <span class="crumb-strong">Settings Overview</span>
          <span class="crumb-sep">›</span>
          <span class="crumb-muted">Adjust and customize system settings.</span>
        </div>
      </div>
    </div>

    <!-- FILTERS -->
    <div class="filters">
      <div class="search">
        <font-awesome-icon class="fa-ic" icon="magnifying-glass" />
        <input v-model.trim="q" placeholder="Search..." />
      </div>

      <div class="dropdown" ref="catRef">
        <button class="filter-btn" type="button" @click.stop="toggleDropdown('cat')">
          <span>{{ catLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'cat'" class="menu" @click.stop>
          <button class="menu-item" type="button" @click="setCategory('all')">All Categories</button>
          <button class="menu-item" type="button" @click="setCategory('User')">User</button>
          <button class="menu-item" type="button" @click="setCategory('Notifications')">Notifications</button>
          <button class="menu-item" type="button" @click="setCategory('Account')">Account</button>
          <button class="menu-item" type="button" @click="setCategory('Billing')">Billing</button>
          <button class="menu-item" type="button" @click="setCategory('Security')">Security</button>
          <button class="menu-item" type="button" @click="setCategory('System')">System</button>
        </div>
      </div>

      <div class="dropdown" ref="rangeRef">
        <button class="filter-btn" type="button" @click.stop="toggleDropdown('range')">
          <span>{{ rangeLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'range'" class="menu" @click.stop>
          <button class="menu-item" type="button" @click="setRange('Last 7 Days')">Last 7 Days</button>
          <button class="menu-item" type="button" @click="setRange('Last 30 Days')">Last 30 Days</button>
          <button class="menu-item" type="button" @click="setRange('Last 90 Days')">Last 90 Days</button>
          <button class="menu-item" type="button" @click="setRange('This Year')">This Year</button>
        </div>
      </div>

      <div class="dropdown" ref="moreRef">
        <button class="filter-btn" type="button" @click.stop="toggleDropdown('more')">
          <span>Additional Filters</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'more'" class="menu menu-right" @click.stop>
          <button class="menu-item" type="button" @click="applyQuick('Recommended')">Recommended</button>
          <button class="menu-item" type="button" @click="applyQuick('Admin Only')">Admin Only</button>
          <button class="menu-item" type="button" @click="applyQuick('Recently Updated')">Recently Updated</button>
          <div class="menu-sep"></div>
          <button class="menu-item" type="button" @click="clearQuick">Clear</button>
        </div>
      </div>
    </div>

    <!-- GRID (3 columns like screenshot) -->
    <div class="grid">
      <div v-for="card in filteredCards" :key="card.id" class="card">
        <div class="card-head">
          <div class="card-icon">
            <font-awesome-icon class="fa-ic" :icon="card.icon" />
          </div>

          <div class="card-title">
            <div class="h">{{ card.title }}</div>
            <div class="s">{{ card.subtitle }}</div>
          </div>
        </div>

        <div class="card-body">
          <div v-if="card.metrics?.length" class="metrics">
            <div v-for="(m, idx) in card.metrics" :key="idx" class="metric">
              <div class="ml">
                <span class="k">{{ m.label }}</span>
                <span class="v">{{ m.value }}</span>
              </div>
              <div v-if="typeof m.bar === 'number'" class="bar">
                <div class="fill" :style="{ width: clampPct(m.bar) + '%' }"></div>
              </div>
            </div>
          </div>

          <button class="view-btn" type="button" @click="openSetting(card)">
            View Report
          </button>
        </div>
      </div>
    </div>

    <!-- clickout -->
    <div v-if="openDropdown" class="clickout" @click="closeAll"></div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const q = ref("");
const category = ref("all");
const range = ref("Last 30 Days");
const quick = ref("");

const openDropdown = ref(null); // 'cat'|'range'|'more'|null
const catRef = ref(null);
const rangeRef = ref(null);
const moreRef = ref(null);

const cards = ref([
  {
    id: "user-mgmt",
    category: "User",
    icon: "user-gear",
    title: "User Management",
    subtitle: "Manage user roles, permissions, and access levels.",
    tags: ["Admin Only"],
  },
  {
    id: "notif",
    category: "Notifications",
    icon: "bell",
    title: "Notifications",
    subtitle: "Configure alert preferences and notification settings.",
    tags: ["Recommended"],
  },
  {
    id: "acct",
    category: "Account",
    icon: "gear",
    title: "Account Settings",
    subtitle: "Update personal information, password, and preferences.",
    tags: ["Recently Updated"],
  },
  {
    id: "billing-reports",
    category: "Billing",
    icon: "dollar-sign",
    title: "Billing Reports",
    subtitle: "Review financial data, payments, and outstanding balances.",
    metrics: [
      { label: "Outstanding Balance", value: "$74,320", bar: 58 },
      { label: "Paid Invoices", value: "$128,140", bar: 76 },
      { label: "Pending Insurance", value: "$23,450", bar: 42 },
    ],
  },
  {
    id: "system",
    category: "System",
    icon: "gear",
    title: "System Settings",
    subtitle: "Customize system preferences, themes, and specialties.",
    tags: ["Recommended"],
  },
  {
    id: "integration",
    category: "System",
    icon: "plug-circle-bolt",
    title: "Integration Settings",
    subtitle: "Configure third-party integrations and data syncing.",
  },
  {
    id: "dept-reports",
    category: "System",
    icon: "building",
    title: "Department Reports",
    subtitle: "Evaluate department performance and productivity.",
    metrics: [
      { label: "Emergency", value: "26 Staff • 240 Patients", bar: 66 },
      { label: "Cardiology", value: "25 Staff • 180 Patients", bar: 56 },
      { label: "Pediatrics", value: "20 Staff • 95 Patients", bar: 38 },
    ],
  },
  {
    id: "security",
    category: "Security",
    icon: "shield-halved",
    title: "Security Settings",
    subtitle: "Manage security protocols, audits, and access control.",
    metrics: [
      { label: "Lab Tests", value: "346 This Month", bar: 64 },
      { label: "Pending", value: "48", bar: 24 },
      { label: "Abnormal", value: "64", bar: 40 },
    ],
    tags: ["Admin Only"],
  },
  {
    id: "security-2",
    category: "Security",
    icon: "shield-halved",
    title: "Security Settings",
    subtitle: "Manage security protocols, audits, and compliance settings.",
    metrics: [
      { label: "Billing Settings", value: "S-3", bar: 70 },
      { label: "Completed", value: "234", bar: 52 },
      { label: "Abnormal", value: "64", bar: 40 },
    ],
    tags: ["Admin Only"],
  },
  {
    id: "notif-templates",
    category: "Notifications",
    icon: "envelope",
    title: "Notification Templates",
    subtitle: "Create and customize email and alert templates.",
  },
  {
    id: "billing-settings",
    category: "Billing",
    icon: "credit-card",
    title: "Billing Settings",
    subtitle: "Configure billing preference invoice settings.",
    tags: ["Recommended"],
  },
  {
    id: "audit",
    category: "Security",
    icon: "file-lines",
    title: "Audit Logs",
    subtitle: "View system activity logs and audit trails.",
    tags: ["Admin Only"],
  },
]);

const catLabel = computed(() => (category.value === "all" ? "All Categories" : category.value));
const rangeLabel = computed(() => range.value);

const filteredCards = computed(() => {
  const term = q.value.trim().toLowerCase();

  return cards.value.filter((c) => {
    const inCat = category.value === "all" || c.category === category.value;

    const hit =
      !term ||
      `${c.title} ${c.subtitle} ${c.category}`.toLowerCase().includes(term);

    const okQuick =
      !quick.value || (c.tags || []).includes(quick.value);

    return inCat && hit && okQuick;
  });
});

watch([q, category, range, quick], () => closeAll());

function toggleDropdown(name) {
  openDropdown.value = openDropdown.value === name ? null : name;
}
function closeAll() {
  openDropdown.value = null;
}

function setCategory(v) { category.value = v; closeAll(); }
function setRange(v) { range.value = v; closeAll(); }

function applyQuick(v) { quick.value = v; closeAll(); }
function clearQuick() { quick.value = ""; closeAll(); }

function openSetting(card) {
  closeAll();
  window.alert(`Open: ${card.title} (UI only)`);
}

function onDocClick(e) {
  if (!openDropdown.value) return;
  const t = e.target;
  const els = [catRef.value, rangeRef.value, moreRef.value].filter(Boolean);
  if (!els.some((el) => el.contains(t))) closeAll();
}
function onEsc(e) {
  if (e.key === "Escape") closeAll();
}

onMounted(() => {
  document.addEventListener("click", onDocClick, true);
  document.addEventListener("keydown", onEsc, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick, true);
  document.removeEventListener("keydown", onEsc, true);
});

function clampPct(n) {
  const x = Number(n || 0);
  return Math.max(0, Math.min(100, x));
}
</script>

<style scoped>
/* shell */
.settings-ui{
  padding: 22px 22px 16px;
  background: #eef3fb;
  min-height: calc(100vh - 60px);
}

/* header */
.topbar{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:16px;
  margin-bottom:14px;
}
.page-title{
  margin:0;
  font-size:32px;
  letter-spacing:-0.02em;
  font-weight:700;
  color:#1f2a44;
}
.breadcrumb{
  margin-top:6px;
  font-size:14px;
  display:flex;
  align-items:center;
  gap:10px;
}
.crumb-strong{ color:#26355f; font-weight:600; }
.crumb-sep{ opacity:.5; }
.crumb-muted{ opacity:.7; }

/* filters */
.filters{
  display:flex;
  align-items:center;
  gap:14px;
  flex-wrap:wrap;
  margin: 6px 0 14px;
}
.search{
  flex: 1 1 260px;
  display:flex;
  align-items:center;
  gap:10px;
  background:#f6f8ff;
  border:1px solid rgba(45, 78, 140, .14);
  border-radius:8px;
  padding:10px 12px;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}
.search input{
  border:none;
  outline:none;
  background:transparent;
  width:100%;
  font-size:14px;
}
.filter-btn{
  display:inline-flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  min-width: 170px;
  padding:10px 12px;
  background:#f6f8ff;
  border:1px solid rgba(45, 78, 140, .14);
  border-radius:8px;
  cursor:pointer;
  font-weight:600;
  color:#33415c;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}

/* dropdown */
.dropdown{ position:relative; }
.menu{
  position:absolute;
  top: calc(100% + 10px);
  left:0;
  min-width:220px;
  background:#ffffff;
  border:1px solid rgba(45, 78, 140, .16);
  border-radius:10px;
  padding:8px;
  box-shadow: 0 18px 40px rgba(17, 36, 80, 0.18);
  z-index: 9999;
}
.menu-right{ left:auto; right:0; }
.menu-item{
  width:100%;
  text-align:left;
  border:none;
  background:transparent;
  padding:10px 10px;
  border-radius:8px;
  font-weight:600;
  color:#2b3a5b;
  cursor:pointer;
}
.menu-item:hover{ background:#eef4ff; }
.menu-sep{
  height:1px;
  background: rgba(45, 78, 140, .14);
  margin:6px 4px;
}

/* GRID: 3 columns like screenshot */
.grid{
  display:grid;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
  gap:14px;
}

/* card */
.card{
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(45, 78, 140, .14);
  border-radius: 12px;
  box-shadow: 0 14px 28px rgba(17, 36, 80, 0.10);
  overflow:hidden;
}
.card-head{
  padding: 14px 14px 10px;
  display:flex;
  align-items:flex-start;
  gap:12px;
}
.card-title .h{
  font-weight: 800;
  color:#1f2a44;
  font-size: 18px;
  line-height:1.1;
}
.card-title .s{
  margin-top: 4px;
  color:#5b6b8a;
  font-weight: 600;
  font-size: 13px;
}

/* BIG ICON like design */
.card-icon{
  width: 58px;
  height: 58px;
  border-radius: 14px;
  display:flex;
  align-items:center;
  justify-content:center;
  border: 1px solid rgba(45, 78, 140, .12);
  background: #f4f7ff;
  box-shadow: 0 10px 18px rgba(17, 36, 80, 0.06);
}
.card-icon :deep(svg){
  width: 28px;
  height: 28px;
}

/* metrics */
.card-body{
  padding: 0 14px 14px;
}
.metrics{
  background: rgba(245,248,255,0.85);
  border: 1px solid rgba(45, 78, 140, .10);
  border-radius: 10px;
  padding: 10px 10px;
}
.metric{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding: 7px 6px;
}
.metric + .metric{ border-top: 1px solid rgba(45, 78, 140, .08); }

.ml{
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
  color:#2b3a5b;
}
.k{ font-weight: 700; }
.v{ font-weight: 800; color:#1f2a44; }

.bar{
  width: 120px;
  height: 10px;
  border-radius: 999px;
  background: rgba(45, 78, 140, .12);
  overflow:hidden;
  flex: 0 0 auto;
}
.fill{
  height:100%;
  border-radius:999px;
  background: linear-gradient(90deg, #2f86ff, #43d8b7);
}

/* view button */
.view-btn{
  width:100%;
  margin-top: 10px;
  border:none;
  border-radius: 8px;
  padding: 11px 12px;
  cursor:pointer;
  font-weight:800;
  color:#fff;
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  box-shadow: 0 10px 22px rgba(47, 134, 255, 0.22);
}

/* clickout */
.clickout{
  position:fixed;
  inset:0;
  z-index: 9000;
  background:transparent;
}

/* FontAwesome minimal */
.fa-ic{
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -0.125em;
  line-height: 1;
}
.fa-caret{
  font-size: .85em;
  opacity: .75;
}
:deep(.fa-ic) svg{
  width: 1em;
  height: 1em;
  display: block;
}

/* responsive */
@media (max-width: 1180px){
  .grid{ grid-template-columns: repeat(2, minmax(280px, 1fr)); }
}
@media (max-width: 860px){
  .grid{ grid-template-columns: 1fr; }
  .filter-btn{ min-width: 180px; flex:1 1 180px; }
}
</style>
