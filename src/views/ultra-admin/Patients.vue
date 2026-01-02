<template>
  <div class="patients-ui">
    <!-- Top Header -->
    <div class="topbar">
      <div class="title-col">
        <h1 class="page-title">Patients</h1>
        <div class="breadcrumb">
          <span class="crumb-strong">Patient Overview</span>
          <span class="crumb-sep">›</span>
          <span class="crumb-muted">Manage all hospital patients.</span>
        </div>
      </div>

      <div class="actions-col">
        <button class="btn btn-primary" type="button" @click="onAdd">
          <font-awesome-icon class="fa-ic" icon="plus" />
          <span>Add New Patient</span>
        </button>

        <div class="dropdown" ref="topExportRef">
          <button class="btn btn-secondary" type="button" @click="toggleDropdown('topExport')">
            <font-awesome-icon class="fa-ic" icon="file-arrow-down" />
            <span>Export</span>
            <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
          </button>

          <div v-show="openDropdown === 'topExport'" class="menu menu-right" @click.stop>
            <button class="menu-item" type="button" @click="exportCSV('all')">Export all (CSV)</button>
            <button
              class="menu-item"
              type="button"
              :disabled="selectedIds.size === 0"
              @click="exportCSV('selected')"
            >
              Export selected (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters">
      <div class="search">
        <font-awesome-icon class="fa-ic" icon="magnifying-glass" />
        <input v-model.trim="filters.search" type="text" placeholder="Search..." />
      </div>

      <div class="dropdown" ref="deptRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('dept')">
          <span>{{ deptLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'dept'" class="menu" @click.stop>
          <button class="menu-item" @click="setDept('all')">All Departments</button>
          <button class="menu-item" @click="setDept('cardiology')">Cardiology</button>
          <button class="menu-item" @click="setDept('pediatrics')">Pediatrics</button>
          <button class="menu-item" @click="setDept('orthopedics')">Orthopedics</button>
        </div>
      </div>

      <div class="dropdown" ref="statusRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('status')">
          <span>{{ statusLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'status'" class="menu" @click.stop>
          <button class="menu-item" @click="setStatus('all')">All Status</button>
          <button class="menu-item" @click="setStatus('er')">ER</button>
          <button class="menu-item" @click="setStatus('inpatient')">Inpatient</button>
          <button class="menu-item" @click="setStatus('outpatient')">Outpatient</button>
        </div>
      </div>

      <div class="dropdown" ref="insRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('insurance')">
          <span>{{ insuranceLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'insurance'" class="menu" @click.stop>
          <button class="menu-item" @click="setInsurance('all')">All Insurance</button>
          <button class="menu-item" @click="setInsurance('bluecross')">BlueCross</button>
          <button class="menu-item" @click="setInsurance('unitedcare')">UnitedCare</button>
          <button class="menu-item" @click="setInsurance('selfpay')">Self-Pay</button>
        </div>
      </div>
    </div>

    <!-- Stat Cards (kept as-is, no extra icon styling needed) -->
    <div class="stats">
      <div class="stats-label">
        <span>Total Patients:</span>
        <strong>{{ totalPatients.toLocaleString() }}</strong>
      </div>

      <div class="stat-card stat-blue">
        <div class="stat-number">{{ totalPatients.toLocaleString() }}</div>
        <div class="stat-text">Patients</div>
      </div>

      <div class="stat-card stat-red">
        <div class="stat-number">{{ erVisits.toLocaleString() }}</div>
        <div class="stat-text">ER Visits</div>
      </div>

      <div class="stat-card stat-teal">
        <div class="stat-number">{{ inpatients.toLocaleString() }}</div>
        <div class="stat-text">Inpatients</div>
      </div>

      <div class="stat-card stat-orange">
        <div class="stat-number">{{ outpatients.toLocaleString() }}</div>
        <div class="stat-text">Outpatients</div>
      </div>
    </div>

    <!-- Table Controls -->
    <div class="table-controls">
      <div class="left-controls">
        <input
          class="chk"
          type="checkbox"
          :checked="isAllOnPageSelected"
          :indeterminate.prop="isSomeOnPageSelected && !isAllOnPageSelected"
          @change="toggleSelectAllOnPage($event.target.checked)"
        />

        <div class="dropdown" ref="tableExportRef">
          <button class="mini-btn" type="button" @click="toggleDropdown('tableExport')">
            <font-awesome-icon class="fa-ic" icon="file-arrow-down" />
            <span>Export</span>
          </button>
          <div v-show="openDropdown === 'tableExport'" class="menu" @click.stop>
            <button class="menu-item" @click="exportCSV('all')">Export all (CSV)</button>
            <button class="menu-item" :disabled="selectedIds.size === 0" @click="exportCSV('selected')">
              Export selected (CSV)
            </button>
          </div>
        </div>
      </div>

      <div class="right-controls">
        <div class="dropdown" ref="bulkRef">
          <button class="mini-btn" type="button" @click="toggleDropdown('bulk')">
            <span>Bulk Actions</span>
            <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
          </button>
          <div v-show="openDropdown === 'bulk'" class="menu menu-right" @click.stop>
            <button class="menu-item" @click="bulkSetStatus('er')">Mark ER</button>
            <button class="menu-item" @click="bulkSetStatus('inpatient')">Mark Inpatient</button>
            <button class="menu-item" @click="bulkSetStatus('outpatient')">Mark Outpatient</button>
            <div class="menu-sep"></div>
            <button class="menu-item danger" @click="bulkRemove">Remove Selected</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="patients-table">
        <thead>
          <tr>
            <th class="w-check"></th>
            <th>
              <div class="th-sort">
                <span>Name</span>
                <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
              </div>
            </th>
            <th>
              <div class="th-sort">
                <span>Patient ID</span>
                <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
              </div>
            </th>
            <th>
              <div class="th-sort">
                <span>Admission Date</span>
                <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
              </div>
            </th>
            <th>
              <div class="th-sort">
                <span>Status</span>
                <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
              </div>
            </th>
            <th>
              <div class="th-sort">
                <span>Insurance</span>
                <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
              </div>
            </th>
            <th class="w-actions">
              <div class="th-sort">
                <span>Bulk Actions</span>
                <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in pagedPatients" :key="p.id">
            <td class="w-check">
              <input class="chk" type="checkbox" :checked="selectedIds.has(p.id)" @change="toggleRow(p.id, $event.target.checked)" />
            </td>

            <td>
              <div class="name-cell">
                <img class="avatar" :src="p.avatar" alt="" />
                <span class="name">{{ p.name }}</span>
              </div>
            </td>

            <td>
              <a class="pid" href="#" @click.prevent="onView(p)">{{ p.patientId }}</a>
            </td>

            <td class="date">{{ formatDate(p.admissionDate) }}</td>

            <td>
              <span class="badge" :class="`badge-${p.status}`">{{ statusText(p.status) }}</span>
            </td>

            <td>
              <span class="insurance">
                <font-awesome-icon class="fa-ic" icon="notes-medical" />
                {{ insuranceText(p.insurance) }}
              </span>
            </td>

            <td class="w-actions">
              <div class="dropdown row-dd" :ref="setRowRef(p.id)">
                <button class="view-btn" type="button" @click="toggleRowDropdown(p.id)">
                  <span>View</span>
                  <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
                </button>

                <div v-show="openRowDropdown === p.id" class="menu menu-right" @click.stop>
                  <button class="menu-item" @click="onView(p)">View Profile</button>
                  <button class="menu-item" @click="onEdit(p)">Edit</button>
                  <div class="menu-sep"></div>
                  <button class="menu-item" @click="setOneStatus(p, 'er')">Mark ER</button>
                  <button class="menu-item" @click="setOneStatus(p, 'inpatient')">Mark Inpatient</button>
                  <button class="menu-item" @click="setOneStatus(p, 'outpatient')">Mark Outpatient</button>
                  <div class="menu-sep"></div>
                  <button class="menu-item danger" @click="removeOne(p)">Remove</button>
                </div>
              </div>
            </td>
          </tr>

          <tr v-if="pagedPatients.length === 0">
            <td colspan="7" class="empty">No patients found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="table-footer">
      <div class="footer-left">Showing {{ pagedPatients.length }} out of {{ totalPatients.toLocaleString() }} patients</div>

      <div class="footer-right">
        <div class="pager">
          <button class="pg-btn" :disabled="page === 1" @click="goTo(page - 1)">
            <font-awesome-icon class="fa-ic" icon="angle-left" />
          </button>

          <button class="pg-num" :class="{ active: page === 1 }" @click="goTo(1)">1</button>
          <button class="pg-num" :class="{ active: page === 2 }" @click="goTo(2)">2</button>
          <button class="pg-num" :class="{ active: page === 3 }" @click="goTo(3)">3</button>
          <span class="pg-dots">…</span>
          <button class="pg-num" :class="{ active: page === 248 }" @click="goTo(248)">248</button>

          <button class="pg-btn" :disabled="page === totalPages" @click="goTo(page + 1)">
            <font-awesome-icon class="fa-ic" icon="angle-right" />
          </button>
        </div>

        <div class="perpage">
          <select v-model.number="pageSize">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
          <span>/ page</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </div>
      </div>
    </div>

    <!-- clickout -->
    <div v-if="openDropdown || openRowDropdown" class="clickout" @click="closeAll"></div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

const openDropdown = ref(null);
const openRowDropdown = ref(null);

const topExportRef = ref(null);
const tableExportRef = ref(null);
const deptRef = ref(null);
const statusRef = ref(null);
const insRef = ref(null);
const bulkRef = ref(null);
const rowRefs = reactive(new Map());

const filters = reactive({
  search: "",
  dept: "all",
  status: "all",
  insurance: "all",
});

const totalPatients = ref(2450);
const erVisits = ref(545);
const inpatients = ref(1326);
const outpatients = ref(579);

const page = ref(1);
const pageSize = ref(10);

const selectedIds = ref(new Set());

const patients = ref([
  { id: 1, name: "Laura Williams", patientId: "P-2451", admissionDate: "2024-04-22", status: "er", insurance: "bluecross", avatar: "https://i.pravatar.cc/80?img=47", dept: "cardiology" },
  { id: 2, name: "Mark Johnson", patientId: "P-2452", admissionDate: "2024-04-21", status: "inpatient", insurance: "unitedcare", avatar: "https://i.pravatar.cc/80?img=12", dept: "orthopedics" },
  { id: 3, name: "Cleo Anderson", patientId: "P-2449", admissionDate: "2024-04-18", status: "inpatient", insurance: "unitedcare", avatar: "https://i.pravatar.cc/80?img=32", dept: "pediatrics" },
  { id: 4, name: "Olivia Harris", patientId: "P-2445", admissionDate: "2024-04-17", status: "inpatient", insurance: "unitedcare", avatar: "https://i.pravatar.cc/80?img=5", dept: "cardiology" },
  { id: 5, name: "William Martinez", patientId: "P-2437", admissionDate: "2024-04-16", status: "inpatient", insurance: "unitedcare", avatar: "https://i.pravatar.cc/80?img=68", dept: "orthopedics" },
  { id: 6, name: "William Clark", patientId: "P-2441", admissionDate: "2024-04-16", status: "inpatient", insurance: "unitedcare", avatar: "https://i.pravatar.cc/80?img=13", dept: "cardiology" },
  { id: 7, name: "Emily Roberts", patientId: "P-2435", admissionDate: "2024-04-13", status: "outpatient", insurance: "unitedcare", avatar: "https://i.pravatar.cc/80?img=43", dept: "pediatrics" },
  { id: 8, name: "James Garrett", patientId: "P-2431", admissionDate: "2024-04-12", status: "outpatient", insurance: "selfpay", avatar: "https://i.pravatar.cc/80?img=59", dept: "orthopedics" },
  { id: 9, name: "Michael Poster", patientId: "P-2429", admissionDate: "2024-04-10", status: "inpatient", insurance: "bluecross", avatar: "https://i.pravatar.cc/80?img=9", dept: "cardiology" },
  { id: 10, name: "Angelina Ward", patientId: "P-2425", admissionDate: "2024-04-09", status: "outpatient", insurance: "bluecross", avatar: "https://i.pravatar.cc/80?img=30", dept: "pediatrics" },
]);

const filtered = computed(() => {
  const q = filters.search.toLowerCase();
  return patients.value.filter((p) => {
    const matchesQ = !q || `${p.name} ${p.patientId}`.toLowerCase().includes(q);
    const matchesDept = filters.dept === "all" || p.dept === filters.dept;
    const matchesStatus = filters.status === "all" || p.status === filters.status;
    const matchesIns = filters.insurance === "all" || p.insurance === filters.insurance;
    return matchesQ && matchesDept && matchesStatus && matchesIns;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));

const pagedPatients = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

const isAllOnPageSelected = computed(() => pagedPatients.value.length && pagedPatients.value.every((p) => selectedIds.value.has(p.id)));
const isSomeOnPageSelected = computed(() => pagedPatients.value.some((p) => selectedIds.value.has(p.id)));

watch([() => filters.search, () => filters.dept, () => filters.status, () => filters.insurance, pageSize], () => {
  page.value = 1;
  closeAll();
});

function toggleDropdown(name) {
  openRowDropdown.value = null;
  openDropdown.value = openDropdown.value === name ? null : name;
}
function toggleRowDropdown(id) {
  openDropdown.value = null;
  openRowDropdown.value = openRowDropdown.value === id ? null : id;
}
function closeAll() {
  openDropdown.value = null;
  openRowDropdown.value = null;
}

function setRowRef(id) {
  return (el) => {
    if (!el) rowRefs.delete(id);
    else rowRefs.set(id, el);
  };
}

/* click-out */
function onDocClick(e) {
  if (!openDropdown.value && !openRowDropdown.value) return;
  const t = e.target;

  const globals = [topExportRef.value, tableExportRef.value, deptRef.value, statusRef.value, insRef.value, bulkRef.value].filter(Boolean);
  const rowEl = openRowDropdown.value != null ? rowRefs.get(openRowDropdown.value) : null;

  const insideGlobal = globals.some((el) => el.contains(t));
  const insideRow = rowEl ? rowEl.contains(t) : false;

  if (!insideGlobal && !insideRow) closeAll();
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

/* labels */
const deptLabel = computed(() => {
  if (filters.dept === "all") return "All Departments";
  if (filters.dept === "cardiology") return "Cardiology";
  if (filters.dept === "pediatrics") return "Pediatrics";
  if (filters.dept === "orthopedics") return "Orthopedics";
  return "All Departments";
});
const statusLabel = computed(() => {
  if (filters.status === "all") return "All Status";
  if (filters.status === "er") return "ER";
  if (filters.status === "inpatient") return "Inpatient";
  if (filters.status === "outpatient") return "Outpatient";
  return "All Status";
});
const insuranceLabel = computed(() => {
  if (filters.insurance === "all") return "All Insurance";
  if (filters.insurance === "bluecross") return "BlueCross";
  if (filters.insurance === "unitedcare") return "UnitedCare";
  if (filters.insurance === "selfpay") return "Self-Pay";
  return "All Insurance";
});

function setDept(v) { filters.dept = v; closeAll(); }
function setStatus(v) { filters.status = v; closeAll(); }
function setInsurance(v) { filters.insurance = v; closeAll(); }

/* selection */
function toggleRow(id, checked) {
  const next = new Set(selectedIds.value);
  checked ? next.add(id) : next.delete(id);
  selectedIds.value = next;
}
function toggleSelectAllOnPage(checked) {
  const next = new Set(selectedIds.value);
  for (const p of pagedPatients.value) checked ? next.add(p.id) : next.delete(p.id);
  selectedIds.value = next;
}

/* actions */
function onAdd() { console.log("Add new patient"); }
function onView(p) { console.log("View", p); closeAll(); }
function onEdit(p) { console.log("Edit", p); closeAll(); }
function bulkSetStatus(s) {
  patients.value = patients.value.map((p) => (selectedIds.value.has(p.id) ? { ...p, status: s } : p));
  closeAll();
}
function bulkRemove() {
  const ids = new Set(selectedIds.value);
  patients.value = patients.value.filter((p) => !ids.has(p.id));
  selectedIds.value = new Set();
  closeAll();
}
function setOneStatus(p, s) { p.status = s; closeAll(); }
function removeOne(p) {
  patients.value = patients.value.filter((x) => x.id !== p.id);
  selectedIds.value.delete(p.id);
  closeAll();
}

/* pagination */
function goTo(p) {
  const next = Math.min(Math.max(1, p), totalPages.value);
  page.value = next;
}

/* helpers */
function formatDate(yyyy_mm_dd) {
  const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "numeric" });
}
function statusText(s) {
  if (s === "er") return "ER";
  if (s === "inpatient") return "Inpatient";
  if (s === "outpatient") return "Outpatient";
  return "—";
}
function insuranceText(i) {
  if (i === "bluecross") return "BlueCross";
  if (i === "unitedcare") return "UnitedCare";
  if (i === "selfpay") return "Self-Pay";
  return "—";
}

/* export */
function exportCSV(mode) {
  const rows = mode === "selected"
    ? patients.value.filter((p) => selectedIds.value.has(p.id))
    : filtered.value;

  const headers = ["Name", "Patient ID", "Admission Date", "Status", "Insurance", "Department"];
  const escape = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };

  const csv = [
    headers.join(","),
    ...rows.map((p) =>
      [p.name, p.patientId, p.admissionDate, statusText(p.status), insuranceText(p.insurance), p.dept].map(escape).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `patients_${mode}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  closeAll();
}
</script>

<style scoped>
/* matches screenshot vibe (cool bluish panel + soft shadows) */
.patients-ui {
  padding: 22px 22px 16px;
  background: #eef3fb;
  min-height: calc(100vh - 60px);
}

/* header */
.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}
.page-title {
  margin: 0;
  font-size: 32px;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: #1f2a44;
}
.breadcrumb {
  margin-top: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.crumb-strong {
  color: #26355f;
  font-weight: 600;
}
.crumb-sep {
  opacity: 0.5;
}
.crumb-muted {
  opacity: 0.7;
}

.actions-col {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(17, 36, 80, 0.08);
}
.btn-primary {
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color: #fff;
}
.btn-secondary {
  background: #e9eef9;
  color: #33415c;
  border: 1px solid rgba(45, 78, 140, 0.15);
}
.caret {
  font-size: 12px;
  opacity: 0.7;
}

/* filters row */
.filters {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin: 6px 0 14px;
}
.search {
  flex: 1 1 260px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f6f8ff;
  border: 1px solid rgba(45, 78, 140, 0.14);
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}
.search :deep(svg) {
  opacity: 0.55;
}
.search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 14px;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 170px;
  padding: 10px 12px;
  background: #f6f8ff;
  border: 1px solid rgba(45, 78, 140, 0.14);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #33415c;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}

/* stats */
.stats {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.stats-label {
  flex: 0 0 auto;
  background: #f6f8ff;
  border: 1px solid rgba(45, 78, 140, 0.12);
  border-radius: 8px;
  padding: 14px 18px;
  color: #2b3a5b;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}
.stats-label strong {
  font-size: 18px;
}

.stat-card {
  flex: 1 1 190px;
  min-width: 190px;
  border-radius: 8px;
  padding: 14px 16px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 14px 26px rgba(17, 36, 80, 0.14);
}
.stat-number {
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
}
.stat-text {
  font-weight: 700;
  opacity: 0.95;
}
.stat-blue {
  background: linear-gradient(90deg, #2f86ff, #2c63d6);
}
.stat-red {
  background: linear-gradient(90deg, #ff6c78, #e64d56);
}
.stat-teal {
  background: linear-gradient(90deg, #45d3c2, #25b6a8);
}
.stat-orange {
  background: linear-gradient(90deg, #ffb15a, #ff8e3d);
}

/* table controls */
.table-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.left-controls,
.right-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.chk {
  width: 18px;
  height: 18px;
  accent-color: #2f86ff;
}

.mini-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(45, 78, 140, 0.14);
  background: #f6f8ff;
  font-weight: 700;
  color: #33415c;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}
.mini-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* dropdown menu */
.dropdown {
  position: relative;
}
.menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 220px;
  background: #ffffff;
  border: 1px solid rgba(45, 78, 140, 0.16);
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 18px 40px rgba(17, 36, 80, 0.18);
  z-index: 9999;
}
.menu-right {
  left: auto;
  right: 0;
}
.menu-item {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 10px 10px;
  border-radius: 8px;
  font-weight: 600;
  color: #2b3a5b;
  cursor: pointer;
}
.menu-item:hover {
  background: #eef4ff;
}
.menu-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.menu-sep {
  height: 1px;
  background: rgba(45, 78, 140, 0.14);
  margin: 6px 4px;
}
.menu-item.danger {
  color: #b42318;
}
.menu-item.danger:hover {
  background: rgba(180, 35, 24, 0.08);
}

/* table */
.table-wrap {
  background: #fff;
  border-radius: 10px;
  border: 1px solid rgba(45, 78, 140, 0.14);
  box-shadow: 0 16px 32px rgba(17, 36, 80, 0.1);
  overflow: hidden;
}
.patients-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.patients-table thead th {
  background: #f3f6ff;
  font-size: 13px;
  color: #43506b;
  font-weight: 800;
  padding: 14px 14px;
  border-bottom: 1px solid rgba(45, 78, 140, 0.14);
}
.patients-table tbody td {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(45, 78, 140, 0.1);
  font-weight: 600;
  color: #2b3a5b;
}
.patients-table tbody tr:hover td {
  background: #f8faff;
}
.w-check {
  width: 46px;
}
.w-actions {
  width: 150px;
  text-align: right;
}

.th-sort {
  display: flex;
  align-items: center;
  gap: 10px;
}
.th-sort :deep(svg) {
  font-size: 12px;
  opacity: 0.6;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 2px solid #dbe6ff;
  object-fit: cover;
  background: #fff;
}
.pid {
  color: #2f86ff;
  text-decoration: none;
  font-weight: 800;
}
.pid:hover {
  text-decoration: underline;
}
.date {
  color: #394764;
  font-weight: 700;
}

/* badges */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 900;
  font-size: 13px;
  border: 1px solid transparent;
}
.badge-er {
  background: rgba(255, 92, 103, 0.14);
  border-color: rgba(255, 92, 103, 0.3);
  color: #d94b55;
}
.badge-inpatient {
  background: rgba(44, 214, 175, 0.16);
  border-color: rgba(44, 214, 175, 0.3);
  color: #1b8f79;
}
.badge-outpatient {
  background: rgba(255, 177, 90, 0.18);
  border-color: rgba(255, 177, 90, 0.34);
  color: #b56a14;
}

/* insurance chip */
.insurance {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  background: #eef3ff;
  border: 1px solid rgba(45, 78, 140, 0.14);
  border-radius: 8px;
  font-weight: 800;
  color: #2b3a5b;
}
.insurance :deep(svg) {
  opacity: 0.75;
}

/* view btn */
.view-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 108px;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(47, 134, 255, 0.28);
}

/* footer bar */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 6px 0;
  margin-top: 10px;
  color: #4b5873;
  font-weight: 600;
}
.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pager {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pg-btn,
.pg-num {
  border: 1px solid rgba(45, 78, 140, 0.18);
  background: #f6f8ff;
  color: #2b3a5b;
  border-radius: 6px;
  height: 30px;
  min-width: 30px;
  padding: 0 10px;
  cursor: pointer;
  font-weight: 800;
}
.pg-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pg-num.active {
  background: #2f86ff;
  border-color: #2f86ff;
  color: #fff;
}
.pg-dots {
  padding: 0 6px;
  opacity: 0.7;
}

.perpage {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(45, 78, 140, 0.18);
  background: #f6f8ff;
  border-radius: 8px;
  padding: 6px 10px;
}
.perpage select {
  border: none;
  outline: none;
  background: transparent;
  font-weight: 800;
  color: #2b3a5b;
  appearance: none;
}

/* clickout */
.clickout {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: transparent;
}

.empty {
  text-align: center;
  padding: 22px 14px;
  color: #617093;
  font-weight: 800;
}

/* responsive */
@media (max-width: 980px) {
  .actions-col {
    width: 100%;
    justify-content: flex-start;
  }
  .btn {
    width: 100%;
    justify-content: center;
  }
  .filter-btn {
    min-width: 180px;
    flex: 1 1 180px;
  }
}

/* ✅ Minimal icon CSS only (doesn't touch your existing layout styles) */
.fa-ic {
  width: 1em;        /* keeps SVG aligned like text */
  height: 1em;
  display: inline-block;
  vertical-align: -0.125em;
  line-height: 1;
}
.fa-caret {
  font-size: 0.85em; /* slightly smaller chevrons like the UI */
  opacity: 0.75;
}

/* Some scoped environments won't style svg unless deep */
:deep(.fa-ic) svg {
  width: 1em;
  height: 1em;
  display: block;
}
</style>
