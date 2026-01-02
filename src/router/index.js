import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RoleAccessView from "../views/RoleAccessView.vue";

import UltraAdminLayout from "../layouts/UltraAdminLayout.vue";
import UltraAdminDashboardView from "../views/ultra-admin/UltraAdminDashboardView.vue";
import UltraAdminDepartmentsView from "../views/ultra-admin/UltraAdminDepartmentsView.vue";
import UltraAdminAdminManagementView from "../views/ultra-admin/UltraAdminAdminManagementView.vue";
import UltraAdminStaffView from "../views/ultra-admin/UltraAdminStaffView.vue";
import Patients from "../views/ultra-admin/Patients.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "login", component: LoginView },
    { path: "/roles", name: "roles", component: RoleAccessView },

    {
      path: "/dashboard/ultra-admin",
      component: UltraAdminLayout,
      children: [
        { path: "", redirect: "/dashboard/ultra-admin/dashboard" },
        { path: "dashboard", name: "ua-dashboard", component: UltraAdminDashboardView },
        { path: "departments", name: "ua-departments", component: UltraAdminDepartmentsView },
        { path: "staff", name: "ua-staff", component: UltraAdminStaffView },
        { path: "patients", name: "ua-patients", component: Patients },
        { path: "admin-management", name: "ua-admin-management", component: UltraAdminAdminManagementView },
      ],
    },
  ],
});

export default router;
