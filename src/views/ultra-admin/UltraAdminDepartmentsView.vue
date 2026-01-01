<template>
  <div class="panel">
    <div class="panel-body" style="padding: 14px;">
      <div class="row">
        <div class="search">
          <font-awesome-icon icon="magnifying-glass" />
          <input v-model="q" placeholder="Search Departments..." />
        </div>

        <button class="btn" style="width:auto; padding:10px 14px; font-size:14px;" @click="addDepartment">
          Add New Department
        </button>
      </div>

      <div class="table-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>Departments</th>
              <th>Pending Tasks</th>
              <th># of Staff</th>
              <th># Patients</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="d in filtered" :key="d.name">
              <td class="strong">{{ d.name }}</td>
              <td>{{ d.pending }}</td>
              <td>{{ d.staff }}</td>
              <td>{{ d.patients }}</td>
              <td style="text-align:right;">
                <button class="chip" :class="chipClass(d.status)" @click="toggleStatus(d)">
                  {{ d.status }} <span style="margin-left:6px;">▾</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ua-subtle" style="margin-top:10px;">
        (UI only) Status button cycles: Active → None → Decide
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const q = ref("");

const departments = ref([
  { name: "Emergency", pending: 40, staff: 36, patients: 400, status: "Active" },
  { name: "Cardiology", pending: 76, staff: 25, patients: 323, status: "Active" },
  { name: "Neurology", pending: 58, staff: 17, patients: 123, status: "None" },
  { name: "Radiology", pending: 48, staff: 41, patients: 900, status: "Decide" },
]);

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase();
  if (!s) return departments.value;
  return departments.value.filter(d => d.name.toLowerCase().includes(s));
});

function addDepartment(){
  alert("Add New Department (UI only)");
}

function toggleStatus(dep){
  const order = ["Active", "None", "Decide"];
  const i = order.indexOf(dep.status);
  dep.status = order[(i + 1) % order.length];
}

function chipClass(status){
  if (status === "Active") return "chip-green";
  if (status === "Decide") return "chip-orange";
  return "chip-blue";
}
</script>

<style scoped>
.row{ display:flex; gap: 12px; align-items:center; justify-content: space-between; }
.search{
  flex: 1;
  display:flex;
  align-items:center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px 12px;
  background: #fbfdff;
}
.search input{
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
}
.table-wrap{ margin-top: 12px; overflow:auto; border:1px solid var(--line); border-radius: 12px; }
.tbl{ width:100%; border-collapse: collapse; min-width: 760px; }
th, td{ padding: 12px 12px; border-bottom: 1px solid var(--line); font-size: 14px; }
th{ text-align:left; color: var(--muted); font-weight: 900; background: rgba(245,248,255,0.8); }
.strong{ font-weight: 900; }

.chip{
  border: 0;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 900;
  cursor:pointer;
  color: white;
}
.chip-green{ background: #16a34a; }
.chip-blue{ background: #2563eb; }
.chip-orange{ background: #f97316; }

@media (max-width: 980px){
  .row{ flex-direction: column; align-items: stretch; }
}
</style>
