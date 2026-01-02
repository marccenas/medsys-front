<template>
  <div class="ua-page">
    <!-- Welcome -->
    <div class="ua-welcome">
      <div>
        <div class="ua-subtle">Dashboard</div>
        <div class="ua-h1">Welcome, Admin</div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="ua-kpis">
      <div class="kpi kpi-primary">
        <div class="kpi-label">Total Users</div>
        <div class="kpi-value">58</div>
        <div class="kpi-ico"><font-awesome-icon icon="users" /></div>
      </div>

      <div class="kpi">
        <div class="kpi-label">Total Patients</div>
        <div class="kpi-value">2,450</div>
        <div class="kpi-ico"><font-awesome-icon icon="hospital-user" /></div>
      </div>

      <div class="kpi">
        <div class="kpi-label">Total Appointments</div>
        <div class="kpi-value">
          1,098 <span class="kpi-note">this month</span>
        </div>
        <div class="kpi-ico"><font-awesome-icon icon="calendar-check" /></div>
      </div>
    </div>

    <!-- Charts -->
    <div class="ua-panels">
      <div class="panel">
        <div class="panel-title">Status Overview</div>
        <div class="panel-body">
          <div class="chart-box">
            <DoughnutChart :labels="statusLabels" :values="statusValues" />
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">Staff Overview</div>
        <div class="panel-body">
          <div class="chart-box">
            <BarChart :labels="staffLabels" :values="staffValues" />
          </div>
        </div>
      </div>
    </div>

    <!-- Lists -->
    <div class="ua-panels">
      <!-- Recent Activities -->
      <div class="panel">
        <div class="panel-title row-title">
          <span>Recent Activities</span>
          <button class="mini-btn" type="button" @click="window.alert('View all activities (UI only)')">
            View all
          </button>
        </div>

        <div class="panel-body">
          <div class="list-wrap">
            <div class="activity" v-for="a in activities" :key="a.id">
              <div class="activity-ico" :class="a.color">
                <font-awesome-icon :icon="a.icon" />
              </div>

              <div class="activity-main">
                <div class="activity-line">
                  <span class="activity-title">{{ a.title }}</span>
                  <span class="tag" :class="a.tagClass">{{ a.tag }}</span>
                </div>

                <div class="activity-sub">
                  <span class="muted">{{ a.detail }}</span>
                </div>
              </div>

              <div class="activity-meta">
                <div class="time">{{ a.time }}</div>
                <div class="muted small">{{ a.by }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task List -->
      <div class="panel">
        <div class="panel-title row-title">
          <span>Task List</span>

          <div class="task-actions">
            <button class="mini-btn" type="button" @click="addDummyTask">
              <font-awesome-icon icon="plus" /> Add
            </button>
            <button class="mini-btn ghost" type="button" @click="clearDone">
              Clear done
            </button>
          </div>
        </div>

        <div class="panel-body">
          <!-- Controls -->
          <div class="task-controls">
            <div class="task-search">
              <font-awesome-icon icon="magnifying-glass" />
              <input v-model.trim="taskQuery" placeholder="Search tasks..." />
            </div>

            <div class="task-dd">
              <label class="muted small">Filter</label>
              <select v-model="taskFilter" class="select">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div class="task-dd">
              <label class="muted small">Priority</label>
              <select v-model="prioritySort" class="select">
                <option value="none">None</option>
                <option value="high">High → Low</option>
                <option value="low">Low → High</option>
              </select>
            </div>
          </div>

          <!-- List -->
          <div class="list-wrap">
            <label class="task" v-for="t in visibleTasks" :key="t.id">
              <input type="checkbox" v-model="t.done" />

              <div class="task-main">
                <div class="task-top">
                  <span class="task-title" :class="{ done: t.done }">{{ t.title }}</span>
                  <span class="prio" :class="t.prioClass">{{ t.priority }}</span>
                </div>

                <div class="task-sub">
                  <span class="muted">{{ t.detail }}</span>
                </div>
              </div>

              <div class="task-meta">
                <div class="due">
                  <font-awesome-icon icon="calendar-check" />
                  <span>{{ t.due }}</span>
                </div>
              </div>
            </label>

            <div v-if="visibleTasks.length === 0" class="empty">
              No tasks found.
            </div>
          </div>

          <!-- Footer -->
          <div class="task-footer">
            <div class="muted small">
              {{ doneCount }} of {{ tasks.length }} completed
            </div>
            <div class="progress">
              <div class="progress-bar" :style="{ width: progressPct + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import DoughnutChart from "../../components/charts/DoughnutChart.vue";
import BarChart from "../../components/charts/BarChart.vue";

import { computed, reactive, ref } from "vue";

const statusLabels = ["Admin", "Doctors", "Nurses", "Lab", "Tech"];
const statusValues = [4, 6, 12, 5, 3];

const staffLabels = ["Doctors", "Nurses", "Technicians"];
const staffValues = [20, 35, 15];

const taskFilter = ref("all");
const taskQuery = ref("");
const prioritySort = ref("none");

const activities = reactive([
  { id: 1, icon: "building", color: "bg-blue", title: "New department added", detail: "Cardiology added under Management & Physicians", tag: "Department", tagClass: "tag-blue", time: "2 mins ago", by: "by Ultra Admin" },
  { id: 2, icon: "user-gear", color: "bg-green", title: "Account created", detail: "Nurse Unit Manager account created and role assigned", tag: "Account", tagClass: "tag-green", time: "14 mins ago", by: "by John Evans" },
  { id: 3, icon: "money-bill-wave", color: "bg-orange", title: "Billing settings updated", detail: "Insurance provider mapping updated (UI only)", tag: "Billing", tagClass: "tag-orange", time: "1 hour ago", by: "by Finance Staff" },
  { id: 4, icon: "chart-column", color: "bg-purple", title: "Report exported", detail: "Monthly utilization report exported (UI only)", tag: "Reports", tagClass: "tag-purple", time: "Yesterday", by: "by System" },
  { id: 5, icon: "shield-halved", color: "bg-red", title: "Permission change logged", detail: "Role permission updated: Residents → limited access (UI only)", tag: "Security", tagClass: "tag-red", time: "2 days ago", by: "by Ultra Admin" },
]);

const tasks = reactive([
  { id: 1, title: "Review pending department tasks", detail: "Emergency & Radiology have pending tasks that require approval.", priority: "High", prioClass: "prio-high", due: "Today", done: false },
  { id: 2, title: "Approve new staff accounts", detail: "3 new staff accounts awaiting verification (UI only).", priority: "Medium", prioClass: "prio-med", due: "Tomorrow", done: false },
  { id: 3, title: "Verify appointment schedule sync", detail: "Check department schedule conflicts for next week.", priority: "Low", prioClass: "prio-low", due: "This week", done: true },
  { id: 4, title: "Audit role permissions", detail: "Confirm Ultra Admin & Admin Management permissions are correct.", priority: "Medium", prioClass: "prio-med", due: "This week", done: false },
  { id: 5, title: "Review billing exceptions", detail: "Resolve billing exceptions for 5 patient records (UI only).", priority: "High", prioClass: "prio-high", due: "Friday", done: false },
]);

const doneCount = computed(() => tasks.filter((t) => t.done).length);
const progressPct = computed(() => (tasks.length ? (doneCount.value / tasks.length) * 100 : 0));

function addDummyTask() {
  tasks.unshift({
    id: Date.now(),
    title: "New task (UI only)",
    detail: "This is a dummy task added on the frontend.",
    priority: "Low",
    prioClass: "prio-low",
    due: "Next week",
    done: false,
  });
}

function clearDone() {
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].done) tasks.splice(i, 1);
  }
}

function prioWeight(p) {
  if (p === "High") return 3;
  if (p === "Medium") return 2;
  return 1;
}

const visibleTasks = computed(() => {
  const q = taskQuery.value.trim().toLowerCase();

  let arr = tasks.filter((t) => {
    if (taskFilter.value === "pending" && t.done) return false;
    if (taskFilter.value === "done" && !t.done) return false;

    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.detail.toLowerCase().includes(q) ||
      t.priority.toLowerCase().includes(q) ||
      t.due.toLowerCase().includes(q)
    );
  });

  if (prioritySort.value !== "none") {
    arr = [...arr].sort((a, b) => {
      const wa = prioWeight(a.priority);
      const wb = prioWeight(b.priority);
      return prioritySort.value === "high" ? wb - wa : wa - wb;
    });
  }

  return arr;
});
</script>

<style scoped>
/* Layout */
.ua-page{ display:grid; gap: 12px; }

/* Welcome */
.ua-welcome{
  display:flex;
  align-items:center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid rgba(203,213,225,0.7);
  border-radius: 14px;
  background: rgba(255,255,255,0.72);
  box-shadow: 0 12px 26px rgba(15,23,42,0.08);
}
.ua-h1{ font-size: 24px; font-weight: 900; margin-top: 4px; }
.ua-subtle{ color: #64748b; font-weight: 800; }

/* KPI */
.ua-kpis{
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.kpi{
  position: relative;
  border: 1px solid rgba(203,213,225,0.7);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 12px 26px rgba(15,23,42,0.08);
  padding: 14px;
  overflow: hidden;
}
.kpi-primary{
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color: #fff;
  border-color: rgba(255,255,255,0.18);
}
.kpi-label{ font-weight: 800; opacity: 0.92; }
.kpi-value{ font-size: 28px; font-weight: 900; margin-top: 6px; }
.kpi-note{ font-size: 12px; font-weight: 800; opacity: .85; margin-left: 6px; }
.kpi-ico{
  position:absolute;
  right: 12px;
  top: 12px;
  font-size: 18px;
  opacity: 0.92;
}

/* Panels */
.ua-panels{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.panel{
  border: 1px solid rgba(203,213,225,0.7);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 12px 26px rgba(15,23,42,0.08);
  display:flex;
  flex-direction: column;
  min-height: 0;
}
.panel-title{
  padding: 12px 14px;
  font-weight: 900;
  color:#1f2a44;
  border-bottom: 1px solid rgba(203,213,225,0.55);
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.85));
}
.panel-body{
  padding: 14px;
  display:flex;
  flex-direction: column;
  min-height: 0;
}

/* Row header */
.row-title{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
}

/* Buttons (no hover effects) */
.mini-btn{
  border: 1px solid rgba(226,232,244,0.95);
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,249,255,0.8));
  border-radius: 10px;
  padding: 8px 10px;
  font-weight: 900;
  cursor:pointer;
  color: #0f172a;
  box-shadow: 0 10px 18px rgba(34,50,74,0.08);
}
.mini-btn.ghost{ background: transparent; box-shadow: none; }

.task-actions{ display:flex; gap: 8px; align-items:center; }

/* Scroll list container */
.list-wrap{
  display:grid;
  gap: 10px;
  overflow:auto;
  padding-right: 6px;
  min-height: 0;
}

/* Activities */
.activity{
  display:grid;
  grid-template-columns: 44px 1fr auto;
  gap: 12px;
  align-items:center;
  border: 1px solid rgba(226,232,244,0.95);
  border-radius: 12px;
  padding: 10px 12px;
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(244,248,255,0.72));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
}
.activity-ico{
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display:grid;
  place-items:center;
  color: #fff;
  box-shadow: 0 12px 20px rgba(34,50,74,0.12);
}
.bg-blue{ background: linear-gradient(180deg, #2d76d6, #1e5fb7); }
.bg-green{ background: linear-gradient(180deg, #22c55e, #16a34a); }
.bg-orange{ background: linear-gradient(180deg, #f59e0b, #f97316); }
.bg-purple{ background: linear-gradient(180deg, #8b5cf6, #6d28d9); }
.bg-red{ background: linear-gradient(180deg, #ef4444, #dc2626); }

.activity-line{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
}
.activity-title{ font-weight: 900; color:#0f172a; }
.activity-sub{ margin-top: 2px; }
.activity-meta{ text-align:right; }
.time{ font-weight: 900; font-size: 12px; color:#0f172a; }
.small{ font-size: 12px; }
.muted{ color:#64748b; font-weight: 800; }

/* Tags */
.tag{
  font-size: 11px;
  font-weight: 900;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(226,232,244,0.95);
}
.tag-blue{ background: rgba(45,118,214,0.12); color: #1e5fb7; }
.tag-green{ background: rgba(34,197,94,0.12); color: #16a34a; }
.tag-orange{ background: rgba(245,158,11,0.14); color: #c2410c; }
.tag-purple{ background: rgba(139,92,246,0.14); color: #6d28d9; }
.tag-red{ background: rgba(239,68,68,0.14); color: #b91c1c; }

/* Task controls */
.task-controls{
  display:grid;
  grid-template-columns: 1fr 160px 180px;
  gap: 10px;
  align-items:end;
  margin-bottom: 10px;
}
.task-search{
  display:flex;
  align-items:center;
  gap: 10px;
  border: 1px solid rgba(226,232,244,0.95);
  border-radius: 12px;
  padding: 10px 12px;
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(244,248,255,0.72));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
}
.task-search input{
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
}

.task-dd{ display:grid; gap: 6px; }
.select{
  width: 100%;
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(226,232,244,0.95);
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,249,255,0.8));
  font-weight: 800;
  outline: none;
}

/* Tasks */
.task{
  display:grid;
  grid-template-columns: 22px 1fr auto;
  gap: 10px;
  align-items:center;
  border: 1px solid rgba(226,232,244,0.95);
  border-radius: 12px;
  padding: 10px 12px;
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(244,248,255,0.72));
}
.task input{ transform: translateY(1px); }
.task-top{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
}
.task-title{ font-weight: 900; color:#0f172a; }
.task-title.done{ text-decoration: line-through; opacity: 0.6; }

.prio{
  font-size: 11px;
  font-weight: 900;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(226,232,244,0.95);
}
.prio-high{ background: rgba(239,68,68,0.14); color: #b91c1c; }
.prio-med{ background: rgba(245,158,11,0.14); color: #c2410c; }
.prio-low{ background: rgba(34,197,94,0.12); color: #166534; }

.task-meta .due{
  display:flex;
  align-items:center;
  gap: 8px;
  font-weight: 900;
  color:#64748b;
  font-size: 12px;
}

/* Footer / progress */
.task-footer{
  margin-top: 12px;
  display:grid;
  gap: 8px;
}
.progress{
  height: 10px;
  border-radius: 999px;
  background: rgba(226,232,244,0.95);
  overflow:hidden;
}
.progress-bar{
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2d76d6, #22c55e);
}

/* Empty */
.empty{
  text-align:center;
  color:#64748b;
  font-weight: 800;
  padding: 18px 10px;
  border: 1px dashed rgba(226,232,244,0.95);
  border-radius: 12px;
  background: rgba(248,251,255,0.7);
}

/* Chart box */
.chart-box{
  height: 240px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(248,251,255,0.9), rgba(244,248,255,0.7));
  border: 1px solid rgba(226,232,244,0.95);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 18px rgba(34,50,74,0.08);
  padding: 10px;
}

/* Scrollbar (no hover) */
.list-wrap::-webkit-scrollbar{ width: 8px; }
.list-wrap::-webkit-scrollbar-thumb{
  background: rgba(34,50,74,0.25);
  border-radius: 999px;
}
.list-wrap::-webkit-scrollbar-track{ background: transparent; }

/* Responsive */
@media (max-width: 980px){
  .ua-kpis{ grid-template-columns: 1fr; }
  .ua-panels{ grid-template-columns: 1fr; }
  .task-controls{ grid-template-columns: 1fr; }
}
</style>
