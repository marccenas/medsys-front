<template>
  <div class="nt">
    <!-- Header -->
    <div class="nt-head">
      <div>
        <h2 class="nt-title">Tasks</h2>
        <div class="nt-sub">
          <span class="nt-sub-strong">Task Overview</span>
          <span class="nt-sub-sep">›</span>
          <span>Manage and track assigned tasks.</span>
        </div>
      </div>
    </div>

    <!-- KPI Row -->
    <section class="nt-kpis">
      <div class="nt-kpi blue">
        <div class="nt-kpi-left">
          <div class="nt-kpi-label">Today's Tasks</div>
          <div class="nt-kpi-ico">
            <font-awesome-icon icon="clipboard-list" />
          </div>
        </div>
        <div class="nt-kpi-value">{{ kpiToday }}</div>
      </div>

      <div class="nt-kpi teal">
        <div class="nt-kpi-left">
          <div class="nt-kpi-label">Due Upcoming</div>
          <div class="nt-kpi-ico">
            <font-awesome-icon icon="clock" />
          </div>
        </div>
        <div class="nt-kpi-value">{{ kpiUpcoming }}</div>
      </div>

      <div class="nt-kpi orange">
        <div class="nt-kpi-left">
          <div class="nt-kpi-label">Overdue</div>
          <div class="nt-kpi-ico">
            <font-awesome-icon icon="bell" />
          </div>
        </div>
        <div class="nt-kpi-value">{{ kpiOverdue }}</div>
      </div>

      <div class="nt-kpi pink">
        <div class="nt-kpi-left">
          <div class="nt-kpi-label">Priority</div>
          <div class="nt-kpi-ico">
            <font-awesome-icon icon="heart" />
          </div>
        </div>
        <div class="nt-kpi-value">{{ kpiPriority }}</div>
      </div>
    </section>

    <!-- Panel -->
    <section class="nt-panel">
      <!-- Filters -->
      <div class="nt-filters">
        <div class="nt-search">
          <font-awesome-icon icon="magnifying-glass" />
          <input v-model="q" type="text" placeholder="Search..." />
        </div>

        <div class="nt-dd">
          <select v-model="taskFilter">
            <option value="all">All Tasks</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="eod">Due EOD</option>
          </select>
          <font-awesome-icon class="nt-dd-ico" icon="chevron-down" />
        </div>

        <div class="nt-dd">
          <select v-model="priorityFilter">
            <option value="all">All Priority</option>
            <option value="important">Important</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="routine">Routine</option>
          </select>
          <font-awesome-icon class="nt-dd-ico" icon="chevron-down" />
        </div>

        <div class="nt-dd">
          <select v-model="dateFilter">
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
          <font-awesome-icon class="nt-dd-ico" icon="chevron-down" />
        </div>

        <div class="nt-spacer"></div>

        <button class="nt-new" type="button" @click="newTask">
          <font-awesome-icon icon="plus" />
          New Task
        </button>
      </div>

      <!-- Table -->
      <div class="nt-table-wrap">
        <table class="nt-table">
          <colgroup>
            <!-- ✅ 1st checkbox col: selection -->
            <col style="width: 44px" />
            <!-- ✅ 2nd checkbox col: done -->
            <col style="width: 44px" />
            <col style="width: 420px" />
            <col style="width: 240px" />
            <col style="width: 170px" />
            <col style="width: 150px" />
            <col style="width: 170px" />
          </colgroup>

          <thead>
            <tr>
              <!-- Select-all column -->
              <th class="nt-th-check">
                <label class="nt-check">
                  <input
                    ref="selectAllRef"
                    type="checkbox"
                    :checked="isAllOnPageSelected"
                    @change="toggleAllOnPage"
                  />
                  <span></span>
                </label>
              </th>

              <!-- Done column header (blank like UI) -->
              <th class="nt-th-check"></th>

              <th>
                <button class="nt-th" type="button">
                  Task <font-awesome-icon icon="chevron-down" />
                </button>
              </th>

              <th>
                <button class="nt-th" type="button">
                  Patient <font-awesome-icon icon="chevron-down" />
                </button>
              </th>

              <th>
                <button class="nt-th" type="button">
                  Due Date <font-awesome-icon icon="chevron-down" />
                </button>
              </th>

              <th>
                <button class="nt-th" type="button">
                  Priority <font-awesome-icon icon="chevron-down" />
                </button>
              </th>

              <th class="nt-th-actions">
                <button class="nt-th" type="button">
                  Actions <font-awesome-icon icon="chevron-down" />
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in pagedRows" :key="row.id">
              <!-- 1) Select row checkbox -->
              <td class="nt-td-check">
                <label class="nt-check">
                  <input type="checkbox" :checked="selected.has(row.id)" @change="toggleRow(row.id)" />
                  <span></span>
                </label>
              </td>

              <!-- 2) Done checkbox -->
              <td class="nt-td-check">
                <label class="nt-check done-check">
                  <input type="checkbox" :checked="row.done" @change="toggleDone(row.id)" />
                  <span></span>
                </label>
              </td>

              <!-- Task -->
              <td>
                <div class="nt-taskcell" :class="{ done: row.done }">
                  <div class="nt-task-top">
                    <div class="nt-task-title">{{ row.title }}</div>
                    <span v-if="row.tag" class="nt-tag" :class="row.tagClass">{{ row.tag }}</span>
                  </div>
                  <div class="nt-task-sub">{{ row.subtitle }}</div>

                  <!-- scratch overlay (subtle) -->
                  <span v-if="row.done" class="nt-scratch" aria-hidden="true"></span>
                </div>
              </td>

              <!-- Patient -->
              <td>
                <div class="nt-patient" :class="{ done: row.done }">
                  <div class="nt-patient-name">{{ row.patient }}</div>
                  <div class="nt-patient-sub">{{ row.patientSub }}</div>
                </div>
              </td>

              <td class="nt-due" :class="{ done: row.done }">{{ row.due }}</td>

              <td>
                <span class="nt-pill" :class="[row.priorityClass, { done: row.done }]">
                  {{ row.priority }}
                </span>
              </td>

              <td class="nt-actions">
                <button class="nt-act" type="button" @click="editTask(row)">Edit</button>
                <button class="nt-act danger" type="button" @click="deleteTask(row)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="nt-footer">
        <div class="nt-foot-left">
          Showing {{ startRow }} to {{ endRow }} of {{ filteredRows.length }} tasks.
        </div>

        <div class="nt-pager">
          <button class="nt-pagebtn" type="button" :disabled="page === 1" @click="page--">
            <font-awesome-icon icon="angle-left" />
          </button>

          <button
            v-for="btn in pageButtons"
            :key="btn.key"
            class="nt-pagebtn"
            type="button"
            :class="{ active: btn.num === page, dots: btn.dots }"
            :disabled="btn.dots"
            @click="!btn.dots && (page = btn.num)"
          >
            {{ btn.label }}
          </button>

          <button class="nt-pagebtn" type="button" :disabled="page === pageCount" @click="page++">
            <font-awesome-icon icon="angle-right" />
          </button>
        </div>

        <div class="nt-foot-right">
          <div class="nt-dd small">
            <select v-model.number="pageSize">
              <option :value="10">10 / page</option>
              <option :value="12">12 / page</option>
              <option :value="15">15 / page</option>
            </select>
            <font-awesome-icon class="nt-dd-ico" icon="chevron-down" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from "vue";

/* filters */
const q = ref("");
const taskFilter = ref("all");
const priorityFilter = ref("all");
const dateFilter = ref("all");

/* paging */
const page = ref(1);
const pageSize = ref(10);

/* selection (1st checkbox column) */
const selected = ref(new Set());
const selectAllRef = ref(null);

/* rows */
const rows = ref([
  {
    id: 1,
    done: true,
    title: "Administer morning meds for Ethan Rivera",
    subtitle: "Ethan Rivera",
    patient: "Ethan Rivera",
    patientSub: "Medication",
    due: "Today - 8:00 AM",
    priority: "Important",
    priorityClass: "orange",
    tag: null,
    tagClass: "",
  },
  {
    id: 2,
    done: false,
    title: "Monitor: Cleo Anderson",
    subtitle: "Cecesann  •  Monitoring",
    patient: "ICU IR",
    patientSub: "",
    due: "Today",
    priority: "Important",
    priorityClass: "red",
    tag: "Monitoring",
    tagClass: "muted",
  },
  {
    id: 3,
    done: false,
    title: "Assist in wound dressing for Robert Lee",
    subtitle: "Dressing Change",
    patient: "Robert Lee",
    patientSub: "",
    due: "Today - 11:30 AM",
    priority: "Important",
    priorityClass: "orange",
    tag: null,
    tagClass: "",
  },
  {
    id: 4,
    done: false,
    title: "Check vital signs for Megan Richards",
    subtitle: "Vital Signs",
    patient: "Megan Richards",
    patientSub: "",
    due: "Today - 2:00 PM",
    priority: "Important",
    priorityClass: "teal",
    tag: null,
    tagClass: "",
  },
  {
    id: 5,
    done: false,
    title: "Draw blood samples for William Martinez",
    subtitle: "Lab Tests",
    patient: "William Martinez",
    patientSub: "",
    due: "Due EOD",
    priority: "Important",
    priorityClass: "orange",
    tag: null,
    tagClass: "",
  },
  {
    id: 6,
    done: false,
    title: "Prepare discharge paperwork for Olivia Harris",
    subtitle: "Discharge Summary",
    patient: "Olivia Harris",
    patientSub: "",
    due: "Due EOD",
    priority: "Tomorrow",
    priorityClass: "red",
    tag: "Summary",
    tagClass: "purple",
  },
  {
    id: 7,
    done: false,
    title: "Oxygen therapy for William Clark",
    subtitle: "Oxygen Therapy",
    patient: "William Clark",
    patientSub: "",
    due: "Tomorrow",
    priority: "Tomorrow",
    priorityClass: "teal",
    tag: null,
    tagClass: "",
  },
  {
    id: 8,
    done: false,
    title: "Administer blood pressure medication",
    subtitle: "Sagan Rivers",
    patient: "Laura Williams",
    patientSub: "",
    due: "Tomorrow - 10:00 AM",
    priority: "Important",
    priorityClass: "orange",
    tag: null,
    tagClass: "",
  },
  {
    id: 9,
    done: false,
    title: "Check blood sugar levels for John Morris",
    subtitle: "Blood Agent",
    patient: "John Morris",
    patientSub: "",
    due: "Tomorrow - EOD",
    priority: "Important",
    priorityClass: "orange",
    tag: null,
    tagClass: "",
  },
]);

/* KPI derived */
const kpiToday = computed(() => rows.value.filter((r) => r.due.toLowerCase().includes("today")).length);
const kpiUpcoming = computed(() =>
  rows.value.filter((r) => r.due.toLowerCase().includes("tomorrow") || r.due.toLowerCase().includes("eod")).length
);
const kpiOverdue = computed(() => rows.value.filter((r) => r.due.toLowerCase().includes("overdue")).length);
const kpiPriority = computed(() => rows.value.filter((r) => String(r.priority).toLowerCase() === "important").length);

/* filtering */
const filteredRows = computed(() => {
  const term = q.value.trim().toLowerCase();

  return rows.value.filter((r) => {
    const matchesSearch =
      !term ||
      r.title.toLowerCase().includes(term) ||
      r.subtitle.toLowerCase().includes(term) ||
      r.patient.toLowerCase().includes(term) ||
      r.due.toLowerCase().includes(term);

    const matchesTask =
      taskFilter.value === "all"
        ? true
        : taskFilter.value === "today"
        ? r.due.toLowerCase().includes("today")
        : taskFilter.value === "tomorrow"
        ? r.due.toLowerCase().includes("tomorrow")
        : taskFilter.value === "eod"
        ? r.due.toLowerCase().includes("eod")
        : true;

    const matchesPriority =
      priorityFilter.value === "all" ? true : String(r.priority).toLowerCase() === priorityFilter.value;

    // dateFilter is UI-only for now
    const matchesDate = dateFilter.value === "all" ? true : true;

    return matchesSearch && matchesTask && matchesPriority && matchesDate;
  });
});

const pageCount = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)));

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredRows.value.slice(start, start + pageSize.value);
});

const startRow = computed(() => (filteredRows.value.length ? (page.value - 1) * pageSize.value + 1 : 0));
const endRow = computed(() => Math.min(page.value * pageSize.value, filteredRows.value.length));

watch([q, taskFilter, priorityFilter, dateFilter, pageSize], () => {
  page.value = 1;
  selected.value = new Set();
});

/* checkbox helpers (1st col) */
const isAllOnPageSelected = computed(() => {
  const ids = pagedRows.value.map((r) => r.id);
  return ids.length > 0 && ids.every((id) => selected.value.has(id));
});

const isSomeOnPageSelected = computed(() => {
  const ids = pagedRows.value.map((r) => r.id);
  const any = ids.some((id) => selected.value.has(id));
  return any && !isAllOnPageSelected.value;
});

watchEffect(() => {
  if (selectAllRef.value) selectAllRef.value.indeterminate = isSomeOnPageSelected.value;
});

function toggleAllOnPage() {
  const ids = pagedRows.value.map((r) => r.id);
  const next = new Set(selected.value);

  if (ids.every((id) => next.has(id))) ids.forEach((id) => next.delete(id));
  else ids.forEach((id) => next.add(id));

  selected.value = next;
}

function toggleRow(id) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
}

/* ✅ 2nd checkbox col (done) */
function toggleDone(id) {
  rows.value = rows.value.map((r) => (r.id === id ? { ...r, done: !r.done } : r));
}

function newTask() {
  window.alert("New Task (UI only)");
}
function editTask(row) {
  window.alert(`Edit: ${row.title} (UI only)`);
}
function deleteTask(row) {
  window.alert(`Delete: ${row.title} (UI only)`);
}

/* pager buttons */
const pageButtons = computed(() => {
  const total = pageCount.value;

  if (total <= 4) {
    return Array.from({ length: total }, (_, i) => ({
      key: `p-${i + 1}`,
      num: i + 1,
      label: String(i + 1),
      dots: false,
    }));
  }

  return [
    { key: "p-1", num: 1, label: "1", dots: false },
    { key: "p-2", num: 2, label: "2", dots: false },
    { key: "p-3", num: 3, label: "3", dots: false },
    { key: "dots", dots: true, label: "…" },
    { key: `p-last`, num: total, label: String(total), dots: false },
  ];
});
</script>

<style scoped>
.nt{ display:grid; gap:18px; min-width:0; }

/* header */
.nt-title{ margin:0; font-size:28px; font-weight:900; color:#2a3550; }
.nt-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.nt-sub-strong{ color:#2a3550; }
.nt-sub-sep{ opacity:.6; }

/* kpis */
.nt-kpis{ display:grid; grid-template-columns:repeat(4, minmax(240px, 1fr)); gap:16px; }
.nt-kpi{
  border-radius:12px; padding:14px 16px; color:#fff; display:flex; justify-content:space-between; align-items:center;
  box-shadow:0 14px 26px rgba(34,50,74,0.14); border:1px solid rgba(255,255,255,0.25); min-width:0;
}
.nt-kpi-left{ min-width:0; }
.nt-kpi-label{ font-weight:900; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.nt-kpi-ico{ margin-top:6px; opacity:.95; }
.nt-kpi-value{ font-size:42px; font-weight:900; line-height:1; }
.nt-kpi.blue{ background:linear-gradient(90deg,#356ee6,#5c8cf5); }
.nt-kpi.teal{ background:linear-gradient(90deg,#2f9aa2,#4fc1cb); }
.nt-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.nt-kpi.pink{ background:linear-gradient(90deg,#ff4d6d,#ff7d87); }

/* panel */
.nt-panel{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
}

/* filters */
.nt-filters{ padding:14px 16px; display:flex; gap:12px; align-items:center; border-bottom:1px solid rgba(226,232,244,0.75); }
.nt-search{
  flex:1 1 320px; min-width:240px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 12px;
  display:flex; gap:10px; align-items:center;
  color:#7486a6;
}
.nt-search input{ width:100%; border:0; outline:0; background:transparent; font-weight:800; color:#2a3550; }

.nt-dd{ position:relative; min-width:150px; }
.nt-dd.small{ min-width:120px; }
.nt-dd select{
  width:100%; appearance:none;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 38px 10px 12px;
  font-weight:900; color:#425574; outline:none;
}
.nt-dd-ico{ position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#7a8aa7; pointer-events:none; }
.nt-spacer{ flex:1 1 auto; }

.nt-new{
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 14px;
  font-weight:900; color:#425574;
  cursor:pointer;
  display:flex; align-items:center; gap:10px;
}
.nt-new:hover{ background:rgba(255,255,255,0.75); }

/* table */
.nt-table-wrap{ overflow:auto; }
.nt-table{ width:100%; border-collapse:collapse; table-layout:fixed; }
thead th{
  padding:12px; font-size:12px; color:#6b7a90; font-weight:900; text-align:left;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.nt-th{ border:0; background:transparent; padding:0; color:inherit; font:inherit; font-weight:900; display:flex; gap:8px; align-items:center; cursor:pointer; }
.nt-th-actions{ text-align:right; }

tbody td{ padding:14px 12px; border-bottom:1px solid rgba(226,232,244,0.55); font-size:13px; color:#2a3550; }
tbody tr:hover{ background:rgba(255,255,255,0.30); }
.nt-th-check, .nt-td-check{ padding-left:16px; }

/* checkbox ui */
.nt-check{ display:grid; place-items:center; }
.nt-check input{ display:none; }
.nt-check span{
  width:18px; height:18px;
  border-radius:6px;
  border:2px solid rgba(140,155,185,0.7);
  background:rgba(255,255,255,0.75);
  position:relative;
  display:grid;
  place-items:center;
}
.nt-check input:checked + span{
  background:rgba(45,118,214,0.18);
  border-color:rgba(45,118,214,0.55);
  box-shadow:0 0 0 4px rgba(45,118,214,0.10);
}
.nt-check input:checked + span::after{
  content:"";
  width:8px;
  height:4px;
  border-left:3px solid #1e5fb7;
  border-bottom:3px solid #1e5fb7;
  transform:rotate(-45deg);
}

/* ✅ 2nd checkbox column style can be slightly “stronger” */
.done-check span{
  border-color: rgba(115,135,175,0.75);
}
.done-check input:checked + span{
  background: rgba(60,120,235,0.22);
  border-color: rgba(45,118,214,0.75);
}

/* task cell + scratch */
.nt-taskcell{ position:relative; min-width:0; }
.nt-task-top{ display:flex; align-items:center; gap:10px; min-width:0; }
.nt-task-title{ font-weight:900; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.nt-task-sub{ margin-top:6px; font-size:12px; color:#7a8aa7; font-weight:800; }

.nt-taskcell.done .nt-task-title,
.nt-taskcell.done .nt-task-sub{
  text-decoration: line-through;
  text-decoration-thickness: 2px;
  text-decoration-color: rgba(35,55,95,0.55);
  opacity: .78;
}

/* subtle “scribble scratch” overlay */
.nt-scratch{
  position:absolute;
  left:-2px;
  right:10px;
  top:10px;
  height:28px;
  pointer-events:none;
  opacity:.22;
  background:
    repeating-linear-gradient(
      -12deg,
      rgba(35,55,95,0.0) 0px,
      rgba(35,55,95,0.0) 6px,
      rgba(35,55,95,0.45) 7px,
      rgba(35,55,95,0.45) 8px
    );
  filter: blur(0.2px);
  border-radius: 10px;
}

/* tags and pills */
.nt-tag{
  padding:5px 10px;
  border-radius:10px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(230,232,240,0.7);
  color:#51607a;
}
.nt-tag.muted{ background:rgba(230,232,240,0.7); }
.nt-tag.purple{ background:rgba(203,196,255,0.55); color:#3a2f8f; }

.nt-pill{
  padding:6px 10px;
  border-radius:10px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  display:inline-flex;
}
.nt-pill.orange{ background:rgba(255,170,85,0.55); color:#7a3a10; }
.nt-pill.red{ background:rgba(255,120,120,0.35); color:#7b1f1f; }
.nt-pill.teal{ background:rgba(100,190,200,0.35); color:#1f5a63; }
.nt-pill.done{ opacity:.75; }

/* patient cell */
.nt-patient-name{ font-weight:900; color:#4b5f80; }
.nt-patient-sub{ margin-top:6px; font-size:12px; color:#7a8aa7; font-weight:800; }
.nt-patient.done{ opacity:.8; }
.nt-due{ font-weight:900; color:#4b5f80; }
.nt-due.done{ opacity:.8; }

/* actions */
.nt-actions{ text-align:right; display:flex; justify-content:flex-end; gap:10px; }
.nt-act{
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:10px;
  padding:8px 12px;
  font-weight:900;
  color:#2d76d6;
  cursor:pointer;
}
.nt-act:hover{ background:rgba(255,255,255,0.75); }
.nt-act.danger{ color:#d61f3c; }

/* footer */
.nt-footer{ padding:12px 16px; display:flex; align-items:center; gap:14px; }
.nt-foot-left{ color:#6b7a90; font-weight:800; font-size:12px; }
.nt-pager{ margin-left:auto; display:flex; gap:8px; align-items:center; }
.nt-pagebtn{
  min-width:34px; height:30px;
  border-radius:8px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  font-weight:900;
  color:#425574;
  cursor:pointer;
}
.nt-pagebtn.active{ background:rgba(45,118,214,0.18); border-color:rgba(45,118,214,0.35); color:#1e5fb7; }
.nt-pagebtn.dots{ cursor:default; }
.nt-pagebtn:disabled{ opacity:.5; cursor:not-allowed; }

/* responsive */
@media (max-width: 1400px){ .nt-kpis{ grid-template-columns:repeat(2,1fr); } }
@media (max-width: 980px){
  .nt-filters{ flex-wrap:wrap; }
  .nt-spacer{ display:none; }
  .nt-new{ width:100%; justify-content:center; }
}
@media (max-width: 820px){
  .nt-kpis{ grid-template-columns:1fr; }
  .nt-title{ font-size:24px; }
}
</style>
