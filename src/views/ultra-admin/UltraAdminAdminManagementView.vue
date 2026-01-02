<template>
  <div class="admin-ui">
    <!-- HEADER (page title + breadcrumb only, topbar already in layout) -->
    <div class="page-head">
      <div class="h-left">
        <div class="h-title">Admin Management</div>
        <div class="h-sub">
          <span class="crumb strong">Admin Management</span>
          <span class="crumb muted">›</span>
          <span class="crumb muted">Manage administrators, roles, and user accounts.</span>
        </div>
      </div>
    </div>

    <!-- TOP PANELS -->
    <div class="panels">
      <!-- Add New Admin -->
      <div class="panel">
        <div class="panel-title">Add New Admin</div>

        <div class="form">
          <input class="input" v-model.trim="newAdmin.name" placeholder="Full Name" />
          <input class="input" v-model.trim="newAdmin.email" placeholder="Email Address" />
          <input class="input" v-model.trim="newAdmin.phone" placeholder="Phone Number" />

          <div class="dd dd-field" :class="{ open: roleOpen1 }" ref="roleRef1" @click.stop>
            <button class="select" type="button" @click.stop="roleOpen1 = !roleOpen1">
              <span>{{ newAdmin.role || "Ultra Admin" }}</span>
              <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
            </button>

            <div class="dd-menu" v-if="roleOpen1" @click.stop>
              <button class="dd-item" type="button" @click="setRole1('Ultra Admin')">Ultra Admin</button>
              <button
                class="dd-item"
                v-for="r in roleOptions"
                :key="'r1-' + r"
                type="button"
                @click="setRole1(r)"
              >
                {{ r }}
              </button>
            </div>
          </div>
        </div>

        <!-- System stats strip -->
        <div class="stats-strip">
          <div class="stat-left">
            <div class="stat-k">System Stats:</div>
            <div class="stat-row">
              <span class="stat-k2">Total Admins:</span>
              <span class="stat-v">{{ admins.length }}</span>
            </div>
          </div>

          <div class="stat-right">
            <div class="stat-k2">Status Overview</div>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: statusOverviewPct + '%' }"></div>
            </div>
            <div class="stat-v">{{ admins.length }}</div>
          </div>
        </div>

        <button class="btn-primary wide" type="button" @click="createAdmin">
          Create New Admin
        </button>
      </div>

      <!-- Add New Account -->
      <div class="panel">
        <div class="panel-title">Add New Account</div>

        <div class="form">
          <input class="input" v-model.trim="newAcct.name" placeholder="Full Name" />
          <input class="input" v-model.trim="newAcct.email" placeholder="Email Address" />
          <input class="input" v-model.trim="newAcct.phone" placeholder="Phone Number" />

          <!-- Generate password row -->
          <div class="pw-row">
            <div class="pw-left">
              <span class="pw-dot"></span>
              <span class="pw-label">Generate Password</span>
            </div>

            <div class="pw-box">
              <input class="pw-input" :value="newAcct.passwordMasked" />
              <button class="pw-eye" type="button" @click="togglePw">•••</button>
              <button class="pw-edit" type="button" @click="regenPw">
                <font-awesome-icon class="fa-ic" icon="pen-to-square" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          <!-- ✅ Role dropdown (ensure it stacks above table) -->
          <div
            class="dd dd-field dd-acct-role"
            :class="{ open: roleOpen2 }"
            ref="roleRef2"
            @click.stop
          >
            <button class="select" type="button" @click.stop="roleOpen2 = !roleOpen2">
              <span>{{ newAcct.role || "Ultra Admin" }}</span>
              <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
            </button>

            <div class="dd-menu dd-menu-right dd-menu-acct" v-if="roleOpen2" @click.stop>
              <button class="dd-item" type="button" @click="setRole2('Ultra Admin')">Ultra Admin</button>
              <button
                class="dd-item"
                v-for="r in roleOptions"
                :key="'r2-' + r"
                type="button"
                @click="setRole2(r)"
              >
                {{ r }}
              </button>
            </div>
          </div>
        </div>

        <button class="btn-primary wide" type="button" @click="createAccount">
          Create New Account
        </button>
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

          <div class="search-pill">
            <font-awesome-icon class="fa-ic" icon="magnifying-glass" />
            <input v-model.trim="q" placeholder="Search..." />
          </div>
        </div>

        <div class="tt-right">
          <button class="btn-soft mini" type="button" @click="addDummy">
            <font-awesome-icon class="fa-ic" icon="plus" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div class="table-wrap">
        <div class="table-scroll">
          <table class="tbl">
            <thead>
              <tr>
                <th class="col-check"></th>

                <th>
                  <span class="th-wrap">
                    <span class="th">Name</span>
                    <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
                  </span>
                </th>

                <th>
                  <span class="th-wrap">
                    <span class="th">Email</span>
                    <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
                  </span>
                </th>

                <th>
                  <span class="th-wrap">
                    <span class="th">Role</span>
                    <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
                  </span>
                </th>

                <th>
                  <span class="th-wrap">
                    <span class="th">Role</span>
                    <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
                  </span>
                </th>

                <th>
                  <span class="th-wrap">
                    <span class="th">Status</span>
                    <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
                  </span>
                </th>

                <th class="col-actions">
                  <span class="th-wrap">
                    <span class="th">Actions</span>
                    <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="a in pageRows" :key="a.id">
                <td class="col-check">
                  <label class="cb">
                    <input type="checkbox" v-model="selected" :value="a.id" />
                    <span></span>
                  </label>
                </td>

                <td>
                  <div class="namecell">
                    <img class="photo" :src="a.photo || fallbackAvatar(a.name)" alt="photo" />
                    <div class="nameinfo">
                      <div class="nm">{{ a.name }}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <a class="email" href="#" @click.prevent="noop">{{ a.email }}</a>
                </td>

                <td class="muted">{{ a.role }}</td>
                <td class="muted">{{ a.role }}</td>

                <td>
                  <span class="status" :class="a.status === 'Active' ? 'ok' : 'warn'">
                    {{ a.status }}
                  </span>
                </td>

                <!-- ✅ Actions dropdown (Billing-style menu + separators + Edit/Delete inside card) -->
                <td class="col-actions">
                  <div
                    class="dd dd-row"
                    :class="{ open: rowMenu === a.id }"
                    :ref="(el) => (rowRefs[a.id] = el)"
                    @click.stop
                  >
                    <button class="btn-view" type="button" @click.stop="toggleRowMenu(a.id)">
                      <span>View</span>
                      <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
                    </button>

                    <div
                      class="dd-menu dd-menu-right dd-menu-row"
                      v-if="rowMenu === a.id"
                      @click.stop
                    >
                      <button class="dd-item" type="button" @click="uiAction('View', a)">View (UI)</button>
                      <button class="dd-item" type="button" @click="uiAction('Edit', a)">Edit (UI)</button>

                      <div class="dd-sep"></div>

                      <button class="dd-item danger" type="button" @click="uiAction('Delete', a)">Remove (UI)</button>
                    </div>
                  </div>
                </td>
              </tr>

              <tr v-if="pageRows.length === 0">
                <td colspan="7" class="empty">No accounts found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PAGER -->
      <div class="pager">
        <div class="pager-left">
          Showing {{ pageRows.length }} out of {{ filteredAll.length }} of {{ admins.length }} accounts
        </div>

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

          <div class="dd" :class="{ open: perOpen }" ref="perRef" @click.stop>
            <button class="pbtn" type="button" @click.stop="perOpen = !perOpen">
              {{ perPage }} / page
              <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
            </button>

            <div class="dd-menu dd-menu-right" v-if="perOpen" @click.stop>
              <button class="dd-item" type="button" @click="setPer(5)">5 / page</button>
              <button class="dd-item" type="button" @click="setPer10">10 / page</button>
              <button class="dd-item" type="button" @click="setPer(20)">20 / page</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- clickout for menus -->
    <div v-if="anyOpen" class="clickout" @click="closeAll"></div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

const STORAGE_KEY = "medsystem_ultra_admin_mgmt_v1";

/* top forms */
const roleOptions = [
  "Attending Physician",
  "Resident Doctor",
  "Intern Doctor",
  "Head Nurse",
  "Nurse Practitioner",
  "Physician Assistant",
  "Registered Nurse",
  "Licensed Practical Nurse",
  "Pharmacist",
  "Physical Therapist",
  "Occupational Therapist",
  "Respiratory Therapist",
  "Dietitian / Nutritionist",
  "Medical Lab Tech",
  "Radiologic Technologist",
];

const newAdmin = reactive({ name: "", email: "", phone: "", role: "Ultra Admin" });

const newAcct = reactive({
  name: "",
  email: "",
  phone: "",
  role: "Ultra Admin",
  password: "",
  passwordMasked: "••••••••••••••••",
});

function makePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let out = "";
  for (let i = 0; i < 14; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
function regenPw() {
  newAcct.password = makePassword();
  newAcct.passwordMasked = "•".repeat(Math.max(10, newAcct.password.length));
}
function togglePw() {
  window.alert("Password hidden (UI only). Click Edit to regenerate.");
}
regenPw();

/* dropdowns */
const roleOpen1 = ref(false);
const roleOpen2 = ref(false);
const perOpen = ref(false);
const rowMenu = ref(null);

const roleRef1 = ref(null);
const roleRef2 = ref(null);
const perRef = ref(null);
const rowRefs = reactive({});

/* table */
const q = ref("");
const page = ref(1);
const perPage = ref(10);
const selected = ref([]);

/* data */
const admins = ref([
  { id: 1, name: "John Evans", email: "John.evans@abc.com", role: "Ultra Admin", status: "Active" },
  { id: 2, name: "Dr. Sarah M.", email: "dr.sarah.m@abc.com", role: "Attending Physician", status: "Active" },
  { id: 3, name: "Dr. Wiliam P.", email: "dr.wiliamp@abc.com", role: "Resident Doctor", status: "Active" },
  { id: 4, name: "Michael Reynolds", email: "michael.resg@sds:be", role: "Intern Doctor", status: "Active" },
  { id: 5, name: "Karen S.", email: "karen.s@sting.com", role: "Head Nurse", status: "Active" },
  { id: 6, name: "Karen S.", email: "karen.s@sting.favugra", role: "Shed Nurse", status: "Active" },
]);

/* load/save */
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) admins.value = parsed;
    } catch {}
  }
});

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(admins.value));
}

/* filtering */
const filteredAll = computed(() => {
  const term = q.value.trim().toLowerCase();
  return admins.value.filter((a) => {
    if (!term) return true;
    return (
      a.name.toLowerCase().includes(term) ||
      (a.email || "").toLowerCase().includes(term) ||
      (a.role || "").toLowerCase().includes(term)
    );
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredAll.value.length / perPage.value)));

watch([q, perPage], () => {
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

/* role dropdown setters */
function setRole1(v) {
  newAdmin.role = v;
  roleOpen1.value = false;
}
function setRole2(v) {
  newAcct.role = v;
  roleOpen2.value = false;
}

function setPer(v) {
  perPage.value = v;
  perOpen.value = false;
}

/* top actions */
function createAdmin() {
  if (!newAdmin.name || !newAdmin.email) return window.alert("Name and Email are required.");
  admins.value.unshift({
    id: Date.now(),
    name: newAdmin.name,
    email: newAdmin.email,
    role: newAdmin.role || "Ultra Admin",
    status: "Active",
  });
  persist();
  newAdmin.name = "";
  newAdmin.email = "";
  newAdmin.phone = "";
  newAdmin.role = "Ultra Admin";
}

function createAccount() {
  if (!newAcct.name || !newAcct.email) return window.alert("Name and Email are required.");
  admins.value.unshift({
    id: Date.now(),
    name: newAcct.name,
    email: newAcct.email,
    role: newAcct.role || "Ultra Admin",
    status: "Active",
  });
  persist();
  newAcct.name = "";
  newAcct.email = "";
  newAcct.phone = "";
  newAcct.role = "Ultra Admin";
  regenPw();
}

function addDummy() {
  admins.value.unshift({
    id: Date.now(),
    name: "New Admin",
    email: "new.admin@abc.com",
    role: "Ultra Admin",
    status: "Active",
  });
  persist();
}

/* row menu */
function toggleRowMenu(id) {
  rowMenu.value = rowMenu.value === id ? null : id;
}

function uiAction(type, row) {
  rowMenu.value = null;
  window.alert(`${type}: ${row.name} (UI only)`);
}

/* stats bar */
const statusOverviewPct = computed(() => {
  const total = admins.value.length || 1;
  const active = admins.value.filter((a) => a.status === "Active").length;
  return Math.round((active / total) * 100);
});

function fallbackAvatar(name) {
  const seed = (name || "admin").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const img = (seed % 60) + 1;
  return `https://i.pravatar.cc/72?img=${img}`;
}
function noop() {}

/* clickout helpers */
const anyOpen = computed(() => roleOpen1.value || roleOpen2.value || perOpen.value || !!rowMenu.value);

function closeAll() {
  roleOpen1.value = false;
  roleOpen2.value = false;
  perOpen.value = false;
  rowMenu.value = null;
}

/* outside click close */
function onWindowClick(e) {
  const closeIfOutside = (refEl, stateRef) => {
    if (refEl?.value && !refEl.value.contains(e.target)) stateRef.value = false;
  };
  closeIfOutside(roleRef1, roleOpen1);
  closeIfOutside(roleRef2, roleOpen2);
  closeIfOutside(perRef, perOpen);

  if (rowMenu.value) {
    const holder = rowRefs[rowMenu.value];
    if (holder && !holder.contains(e.target)) rowMenu.value = null;
  }
}
function onEsc(e) {
  if (e.key === "Escape") closeAll();
}

onMounted(() => {
  window.addEventListener("click", onWindowClick, true);
  window.addEventListener("keydown", onEsc, true);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", onWindowClick, true);
  window.removeEventListener("keydown", onEsc, true);
});
</script>

<style scoped>
/* ===== page shell ===== */
.admin-ui{
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: hidden;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
  color: #0f172a;
  background: linear-gradient(180deg, rgba(246,249,255,0.95), rgba(244,248,255,0.78));
  border-radius: 14px;
  padding: 18px 18px 14px;
}

/* header */
.page-head{ display:flex; align-items:flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.h-title{ font-size: 22px; font-weight: 800; letter-spacing: .2px; }
.h-sub{ margin-top: 6px; display:flex; gap: 8px; align-items:center; flex-wrap: wrap; font-size: 13px; }
.strong{ font-weight: 400; color:#0f172a; }
.muted{ color:#64748b; }

/* top panels */
.panels{
  margin-top: 14px;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  overflow: visible !important;
}
.panel{
  background: rgba(255,255,255,0.86);
  border: 1px solid rgba(203,213,225,0.65);
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(15,23,42,0.08);
  padding: 14px;
  overflow: visible !important;
}
.panel-title{
  font-size: 18px;
  font-weight: 900;
  color:#1f2a44;
  margin-bottom: 10px;
}

/* extra stacking for Add New Account role dropdown */
.dd-acct-role{
  position: relative;
  z-index: 40000 !important;
}
.dd-acct-role.open{
  z-index: 45000 !important;
}
.dd-menu-acct{
  position: absolute;
  z-index: 46000 !important;
}

.form{ display:grid; gap: 10px; overflow: visible !important; }
.input{
  width:100%;
  height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.95);
  background: #fbfdff;
  padding: 0 12px;
  font-weight: 700;
  outline:none;
}

/* dropdown stacking */
.dd{ position: relative; z-index: 40; }
.dd.open{ z-index: 25000; }
.dd.open .dd-menu{ z-index: 25001; }

/* dropdown trigger */
.dd-field .select{
  width:100%;
  height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.95);
  background: #fbfdff;
  padding: 0 12px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  cursor:pointer;
  font-weight: 700;
}

/* ===== Dropdown style copied from Billing (adapted) ===== */
.dd-menu{
  position:absolute;
  top: calc(100% + 10px);
  left:0;
  min-width:220px;
  background:#ffffff;
  border:1px solid rgba(45, 78, 140, .16);
  border-radius:10px;
  padding:8px;
  box-shadow: 0 18px 40px rgba(17, 36, 80, 0.18);
  z-index: 24999;
}

.dd-menu-right{ left:auto; right:0; }
.dd-menu-actions{ min-width: 210px; } /* ensures Edit/Delete fit */

/* items */
.dd-item{
  width:100%;
  text-align:left;
  border:none;
  background:transparent;
  padding:10px 10px;
  border-radius:8px;
  font-weight:800;
  font-size:13px;
  color:#2b3a5b;
  cursor:pointer;
}
.dd-item:hover{ background:#eef4ff; }
.dd-item:disabled{ opacity:.5; cursor:not-allowed; }
.dd-item.danger{ color:#b42318; }
.dd-item.danger:hover{ background: rgba(180,35,24,.08); }

/* separators (billing-like) */
.dd-sep{
  height:1px;
  background: rgba(45, 78, 140, .14);
  margin:6px 4px;
}

/* stats strip */
.stats-strip{
  margin-top: 12px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(245,248,255,0.85);
  padding: 10px 12px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
}
.stat-k{ font-weight: 900; color:#33415c; }
.stat-row{ margin-top: 4px; display:flex; gap: 8px; align-items:center; font-weight: 800; color:#475569; }
.stat-k2{ font-weight: 900; color:#475569; }
.stat-v{ font-weight: 900; color:#0f172a; }
.stat-right{ display:flex; align-items:center; gap: 10px; }
.stat-bar{
  width: 140px;
  height: 10px;
  border-radius: 999px;
  background: rgba(148,163,184,0.35);
  overflow:hidden;
}
.stat-fill{
  height:100%;
  border-radius:999px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

/* password row */
.pw-row{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.pw-left{ display:flex; align-items:center; gap: 10px; font-weight: 800; color:#33415c; }
.pw-dot{
  width: 16px; height: 16px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, #60a5fa, #2563eb);
  box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
}
.pw-box{
  flex: 1 1 260px;
  display:flex;
  align-items:center;
  gap: 8px;
  justify-content:flex-end;
}
.pw-input{
  height: 40px;
  min-width: 220px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.95);
  background: #fbfdff;
  padding: 0 12px;
  font-weight: 900;
  letter-spacing: 2px;
}
.pw-eye{
  height: 40px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.95);
  background:#fff;
  cursor:pointer;
  font-weight: 900;
}
.pw-edit{
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(37,99,235,0.25);
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  color:#fff;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  gap: 8px;
  font-weight: 900;
}

/* primary button */
.btn-primary{
  width: 100%;
  height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(59,130,246,0.35);
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  color:#fff;
  font-weight: 900;
  cursor:pointer;
  box-shadow: 0 12px 22px rgba(37,99,235,0.22);
}
.btn-primary.wide{ margin-top: 12px; }

/* ===== table card ===== */
.table-card{
  margin-top: 14px;
  border-radius: 14px;
  border: 1px solid rgba(203,213,225,0.65);
  background: rgba(255,255,255,0.86);
  box-shadow: 0 18px 40px rgba(15,23,42,0.08);
  position: relative;
  overflow: visible !important;
  z-index: 1;
  isolation: isolate;
}

.table-top{
  overflow: visible;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(226,232,244,0.9);
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.85));
}

.tt-left{ display:flex; align-items:center; gap: 10px; min-width: 0; }
.tt-right{ display:flex; align-items:center; gap: 10px; }

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

.btn-soft{
  border: 1px solid rgba(203,213,225,0.75);
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(242,246,255,0.92));
  border-radius: 10px;
  height: 38px;
  padding: 0 12px;
  font-weight: 900;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  gap: 10px;
}
.btn-soft.mini{ height: 34px; border-radius: 9px; font-size: 12px; }

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
  white-space: nowrap;
  text-align: left; /* left align like screenshot */
}

/* header content hugs left */
.th-wrap{
  width: 100%;
  display:flex;
  align-items:center;
  justify-content:flex-start;
  gap: 6px;
  line-height: 1;
}
.th{ font-weight: 750; }
.th-caret{ opacity: .45; font-size: 11px; transform: translateY(1px); }

.tbl th.col-check, .tbl td.col-check{ width: 44px; }
.tbl th.col-actions, .tbl td.col-actions{
  width: 140px;
  white-space: nowrap;
  position: relative;
}

/* helps dropdown stack inside rows */
.tbl td{ position: relative; }

tbody tr:hover{ background: #f6f9ff; }

.namecell{ display:flex; align-items:center; gap: 10px; min-width: 0; }
.photo{ width: 34px; height: 34px; border-radius: 999px; object-fit: cover; box-shadow: 0 10px 20px rgba(15,23,42,0.10); }
.nm{ font-weight: 600; color:#0f172a; line-height: 1.1; }

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

.btn-view{
  width: 96px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid rgba(59,130,246,0.35);
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  color:#fff;
  font-weight: 900;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
  box-shadow: 0 10px 18px rgba(37,99,235,0.18);
}

/* pager */
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

.empty{ text-align:center; padding: 26px; color:#64748b; font-weight: 800; }

.clickout{
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 20000; /* below dd.open, above everything else */
}

/* FontAwesome minimal */
.fa-ic{
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -0.125em;
  line-height: 1;
}
.fa-caret{ font-size: .85em; opacity: .75; }
:deep(.fa-ic) svg{ width: 1em; height: 1em; display:block; }

/* responsive */
@media (max-width: 980px){
  .panels{ grid-template-columns: 1fr; }
  .pw-input{ min-width: 0; width: 100%; }
  .pw-box{ justify-content: stretch; }
}

/* =================================================================
   FIX: keep ALL dropdown items INSIDE the menu box (Edit included)
   Put this at the bottom so it wins.
   ================================================================= */
.dd-menu{
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: visible;
}

/* hard reset any accidental positioning from other styles */
.dd-menu > .dd-item,
.dd-menu > .dd-sep{
  position: static !important;
  float: none !important;
  width: 100%;
  display: block;
  box-sizing: border-box;
}

/* separators should behave normally */
.dd-sep{ flex: 0 0 auto; }
</style>
