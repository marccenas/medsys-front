import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RoleAccessView from "../views/RoleAccessView.vue";

import UltraAdminLayout from "../layouts/UltraAdminLayout.vue";
import UltraAdminDashboardView from "../views/ultra-admin/UltraAdminDashboardView.vue";
import UltraAdminDepartmentsView from "../views/ultra-admin/UltraAdminDepartmentsView.vue";
import UltraAdminAdminManagementView from "../views/ultra-admin/UltraAdminAdminManagementView.vue";
import UltraAdminStaffView from "../views/ultra-admin/UltraAdminStaffView.vue";
import Patients from "../views/ultra-admin/Patients.vue";
import AppointmentsView from "../views/ultra-admin/AppointmentsPage.vue";
import BillingView from "../views/ultra-admin/BillingPage.vue";
import ReportsView from "../views/ultra-admin/ReportsPage.vue";
import SettingsPage from "../views/ultra-admin/SettingsPage.vue";

import PhysicianLayout from "../layouts/PhysicianLayout.vue";
import PhysicianDashboardView from "../views/physician/DashboardPhysician.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "login", component: LoginView },
    { path: "/roles", name: "roles", component: RoleAccessView },

    /* ULTRA ADMIN */
    {
      path: "/dashboard/ultra-admin",
      component: UltraAdminLayout,
      children: [
        { path: "", redirect: "dashboard" },
        { path: "dashboard", name: "ua-dashboard", component: UltraAdminDashboardView },
        { path: "departments", name: "ua-departments", component: UltraAdminDepartmentsView },
        { path: "staff", name: "ua-staff", component: UltraAdminStaffView },
        { path: "patients", name: "ua-patients", component: Patients },
        { path: "appointments", name: "ua-appointments", component: AppointmentsView },
        { path: "billing", name: "ua-billing", component: BillingView },
        { path: "reports", name: "ua-reports", component: ReportsView },
        { path: "settings", name: "ua-settings", component: SettingsPage },
        { path: "admin-management", name: "ua-admin-management", component: UltraAdminAdminManagementView },
      ],
    },

    /* PHYSICIAN / ATTENDING */
    {
      path: "/dashboard/physician",
      component: PhysicianLayout,
      children: [
        { path: "", redirect: "dashboard" },
        { path: "dashboard", name: "physician-dashboard", component: PhysicianDashboardView },

        // keep these ONLY if the files exist (or you’ll get a lazy-import error when navigating)
        { path: "patients", name: "physician-patients", component: () => import("../views/physician/PatientsPhysician.vue") },
        { path: "appointments", name: "physician-appointments", component: () => import("../views/physician/AppointmentsPhysician.vue") },
        { path: "lab-results", name: "physician-lab-results", component: () => import("../views/physician/LabResultsPhysician.vue") },
        { path: "settings", name: "physician-settings", component: () => import("../views/physician/SettingsPhysician.vue") },
      ],
    },

    // optional: catch-all -> login (or a NotFound page)
    { path: "/:pathMatch(.*)*", redirect: "/login" },
  ],
});

export default router;
