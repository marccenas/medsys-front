<template>
  <div class="lr-wrap">
    <!-- Page head -->
    <div class="lr-head">
      <div>
        <h2 class="lr-title">Lab Results</h2>
        <div class="lr-sub">
          <b>Lab Results Overview</b>
          <span class="sep">›</span>
          <span>Manage all assigned lab results.</span>
        </div>
      </div>
    </div>

    <!-- KPI row -->
    <div class="lr-kpis">
      <div class="lr-kpi kpi-blue">
        <div class="kpi-label">
          <font-awesome-icon icon="check" />
          Normal
        </div>
        <div class="kpi-val">{{ counts.normal }}</div>
      </div>

      <div class="lr-kpi kpi-teal">
        <div class="kpi-label">
          <font-awesome-icon icon="flask-vial" />
          Pending
        </div>
        <div class="kpi-val">{{ counts.pending }}</div>
      </div>

      <div class="lr-kpi kpi-orange">
        <div class="kpi-label">
          <font-awesome-icon icon="x-ray" />
          Abnormal
        </div>
        <div class="kpi-val">{{ counts.abnormal }}</div>
      </div>

      <div class="lr-kpi kpi-red">
        <div class="kpi-label">
          <font-awesome-icon icon="bell" />
          Critical
        </div>
        <div class="kpi-val">{{ counts.critical }}</div>
      </div>
    </div>

    <!-- Main Card -->
    <div class="lr-card">
      <div class="lr-card-head">
        <div class="lr-card-title">Lab Results Overview</div>

        <div class="lr-actions">
          <button class="btn-export" @click.stop="exportCsv">
            <font-awesome-icon icon="file-arrow-down" />
            Export
          </button>
          <button class="btn-export-caret" @click.stop="toggleExportMenu">
            <font-awesome-icon icon="chevron-down" />
          </button>

          <div v-if="exportMenuOpen" class="export-menu" @click.stop>
            <button class="menu-item" @click="exportCsv">Export CSV</button>
            <button class="menu-item" @click="exportPdf">Export PDF</button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="lr-filters">
        <div class="f-search">
          <font-awesome-icon class="f-ic" icon="magnifying-glass" />
          <input class="f-in" v-model="tableSearch" placeholder="Search..." />
        </div>

        <button class="f-dd" @click="cycleStatus">
          {{ statusFilterLabel }}
          <font-awesome-icon icon="chevron-down" />
        </button>

        <button class="f-dd" @click="cycleDept">
          {{ deptFilterLabel }}
          <font-awesome-icon icon="chevron-down" />
        </button>

        <button class="f-dd" @click="cycleDate">
          {{ dateFilterLabel }}
          <font-awesome-icon icon="chevron-down" />
        </button>
      </div>

      <!-- BODY -->
      <div class="lr-body">
        <!-- LEFT -->
        <div class="lr-left">
          <LabDonutChart
            :items="labItems"
            center-title="Results"
            center-value="30"
          />

          <div class="legend">
            <div v-for="it in normalized" :key="it.key" class="leg-row">
              <span class="sw" :style="{ background: it.color }" />
              <span class="leg-name">{{ it.label }}</span>
              <span class="leg-pct">{{ it.pct }}%</span>
            </div>
          </div>

          <button class="view-report-btn">
            View Report
          </button>
        </div>

        <!-- RIGHT -->
        <div class="lr-right">
          <div class="lr-table-wrap">
            <table class="lr-table">
              <colgroup>
                <col style="width: 220px" />
                <col style="width: 280px" />
                <col style="width: 160px" />
                <col style="width: 160px" />
              </colgroup>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Lab Test</th>
                  <th>State</th>
                  <th class="th-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="r in pagedRows" :key="r.id">
                  <td>
                    <div class="namecell">
                      <img class="av" :src="r.avatar" />
                      {{ r.name }}
                    </div>
                  </td>

                  <td>{{ r.test }}</td>

                  <td>
                    <span class="pill" :class="pillClass(r.state)">
                      {{ r.state }}
                    </span>
                  </td>

                  <td class="td-right">
                    <button class="btn-view" @click="viewResult(r)">
                      View
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </td>
                </tr>

                <tr v-if="pagedRows.length === 0">
                  <td colspan="4" class="empty">
                    No lab results found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div class="lr-foot">
            <div class="muted">
              Showing {{ startIndex }} to {{ endIndex }} of {{ filteredRows.length }}
            </div>

            <div class="pager">
              <button class="pg" :disabled="page === 1" @click="page--">‹</button>
              <button
                v-for="n in pageButtons"
                :key="n.key"
                class="pg"
                :class="{ active: n.num === page }"
                @click="n.num && (page = n.num)"
              >
                {{ n.label }}
              </button>
              <button class="pg" :disabled="page === pageCount" @click="page++">›</button>
            </div>

            <button class="per" @click="cyclePerPage">
              {{ perPage }} / page
              <font-awesome-icon icon="chevron-down" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import LabDonutChart from "@/components/charts/LabDonutChart.vue";

const labItems = [
  { label: "Normal", value: 15, color: "#2f86ff" },
  { label: "Pending", value: 5, color: "#57d6c9" },
  { label: "Abnormal", value: 7, color: "#ffb15a" },
  { label: "Critical", value: 3, color: "#ff5a5a" },
];

/* -----------------------------
   Mock data
----------------------------- */
const rows = ref([
  { id: 1,  name: "Laura Williams",  test: "Compre Comprehensive Metabolic Panel", state: "Normal",   avatar: "https://i.pravatar.cc/80?img=22", dept: "Primary Care", date: "All" },
  { id: 2,  name: "Mark Johnson",    test: "CBC",                                  state: "Pending",  avatar: "https://i.pravatar.cc/80?img=12", dept: "Primary Care", date: "All" },
  { id: 3,  name: "Cleo Anderson",   test: "Liver Function Test",                  state: "Normal",   avatar: "https://i.pravatar.cc/80?img=16", dept: "Primary Care", date: "All" },
  { id: 4,  name: "Ethan Rivera",    test: "Routine Checkup",                      state: "Abnormal", avatar: "https://i.pravatar.cc/80?img=10", dept: "Primary Care", date: "All" },
  { id: 5,  name: "Olivia Harris",   test: "Procedure",                            state: "Pending",  avatar: "https://i.pravatar.cc/80?img=32", dept: "Primary Care", date: "All" },
  { id: 6,  name: "William Martinez",test: "Lipid Panel",                          state: "Abnormal", avatar: "https://i.pravatar.cc/80?img=14", dept: "Primary Care", date: "All" },
  { id: 7,  name: "William Clark",   test: "Liver Function Test",                  state: "Normal",   avatar: "https://i.pravatar.cc/80?img=18", dept: "Primary Care", date: "All" },
  { id: 8,  name: "Megan Richards",  test: "New Laboratory",                       state: "Critical", avatar: "https://i.pravatar.cc/80?img=25", dept: "Primary Care", date: "All" },
  { id: 9,  name: "Michael Foster",  test: "CBC",                                  state: "Critical", avatar: "https://i.pravatar.cc/80?img=28", dept: "Primary Care", date: "All" },
  { id: 10, name: "Michael Foster",  test: "CBC",                                  state: "Normal",   avatar: "https://i.pravatar.cc/80?img=29", dept: "Primary Care", date: "All" },
  // add more if you want, pagination handles it
]);

/* -----------------------------
   Counts for KPIs
----------------------------- */
const counts = computed(() => {
  const c = { normal: 0, pending: 0, abnormal: 0, critical: 0 };
  for (const r of rows.value) {
    const s = String(r.state || "").toLowerCase();
    if (s === "normal") c.normal++;
    else if (s === "pending") c.pending++;
    else if (s === "abnormal") c.abnormal++;
    else if (s === "critical") c.critical++;
  }
  return c;
});

/* -----------------------------
   Filters (no top search)
----------------------------- */
const tableSearch = ref("");

const statusFilter = ref("all"); // all | normal | pending | abnormal | critical
const deptFilter = ref("primary"); // primary | all
const dateFilter = ref("all"); // all | recent (mock)

const statusFilterLabel = computed(() => {
  if (statusFilter.value === "all") return "All Status";
  return statusFilter.value[0].toUpperCase() + statusFilter.value.slice(1);
});
const deptFilterLabel = computed(() => (deptFilter.value === "primary" ? "Primary Care" : "All Departments"));
const dateFilterLabel = computed(() => (dateFilter.value === "all" ? "All Dates" : "Recent"));

function cycleStatus() {
  const order = ["all", "normal", "pending", "abnormal", "critical"];
  statusFilter.value = order[(order.indexOf(statusFilter.value) + 1) % order.length];
}
function cycleDept() {
  deptFilter.value = deptFilter.value === "primary" ? "all" : "primary";
}
function cycleDate() {
  dateFilter.value = dateFilter.value === "all" ? "recent" : "all";
}

/* -----------------------------
   Table data (filtered + pagination)
----------------------------- */
const filteredRows = computed(() => {
  const q = (tableSearch.value || "").trim().toLowerCase();

  return rows.value.filter((r) => {
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.test.toLowerCase().includes(q) ||
      r.state.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter.value === "all" || r.state.toLowerCase() === statusFilter.value;

    const matchesDept =
      deptFilter.value === "all" || r.dept === "Primary Care";

    const matchesDate =
      dateFilter.value === "all" || true; // mock hook

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

watch([tableSearch, statusFilter, deptFilter, dateFilter, perPage], () => {
  page.value = 1;
});

/* -----------------------------
   Pager buttons (compact)
----------------------------- */
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

/* -----------------------------
   Pills
----------------------------- */
function pillClass(value) {
  const v = String(value || "").toLowerCase();
  if (v === "normal") return "pill-teal";
  if (v === "pending") return "pill-green";
  if (v === "abnormal") return "pill-orange";
  if (v === "critical") return "pill-red";
  return "pill-teal";
}

/* -----------------------------
   Donut (simple SVG ring segments)
----------------------------- */
const donutItems = computed(() => {
  const total =
    counts.value.normal + counts.value.pending + counts.value.abnormal + counts.value.critical || 1;

  const mk = (key, label, value, color) => ({
    key,
    label,
    value,
    color,
    pct: Math.round((value / total) * 100),
  });

  return [
    mk("normal", "Normal", counts.value.normal, "#2f86ff"),
    mk("pending", "Pending", counts.value.pending, "#57d6c9"),
    mk("abnormal", "Abnormal", counts.value.abnormal, "#ffb15a"),
    mk("critical", "Critical", counts.value.critical, "#ff5a5a"),
  ];
});

const donutSegments = computed(() => {
  const items = donutItems.value;
  const total = items.reduce((s, it) => s + it.value, 0) || 1;

  // SVG ring math
  const r = 38;
  const C = 2 * Math.PI * r;

  let acc = 0;
  return items.map((it) => {
    const frac = it.value / total;
    const len = frac * C;

    // dasharray: visible length + remainder
    const dasharray = `${len} ${C - len}`;
    const dashoffset = `${-acc}`;

    acc += len;

    return { key: it.key, color: it.color, dasharray, dashoffset };
  });
});

/* -----------------------------
   Export menu
----------------------------- */
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
function viewResult(r) {
  alert(`View: ${r.name} (mock)`);
}
function viewReport() {
  alert("View Report (mock)");
}

function onDocClick() {
  exportMenuOpen.value = false;
}
onMounted(() => document.addEventListener("click", onDocClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
</script>

<style scoped>
.lr-wrap{ width:100%; }

/* Head */
.lr-head{ margin-bottom: 12px; }
.lr-title{
  margin:0;
  font-size: 34px;
  font-weight: 950;
  letter-spacing: -0.02em;
  color:#1f2a44;
}
.lr-sub{
  margin-top: 6px;
  display:flex;
  align-items:center;
  gap:8px;
  color:#6b7a95;
  font-weight: 800;
}
.lr-sub b{ color:#2b3a5b; }
.sep{ opacity:.7; }

/* KPI row */
.lr-kpis{
  display:grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}
.lr-kpi{
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
.lr-kpi::after{
  content:"";
  position:absolute;
  inset:0;
  background: radial-gradient(circle at 18% 35%, rgba(255,255,255,.18), transparent 55%);
  pointer-events:none;
}
.kpi-label{
  display:flex;
  align-items:center;
  gap:10px;
  font-weight: 900;
  opacity:.95;
}
.kpi-ic{ opacity:.95; }
.kpi-val{
  font-size: 34px;
  font-weight: 950;
  letter-spacing:-.02em;
  line-height: 1;
  text-shadow: 0 10px 18px rgba(0,0,0,.15);
}
.kpi-blue{ background: linear-gradient(90deg, #6aa8ff, #3f7fff); }
.kpi-teal{ background: linear-gradient(90deg, #57d6c9, #33b9ae); }
.kpi-red{ background: linear-gradient(90deg, #ff7e7e, #ff5a5a); }
.kpi-orange{ background: linear-gradient(90deg, #ffb15a, #ff8e3d); }

/* Card */
.lr-card{
  background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.90));
  border-radius: 10px;
  border: 1px solid rgba(45,78,140,.14);
  box-shadow: 0 18px 38px rgba(17,36,80,.10);
  overflow:hidden;
}
.lr-card-head{
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(248,251,255,.96), rgba(245,249,255,.80));
  border-bottom: 1px solid rgba(45,78,140,.10);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
}
.lr-card-title{
  font-weight: 950;
  color:#273451;
  font-size: 22px;
}

.view-report-btn{
  width: 100%;
  margin-top: 12px;

  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(45,118,214,0.35);

  background: linear-gradient(
    180deg,
    #4f8ef7,
    #2d76d6
  );

  color: #fff;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: .3px;

  cursor: pointer;

  box-shadow:
    0 10px 20px rgba(45,118,214,0.35),
    inset 0 1px 0 rgba(255,255,255,0.35);

  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
}

.view-report-btn:hover{
  filter: brightness(1.05);
  box-shadow:
    0 14px 26px rgba(45,118,214,0.42),
    inset 0 1px 0 rgba(255,255,255,0.45);
}

.view-report-btn:active{
  transform: translateY(1px);
  box-shadow:
    0 6px 12px rgba(45,118,214,0.35),
    inset 0 1px 0 rgba(255,255,255,0.25);
}


/* Export buttons */
.lr-actions{
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
.lr-filters{
  display:grid;
  grid-template-columns: 1.2fr 0.7fr 0.7fr 0.7fr;
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

/* Body */
.lr-body{
  display:grid;
  grid-template-columns: 420px 1fr;
  gap: 14px;
  padding: 14px;
  align-items:start;
}

/* Donut */
.lr-left{
  border: 1px solid rgba(45,78,140,.10);
  padding: 14px;
}
.donut-wrap{
  display:grid;
  grid-template-columns: 220px 1fr;
  gap: 14px;
  align-items:center;
}
.donut{
  width: 220px;
  height: 220px;
  transform: rotate(-90deg);
}
.ring-bg{
  fill: none;
  stroke: rgba(45,78,140,.10);
  stroke-width: 16;
}
.ring{
  fill:none;
  stroke-width: 16;
  stroke-linecap: butt;
}
.ring-hole{
  fill: rgba(246,248,255,0.9);
}
.donut-legend{
  display:flex;
  flex-direction:column;
  gap: 10px;
}
.leg-row{
  display:flex;
  align-items:center;
  gap: 10px;
  font-weight: 950;
  color:#2b3a5b;
}
.sw{ width:12px; height:12px; border-radius: 3px; }
.leg-name{ flex:1; }
.leg-pct{ color:#6b7a95; font-weight: 900; }

.view-report{
  margin-top: 6px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(45,78,140,.14);
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
  font-weight: 950;
  cursor:pointer;
  box-shadow: 0 12px 22px rgba(47,134,255,.18);
}

/* Table block */
.lr-right{
  border-radius: 10px;
  border: 1px solid rgba(45,78,140,.10);
  background: rgba(246,248,255,0.50);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
  overflow:hidden;
}
.lr-table-wrap{ width:100%; overflow:auto; }

.lr-table{
  width:100%;
  border-collapse: collapse;
  table-layout: fixed; /* ✅ key: prevents header/data drift */
}
.lr-table thead th,
.lr-table tbody td{
  padding: 12px 14px;
  vertical-align: middle;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ✅ thead alignment FIX */
.lr-table thead th{
  text-align: left; /* ✅ makes headers line up */
  font-size: 13px;
  font-weight: 950;
  color:#43506b;
  background: linear-gradient(180deg, rgba(243,246,255,1), rgba(240,244,255,.9));
  border-bottom: 1px solid rgba(45,78,140,.12);
}

.lr-table tbody td{
  border-bottom: 1px solid rgba(45,78,140,.08);
  color:#2b3a5b;
  font-weight: 850;
  background: rgba(255,255,255,0.45);
}
.lr-table tbody tr:hover{ background: rgba(248,250,255,.9); }

.th-inner{
  display:inline-flex;
  align-items:center;
  justify-content:flex-start;
  gap: 8px;
  width: 100%;
}
.th-right{ justify-content:flex-end; }
.th-caret{ opacity:.55; font-size: 12px; }

/* Columns */
.w-act, .lr-table tbody td.w-act{ text-align:right; padding-right: 16px; }

.namecell{ display:flex; align-items:center; gap: 10px; }
.av{
  width:32px; height:32px;
  border-radius:999px;
  border:2px solid #dbe6ff;
  object-fit:cover;
}
.nm{ font-weight: 950; color:#1f2a44; }
.testcell{ color:#33415c; font-weight: 850; }

/* Pills */
.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 7px 12px;
  border-radius: 8px;
  font-weight: 950;
  font-size: 13px;
  border: 1px solid transparent;
  min-width: 110px;
}
.pill-teal{ background: rgba(87,214,201,.18); border-color: rgba(87,214,201,.34); color:#1b8f79; }
.pill-green{ background: rgba(64,200,120,.16); border-color: rgba(64,200,120,.30); color:#197a49; }
.pill-orange{ background: rgba(255,177,90,.20); border-color: rgba(255,177,90,.36); color:#b56a14; }
.pill-red{ background: rgba(255,90,90,.18); border-color: rgba(255,90,90,.34); color:#b42318; }

/* View btn */
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
  background: rgba(255,255,255,0.55);
}

/* Footer */
.lr-foot{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(248,251,255,.95), rgba(245,249,255,.82));
}
.muted{ color:#6b7a95; font-weight: 850; }

.pager{
  display:flex;
  align-items:center;
  gap: 6px;
}
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
@media (max-width: 1200px){
  .lr-body{ grid-template-columns: 1fr; }
  .donut-wrap{ grid-template-columns: 1fr; justify-items:center; }
}
@media (max-width: 1100px){
  .lr-kpis{ grid-template-columns: repeat(2, minmax(180px, 1fr)); }
  .lr-filters{ grid-template-columns: 1fr; }
}
</style>
