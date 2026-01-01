<template>
  <div class="ua-page">
    <div class="ua-welcome">
      <div>
        <div class="ua-subtle">Dashboard</div>
        <div class="ua-h1">Welcome, Admin</div>
      </div>
      <button class="btn" style="width:auto; padding:10px 14px; font-size:14px;" @click="window.alert('Add Department (UI only)')">
        <font-awesome-icon icon="plus" /> New Department
      </button>
    </div>

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
        <div class="kpi-value">1,098 <span class="ua-subtle" style="font-size:12px;">this month</span></div>
        <div class="kpi-ico"><font-awesome-icon icon="calendar-check" /></div>
      </div>
    </div>

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

    <div class="ua-panels">
      <div class="panel">
        <div class="panel-title">Recent Activities</div>
        <div class="panel-body">
          <ul class="list">
            <li>Added new department: Cardiology</li>
            <li>Created account for Nurse Unit Manager</li>
            <li>Updated billing settings</li>
          </ul>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">Task List</div>
        <div class="panel-body">
          <ul class="list">
            <li>Review pending tasks (UI)</li>
            <li>Approve staff accounts (UI)</li>
            <li>Check department workload (UI)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DoughnutChart from "../../components/charts/DoughnutChart.vue";
import BarChart from "../../components/charts/BarChart.vue";

const statusLabels = ["Admin", "Doctors", "Nurses", "Lab", "Tech"];
const statusValues = [4, 6, 12, 5, 3];

const staffLabels = ["Doctors", "Nurses", "Technicians"];
const staffValues = [20, 35, 15];
function alert(msg){ window.alert(msg); }
</script>

<style scoped>
.chart-box{
  height: 240px;
}
.ua-page{ display:grid; gap: 12px; }
.ua-welcome{
  display:flex;
  align-items:center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255,255,255,0.7);
}
.ua-h1{ font-size: 24px; font-weight: 900; margin-top: 4px; }
.ua-subtle{ color: var(--muted); font-weight: 700; }

.ua-kpis{
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.kpi{
  position: relative;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  box-shadow: var(--shadow);
  padding: 14px 14px 14px;
  overflow: hidden;
}
.kpi-primary{
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color: white;
  border-color: rgba(255,255,255,0.18);
}
.kpi-label{ font-weight: 800; opacity: 0.9; }
.kpi-value{ font-size: 28px; font-weight: 900; margin-top: 6px; }
.kpi-ico{
  position:absolute;
  right: 12px;
  top: 12px;
  font-size: 18px;
  opacity: 0.9;
}
.ua-panels{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.panel{
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  box-shadow: var(--shadow);
}
.panel-title{
  padding: 12px 14px;
  font-weight: 900;
  border-bottom: 1px solid var(--line);
}
.panel-body{ padding: 14px; }
.chart-placeholder{
  height: 160px;
  border: 1px dashed var(--line);
  border-radius: 12px;
  display:grid;
  place-items:center;
  color: var(--muted);
  background: #fbfdff;
}
.list{ margin:0; padding-left: 18px; color: var(--muted); font-weight: 700; }
@media (max-width: 980px){
  .ua-kpis{ grid-template-columns: 1fr; }
  .ua-panels{ grid-template-columns: 1fr; }
}
</style>
