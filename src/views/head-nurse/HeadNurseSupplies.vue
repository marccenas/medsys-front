<!-- src/views/head-nurse/HnSupplies.vue (or wherever your Head Nurse pages live) -->
<template>
  <section class="hn-supplies">
    <!-- Page title -->
    <div class="dash-top">
      <div class="dash-title">
        <h1>Supplies</h1>
        <p class="subtle">
          Supply Management <span class="sep">›</span> Analyze and manage medical supplies in the unit.
        </p>
      </div>
    </div>

    <!-- KPI row -->
    <div class="kpi-row">
      <div class="kpi kpi-blue">
        <div class="kpi-left">
          <div class="kpi-label">Total Items</div>
        </div>
        <div class="kpi-value">{{ kpis.total }}</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-left">
          <div class="kpi-label">Low Stock</div>
        </div>
        <div class="kpi-value">{{ kpis.low }}</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-left">
          <div class="kpi-label">Out of Stock</div>
        </div>
        <div class="kpi-value">{{ kpis.out }}</div>
      </div>

      <div class="kpi kpi-orange2">
        <div class="kpi-left">
          <div class="kpi-label">Expiring Soon</div>
        </div>
        <div class="kpi-value">{{ kpis.expiring }}</div>
      </div>
    </div>

    <!-- Main card -->
    <section class="card glass">
      <!-- Filters row -->
      <div class="filters">
        <div class="search-row">
          <font-awesome-icon class="search-ico" icon="magnifying-glass" />
          <input v-model="query" class="search" placeholder="Search..." type="text" />
        </div>

        <div class="filter-dd" @click.stop>
          <button class="filter-dd-btn" type="button" @click="toggleDd('cat')">
            <span>{{ categoryLabel }}</span>
            <font-awesome-icon icon="chevron-down" />
          </button>
          <div v-if="openDd === 'cat'" class="filter-dd-menu">
            <button class="filter-dd-item" type="button" @click="setCategory('all')">All Categories</button>
            <button class="filter-dd-item" type="button" @click="setCategory('IV Fluids')">IV Fluids</button>
            <button class="filter-dd-item" type="button" @click="setCategory('PPE')">PPE</button>
            <button class="filter-dd-item" type="button" @click="setCategory('Injections')">Injections</button>
            <button class="filter-dd-item" type="button" @click="setCategory('Medications')">Medications</button>
            <button class="filter-dd-item" type="button" @click="setCategory('Disinfectants')">Disinfectants</button>
            <button class="filter-dd-item" type="button" @click="setCategory('Dressings')">Dressings</button>
          </div>
        </div>

        <div class="filter-dd" @click.stop>
          <button class="filter-dd-btn" type="button" @click="toggleDd('status')">
            <span>{{ statusLabel }}</span>
            <font-awesome-icon icon="chevron-down" />
          </button>
          <div v-if="openDd === 'status'" class="filter-dd-menu">
            <button class="filter-dd-item" type="button" @click="setStatus('all')">All Statuses</button>
            <button class="filter-dd-item" type="button" @click="setStatus('Adequate')">Adequate</button>
            <button class="filter-dd-item" type="button" @click="setStatus('Low Stock')">Low Stock</button>
            <button class="filter-dd-item" type="button" @click="setStatus('Out of Stock')">Out of Stock</button>
            <button class="filter-dd-item" type="button" @click="setStatus('Expiring Soon')">Expiring Soon</button>
          </div>
        </div>

        <div class="filter-dd sm" @click.stop>
          <button class="filter-dd-btn sm" type="button" @click="toggleDd('from')">
            <span>From</span>
            <font-awesome-icon icon="chevron-down" />
          </button>
          <div v-if="openDd === 'from'" class="filter-dd-menu right">
            <button class="filter-dd-item" type="button" @click="closeAll">Apr 1, 2024</button>
            <button class="filter-dd-item" type="button" @click="closeAll">Apr 15, 2024</button>
            <button class="filter-dd-item" type="button" @click="closeAll">May 1, 2024</button>
          </div>
        </div>

        <div class="filter-dd sm" @click.stop>
          <button class="filter-dd-btn sm" type="button" @click="toggleDd('to')">
            <span>To</span>
            <font-awesome-icon icon="chevron-down" />
          </button>
          <div v-if="openDd === 'to'" class="filter-dd-menu right">
            <button class="filter-dd-item" type="button" @click="closeAll">May 10, 2024</button>
            <button class="filter-dd-item" type="button" @click="closeAll">May 20, 2024</button>
            <button class="filter-dd-item" type="button" @click="closeAll">Jun 1, 2024</button>
          </div>
        </div>

        <button class="btn-lite" type="button">
          Generate Report
        </button>
      </div>

      <!-- Section title -->
      <div class="section-title">
        <div class="section-left">
          <font-awesome-icon class="section-ico" icon="clipboard-list" />
          <h2>Supplies</h2>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <table class="tbl">
          <colgroup>
            <col class="w-check" />
            <col class="w-name" />
            <col class="w-cat" />
            <col class="w-stock" />
            <col class="w-status" />
            <col class="w-exp" />
            <col class="w-act" />
          </colgroup>

          <thead>
            <tr>
              <th class="w-check">
                <input
                  ref="selectAllRef"
                  type="checkbox"
                  :checked="isAllOnPageSelected"
                  @change="toggleAllOnPage"
                />
              </th>
              <th>
                <button class="th-sort" type="button">
                  Name <font-awesome-icon icon="chevron-down" />
                </button>
              </th>
              <th>
                <button class="th-sort" type="button">
                  Category <font-awesome-icon icon="chevron-down" />
                </button>
              </th>
              <th>
                <button class="th-sort" type="button">
                  Stock <font-awesome-icon icon="chevron-down" />
                </button>
              </th>
              <th>
                <button class="th-sort" type="button">
                  Status <font-awesome-icon icon="chevron-down" />
                </button>
              </th>
              <th>
                <button class="th-sort" type="button">
                  Expires <font-awesome-icon icon="chevron-down" />
                </button>
              </th>
              <th>
                <button class="th-sort" type="button">
                  Actions <font-awesome-icon icon="chevron-down" />
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in pagedRows" :key="row.id">
              <td class="w-check">
                <input type="checkbox" :checked="selectedIds.has(row.id)" @change="toggleRow(row.id)" />
              </td>

              <td class="name-cell">
                <div class="name-main">
                  <span class="item-ico" :class="row.iconBg">
                    <font-awesome-icon :icon="row.icon" />
                  </span>
                  <div class="name-text">
                    <div class="nm">{{ row.name }}</div>
                    <div class="sub">{{ row.sub }}</div>
                  </div>
                </div>
              </td>

              <td>
                <span class="pill pill-soft">{{ row.category }}</span>
              </td>

              <td>
                <div class="stock-cell">
                  <div class="bar">
                    <span class="fill" :style="{ width: stockWidth(row) }" :class="stockClass(row)" />
                  </div>
                  <div class="qty">{{ row.stock }}</div>
                </div>
              </td>

              <td>
                <span class="status" :class="statusClass(row.status)">{{ row.status }}</span>
              </td>

              <td class="exp-cell">
                <div class="exp-date">{{ row.expDate }}</div>
                <div class="exp-time">{{ row.expTime }}</div>
              </td>

              <td class="act-cell">
                <div class="act-row">
                  <div class="mini-dd" @click.stop>
                    <button class="act-btn" type="button" @click="toggleRowDd(row.id, 'restock')">
                      Restock <font-awesome-icon icon="chevron-down" />
                    </button>
                    <div v-if="rowDdKey === ddKey(row.id, 'restock')" class="mini-menu">
                      <button class="mini-item" type="button" @click="closeAll">Restock 10</button>
                      <button class="mini-item" type="button" @click="closeAll">Restock 25</button>
                      <button class="mini-item" type="button" @click="closeAll">Restock 50</button>
                    </div>
                  </div>

                  <button class="act-btn outline" type="button">
                    Manage
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="tfoot">
          <div class="showing">
            Showing {{ showingStart }} to {{ showingEnd }} of {{ filteredRows.length }} items
          </div>

          <div class="pager">
            <button class="pg" type="button" @click="page = Math.max(1, page - 1)">
              <font-awesome-icon icon="angle-left" />
            </button>
            <button class="pg" type="button" :class="{ on: page === 1 }" @click="page = 1">1</button>
            <button class="pg" type="button" :class="{ on: page === 2 }" @click="page = 2">2</button>
            <button class="pg" type="button" :class="{ on: page === 3 }" @click="page = 3">3</button>
            <button class="pg" type="button" @click="page = page + 1">
              <font-awesome-icon icon="angle-right" />
            </button>

            <div class="perpage">
              <button class="pg" type="button" @click="toggleDd('pp')" style="display:inline-flex; gap:8px;">
                {{ perPage }} / page <font-awesome-icon icon="chevron-down" />
              </button>
              <div v-if="openDd === 'pp'" class="filter-dd-menu right" style="top: calc(100% + 8px);">
                <button class="filter-dd-item" type="button" @click="setPerPage(8)">8 / page</button>
                <button class="filter-dd-item" type="button" @click="setPerPage(10)">10 / page</button>
                <button class="filter-dd-item" type="button" @click="setPerPage(20)">20 / page</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom grid: comment + alerts + ordering history -->
      <div class="below">
        <section class="note card glass">
          <div class="note-head">
            <div class="note-user">
              <img class="ava" :src="headNurse.avatar" alt="avatar" />
              <div>
                <div class="note-name">{{ headNurse.name }}</div>
                <div class="note-role">{{ headNurse.role }}</div>
              </div>
            </div>
          </div>

          <div class="note-msg">
            Bulk restock has been completed. Fentanyl, N95 Masks, and insulin have been replenished and are now up to date!
          </div>

          <button class="note-link" type="button">
            View All Orders <font-awesome-icon icon="chevron-right" />
          </button>
        </section>

        <section class="low card glass">
          <div class="panel-title2">
            <div class="panel-txt">Low Stock Alerts</div>

            <div class="filter-dd xs" @click.stop>
              <button class="chip" type="button" @click="toggleDd('bulk')">
                Bulk actions <font-awesome-icon icon="chevron-down" />
              </button>
              <div v-if="openDd === 'bulk'" class="filter-dd-menu right">
                <button class="filter-dd-item" type="button" @click="closeAll">Restock selected</button>
                <button class="filter-dd-item" type="button" @click="closeAll">Export list</button>
              </div>
            </div>
          </div>

          <div class="low-list">
            <div class="low-row" v-for="a in lowAlerts" :key="a.id">
              <div class="low-left">
                <input
                  type="checkbox"
                  class="ck"
                  :checked="alertSelected.has(a.id)"
                  @change="toggleAlert(a.id)"
                />
                <div class="low-name">{{ a.name }}</div>
              </div>

              <div class="low-right">
                <div class="low-bar">
                  <span class="low-fill" :class="a.level" :style="{ width: a.bar + '%' }" />
                </div>
                <div class="low-meta" :class="{ danger: a.meta === 'Out of Stock' }">
                  {{ a.meta }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="hist card glass">
          <div class="panel-title2">
            <div class="panel-txt">Ordering History</div>
          </div>

          <div class="hist-list">
            <button class="hist-item" v-for="h in orderingHistory" :key="h.id" type="button">
              <span class="hist-ico" :class="h.bg">
                <font-awesome-icon :icon="h.icon" />
              </span>
              <div class="hist-mid">
                <div class="hist-title">{{ h.title }}</div>
                <div class="hist-sub">{{ h.sub }}</div>
              </div>
              <div class="hist-time">{{ h.when }}</div>
            </button>
          </div>
        </section>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const query = ref("");
const category = ref("all");
const status = ref("all");

const openDd = ref(null);       // filters dropdown
const rowDdKey = ref(null);     // row action dropdown
const page = ref(1);
const perPage = ref(8);

/* selections (table) */
const selectedIds = ref(new Set());
const selectAllRef = ref(null);

/* low alerts selections */
const alertSelected = ref(new Set());

const headNurse = {
  name: "Sarah Thompson · RN",
  role: "Head Nurse / Nurse Unit Manager",
  avatar: "https://i.pravatar.cc/80?img=47",
};

const rows = ref([
  {
    id: "s1",
    name: "IV Fluid Bags",
    sub: "IV Fluids",
    category: "IV Fluids",
    stock: 28,
    status: "Adequate",
    expDate: "May 15, 2024",
    expTime: "14:30",
    icon: "droplet",
    iconBg: "bg-blue",
  },
  {
    id: "s2",
    name: "N95 Masks",
    sub: "Personal Equipment",
    category: "PPE",
    stock: 4,
    status: "Low Stock",
    expDate: "May 15, 2024",
    expTime: "10:00",
    icon: "shield",
    iconBg: "bg-orange",
  },
  {
    id: "s3",
    name: "Syringes (10ml)",
    sub: "Needles",
    category: "Injections",
    stock: 0,
    status: "Out of Stock",
    expDate: "May 12, 2024",
    expTime: "12:30",
    icon: "syringe",
    iconBg: "bg-red",
  },
  {
    id: "s4",
    name: "IV Catheters",
    sub: "Fentanyl / Aor Hospital",
    category: "IV Fluids",
    stock: 5,
    status: "Low Stock",
    expDate: "May 12, 2024",
    expTime: "13:00",
    icon: "plug-circle-bolt",
    iconBg: "bg-blue",
  },
  {
    id: "s5",
    name: "Fentanyl (Ampoules)",
    sub: "Foad Sen: uies",
    category: "Medications",
    stock: 6,
    status: "Expiring Soon",
    expDate: "Apr 26, 2024",
    expTime: "11:00 AM",
    icon: "pills",
    iconBg: "bg-orange",
  },
  {
    id: "s6",
    name: "Hand Sanitizers",
    sub: "Dainetss",
    category: "Disinfectants",
    stock: 12,
    status: "Adequate",
    expDate: "May 3, 2024",
    expTime: "",
    icon: "hand-sparkles",
    iconBg: "bg-blue",
  },
  {
    id: "s7",
    name: "Wound Dressings",
    sub: "Dressings",
    category: "Dressings",
    stock: 24,
    status: "Expiring Soon",
    expDate: "May 3, 2024",
    expTime: "",
    icon: "bandage",
    iconBg: "bg-orange",
  },
]);

/* If you don't have these FA icons yet, replace with ones you already added:
   droplet, syringe, bandage, hand-sparkles are NOT in your list.
   Replace them with faFlaskVial / faFlask / faNotesMedical / faHeart etc. */
watch(
  () => rows.value,
  () => {},
  { deep: true }
);

/* ✅ use icons from your library (safe defaults) */
rows.value = rows.value.map((r) => ({
  ...r,
  icon:
    r.icon === "droplet"
      ? "flask-vial"
      : r.icon === "syringe"
      ? "flask"
      : r.icon === "bandage"
      ? "notes-medical"
      : r.icon === "hand-sparkles"
      ? "wand-magic-sparkles"
      : r.icon,
}));

const kpis = computed(() => {
  const total = 152; // match UI
  const low = rows.value.filter((r) => r.status === "Low Stock").length;
  const out = rows.value.filter((r) => r.status === "Out of Stock").length;
  const expiring = rows.value.filter((r) => r.status === "Expiring Soon").length;
  return { total, low, out, expiring };
});

const categoryLabel = computed(() => (category.value === "all" ? "All Categories" : category.value));
const statusLabel = computed(() => (status.value === "all" ? "All Statuses" : status.value));

const filteredRows = computed(() => {
  const q = query.value.trim().toLowerCase();
  return rows.value.filter((r) => {
    const matchQ = !q || `${r.name} ${r.sub} ${r.category} ${r.status}`.toLowerCase().includes(q);
    const matchCat = category.value === "all" || r.category === category.value;
    const matchStatus = status.value === "all" || r.status === status.value;
    return matchQ && matchCat && matchStatus;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / perPage.value)));

const pagedRows = computed(() => {
  const p = Math.min(page.value, totalPages.value);
  const start = (p - 1) * perPage.value;
  return filteredRows.value.slice(start, start + perPage.value);
});

const showingStart = computed(() => (filteredRows.value.length ? (page.value - 1) * perPage.value + 1 : 0));
const showingEnd = computed(() => Math.min(page.value * perPage.value, filteredRows.value.length));

/* ✅ Select-all behavior (page-based) */
const isAllOnPageSelected = computed(() => {
  if (!pagedRows.value.length) return false;
  return pagedRows.value.every((r) => selectedIds.value.has(r.id));
});
const isSomeOnPageSelected = computed(() => {
  if (!pagedRows.value.length) return false;
  const any = pagedRows.value.some((r) => selectedIds.value.has(r.id));
  return any && !isAllOnPageSelected.value;
});

watch([isSomeOnPageSelected, isAllOnPageSelected], async () => {
  await nextTick();
  if (selectAllRef.value) selectAllRef.value.indeterminate = isSomeOnPageSelected.value;
});

function toggleAllOnPage() {
  const next = !isAllOnPageSelected.value;
  const s = new Set(selectedIds.value);
  pagedRows.value.forEach((r) => (next ? s.add(r.id) : s.delete(r.id)));
  selectedIds.value = s;
}

function toggleRow(id) {
  const s = new Set(selectedIds.value);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  selectedIds.value = s;
}

/* page-size changes should reset selection (per your app rules) */
function setPerPage(n) {
  perPage.value = n;
  page.value = 1;
  selectedIds.value = new Set();
  closeAll();
}

watch([query, category, status], () => {
  page.value = 1;
  selectedIds.value = new Set();
});

/* dropdowns */
function toggleDd(key) {
  openDd.value = openDd.value === key ? null : key;
  rowDdKey.value = null;
}
function closeAll() {
  openDd.value = null;
  rowDdKey.value = null;
}
function setCategory(v) {
  category.value = v;
  closeAll();
}
function setStatus(v) {
  status.value = v;
  closeAll();
}
function ddKey(id, kind) {
  return `${id}:${kind}`;
}
function toggleRowDd(id, kind) {
  const k = ddKey(id, kind);
  rowDdKey.value = rowDdKey.value === k ? null : k;
  openDd.value = null;
}

/* close dropdowns on outside click */
function onWindowClick() {
  closeAll();
}
onMounted(() => window.addEventListener("click", onWindowClick, true));
onBeforeUnmount(() => window.removeEventListener("click", onWindowClick, true));

/* stock visuals */
function stockWidth(r) {
  const max = 30; // visual scale to match UI bars
  const v = Math.max(0, Math.min(100, (r.stock / max) * 100));
  return `${v}%`;
}
function stockClass(r) {
  if (r.status === "Out of Stock") return "is-red";
  if (r.status === "Low Stock") return "is-orange";
  if (r.status === "Expiring Soon") return "is-orange";
  return "is-green";
}
function statusClass(s) {
  if (s === "Adequate") return "ok";
  if (s === "Low Stock") return "warn";
  if (s === "Out of Stock") return "bad";
  return "soon";
}

/* low stock alerts + ordering history */
const lowAlerts = ref([
  { id: "a1", name: "N95 Masks", bar: 78, meta: "4", level: "lvl-orange" },
  { id: "a2", name: "Syringes (10ml)", bar: 88, meta: "Out of Stock", level: "lvl-red" },
  { id: "a3", name: "IV Catheters", bar: 62, meta: "May 12, 2024", level: "lvl-orange" },
]);

function toggleAlert(id) {
  const s = new Set(alertSelected.value);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  alertSelected.value = s;
}

const orderingHistory = ref([
  { id: 1, title: "Fentanyl (Ampoules)", sub: "Fone: Hao Larts", when: "4 days ago", icon: "pills", bg: "h-orange" },
  { id: 2, title: "N95 Masks", sub: "Perrods Late", when: "5 days ago", icon: "shield", bg: "h-blue" },
  { id: 3, title: "Insulin (Vials)", sub: "Mediche: 4 masks", when: "1 week ago", icon: "flask-vial", bg: "h-orange" },
]);
</script>

<style scoped>
/* ===== Page shell ===== */
.hn-supplies{ padding: 18px 18px 24px; }
.sep{ margin: 0 6px; opacity: .55; }
.dash-title h1{ margin:0; font-size: 30px; font-weight: 900; letter-spacing:-0.02em; }
.dash-title p{ margin: 6px 0 0; font-size: 14px; }

/* ===== KPI ===== */
.kpi-row{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 12px 0 14px;
}
.kpi{
  border-radius: 14px;
  padding: 14px 16px;
  color: #fff;
  display:flex;
  align-items:center;
  justify-content:space-between;
  box-shadow: 0 10px 24px rgba(0,0,0,0.10);
  min-height: 70px;
}
.kpi-label{ font-weight: 800; font-size: 14px; opacity: 0.96; }
.kpi-value{ font-weight: 900; font-size: 34px; line-height: 1; letter-spacing: -0.03em; }
.kpi-blue{ background: linear-gradient(135deg, #4f77ff, #2f56ff); }
.kpi-orange{ background: linear-gradient(135deg, #ffbf70, #ff9a3d); }
.kpi-red{ background: linear-gradient(135deg, #ff6c6c, #ff4a4a); }
.kpi-orange2{ background: linear-gradient(135deg, #ff8f6b, #ff6a4a); }

/* ===== Card glass ===== */
.card{
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  background: rgba(255,255,255,0.60);
  box-shadow: 0 10px 26px rgba(35, 55, 110, 0.12);
  overflow:hidden;
}
.glass{ backdrop-filter: blur(10px); }

/* ===== Filters ===== */
.filters{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  flex-wrap: wrap;
}
.search-row{ position: relative; width: 330px; max-width: 52vw; flex: 1 1 260px; }
.search{
  width:100%;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 12px 10px 38px;
  outline: none;
}
.search-ico{ position:absolute; left: 12px; top: 11px; opacity: .65; }

.btn-lite{
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.60);
  font-weight: 900;
  cursor: pointer;
  color: rgba(30,40,70,0.92);
}
.btn-lite:hover{ background: rgba(255,255,255,0.80); }

/* ===== Dropdowns ===== */
.filter-dd{ position: relative; display: inline-flex; flex: 0 0 auto; }
.filter-dd.sm{ min-width: 90px; }
.filter-dd.xs{ }
.filter-dd-btn{
  height: 40px; min-width: 180px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.60);
  font-size: 14px; font-weight: 900;
  color: rgba(30,40,70,0.95);
  display: inline-flex; align-items:center; justify-content:space-between; gap: 10px;
  cursor: pointer;
}
.filter-dd-btn.sm{ min-width: 92px; justify-content:center; gap: 10px; }

.filter-dd-menu{
  position:absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 100%;
  z-index: 9999;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 40px rgba(20, 30, 70, 0.22);
  padding: 6px;
}
.filter-dd-menu.right{ left:auto; right:0; }
.filter-dd-item{
  width:100%;
  border:none;
  background:transparent;
  text-align:left;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 900;
  color: rgba(30,40,70,0.92);
  cursor:pointer;
}
.filter-dd-item:hover{ background: rgba(47,86,255,0.10); color: #2f56ff; }

/* ===== Section title ===== */
.section-title{
  padding: 12px 14px;
  display:flex;
  align-items:center;
  justify-content: space-between;
}
.section-left{ display:flex; align-items:center; gap: 10px; }
.section-ico{ opacity: .9; color: rgba(47,86,255,0.95); }
.section-title h2{
  margin:0;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: rgba(30,40,70,0.92);
}

/* ===== Table ===== */
.table-wrap{ padding: 0 12px 14px; }
.tbl{
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255,255,255,0.45);
  table-layout: fixed;
}

.tbl thead th{
  font-size: 13px;
  color: rgba(60,70,95,0.70);
  font-weight: 900;
  padding: 12px 12px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  text-align:left;
  background: rgba(255,255,255,0.35);
}
.tbl tbody td{
  padding: 12px 12px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  vertical-align: middle;
}
.tbl tbody tr:last-child td{ border-bottom: 0; }

.th-sort{
  border: none;
  background: transparent;
  padding: 0;
  font-weight: 900;
  color: inherit;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  cursor: default;
}

.w-check{ width: 44px; }
.w-name{ width: 34%; }
.w-cat{ width: 18%; }
.w-stock{ width: 16%; }
.w-status{ width: 14%; }
.w-exp{ width: 14%; }
.w-act{ width: 20%; }

.name-cell{ min-width: 0; }
.name-main{ display:flex; align-items:center; gap: 10px; min-width:0; }
.item-ico{
  width: 30px; height: 30px;
  border-radius: 8px;
  display:grid; place-items:center;
  color: rgba(20,30,60,0.92);
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.60);
}
.item-ico.bg-blue{ background: rgba(79,119,255,0.18); border-color: rgba(79,119,255,0.25); }
.item-ico.bg-orange{ background: rgba(255,154,61,0.18); border-color: rgba(255,154,61,0.25); }
.item-ico.bg-red{ background: rgba(255,74,74,0.16); border-color: rgba(255,74,74,0.22); }

.name-text{ min-width:0; }
.nm{
  font-weight: 900;
  color: rgba(30,40,70,0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sub{
  margin-top: 2px;
  font-size: 12px;
  color: rgba(100,116,139,0.95);
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pill{
  display:inline-flex;
  align-items:center;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 900;
  border: 1px solid rgba(0,0,0,0.06);
}
.pill-soft{
  background: rgba(47,86,255,0.10);
  color: rgba(47,86,255,0.95);
  border-color: rgba(47,86,255,0.15);
}

.stock-cell{ display:flex; align-items:center; gap: 10px; }
.bar{
  flex: 1 1 auto;
  height: 12px;
  border-radius: 999px;
  background: rgba(15,23,42,0.10);
  border: 1px solid rgba(0,0,0,0.06);
  overflow: hidden;
}
.fill{
  display:block;
  height: 100%;
  border-radius: 999px;
}
.fill.is-green{ background: linear-gradient(90deg, rgba(26,142,132,0.95), rgba(35,181,168,0.85)); }
.fill.is-orange{ background: linear-gradient(90deg, rgba(255,140,58,0.95), rgba(255,179,90,0.85)); }
.fill.is-red{ background: linear-gradient(90deg, rgba(255,74,74,0.95), rgba(255,108,108,0.85)); }
.qty{ width: 36px; text-align:right; font-weight: 900; color: rgba(30,40,70,0.92); }

.status{
  display:inline-flex;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 900;
  border: 1px solid rgba(0,0,0,0.06);
}
.status.ok{ background: rgba(26,142,132,0.14); color: rgba(26,142,132,0.95); border-color: rgba(26,142,132,0.18); }
.status.warn{ background: rgba(255,154,61,0.16); color: rgba(255,140,58,0.98); border-color: rgba(255,154,61,0.18); }
.status.bad{ background: rgba(255,74,74,0.14); color: rgba(255,74,74,0.98); border-color: rgba(255,74,74,0.18); }
.status.soon{ background: rgba(255,106,74,0.14); color: rgba(255,106,74,0.98); border-color: rgba(255,106,74,0.18); }

.exp-cell{ text-align:right; }
.exp-date{ font-weight: 900; color: rgba(30,40,70,0.90); }
.exp-time{ margin-top: 2px; font-weight: 800; font-size: 12px; color: rgba(100,116,139,0.95); }

.act-cell{ }
.act-row{ display:flex; justify-content:flex-end; gap: 10px; }
.act-btn{
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(47,86,255,0.25);
  background: rgba(47,86,255,0.92);
  color: #fff;
  font-weight: 900;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  gap: 8px;
}
.act-btn:hover{ filter: brightness(1.02); }
.act-btn.outline{
  background: rgba(255,255,255,0.55);
  color: rgba(47,86,255,0.95);
}
.mini-dd{ position: relative; }
.mini-menu{
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 9999;
  width: 160px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 40px rgba(20, 30, 70, 0.22);
  padding: 6px;
}
.mini-item{
  width:100%;
  border: none;
  background: transparent;
  text-align:left;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 900;
  cursor: pointer;
}
.mini-item:hover{ background: rgba(47,86,255,0.10); color: #2f56ff; }

/* footer */
.tfoot{
  margin-top: 10px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
  color: rgba(60,70,95,0.72);
  font-weight: 900;
  font-size: 13px;
  padding: 0 2px;
}
.pager{ display:flex; align-items:center; gap: 6px; }
.pg{
  height: 30px;
  min-width: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.55);
  font-weight: 900;
  cursor:pointer;
}
.pg.on{ background: rgba(47,86,255,0.14); border-color: rgba(47,86,255,0.18); color: #2f56ff; }
.perpage{ position: relative; }

/* ===== Below grid ===== */
.below{
  display:grid;
  grid-template-columns: 1.2fr 1.2fr 1fr;
  gap: 12px;
  padding: 0 12px 14px;
}

.note{ padding: 14px 16px; }
.note-head{ display:flex; align-items:center; justify-content: space-between; }
.note-user{ display:flex; gap: 10px; align-items:center; }
.ava{ width: 46px; height: 46px; border-radius: 14px; object-fit: cover; border: 1px solid rgba(0,0,0,0.08); }
.note-name{ font-weight: 900; color: rgba(30,40,70,0.92); }
.note-role{ font-weight: 800; color: rgba(100,116,139,0.95); font-size: 12px; margin-top: 2px; }
.note-msg{ margin-top: 12px; font-weight: 800; color: rgba(60,70,95,0.86); line-height: 1.35; }
.note-link{
  width: 100%;
  margin-top: 14px;
  border: none;
  background: transparent;
  color: #2f56ff;
  font-weight: 900;
  padding: 8px 0 0;
  cursor: pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}

.panel-title2{
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  display:flex;
  align-items:center;
  justify-content: space-between;
}
.panel-txt{ font-weight: 900; color: rgba(30,40,70,0.92); }

.chip{
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  font-weight: 900;
  cursor: pointer;
  color: rgba(30,40,70,0.90);
  display:inline-flex;
  align-items:center;
  gap: 8px;
}

.low-list{ padding: 10px 14px 14px; display:grid; gap: 10px; }
.low-row{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
}
.low-left{ display:flex; align-items:center; gap: 10px; min-width:0; }
.low-name{
  font-weight: 900;
  color: rgba(30,40,70,0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.low-right{
  display:flex;
  align-items:center;
  gap: 10px;
  min-width: 220px;
}
.low-bar{
  flex: 1 1 auto;
  height: 12px;
  border-radius: 999px;
  background: rgba(15,23,42,0.10);
  border: 1px solid rgba(0,0,0,0.06);
  overflow: hidden;
}
.low-fill{ display:block; height:100%; border-radius: 999px; }
.low-fill.lvl-orange{ background: linear-gradient(90deg, rgba(255,140,58,0.95), rgba(255,179,90,0.85)); }
.low-fill.lvl-red{ background: linear-gradient(90deg, rgba(255,74,74,0.95), rgba(255,108,108,0.85)); }
.low-meta{ width: 90px; text-align:right; font-weight: 900; color: rgba(60,70,95,0.86); }
.low-meta.danger{ color: rgba(255,74,74,0.98); }

.hist-list{ padding: 10px 14px 14px; display:grid; gap: 8px; }
.hist-item{
  width: 100%;
  border: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.55);
  border-radius: 14px;
  padding: 10px 10px;
  display:flex;
  align-items:center;
  gap: 10px;
  cursor: pointer;
  text-align:left;
}
.hist-item:hover{ background: rgba(255,255,255,0.70); }
.hist-ico{
  width: 38px; height: 38px;
  border-radius: 12px;
  display:grid;
  place-items:center;
  border: 1px solid rgba(0,0,0,0.08);
  color: rgba(20,30,60,0.92);
  flex: 0 0 auto;
}
.hist-ico.h-orange{ background: rgba(255,154,61,0.18); border-color: rgba(255,154,61,0.22); }
.hist-ico.h-blue{ background: rgba(79,119,255,0.18); border-color: rgba(79,119,255,0.22); }

.hist-mid{ min-width:0; flex: 1 1 auto; }
.hist-title{ font-weight: 900; color: rgba(30,40,70,0.92); }
.hist-sub{ margin-top: 2px; font-weight: 800; font-size: 12px; color: rgba(100,116,139,0.95); }
.hist-time{ font-weight: 900; color: rgba(100,116,139,0.95); }

/* ===== Responsive ===== */
@media (max-width: 1200px){
  .below{ grid-template-columns: 1fr 1fr; }
  .hist{ grid-column: 1 / -1; }
}
@media (max-width: 980px){
  .kpi-row{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .w-act{ width: 220px; }
}
@media (max-width: 760px){
  .search-row{ width: 100%; max-width: unset; }
  .below{ grid-template-columns: 1fr; }
  .act-row{ justify-content:flex-start; }
  .exp-cell{ text-align:left; }
}
@media (max-width: 640px){
  .kpi-row{ grid-template-columns: 1fr; }
}
</style>
