<template>
  <div class="pp-wrap">
    <!-- Page head -->
    <div class="pp-head">
      <div>
        <h2 class="pp-title">Patients</h2>
        <div class="pp-sub">
          <b>Patient Overview</b>
          <span class="sep">›</span>
          <span>Manage all assigned patients.</span>
        </div>
      </div>
    </div>

    <div class="pp-top">
      <div class="pp-kpis">
        <div class="pp-kpi kpi-blue">
          <div class="kpi-label">Total Patients</div>
          <div class="kpi-val">{{ totalPatients }}</div>
        </div>

        <div class="pp-kpi kpi-teal">
          <div class="kpi-label">
            <font-awesome-icon class="kpi-ic" icon="heart" />
            Inpatients
          </div>
          <div class="kpi-val">{{ inpatients }}</div>
        </div>

        <div class="pp-kpi kpi-red">
          <div class="kpi-label">
            <font-awesome-icon class="kpi-ic" icon="user-injured" />
            Outpatients
          </div>
          <div class="kpi-val">{{ outpatients }}</div>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="pp-card">
      <div class="pp-card-head">
        <div class="pp-card-title">My Schedule</div>

        <div class="pp-actions">
          <button class="btn-export" type="button" @click.stop="exportCsv">
            <font-awesome-icon icon="file-arrow-down" />
            <span class="btn-export-txt">Export</span>
          </button>

          <button
            class="btn-export-caret"
            type="button"
            @click.stop="toggleExportMenu"
            aria-label="Export menu"
          >
            <font-awesome-icon icon="chevron-down" />
          </button>

          <div v-if="exportMenuOpen" class="export-menu" @click.stop>
            <button class="menu-item" type="button" @click="exportCsv">Export CSV</button>
            <button class="menu-item" type="button" @click="exportPdf">Export PDF (mock)</button>
          </div>
        </div>
      </div>

      <!-- Filters row -->
      <div class="pp-filters">
        <div class="f-search">
          <font-awesome-icon class="f-ic" icon="magnifying-glass" />
          <input class="f-in" v-model="tableSearch" type="text" placeholder="Search..." />
        </div>

        <button class="f-dd" type="button" @click="cycleStatus">
          <span>{{ statusFilterLabel }}</span>
          <font-awesome-icon class="f-caret" icon="chevron-down" />
        </button>

        <button class="f-dd" type="button" @click="cycleDept">
          <span>{{ deptFilterLabel }}</span>
          <font-awesome-icon class="f-caret" icon="chevron-down" />
        </button>

        <button class="f-dd" type="button" @click="cycleDate">
          <span>{{ dateFilterLabel }}</span>
          <font-awesome-icon class="f-caret" icon="chevron-down" />
        </button>
      </div>

      <!-- Table -->
      <div class="pp-table-wrap">
        <table class="pp-table">
          <!-- ✅ locks header/body columns exactly (desktop/tablet) -->
          <colgroup>
            <col class="col-check" />
            <col class="col-name" />
            <col class="col-email" />
            <col class="col-id" />
            <col class="col-s1" />
            <col class="col-s2" />
            <col class="col-act" />
          </colgroup>

          <thead>
            <tr>
              <th class="w-check">
                <input
                  ref="selectAllRef"
                  class="chk"
                  type="checkbox"
                  :checked="isAllOnPageSelected"
                  @change="toggleAllOnPage()"
                />
              </th>

              <th class="w-name">
                Name <font-awesome-icon class="th-caret" icon="chevron-down" />
              </th>

              <th class="w-email">
                Email <font-awesome-icon class="th-caret" icon="chevron-down" />
              </th>

              <th class="w-id">
                Patient ID <font-awesome-icon class="th-caret" icon="chevron-down" />
              </th>

              <th class="w-s1">
                Status <font-awesome-icon class="th-caret" icon="chevron-down" />
              </th>

              <th class="w-s2">
                Status <font-awesome-icon class="th-caret" icon="chevron-down" />
              </th>

              <th class="w-act">
                Actions <font-awesome-icon class="th-caret" icon="chevron-down" />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in pagedRows" :key="p.id">
              <td class="w-check">
                <input class="chk" type="checkbox" :checked="isSelected(p.id)" @change="toggleOne(p.id)" />
              </td>

              <td class="w-name">
                <div class="namecell">
                  <img class="av" :src="p.avatar" alt="" />
                  <span class="nm">{{ p.name }}</span>
                </div>
              </td>

              <td class="w-email">
                <a class="lnk" href="#" @click.prevent>{{ p.code }}</a>
              </td>

              <td class="w-id">{{ p.date }}</td>

              <td class="w-s1">
                <span class="pill" :class="pillClass(p.visitType)">{{ p.visitType }}</span>
              </td>

              <td class="w-s2">
                <span class="pill" :class="pillClass(p.category)">{{ p.category }}</span>
              </td>

              <td class="w-act">
                <button class="btn-view" type="button" @click="viewPatient(p)">
                  <span class="btn-view-txt">View</span>
                  <font-awesome-icon class="btn-caret" icon="chevron-down" />
                </button>
              </td>
            </tr>

            <tr v-if="pagedRows.length === 0">
              <td class="empty" colspan="7">No patients found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="pp-foot">
        <div class="muted">
          Showing {{ startIndex }} to {{ endIndex }} of {{ filteredRows.length }} patients
        </div>

        <div class="pager">
          <button class="pg" type="button" :disabled="page === 1" @click="page--">‹</button>

          <button
            v-for="n in pageButtons"
            :key="n.key"
            class="pg"
            :class="{ active: n.num === page, dots: n.dots }"
            type="button"
            :disabled="n.dots"
            @click="n.num && (page = n.num)"
          >
            {{ n.label }}
          </button>

          <button class="pg" type="button" :disabled="page === pageCount" @click="page++">›</button>
        </div>

        <button class="per" type="button" @click="cyclePerPage">
          <span>{{ perPage }} / page</span>
          <font-awesome-icon class="f-caret" icon="chevron-down" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, watch } from "vue";

const selectAllRef = ref(null);

onUpdated(() => {
  if (selectAllRef.value) {
    selectAllRef.value.indeterminate = isSomeOnPageSelected.value;
  }
});

/* -------------------------------------------------------
   Mock data (swap later)
------------------------------------------------------- */
const rows = ref([
  { id: 1, name: "Laura Williams", code: "P-2451", date: "04/22/2024", visitType: "Follow-Up", category: "Inpatient", avatar: "https://i.pravatar.cc/80?img=22", dept: "Primary Care" },
  { id: 2, name: "Mark Johnson", code: "P-2452", date: "04/21/2024", visitType: "New Consult", category: "Outpatient", avatar: "https://i.pravatar.cc/80?img=12", dept: "Primary Care" },
  { id: 3, name: "Cleo Anderson", code: "P-2449", date: "04/17/2024", visitType: "Routine Checkup", category: "Inpatient", avatar: "https://i.pravatar.cc/80?img=16", dept: "Primary Care" },
  { id: 4, name: "Ethan Rivera", code: "P-2443", date: "04/16/2024", visitType: "Outpatient", category: "Outpatient", avatar: "https://i.pravatar.cc/80?img=10", dept: "Primary Care" },
  { id: 5, name: "Olivia Harris", code: "P-2445", date: "Rome", visitType: "Inpatient", category: "Inpatient", avatar: "https://i.pravatar.cc/80?img=32", dept: "Primary Care" },
  { id: 6, name: "William Martinez", code: "P-2437", date: "ER", visitType: "ER", category: "ER", avatar: "https://i.pravatar.cc/80?img=14", dept: "Primary Care" },
  { id: 7, name: "William Clark", code: "P-2441", date: "Outpatient", visitType: "Outpatient", category: "Outpatient", avatar: "https://i.pravatar.cc/80?img=18", dept: "Primary Care" },
  { id: 8, name: "Megan Richards", code: "P-2468", date: "Rome", visitType: "ER", category: "ER", avatar: "https://i.pravatar.cc/80?img=25", dept: "Primary Care" },
  { id: 9, name: "Michael Foster", code: "P-2429", date: "Outpatient", visitType: "Outpatient", category: "Outpatient", avatar: "https://i.pravatar.cc/80?img=28", dept: "Primary Care" },
  { id: 10, name: "Michael Foster", code: "P-2429", date: "Outpatient", visitType: "Outpatient", category: "Outpatient", avatar: "https://i.pravatar.cc/80?img=29", dept: "Primary Care" },
]);

/* -------------------------------------------------------
   KPI counts
------------------------------------------------------- */
const totalPatients = computed(() => rows.value.length);
const inpatients = computed(() => rows.value.filter((r) => r.category === "Inpatient").length);
const outpatients = computed(() => rows.value.filter((r) => r.category === "Outpatient").length);

/* -------------------------------------------------------
   Filters
------------------------------------------------------- */
const globalSearch = ref("");
const tableSearch = ref("");

const statusFilter = ref("all"); // all | inpatient | outpatient | er
const deptFilter = ref("primary"); // primary | all
const dateFilter = ref("all"); // all | recent (mock)

const statusFilterLabel = computed(() => {
  if (statusFilter.value === "all") return "All Status";
  if (statusFilter.value === "inpatient") return "Inpatient";
  if (statusFilter.value === "outpatient") return "Outpatient";
  return "ER";
});
const deptFilterLabel = computed(() => (deptFilter.value === "primary" ? "Primary Care" : "All Departments"));
const dateFilterLabel = computed(() => (dateFilter.value === "all" ? "All Dates" : "Recent"));

function cycleStatus() {
  const order = ["all", "inpatient", "outpatient", "er"];
  statusFilter.value = order[(order.indexOf(statusFilter.value) + 1) % order.length];
}
function cycleDept() {
  deptFilter.value = deptFilter.value === "primary" ? "all" : "primary";
}
function cycleDate() {
  dateFilter.value = dateFilter.value === "all" ? "recent" : "all";
}

function pillClass(value) {
  const v = String(value || "").toLowerCase();

  if (v.includes("follow")) return "pill-blue";
  if (v.includes("new")) return "pill-blue";
  if (v.includes("routine")) return "pill-blue";

  if (v.includes("inpatient")) return "pill-teal";
  if (v.includes("outpatient")) return "pill-red";
  if (v === "er") return "pill-orange";

  return "pill-blue";
}

/* -------------------------------------------------------
   Table data (filtered + pagination)
------------------------------------------------------- */
const filteredRows = computed(() => {
  const q = (globalSearch.value || tableSearch.value).trim().toLowerCase();

  return rows.value.filter((r) => {
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q) ||
      String(r.date).toLowerCase().includes(q) ||
      r.visitType.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter.value === "all" ||
      (statusFilter.value === "inpatient" && r.category === "Inpatient") ||
      (statusFilter.value === "outpatient" && r.category === "Outpatient") ||
      (statusFilter.value === "er" && (r.category === "ER" || r.visitType === "ER"));

    const matchesDept = deptFilter.value === "all" || r.dept === "Primary Care";
    const matchesDate = dateFilter.value === "all" || true;

    return matchesQuery && matchesStatus && matchesDept && matchesDate;
  });
});

const page = ref(1);
const perPage = ref(10);

const pageCount = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / perPage.value)));

const pagedRows = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filteredRows.value.slice(start, start + perPage.value);
});

const startIndex = computed(() => (filteredRows.value.length ? (page.value - 1) * perPage.value + 1 : 0));
const endIndex = computed(() => Math.min(filteredRows.value.length, page.value * perPage.value));

function cyclePerPage() {
  const options = [10, 20, 50];
  perPage.value = options[(options.indexOf(perPage.value) + 1) % options.length];
}

watch([globalSearch, tableSearch, statusFilter, deptFilter, dateFilter, perPage], () => {
  page.value = 1;
  selectedIds.value = [];
});

/* -------------------------------------------------------
   Selection logic
------------------------------------------------------- */
const selectedIds = ref([]);

function isSelected(id) {
  return selectedIds.value.includes(id);
}
function toggleOne(id) {
  if (isSelected(id)) selectedIds.value = selectedIds.value.filter((x) => x !== id);
  else selectedIds.value = [...selectedIds.value, id];
}

function toggleAllOnPage() {
  const ids = pagedRows.value.map((r) => r.id);
  const allSelected = ids.length > 0 && ids.every((id) => selectedIds.value.includes(id));

  if (allSelected) {
    selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id));
  } else {
    const set = new Set(selectedIds.value);
    ids.forEach((id) => set.add(id));
    selectedIds.value = Array.from(set);
  }
}

const isAllOnPageSelected = computed(() => {
  const ids = pagedRows.value.map((r) => r.id);
  return ids.length > 0 && ids.every((id) => selectedIds.value.includes(id));
});
const isSomeOnPageSelected = computed(() => {
  const ids = pagedRows.value.map((r) => r.id);
  const some = ids.some((id) => selectedIds.value.includes(id));
  return some && !isAllOnPageSelected.value;
});

/* -------------------------------------------------------
   Pager buttons
------------------------------------------------------- */
const pageButtons = computed(() => {
  const p = page.value;
  const max = pageCount.value;
  const out = [];

  const push = (num) => out.push({ key: `p${num}`, num, label: String(num) });
  const dots = (k) => out.push({ key: k, dots: true, label: "…" });

  if (max <= 6) {
    for (let i = 1; i <= max; i++) push(i);
    return out;
  }

  push(1);
  if (p > 3) dots("d1");

  const start = Math.max(2, p - 1);
  const end = Math.min(max - 1, p + 1);
  for (let i = start; i <= end; i++) push(i);

  if (p < max - 2) dots("d2");
  push(max);

  return out;
});

/* -------------------------------------------------------
   Export menu + actions
------------------------------------------------------- */
const exportMenuOpen = ref(false);

function toggleExportMenu() {
  exportMenuOpen.value = !exportMenuOpen.value;
}
function exportCsv() {
  exportMenuOpen.value = false;
  alert("Export CSV (mock).");
}
function exportPdf() {
  exportMenuOpen.value = false;
  alert("Export PDF (mock).");
}
function viewPatient(p) {
  alert(`View: ${p.name} (mock)`);
}

function onDocClick() {
  exportMenuOpen.value = false;
}
onMounted(() => document.addEventListener("click", onDocClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
</script>

<style scoped>
.pp-wrap{ width:100%; }

/* Head */
.pp-head{ margin-bottom: 12px; }
.pp-title{
  margin: 0;
  font-size: 34px;
  font-weight: 950;
  letter-spacing: -0.02em;
  color:#1f2a44;
}
.pp-sub{
  margin-top: 6px;
  display:flex;
  align-items:center;
  gap:8px;
  color:#6b7a95;
  font-weight: 800;
  flex-wrap: wrap; /* ✅ mobile wrap */
}
.pp-sub b{ color:#2b3a5b; }
.sep{ opacity:.7; }

/* KPI row */
.pp-kpis{
  display:grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 14px;
}
.pp-kpi{
  border-radius: 8px;
  padding: 12px 14px;
  color:#fff;
  box-shadow: 0 14px 26px rgba(17,36,80,.14);
  display:flex;
  justify-content:space-between;
  align-items:center;
  position: relative;
  overflow:hidden;
}
.pp-kpi::after{
  content:"";
  position:absolute;
  inset:0;
  background: radial-gradient(circle at 18% 35%, rgba(255,255,255,.18), transparent 55%);
  pointer-events:none;
}
.kpi-label{
  font-weight: 900;
  opacity:.95;
  display:flex;
  align-items:center;
  gap:10px;
}
.kpi-ic{ opacity:.95; }
.kpi-val{
  font-size: 36px;
  font-weight: 950;
  letter-spacing:-.02em;
  line-height: 1;
  text-shadow: 0 10px 18px rgba(0,0,0,.15);
}
.kpi-blue{ background: linear-gradient(90deg, #6aa8ff, #3f7fff); }
.kpi-teal{ background: linear-gradient(90deg, #57d6c9, #33b9ae); }
.kpi-red{ background: linear-gradient(90deg, #ff7e7e, #ff5a5a); }

/* Card */
.pp-card{
  background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.90));
  border-radius: 10px;
  border: 1px solid rgba(45,78,140,.14);
  box-shadow: 0 18px 38px rgba(17,36,80,.10);
  overflow:hidden;
}
.pp-card-head{
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(248,251,255,.96), rgba(245,249,255,.80));
  border-bottom: 1px solid rgba(45,78,140,.10);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
}
.pp-card-title{
  font-weight: 950;
  color:#273451;
  font-size: 22px;
}

/* Export buttons */
.pp-actions{
  position: relative;
  display:flex;
  align-items:center;
  gap: 8px;
}
.btn-export{
  height: 40px;
  border-radius: 8px;
  padding: 0 14px;
  border: 1px solid rgba(45,78,140,.18);
  background: rgba(246,248,255,1);
  font-weight: 950;
  color:#2b3a5b;
  display:flex;
  align-items:center;
  gap: 10px;
  cursor:pointer;
  white-space: nowrap;
}
.btn-export-caret{
  height: 40px;
  width: 44px;
  border-radius: 8px;
  border: 1px solid rgba(45,78,140,.18);
  background: rgba(246,248,255,1);
  font-weight: 950;
  color:#2b3a5b;
  cursor:pointer;
}
.export-menu{
  position:absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 180px;
  background:#fff;
  border:1px solid rgba(45,78,140,.16);
  border-radius:12px;
  padding:8px;
  box-shadow: 0 18px 40px rgba(17,36,80,.18);
  z-index: 2000;
}
.menu-item{
  width:100%;
  text-align:left;
  padding:10px 12px;
  border-radius:8px;
  background:transparent;
  border:0;
  font-weight:900;
  color:#2b3a5b;
  cursor:pointer;
}
.menu-item:hover{ background:#eef4ff; }

/* Filters */
.pp-filters{
  display:grid;
  grid-template-columns: 1.1fr 0.7fr 0.7fr 0.7fr;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(45,78,140,.10);
  background: linear-gradient(180deg, rgba(246,249,255,.95), rgba(244,248,255,.80));
}
.f-search{
  position:relative;
  height: 40px;
  border-radius: 10px;
  background: rgba(246,248,255,1);
  border: 1px solid rgba(45,78,140,.14);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
  overflow:hidden;
}
.f-ic{
  position:absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  opacity:.6;
  font-size: 13px;
}
.f-in{
  width:100%;
  height:100%;
  border:0;
  outline:none;
  background:transparent;
  padding: 0 12px 0 40px;
  font-weight: 850;
  color:#2b3a5b;
}
.f-in::placeholder{ color:#8796b2; }

.f-dd{
  height: 40px;
  border-radius: 10px;
  background: rgba(246,248,255,1);
  border: 1px solid rgba(45,78,140,.14);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  padding: 0 12px;
  font-weight: 950;
  color:#2b3a5b;
  cursor:pointer;
  white-space: nowrap;
}
.f-caret{ opacity:.65; font-size: 12px; }

/* Table */
.pp-table-wrap{ width:100%; overflow:auto; }

.pp-table{
  width:100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* col widths (desktop/tablet) */
.col-check{ width: 46px; }
.col-name{ width: 280px; }
.col-email{ width: 180px; }
.col-id{ width: 160px; }
.col-s1{ width: 150px; }
.col-s2{ width: 150px; }
.col-act{ width: 160px; }

.pp-table thead th,
.pp-table tbody td{
  padding: 12px 12px;
  vertical-align: middle;
  text-align: left;
}

.pp-table thead th{
  font-size: 13px;
  font-weight: 950;
  color:#43506b;
  background: linear-gradient(180deg, rgba(243,246,255,1), rgba(240,244,255,.9));
  border-bottom: 1px solid rgba(45,78,140,.12);
  white-space: nowrap;
}
.pp-table tbody td{
  border-bottom: 1px solid rgba(45,78,140,.08);
  color:#2b3a5b;
  font-weight: 850;
}
.pp-table tbody tr:hover{ background: rgba(248,250,255,.9); }

.th-caret{ margin-left: 8px; opacity:.55; font-size: 12px; }

.pp-table thead th.w-check,
.pp-table tbody td.w-check{ text-align: center; }

.pp-table thead th.w-act,
.pp-table tbody td.w-act{ text-align: right; }

.chk{ width:16px; height:16px; accent-color:#2f86ff; }

.namecell{
  display:flex;
  align-items:center;
  gap: 10px;
  min-width: 0;
}
.av{
  width:32px; height:32px;
  border-radius:999px;
  border:2px solid #dbe6ff;
  object-fit:cover;
}
.nm{
  font-weight: 950;
  color:#1f2a44;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lnk{
  color:#2f86ff;
  font-weight: 950;
  text-decoration:none;
  display:inline-block;
  max-width: 100%;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 7px 12px;
  border-radius: 8px;
  font-weight: 950;
  font-size: 13px;
  border: 1px solid transparent;
  width: 112px;
  text-align: center;
}
.pill-blue{ background: rgba(47,134,255,.16); border-color: rgba(47,134,255,.32); color:#1f6feb; }
.pill-teal{ background: rgba(87,214,201,.18); border-color: rgba(87,214,201,.34); color:#1b8f79; }
.pill-orange{ background: rgba(255,177,90,.20); border-color: rgba(255,177,90,.36); color:#b56a14; }
.pill-red{ background: rgba(255,90,90,.18); border-color: rgba(255,90,90,.34); color:#b42318; }

.btn-view{
  border:0;
  border-radius: 10px;
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
  height: 38px;
  padding: 0 14px;
  font-weight:950;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap: 10px;
  width: 110px;
  box-shadow: 0 12px 22px rgba(47,134,255,.18);
}
.btn-caret{ opacity:.9; font-size: 12px; }

.empty{
  text-align:center;
  padding: 18px 12px !important;
  color:#6b7a95 !important;
  font-weight: 850 !important;
}

/* Footer */
.pp-foot{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(248,251,255,.95), rgba(245,249,255,.82));
}
.muted{ color:#6b7a95; font-weight: 850; }

.pager{ display:flex; align-items:center; gap: 6px; }
.pg{
  border:1px solid rgba(45,78,140,.18);
  background:#f6f8ff;
  color:#2b3a5b;
  border-radius:6px;
  height:28px;
  min-width:28px;
  padding: 0 10px;
  cursor:pointer;
  font-weight:950;
}
.pg.active{ background:#2f86ff; border-color:#2f86ff; color:#fff; }
.pg:disabled{ opacity:.5; cursor:not-allowed; }
.pg.dots{ cursor:default; }

.per{
  height: 36px;
  border-radius: 10px;
  border:1px solid rgba(45,78,140,.18);
  background:#f6f8ff;
  padding: 0 12px;
  display:flex;
  align-items:center;
  gap: 10px;
  font-weight: 950;
  color:#2b3a5b;
  cursor:pointer;
}

/* =========================
   RESPONSIVE (added)
========================= */

/* Tablet: tighten + allow KPI wrap */
@media (max-width: 1100px){
  .pp-title{ font-size: 30px; }
  .pp-kpis{ grid-template-columns: 1fr; } /* ✅ stack KPIs */
  .pp-filters{ grid-template-columns: 1fr 1fr; } /* ✅ 2x2 filters */
  .pp-card-title{ font-size: 20px; }
}

/* Mobile: stack header + actions, filters 1 col, simplify footer */
@media (max-width: 720px){
  .pp-title{ font-size: 26px; }

  .pp-card-head{
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .pp-actions{
    width: 100%;
    justify-content: flex-end;
  }

  .btn-export{
    flex: 1;
    justify-content: center;
  }

  .btn-export-txt{ display: none; } /* icon-only on small phones */

  .pp-filters{
    grid-template-columns: 1fr; /* ✅ stack filters */
  }

  .pp-foot{
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .pager{
    justify-content: center;
    flex-wrap: wrap;
  }

  .per{
    width: 100%;
    justify-content: space-between;
  }
}

/* Extra small: reduce paddings and scale table controls */
@media (max-width: 420px){
  .pp-card-head,
  .pp-filters,
  .pp-foot{
    padding-left: 12px;
    padding-right: 12px;
  }

  .pp-table thead th,
  .pp-table tbody td{
    padding: 10px 10px;
  }

  .btn-view{
    width: 98px;
    height: 36px;
  }
}
</style>
