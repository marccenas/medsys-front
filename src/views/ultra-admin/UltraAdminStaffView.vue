<template>
  <div class="staff-page">
    <!-- HEADER -->
    <div class="staff-header">
      <div class="h-left">
        <div class="h-title">Staff</div>
        <div class="h-sub">
          <span class="crumb strong">Staff Overview</span>
          <span class="crumb muted">›</span>
          <span class="crumb muted">Manage all hospital staff members.</span>
        </div>
      </div>

      <div class="h-right">
        <button class="btn btn-primary" type="button" @click="openAdd = true">
          <font-awesome-icon icon="plus" />
          <span>Add New Staff</span>
        </button>

        <div class="dd" :class="{ open: exportTopOpen }" ref="exportTopRef" @click.stop>
          <button class="btn btn-soft" type="button" @click.stop="exportTopOpen = !exportTopOpen">
            <font-awesome-icon icon="download" class="faDownload-ico" />
            <span class="btn-names">Export</span>
            <span class="tri-ico" aria-hidden="true"></span>
            <span class="caret">▾</span>
          </button>

          <div class="dd-menu btn-names" v-if="exportTopOpen" @click.stop>
            <button class="dd-item btn-names" type="button" @click="exportCsv()">Export CSV</button>
            <button class="dd-item btn-names" type="button" @click="exportSelectedCsv()">Export Selected (CSV)</button>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTERS BAR -->
    <div class="filters-bar">
      <div class="search-pill">
        <font-awesome-icon icon="magnifying-glass" class="ico" />
        <input v-model.trim="q" placeholder="Search..." />
      </div>

      <div class="pill-row">
        <!-- ✅ add open class when open -->
        <div class="dd dd-pill" :class="{ open: deptOpen }" ref="deptRef" @click.stop>
          <button class="pill" type="button" @click.stop="deptOpen = !deptOpen">
            <span class="pill-text">{{ deptLabel }}</span>
            <span class="caret">▾</span>
          </button>
          <div class="dd-menu" v-if="deptOpen" @click.stop>
            <button class="dd-item" type="button" @click="setDept('')">All Departments</button>
            <button class="dd-item" v-for="d in departments" :key="d" type="button" @click="setDept(d)">
              {{ d }}
            </button>
          </div>
        </div>

        <div class="dd dd-pill" :class="{ open: roleOpen }" ref="roleRef" @click.stop>
          <button class="pill" type="button" @click.stop="roleOpen = !roleOpen">
            <span class="pill-text">{{ roleLabel }}</span>
            <span class="caret">▾</span>
          </button>
          <div class="dd-menu" v-if="roleOpen" @click.stop>
            <button class="dd-item" type="button" @click="setRole('')">All Roles</button>
            <button class="dd-item" v-for="r in roleOptions" :key="r" type="button" @click="setRole(r)">
              {{ r }}
            </button>
          </div>
        </div>

        <div class="dd dd-pill" :class="{ open: statusOpen }" ref="statusRef" @click.stop>
          <button class="pill" type="button" @click.stop="statusOpen = !statusOpen">
            <span class="pill-text">{{ statusLabel }}</span>
            <span class="caret">▾</span>
          </button>
          <div class="dd-menu" v-if="statusOpen" @click.stop>
            <button class="dd-item" type="button" @click="setStatus('')">All Status</button>
            <button class="dd-item" type="button" @click="setStatus('Active')">Active</button>
            <button class="dd-item" type="button" @click="setStatus('Inactive')">Inactive</button>
          </div>
        </div>
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="summary-row">
      <div class="total-card">
        <div class="total-label">Total Staff:</div>
        <div class="total-num">{{ filteredAll.length }}</div>
      </div>

      <div class="stats">
        <div class="stat blue">
          <div class="stat-num">{{ counts.doctors }}</div>
          <div class="stat-lbl">Doctors</div>
        </div>
        <div class="stat teal">
          <div class="stat-num">{{ counts.nurses }}</div>
          <div class="stat-lbl">Nurses</div>
        </div>
        <div class="stat purple">
          <div class="stat-num">{{ counts.techs }}</div>
          <div class="stat-lbl">Technicians</div>
        </div>
        <div class="stat orange">
          <div class="stat-num">{{ counts.admin }}</div>
          <div class="stat-lbl">Admin Staff</div>
        </div>
      </div>
    </div>

    <!-- TABLE CARD -->
    <div class="table-card">
      <div class="table-top">
        <div class="tt-left">
          <label class="cb">
            <input type="checkbox" :checked="allChecked" @change="toggleAll($event.target.checked)" />
            <span></span>
          </label>

          <div class="dd dd-export" :class="{ open: exportOpen }" ref="exportRef" @click.stop>
            <button class="btn btn-mini btn-soft" type="button" @click.stop="exportOpen = !exportOpen">
              <span class="tri-ico" aria-hidden="true"></span>
              <span class="btn-names">Export</span>
              <span class="caret">▾</span>
            </button>

            <div class="dd-menu" v-if="exportOpen" @click.stop>
              <button class="dd-item" type="button" @click="exportCsv()">Export CSV</button>
              <button class="dd-item" type="button" @click="exportSelectedCsv()">Export Selected (CSV)</button>
            </div>
          </div>
        </div>

        <div class="tt-right">
          <!-- ✅ add open class when open -->
          <div class="dd" :class="{ open: bulkOpen }" ref="bulkRef" @click.stop>
            <button class="btn btn-mini btn-soft" type="button" @click.stop="bulkOpen = !bulkOpen">
              <span class="tri-ico" aria-hidden="true"></span>
              <span class="btn-names">Bulk Actions</span>
              <span class="caret">▾</span>
            </button>

            <div class="dd-menu" v-if="bulkOpen" @click.stop>
              <button class="dd-item" type="button" @click="bulkSetStatus('Active')">Mark as Active</button>
              <button class="dd-item" type="button" @click="bulkSetStatus('Inactive')">Mark as Inactive</button>
              <button class="dd-item danger" type="button" @click="bulkDelete">Delete (UI)</button>
            </div>
          </div>
        </div>
      </div>

      <div class="table-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th class="col-check"></th>
              <th><span class="th">Name</span><span class="th-caret">▾</span></th>
              <th><span class="th">Role</span><span class="th-caret">▾</span></th>
              <th><span class="th">Department</span><span class="th-caret">▾</span></th>
              <th><span class="th">Phone Number</span><span class="th-caret">▾</span></th>
              <th><span class="th">Email Address</span><span class="th-caret">▾</span></th>
              <th><span class="th">Status</span><span class="th-caret">▾</span></th>
              <th class="col-actions"><span class="th">Actions</span></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="s in pageRows" :key="s.id">
              <td class="col-check">
                <label class="cb">
                  <input type="checkbox" v-model="selected" :value="s.id" />
                  <span></span>
                </label>
              </td>

              <td>
                <div class="namecell">
                  <img class="photo" :src="s.photo || fallbackAvatar(s.name)" alt="photo" />
                  <div class="nameinfo">
                    <div class="nm">{{ s.name }}</div>
                    <div class="sub muted">{{ s.title }}</div>
                  </div>
                </div>
              </td>

              <td class="muted">{{ s.role }}</td>
              <td class="muted">{{ s.department }}</td>

              <td class="muted">
                <font-awesome-icon icon="phone" class="phone-ico" />
                {{ s.phone }}
              </td>

              <td>
                <a href="#" class="email" @click.prevent="noop">{{ s.email }}</a>
              </td>

              <td>
                <span class="status" :class="s.status === 'Active' ? 'ok' : 'warn'">
                  {{ s.status }}
                </span>
              </td>

              <td class="col-actions">
                <!-- ✅ add open class when open -->
                <div class="dd" :class="{ open: rowMenu === s.id }" :ref="(el) => (rowRefs[s.id] = el)" @click.stop>
                  <button class="btn btn-mini btn-primary" type="button" @click.stop="toggleRowMenu(s.id)">
                    <span>View</span>
                    <span class="caret">▾</span>
                  </button>

                  <div class="dd-menu" v-if="rowMenu === s.id" @click.stop>
                    <button class="dd-item" type="button" @click="viewStaff(s)">View Profile (UI)</button>
                    <button class="dd-item" type="button" @click="editStaff(s)">Edit (UI)</button>
                    <button class="dd-item danger" type="button" @click="deleteStaff(s.id)">Delete (UI)</button>
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

      <!-- PAGER -->
      <div class="pager">
        <div class="pager-left">Showing {{ pageRows.length }} out of {{ filteredAll.length }} staff</div>

        <div class="pager-right">
          <button class="pbtn" :disabled="page === 1" @click="page--">‹</button>

          <button
            v-for="p in pageButtons"
            :key="p"
            class="pnum"
            :class="{ on: p === page }"
            @click="page = p"
          >
            {{ p }}
          </button>

          <button class="pbtn" :disabled="page === totalPages" @click="page++">›</button>

          <!-- ✅ add open class when open -->
          <div class="dd" :class="{ open: perOpen }" ref="perRef" @click.stop>
            <button class="pbtn" type="button" @click.stop="perOpen = !perOpen">
              {{ perPage }} / page <span class="caret">▾</span>
            </button>
            <div class="dd-menu" v-if="perOpen" @click.stop>
              <button class="dd-item" type="button" @click="setPer(10)">10 / page</button>
              <button class="dd-item" type="button" @click="setPer(20)">20 / page</button>
              <button class="dd-item" type="button" @click="setPer(50)">50 / page</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD STAFF MODAL -->
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
          <button class="btn btn-soft" type="button" @click="openAdd = false">Cancel</button>
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

/* dropdowns */
const deptOpen = ref(false);
const roleOpen = ref(false);
const statusOpen = ref(false);
const bulkOpen = ref(false);
const perOpen = ref(false);
const exportOpen = ref(false);
const exportTopOpen = ref(false);
const rowMenu = ref(null);

const deptRef = ref(null);
const roleRef = ref(null);
const statusRef = ref(null);
const bulkRef = ref(null);
const perRef = ref(null);
const exportRef = ref(null);
const exportTopRef = ref(null);
const rowRefs = reactive({});

/* paging */
const page = ref(1);
const perPage = ref(10);

/* selections */
const selected = ref([]);

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

/* dummy lists */
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

/* computed labels */
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
  selected.value = [];
  rowMenu.value = null;
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

/* checkbox helpers */
const allChecked = computed(() => {
  if (!pageRows.value.length) return false;
  return pageRows.value.every((r) => selected.value.includes(r.id));
});

function toggleAll(checked) {
  const ids = pageRows.value.map((r) => r.id);
  if (checked) selected.value = Array.from(new Set([...selected.value, ...ids]));
  else selected.value = selected.value.filter((id) => !ids.includes(id));
}

/* dropdown setters */
function setDept(v) { dept.value = v; deptOpen.value = false; }
function setRole(v) { role.value = v; roleOpen.value = false; }
function setStatus(v) { status.value = v; statusOpen.value = false; }
function setPer(v) { perPage.value = v; perOpen.value = false; }

/* row actions */
function toggleRowMenu(id) { rowMenu.value = rowMenu.value === id ? null : id; }
function viewStaff(s) { window.alert(`Viewing ${s.name} (UI only)`); rowMenu.value = null; }
function editStaff(s) { window.alert(`Editing ${s.name} (UI only)`); rowMenu.value = null; }
function deleteStaff(id) {
  staff.value = staff.value.filter((x) => x.id !== id);
  selected.value = selected.value.filter((x) => x !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staff.value));
  rowMenu.value = null;
}

/* bulk */
function bulkSetStatus(v) {
  if (!selected.value.length) return window.alert("Select at least one staff.");
  staff.value = staff.value.map((s) => (selected.value.includes(s.id) ? { ...s, status: v } : s));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staff.value));
  bulkOpen.value = false;
}
function bulkDelete() {
  if (!selected.value.length) return window.alert("Select at least one staff.");
  staff.value = staff.value.filter((s) => !selected.value.includes(s.id));
  selected.value = [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staff.value));
  bulkOpen.value = false;
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
  if (!selected.value.length) return window.alert("Select at least one staff to export.");
  const rows = filteredAll.value.filter((r) => selected.value.includes(r.id));
  downloadCsv(rows, "staff_selected.csv");
  exportOpen.value = false;
  exportTopOpen.value = false;
}
function exportCsv() {
  downloadCsv(filteredAll.value, "staff.csv");
  exportOpen.value = false;
  exportTopOpen.value = false;
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

/* outside click close */
function onWindowClick(e) {
  const closeIfOutside = (refEl, stateRef) => {
    if (refEl?.value && !refEl.value.contains(e.target)) stateRef.value = false;
  };

  closeIfOutside(deptRef, deptOpen);
  closeIfOutside(roleRef, roleOpen);
  closeIfOutside(statusRef, statusOpen);
  closeIfOutside(bulkRef, bulkOpen);
  closeIfOutside(perRef, perOpen);
  closeIfOutside(exportRef, exportOpen);
  closeIfOutside(exportTopRef, exportTopOpen);

  if (rowMenu.value) {
    const holder = rowRefs[rowMenu.value];
    if (holder && !holder.contains(e.target)) rowMenu.value = null;
  }
}

onMounted(() => window.addEventListener("click", onWindowClick, true));
onBeforeUnmount(() => window.removeEventListener("click", onWindowClick, true));
</script>

<style scoped>
.dd.open{
  z-index: 10000;
}

.dd.open .dd-menu{
  z-index: 10001;
}

.dd-menu{
  z-index: 9999;
}

.btn-names{ color:#0f172a !important; }

.tri-ico{
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid rgba(100,116,139,0.85);
  display:inline-block;
  transform: translateY(1px);
}

.table-card,
.table-top{
  overflow: visible;
}

.dd-export .dd-menu{
  left: 0;
  right: auto;
  min-width: 220px;
}

.faDownload-ico{
  font-size: 14px;
  color: #2563eb;
  display: inline-block;
}

/* ======= KEEP THE REST OF YOUR STYLES EXACTLY AS YOU HAD THEM ======= */

/* =========================
   Font + base (match screenshot)
   ========================= */
.staff-page{
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: hidden;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
  color: #0f172a;
}
.staff-page{
  background: linear-gradient(180deg, rgba(246,249,255,0.95), rgba(244,248,255,0.78));
  border-radius: 14px;
  padding: 18px 18px 14px;
}

/* HEADER */
.staff-header{ display:flex; justify-content: space-between; align-items:flex-start; gap: 12px; flex-wrap: wrap; }
.h-left{ min-width: 0; }
.h-title{ font-size: 22px; font-weight: 800; letter-spacing: .2px; }
.h-sub{ margin-top: 6px; display:flex; gap: 8px; align-items:center; flex-wrap: wrap; font-size: 13px; }
.strong{ font-weight: 400; }
.muted{ color:#64748b; }
.h-right{ display:flex; align-items:center; gap: 10px; flex-wrap: wrap; }

/* Buttons */
.btn{
  display:inline-flex; align-items:center; gap: 10px;
  height: 38px; padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(203,213,225,0.85);
  background: #fff;
  font-weight: 700;
  font-size: 13px;
  cursor:pointer;
  box-shadow: 0 8px 18px rgba(15,23,42,0.05);
}
.btn:hover{ transform: translateY(-1px); }
.btn:active{ transform: translateY(0); }
.btn-primary{
  color:#fff;
  border-color: rgba(59,130,246,0.35);
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  box-shadow: 0 12px 22px rgba(37,99,235,0.22);
}
.btn-soft{ background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(242,246,255,0.92)); }
.btn-mini{ height: 34px; padding: 0 12px; border-radius: 9px; font-size: 12px; }

/* FILTERS */
.filters-bar{ margin-top: 14px; display:flex; align-items:center; gap: 10px; flex-wrap: wrap; width: 100%; }
.search-pill{
  flex: 1 1 360px; min-width: 0;
  display:flex; align-items:center; gap: 10px;
  height: 40px; padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(203,213,225,0.65);
  background: rgba(255,255,255,0.92);
  box-shadow: 0 10px 22px rgba(15,23,42,0.06);
}
.search-pill input{
  width:100%; min-width:0; border:0; outline:0; background: transparent;
  font-weight: 700; font-size: 13px; color:#0f172a;
}
.ico{ color:#3b82f6; }
.pill-row{ display:flex; align-items:center; gap: 10px; flex-wrap: wrap; }
.dd{ position: relative; z-index: 40; }
.dd-pill{ flex: 0 0 auto; }
.pill{
  height: 40px; min-width: 170px; max-width: 220px;
  display:flex; align-items:center; justify-content: space-between; gap: 10px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(203,213,225,0.65);
  background: rgba(255,255,255,0.92);
  cursor:pointer;
  font-weight: 400;
  font-size: 13px;
  box-shadow: 0 10px 22px rgba(15,23,42,0.05);
}
.pill-text{ min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.caret{ opacity:.8; font-size: 12px; }

.dd-menu{
  position:absolute;
  top: calc(100% + 8px);
  left:0;
  right:0;
  background:#fff;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.95);
  box-shadow: 0 22px 44px rgba(15,23,42,0.14);
  overflow:hidden;
}
.dd-item{
  width:100%;
  text-align:left;
  padding: 10px 12px;
  border:0;
  background:#fff;
  cursor:pointer;
  font-weight: 700;
  font-size: 13px;
}
.dd-item:hover{ background:#f3f7ff; }
.dd-item.danger{ color:#b42318; }

/* SUMMARY */
.summary-row{ margin-top: 14px; display:flex; align-items:stretch; gap: 10px; flex-wrap: wrap; }
.total-card{
  min-width: 180px;
  border-radius: 12px;
  border: 1px solid rgba(203,213,225,0.65);
  background: rgba(255,255,255,0.88);
  box-shadow: 0 14px 30px rgba(15,23,42,0.06);
  padding: 12px 14px;
  display:flex;
  align-items:center;
  gap: 10px;
}
.total-label{ color:#475569; font-weight: 800; font-size: 13px; }
.total-num{ font-weight: 900; font-size: 18px; color:#0f172a; }
.stats{ flex: 1 1 520px; display:grid; grid-template-columns: repeat(4, minmax(150px, 1fr)); gap: 10px; min-width: 0; }
.stat{
  border-radius: 12px;
  padding: 12px 14px;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content: space-between;
  box-shadow: 0 18px 34px rgba(15,23,42,0.10);
}
.stat-num{ font-size: 22px; font-weight: 900; letter-spacing: .2px; }
.stat-lbl{ font-weight: 800; opacity: .95; }
.stat.blue{ background: linear-gradient(90deg, #3b82f6, #2563eb); }
.stat.teal{ background: linear-gradient(90deg, #14b8a6, #0d9488); }
.stat.purple{ background: linear-gradient(90deg, #8b5cf6, #6d28d9); }
.stat.orange{ background: linear-gradient(90deg, #f59e0b, #f97316); }

/* TABLE CARD */
.table-card{
  margin-top: 14px;
  border-radius: 14px;
  border: 1px solid rgba(203,213,225,0.65);
  background: rgba(255,255,255,0.86);
  box-shadow: 0 18px 40px rgba(15,23,42,0.08);
}
.table-top{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(226,232,244,0.9);
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.85));
}
.tt-left{ display:flex; align-items:center; gap: 10px; }
.tt-right{ display:flex; align-items:center; gap: 10px; }

.table-wrap{ overflow-x:auto; -webkit-overflow-scrolling: touch; }
.tbl{ width:100%; border-collapse: collapse; min-width: 980px; }

th, td{
  padding: 10px 12px;
  border-bottom: 1px solid rgba(226,232,244,0.85);
  font-size: 13px;
  vertical-align: middle;
}
thead th{
  background: rgba(245,248,255,0.9);
  color:#475569;
  font-weight: 900;
  white-space: nowrap;
}
.th{ font-weight: 900; }
.th-caret{ margin-left: 6px; opacity:.45; font-size: 11px; }
tbody tr:hover{ background: #f6f9ff; }

.col-check{ width: 44px; }
.col-actions{ width: 120px; }

.empty{ text-align:center; padding: 26px; color:#64748b; font-weight: 800; }

.namecell{ display:flex; align-items:center; gap: 10px; min-width: 0; }
.photo{ width: 34px; height: 34px; border-radius: 999px; object-fit: cover; box-shadow: 0 10px 20px rgba(15,23,42,0.10); }
.nameinfo{ min-width: 0; }
.nm{ font-weight: 900; color:#0f172a; line-height: 1.1; }
.sub{ font-size: 12px; line-height: 1.1; margin-top: 2px; }

.phone-ico{ margin-right: 8px; color:#2563eb; }

.email{ color:#2563eb; font-weight: 800; text-decoration:none; }
.email:hover{ text-decoration: underline; }

.status{
  display:inline-flex; align-items:center; justify-content:center;
  padding: 5px 10px;
  border-radius: 10px;
  font-weight: 900;
  font-size: 12px;
  border: 1px solid transparent;
}
.status.ok{ background: rgba(16,185,129,0.14); border-color: rgba(16,185,129,0.28); color:#0f766e; }
.status.warn{ background: rgba(245,158,11,0.14); border-color: rgba(245,158,11,0.30); color:#b45309; }

.cb{ display:inline-flex; align-items:center; cursor:pointer; }
.cb input{ display:none; }
.cb span{
  width: 16px; height: 16px;
  border-radius: 5px;
  border: 1px solid rgba(148,163,184,0.75);
  background:#fff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
}
.cb input:checked + span{
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  border-color: rgba(37,99,235,0.55);
}

.pager{
  display:flex; justify-content: space-between; align-items:center;
  gap: 10px; padding: 10px 12px;
  background: rgba(245,248,255,0.75);
}
.pager-left{ color:#64748b; font-weight: 800; font-size: 12px; }
.pager-right{ display:flex; align-items:center; gap: 6px; flex-wrap: wrap; }
.pbtn, .pnum{
  height: 30px; min-width: 30px; padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(203,213,225,0.75);
  background:#fff;
  font-weight: 900;
  font-size: 12px;
  cursor:pointer;
}
.pbtn:disabled{ opacity:.45; cursor:not-allowed; }
.pnum.on{
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  color:#fff;
  border-color: rgba(37,99,235,0.55);
}

.modal{
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.35);
  display:grid; place-items:center;
  z-index: 200;
}
.modal-card{
  width: min(760px, 92vw);
  border-radius: 16px;
  background:#fff;
  border: 1px solid rgba(226,232,244,0.95);
  box-shadow: 0 30px 70px rgba(15,23,42,0.25);
  overflow:hidden;
}
.modal-head{
  display:flex; justify-content: space-between; align-items:center;
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.85));
  border-bottom: 1px solid rgba(226,232,244,0.9);
}
.modal-title{ font-weight: 900; }
.x{ border:0; background:transparent; cursor:pointer; font-weight: 900; font-size: 16px; }
.modal-body{ padding: 14px; }
.grid2{ display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.input2{
  width:100%;
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.95);
  background:#fbfdff;
  font-weight: 800;
  outline:none;
}
.hint{ margin-top: 10px; font-size: 12px; color:#64748b; font-weight: 800; }
.modal-foot{ display:flex; justify-content:flex-end; gap: 10px; padding: 12px 14px; border-top: 1px solid rgba(226,232,244,0.9); }

@media (max-width: 980px){
  .stats{ grid-template-columns: repeat(2, minmax(160px, 1fr)); }
}
@media (max-width: 640px){
  .staff-page{ padding: 14px 12px 12px; }
  .h-right{ width: 100%; justify-content: flex-end; }
  .btn{ height: 40px; }
  .pill{ min-width: 0; width: 100%; max-width: none; }
  .pill-row{ width: 100%; display:grid; grid-template-columns: 1fr; }
  .stats{ grid-template-columns: 1fr; }
  .grid2{ grid-template-columns: 1fr; }
}
</style>
