<template>
  <div class="container-center">
    <div class="card page">
      <div class="header">
        <div class="logo-mark"></div>
        <div style="font-weight:800; font-size:20px; color: var(--blue);">MedSystem</div>

        <div style="margin-left:auto; display:flex; gap:10px; align-items:center;">
          <span class="subtle" style="font-size:13px;">Frontend only</span>
          <button
            type="button"
            class="btn"
            style="width:auto; padding:10px 14px; font-size:14px;"
            @click="logout"
          >
            <font-awesome-icon icon="right-from-bracket" />
            Logout
          </button>
        </div>
      </div>

      <div style="padding: 22px 22px 26px;">
        <div style="text-align:center; margin-bottom: 18px;">
          <div class="h1">Role Dashboard Access</div>
          <div class="subtle">Select your role to access the specific dashboard</div>
        </div>

        <div class="grid">

          <!-- Management -->
          <section class="group">
            <h3 class="group-title">Management and Physicians</h3>
            <div class="group-grid">

              <UiCard @click="goUltraAdmin('Ultra Admin')">
                <template #icon><font-awesome-icon icon="shield-halved" /></template>
                <template #title>Ultra Admin</template>
                <template #sub>System access</template>
              </UiCard>

              <UiCard @click="goPhysician('Senior Consultants / Attending Physicians')">
                <template #icon><font-awesome-icon icon="user-doctor" /></template>
                <template #title>Senior Consultants / Attending Physicians</template>
                <template #sub>Medical leadership</template>
              </UiCard>

              <UiCard @click="goInterns('Interns')">
                <template #icon><font-awesome-icon icon="user-graduate" /></template>
                <template #title>Interns</template>
                <template #sub>Clinical training</template>
              </UiCard>

              <UiCard @click="goNurse('Nurses')">
                <template #icon><font-awesome-icon icon="user-nurse" /></template>
                <template #title>Nurses</template>
                <template #sub>Ward operations</template>
              </UiCard>

            </div>
          </section>

          <!-- Nursing -->
          <section class="group">
            <h3 class="group-title">Nursing Team</h3>
            <div class="group-grid">

              <UiCard @click="goHeadNurse('Nurse Unit Manager / Head Nurse')">
                <template #icon><font-awesome-icon icon="user-shield" /></template>
                <template #title>Nurse Unit Manager / Head Nurse</template>
                <template #sub>Unit leadership</template>
              </UiCard>

              <UiCard @click="goNpPa('Nurse Practitioners & Physician Assistants')">
                <template #icon><font-awesome-icon icon="stethoscope" /></template>
                <template #title>Nurse Practitioners & Physician Assistants</template>
                <template #sub>Advanced practice</template>
              </UiCard>

              <UiCard @click="goResident('Residents')">
                <template #icon><font-awesome-icon icon="users" /></template>
                <template #title>Residents</template>
                <template #sub>Medical trainees</template>
              </UiCard>

              <UiCard @click="goNursingInterns('Interns (Nursing)')">
                <template #icon><font-awesome-icon icon="graduation-cap" /></template>
                <template #title>Nursing Interns</template>
                <template #sub>Nursing trainees</template>
              </UiCard>

            </div>
          </section>

          <!-- Allied Health -->
          <section class="group">
            <h3 class="group-title">Allied Health Professionals</h3>
            <div class="group-grid">

              <UiCard @click="goPharmacy('Pharmacists & Pharmacy Technicians')">
                <template #icon><font-awesome-icon icon="pills" /></template>
                <template #title>Pharmacists & Pharmacy Technicians</template>
                <template #sub>Medication services</template>
              </UiCard>

              <UiCard @click="notReady('Physical & Occupational Therapists')">
                <template #icon><font-awesome-icon icon="person-walking" /></template>
                <template #title>Physical & Occupational Therapists</template>
                <template #sub>Rehab care</template>
              </UiCard>

              <UiCard @click="notReady('Speech-Language Pathologists')">
                <template #icon><font-awesome-icon icon="comment-medical" /></template>
                <template #title>Speech-Language Pathologists</template>
                <template #sub>Speech therapy</template>
              </UiCard>

              <UiCard @click="notReady('Radiologic Technologists')">
                <template #icon><font-awesome-icon icon="x-ray" /></template>
                <template #title>Radiologic Technologists</template>
                <template #sub>Imaging</template>
              </UiCard>

            </div>
          </section>

          <!-- Admin -->
          <section class="group">
            <h3 class="group-title">Administration</h3>
            <div class="group-grid">

              <UiCard @click="notReady('Hospital Administration / Executives')">
                <template #icon><font-awesome-icon icon="building" /></template>
                <template #title>Hospital Administration / Executives</template>
                <template #sub>Executive ops</template>
              </UiCard>

              <UiCard @click="notReady('Human Resources Staff')">
                <template #icon><font-awesome-icon icon="users-gear" /></template>
                <template #title>Human Resources Staff</template>
                <template #sub>HR management</template>
              </UiCard>

              <UiCard @click="notReady('Finance & Billing Staff')">
                <template #icon><font-awesome-icon icon="money-bill-wave" /></template>
                <template #title>Finance & Billing Staff</template>
                <template #sub>Billing & claims</template>
              </UiCard>

              <UiCard @click="notReady('Security Personnel')">
                <template #icon><font-awesome-icon icon="shield" /></template>
                <template #title>Security Personnel</template>
                <template #sub>Safety & access</template>
              </UiCard>

            </div>
          </section>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import UiCard from "../components/UiCard.vue";

const router = useRouter();

onMounted(() => {
  const isLoggedIn = localStorage.getItem("medsystem_logged_in") === "true";
  if (!isLoggedIn) router.replace("/login");
});

/**
 * Generic role navigation (easy to extend later)
 */
function goRole(roleKey, routeTarget) {
  localStorage.setItem("medsystem_role", roleKey);
  router.push(routeTarget);
}

function goUltraAdmin() {
  goRole("ultra_admin", { name: "ua-dashboard" });
}

function goPhysician(roleLabel) {
  localStorage.setItem("medsystem_role_label", roleLabel);
  goRole("physician", { name: "physician-dashboard" });
}

function goInterns(roleLabel) {
  localStorage.setItem("medsystem_role_label", roleLabel);
  goRole("interns", { name: "intern-dashboard" });
}
function goNurse(roleLabel) {
  localStorage.setItem("medsystem_role_label", roleLabel);
  goRole("nurse", { name: "nurse-dashboard" });
}
function goHeadNurse(roleLabel) {
  localStorage.setItem("medsystem_role_label", roleLabel);
  goRole("head_nurse", { name: "headnurse-dashboard" });
}
function goNpPa(roleLabel) {
  localStorage.setItem("medsystem_role_label", roleLabel);
  goRole("head_nurse", { name: "np-pa-dasboard" });
}
function goResident(roleLabel) {
  localStorage.setItem("medsystem_role_label", roleLabel);
  goRole("resident", { name: "resident-dasboard" });
}
function goNursingInterns(roleLabel) {
  localStorage.setItem("medsystem_role_label", roleLabel);
  goRole("nursing-interns", { name: "nurse-interns-dasboard" });
}
function goPharmacy(roleLabel) {
  localStorage.setItem("medsystem_role_label", roleLabel);
  goRole("pharmacy", { name: "pharmacy-dasboard" });
}

function notReady(roleName) {
  alert(`${roleName} dashboard not built yet. We'll add it when you send the next UI design.`);
}

function logout() {
  localStorage.removeItem("medsystem_logged_in");
  localStorage.removeItem("medsystem_role");
  localStorage.removeItem("medsystem_role_label");
  router.replace("/login");
}
</script>


<style scoped>
.grid{
  display: grid;
  gap: 16px;
}
.group{
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
  background: rgba(255,255,255,0.65);
}
.group-title{
  margin: 0 0 10px;
  font-size: 14px;
  color: var(--muted);
  font-weight: 700;
}
.group-grid{
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 1100px){
  .group-grid{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px){
  .group-grid{ grid-template-columns: 1fr; }
}
</style>
