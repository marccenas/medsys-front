<template>
  <div class="dept-page">

    <!-- Top controls -->
    <div class="panel">
      <div class="panel-body row">
        <div class="search">
          <font-awesome-icon icon="magnifying-glass" />
          <input v-model="q" placeholder="Search Departments..." />
        </div>

        <button class="btn" style="width:auto" @click="addDepartment">
          <font-awesome-icon icon="plus" /> Add New Department
        </button>
      </div>
    </div>

    <!-- Departments Table -->
    <div class="panel">
      <div class="panel-title">Departments</div>
      <div class="panel-body table-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>Department</th>
              <th>Pending Tasks</th>
              <th># of Staff</th>
              <th># of Patients</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in filtered" :key="d.name">
              <td class="strong">{{ d.name }}</td>
              <td>{{ d.pending }}</td>
              <td>{{ d.staff }}</td>
              <td>{{ d.patients }}</td>
              <td>
                <span class="chip" :class="chipClass(d.status)">
                  {{ d.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bottom section -->
    <div class="grid-2">

      <!-- Staff Overview -->
      <div class="panel">
        <div class="panel-title">Staff Overview</div>
        <div class="panel-body table-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>Department</th>
                <th>Pending Tasks</th>
                <th># of Staff</th>
                <th># of Patients</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in staffOverview" :key="s.name">
                <td class="strong">{{ s.name }}</td>
                <td>
                  <span class="badge">{{ s.pending }}</span>
                </td>
                <td>{{ s.staff }}</td>
                <td>{{ s.patients }}</td>
                <td>
                  <span class="chip" :class="chipClass(s.status)">
                    {{ s.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Workload Breakdown -->
      <div class="panel">
        <div class="panel-title">Workload Breakdown</div>
        <div class="panel-body chart-box">
          <BarChart
            :labels="workloadLabels"
            :values="workloadValues"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import BarChart from "../../components/charts/BarChart.vue";

/* Search */
const q = ref("");

/* Departments */
const departments = ref([
  { name: "Emergency", pending: 96, staff: 36, patients: 480, status: "Active" },
  { name: "Cardiology", pending: 76, staff: 26, patients: 300, status: "Active" },
  { name: "Neurology", pending: 38, staff: 17, patients: 123, status: "Active" },
  { name: "Radiology", pending: 48, staff: 68, patients: 900, status: "Inactive" },
]);

/* Staff overview */
const staffOverview = ref([
  { name: "Emergency", pending: 91, staff: 546, patients: 480, status: "Active" },
  { name: "Cardiology", pending: 53, staff: 530, patients: 300, status: "Active" },
  { name: "Neurology", pending: 53, staff: 362, patients: 123, status: "Active" },
  { name: "Radiology", pending: 53, staff: 508, patients: 900, status: "Inactive" },
]);

/* Chart data */
const workloadLabels = ["Emergency", "Cardiology", "Neurology", "Radiology"];
const workloadValues = [480, 300, 123, 900];

/* Computed */
const filtered = computed(() => {
  if (!q.value) return departments.value;
  return departments.value.filter(d =>
    d.name.toLowerCase().includes(q.value.toLowerCase())
  );
});

/* Helpers */
function addDepartment() {
  window.alert("Add New Department (UI only)");
}

function chipClass(status) {
  return status === "Active" ? "chip-green" : "chip-orange";
}
</script>

<style scoped>
.dept-page{
  display: grid;
  gap: 14px;
}

.row{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
}

.search{
  flex:1;
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border:1px solid var(--line);
  border-radius:12px;
  background:#fbfdff;
}

.search input{
  width:100%;
  border:0;
  outline:0;
  background:transparent;
}

.grid-2{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.table-wrap{
  overflow:auto;
}

.tbl{
  width:100%;
  border-collapse: collapse;
}

th, td{
  padding:12px;
  border-bottom:1px solid var(--line);
  font-size:14px;
}

th{
  text-align:left;
  color: var(--muted);
  font-weight:900;
}

.strong{
  font-weight:900;
}

.badge{
  background: rgba(45,118,214,0.12);
  color: var(--blue);
  padding: 4px 8px;
  border-radius: 8px;
  font-weight:900;
}

.chip{
  padding: 6px 10px;
  border-radius: 999px;
  font-weight:900;
  font-size:12px;
}

.chip-green{
  background: rgba(34,197,94,0.15);
  color:#166534;
}

.chip-orange{
  background: rgba(249,115,22,0.15);
  color:#9a3412;
}

.chart-box{
  height: 260px;
  padding: 10px;
}

@media (max-width: 1100px){
  .grid-2{
    grid-template-columns: 1fr;
  }
}
</style>
