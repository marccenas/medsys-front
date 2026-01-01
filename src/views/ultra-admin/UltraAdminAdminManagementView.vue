<template>
  <div class="grid">
    <div class="panel">
      <div class="panel-title">Add New Account</div>
      <div class="panel-body">
        <div class="form-grid">
          <input class="input2" v-model="form.name" placeholder="Full Name" />
          <div class="role-select">
            <button class="role-btn" type="button" @click="open = !open">
              <span>{{ form.role }}</span>
              <span>▾</span>
            </button>

            <div class="role-menu" v-if="open">
              <button v-for="r in roles" :key="r" type="button" class="role-item" @click="pickRole(r)">
                {{ r }}
              </button>
            </div>
          </div>

          <input class="input2" v-model="form.email" placeholder="Email Address" />
          <input class="input2" v-model="form.phone" placeholder="Phone Number" />

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
        </div>

        <button class="btn" style="margin-top:12px;" @click="createAccount">
          Create Account
        </button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">Accounts</div>
      <div class="panel-body">
        <table class="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.email">
              <td class="strong">{{ u.name }}</td>
              <td class="muted">{{ u.email }}</td>
              <td>{{ u.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const roles = [
  "Ultra Admin",
  "Attending Physician",
  "Resident Doctor",
  "Intern Doctor",
  "Nurse Unit Manager / Head Nurse",
  "Nurse Practitioner",
  "Physical Assistant",
  "Licensed Practical Nurse",
  "Pharmacist",
  "Physical Therapist",
  "Respiratory Therapist",
];

const open = ref(false);
const generatePassword = ref(true);

const form = reactive({
  name: "",
  email: "",
  phone: "",
  role: "Ultra Admin",
});

const users = ref([
  { name: "John Evans", email: "john@medsystem.test", role: "Ultra Admin" },
  { name: "Dr. Sarah M.", email: "sarah@medsystem.test", role: "Attending Physician" },
  { name: "Michael R.", email: "michael@medsystem.test", role: "Nurse" },
  { name: "Karen S.", email: "karen@medsystem.test", role: "Assistant" },
]);

function pickRole(r){
  form.role = r;
  open.value = false;
}

function createAccount(){
  if (!form.name || !form.email) {
    alert("Name and Email required (UI only).");
    return;
  }
  users.value.unshift({ name: form.name, email: form.email, role: form.role });
  form.name = "";
  form.email = "";
  form.phone = "";
  form.role = "Ultra Admin";
  alert(generatePassword.value ? "Account created with generated password (UI only)." : "Account created (UI only).");
}
</script>

<style scoped>
.grid{
  display:grid;
  grid-template-columns: 1.2fr 1fr;
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

.form-grid{ display:grid; gap: 10px; }
.input2{
  width:100%;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #fbfdff;
  outline: none;
}
.role-select{ position: relative; }
.role-btn{
  width:100%;
  display:flex;
  justify-content: space-between;
  align-items:center;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color: white;
  cursor:pointer;
  font-weight: 900;
}
.role-menu{
  position:absolute;
  left:0; right:0;
  top: calc(100% + 8px);
  background:#fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow:hidden;
  z-index: 10;
}
.role-item{
  width:100%;
  text-align:left;
  padding: 10px 12px;
  border:0;
  background:#fff;
  cursor:pointer;
  font-weight: 800;
}
.role-item:hover{ background: #f3f7ff; }

.gen-row{
  display:flex;
  align-items:center;
  justify-content: space-between;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
  background:#fbfdff;
}
.gen-left{ display:flex; align-items:center; gap: 10px; font-weight: 900; color: var(--muted); }

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

.tbl{ width:100%; border-collapse: collapse; }
th, td{ padding: 12px 12px; border-bottom: 1px solid var(--line); font-size: 14px; }
th{ text-align:left; color: var(--muted); font-weight: 900; background: rgba(245,248,255,0.8); }
.strong{ font-weight: 900; }
.muted{ color: var(--muted); }

@media (max-width: 1100px){
  .grid{ grid-template-columns: 1fr; }
}
</style>
