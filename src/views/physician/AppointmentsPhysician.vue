<template>
  <div class="ap-wrap">
    <!-- Page head -->
    <div class="ap-head">
      <div>
        <h2 class="ap-title">Appointments</h2>
        <div class="ap-sub">
          <b>Appointment Overview</b>
          <span class="sep">›</span>
          <span>Manage all assigned appointments.</span>
        </div>
      </div>
    </div>

    <!-- KPI row (NO redundant top search) -->
    <div class="ap-kpis">
      <div class="ap-kpi kpi-blue">
        <div class="kpi-label">Today’s Appointments:</div>
        <div class="kpi-val">{{ todaysAppointments }}</div>
      </div>

      <div class="ap-kpi kpi-teal">
        <div class="kpi-label">
          <span class="kpi-mini">44</span>
          Follow-Up
        </div>
        <div class="kpi-val">{{ followUps }}</div>
      </div>

      <div class="ap-kpi kpi-orange">
        <div class="kpi-label">
          <font-awesome-icon class="kpi-ic" icon="calendar-check" />
          Procedures
        </div>
        <div class="kpi-val">{{ procedures }}</div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="ap-card">
      <div class="ap-card-head">
        <div class="ap-card-title">Today’s Appointments</div>

        <div class="ap-actions">
          <button class="btn-export" type="button" @click.stop="exportCsv">
            <font-awesome-icon icon="file-arrow-down" />
            Export
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
      <div class="ap-filters">
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
      <div class="ap-table-wrap">
        <table class="ap-table">
          <!-- ✅ makes header + body column widths EXACTLY match -->
          <colgroup>
            <col style="width:46px" />
            <col style="width:320px" />
            <col style="width:180px" />
            <col style="width:170px" />
            <col style="width:190px" />
            <col style="width:160px" />
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

              <th class="w-patient">
                <span class="th-inner">
                  Patient <font-awesome-icon class="th-caret" icon="chevron-down" />
                </span>
              </th>

              <th class="w-id">
                <span class="th-inner">
                  Appointment ID <font-awesome-icon class="th-caret" icon="chevron-down" />
                </span>
              </th>

              <th class="w-date">
                <span class="th-inner">
                  Date <font-awesome-icon class="th-caret" icon="chevron-down" />
                </span>
              </th>

              <th class="w-reason">
                <span class="th-inner">
                  Reason <font-awesome-icon class="th-caret" icon="chevron-down" />
                </span>
              </th>

              <th class="w-act th-right">
                <span class="th-inner">
                  Actions <font-awesome-icon class="th-caret" icon="chevron-down" />
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="a in pagedRows" :key="a.id">
              <td class="w-check">
                <input class="chk" type="checkbox" :checked="isSelected(a.id)" @change="toggleOne(a.id)" />
              </td>

              <td class="w-patient">
                <div class="namecell">
                  <img class="av" :src="a.avatar" alt="" />
                  <span class="nm">{{ a.patient }}</span>
                </div>
              </td>

              <td class="w-id">
                <a class="lnk" href="#" @click.prevent>{{ a.code }}</a>
              </td>

              <td class="w-date">{{ a.date }}</td>

              <td class="w-reason">
                <span class="pill" :class="pillClass(a.reason)">{{ a.reason }}</span>
              </td>

              <td class="w-act td-right">
                <button class="btn-view" type="button" @click="viewAppointment(a)">
                  View <font-awesome-icon class="btn-caret" icon="chevron-down" />
                </button>
              </td>
            </tr>

            <tr v-if="pagedRows.length === 0">
              <td class="empty" colspan="6">No appointments found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="ap-foot">
        <div class="muted">
          Showing {{ startIndex }} to {{ endIndex }} of {{ filteredRows.length }} appointments
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

/* -------------------------------------------------------
   Mock data (swap later)
------------------------------------------------------- */
const rows = ref([
  { id: 1, patient: "Laura Williams", code: "A-85462", date: "04/22/2024", reason: "Upcoming", avatar: "https://i.pravatar.cc/80?img=22", dept: "Primary Care" },
  { id: 2, patient: "Mark Johnson", code: "A-85461", date: "04/21/2024", reason: "New Consult", avatar: "https://i.pravatar.cc/80?img=12", dept: "Primary Care" },
  { id: 3, patient: "Cleo Anderson", code: "P-85459", date: "04/17/2024", reason: "Inpatient", avatar: "https://i.pravatar.cc/80?img=16", dept: "Primary Care" },
  { id: 4, patient: "Ethan Rivera", code: "A-85433", date: "04/16/2024", reason: "Cancel", avatar: "https://i.pravatar.cc/80?img=10", dept: "Primary Care" },
  { id: 5, patient: "Olivia Harris", code: "P-812425", date: "Rome", reason: "ER", avatar: "https://i.pravatar.cc/80?img=32", dept: "Primary Care" },
  { id: 6, patient: "William Martinez", code: "A-85420", date: "04/11/2024", reason: "Complete", avatar: "https://i.pravatar.cc/80?img=14", dept: "Primary Care" },
  { id: 7, patient: "William Clark", code: "A-8541-1", date: "New Consult", reason: "Inpatient", avatar: "https://i.pravatar.cc/80?img=18", dept: "Primary Care" },
  { id: 8, patient: "Megan Richards", code: "A-8541-4", date: "04/08/2024", reason: "Upcoming", avatar: "https://i.pravatar.cc/80?img=25", dept: "Primary Care" },
  { id: 9, patient: "Michael Foster", code: "A-85407", date: "Procedure", reason: "Cancel", avatar: "https://i.pravatar.cc/80?img=28", dept: "Primary Care" },
]);

/* -------------------------------------------------------
   KPIs (mock)
------------------------------------------------------- */
const todaysAppointments = computed(() => 8);
const followUps = computed(() => 27);
const procedures = computed(() => 9);

/* -------------------------------------------------------
   Filters
------------------------------------------------------- */
const tableSearch = ref("");

const statusFilter = ref("all"); // all | upcoming | inpatient | er | cancel | complete
const deptFilter = ref("primary"); // primary | all
const dateFilter = ref("all"); // all | recent (mock)

const statusFilterLabel = computed(() => {
  if (statusFilter.value === "all") return "All Status";
  if (statusFilter.value === "upcoming") return "Upcoming";
  if (statusFilter.value === "inpatient") return "Inpatient";
  if (statusFilter.value === "er") return "ER";
  if (statusFilter.value === "cancel") return "Cancel";
  return "Complete";
});
const deptFilterLabel = computed(() => (deptFilter.value === "primary" ? "Primary Care" : "All Departments"));
const dateFilterLabel = computed(() => (dateFilter.value === "all" ? "All Dates" : "Recent"));

function cycleStatus() {
  const order = ["all", "upcoming", "inpatient", "er", "cancel", "complete"];
  statusFilter.value = order[(order.indexOf(statusFilter.value) + 1) % order.length];
}
function cycleDept() {
  deptFilter.value = deptFilter.value === "primary" ? "all" : "primary";
}
function cycleDate() {
  dateFilter.value = dateFilter.value === "all" ? "recent" : "all";
}

function pillClass(reason) {
  const v = String(reason || "").toLowerCase();
  if (v.includes("upcoming")) return "pill-teal";
  if (v.includes("new")) return "pill-teal";
  if (v.includes("inpatient")) return "pill-teal";
  if (v === "er") return "pill-orange";
  if (v.includes("cancel")) return "pill-red";
  if (v.includes("complete")) return "pill-blue";
  return "pill-blue";
}

/* -------------------------------------------------------
   Table data (filtered + pagination)
------------------------------------------------------- */
const filteredRows = computed(() => {
  const q = tableSearch.value.trim().toLowerCase();

  return rows.value.filter((r) => {
    const matchesQuery =
      !q ||
      r.patient.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q) ||
      String(r.date).toLowerCase().includes(q) ||
      String(r.reason).toLowerCase().includes(q);

    const matchesStatus =
      statusFilter.value === "all" ||
      (statusFilter.value === "upcoming" && String(r.reason).toLowerCase().includes("upcoming")) ||
      (statusFilter.value === "inpatient" && String(r.reason).toLowerCase().includes("inpatient")) ||
      (statusFilter.value === "er" && String(r.reason).toLowerCase() === "er") ||
      (statusFilter.value === "cancel" && String(r.reason).toLowerCase().includes("cancel")) ||
      (statusFilter.value === "complete" && String(r.reason).toLowerCase().includes("complete"));

    const matchesDept = deptFilter.value === "all" || r.dept === "Primary Care";
    const matchesDate = dateFilter.value === "all" || true; // mock hook

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

/* reset paging + selection on filter/page-size changes */
watch([tableSearch, statusFilter, deptFilter, dateFilter, perPage], () => {
  page.value = 1;
  selectedIds.value = [];
});

/* -------------------------------------------------------
   Selection logic (single toggle for all-on-page)
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
  const allSelected = ids.every((id) => selectedIds.value.includes(id));
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

onUpdated(() => {
  if (selectAllRef.value) selectAllRef.value.indeterminate = isSomeOnPageSelected.value;
});

/* -------------------------------------------------------
   Pager buttons (compact like design)
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
function viewAppointment(a) {
  alert(`View: ${a.patient} (${a.code}) (mock)`);
}

/* click-out for export menu */
function onDocClick() {
  exportMenuOpen.value = false;
}
onMounted(() => document.addEventListener("click", onDocClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
</script>

<style scoped>
.ap-wrap{ width:100%; }

/* Head */
.ap-head{ margin-bottom: 12px; }
.ap-title{
  margin: 0;
  font-size: 34px;
  font-weight: 950;
  letter-spacing: -0.02em;
  color:#1f2a44;
}
.ap-sub{
  margin-top: 6px;
  display:flex;
  align-items:center;
  gap:8px;
  color:#6b7a95;
  font-weight: 800;
}
.ap-sub b{ color:#2b3a5b; }
.sep{ opacity:.7; }

/* KPI row */
.ap-kpis{
  display:grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}
.ap-kpi{
  border-radius: 10px;
  padding: 12px 16px;
  color:#fff;
  box-shadow: 0 14px 26px rgba(17,36,80,.14);
  display:flex;
  justify-content:space-between;
  align-items:center;
  position: relative;
  overflow:hidden;
}
.ap-kpi::after{
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
.kpi-mini{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:34px;
  height:22px;
  border-radius: 8px;
  background: rgba(255,255,255,.20);
  border: 1px solid rgba(255,255,255,.22);
  font-weight: 950;
}
.kpi-ic{ opacity:.95; }
.kpi-val{
  font-size: 40px;
  font-weight: 950;
  letter-spacing:-.02em;
  line-height: 1;
  text-shadow: 0 10px 18px rgba(0,0,0,.15);
}
.kpi-blue{ background: linear-gradient(90deg, #6aa8ff, #3f7fff); }
.kpi-teal{ background: linear-gradient(90deg, #57d6c9, #33b9ae); }
.kpi-orange{ background: linear-gradient(90deg, #ffb15a, #ff8e3d); }

/* Card */
.ap-card{
  background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.90));
  border-radius: 10px;
  border: 1px solid rgba(45,78,140,.14);
  box-shadow: 0 18px 38px rgba(17,36,80,.10);
  overflow:hidden;
}
.ap-card-head{
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(248,251,255,.96), rgba(245,249,255,.80));
  border-bottom: 1px solid rgba(45,78,140,.10);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
}
.ap-card-title{
  font-weight: 950;
  color:#273451;
  font-size: 22px;
}

/* Export */
.ap-actions{ position: relative; display:flex; align-items:center; gap: 8px; }
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
.ap-filters{
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
}
.f-caret{ opacity:.65; font-size: 12px; }

/* Table */
.ap-table-wrap{ width:100%; overflow:auto; }
.ap-table{
  width:100%;
  border-collapse: collapse;
  table-layout: fixed; /* ✅ critical */
}
.ap-table thead th,
.ap-table tbody td{
  padding: 12px 12px; /* ✅ same padding = alignment */
  vertical-align: middle;
}
.ap-table thead th.w-check,
.ap-table tbody td.w-check{
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.ap-table thead th.w-act,
.ap-table tbody td.w-act{
  text-align: right;
  padding-right: 16px;
}
.ap-table thead th{
  text-align: left;  
  font-size: 13px;
  font-weight: 950;
  color:#43506b;
  background: linear-gradient(180deg, rgba(243,246,255,1), rgba(240,244,255,.9));
  border-bottom: 1px solid rgba(45,78,140,.12);
  white-space: nowrap;
}
.ap-table tbody td{
  border-bottom: 1px solid rgba(45,78,140,.08);
  color:#2b3a5b;
  font-weight: 850;
}
.ap-table tbody tr:hover{ background: rgba(248,250,255,.9); }

.th-inner{ display:inline-flex; align-items:center; gap: 8px; width: 100%; }
.th-caret{ opacity:.55; font-size: 12px; }

.th-right{ text-align: right; }
.td-right{ text-align: right; }

.w-check{ width:46px; }

.chk{ width:16px; height:16px; accent-color:#2f86ff; }

.namecell{ display:flex; align-items:center; gap: 10px; min-width: 0; }
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
  max-width:100%;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lnk:hover{ text-decoration: underline; }

.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 7px 12px;
  border-radius: 8px;
  font-weight: 950;
  font-size: 13px;
  border: 1px solid transparent;
  min-width: 120px;
}
.pill-blue{ background: rgba(47,134,255,.16); border-color: rgba(47,134,255,.32); color:#1f6feb; }
.pill-teal{ background: rgba(87,214,201,.18); border-color: rgba(87,214,201,.34); color:#1b8f79; }
.pill-orange{ background: rgba(255,177,90,.20); border-color: rgba(255,177,90,.36); color:#b56a14; }
.pill-red{ background: rgba(255,90,90,.18); border-color: rgba(255,90,90,.34); color:#b42318; }

.btn-view{
  border:0;
  border-radius: 10px;
  padding: 0 14px;
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
  height: 38px;
  font-weight:950;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap: 10px;
  min-width: 110px;
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
.ap-foot{
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

/* Responsive */
@media (max-width: 1100px){
  .ap-title{ font-size: 30px; }
  .ap-kpis{ grid-template-columns: 1fr; }
  .ap-filters{ grid-template-columns: 1fr 1fr; }
}
/* Mobile */
@media (max-width: 720px){
  .ap-title{ font-size: 26px; }

  .ap-card-head{
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .ap-actions{
    width: 100%;
    justify-content: flex-end;
  }

  .btn-export{
    flex: 1;
    justify-content: center;
  }
  .btn-export-txt{ display:none; }

  .ap-filters{ grid-template-columns: 1fr; }

  .ap-foot{
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

/* Extra small */
@media (max-width: 420px){
  .ap-card-head,
  .ap-filters,
  .ap-foot{
    padding-left: 12px;
    padding-right: 12px;
  }
  .ap-table thead th,
  .ap-table tbody td{
    padding: 10px 10px;
  }
  .btn-view{
    min-width: 98px;
    height: 36px;
  }
}
</style>
