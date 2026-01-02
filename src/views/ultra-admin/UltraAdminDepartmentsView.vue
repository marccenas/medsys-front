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
  padding: 22px 22px 16px;
  background: #eef3fb;
  min-height: calc(100vh - 60px);
}

/* shared panel look (matches your other pages) */
.panel{
  background:#fff;
  border-radius: 10px;
  border: 1px solid rgba(45, 78, 140, .14);
  box-shadow: 0 16px 32px rgba(17, 36, 80, 0.10);
  overflow: hidden;
}
.panel-title{
  padding: 12px 14px;
  font-weight: 900;
  color:#1f2a44;
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.85));
  border-bottom: 1px solid rgba(45, 78, 140, .12);
}
.panel-body{
  padding: 12px 14px;
}

/* top row */
.row{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

/* search pill (patients/billing style) */
.search{
  flex: 1 1 320px;
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  background:#f6f8ff;
  border:1px solid rgba(45, 78, 140, .14);
  border-radius:10px;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}
.search input{
  width:100%;
  border:0;
  outline:0;
  background:transparent;
  font-size:14px;
  color:#2b3a5b;
  font-weight:600;
}

/* main CTA */
.btn{
  border:none;
  border-radius:8px;
  padding:10px 14px;
  font-weight:800;
  font-size:14px;
  display:inline-flex;
  align-items:center;
  gap:10px;
  cursor:pointer;
  box-shadow: 0 6px 18px rgba(17, 36, 80, 0.08);
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
  white-space: nowrap;
}

/* grid section */
.grid-2{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* table wrapper */
.table-wrap{
  overflow:auto;
  padding: 0;
}

/* table */
.tbl{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
  min-width: 720px;
}
.tbl thead th{
  background:#f3f6ff;
  font-size:13px;
  color:#43506b;
  font-weight:900;
  padding:14px 14px;
  border-bottom:1px solid rgba(45, 78, 140, .14);
  text-align:left;
  white-space: nowrap;
}
.tbl tbody td{
  padding:12px 14px;
  border-bottom:1px solid rgba(45, 78, 140, .10);
  font-weight:700;
  color:#2b3a5b;
  background:#fff;
}

/* remove any hover effects (explicitly) */
.tbl tbody tr:hover td{
  background:#fff;
}

.strong{
  font-weight:900;
  color:#1f2a44;
}

.badge{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width: 34px;
  padding: 5px 10px;
  border-radius: 8px;
  font-weight:900;
  background: rgba(45,118,214,0.12);
  color:#2f86ff;
  border: 1px solid rgba(45,118,214,0.20);
}

.chip{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight:900;
  font-size:12px;
  border:1px solid transparent;
}

.chip-green{
  background: rgba(44, 214, 175, .16);
  border-color: rgba(44, 214, 175, .30);
  color:#1b8f79;
}

.chip-orange{
  background: rgba(255, 153, 69, .18);
  border-color: rgba(255, 153, 69, .34);
  color:#b45309;
}

/* chart panel */
.chart-box{
  height: 260px;
  padding: 10px;
  background: linear-gradient(180deg, rgba(248,251,255,0.90), rgba(244,248,255,0.70));
  border: 1px solid rgba(45, 78, 140, .12);
  border-radius: 10px;
}

/* responsive */
@media (max-width: 1100px){
  .grid-2{
    grid-template-columns: 1fr;
  }
  .tbl{
    min-width: 680px;
  }
}

@media (max-width: 640px){
  .dept-page{
    padding: 16px 14px 14px;
  }
  .btn{
    width: 100%;
    justify-content:center;
  }
}

</style>
