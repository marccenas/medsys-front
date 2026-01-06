<template>
  <section class="intern-tasks">
    <!-- Header -->
    <div class="dash-top">
      <div class="dash-title">
        <h1>Tasks</h1>
        <p class="subtle">
          Task Overview <span class="sep">›</span> Manage and track assigned tasks.
        </p>
      </div>
    </div>

    <!-- KPI cards -->
    <div class="kpi-row">
      <div class="kpi kpi-blue">
        <div class="kpi-left">
          <div class="kpi-label">Today's Tasks</div>
          <div class="kpi-ico">
            <font-awesome-icon icon="list-check" />
          </div>
        </div>
        <div class="kpi-value">8</div>
      </div>

      <div class="kpi kpi-green">
        <div class="kpi-left">
          <div class="kpi-label">Due Upcoming</div>
          <div class="kpi-ico">
            <font-awesome-icon icon="calendar-days" />
          </div>
        </div>
        <div class="kpi-value">5</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-left">
          <div class="kpi-label">Overdue</div>
          <div class="kpi-ico">
            <font-awesome-icon icon="clipboard-list" />
          </div>
        </div>
        <div class="kpi-value">3</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-left">
          <div class="kpi-label">Pending Follow-Up</div>
          <div class="kpi-ico">
            <font-awesome-icon icon="message" />
          </div>
        </div>
        <div class="kpi-value">4</div>
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

          <!-- All Tasks -->
          <div class="filter-dd" @click.stop>
            <button class="filter-dd-btn" type="button" @click="toggleDd('type')">
              <span>{{ typeLabel }}</span>
              <font-awesome-icon icon="chevron-down" />
            </button>
            <div v-if="openDd === 'type'" class="filter-dd-menu">
              <button class="filter-dd-item" :class="{ 'is-active': type === 'all' }" @click="setType('all')">All Tasks</button>
              <button class="filter-dd-item" :class="{ 'is-active': type === 'clinical' }" @click="setType('clinical')">Clinical</button>
              <button class="filter-dd-item" :class="{ 'is-active': type === 'paperwork' }" @click="setType('paperwork')">Paperwork</button>
              <button class="filter-dd-item" :class="{ 'is-active': type === 'follow-up' }" @click="setType('follow-up')">Follow-Up</button>
            </div>
          </div>

          <!-- All Status -->
          <div class="filter-dd" @click.stop>
            <button class="filter-dd-btn" type="button" @click="toggleDd('status')">
              <span>{{ statusLabel }}</span>
              <font-awesome-icon icon="chevron-down" />
            </button>
            <div v-if="openDd === 'status'" class="filter-dd-menu">
              <button class="filter-dd-item" :class="{ 'is-active': status === 'all' }" @click="setStatus('all')">All Status</button>
              <button class="filter-dd-item" :class="{ 'is-active': status === 'important' }" @click="setStatus('important')">Important</button>
              <button class="filter-dd-item" :class="{ 'is-active': status === 'critical' }" @click="setStatus('critical')">Critical</button>
              <button class="filter-dd-item" :class="{ 'is-active': status === 'pending' }" @click="setStatus('pending')">Pending</button>
              <button class="filter-dd-item" :class="{ 'is-active': status === 'done' }" @click="setStatus('done')">Done</button>
            </div>
          </div>

          <!-- All Dates -->
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

        <button class="btn-primary" type="button">
          <font-awesome-icon icon="plus" />
          New Task
        </button>
      </div>

      <div class="table-wrap">
        <table class="tasks-table">
          <colgroup>
            <col class="w-check" />
            <col class="w-task" />
            <col class="w-patient" />
            <col class="w-due" />
            <col class="w-status" />
            <col class="w-actions" />
          </colgroup>

          <thead>
            <tr>
              <th class="w-check"><input type="checkbox" /></th>
              <th>
                <span class="th-label">Task <font-awesome-icon class="th-ico" icon="chevron-down" /></span>
              </th>
              <th>
                <span class="th-label">Patient <font-awesome-icon class="th-ico" icon="chevron-down" /></span>
              </th>
              <th>
                <span class="th-label">Due Date <font-awesome-icon class="th-ico" icon="chevron-down" /></span>
              </th>
              <th>
                <span class="th-label">Status <font-awesome-icon class="th-ico" icon="chevron-down" /></span>
              </th>
              <th>
                <span class="th-label">Actions <font-awesome-icon class="th-ico" icon="chevron-down" /></span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="t in filteredTasks" :key="t.id">
              <td class="w-check"><input type="checkbox" /></td>

                <td class="task-cell">
                <div class="task-row">
                    <!-- Completion checkbox -->
                    <label class="task-check">
                    <input type="checkbox" v-model="t.completed" />
                    <span></span>
                    </label>

                    <!-- Task text -->
                    <div class="task-text">
                    <div class="task-title" :class="{ done: t.completed }">
                        {{ t.title }}
                    </div>

                    <div class="task-meta">
                        <span
                        class="chip"
                        v-for="(c, idx) in t.chips"
                        :key="idx"
                        :class="chipClass(c)"
                        >
                        {{ c }}
                        </span>
                    </div>
                    </div>
                </div>
                </td>

              <td class="patient-cell">
                <div class="patient-name">{{ t.patient }}</div>
                <div class="subtle patient-sub">{{ t.patientType }}</div>
              </td>

              <td>{{ t.due }}</td>

              <td>
                <span class="pill" :class="pillClass(t.status)">{{ t.status }}</span>
              </td>

              <td class="actions-cell">
                <button class="btn-lite" type="button">Edit</button>
                <button class="btn-lite danger" type="button">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="table-footer">
          <div class="subtle">Showing 1 to 8 of 8 tasks</div>

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
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const query = ref("");
const type = ref("all");
const status = ref("all");
const date = ref("all");
const openDd = ref(null);

const tasks = ref([
  {
    id: 1,
    title: "Concentrate follow-up",
    completed: true,
    chips: ["Outpatient", "Follow-Up"],
    patient: "Cleo Anderson",
    patientType: "Outpatient",
    due: "Today – 1:00 PM",
    status: "Important",
  },
  {
    id: 2,
    title: "Assess condition and update notes",
    completed: true,
    chips: ["Inpatient"],
    patient: "Ethan Rivera",
    patientType: "Outpatient",
    due: "Today – 9:00 AM",
    status: "Important",
  },
  {
    id: 3,
    title: "Prescribe follow-up care",
    completed: true,
    chips: ["Inpatient"],
    patient: "Laura Williams",
    patientType: "Task",
    due: "Today – 9:00 AM",
    status: "Important",
  },
  {
    id: 4,
    title: "Review discharge summary",
    completed: false,
    chips: ["Outpatient"],
    patient: "Ethan Rivera",
    patientType: "Task",
    due: "Today – 1:00 AM",
    status: "Important",
  },
  {
    id: 5,
    title: "Review lab results",
    chips: ["Outpatient"],
    patient: "William Clark",
    patientType: "Discharge",
    due: "Tomorrow – 3:00 PM",
    status: "Important",
  },
  {
    id: 6,
    title: "Discharge summary review",
    chips: ["Inpatient", "Discharge Summary"],
    patient: "Olivia Harris",
    patientType: "Outpatient",
    due: "Today – 3:00 PM",
    status: "Critical",
  },
  {
    id: 7,
    title: "Follow up with patient",
    chips: ["Outpatient"],
    patient: "William Martinez",
    patientType: "Outpatient",
    due: "Discharge Summary",
    status: "Pending",
  },
  {
    id: 8,
    title: "Check vitals and update chart",
    chips: ["Inpatient", "Details"],
    patient: "Mark Johnson",
    patientType: "Outpatient",
    due: "Tomorrow – 2:00 PM",
    status: "Important",
  },
]);

const typeLabel = computed(() => {
  const map = { all: "All Tasks", clinical: "Clinical", paperwork: "Paperwork", "follow-up": "Follow-Up" };
  return map[type.value] || "All Tasks";
});
const statusLabel = computed(() => {
  const map = { all: "All Status", important: "Important", critical: "Critical", pending: "Pending", done: "Done" };
  return map[status.value] || "All Status";
});
const dateLabel = computed(() => {
  const map = { all: "All Dates", today: "Today", tomorrow: "Tomorrow", week: "This Week" };
  return map[date.value] || "All Dates";
});

function toggleDd(key) {
  openDd.value = openDd.value === key ? null : key;
}
function closeAll() {
  openDd.value = null;
}
function setType(v) { type.value = v; closeAll(); }
function setStatus(v) { status.value = v; closeAll(); }
function setDate(v) { date.value = v; closeAll(); }

onMounted(() => window.addEventListener("click", closeAll));
onBeforeUnmount(() => window.removeEventListener("click", closeAll));

const filteredTasks = computed(() => {
  const q = query.value.trim().toLowerCase();
  let list = tasks.value;

  if (q) {
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.patient.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }

  if (status.value !== "all") {
    list = list.filter((t) => t.status.toLowerCase() === status.value);
  }

  return list;
});

function pillClass(s) {
  const v = String(s || "").toLowerCase();
  if (v.includes("important")) return "pill-teal";
  if (v.includes("critical")) return "pill-orange";
  if (v.includes("pending")) return "pill-purple";
  if (v.includes("done")) return "pill-green";
  return "pill-muted";
}
function chipClass(label) {
  const v = String(label || "").toLowerCase();
  if (v.includes("outpatient")) return "chip-blue";
  if (v.includes("inpatient")) return "chip-gray";
  if (v.includes("follow")) return "chip-teal";
  if (v.includes("discharge")) return "chip-purple";
  return "chip-gray";
}

</script>

<style scoped>

/* Reuse the same base look as Patients */
.intern-tasks{ padding: 18px 18px 24px; }
.sep{ margin: 0 6px; opacity: .55; }

.dash-title h1{ margin:0; font-size: 30px; font-weight: 900; letter-spacing:-0.02em; }
.dash-title p{ margin: 6px 0 0; font-size: 14px; }

.kpi-row{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 12px 0 14px;
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
.kpi-left{ display:flex; flex-direction:column; gap: 6px; }
.kpi-label{ font-weight: 800; font-size: 14px; opacity: 0.96; }
.kpi-ico{ opacity: .9; font-size: 15px; }
.kpi-value{ font-weight: 900; font-size: 34px; line-height: 1; letter-spacing: -0.03em; }
.kpi-blue{ background: linear-gradient(135deg, #4f77ff, #2f56ff); }
.kpi-green{ background: linear-gradient(135deg, #23b5a8, #1a8e84); }
.kpi-red{ background: linear-gradient(135deg, #ff6c6c, #ff4a4a); }
.kpi-orange{ background: linear-gradient(135deg, #ffb35a, #ff8c3a); }

.card{
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  background: rgba(255,255,255,0.60);
  box-shadow: 0 10px 26px rgba(35, 55, 110, 0.12);
  overflow:hidden;
}
.glass{ backdrop-filter: blur(10px); }

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
.search-row{ position: relative; width: 240px; max-width: 44vw; }
.search{
  width:100%;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 12px 10px 38px;
  outline: none;
}
.search-ico{ position:absolute; left: 12px; top: 11px; opacity: .65; }

/* Custom dropdowns */
.filter-dd { position: relative; display: inline-flex; }
.filter-dd-btn{
  height: 40px; min-width: 150px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.60);
  font-size: 14px; font-weight: 800;
  color: rgba(30,40,70,0.95);
  display: inline-flex; align-items: center; justify-content: space-between; gap: 10px;
  cursor: pointer;
}
.filter-dd-menu{
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
.filter-dd-item{
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
.filter-dd-item:hover{ background: rgba(47,86,255,0.10); color: #2f56ff; }
.filter-dd-item.is-active{ background: rgba(47,86,255,0.16); color: #2f56ff; }

.btn-primary{
  border: 1px solid rgba(47,86,255,0.25);
  background: rgba(47,86,255,0.14);
  color: #2f56ff;
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  display:flex; align-items:center; gap: 8px;
  cursor:pointer;
}

/* Table */
.table-wrap{ padding: 0; }
.tasks-table{
  width:100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}
.w-check{ width:44px; }
.w-task{ width: 360px; }
.w-patient{ width: 220px; }
.w-due{ width: 170px; }
.w-status{ width: 150px; }
.w-actions{ width: 160px; }

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
.th-label{ display:inline-flex; align-items:center; gap: 8px; }
.th-ico{ opacity: .55; font-size: 12px; }

.task-cell{ min-width:0; }
.task-title{ font-weight: 900; }
.task-meta{ margin-top: 6px; display:flex; flex-wrap:wrap; gap: 6px; }

.chip{
  display:inline-flex;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.6);
}
.chip-blue{ background: rgba(47,86,255,0.14); color: #2f56ff; border-color: rgba(47,86,255,0.20); }
.chip-teal{ background: rgba(35,181,168,0.16); color: #17867d; border-color: rgba(35,181,168,0.22); }
.chip-purple{ background: rgba(136,97,255,0.16); color: #5a3cff; border-color: rgba(136,97,255,0.22); }
.chip-gray{ background: rgba(130,140,170,0.14); color: rgba(60,70,95,0.88); border-color: rgba(130,140,170,0.22); }

.patient-name{ font-weight: 900; }
.patient-sub{ margin-top: 2px; font-size: 12px; }

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
.pill-teal{ background: rgba(35,181,168,0.16); color: #17867d; border-color: rgba(35,181,168,0.22); }
.pill-green{ background: rgba(42,183,120,0.16); color: #1b8a57; border-color: rgba(42,183,120,0.22); }
.pill-orange{ background: rgba(255,153,59,0.18); color: #cc6f10; border-color: rgba(255,153,59,0.26); }
.pill-purple{ background: rgba(136,97,255,0.16); color: #5a3cff; border-color: rgba(136,97,255,0.22); }
.pill-muted{ background: rgba(130,140,170,0.14); color: rgba(60,70,95,0.88); border-color: rgba(130,140,170,0.22); }

.actions-cell{ display:flex; gap: 10px; }
.btn-lite{
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 10px;
  padding: 7px 10px;
  font-weight: 900;
  cursor:pointer;
}
.btn-lite.danger{ color: #d64545; }

.table-footer{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 14px;
}
.pager{ display:flex; align-items:center; gap: 6px; }
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
.select-wrap{ position: relative; display:inline-flex; align-items:center; }
.select{
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 10px;
  padding: 8px 32px 8px 10px;
  font-size: 12px;
  font-weight: 900;
  appearance: none;
}
.select-ico{ position:absolute; right: 10px; opacity: .65; pointer-events:none; }

/* === Task completion checkbox (2nd column) === */
.task-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.task-check {
  position: relative;
  flex: 0 0 auto;
}

.task-check input {
  display: none;
}

.task-check span {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 2px solid rgba(47,86,255,0.35);
  background: rgba(255,255,255,0.6);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Checkmark */
.task-check span::after {
  content: "✓";
  font-size: 12px;
  font-weight: 900;
  color: white;
  transform: scale(0);
  transition: transform 0.12s ease;
}

.task-check input:checked + span {
  background: linear-gradient(135deg, #4f77ff, #2f56ff);
  border-color: transparent;
}

.task-check input:checked + span::after {
  transform: scale(1);
}

/* Completed task style */
.task-title.done {
  text-decoration: line-through;
  opacity: 0.6;
}

/* Align text properly */
.task-text {
  min-width: 0;
}

@media (max-width: 1100px){
  .kpi-row{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px){
  .filters{ flex-direction: column; align-items: stretch; }
  .search-row{ width: 100%; max-width: unset; }
  .btn-primary{ width: 100%; justify-content: center; }
  .table-footer{ flex-direction: column; align-items: flex-start; }
}
@media (max-width: 640px){
  .kpi-row{ grid-template-columns: 1fr; }
}
</style>
