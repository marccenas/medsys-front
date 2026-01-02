<template>
  <div class="appointments-ui">
    <!-- Top Header -->
    <div class="topbar">
      <div class="title-col">
        <h1 class="page-title">Appointments</h1>
        <div class="breadcrumb">
          <span class="crumb-strong">Appointment Overview</span>
          <span class="crumb-sep">›</span>
          <span class="crumb-muted">Manage all hospital appointments.</span>
        </div>
      </div>

      <div class="actions-col">
        <button class="btn btn-primary" type="button" @click="onAdd">
          <font-awesome-icon class="fa-ic" icon="plus" />
          <span>Add Appointment</span>
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
          <button class="menu-item" type="button" @click="setDept('all')">All Departments</button>
          <button class="menu-item" type="button" @click="setDept('Cardiology')">Cardiology</button>
          <button class="menu-item" type="button" @click="setDept('Emergency')">Emergency</button>
          <button class="menu-item" type="button" @click="setDept('Pediatrics')">Pediatrics</button>
          <button class="menu-item" type="button" @click="setDept('Neurology')">Neurology</button>
        </div>
      </div>

      <div class="dropdown" ref="providerRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('provider')">
          <span>{{ providerLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'provider'" class="menu" @click.stop>
          <button class="menu-item" type="button" @click="setProvider('all')">All Providers</button>
          <button class="menu-item" type="button" @click="setProvider('Dr. Sarah Mitchell')">Dr. Sarah Mitchell</button>
          <button class="menu-item" type="button" @click="setProvider('Dr. William Parker')">Dr. William Parker</button>
          <button class="menu-item" type="button" @click="setProvider('Michael Reynolds')">Michael Reynolds</button>
          <button class="menu-item" type="button" @click="setProvider('Karen Simmons')">Karen Simmons</button>
        </div>
      </div>

      <div class="dropdown" ref="statusRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('status')">
          <span>{{ statusLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'status'" class="menu" @click.stop>
          <button class="menu-item" type="button" @click="setStatus('all')">All Status</button>
          <button class="menu-item" type="button" @click="setStatus('Upcoming')">Upcoming</button>
          <button class="menu-item" type="button" @click="setStatus('Completed')">Completed</button>
          <button class="menu-item" type="button" @click="setStatus('Updated')">Updated</button>
          <button class="menu-item" type="button" @click="setStatus('Canceled')">Canceled</button>
        </div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="stats">
      <div class="stats-label">
        <span>Today's Appointments</span>
      </div>

      <div class="stat-card stat-blue">
        <div class="stat-number">{{ kpis.procedures.toLocaleString() }}</div>
        <div class="stat-text">Procedures</div>
      </div>

      <div class="stat-card stat-teal">
        <div class="stat-number">{{ kpis.followUp.toLocaleString() }}</div>
        <div class="stat-text">Follow-Up</div>
      </div>

      <div class="stat-card stat-red">
        <div class="stat-number">{{ kpis.newConsults.toLocaleString() }}</div>
        <div class="stat-text">New Consults</div>
      </div>

      <div class="stat-card stat-orange">
        <div class="stat-number">{{ kpis.otherProcedures.toLocaleString() }}</div>
        <div class="stat-text">Procedures</div>
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
          @change="toggleAllOnPage($event.target.checked)"
        />

        <div class="dropdown" ref="tableExportRef">
          <button class="mini-btn" type="button" @click="toggleDropdown('tableExport')">
            <font-awesome-icon class="fa-ic" icon="file-arrow-down" />
            <span>Export</span>
          </button>
          <div v-show="openDropdown === 'tableExport'" class="menu" @click.stop>
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

      <div class="right-controls">
        <div class="dropdown" ref="bulkRef">
          <button class="mini-btn" type="button" @click="toggleDropdown('bulk')">
            <span>Bulk Actions</span>
            <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
          </button>

          <div v-show="openDropdown === 'bulk'" class="menu menu-right" @click.stop>
            <button class="menu-item" type="button" @click="bulkSetStatus('Upcoming')">Mark Upcoming</button>
            <button class="menu-item" type="button" @click="bulkSetStatus('Completed')">Mark Completed</button>
            <button class="menu-item" type="button" @click="bulkSetStatus('Canceled')">Mark Canceled</button>
            <div class="menu-sep"></div>
            <button class="menu-item danger" type="button" @click="bulkRemove">Remove Selected</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="appointments-table">
        <thead>
          <tr>
            <!-- ✅ MUST be a TH, not floating inside TR -->
            <th class="w-check">
              <input
                class="chk"
                type="checkbox"
                :checked="isAllOnPageSelected"
                :indeterminate.prop="isSomeOnPageSelected && !isAllOnPageSelected"
                @change="toggleAllOnPage($event.target.checked)"
              />
            </th>

            <th>
              <div class="th-sort">
                <span>Name</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Appointment ID</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Date</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Department</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Provider</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Status</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th class="w-actions">
              <div class="th-sort">
                <span>Actions</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="a in pagedAppointments" :key="a.id">
            <td class="w-check">
              <input
                class="chk"
                type="checkbox"
                :checked="selectedIds.has(a.id)"
                @change="toggleRow(a.id, $event.target.checked)"
              />
            </td>

            <td>
              <div class="name-cell">
                <img class="avatar" :src="a.avatar" alt="" />
                <span class="name">{{ a.name }}</span>
              </div>
            </td>

            <td>
              <a class="aid" href="#" @click.prevent="onView(a)">{{ a.apptId }}</a>
            </td>

            <td class="date">{{ formatDate(a.date) }}</td>

            <td class="muted">{{ a.department }}</td>

            <td>
              <a class="provider" href="#" @click.prevent="noop">{{ a.provider }}</a>
            </td>

            <td>
              <span class="badge" :class="badgeClass(a.status)">{{ a.status }}</span>
            </td>

            <td class="w-actions">
              <div class="dropdown row-dd" :ref="setRowRef(a.id)">
                <button class="view-btn" type="button" @click="toggleRowDropdown(a.id)">
                  <span>View</span>
                  <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
                </button>

                <div v-show="openRowDropdown === a.id" class="menu menu-right" @click.stop>
                  <button class="menu-item" type="button" @click="onView(a)">View Details</button>
                  <button class="menu-item" type="button" @click="onEdit(a)">Edit</button>
                  <div class="menu-sep"></div>
                  <button class="menu-item" type="button" @click="setOneStatus(a, 'Upcoming')">Mark Upcoming</button>
                  <button class="menu-item" type="button" @click="setOneStatus(a, 'Completed')">Mark Completed</button>
                  <button class="menu-item" type="button" @click="setOneStatus(a, 'Canceled')">Mark Canceled</button>
                  <div class="menu-sep"></div>
                  <button class="menu-item danger" type="button" @click="removeOne(a)">Remove</button>
                </div>
              </div>
            </td>
          </tr>

          <tr v-if="pagedAppointments.length === 0">
            <td colspan="8" class="empty">No appointments found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="table-footer">
      <div class="footer-left">Showing {{ pagedAppointments.length }} out of {{ filtered.length }} appointments</div>

      <div class="footer-right">
        <div class="pager">
          <button class="pg-btn" :disabled="page === 1" @click="goTo(page - 1)">
            <font-awesome-icon class="fa-ic" icon="angle-left" />
          </button>

          <button class="pg-num" :class="{ active: page === 1 }" @click="goTo(1)">1</button>
          <button class="pg-num" :class="{ active: page === 2 }" @click="goTo(2)">2</button>
          <button class="pg-num" :class="{ active: page === 3 }" @click="goTo(3)">3</button>
          <span class="pg-dots">…</span>
          <button class="pg-num" :class="{ active: page === totalPages }" @click="goTo(totalPages)">
            {{ totalPages }}
          </button>

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
const providerRef = ref(null);
const statusRef = ref(null);
const bulkRef = ref(null);
const rowRefs = reactive(new Map());

const filters = reactive({
  search: "",
  dept: "all",
  provider: "all",
  status: "all",
});

const kpis = reactive({
  procedures: 72,
  followUp: 345,
  newConsults: 209,
  otherProcedures: 57,
});

const page = ref(1);
const pageSize = ref(10);

const selectedIds = ref(new Set());

const appointments = ref([
  { id: 1, name: "Laura Williams", apptId: "A-85462", date: "2024-04-22", department: "Cardiology", provider: "Dr. Sarah Mitchell", status: "Upcoming", avatar: "https://i.pravatar.cc/80?img=47" },
  { id: 2, name: "Mark Johnson", apptId: "A-85461", date: "2024-04-22", department: "Emergency", provider: "Dr. William Parker", status: "Updated", avatar: "https://i.pravatar.cc/80?img=12" },
  { id: 3, name: "Cleo Anderson", apptId: "A-85450", date: "2024-04-21", department: "Pediatrics", provider: "Michael Reynolds", status: "Completed", avatar: "https://i.pravatar.cc/80?img=32" },
  { id: 4, name: "Olivia Harris", apptId: "A-85458", date: "2024-04-18", department: "Neurology", provider: "Dr. Sarah Mitchell", status: "Upcoming", avatar: "https://i.pravatar.cc/80?img=5" },
  { id: 5, name: "William Martinez", apptId: "A-85433", date: "2024-04-17", department: "Neurology", provider: "Karen Simmons", status: "Updated", avatar: "https://i.pravatar.cc/80?img=68" },
  { id: 6, name: "William Clark", apptId: "A-85420", date: "2024-04-19", department: "Cardiology", provider: "Karen Simmons", status: "Completed", avatar: "https://i.pravatar.cc/80?img=13" },
  { id: 7, name: "Emily Roberts", apptId: "A-85422", date: "2024-04-12", department: "Cardiology", provider: "Steven Schmidt", status: "Completed", avatar: "https://i.pravatar.cc/80?img=43" },
  { id: 8, name: "James Garrett", apptId: "A-85418", date: "2024-04-12", department: "Neurology", provider: "UnitedCare", status: "Completed", avatar: "https://i.pravatar.cc/80?img=59" },
  { id: 9, name: "Michael Foster", apptId: "A-85410", date: "2024-04-10", department: "Emergency", provider: "Michael Renger", status: "Canceled", avatar: "https://i.pravatar.cc/80?img=9" },
  { id: 10, name: "Angelina Ward", apptId: "A-85402", date: "2024-04-09", department: "Neurology", provider: "Steven Schmidt", status: "Updated", avatar: "https://i.pravatar.cc/80?img=30" },
]);

const filtered = computed(() => {
  const q = filters.search.toLowerCase();
  return appointments.value.filter((a) => {
    const matchesQ = !q || `${a.name} ${a.apptId} ${a.provider} ${a.department}`.toLowerCase().includes(q);
    const matchesDept = filters.dept === "all" || a.department === filters.dept;
    const matchesProvider = filters.provider === "all" || a.provider === filters.provider;
    const matchesStatus = filters.status === "all" || a.status === filters.status;
    return matchesQ && matchesDept && matchesProvider && matchesStatus;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));

const pagedAppointments = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

/* ✅ FIX: safe booleans */
const isAllOnPageSelected = computed(() => {
  if (!pagedAppointments.value.length) return false;
  return pagedAppointments.value.every((a) => selectedIds.value.has(a.id));
});
const isSomeOnPageSelected = computed(() => {
  return pagedAppointments.value.some((a) => selectedIds.value.has(a.id));
});

watch(
  [() => filters.search, () => filters.dept, () => filters.provider, () => filters.status, pageSize],
  () => {
    page.value = 1;
    selectedIds.value = new Set(); /* ✅ reset selection on filter change */
    closeAll();
  }
);

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

  const globals = [topExportRef.value, tableExportRef.value, deptRef.value, providerRef.value, statusRef.value, bulkRef.value].filter(Boolean);
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
const deptLabel = computed(() => (filters.dept === "all" ? "All Departments" : filters.dept));
const providerLabel = computed(() => (filters.provider === "all" ? "All Providers" : filters.provider));
const statusLabel = computed(() => (filters.status === "all" ? "All Status" : filters.status));

function setDept(v) { filters.dept = v; closeAll(); }
function setProvider(v) { filters.provider = v; closeAll(); }
function setStatus(v) { filters.status = v; closeAll(); }

/* ✅ selection */
function toggleRow(id, checked) {
  const next = new Set(selectedIds.value);
  checked ? next.add(id) : next.delete(id);
  selectedIds.value = next;
}
function toggleAllOnPage(checked) {
  const next = new Set(selectedIds.value);
  for (const a of pagedAppointments.value) checked ? next.add(a.id) : next.delete(a.id);
  selectedIds.value = next;
}

/* actions */
function onAdd() { console.log("Add appointment"); }
function onView(a) { console.log("View", a); closeAll(); }
function onEdit(a) { console.log("Edit", a); closeAll(); }

function setOneStatus(a, s) { a.status = s; closeAll(); }

function bulkSetStatus(s) {
  appointments.value = appointments.value.map((a) => (selectedIds.value.has(a.id) ? { ...a, status: s } : a));
  closeAll();
}
function bulkRemove() {
  const ids = new Set(selectedIds.value);
  appointments.value = appointments.value.filter((a) => !ids.has(a.id));
  selectedIds.value = new Set();
  closeAll();
}
function removeOne(a) {
  appointments.value = appointments.value.filter((x) => x.id !== a.id);
  const next = new Set(selectedIds.value);
  next.delete(a.id);
  selectedIds.value = next;
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
function badgeClass(s) {
  if (s === "Upcoming") return "badge-upcoming";
  if (s === "Completed") return "badge-completed";
  if (s === "Canceled") return "badge-canceled";
  if (s === "Updated") return "badge-updated";
  return "badge-upcoming";
}
function noop(){}

/* export */
function exportCSV(mode) {
  const rows = mode === "selected"
    ? appointments.value.filter((a) => selectedIds.value.has(a.id))
    : filtered.value;

  const headers = ["Name", "Appointment ID", "Date", "Department", "Provider", "Status"];
  const escape = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };

  const csv = [
    headers.join(","),
    ...rows.map((a) => [a.name, a.apptId, a.date, a.department, a.provider, a.status].map(escape).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `appointments_${mode}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  closeAll();
}
</script>

<style scoped>
/* Patients-style shell */
.appointments-ui{
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

/* stats */
.stats{
  display:flex;
  align-items:center;
  gap:14px;
  flex-wrap:wrap;
  margin-bottom:14px;
}
.stats-label{
  flex: 0 0 auto;
  background:#f6f8ff;
  border:1px solid rgba(45, 78, 140, .12);
  border-radius:8px;
  padding:14px 18px;
  color:#2b3a5b;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
  font-weight:700;
}
.stat-card{
  flex: 1 1 190px;
  min-width: 190px;
  border-radius:8px;
  padding:14px 16px;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  box-shadow: 0 14px 26px rgba(17, 36, 80, 0.14);
}
.stat-number{ font-size:30px; font-weight:800; line-height:1; }
.stat-text{ font-weight:700; opacity:.95; }
.stat-blue{ background: linear-gradient(90deg, #2f86ff, #2c63d6); }
.stat-teal{ background: linear-gradient(90deg, #45d3c2, #25b6a8); }
.stat-red{ background: linear-gradient(90deg, #ff7e7e, #ff5a5a); }
.stat-orange{ background: linear-gradient(90deg, #ffb15a, #ff8e3d); }

/* controls */
.table-controls{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:10px;
}
.left-controls, .right-controls{
  display:flex;
  align-items:center;
  gap:10px;
}
.chk{
  width:18px;
  height:18px;
  accent-color:#2f86ff;
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
.mini-btn:disabled{ opacity:.55; cursor:not-allowed; }

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
.menu-item.danger{ color:#b42318; }
.menu-item.danger:hover{ background: rgba(180,35,24,.08); }
.menu-item:disabled{ opacity:.5; cursor:not-allowed; }

/* table */
.table-wrap{
  background:#fff;
  border-radius:10px;
  border:1px solid rgba(45, 78, 140, .14);
  box-shadow: 0 16px 32px rgba(17, 36, 80, 0.10);
  overflow:hidden;
}
.appointments-table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
}
.appointments-table th.w-check,
.appointments-table td.w-check{
  padding-left: 14px;
  padding-right: 14px;
  text-align: left;
  vertical-align: middle;
}

.appointments-table th.w-check .chk{
  display: inline-block;
  margin: 0;            /* prevents it drifting */
  transform: translateY(1px);
}
.appointments-table thead th{
  background:#f3f6ff;
  font-size:13px;
  color:#43506b;
  font-weight:800;
  padding:14px 14px;
  border-bottom:1px solid rgba(45, 78, 140, .14);
}
.appointments-table tbody td{
  padding:12px 14px;
  border-bottom:1px solid rgba(45, 78, 140, .10);
  font-weight:600;
  color:#2b3a5b;
}
.appointments-table tbody tr:hover td{ background:#f8faff; }

.w-check{ width:46px; }
.w-actions{ width:150px; text-align:right; }

.th-sort{
  display:flex;
  align-items:center;
  gap:10px;
}
.th-caret{ opacity:.6; font-size:12px; }

.name-cell{
  display:flex;
  align-items:center;
  gap:12px;
}
.avatar{
  width:34px;
  height:34px;
  border-radius:999px;
  border:2px solid #dbe6ff;
  object-fit:cover;
  background:#fff;
}
.name{ font-weight:600; color:#1f2a44; }

.aid{
  color:#2f86ff;
  text-decoration:none;
  font-weight:800;
}
.aid:hover{ text-decoration:underline; }

.provider{
  color:#2f86ff;
  text-decoration:none;
  font-weight:800;
}
.provider:hover{ text-decoration:underline; }

.muted{ opacity:.85; }

/* badges */
.badge{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:6px 12px;
  border-radius:6px;
  font-weight:900;
  font-size:13px;
  border:1px solid transparent;
}
.badge-upcoming{
  background: rgba(44, 214, 175, .16);
  border-color: rgba(44, 214, 175, .30);
  color:#1b8f79;
}
.badge-completed{
  background: rgba(88, 117, 255, .16);
  border-color: rgba(88, 117, 255, .28);
  color:#2c3fd6;
}
.badge-updated{
  background: rgba(255, 177, 90, .18);
  border-color: rgba(255, 177, 90, .34);
  color:#b56a14;
}
.badge-canceled{
  background: rgba(255, 90, 90, .16);
  border-color: rgba(255, 90, 90, .30);
  color:#c13b3b;
}

/* view button */
.view-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  width: 108px;
  padding:10px 12px;
  border:none;
  border-radius:8px;
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
  font-weight:800;
  cursor:pointer;
  box-shadow: 0 10px 22px rgba(47, 134, 255, 0.28);
}

.empty{
  text-align:center;
  padding:22px 14px;
  color:#617093;
  font-weight:800;
}

/* footer */
.table-footer{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding: 10px 6px 0;
  margin-top:10px;
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
.pg-dots{ padding: 0 6px; opacity:.6; }

.perpage{
  display:flex;
  align-items:center;
  gap:8px;
  border:1px solid rgba(45, 78, 140, .18);
  background:#f6f8ff;
  color:#2b3a5b;
  border-radius:6px;
  height:30px;
  padding:0 10px;
  font-weight:800;
}
.perpage select{
  border:none;
  background:transparent;
  outline:none;
  font-weight:800;
  color:#2b3a5b;
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
@media (max-width: 980px){
  .actions-col{ width:100%; justify-content:flex-start; }
  .btn{ width:100%; justify-content:center; }
  .filter-btn{ min-width: 180px; flex:1 1 180px; }
}
</style>
