import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RoleAccessView from "../views/RoleAccessView.vue";

import UltraAdminLayout from "../layouts/UltraAdminLayout.vue";
import UltraAdminDashboardView from "../views/ultra-admin/UltraAdminDashboardView.vue";
import UltraAdminDepartmentsView from "../views/ultra-admin/UltraAdminDepartmentsView.vue";
import UltraAdminAdminManagementView from "../views/ultra-admin/UltraAdminAdminManagementView.vue";

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
        { path: "dashboard", component: UltraAdminDashboardView },
        { path: "departments", component: UltraAdminDepartmentsView },
        { path: "admin-management", component: UltraAdminAdminManagementView },
      ],
    },
  ],
});

export default router;
