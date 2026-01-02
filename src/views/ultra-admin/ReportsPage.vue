<template>
  <div class="reports-ui">
    <!-- HEADER -->
    <div class="topbar">
      <div class="title-col">
        <h1 class="page-title">Reports</h1>
        <div class="breadcrumb">
          <span class="crumb-strong">Reports Overview</span>
          <span class="crumb-sep">›</span>
          <span class="crumb-muted">Access and analyze reports and data.</span>
        </div>
      </div>

      <div class="actions-col">
        <button class="btn btn-primary" type="button" @click="generateReport">
          <font-awesome-icon class="fa-ic" icon="wand-magic-sparkles" />
          <span>Generate Report</span>
        </button>

        <div class="dropdown" ref="exportRef">
          <button class="btn btn-secondary" type="button" @click.stop="toggleDropdown('export')">
            <font-awesome-icon class="fa-ic" icon="file-arrow-down" />
            <span>Export</span>
            <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
          </button>

          <div v-show="openDropdown === 'export'" class="menu menu-right" @click.stop>
            <button class="menu-item" type="button" @click="exportCsv('reports_all.csv')">Export All (CSV)</button>
            <button class="menu-item" type="button" @click="exportCsv('reports_summary.csv')">Export Summary (CSV)</button>
          </div>
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
          <button class="menu-item" type="button" @click="setCategory('Patient')">Patient</button>
          <button class="menu-item" type="button" @click="setCategory('Appointment')">Appointment</button>
          <button class="menu-item" type="button" @click="setCategory('Billing')">Billing</button>
          <button class="menu-item" type="button" @click="setCategory('Staff')">Staff</button>
          <button class="menu-item" type="button" @click="setCategory('Department')">Department</button>
          <button class="menu-item" type="button" @click="setCategory('Lab')">Lab</button>
          <button class="menu-item" type="button" @click="setCategory('Revenue')">Revenue</button>
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
          <button class="menu-item" type="button" @click="applyQuick('High Priority')">High Priority</button>
          <button class="menu-item" type="button" @click="applyQuick('Needs Review')">Needs Review</button>
          <button class="menu-item" type="button" @click="applyQuick('Scheduled')">Scheduled</button>
          <div class="menu-sep"></div>
          <button class="menu-item" type="button" @click="clearQuick">Clear</button>
        </div>
      </div>
    </div>

    <!-- CARDS GRID -->
    <div class="grid">
      <div v-for="card in filteredCards" :key="card.id" class="card">
        <div class="card-head">
          <div class="card-icon" :class="card.iconTone">
            <font-awesome-icon class="fa-ic" :icon="card.icon" />
          </div>

          <div class="card-title">
            <div class="h">{{ card.title }}</div>
            <div class="s">{{ card.subtitle }}</div>
          </div>
        </div>

        <div class="card-body">
          <div class="rows">
            <div v-for="(r, idx) in card.rows" :key="idx" class="row">
              <div class="row-left">
                <span class="k">{{ r.label }}</span>
                <span class="v">{{ r.value }}</span>
              </div>

              <div v-if="typeof r.bar === 'number'" class="bar-wrap">
                <div class="bar">
                  <div class="fill" :style="{ width: clampPct(r.bar) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <button class="view-btn" type="button" @click="viewReport(card)">
            View Report
          </button>
        </div>
      </div>
    </div>

    <!-- FOOTER (matches your table footer/pager style) -->
    <div class="footer">
      <div class="footer-left">
        Showing {{ filteredCards.length }} out of {{ cards.length }} reports
      </div>

      <div class="footer-right">
        <div class="pager">
          <button class="pg-btn" :disabled="page === 1" @click="page--">‹</button>
          <button
            v-for="p in pageButtons"
            :key="p"
            class="pg-num"
            :class="{ active: p === page }"
            @click="page = p"
          >
            {{ p }}
          </button>
          <button class="pg-btn" :disabled="page === totalPages" @click="page++">›</button>
        </div>

        <div class="dropdown" ref="perRef">
          <button class="mini-btn mini-btn-compact" type="button" @click.stop="toggleDropdown('per')">
            <span>{{ perPage }}</span>
            <span>/ page</span>
            <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
          </button>

          <div v-show="openDropdown === 'per'" class="menu menu-right" @click.stop>
            <button class="menu-item" type="button" @click="setPer(6)">6 / page</button>
            <button class="menu-item" type="button" @click="setPer(9)">9 / page</button>
            <button class="menu-item" type="button" @click="setPer(12)">12 / page</button>
          </div>
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

/* footer/pager (kept for UI parity) */
const page = ref(1);
const perPage = ref(9);

const openDropdown = ref(null); // 'export'|'cat'|'range'|'more'|'per'|null

const exportRef = ref(null);
const catRef = ref(null);
const rangeRef = ref(null);
const moreRef = ref(null);
const perRef = ref(null);

/* cards (values aligned with your other pages' numbers) */
const cards = ref([
  {
    id: "patient",
    category: "Patient",
    icon: "clipboard-list",
    iconTone: "tone-blue",
    title: "Patient Reports",
    subtitle: "Analyze patient demographics and visit data.",
    rows: [
      { label: "Total Patients:", value: "2,450", bar: 72 },
      { label: "ER Visits:", value: "545", bar: 35 },
      { label: "Inpatients:", value: "1,326", bar: 60 },
      { label: "Outpatients:", value: "579", bar: 40 },
    ],
  },
  {
    id: "appt",
    category: "Appointment",
    icon: "calendar-check",
    iconTone: "tone-teal",
    title: "Appointment Reports",
    subtitle: "Monitor appointments, follow-ups, and procedures.",
    rows: [
      { label: "Today's Appointments:", value: "72", bar: 30 },
      { label: "Follow-Up:", value: "345", bar: 66 },
      { label: "Procedures:", value: "57", bar: 42 },
      { label: "Pending Insurance:", value: "$23,450", bar: 55 },
      { label: "Overdue Invoices:", value: "$9,120", bar: 28 },
    ],
  },
  {
    id: "billing",
    category: "Billing",
    icon: "file-invoice-dollar",
    iconTone: "tone-green",
    title: "Billing Reports",
    subtitle: "Review financial data, payments, and outstanding balances.",
    rows: [
      { label: "Outstanding Balance:", value: "$74,320", bar: 58 },
      { label: "Paid Invoices:", value: "$128,140", bar: 75 },
      { label: "Pending Insurance:", value: "$23,450", bar: 42 },
    ],
  },
  {
    id: "staff",
    category: "Staff",
    icon: "user-nurse",
    iconTone: "tone-cyan",
    title: "Staff Reports",
    subtitle: "Track staff activity, shifts and specialties.",
    rows: [
      { label: "Total Staff:", value: "267", bar: 62 },
      { label: "Doctors:", value: "58", bar: 50 },
      { label: "Nurses:", value: "145", bar: 70 },
      { label: "Technicians:", value: "26", bar: 36 },
    ],
  },
  {
    id: "dept",
    category: "Department",
    icon: "building",
    iconTone: "tone-slate",
    title: "Department Reports",
    subtitle: "Evaluate department performance and productivity.",
    rows: [
      { label: "Emergency", value: "36 staff • 240 patients", bar: 68 },
      { label: "Cardiology", value: "25 staff • 180 patients", bar: 56 },
      { label: "Pediatrics", value: "20 staff • 95 patients", bar: 38 },
      { label: "Neurology", value: "15 staff • 82 patients", bar: 34 },
    ],
  },
  {
    id: "lab",
    category: "Lab",
    icon: "flask-vial",
    iconTone: "tone-blue",
    title: "Lab Reports",
    subtitle: "Analyze laboratory tests, results, and pending tasks.",
    rows: [
      { label: "Lab Tests:", value: "346 this month", bar: 64 },
      { label: "Pending:", value: "48", bar: 24 },
      { label: "Abnormal:", value: "64", bar: 40 },
    ],
  },
  {
    id: "revenue",
    category: "Revenue",
    icon: "chart-line",
    iconTone: "tone-teal",
    title: "Revenue Reports",
    subtitle: "Track hospital revenue and financial performance.",
    rows: [
      { label: "Today's Revenue:", value: "$3,790", bar: 36 },
      { label: "Monthly Revenue:", value: "$63,340", bar: 72 },
      { label: "Outstanding Balance:", value: "$74,320", bar: 58 },
    ],
  },
]);

const catLabel = computed(() => (category.value === "all" ? "All Categories" : category.value));
const rangeLabel = computed(() => range.value);

const filteredCards = computed(() => {
  const term = q.value.trim().toLowerCase();

  const list = cards.value.filter((c) => {
    const inCat = category.value === "all" || c.category === category.value;

    const hit =
      !term ||
      (c.title + " " + c.subtitle + " " + c.category)
        .toLowerCase()
        .includes(term);

    const okQuick = !quick.value || (c.title + " " + c.subtitle).includes(quick.value);

    return inCat && hit && okQuick;
  });

  /* UI pager compatibility: slice list */
  const start = (page.value - 1) * perPage.value;
  return list.slice(start, start + perPage.value);
});

const totalPages = computed(() => {
  const term = q.value.trim().toLowerCase();
  const base = cards.value.filter((c) => {
    const inCat = category.value === "all" || c.category === category.value;
    const hit =
      !term ||
      (c.title + " " + c.subtitle + " " + c.category)
        .toLowerCase()
        .includes(term);
    const okQuick = !quick.value || (c.title + " " + c.subtitle).includes(quick.value);
    return inCat && hit && okQuick;
  }).length;

  return Math.max(1, Math.ceil(base / perPage.value));
});

const pageButtons = computed(() => {
  const max = totalPages.value;
  const current = page.value;
  const out = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(max, current + 2);
  for (let i = start; i <= end; i++) out.push(i);
  return out;
});

watch([q, category, range, quick, perPage], () => {
  page.value = 1;
  closeAll();
});

/* dropdowns */
function toggleDropdown(name) {
  openDropdown.value = openDropdown.value === name ? null : name;
}
function closeAll() {
  openDropdown.value = null;
}

/* outside click / esc */
function onDocClick(e) {
  if (!openDropdown.value) return;
  const t = e.target;

  const els = [exportRef.value, catRef.value, rangeRef.value, moreRef.value, perRef.value].filter(Boolean);
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

/* setters */
function setCategory(v) { category.value = v; closeAll(); }
function setRange(v) { range.value = v; closeAll(); }
function setPer(v) { perPage.value = v; closeAll(); }

function applyQuick(label) { quick.value = label; closeAll(); }
function clearQuick() { quick.value = ""; closeAll(); }

/* actions */
function viewReport(card) {
  closeAll();
  window.alert(`Viewing "${card.title}" (UI only)`);
}
function generateReport() {
  closeAll();
  window.alert(`Generate Report (UI only)\nCategory: ${catLabel.value}\nRange: ${range.value}`);
}
function exportCsv(filename) {
  closeAll();
  const rows = cards.value.map((c) => ({
    Title: c.title,
    Category: c.category,
    Range: range.value,
  }));

  const header = Object.keys(rows[0]).join(",");
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };

  const csv = [header, ...rows.map((r) => Object.values(r).map(esc).join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function clampPct(n) {
  const x = Number(n || 0);
  return Math.max(0, Math.min(100, x));
}
</script>

<style scoped>
/* same shell feel as Patients/Billing/Appts */
.reports-ui{
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

.actions-col{
  display:flex;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
  justify-content:flex-end;
}

/* buttons */
.btn{
  border:none;
  border-radius:8px;
  padding:10px 14px;
  font-weight:600;
  font-size:14px;
  display:inline-flex;
  align-items:center;
  gap:10px;
  cursor:pointer;
  box-shadow: 0 6px 18px rgba(17, 36, 80, 0.08);
}
.btn-primary{
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
}
.btn-secondary{
  background:#e9eef9;
  color:#33415c;
  border:1px solid rgba(45, 78, 140, .15);
}

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

/* grid */
.grid{
  display:grid;
  grid-template-columns: repeat(2, minmax(360px, 1fr));
  gap:14px;
}
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
.card-icon{
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display:flex;
  align-items:center;
  justify-content:center;
  /* border: 1px solid rgba(45, 78, 140, .12); */
  background: #f4f7ff;
}
.card-icon{
  box-shadow: 0 10px 18px rgba(17, 36, 80, 0.06);
}
.card-icon :deep(svg){
width: 28px; height: 28px;
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

.card-body{
  padding: 0 14px 14px;
}
.rows{
  background: rgba(245,248,255,0.85);
  border: 1px solid rgba(45, 78, 140, .10);
  border-radius: 10px;
  padding: 10px 10px;
}
.row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding: 7px 6px;
  border-radius: 8px;
}
.row + .row{ border-top: 1px solid rgba(45, 78, 140, .08); }
.row-left{
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
  color:#2b3a5b;
}
.k{ font-weight: 700; }
.v{ font-weight: 800; color:#1f2a44; }

.bar-wrap{ width: 120px; flex: 0 0 auto; }
.bar{
  height: 10px;
  border-radius: 999px;
  background: rgba(45, 78, 140, .12);
  overflow:hidden;
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

/* tones */
.tone-blue{ color:#2f86ff; }
.tone-teal{ color:#43d8b7; }
.tone-green{ color:#2ecc71; }
.tone-cyan{ color:#2bb1ff; }
.tone-slate{ color:#33415c; }

/* footer */
.footer{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-top: 14px;
  padding: 4px 6px 0;
  color:#4b5873;
  font-weight:600;
}
.footer-right{
  display:flex;
  align-items:center;
  gap:12px;
}
.pager{
  display:flex;
  align-items:center;
  gap:6px;
}
.pg-btn, .pg-num{
  border:1px solid rgba(45, 78, 140, .18);
  background:#f6f8ff;
  color:#2b3a5b;
  border-radius:6px;
  height:30px;
  min-width:30px;
  padding:0 10px;
  cursor:pointer;
  font-weight:800;
}
.pg-btn:disabled{ opacity:.5; cursor:not-allowed; }
.pg-num.active{
  background:#2f86ff;
  border-color:#2f86ff;
  color:#fff;
}
.mini-btn{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:10px 14px;
  border-radius:8px;
  border:1px solid rgba(45, 78, 140, .14);
  background:#f6f8ff;
  font-weight:700;
  color:#33415c;
  cursor:pointer;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}
.mini-btn-compact{ padding:10px 12px; }

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
@media (max-width: 980px){
  .grid{ grid-template-columns: 1fr; }
  .actions-col{ width:100%; justify-content:flex-start; }
  .btn{ width:100%; justify-content:center; }
  .filter-btn{ min-width: 180px; flex:1 1 180px; }
  .bar-wrap{ width: 110px; }
}
</style>
