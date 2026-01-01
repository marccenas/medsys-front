<template>
  <div class="am-page">
    <div class="panel">
      <div class="panel-title">Add New Account</div>

      <div class="panel-body am-grid">
        <!-- LEFT: Form -->
        <div class="am-form">
          <div class="field">
            <input class="input2" v-model.trim="form.userid" placeholder="ID Number" />
          </div>

          <div class="field">
            <input class="input2" v-model.trim="form.name" placeholder="Full Name" />
          </div>

          <div class="field">
            <input class="input2" v-model.trim="form.email" placeholder="Email Address" />
          </div>

          <div class="field">
            <input class="input2" v-model.trim="form.phone" placeholder="Phone Number" />
          </div>

          <!-- Department Dropdown (UPDATED) -->
          <div class="field">
            <div class="dd" ref="deptRef" @click.stop>
              <button class="dd-btn" type="button" @click.stop="deptOpen = !deptOpen">
                <span>{{ form.department || "Select Department" }}</span>
                <span class="caret">▾</span>
              </button>

              <div class="dd-menu" v-if="deptOpen" @click.stop>
                <div class="dd-head">Departments</div>

                <button
                  v-for="d in departments"
                  :key="d"
                  type="button"
                  class="dd-item"
                  @click="pickDepartment(d)"
                >
                  <span class="dd-check">
                    <span class="box" :class="{ on: form.department === d }">
                      <font-awesome-icon icon="check" v-if="form.department === d" />
                    </span>
                  </span>
                  <span class="dd-label">{{ d }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="gen-row">
            <div class="gen-left">
              <font-awesome-icon icon="key" />
              <span>Generate Password</span>
            </div>

            <label class="switch">
              <input type="checkbox" v-model="generatePassword" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="hint muted small">
            Frontend-only: clicking “Create Account” will add a row below.
          </div>
        </div>

        <!-- RIGHT: Role dropdown + checklist (UPDATED) -->
        <div class="am-role" ref="roleRef" @click.stop>
          <button class="role-btn" type="button" @click.stop="open = !open">
            <span>{{ selectedRoleLabel }}</span>
            <span class="caret">▾</span>
          </button>

          <div class="role-menu" v-if="open" @click.stop>
            <div class="role-menu-head">Select a role</div>

            <button
              v-for="r in roles"
              :key="r.key"
              type="button"
              class="role-item"
              @click="selectRole(r.key)"
            >
              <span class="check">
                <span class="box" :class="{ on: r.key === form.roleKey }">
                  <font-awesome-icon icon="check" v-if="r.key === form.roleKey" />
                </span>
              </span>

              <span class="role-label">{{ r.label }}</span>
            </button>
          </div>

          <div class="role-foot muted small">
            Current role: <span class="strong">{{ selectedRoleLabel }}</span>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="panel-body" style="padding-top:0;">
        <div class="table-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th style="width: 52px;"></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="u in users" :key="u.id">
                <td>
                  <div class="avatar">
                    {{ initials(u.name) }}
                  </div>
                </td>
                <td class="strong">{{ u.name }}</td>
                <td class="muted">{{ u.email }}</td>
                <td>
                  <span class="pill">{{ u.roleLabel }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ACTION BUTTON -->
        <div class="create-row">
          <button class="btn" @click="createAccount">
            Create Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, ref } from "vue";

const STORAGE_KEY = "medsystem_admin_accounts_v1";

/* ===== Dropdown state ===== */
const deptOpen = ref(false);
const open = ref(false); // role dropdown open/close

/* ===== Refs for outside-click handling ===== */
const deptRef = ref(null);
const roleRef = ref(null);

/* ===== Static lists (frontend-only) ===== */
const departments = [
  "Emergency",
  "Cardiology",
  "Neurology",
  "Radiology",
  "Pharmacy",
  "Laboratory",
  "Billing",
];

const roles = [
  { key: "ultra_admin", label: "Ultra Admin" },
  { key: "attending_physician", label: "Attending Physician" },
  { key: "resident_doctor", label: "Resident Doctor" },
  { key: "intern_doctor", label: "Intern Doctor" },
  { key: "nurse_manager", label: "Nurse Unit M. / Head Nurse" },
  { key: "nurse_practitioner", label: "Nurse Practitioner" },
  { key: "physical_assistant", label: "Physical Assistant" },
  { key: "lpn", label: "Licensed Practical Nurse" },
  { key: "pharmacist", label: "Pharmacist" },
  { key: "physical_therapist", label: "Physical Therapist" },
  { key: "respiratory_therapist", label: "Respiratory Therapist" },
];

/* ===== Form state ===== */
const generatePassword = ref(true);

const form = reactive({
  userid: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  roleKey: "ultra_admin",
});

/* ===== Table data ===== */
const users = ref([
  {
    id: 1,
    userid: "UA-0001",
    name: "John Evans",
    email: "john@medsystem.test",
    phone: "0917-000-0001",
    department: "Administration",
    roleKey: "ultra_admin",
    roleLabel: "Ultra Admin",
  },
  {
    id: 2,
    userid: "MD-0002",
    name: "Dr. Sarah M.",
    email: "sarah@medsystem.test",
    phone: "0917-000-0002",
    department: "Cardiology",
    roleKey: "attending_physician",
    roleLabel: "Attending Physician",
  },
  {
    id: 3,
    userid: "NU-0003",
    name: "Michael R.",
    email: "michael@medsystem.test",
    phone: "0917-000-0003",
    department: "Emergency",
    roleKey: "nurse_manager",
    roleLabel: "Nurse Unit M. / Head Nurse",
  },
  {
    id: 4,
    userid: "PA-0004",
    name: "Karen S.",
    email: "karen@medsystem.test",
    phone: "0917-000-0004",
    department: "Radiology",
    roleKey: "physical_assistant",
    roleLabel: "Physical Assistant",
  },
]);

/* ===== Load persisted users (frontend-only) ===== */
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) users.value = parsed;
    } catch {
      // ignore bad storage
    }
  }
});

/* ===== Role label display ===== */
const selectedRoleLabel = computed(() => {
  return roles.find((r) => r.key === form.roleKey)?.label || "Select role";
});

/* ===== Department dropdown behavior ===== */
function pickDepartment(dept) {
  form.department = dept;
  deptOpen.value = false;
}

/* ===== Role dropdown behavior ===== */
function selectRole(key) {
  form.roleKey = key;
  open.value = false;
}

/* ===== Create account (includes department + userid + phone) ===== */
function createAccount() {
  if (!form.userid || !form.name || !form.email) {
    window.alert("ID Number, Full Name, and Email Address are required.");
    return;
  }

  if (!form.department) {
    window.alert("Please select a Department.");
    return;
  }

  const roleLabel = roles.find((r) => r.key === form.roleKey)?.label || form.roleKey;

  users.value.unshift({
    id: Date.now(),
    userid: form.userid,
    name: form.name,
    email: form.email,
    phone: form.phone,
    department: form.department,
    roleKey: form.roleKey,
    roleLabel,
  });

  window.alert(
    generatePassword.value
      ? "Account created (UI only) with generated password."
      : "Account created (UI only)."
  );

  // reset form
  form.userid = "";
  form.name = "";
  form.email = "";
  form.phone = "";
  form.department = "";
  form.roleKey = "ultra_admin";

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users.value));
}

/* ===== Initials helper ===== */
function initials(name = "") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

/* ===== Close dropdowns only when clicking OUTSIDE =====
   IMPORTANT:
   - Uses refs (deptRef/roleRef) to avoid closing immediately.
   - Uses capture=true so it still works reliably.
*/
function onWindowClick(e) {
  // close department dropdown if click is outside its container
  if (deptRef.value && !deptRef.value.contains(e.target)) {
    deptOpen.value = false;
  }

  // close role dropdown if click is outside its container
  if (roleRef.value && !roleRef.value.contains(e.target)) {
    open.value = false;
  }
}

onMounted(() => {
  window.addEventListener("click", onWindowClick, true);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", onWindowClick, true);
});
</script>

<style scoped>
.dd{ position: relative; }

.dd-btn{
  width:100%;
  display:flex;
  justify-content: space-between;
  align-items:center;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.9);
  background: linear-gradient(180deg, #ffffff, #f4f8ff);
  color: var(--text);
  cursor:pointer;
  font-weight: 900;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
}

.dd-btn.role{
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color: #fff;
  border-color: rgba(45,118,214,0.35);
  box-shadow: 0 12px 20px rgba(34,50,74,0.12);
}

.dd-menu{
  position:absolute;
  left:0; right:0;
  top: calc(100% + 8px);
  background:#fff;
  border: 1px solid rgba(226,232,244,0.95);
  border-radius: 12px;
  box-shadow: 0 18px 32px rgba(34,50,74,0.16);
  overflow:hidden;
  z-index: 30;
}

.dd-head{
  padding: 10px 12px;
  font-weight: 900;
  color: var(--muted);
  border-bottom: 1px solid rgba(226,232,244,0.85);
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.8));
}

.dd-item{
  width:100%;
  display:flex;
  align-items:center;
  gap: 10px;
  text-align:left;
  padding: 10px 12px;
  border:0;
  background:#fff;
  cursor:pointer;
  font-weight: 800;
}
.dd-item:hover{ background: #f3f7ff; }

.dd-check{ width: 22px; display:flex; justify-content:center; }
.box{
  width: 18px; height: 18px;
  border-radius: 6px;
  border: 1px solid rgba(226,232,244,0.95);
  display:grid;
  place-items:center;
  color: white;
  background: transparent;
}
.box.on{
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  border-color: rgba(45,118,214,0.55);
}
.dd-label{ flex:1; }

.caret{ opacity: .9; }

.am-page{ display:grid; gap: 14px; }

/* Main layout inside the card */
.am-grid{
  display:grid;
  grid-template-columns: 1fr 320px;
  gap: 14px;
  align-items: start;
}

/* Inputs */
.field{ margin-bottom: 10px; }
.input2{
  width:100%;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #fbfdff;
  outline: none;
}

/* Generate password row */
.gen-row{
  display:flex;
  align-items:center;
  justify-content: space-between;
  border: 1px solid rgba(226,232,244,0.9);
  border-radius: 12px;
  padding: 10px 12px;
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(244,248,255,0.72));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
}
.gen-left{ display:flex; align-items:center; gap: 10px; font-weight: 900; color: var(--muted); }

/* Toggle switch */
.switch{ position:relative; width:46px; height:26px; }
.switch input{ display:none; }
.slider{
  position:absolute; inset:0;
  border-radius: 999px;
  background:#cbd5e1;
  cursor:pointer;
  transition:.15s;
}
.slider:before{
  content:"";
  position:absolute;
  width:22px; height:22px;
  left:2px; top:2px;
  border-radius: 999px;
  background:#fff;
  transition:.15s;
}
.switch input:checked + .slider{ background:#2d76d6; }
.switch input:checked + .slider:before{ transform: translateX(20px); }

.hint{ margin-top: 10px; }

/* Role dropdown */
.am-role{ position: relative; }
.role-btn{
  width:100%;
  display:flex;
  justify-content: space-between;
  align-items:center;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.9);
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color: white;
  cursor:pointer;
  font-weight: 900;
  box-shadow: 0 12px 20px rgba(34,50,74,0.12);
}
.caret{ opacity: .95; }

.role-menu{
  position:absolute;
  left:0; right:0;
  top: calc(100% + 8px);
  background:#fff;
  border: 1px solid rgba(226,232,244,0.95);
  border-radius: 12px;
  box-shadow: 0 18px 32px rgba(34,50,74,0.16);
  overflow:hidden;
  z-index: 20;
}
.role-menu-head{
  padding: 10px 12px;
  font-weight: 900;
  color: var(--muted);
  border-bottom: 1px solid rgba(226,232,244,0.85);
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.8));
}
.role-item{
  width:100%;
  display:flex;
  align-items:center;
  gap: 10px;
  text-align:left;
  padding: 10px 12px;
  border:0;
  background:#fff;
  cursor:pointer;
  font-weight: 800;
}
.role-item:hover{ background: #f3f7ff; }

.check{ width: 22px; display:flex; justify-content:center; }
.box{
  width: 18px; height: 18px;
  border-radius: 6px;
  border: 1px solid rgba(226,232,244,0.95);
  display:grid;
  place-items:center;
  color: white;
  background: transparent;
}
.box.on{
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  border-color: rgba(45,118,214,0.55);
}
.role-label{ flex:1; }

.role-foot{
  margin-top: 10px;
}
.strong{ font-weight: 900; }

/* Table */
.table-wrap{
  margin-top: 12px;
  overflow:auto;
  border: 1px solid rgba(226,232,244,0.95);
  border-radius: 12px;
}
.tbl{ width:100%; border-collapse: collapse; min-width: 740px; }
th, td{ padding: 12px 12px; border-bottom: 1px solid rgba(226,232,244,0.85); font-size: 14px; }
th{ text-align:left; color: var(--muted); font-weight: 900; background: rgba(245,248,255,0.8); }

.avatar{
  width: 34px; height: 34px;
  border-radius: 12px;
  display:grid;
  place-items:center;
  font-weight: 900;
  color: white;
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  box-shadow: 0 12px 18px rgba(34,50,74,0.12);
}

.pill{
  display:inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  background: rgba(45,118,214,0.12);
  color: #1e5fb7;
  border: 1px solid rgba(226,232,244,0.95);
}

.create-row{
  display:flex;
  justify-content: flex-end;
  padding-top: 12px;
}

/* Responsive */
@media (max-width: 1100px){
  .am-grid{ grid-template-columns: 1fr; }
  .tbl{ min-width: 600px; }
}
</style>
