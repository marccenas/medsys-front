<template>
  <div class="np-shell">
    <!-- Header / breadcrumb -->
    <div class="np-head">
      <div>
        <h2 class="np-title">Nurse Practitioners &amp; Physician Assistants</h2>
        <div class="np-breadcrumb">
          <span>Advanced practice</span>
          <span class="sep">›</span>
          <span class="muted">Manage the NPs and PAs in your unit.</span>
        </div>
      </div>
    </div>

    <!-- KPI row -->
    <div class="np-kpis">
      <div class="kpi kpi-blue">
        <div class="kpi-label">Total NPs &amp; PAs</div>
        <div class="kpi-value">{{ kpiTotal }}</div>
      </div>

      <div class="kpi kpi-teal">
        <div class="kpi-label">On Shift Now</div>
        <div class="kpi-value">{{ kpiOnShift }}</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-label">Pending Requests</div>
        <div class="kpi-value">{{ kpiPending }}</div>
      </div>

      <div class="kpi kpi-pink">
        <div class="kpi-label">Upcoming Shifts</div>
        <div class="kpi-value">{{ kpiUpcoming }}</div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="np-grid">
      <!-- LEFT: Table + mid sections -->
      <div class="np-left">
        <!-- Table card -->
        <div class="card glass">
          <div class="card-top">
            <div class="search-wrap">
              <input
                class="search"
                v-model.trim="q"
                type="text"
                placeholder="Search..."
                @input="goPage(1)"
              />
            </div>

            <div class="filters">
              <!-- Role filter -->
              <div class="dd" ref="roleDdRef">
                <button class="dd-btn" type="button" @click.stop="roleDdOpen = !roleDdOpen">
                  {{ roleLabel }}
                  <span class="caret">▾</span>
                </button>
                <div class="dd-menu" v-if="roleDdOpen">
                  <button class="dd-item" type="button" @click="setRole('all')">All Roles</button>
                  <button class="dd-item" type="button" @click="setRole('NP')">NP</button>
                  <button class="dd-item" type="button" @click="setRole('PA')">PA</button>
                  <button class="dd-item" type="button" @click="setRole('ICU')">ICU</button>
                  <button class="dd-item" type="button" @click="setRole('Pending')">Pending</button>
                  <button class="dd-item" type="button" @click="setRole('In Training')">In Training</button>
                </div>
              </div>

              <!-- Export -->
              <div class="dd" ref="exportDdRef">
                <button class="dd-btn" type="button" @click.stop="exportDdOpen = !exportDdOpen">
                  Export <span class="caret">▾</span>
                </button>
                <div class="dd-menu" v-if="exportDdOpen">
                  <button class="dd-item" type="button" @click="fakeExport('CSV')">Export CSV</button>
                  <button class="dd-item" type="button" @click="fakeExport('PDF')">Export PDF</button>
                </div>
              </div>
            </div>
          </div>

          <div class="table-wrap">
            <table class="np-table">
              <colgroup>
                <col class="w-check" />
                <col class="w-name" />
                <col class="w-role" />
                <col class="w-patients" />
                <col class="w-action" />
              </colgroup>

              <thead>
                <tr>
                  <!-- ✅ checkbox INSIDE th.w-check -->
                  <th class="w-check">
                    <input
                      ref="selectAllRef"
                      type="checkbox"
                      class="cb"
                      :checked="isAllOnPageSelected"
                      @change="toggleAllOnPage"
                      aria-label="Select all"
                    />
                  </th>

                  <th class="sortable" @click="toggleSort('name')">
                    Name <span class="sort">▾</span>
                  </th>
                  <th class="sortable" @click="toggleSort('role')">
                    Role <span class="sort">▾</span>
                  </th>
                  <th class="sortable" @click="toggleSort('patients')">
                    Patients Assigned <span class="sort">▾</span>
                  </th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="r in pagedRows" :key="r.id">
                  <td class="w-check">
                    <input class="cb" type="checkbox" :checked="isSelected(r.id)" @change="toggleOne(r.id)" />
                  </td>

                  <td class="name-cell">
                    <img class="avatar" :src="r.avatar" alt="" />
                    <div class="name-meta">
                      <div class="name">{{ r.name }}</div>
                      <div class="sub" v-if="r.sub">{{ r.sub }}</div>
                    </div>
                  </td>

                  <td>
                    <span class="pill" :class="pillClass(r.role)">{{ r.role }}</span>
                  </td>

                  <td class="patients-cell">
                    <span v-if="typeof r.patients === 'number'">{{ r.patients }} Patients</span>
                    <span v-else class="muted">{{ r.patients }}</span>
                  </td>

                  <td class="action-cell">
                    <button class="btn-msg" type="button" @click="message(r)">
                      Message
                    </button>
                  </td>
                </tr>

                <tr v-if="!pagedRows.length">
                  <td colspan="5" class="empty">No results.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="table-foot">
            <div class="foot-left">
              Showing {{ showingFrom }} to {{ showingTo }} of {{ filteredRows.length }} items
            </div>

            <div class="pager">
              <button class="pg" type="button" :disabled="page === 1" @click="goPage(page - 1)">‹</button>
              <button
                v-for="p in pagesToShow"
                :key="p"
                class="pg"
                :class="{ on: p === page }"
                type="button"
                @click="goPage(p)"
              >
                {{ p }}
              </button>
              <button class="pg" type="button" :disabled="page === pageCount" @click="goPage(page + 1)">›</button>
            </div>
          </div>
        </div>

        <!-- Middle: Upcoming Shifts list (center) -->
        <div class="card glass">
          <div class="card-head">
            <div class="card-title">Upcoming Shifts</div>
          </div>

          <div class="shift-list">
            <div class="shift-row" v-for="s in upcomingMain" :key="s.id">
              <div class="shift-icon">▦</div>
              <div class="shift-body">
                <div class="shift-name">{{ s.name }}</div>
                <div class="shift-sub muted">{{ s.unit }}</div>
              </div>

              <div class="shift-time muted">{{ s.when }}</div>

              <button class="btn-msg sm" type="button" @click="message({ name: s.name })">Message</button>
            </div>
          </div>
        </div>

        <!-- Bottom-left: Welcome card -->
        <div class="card glass welcome">
          <div class="welcome-top">
            <img class="avatar lg" :src="welcome.avatar" alt="" />
            <div>
              <div class="welcome-name">{{ welcome.name }}</div>
              <div class="muted">{{ welcome.role }}</div>
            </div>
          </div>

          <p class="welcome-text">
            Lets welcome <b>{{ welcome.short }}</b>, our new physician assistant student who is in training with us!
          </p>

          <button class="btn-primary" type="button" @click="goManageStaff">
            Manage Staff <span class="arr">›</span>
          </button>
        </div>
      </div>

      <!-- RIGHT: Tasks + On Shift Now + Mini Upcoming -->
      <div class="np-right">
        <div class="card glass">
          <div class="card-head between">
            <div class="card-title">Tasks</div>
            <button class="link" type="button" @click="viewAllTasks">View All ›</button>
          </div>

          <div class="tasks">
            <div class="task" v-for="t in tasks" :key="t.id">
              <input class="cb" type="checkbox" :checked="t.done" @change="toggleTask(t.id)" />
              <div class="task-body">
                <div class="task-title">{{ t.title }}</div>
                <div class="task-meta" :class="taskMetaClass(t.status)">{{ t.status }}</div>
                <div class="task-sub muted">{{ t.note }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card glass">
          <div class="card-head between">
            <div class="card-title">On Shift Now</div>
            <button class="link" type="button" @click="viewSchedule">View Schedule</button>
          </div>

          <div class="mini-list">
            <div class="mini-row" v-for="p in onShift" :key="p.id">
              <img class="avatar" :src="p.avatar" alt="" />
              <div class="mini-body">
                <div class="mini-name">{{ p.name }}</div>
                <div class="mini-sub muted">{{ p.when }}</div>
              </div>
              <div class="mini-tag muted">{{ p.unit }}</div>
            </div>
          </div>
        </div>

        <div class="card glass">
          <div class="card-head">
            <div class="card-title">Upcoming Shifts</div>
          </div>

          <div class="mini-shifts">
            <div class="mini-shift" v-for="s in upcomingMini" :key="s.id">
              <div class="shift-pill">▦</div>
              <div class="mini-body">
                <div class="mini-name">{{ s.name }}</div>
                <div class="mini-sub muted">{{ s.when }}</div>
              </div>
              <div class="mini-tag muted">{{ s.unit }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

function pillClass(role) {
  const r = String(role || "").toLowerCase();

  if (r === "np") return "np";
  if (r === "pa") return "pa";
  if (r === "icu") return "icu";
  if (r === "pending") return "pending";
  if (r === "in training" || r === "training") return "training";

  return "";
}

function taskMetaClass(status) {
  const s = String(status || "").toLowerCase();

  if (s.includes("due")) return "due";
  if (s.includes("ongoing")) return "ongoing";
  if (s.includes("not started")) return "notstarted";

  return "";
}


/* ---------------------------
   KPI + data (UI only)
--------------------------- */
const rows = ref([
  {
    id: 1,
    name: "Dr. Jake Nelson, DNP",
    sub: "",
    role: "NP",
    patients: 7,
    avatar: "https://i.pravatar.cc/64?img=12",
  },
  {
    id: 2,
    name: "Kelly Miller, PA",
    sub: "",
    role: "PA",
    patients: 5,
    avatar: "https://i.pravatar.cc/64?img=47",
  },
  {
    id: 3,
    name: "Hannah Stevens, NP",
    sub: "",
    role: "NP",
    patients: 4,
    avatar: "https://i.pravatar.cc/64?img=32",
  },
  {
    id: 4,
    name: "Adam Rogers, PA",
    sub: "ICU",
    role: "ICU",
    patients: 3,
    avatar: "https://i.pravatar.cc/64?img=15",
  },
  {
    id: 5,
    name: "Victoria Bennett, NP",
    sub: "",
    role: "Pending",
    patients: 0,
    avatar: "https://i.pravatar.cc/64?img=28",
  },
  {
    id: 6,
    name: "Aaron Patel, NP",
    sub: "in training",
    role: "In Training",
    patients: "In Training",
    avatar: "https://i.pravatar.cc/64?img=8",
  },
  // add a few more to exercise paging
  { id: 7, name: "Melissa Grant, NP", sub: "", role: "NP", patients: 6, avatar: "https://i.pravatar.cc/64?img=22" },
  { id: 8, name: "Chloe Reed, PA", sub: "", role: "PA", patients: 2, avatar: "https://i.pravatar.cc/64?img=44" },
  { id: 9, name: "Noah Carter, NP", sub: "", role: "NP", patients: 3, avatar: "https://i.pravatar.cc/64?img=51" },
  { id: 10, name: "Ava Morgan, PA", sub: "", role: "PA", patients: 4, avatar: "https://i.pravatar.cc/64?img=36" },
]);

const tasks = ref([
  { id: 1, title: "Review Clinical Protocols", status: "Due Tomorrow", note: "ACLS Protocols need review", done: false },
  { id: 2, title: "Update Patient Charts", status: "Ongoing", note: "Ensure all charts are up-to-date for ICU patients", done: false },
  { id: 3, title: "Precept New PA Student", status: "Not Started", note: "Orientation and guidance for Aaron Patel", done: false },
]);

const onShift = ref([
  { id: 1, name: "Kelly Miller, PA", when: "Today 7 AM - 3 PM", unit: "ICU", avatar: "https://i.pravatar.cc/64?img=47" },
  { id: 2, name: "Dr. Jake Nelson, DNP", when: "Today 8 AM - 6 PM", unit: "Cardiology", avatar: "https://i.pravatar.cc/64?img=12" },
  { id: 3, name: "Hannah Stevens, NP", when: "Today 11 AM - 7 PM", unit: "Pediatrics", avatar: "https://i.pravatar.cc/64?img=32" },
]);

const upcomingMain = ref([
  { id: 1, name: "Adam Rogers, PA", unit: "ICU", when: "Tomorrow 11 AM - 7 PM" },
  { id: 2, name: "Dr. Jake Nelson, DNP", unit: "Cardiology", when: "Tomorrow 7 AM - 3 PM" },
  { id: 3, name: "Sarah Thompson, RN", unit: "Charge Nurse", when: "Tomorrow 8 AM - 6 PM" },
]);

const upcomingMini = ref([
  { id: 1, name: "Adam Rogers, PA", unit: "ICU", when: "Tomorrow 11 AM - 7 PM" },
  { id: 2, name: "Dr. Jake Nelson, DNP", unit: "Charge Nurse", when: "Tomorrow 8 AM - 6 PM" },
]);

const welcome = ref({
  name: "Aaron Patel, NP",
  short: "Aaron Patel",
  role: "in Training",
  avatar: "https://i.pravatar.cc/96?img=8",
});

const kpiTotal = computed(() => rows.value.length);
const kpiOnShift = computed(() => onShift.value.length);
const kpiPending = computed(() => rows.value.filter((r) => r.role === "Pending").length);
const kpiUpcoming = computed(() => upcomingMain.value.length);

/* ---------------------------
   Filters / Sorting / Paging
--------------------------- */
const q = ref("");
const role = ref("all"); // all | NP | PA | ICU | Pending | In Training
const sortKey = ref("name"); // name | role | patients
const sortDir = ref("asc"); // asc | desc

const page = ref(1);
const pageSize = ref(6);

const filteredRows = computed(() => {
  const term = q.value.toLowerCase();

  return rows.value
    .filter((r) => {
      const roleOk = role.value === "all" ? true : r.role === role.value;
      const searchOk =
        !term ||
        r.name.toLowerCase().includes(term) ||
        (r.sub && r.sub.toLowerCase().includes(term)) ||
        String(r.role).toLowerCase().includes(term);
      return roleOk && searchOk;
    })
    .slice()
    .sort((a, b) => {
      const dir = sortDir.value === "asc" ? 1 : -1;

      const getVal = (x) => {
        if (sortKey.value === "patients") {
          return typeof x.patients === "number" ? x.patients : -1;
        }
        return String(x[sortKey.value] ?? "").toLowerCase();
      };

      const av = getVal(a);
      const bv = getVal(b);

      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
});

const pageCount = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)));

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredRows.value.slice(start, start + pageSize.value);
});

const showingFrom = computed(() => (filteredRows.value.length ? (page.value - 1) * pageSize.value + 1 : 0));
const showingTo = computed(() => Math.min(filteredRows.value.length, page.value * pageSize.value));

const pagesToShow = computed(() => {
  // show up to 3 pages like the mock (1 2 3)
  const total = pageCount.value;
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);
  return [1, 2, 3];
});

function goPage(p) {
  page.value = Math.min(Math.max(1, p), pageCount.value);
}

/* ---------------------------
   ✅ Selection logic (rules)
   - select-all checkbox inside th.w-check
   - unified toggleAllOnPage()
   - indeterminate computed from paged rows
   - reset selection on filter/page-size changes
--------------------------- */
const selected = ref(new Set());
const selectAllRef = ref(null);

const pagedIds = computed(() => pagedRows.value.map((r) => r.id));

const isAllOnPageSelected = computed(() => {
  const ids = pagedIds.value;
  return ids.length > 0 && ids.every((id) => selected.value.has(id));
});

const isSomeOnPageSelected = computed(() => {
  const ids = pagedIds.value;
  const any = ids.some((id) => selected.value.has(id));
  return any && !isAllOnPageSelected.value;
});

function syncIndeterminate() {
  if (!selectAllRef.value) return;
  selectAllRef.value.indeterminate = isSomeOnPageSelected.value;
}

function toggleAllOnPage() {
  const ids = pagedIds.value;
  const next = new Set(selected.value);

  if (isAllOnPageSelected.value) {
    ids.forEach((id) => next.delete(id));
  } else {
    ids.forEach((id) => next.add(id));
  }
  selected.value = next;
  nextTick(syncIndeterminate);
}

function isSelected(id) {
  return selected.value.has(id);
}

function toggleOne(id) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
  nextTick(syncIndeterminate);
}

/* reset selection on filter/page-size changes */
watch([q, role, pageSize], () => {
  selected.value = new Set();
  nextTick(syncIndeterminate);
});

/* keep indeterminate in sync when paging changes */
watch([page, pagedRows], () => nextTick(syncIndeterminate), { deep: true });

/* ---------------------------
   Dropdowns (z-index safe)
--------------------------- */
const roleDdOpen = ref(false);
const exportDdOpen = ref(false);
const roleDdRef = ref(null);
const exportDdRef = ref(null);

function setRole(v) {
  role.value = v;
  roleDdOpen.value = false;
  goPage(1);
}

const roleLabel = computed(() => (role.value === "all" ? "All Roles" : role.value));

function fakeExport(type) {
  exportDdOpen.value = false;
  window.alert(`Export ${type} (UI only).`);
}

/* close dropdowns on outside click / Esc */
function onWindowClick(e) {
  const roleEl = roleDdRef.value;
  const expEl = exportDdRef.value;

  if (roleDdOpen.value && roleEl && !roleEl.contains(e.target)) roleDdOpen.value = false;
  if (exportDdOpen.value && expEl && !expEl.contains(e.target)) exportDdOpen.value = false;
}
function onEsc(e) {
  if (e.key !== "Escape") return;
  roleDdOpen.value = false;
  exportDdOpen.value = false;
}

onMounted(() => {
  window.addEventListener("click", onWindowClick, true);
  window.addEventListener("keydown", onEsc);
  nextTick(syncIndeterminate);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", onWindowClick, true);
  window.removeEventListener("keydown", onEsc);
});

/* ---------------------------
   UI actions
--------------------------- */
function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
}

function message(r) {
  window.alert(`Message ${r.name} (UI only).`);
}
function toggleTask(id) {
  tasks.value = tasks.value.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}
function viewAllTasks() {
  window.alert("View all tasks (UI only).");
}
function viewSchedule() {
  window.alert("View schedule (UI only).");
}
function goManageStaff() {
  window.alert("Manage Staff (UI only).");
}
</script>

<style scoped>
/* overall page feel similar to mock (soft violet glow) */
.np-shell{
  display: grid;
  gap: 14px;
}

/* header */
.np-head{
  display:flex;
  align-items:flex-end;
  justify-content: space-between;
  gap: 12px;
}
.np-title{
  margin:0;
  font-size: 24px;
  font-weight: 1000;
  letter-spacing: .2px;
  color:#0f172a;
}
.np-breadcrumb{
  margin-top: 6px;
  display:flex;
  align-items:center;
  gap: 8px;
  font-weight: 800;
  color:#334155;
}
.sep{ opacity:.7; }
.muted{ color: var(--muted); }

/* KPIs */
.np-kpis{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.kpi{
  border-radius: 12px;
  padding: 14px 16px;
  color: white;
  box-shadow: 0 14px 30px rgba(15,23,42,0.12);
  border: 1px solid rgba(255,255,255,0.28);
  position: relative;
  overflow: hidden;
}
.kpi:before{
  content:"";
  position:absolute;
  inset:-40px -60px auto auto;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  background: rgba(255,255,255,0.18);
  transform: rotate(10deg);
}
.kpi-label{
  font-weight: 900;
  opacity: .95;
}
.kpi-value{
  margin-top: 6px;
  font-size: 34px;
  font-weight: 1000;
  line-height: 1;
}
.kpi-blue{ background: linear-gradient(90deg, #4f78ff, #3b60e4); }
.kpi-teal{ background: linear-gradient(90deg, #2aa7a0, #1f8aa3); }
.kpi-orange{ background: linear-gradient(90deg, #ff8c3a, #ff6a3a); }
.kpi-pink{ background: linear-gradient(90deg, #ff5b8a, #ff3e63); }

/* main grid */
.np-grid{
  display:grid;
  grid-template-columns: 1.7fr 0.95fr;
  gap: 14px;
  align-items:start;
}
.np-left{
  display:grid;
  gap: 14px;
}
.np-right{
  display:grid;
  gap: 14px;
}

/* cards */
.card{
  border-radius: 14px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  overflow: hidden;
}
.glass{
  background: rgba(255,255,255,0.70);
  backdrop-filter: blur(10px);
}
.card-top{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid rgba(226,232,244,0.8);
}
.card-head{
  padding: 12px;
  border-bottom: 1px solid rgba(226,232,244,0.8);
}
.card-head.between{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
}
.card-title{
  font-weight: 1000;
  color:#0f172a;
}

/* top controls */
.search-wrap{
  flex: 1;
  min-width: 220px;
}
.search{
  width: 100%;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.85);
  padding: 0 12px;
  font-weight: 800;
  outline: none;
}
.search:focus{
  box-shadow: 0 0 0 4px rgba(79,120,255,0.14);
  border-color: rgba(79,120,255,0.35);
}

.filters{
  display:flex;
  gap: 10px;
  flex: 0 0 auto;
}

/* dropdowns */
.dd{ position: relative; }
.dd-btn{
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.85);
  padding: 0 12px;
  cursor: pointer;
  font-weight: 900;
  color:#0f172a;
  display:flex;
  align-items:center;
  gap: 8px;
}
.caret{ opacity:.8; font-weight: 900; }
.dd-menu{
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: #fff;
  border: 1px solid rgba(226,232,244,0.95);
  border-radius: 12px;
  box-shadow: 0 18px 34px rgba(15,23,42,0.16);
  overflow: hidden;
  z-index: 999;
}
.dd-item{
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: 0;
  background: #fff;
  cursor: pointer;
  font-weight: 900;
  color:#0f172a;
}
.dd-item:hover{ background: #f5f8ff; }

/* table */
.table-wrap{ padding: 8px 10px 6px; }
.np-table{
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}
.np-table th,
.np-table td{
  padding: 10px 10px;
  border-bottom: 1px solid rgba(226,232,244,0.75);
  vertical-align: middle;
  color:#0f172a;
  font-weight: 800;
}
.np-table thead th{
  font-weight: 1000;
  color:#334155;
}
.sortable{ cursor: pointer; user-select: none; }
.sort{ opacity:.7; margin-left: 6px; font-size: 12px; }

.w-check{ width: 44px; }
.w-name{ width: 44%; }
.w-role{ width: 18%; }
.w-patients{ width: 20%; }
.w-action{ width: 18%; }

.cb{
  width: 16px;
  height: 16px;
  accent-color: #3b60e4;
}

.name-cell{
  display:flex;
  align-items:center;
  gap: 10px;
  min-width: 0;
}
.avatar{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  object-fit: cover;
  flex: 0 0 auto;
  border: 2px solid rgba(255,255,255,0.85);
  box-shadow: 0 8px 16px rgba(15,23,42,0.12);
}
.avatar.lg{
  width: 46px;
  height: 46px;
}
.name-meta{ min-width: 0; }
.name{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sub{
  font-size: 12px;
  font-weight: 900;
  color: var(--muted);
  margin-top: 2px;
}
.patients-cell{ color:#334155; }
.action-cell{ text-align: right; }

/* pills */
.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 1000;
  font-size: 12px;
  border: 1px solid rgba(255,255,255,0.55);
}
.pill.np{ background: rgba(79,120,255,0.18); color:#2f55da; }
.pill.pa{ background: rgba(42,167,160,0.16); color:#147f86; }
.pill.icu{ background: rgba(59,96,228,0.16); color:#2f55da; }
.pill.pending{ background: rgba(255,140,58,0.18); color:#c25114; }
.pill.training{ background: rgba(100,116,139,0.16); color:#475569; }

.btn-msg{
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(59,96,228,0.35);
  background: rgba(79,120,255,0.12);
  color:#2f55da;
  cursor: pointer;
  font-weight: 1000;
}
.btn-msg:hover{ background: rgba(79,120,255,0.16); }
.btn-msg.sm{
  height: 32px;
  border-radius: 10px;
  padding: 0 10px;
}

/* footer */
.table-foot{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px 12px;
}
.foot-left{
  font-weight: 800;
  color:#64748b;
}
.pager{ display:flex; gap: 6px; }
.pg{
  min-width: 34px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.85);
  cursor: pointer;
  font-weight: 1000;
  color:#0f172a;
}
.pg.on{
  background: rgba(79,120,255,0.14);
  border-color: rgba(79,120,255,0.35);
  color:#2f55da;
}
.pg:disabled{ opacity: .5; cursor: not-allowed; }

.empty{
  text-align: center;
  padding: 18px 10px;
  color:#64748b;
  font-weight: 900;
}

/* shifts list */
.shift-list{ padding: 10px 12px 12px; display:grid; gap: 10px; }
.shift-row{
  display:grid;
  grid-template-columns: 26px 1fr auto auto;
  gap: 10px;
  align-items:center;
  padding: 10px 10px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.75);
  background: rgba(255,255,255,0.75);
}
.shift-icon{
  width: 22px; height: 22px;
  border-radius: 7px;
  display:flex; align-items:center; justify-content:center;
  background: rgba(79,120,255,0.14);
  color:#2f55da;
  font-weight: 1000;
}
.shift-name{ font-weight: 1000; color:#0f172a; }
.shift-time{ font-weight: 900; white-space: nowrap; }

/* welcome */
.welcome{ padding: 14px 14px 16px; }
.welcome-top{
  display:flex;
  align-items:center;
  gap: 10px;
}
.welcome-name{
  font-weight: 1000;
  color:#0f172a;
}
.welcome-text{
  margin: 10px 0 12px;
  font-weight: 800;
  color:#334155;
  line-height: 1.45;
}
.btn-primary{
  width: 100%;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(59,96,228,0.25);
  background: linear-gradient(90deg, rgba(79,120,255,0.95), rgba(59,96,228,0.92));
  color: white;
  font-weight: 1000;
  cursor: pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 10px;
}
.arr{ font-weight: 1000; opacity:.95; }

/* tasks */
.tasks{ padding: 10px 12px 12px; display:grid; gap: 12px; }
.task{
  display:flex;
  gap: 10px;
  align-items:flex-start;
  padding: 10px 10px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.75);
  background: rgba(255,255,255,0.75);
}
.task-body{ min-width: 0; }
.task-title{
  font-weight: 1000;
  color:#0f172a;
}
.task-meta{
  margin-top: 4px;
  font-weight: 1000;
  font-size: 12px;
}
.task-meta.due{ color:#ff6a3a; }
.task-meta.ongoing{ color:#147f86; }
.task-meta.notstarted{ color:#e11d48; }
.task-sub{ margin-top: 4px; font-weight: 800; }

/* mini lists */
.mini-list{ padding: 10px 12px 12px; display:grid; gap: 10px; }
.mini-row{
  display:grid;
  grid-template-columns: 34px 1fr auto;
  gap: 10px;
  align-items:center;
  padding: 10px 10px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.75);
  background: rgba(255,255,255,0.75);
}
.mini-body{ min-width:0; }
.mini-name{
  font-weight: 1000;
  color:#0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mini-tag{ font-weight: 900; white-space: nowrap; }

.mini-shifts{ padding: 10px 12px 12px; display:grid; gap: 10px; }
.mini-shift{
  display:grid;
  grid-template-columns: 26px 1fr auto;
  gap: 10px;
  align-items:center;
  padding: 10px 10px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.75);
  background: rgba(255,255,255,0.75);
}
.shift-pill{
  width: 22px; height: 22px;
  border-radius: 7px;
  display:flex; align-items:center; justify-content:center;
  background: rgba(79,120,255,0.14);
  color:#2f55da;
  font-weight: 1000;
}

/* links */
.link{
  border: 0;
  background: transparent;
  cursor: pointer;
  font-weight: 1000;
  color:#2f55da;
}
.link:hover{ text-decoration: underline; }

/* responsive */
@media (max-width: 1100px){
  .np-grid{ grid-template-columns: 1fr; }
  .np-kpis{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px){
  .np-kpis{ grid-template-columns: 1fr; }
  .card-top{ flex-direction: column; align-items: stretch; }
  .filters{ justify-content: flex-end; }
  .w-name{ width: 56%; }
  .w-role{ width: 18%; }
  .w-patients{ width: 26%; }
  .w-action{ width: 0; }
  .action-cell{ display:none; }
}
</style>
