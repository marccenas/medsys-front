<template>
  <div class="container-center">
    <div class="card page">
      <div class="header">
        <div class="logo-mark"></div>
        <div>
          <div style="font-weight:900; color: var(--blue);">MedSystem</div>
          <div class="subtle" style="font-size:12px;">Ultra Admin Dashboard (Frontend Only)</div>
        </div>

        <div style="margin-left:auto; display:flex; gap:10px;">
          <button
            type="button"
            class="btn"
            style="width:auto; padding:10px 14px; font-size:14px;"
            @click="router.push('/roles')"
          >
            Back to Roles
          </button>

          <button
            type="button"
            class="btn"
            style="width:auto; padding:10px 14px; font-size:14px;"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>

      <div style="padding: 22px;">
        <h1 class="h1">Ultra Admin</h1>
        <p class="subtle" style="margin-top:6px;">
          This is a placeholder dashboard. When you send the Ultra Admin UI design for the dashboard,
          we’ll build it section-by-section.
        </p>

        <div style="margin-top:18px; display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px;">
          <div class="card" style="padding:14px;">
            <div style="font-weight:800;">Users</div>
            <div class="subtle" style="margin-top:6px;">Manage staff accounts (UI only)</div>
          </div>
          <div class="card" style="padding:14px;">
            <div style="font-weight:800;">Roles & Permissions</div>
            <div class="subtle" style="margin-top:6px;">Assign system access (UI only)</div>
          </div>
          <div class="card" style="padding:14px;">
            <div style="font-weight:800;">Audit Logs</div>
            <div class="subtle" style="margin-top:6px;">Track activity (UI only)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

import DoughnutChart from "../../components/charts/DoughnutChart.vue";
import BarChart from "../../components/charts/BarChart.vue";

function alert(msg){ window.alert(msg); }

const statusLabels = ["Admin", "Doctors", "Nurses", "Lab", "Tech"];
const statusValues = [4, 6, 12, 5, 3];

const staffLabels = ["Doctors", "Nurses", "Technicians"];
const staffValues = [20, 35, 15];

function logout() {
  localStorage.removeItem("medsystem_logged_in");
  localStorage.removeItem("medsystem_role");
  router.push("/login");
}
</script>
