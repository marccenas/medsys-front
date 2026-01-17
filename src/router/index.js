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
import InternsLayout from "../layouts/InternSidebar.vue";
import DashboardIntern from "@/views/interns/DashboardIntern.vue";
import InternsPatientPage from "@/views/interns/PatientsIntern.vue"
import TaskIntern from "@/views/interns/TasksIntern.vue"

import NurseLayout from "../layouts/NurseLayout.vue";
import HeadNurseLayout from "../layouts/HeadNurseSideNav.vue";

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
    {
    path: "/dashboard/intern",
    component: InternsLayout,
    children: [
      { path: "dashboard", name: "intern-dashboard", component: DashboardIntern },
      { path: "patients", name: "patients-page", component: InternsPatientPage },
      { path: "tasks", name: "tasks-page", component: TaskIntern },
      { path: "schedule", name: "intern-schedule", component: () => import("@/views/interns/ScheduleIntern.vue") },
      { path: "learning", name: "intern-learning", component: () => import("@/views/interns/LearningIntern.vue") }
    ],
  },
{
  path: "/dashboard/nurse",
  component: NurseLayout,
  children: [
    { path: "", redirect: "dashboard" },
    { path: "dashboard", name: "nurse-dashboard", component: () => import("@/views/nurse/NurseDashboard.vue") },
    { path: "patients", name: "nurse-patients", component: () => import("@/views/nurse/NursePatients.vue") },
    { path: "tasks", name: "nurse-tasks", component: () => import("@/views/nurse/NurseTasks.vue") },
    { path: "schedule", name: "nurse-schedule", component: () => import("@/views/nurse/NurseSchedule.vue") },
    { path: "learning", name: "nurse-learning", component: () => import("@/views/nurse/NurseLearning.vue") },
  ],
},

{
  path: "/dashboard/head-nurse",
  component: HeadNurseLayout,
  children: [
    { path: "", redirect: "dashboard" },
    { path: "dashboard", name: "headnurse-dashboard", component: () => import("@/views/head-nurse/HeadNurseDashboard.vue") },
    { path: "patients", name: "headnurse-patients", component: () => import("@/views/head-nurse/HeadNursePatients.vue") },
    { path: "staff", name: "headnurse-staff", component: () => import("@/views/head-nurse/HeadNurseStaff.vue") },
    { path: "reports", name: "headnurse-reports", component: () => import("@/views/head-nurse/HeadNurseReports.vue") },
    { path: "supplies", name: "headnurse-supplies", component: () => import("@/views/head-nurse/HeadNurseSupplies.vue") },
  ],
},

{
  path: "/dashboard/np-pa",
  component: () => import("@/layouts/NpPaLayout.vue"),
  children: [
    { path: "dashboard", name: "np-pa-dasboard", component: () => import("@/views/np-pa/NpsPasDashboard.vue") },
    { path: "patients", name: "np-pa-patients", component: () => import("@/views/np-pa/Patients.vue") },
    { path: "staff", name: "np-pa-staff", component: () => import("@/views/np-pa/Staff.vue") },
    { path: "supplies", name: "np-pa-reports", component: () => import("@/views/np-pa/Supplies.vue") },
  ]
},

{
  path: "/dashboard/resident",
  component: () => import("@/layouts/ResidentsLayout.vue"),
  children: [
    { path: "dashboard", name: "resident-dasboard", component: () => import("@/views/resident/ResidentDashboard.vue") },
    { path: "patients", name: "resident-patients", component: () => import("@/views/resident/Patients.vue") },
    { path: "staff", name: "resident-staff", component: () => import("@/views/resident/Staff.vue") },
    { path: "residents", name: "resident-residents", component: () => import("@/views/resident/Residents.vue") },
    { path: "supplies", name: "resident-supplies", component: () => import("@/views/resident/Supplies.vue") },
  ]
},

{
  path: "/dashboard/nursing-interns",
  component: () => import("@/layouts/NursingInternsLayout.vue"),
  children: [
    { path: "dashboard", name: "nurse-interns-dasboard", component: () => import("@/views/nursing-interns/NursingInternsDashboard.vue") },
    { path: "patients", name: "nurse-interns-patients", component: () => import("@/views/nursing-interns/Patients.vue") },
    { path: "reports", name: "nurse-interns-residents", component: () => import("@/views/nursing-interns/Reports.vue") },
    { path: "settings", name: "nurse-interns-supplies", component: () => import("@/views/nursing-interns/Settings.vue") },
  ]
},

{
  path: "/dashboard/pharmacy",
  component: () => import("@/layouts/PharmacyLayout.vue"),
  children: [
    { path: "dashboard", name: "pharmacy-dasboard", component: () => import("@/views/pharmacy/PharmacyDashboard.vue") },
    { path: "patients", name: "pharmacy-patients", component: () => import("@/views/pharmacy/Patients.vue") },
    { path: "staff", name: "pharmacy-staff", component: () => import("@/views/pharmacy/Staff.vue") },
    { path: "residents", name: "pharmacy-residents", component: () => import("@/views/pharmacy/Residents.vue") },
  ]
},

{
  path: "/dashboard/p&otherapist",
  component: () => import("@/layouts/Physical&OccupationalTherapistLayout.vue"),
  children: [
    { path: "dashboard", name: "p&otherapist-dasboard", component: () => import("@/views/p&otherapist/P&OTherapistDashboard.vue") },
    { path: "patients", name: "p&otherapist-patients", component: () => import("@/views/p&otherapist/Patients.vue") },
    { path: "staff", name: "p&otherapist-staff", component: () => import("@/views/p&otherapist/Staff.vue") },
    { path: "residents", name: "p&otherapist-residents", component: () => import("@/views/p&otherapist/Residents.vue") },
  ]
},

{
  path: "/dashboard/speechpathology",
  component: () => import("@/layouts/SpeechPathologyLayout.vue"),
  children: [
    { path: "dashboard", name: "speechpathology-dasboard", component: () => import("@/views/speech-pathology/SpeechPathologyDashboard.vue") },
    { path: "patients", name: "speechpathology-patients", component: () => import("@/views/speech-pathology/Patients.vue") },
    { path: "staff", name: "speechpathology-staff", component: () => import("@/views/speech-pathology/Staff.vue") },
    { path: "residents", name: "speechpathology-residents", component: () => import("@/views/speech-pathology/Residents.vue") },
  ]
},

{
  path: "/dashboard/radiology",
  component: () => import("@/layouts/RadiologyLayout.vue"),
  children: [
    { path: "dashboard", name: "radiology-dasboard", component: () => import("@/views/radiology/RadiologyDashboard.vue") },
    { path: "patients", name: "radiology-patients", component: () => import("@/views/radiology/Patients.vue") },
    { path: "staff", name: "radiology-staff", component: () => import("@/views/radiology/Staff.vue") },
    { path: "residents", name: "radiology-residents", component: () => import("@/views/radiology/Residents.vue") },
  ]
},

{
  path: "/dashboard/hospitaladmin",
  component: () => import("@/layouts/HospitalAdminLayout.vue"),
  children: [
    { path: "dashboard", name: "hospitaladmin-dasboard", component: () => import("@/views/hospitaladmin/HospitalAdminDashboard.vue") },
    { path: "patients", name: "hospitaladmin-patients", component: () => import("@/views/hospitaladmin/Patients.vue") },
    { path: "staff", name: "hospitaladmin-staff", component: () => import("@/views/hospitaladmin/Staff.vue") },
    { path: "residents", name: "hospitaladmin-residents", component: () => import("@/views/hospitaladmin/Residents.vue") },
  ]
},

{
  path: "/dashboard/human-resource",
  component: () => import("@/layouts/HumanResourceLayout.vue"),
  children: [
    { path: "dashboard", name: "humanresource-dasboard", component: () => import("@/views/human-resource/HumanResourceDashboard.vue") },
    { path: "patients", name: "humanresource-patients", component: () => import("@/views/human-resource/Patients.vue") },
    { path: "staff", name: "humanresource-staff", component: () => import("@/views/human-resource/Staff.vue") },
    { path: "residents", name: "humanresource-residents", component: () => import("@/views/human-resource/Residents.vue") },
    { path: "administration", name: "humanresource-administration", component: () => import("@/views/human-resource/Administration.vue") },
  ]
},

{
  path: "/dashboard/finance&billing",
  component: () => import("@/layouts/Finance&BillingLayout.vue"),
  children: [
    { path: "dashboard", name: "finance&billing-dasboard", component: () => import("@/views/finance&billing/Finance&BillingDashboard.vue") },
    { path: "patients", name: "finance&billing-patients", component: () => import("@/views/finance&billing/Patients.vue") },
    { path: "reports", name: "finance&billing-reports", component: () => import("@/views/finance&billing/Reports.vue") },
    { path: "settings", name: "finance&billing-settings", component: () => import("@/views/finance&billing/Settings.vue") },
  ]
},

{
  path: "/dashboard/security-personnel",
  component: () => import("@/layouts/SecurityPersonnelLayout.vue"),
  children: [
    { path: "dashboard", name: "security-personnel-dasboard", component: () => import("@/views/security-personnel/SecurityDashboard.vue") },
    { path: "incidents", name: "security-personnel-incidents", component: () => import("@/views/security-personnel/Incidents.vue") },
    { path: "alerts&monitoring", name: "security-personnel-alert&monitoring", component: () => import("@/views/security-personnel/Alerts&Monitoring.vue") },
    { path: "accesscontrol", name: "security-personnel-accesscontrol", component: () => import("@/views/security-personnel/AccessControl.vue") },
    { path: "cctv&surveillance", name: "security-personnel-cctv&surveillance", component: () => import("@/views/security-personnel/CCTV&Surveillance.vue") },
    { path: "patrolmanagement", name: "security-personnel-patrolmanagement", component: () => import("@/views/security-personnel/PatrolManagement.vue") },
    { path: "securitystaff", name: "security-personnel-securitystaff", component: () => import("@/views/security-personnel/SecurityStaff.vue") },
    { path: "securityreports", name: "security-personnel-securityreports", component: () => import("@/views/security-personnel/SecurityReports.vue") },
    { path: "settings", name: "security-personnel-settings", component: () => import("@/views/security-personnel/Settings.vue") },
  ]
},


    // optional: catch-all -> login (or a NotFound page)
    { path: "/:pathMatch(.*)*", redirect: "/login" },
  ],
});

export default router;
