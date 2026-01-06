<template>
  <section class="intern-patients">
    <!-- Header -->
    <div class="dash-top">
      <div class="dash-title">
        <h1>Patients</h1>
        <p class="subtle">
          Patient Overview <span class="sep">›</span> Manage all assigned patients.
        </p>
      </div>
    </div>

    <!-- KPI cards -->
    <div class="kpi-row">
      <div class="kpi kpi-blue">
        <div class="kpi-left">
          <div class="kpi-label">Total Patients</div>
        </div>
        <div class="kpi-value">12</div>
      </div>

      <div class="kpi kpi-green">
        <div class="kpi-left">
          <div class="kpi-label">Follow-Ups</div>
        </div>
        <div class="kpi-value">4</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-left">
          <div class="kpi-label">Consults</div>
        </div>
        <div class="kpi-value">6</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-left">
          <div class="kpi-label">Pending Tasks</div>
        </div>
        <div class="kpi-value">2</div>
      </div>
    </div>

    <!-- Filters + Table -->
    <section class="card glass">
      <div class="filters">
        <div class="filters-left">
          <div class="search-row">
            <font-awesome-icon class="search-ico" icon="magnifying-glass" />
            <input v-model="query" class="search" placeholder="Search..." type="text" />
          </div>

          <div class="filter-dd" @click.stop>
            <button class="filter-dd-btn" type="button" @click="toggleDd('status')">
                <span>{{ statusLabel }}</span>
                <font-awesome-icon icon="chevron-down" />
            </button>
                <div v-if="openDd === 'status'" class="filter-dd-menu">
                    <button class="filter-dd-item" @click="setStatus('all')">All Status</button>
                    <button class="filter-dd-item" @click="setStatus('follow-up')">Follow-Up</button>
                    <button class="filter-dd-item" @click="setStatus('new-consult')">New Consult</button>
                    <button class="filter-dd-item" @click="setStatus('routine-checkup')">Routine Checkup</button>
                    <button class="filter-dd-item" @click="setStatus('lab-review')">Lab Review</button>
                    <button class="filter-dd-item" @click="setStatus('discharge-summary')">Discharge Summary</button>
                    <button class="filter-dd-item" @click="setStatus('critical')">Critical</button>
                </div>
                </div>

            <div class="filter-dd" @click.stop>
                <button class="filter-dd-btn" type="button" @click="toggleDd('care')">
                <span>{{ careLabel }}</span>
                <font-awesome-icon icon="chevron-down" />
                </button>

                <div v-if="openDd === 'care'" class="filter-dd-menu">
                <button class="filter-dd-item" :class="{ 'is-active': care === 'primary' }" @click="setCare('primary')">Primary Care</button>
                <button class="filter-dd-item" :class="{ 'is-active': care === 'specialty' }" @click="setCare('specialty')">Specialty</button>
                </div>
            </div>

            <div class="filter-dd" @click.stop>
                <button class="filter-dd-btn" type="button" @click="toggleDd('date')">
                <span>{{ dateLabel }}</span>
                <font-awesome-icon icon="chevron-down" />
                </button>

                <div v-if="openDd === 'date'" class="filter-dd-menu">
                <button class="filter-dd-item" :class="{ 'is-active': date === 'all' }" @click="setDate('all')">All Dates</button>
                <button class="filter-dd-item" :class="{ 'is-active': date === 'today' }" @click="setDate('today')">Today</button>
                <button class="filter-dd-item" :class="{ 'is-active': date === 'tomorrow' }" @click="setDate('tomorrow')">Tomorrow</button>
                <button class="filter-dd-item" :class="{ 'is-active': date === 'week' }" @click="setDate('week')">This Week</button>
                </div>
            </div>
        </div>

        <button class="btn-outline" type="button">
          <font-awesome-icon icon="file-arrow-down" />
          Export
        </button>
      </div>

      <div class="table-wrap">
        <table class="patients-table">
          <colgroup>
            <col class="w-check" />
            <col class="w-name" />
            <col class="w-id" />
            <col class="w-next" />
            <col class="w-status" />
            <col class="w-assign" />
            <col class="w-actions" />
          </colgroup>

          <thead>
            <tr>
              <th class="w-check">
                <input type="checkbox" />
              </th>
              <th>
                <span class="th-label">
                  Name <font-awesome-icon class="th-ico" icon="chevron-down" />
                </span>
              </th>
              <th>
                <span class="th-label">
                  Patient ID <font-awesome-icon class="th-ico" icon="chevron-down" />
                </span>
              </th>
              <th>
                <span class="th-label">
                  Next Visit <font-awesome-icon class="th-ico" icon="chevron-down" />
                </span>
              </th>
              <th>
                <span class="th-label">
                  Status <font-awesome-icon class="th-ico" icon="chevron-down" />
                </span>
              </th>
              <th>
                <span class="th-label">
                  Assignment <font-awesome-icon class="th-ico" icon="chevron-down" />
                </span>
              </th>
              <th>
                <span class="th-label">
                  Actions <font-awesome-icon class="th-ico" icon="chevron-down" />
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in filteredPatients" :key="p.id">
              <td class="w-check"><input type="checkbox" /></td>

              <td class="name-cell">
                <div class="mini-avatar">
                  <img :src="p.avatar" alt="" />
                </div>
                <span class="name">{{ p.name }}</span>
              </td>

              <td class="pid">{{ p.pid }}</td>
              <td>{{ p.nextVisit }}</td>

              <td>
                <span class="pill" :class="pillClass(p.status)">{{ p.status }}</span>
              </td>

              <td>
                <span class="pill outline" :class="pillClass(p.assignment)">{{ p.assignment }}</span>
              </td>

              <td>
                <button class="btn-view" type="button">
                  View <font-awesome-icon icon="chevron-down" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="table-footer">
          <div class="subtle">Showing 1 to 9 of 12 patients</div>

          <div class="pager">
            <button class="pg-btn" type="button">‹</button>
            <button class="pg-btn active" type="button">1</button>
            <button class="pg-btn" type="button">2</button>
            <button class="pg-btn" type="button">3</button>
            <button class="pg-btn" type="button">›</button>

            <div class="select-wrap sm">
              <select class="select sm">
                <option>10 / page</option>
                <option>20 / page</option>
                <option>50 / page</option>
              </select>
              <font-awesome-icon class="select-ico" icon="chevron-down" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom note -->
    <section class="card glass note">
      <div class="note-head">
        <div class="mini-avatar lg">
          <img src="https://i.pravatar.cc/64?img=12" alt="" />
        </div>
        <div>
          <div class="note-name">John Carter</div>
          <div class="subtle">14m ago</div>
        </div>
      </div>

      <p class="note-text">
        Please review the lab results for Mark Johnson and prepare a discharge summary for his consult and in next meetings.
      </p>
    </section>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const query = ref("");
const status = ref("all");
const care = ref("primary");
const date = ref("all");

const openDd = ref(null);

const patients = ref([
  {
    id: 1,
    name: "Laura Williams",
    pid: "P-2451",
    nextVisit: "Today 09:00 AM",
    status: "Follow-Up",
    assignment: "Outpatient",
    avatar: "https://i.pravatar.cc/48?img=32",
  },
  {
    id: 2,
    name: "Mark Johnson",
    pid: "P-2452",
    nextVisit: "Today 10:00 AM",
    status: "New Consult",
    assignment: "Outpatient",
    avatar: "https://i.pravatar.cc/48?img=56",
  },
  {
    id: 3,
    name: "Cleo Anderson",
    pid: "P-2449",
    nextVisit: "Today 11:00 AM",
    status: "Follow-Up",
    assignment: "Inpatient",
    avatar: "https://i.pravatar.cc/48?img=45",
  },
  {
    id: 4,
    name: "Ethan Rivera",
    pid: "P-2443",
    nextVisit: "Today 1:00 PM",
    status: "Routine Checkup",
    assignment: "Outpatient",
    avatar: "https://i.pravatar.cc/48?img=15",
  },
  {
    id: 5,
    name: "William Clark",
    pid: "P-2441",
    nextVisit: "Tomorrow 3:00 PM",
    status: "Lab Review",
    assignment: "Outpatient",
    avatar: "https://i.pravatar.cc/48?img=18",
  },
  {
    id: 6,
    name: "Olivia Harris",
    pid: "P-2445",
    nextVisit: "Today 3:00 PM",
    status: "Discharge Summary",
    assignment: "Inpatient",
    avatar: "https://i.pravatar.cc/48?img=21",
  },
  {
    id: 7,
    name: "William Martinez",
    pid: "P-2437",
    nextVisit: "Tomorrow 2:00 PM",
    status: "Critical",
    assignment: "Critical",
    avatar: "https://i.pravatar.cc/48?img=25",
  },
  {
    id: 8,
    name: "Janet Collins",
    pid: "P-2448",
    nextVisit: "Thursday",
    status: "Follow-Up",
    assignment: "Outpatient",
    avatar: "https://i.pravatar.cc/48?img=49",
  },
  {
    id: 9,
    name: "Megan Richards",
    pid: "P-2468",
    nextVisit: "Thursday 8:00 AM",
    status: "Routine Checkup",
    assignment: "Outpatient",
    avatar: "https://i.pravatar.cc/48?img=41",
  },
]);

/* ===== Labels for dropdown buttons ===== */
const statusLabel = computed(() => {
  const map = {
    all: "All Status",
    "follow-up": "Follow-Up",
    "new-consult": "New Consult",
    "routine-checkup": "Routine Checkup",
    "lab-review": "Lab Review",
    "discharge-summary": "Discharge Summary",
    critical: "Critical",
  };
  return map[status.value] || "All Status";
});

const careLabel = computed(() => (care.value === "specialty" ? "Specialty" : "Primary Care"));

const dateLabel = computed(() => {
  const map = { all: "All Dates", today: "Today", tomorrow: "Tomorrow", week: "This Week" };
  return map[date.value] || "All Dates";
});

/* ===== Table filtering ===== */
const filteredPatients = computed(() => {
  const q = query.value.trim().toLowerCase();
  let list = patients.value;

  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.pid.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q) ||
        p.assignment.toLowerCase().includes(q)
    );
  }

  if (status.value !== "all") {
    const map = {
      "follow-up": "follow-up",
      "new-consult": "new consult",
      "routine-checkup": "routine checkup",
      "lab-review": "lab review",
      "discharge-summary": "discharge summary",
      critical: "critical",
    };
    const key = map[status.value];
    list = list.filter((p) => p.status.toLowerCase() === key);
  }

  return list;
});

function pillClass(label) {
  const v = String(label || "").toLowerCase();
  if (v.includes("follow")) return "pill-teal";
  if (v.includes("outpatient")) return "pill-teal";
  if (v.includes("new")) return "pill-orange";
  if (v.includes("routine")) return "pill-green";
  if (v.includes("lab")) return "pill-purple";
  if (v.includes("discharge")) return "pill-red";
  if (v.includes("inpatient")) return "pill-red";
  if (v.includes("critical")) return "pill-orange";
  return "pill-muted";
}

/* ===== Dropdown open/close ===== */
function toggleDd(key) {
  openDd.value = openDd.value === key ? null : key;
}
function closeAll() {
  openDd.value = null;
}
function setStatus(v) {
  status.value = v;
  closeAll();
}
function setCare(v) {
  care.value = v;
  closeAll();
}
function setDate(v) {
  date.value = v;
  closeAll();
}

onMounted(() => window.addEventListener("click", closeAll));
onBeforeUnmount(() => window.removeEventListener("click", closeAll));
</script>


<style scoped>
/* Page */
.intern-patients{ padding: 18px 18px 24px; }
.sep{ margin: 0 6px; opacity: .55; }

/* Top header */
.dash-top{
  display:flex; align-items:flex-start; justify-content:space-between;
  gap:14px; margin-bottom: 14px;
}
.dash-title h1{
  margin:0; font-size: 30px; font-weight: 900; letter-spacing:-0.02em;
}
.dash-title p{ margin: 6px 0 0; font-size: 14px; }

.dash-user{ display:flex; align-items:center; gap:10px; }
.icon-btn{
  position: relative;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
}
.icon-btn.ghost{
  border-color: transparent;
  background: transparent;
  padding: 8px 10px;
}
.badge-dot{
  position:absolute; top:-6px; right:-6px;
  background:#ff4d4f; color:#fff; font-size:11px; font-weight:900;
  padding: 4px 7px; border-radius:999px;
  border: 2px solid rgba(255,255,255,0.9);
}

.user-chip{
  display:flex; align-items:center; gap:10px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.55);
  padding: 8px 10px; border-radius: 16px;
}
.avatar{
  width:36px; height:36px; border-radius:999px; overflow:hidden;
}
.avatar img{ width:100%; height:100%; object-fit:cover; }
.user-meta .name{ font-weight: 900; font-size: 14px; }
.user-meta .role{ font-size: 12px; margin-top: 2px; }

/* KPI */
.kpi-row{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}
.kpi{
  border-radius: 14px;
  padding: 14px 16px;
  color: #fff;
  display:flex;
  align-items:center;
  justify-content:space-between;
  box-shadow: 0 10px 24px rgba(0,0,0,0.10);
  min-height: 70px;
}
.kpi-label{ font-weight: 800; font-size: 14px; opacity: 0.96; }
.kpi-value{ font-weight: 900; font-size: 34px; line-height: 1; letter-spacing: -0.03em; }
.kpi-blue{ background: linear-gradient(135deg, #4f77ff, #2f56ff); }
.kpi-green{ background: linear-gradient(135deg, #23b5a8, #1a8e84); }
.kpi-red{ background: linear-gradient(135deg, #ff6c6c, #ff4a4a); }
.kpi-orange{ background: linear-gradient(135deg, #ffb35a, #ff8c3a); }

/* Card / glass */
.card{
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  background: rgba(255,255,255,0.60);
  box-shadow: 0 10px 26px rgba(35, 55, 110, 0.12);
  overflow:hidden;
}
.glass{ backdrop-filter: blur(10px); }

/* Filters */
.filters{
  display:flex; align-items:center; justify-content:space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.filters-left{
  display:flex; align-items:center; gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
}
.search-row{
  position: relative;
  width: 240px;
  max-width: 44vw;
}
.search{
  width:100%;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 12px 10px 38px;
  outline: none;
}
.search-ico{
  position:absolute;
  left: 12px;
  top: 11px;
  opacity: .65;
}
.select-wrap{
  position: relative;
  display:inline-flex;
  align-items:center;
}
.filter-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  height: 40px;
  min-width: 150px;

  padding: 0 38px 0 14px;
  border-radius: 14px;

  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.60);

  font-size: 14px;
  font-weight: 800;
  color: rgba(30,40,70,0.95);

  cursor: pointer;
  outline: none;
}
.filter-select:hover {
  background: rgba(255,255,255,0.75);
  border-color: rgba(0,0,0,0.18);
}
.filter-select:focus {
  border-color: rgba(47,86,255,0.45);
  box-shadow: 0 0 0 3px rgba(47,86,255,0.18);
}
.select-chevron {
  position: absolute;
  right: 14px;
  pointer-events: none;

  font-size: 13px;
  color: rgba(60,70,95,0.75);
}
.filter-select:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.select{
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 36px 10px 12px;
  outline: none;
  font-weight: 800;
  color: rgba(30,40,70,0.90);
  appearance: none;
}
.select-wrap.sm .select{ padding: 8px 32px 8px 10px; font-size: 12px; border-radius: 10px; }
.select-ico{
  position:absolute;
  right: 12px;
  opacity: .65;
  pointer-events:none;
}
.btn-outline{
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  display:flex;
  align-items:center;
  gap: 8px;
  cursor:pointer;
}

/* Table */
.table-wrap{ padding: 0; }
.patients-table{
  width:100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}
.w-check{ width:44px; }
.w-name{ width: 260px; }
.w-id{ width: 140px; }
.w-next{ width: 180px; }
.w-status{ width: 150px; }
.w-assign{ width: 150px; }
.w-actions{ width: 130px; }

thead th{
  text-align:left;
  font-size: 13px;
  font-weight: 900;
  padding: 12px 14px;
  color: rgba(30,40,70,0.90);
  background: rgba(255,255,255,0.40);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
tbody td{
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  color: rgba(30,40,70,0.92);
  font-weight: 600;
}
tbody tr:hover{ background: rgba(255,255,255,0.50); }

.th-label{
  display:inline-flex; align-items:center; gap: 8px;
}
.th-ico{ opacity: .55; font-size: 12px; }

.name-cell{
  display:flex; align-items:center; gap: 10px;
  min-width: 0;
}
.name{ font-weight: 900; }
.mini-avatar{
  width: 34px; height: 34px;
  border-radius: 999px;
  overflow:hidden;
  border: 2px solid rgba(255,255,255,0.85);
  flex: 0 0 auto;
}
.mini-avatar img{ width:100%; height:100%; object-fit:cover; }
.mini-avatar.lg{ width: 40px; height: 40px; }

.pid{
  color: #2f56ff;
  font-weight: 900;
}

/* Pills */
.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
  border: 1px solid transparent;
}
.pill.outline{
  background: transparent !important;
  border-color: rgba(0,0,0,0.10);
  color: rgba(30,40,70,0.86);
}
.pill-teal{ background: rgba(35,181,168,0.16); color: #17867d; border-color: rgba(35,181,168,0.22); }
.pill-green{ background: rgba(42,183,120,0.16); color: #1b8a57; border-color: rgba(42,183,120,0.22); }
.pill-orange{ background: rgba(255,153,59,0.18); color: #cc6f10; border-color: rgba(255,153,59,0.26); }
.pill-purple{ background: rgba(136,97,255,0.16); color: #5a3cff; border-color: rgba(136,97,255,0.22); }
.pill-red{ background: rgba(255,108,108,0.16); color: #d64545; border-color: rgba(255,108,108,0.22); }
.pill-muted{ background: rgba(130,140,170,0.14); color: rgba(60,70,95,0.88); border-color: rgba(130,140,170,0.22); }

/* Actions */
.btn-view{
  background: linear-gradient(135deg, #4f77ff, #2f56ff);
  color:#fff;
  border:none;
  border-radius: 12px;
  padding: 8px 12px;
  font-weight: 900;
  display:inline-flex;
  align-items:center;
  gap: 8px;
  cursor:pointer;
}

/* Footer */
.table-footer{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 14px;
}
.pager{
  display:flex;
  align-items:center;
  gap: 6px;
}
.pg-btn{
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 8px;
  padding: 6px 10px;
  font-weight: 900;
  cursor:pointer;
}
.pg-btn.active{
  border-color: rgba(47,86,255,0.32);
  background: rgba(47,86,255,0.14);
  color: #2f56ff;
}

/* Note */
.note{
  margin-top: 14px;
  padding: 14px 16px;
}
.note-head{
  display:flex;
  align-items:center;
  gap: 12px;
}
.note-name{ font-weight: 900; }
.note-text{
  margin: 10px 0 0;
  color: rgba(30,40,70,0.90);
}
.filter-dd {
  position: relative;
  display: inline-flex;
}

.filter-dd-btn {
  height: 40px;
  min-width: 150px;

  padding: 0 14px;
  border-radius: 14px;

  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.60);

  font-size: 14px;
  font-weight: 800;
  color: rgba(30,40,70,0.95);

  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  cursor: pointer;
}

.filter-dd-btn:hover {
  background: rgba(255,255,255,0.75);
  border-color: rgba(0,0,0,0.18);
}

.filter-dd-btn:focus-visible {
  outline: none;
  border-color: rgba(47,86,255,0.45);
  box-shadow: 0 0 0 3px rgba(47,86,255,0.18);
}

.filter-dd-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 100%;
  z-index: 9999;

  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.12);

  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 40px rgba(20, 30, 70, 0.22);

  padding: 6px;
}
.filter-dd-item {
  width: 100%;
  border: none;
  background: transparent;

  text-align: left;
  padding: 10px 12px;
  border-radius: 10px;

  font-size: 13px;
  font-weight: 800;
  color: rgba(30,40,70,0.92);

  cursor: pointer;
}
.filter-dd-item:hover {
  background: rgba(47,86,255,0.10);
  color: #2f56ff;
}

.filter-dd-item.is-active {
  background: rgba(47,86,255,0.16);
  color: #2f56ff;
}

/* Responsive */
@media (max-width: 1100px){
  .kpi-row{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px){
  .dash-top{ flex-direction: column; align-items: stretch; }
  .dash-user{ justify-content: space-between; }
  .filters{ flex-direction: column; align-items: stretch; }
  .search-row{ width: 100%; max-width: unset; }
  .btn-outline{ width: 100%; justify-content: center; }
  .table-footer{ flex-direction: column; align-items: flex-start; }
}
@media (max-width: 640px){
  .kpi-row{ grid-template-columns: 1fr; }
  .w-next{ width: 160px; }
  .w-status, .w-assign{ width: 140px; }
}
</style>
