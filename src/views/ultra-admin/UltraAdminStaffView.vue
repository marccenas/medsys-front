<template>
  <div class="staff-ui">
    <!-- Top Header -->
    <div class="topbar">
      <div class="title-col">
        <h1 class="page-title">Staff</h1>
        <div class="breadcrumb">
          <span class="crumb-strong">Staff Overview</span>
          <span class="crumb-sep">›</span>
          <span class="crumb-muted">Manage all hospital staff members.</span>
        </div>
      </div>

      <div class="actions-col">
        <button class="btn btn-primary" type="button" @click="openAdd = true">
          <font-awesome-icon class="fa-ic" icon="plus" />
          <span>Add New Staff</span>
        </button>

        <div class="dropdown" ref="topExportRef">
          <button class="btn btn-secondary" type="button" @click="toggleDropdown('topExport')">
            <font-awesome-icon class="fa-ic" icon="file-arrow-down" />
            <span>Export</span>
            <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
          </button>

          <div v-show="openDropdown === 'topExport'" class="menu menu-right" @click.stop>
            <button class="menu-item" type="button" @click="exportCsv()">Export CSV</button>
            <button class="menu-item" type="button" @click="exportSelectedCsv()">
              Export Selected (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters">
      <div class="search">
        <font-awesome-icon class="fa-ic" icon="magnifying-glass" />
        <input v-model.trim="q" type="text" placeholder="Search..." />
      </div>

      <div class="dropdown" ref="deptRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('dept')">
          <span>{{ deptLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'dept'" class="menu" @click.stop>
          <button class="menu-item" type="button" @click="setDept('')">All Departments</button>
          <button
            class="menu-item"
            v-for="d in departments"
            :key="d"
            type="button"
            @click="setDept(d)"
          >
            {{ d }}
          </button>
        </div>
      </div>

      <div class="dropdown" ref="roleRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('role')">
          <span>{{ roleLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'role'" class="menu" @click.stop>
          <button class="menu-item" type="button" @click="setRole('')">All Roles</button>
          <button
            class="menu-item"
            v-for="r in roleOptions"
            :key="r"
            type="button"
            @click="setRole(r)"
          >
            {{ r }}
          </button>
        </div>
      </div>

      <div class="dropdown" ref="statusRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('status')">
          <span>{{ statusLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'status'" class="menu" @click.stop>
          <button class="menu-item" type="button" @click="setStatus('')">All Status</button>
          <button class="menu-item" type="button" @click="setStatus('Active')">Active</button>
          <button class="menu-item" type="button" @click="setStatus('Inactive')">Inactive</button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="stats">
      <div class="stats-label">
        <span>Total Staff: </span>
        <strong>{{ filteredAll.length.toLocaleString() }}</strong>
      </div>

      <div class="stat-card stat-blue">
        <div class="stat-number">{{ counts.doctors.toLocaleString() }}</div>
        <div class="stat-text">Doctors</div>
      </div>

      <div class="stat-card stat-teal">
        <div class="stat-number">{{ counts.nurses.toLocaleString() }}</div>
        <div class="stat-text">Nurses</div>
      </div>

      <div class="stat-card stat-purple">
        <div class="stat-number">{{ counts.techs.toLocaleString() }}</div>
        <div class="stat-text">Technicians</div>
      </div>

      <div class="stat-card stat-orange">
        <div class="stat-number">{{ counts.admin.toLocaleString() }}</div>
        <div class="stat-text">Admin Staff</div>
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

        <div class="dropdown" ref="exportRef">
          <button class="mini-btn" type="button" @click="toggleDropdown('export')">
            <font-awesome-icon class="fa-ic" icon="file-arrow-down" />
            <span>Export</span>
          </button>
          <div v-show="openDropdown === 'export'" class="menu" @click.stop>
            <button class="menu-item" type="button" @click="exportCsv()">Export CSV</button>
            <button class="menu-item" type="button" @click="exportSelectedCsv()">Export Selected (CSV)</button>
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
            <button class="menu-item" type="button" @click="bulkSetStatus('Active')">Mark as Active</button>
            <button class="menu-item" type="button" @click="bulkSetStatus('Inactive')">Mark as Inactive</button>
            <div class="menu-sep"></div>
            <button class="menu-item danger" type="button" @click="bulkDelete()">Delete (UI)</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="staff-table">
        <thead>
          <tr>
            <th class="w-check"></th>

            <th>
              <div class="th-sort">
                <span>Name</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Role</span>
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
                <span>Phone Number</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Email</span>
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
          <tr v-for="s in pageRows" :key="s.id">
            <td class="w-check">
              <input class="chk" type="checkbox" :checked="selected.has(s.id)" @change="toggleRow(s.id, $event.target.checked)" />
            </td>

            <td>
              <div class="name-cell">
                <img class="avatar" :src="s.photo || fallbackAvatar(s.name)" alt="" />
                <div class="name-meta">
                  <div class="nm">{{ s.name }}</div>
                  <div class="sub">{{ s.title }}</div>
                </div>
              </div>
            </td>

            <td class="muted">{{ s.role }}</td>
            <td class="muted">{{ s.department }}</td>

            <td class="muted">
              <font-awesome-icon class="fa-ic phone-ico" icon="phone" />
              {{ s.phone }}
            </td>

            <td>
              <a href="#" class="email" @click.prevent="noop">{{ s.email }}</a>
            </td>

            <td>
              <span class="badge" :class="s.status === 'Active' ? 'badge-ok' : 'badge-warn'">
                {{ s.status }}
              </span>
            </td>

            <td class="w-actions">
              <div class="dropdown row-dd" :ref="setRowRef(s.id)">
                <button class="view-btn" type="button" @click="toggleRowDropdown(s.id)">
                  <span>View</span>
                  <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
                </button>

                <div v-show="openRowDropdown === s.id" class="menu menu-right" @click.stop>
                  <button class="menu-item" type="button" @click="viewStaff(s)">View Profile (UI)</button>
                  <button class="menu-item" type="button" @click="editStaff(s)">Edit (UI)</button>
                  <div class="menu-sep"></div>
                  <button class="menu-item danger" type="button" @click="deleteStaff(s.id)">Delete (UI)</button>
                </div>
              </div>
            </td>
          </tr>

          <tr v-if="pageRows.length === 0">
            <td colspan="8" class="empty">No staff found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer pagination (Patients style) -->
    <div class="table-footer">
      <div class="footer-left">Showing {{ pageRows.length }} out of {{ filteredAll.length }} staff</div>

      <div class="footer-right">
        <div class="pager">
          <button class="pg-btn" :disabled="page === 1" @click="goTo(page - 1)">
            <font-awesome-icon class="fa-ic" icon="angle-left" />
          </button>

          <button
            v-for="p in pageButtons"
            :key="p"
            class="pg-num"
            :class="{ active: p === page }"
            @click="goTo(p)"
          >
            {{ p }}
          </button>

          <button class="pg-btn" :disabled="page === totalPages" @click="goTo(page + 1)">
            <font-awesome-icon class="fa-ic" icon="angle-right" />
          </button>
        </div>

        <div class="dropdown" ref="perRef">
          <button class="mini-btn mini-btn-compact" type="button" @click="toggleDropdown('per')">
            <span>{{ perPage }}</span>
            <span>/ page</span>
            <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
          </button>

          <div v-show="openDropdown === 'per'" class="menu menu-right" @click.stop>
            <button class="menu-item" type="button" @click="setPer(10)">10 / page</button>
            <button class="menu-item" type="button" @click="setPer(20)">20 / page</button>
            <button class="menu-item" type="button" @click="setPer(50)">50 / page</button>
          </div>
        </div>
      </div>
    </div>

    <!-- clickout -->
    <div v-if="openDropdown || openRowDropdown" class="clickout" @click="closeAll"></div>

    <!-- Add Staff Modal -->
    <div class="modal" v-if="openAdd" @click.self="openAdd = false">
      <div class="modal-card">
        <div class="modal-head">
          <div class="modal-title">Add New Staff</div>
          <button class="x" type="button" @click="openAdd = false">✕</button>
        </div>

        <div class="modal-body">
          <div class="grid2">
            <input class="input2" v-model.trim="add.name" placeholder="Full Name" />
            <input class="input2" v-model.trim="add.email" placeholder="Email" />
            <input class="input2" v-model.trim="add.phone" placeholder="Phone" />
            <input class="input2" v-model.trim="add.department" placeholder="Department" />
            <input class="input2" v-model.trim="add.role" placeholder="Role" />
            <select class="input2" v-model="add.status">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div class="hint">Frontend-only: adds to table and localStorage.</div>
        </div>

        <div class="modal-foot">
          <button class="btn btn-secondary" type="button" @click="openAdd = false">Cancel</button>
          <button class="btn btn-primary" type="button" @click="addStaff">Add Staff</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

const STORAGE_KEY = "medsystem_ultra_staff_v1";

/* filters */
const q = ref("");
const dept = ref("");
const role = ref("");
const status = ref("");

/* paging */
const page = ref(1);
const perPage = ref(10);

/* dropdowns */
const openDropdown = ref(null); // 'topExport'|'dept'|'role'|'status'|'export'|'bulk'|'per'|null
const openRowDropdown = ref(null); // staff id | null

/* refs for click-out */
const topExportRef = ref(null);
const deptRef = ref(null);
const roleRef = ref(null);
const statusRef = ref(null);
const exportRef = ref(null);
const bulkRef = ref(null);
const perRef = ref(null);
const rowRefs = reactive(new Map());

/* modal */
const openAdd = ref(false);
const add = reactive({
  name: "",
  title: "Staff Member",
  email: "",
  phone: "",
  department: "",
  role: "",
  status: "Active",
});

/* options */
const departments = ["Emergency", "Cardiology", "Neurology", "Radiology", "Pediatrics", "Administration"];
const roleOptions = [
  "Attending Physician",
  "Resident Doctor",
  "Intern Doctor",
  "Nurse Unit Manager",
  "Registered Nurse",
  "Licensed Practical Nurse (LPN)",
  "Medical Laboratory Tech",
  "Radiologic Technologist",
  "Admin Manager",
];

/* selection */
const selected = ref(new Set());

/* data */
const staff = ref([
  { id: 1, name: "Dr. Sarah Mitchell", title: "Attending Physician", role: "Attending Physician", department: "Cardiology", phone: "456-736-2389", email: "sarahit@abc.com", status: "Active" },
  { id: 2, name: "Dr. William Parker", title: "Resident Doctor", role: "Resident Doctor", department: "Emergency", phone: "725-725-2233", email: "ryparker@abpilis.com", status: "Active" },
  { id: 3, name: "Michael Reynolds", title: "Intern Doctor", role: "Intern Doctor", department: "Pediatrics", phone: "725-725-2999", email: "mthaalD@sjupills.com", status: "Active" },
  { id: 4, name: "Karen Simmons", title: "Nurse Unit Manager", role: "Nurse Unit Manager", department: "Neurology", phone: "695-725-2998", email: "karen.simmons.com", status: "Active" },
  { id: 5, name: "Laura Jennings", title: "Registered Nurse", role: "Registered Nurse", department: "Pediatrics", phone: "735-735-2993", email: "laura.jennings@com", status: "Active" },
  { id: 6, name: "Mark Foster", title: "Licensed Practical Nurse (LPN)", role: "Licensed Practical Nurse (LPN)", department: "Emergency", phone: "605-735-1253", email: "mark.foster@abc.com", status: "Active" },
  { id: 7, name: "Emily Turner", title: "Registered Nurse", role: "Registered Nurse", department: "Cardiology", phone: "725-725-2399", email: "emily.tumer@abc.com", status: "Active" },
  { id: 8, name: "James Murphy", title: "Medical Laboratory Tech", role: "Medical Laboratory Tech", department: "Radiology", phone: "725-725-2533", email: "james.murphy.com", status: "Inactive" },
  { id: 9, name: "Steven Schmidt", title: "Radiologic Technologist", role: "Radiologic Technologist", department: "Radiology", phone: "885-735-1938", email: "steven.schmidt@abc.com", status: "Inactive" },
  { id: 10, name: "Megan Richards", title: "Admin Manager", role: "Admin Manager", department: "Administration", phone: "725-725-2533", email: "megan.richards@abc.com", status: "Inactive" },
]);

/* persist load */
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) staff.value = parsed;
    } catch {}
  }
});

/* labels */
const deptLabel = computed(() => (dept.value ? dept.value : "All Departments"));
const roleLabel = computed(() => (role.value ? role.value : "All Roles"));
const statusLabel = computed(() => (status.value ? status.value : "All Status"));

/* filtering */
const filteredAll = computed(() => {
  const term = q.value.trim().toLowerCase();
  return staff.value.filter((s) => {
    const hit =
      !term ||
      s.name.toLowerCase().includes(term) ||
      (s.email || "").toLowerCase().includes(term) ||
      (s.phone || "").toLowerCase().includes(term);

    const okDept = !dept.value || s.department === dept.value;
    const okRole = !role.value || s.role === role.value;
    const okStatus = !status.value || s.status === status.value;

    return hit && okDept && okRole && okStatus;
  });
});

/* summary counts */
const counts = computed(() => {
  const list = filteredAll.value;
  const by = (pred) => list.filter(pred).length;
  return {
    doctors: by((s) => /Doctor|Physician/i.test(s.role)),
    nurses: by((s) => /Nurse/i.test(s.role)),
    techs: by((s) => /Technologist|Tech/i.test(s.role)),
    admin: by((s) => /Admin/i.test(s.role)),
  };
});

/* paging */
const totalPages = computed(() => Math.max(1, Math.ceil(filteredAll.value.length / perPage.value)));

watch([q, dept, role, status, perPage], () => {
  page.value = 1;
  selected.value = new Set();
  closeAll();
});

const pageRows = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filteredAll.value.slice(start, start + perPage.value);
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

/* selection helpers */
const isAllOnPageSelected = computed(() => {
  if (!pageRows.value.length) return false;
  return pageRows.value.every((r) => selected.value.has(r.id));
});
const isSomeOnPageSelected = computed(() => pageRows.value.some((r) => selected.value.has(r.id)));

function toggleRow(id, checked) {
  const next = new Set(selected.value);
  checked ? next.add(id) : next.delete(id);
  selected.value = next;
}
function toggleAllOnPage(checked) {
  const next = new Set(selected.value);
  for (const r of pageRows.value) checked ? next.add(r.id) : next.delete(r.id);
  selected.value = next;
}

/* dropdown + click-out */
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

function onDocClick(e) {
  if (!openDropdown.value && !openRowDropdown.value) return;
  const t = e.target;

  const globals = [topExportRef.value, deptRef.value, roleRef.value, statusRef.value, exportRef.value, bulkRef.value, perRef.value].filter(Boolean);
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

/* setters */
function setDept(v) { dept.value = v; closeAll(); }
function setRole(v) { role.value = v; closeAll(); }
function setStatus(v) { status.value = v; closeAll(); }
function setPer(v) { perPage.value = v; closeAll(); }

/* row actions */
function viewStaff(s) { window.alert(`Viewing ${s.name} (UI only)`); closeAll(); }
function editStaff(s) { window.alert(`Editing ${s.name} (UI only)`); closeAll(); }
function deleteStaff(id) {
  staff.value = staff.value.filter((x) => x.id !== id);
  const next = new Set(selected.value);
  next.delete(id);
  selected.value = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staff.value));
  closeAll();
}

/* bulk */
function bulkSetStatus(v) {
  if (!selected.value.size) return window.alert("Select at least one staff.");
  const ids = selected.value;
  staff.value = staff.value.map((s) => (ids.has(s.id) ? { ...s, status: v } : s));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staff.value));
  closeAll();
}
function bulkDelete() {
  if (!selected.value.size) return window.alert("Select at least one staff.");
  const ids = selected.value;
  staff.value = staff.value.filter((s) => !ids.has(s.id));
  selected.value = new Set();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staff.value));
  closeAll();
}

/* modal add */
function addStaff() {
  if (!add.name || !add.email) return window.alert("Name and Email are required.");

  staff.value.unshift({
    id: Date.now(),
    name: add.name,
    title: add.title || add.role || "Staff Member",
    role: add.role || "Staff",
    department: add.department || "Administration",
    phone: add.phone || "-",
    email: add.email,
    status: add.status || "Active",
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(staff.value));
  openAdd.value = false;

  add.name = "";
  add.title = "Staff Member";
  add.email = "";
  add.phone = "";
  add.department = "";
  add.role = "";
  add.status = "Active";
}

/* export csv */
function exportSelectedCsv() {
  if (!selected.value.size) return window.alert("Select at least one staff to export.");
  const rows = filteredAll.value.filter((r) => selected.value.has(r.id));
  downloadCsv(rows, "staff_selected.csv");
  closeAll();
}
function exportCsv() {
  downloadCsv(filteredAll.value, "staff.csv");
  closeAll();
}
function downloadCsv(rows, filename) {
  const header = ["Name", "Role", "Department", "Phone", "Email", "Status"];
  const csv = [
    header.join(","),
    ...rows.map((r) =>
      [r.name, r.role, r.department, r.phone, r.email, r.status]
        .map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* avatars */
function fallbackAvatar(name) {
  const seed = (name || "staff").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const img = (seed % 60) + 1;
  return `https://i.pravatar.cc/72?img=${img}`;
}

function noop(){}

/* pagination */
function goTo(p) {
  const next = Math.min(Math.max(1, p), totalPages.value);
  page.value = next;
}
</script>

<style scoped>
/* ================
   Patients-matching layout
================ */
.staff-ui{
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

/* buttons (same as Patients) */
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

/* stats row (same pattern) */
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
}
.stats-label strong{ font-size:18px; }

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
.stat-purple{ background: linear-gradient(90deg, #8b5cf6, #6d28d9); }
.stat-orange{ background: linear-gradient(90deg, #ffb15a, #ff8e3d); }

/* table controls */
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
.mini-btn-compact{ padding:10px 12px; }

/* dropdown menu (same as Patients) */
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

/* table */
.table-wrap{
  background:#fff;
  border-radius:10px;
  border:1px solid rgba(45, 78, 140, .14);
  box-shadow: 0 16px 32px rgba(17, 36, 80, 0.10);
  overflow:hidden;
}
.staff-table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
}
.staff-table thead th{
  background:#f3f6ff;
  font-size:13px;
  color:#43506b;
  font-weight:800;
  padding:14px 14px;
  border-bottom:1px solid rgba(45, 78, 140, .14);
}
.staff-table tbody td{
  padding:12px 14px;
  border-bottom:1px solid rgba(45, 78, 140, .10);
  font-weight:600;
  color:#2b3a5b;
}
.staff-table tbody tr:hover td{ background:#f8faff; }

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
.name-meta{ min-width:0; }
.nm{ font-weight:800; color:#1f2a44; line-height:1.1; }
.sub{ margin-top:2px; font-size:12px; opacity:.75; font-weight:700; }

.muted{ opacity:.8; }

.phone-ico{ opacity:.85; margin-right:8px; }

.email{
  color:#2f86ff;
  text-decoration:none;
  font-weight:800;
}
.email:hover{ text-decoration:underline; }

/* status badge (staff version matching Patients badge feel) */
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
.badge-ok{
  background: rgba(44, 214, 175, .16);
  border-color: rgba(44, 214, 175, .30);
  color:#1b8f79;
}
.badge-warn{
  background: rgba(255, 177, 90, .18);
  border-color: rgba(255, 177, 90, .34);
  color:#b56a14;
}

/* view button (same as Patients) */
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

/* footer pagination (Patients style) */
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

/* clickout */
.clickout{
  position:fixed;
  inset:0;
  z-index: 9000;
  background:transparent;
}

/* modal aligned with Patients look */
.modal{
  position: fixed;
  inset: 0;
  background: rgba(17, 36, 80, 0.35);
  display:grid;
  place-items:center;
  z-index: 12000;
}
.modal-card{
  width: min(760px, 92vw);
  border-radius: 16px;
  background:#fff;
  border: 1px solid rgba(45, 78, 140, .14);
  box-shadow: 0 30px 70px rgba(17, 36, 80, 0.25);
  overflow:hidden;
}
.modal-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.85));
  border-bottom: 1px solid rgba(45, 78, 140, .12);
}
.modal-title{ font-weight:900; color:#1f2a44; }
.x{
  border:0;
  background:transparent;
  cursor:pointer;
  font-weight: 600;
  font-size: 16px;
  color:#33415c;
}
.modal-body{ padding: 14px; }
.grid2{ display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.input2{
  width:100%;
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid rgba(45, 78, 140, .14);
  background:#fbfdff;
  font-weight: 700;
  outline:none;
}
.hint{ margin-top: 10px; font-size: 12px; color:#64748b; font-weight: 700; }
.modal-foot{
  display:flex;
  justify-content:flex-end;
  gap: 10px;
  padding: 12px 14px;
  border-top: 1px solid rgba(45, 78, 140, .12);
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
  .grid2{ grid-template-columns: 1fr; }
}
</style>
