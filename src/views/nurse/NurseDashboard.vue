<template>
  <div class="nd2">
    <!-- KPI BAR -->
    <section class="nd2-kpis">
      <div class="nd2-kpi blue">
        <div class="nd2-kpi-left">
          <div class="nd2-kpi-title">Patients Admitted</div>
          <div class="nd2-kpi-sub">
            <font-awesome-icon icon="hospital-user" />
          </div>
        </div>
        <div class="nd2-kpi-value">28</div>
      </div>

      <div class="nd2-kpi teal">
        <div class="nd2-kpi-left">
          <div class="nd2-kpi-title">Patients in ICU</div>
          <div class="nd2-kpi-sub">
            <font-awesome-icon icon="heart" />
          </div>
        </div>
        <div class="nd2-kpi-value">6</div>
      </div>

      <div class="nd2-kpi orange">
        <div class="nd2-kpi-left">
          <div class="nd2-kpi-title">Tasks for Next Shift</div>
          <div class="nd2-kpi-sub">
            <font-awesome-icon icon="clipboard-check" />
          </div>
        </div>
        <div class="nd2-kpi-value">9</div>
      </div>

      <div class="nd2-kpi pink">
        <div class="nd2-kpi-left">
          <div class="nd2-kpi-title">Unread Messages</div>
          <div class="nd2-kpi-sub">
            <font-awesome-icon icon="message" />
          </div>
        </div>
        <div class="nd2-kpi-value">4</div>
      </div>
    </section>

    <!-- MAIN GRID -->
    <section class="nd2-grid">
      <!-- LEFT -->
      <div class="nd2-left">
        <!-- Patient Overview -->
        <div class="nd2-panel">
          <div class="nd2-panel-head">
            <h3 class="nd2-h">Patient Overview</h3>
          </div>

          <!-- tabs -->
          <div class="nd2-tabs">
            <button
              class="nd2-tab"
              :class="{ active: activeTab === 'all' }"
              type="button"
              @click="activeTab = 'all'"
            >
              All Patients (28)
            </button>
            <button
              class="nd2-tab"
              :class="{ active: activeTab === 'icu' }"
              type="button"
              @click="activeTab = 'icu'"
            >
              ICU (6)
            </button>
            <button
              class="nd2-tab"
              :class="{ active: activeTab === 'discharges' }"
              type="button"
              @click="activeTab = 'discharges'"
            >
              Today's Discharges (5)
            </button>
          </div>

          <!-- search -->
          <div class="nd2-search">
            <font-awesome-icon icon="magnifying-glass" />
            <input v-model="q" type="text" placeholder="Search..." />
          </div>

          <!-- assignments row -->
          <div class="nd2-assign-row">
            <label class="nd2-check">
              <input type="checkbox" v-model="allSelected" />
              <span></span>
            </label>

            <div class="nd2-assign-label">All Assignments</div>

            <div class="nd2-assign-pill">All Assignments</div>

            <button class="nd2-view-btn" type="button">
              View <font-awesome-icon icon="chevron-down" />
            </button>
          </div>

          <!-- list -->
          <div class="nd2-list">
            <div class="nd2-row" v-for="p in filteredPatients" :key="p.id">
              <div class="nd2-person">
                <img class="nd2-avatar" :src="p.avatar" alt="" />
                <div class="nd2-person-meta">
                  <div class="nd2-name">{{ p.name }}</div>
                  <div class="nd2-mini">{{ p.sub }}</div>
                </div>
              </div>

              <div class="nd2-room">{{ p.room }}</div>

              <div class="nd2-tags">
                <span class="nd2-tag" :class="p.tagClass">{{ p.tag }}</span>
                <span class="nd2-tag soft">{{ p.tag2 }}</span>
              </div>

              <button class="nd2-view-btn solid" type="button">
                View <font-awesome-icon icon="chevron-down" />
              </button>
            </div>
          </div>

          <div class="nd2-foot">
            <button class="nd2-link" type="button">
              View All <font-awesome-icon icon="chevron-right" />
            </button>
          </div>
        </div>

        <!-- Task List -->
        <div class="nd2-panel">
          <div class="nd2-panel-head row">
            <h3 class="nd2-h">Task List</h3>
            <button class="nd2-link" type="button">View All</button>
          </div>

          <div class="nd2-tasks">
            <label class="nd2-task" v-for="t in tasks" :key="t.id">
            <input class="nd2-task-input" type="checkbox" v-model="t.done" />
            <span class="nd2-box" aria-hidden="true"></span>

            <div class="nd2-task-body">
                <div class="nd2-task-title">{{ t.title }}</div>
                <div class="nd2-task-sub">{{ t.sub }}</div>
            </div>

            <span class="nd2-chip" :class="t.chipClass">{{ t.chip }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="nd2-right">
        <!-- Quick Actions -->
        <div class="nd2-panel">
          <div class="nd2-panel-head">
            <h3 class="nd2-h">Quick Actions</h3>
          </div>

          <div class="nd2-actions">
            <button class="nd2-action teal" type="button">
              <font-awesome-icon icon="plus" />
              <span>Add New<br />Patient</span>
            </button>

            <button class="nd2-action blue" type="button">
              <font-awesome-icon icon="pills" />
              <span>Administer<br />Medication</span>
            </button>

            <button class="nd2-action orange" type="button">
              <font-awesome-icon icon="notes-medical" />
              <span>Record<br />Vitals</span>
            </button>

            <button class="nd2-action pink" type="button">
              <font-awesome-icon icon="droplet" />
              <span>Blood<br />Transfusion</span>
            </button>
          </div>
        </div>

        <!-- Shift Schedule -->
        <div class="nd2-panel">
          <div class="nd2-panel-head">
            <h3 class="nd2-h">Shift Schedule</h3>
          </div>

          <div class="nd2-daytabs">
            <button class="nd2-day" :class="{ active: day === 'mon' }" @click="day='mon'" type="button">MON</button>
            <button class="nd2-day" :class="{ active: day === 'tue' }" @click="day='tue'" type="button">TUE 24</button>
            <button class="nd2-day" :class="{ active: day === 'wed' }" @click="day='wed'" type="button">WED 24</button>
            <button class="nd2-day" :class="{ active: day === 'thu' }" @click="day='thu'" type="button">THU 25</button>
          </div>

          <div class="nd2-shifts">
            <div class="nd2-shift teal">
              <div class="nd2-shift-title">Day Shift</div>
              <div class="nd2-shift-time">7:00 AM - 7:00 PM</div>
            </div>
            <div class="nd2-shift purple">
              <div class="nd2-shift-title">Night Shift</div>
              <div class="nd2-shift-time">7:00 PM - 7:00 AM</div>
            </div>
            <div class="nd2-shift peach">
              <div class="nd2-shift-title">Evening Shift</div>
              <div class="nd2-shift-time">3:00 PM - 11:00 PM</div>
            </div>
          </div>

          <div class="nd2-foot center">
            <button class="nd2-link" type="button">
              View Full Schedule <font-awesome-icon icon="chevron-right" />
            </button>
          </div>
        </div>

        <!-- Message Center -->
        <div class="nd2-panel">
          <div class="nd2-panel-head">
            <h3 class="nd2-h">Message-Center</h3>
          </div>

          <div class="nd2-msgs">
            <div class="nd2-msg" v-for="m in messages" :key="m.id">
              <img class="nd2-avatar sm" :src="m.avatar" alt="" />
              <div class="nd2-msg-body">
                <div class="nd2-msg-top">
                  <div class="nd2-msg-name">{{ m.name }}</div>
                  <div class="nd2-msg-time">{{ m.time }}</div>
                </div>
                <div class="nd2-msg-text">{{ m.text }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const activeTab = ref("all");
const q = ref("");
const allSelected = ref(false);
const day = ref("wed");

const patients = ref([
  {
    id: 1,
    name: "Laura Williams",
    sub: "Vital Signs New",
    room: "Room 102A",
    tag: "Vital Signs",
    tag2: "See Now",
    tagClass: "beige",
    avatar: "https://i.pravatar.cc/48?img=32",
  },
  {
    id: 2,
    name: "David Harris",
    sub: "Meds New",
    room: "Room 103B",
    tag: "Medication",
    tag2: "overdose",
    tagClass: "green",
    avatar: "https://i.pravatar.cc/48?img=12",
  },
  {
    id: 3,
    name: "Cleo Anderson",
    sub: "New Dictor",
    room: "ICU - ICU-1",
    tag: "Monitoring 2 hrs",
    tag2: "every 2 hours",
    tagClass: "pink",
    avatar: "https://i.pravatar.cc/48?img=47",
  },
  {
    id: 4,
    name: "Robert Lee",
    sub: "Hese Dicton",
    room: "Room 104A",
    tag: "Wounds dressing",
    tag2: "11:30 AM",
    tagClass: "blue",
    avatar: "https://i.pravatar.cc/48?img=8",
  },
]);

const filteredPatients = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return patients.value;
  return patients.value.filter((p) => p.name.toLowerCase().includes(term) || p.room.toLowerCase().includes(term));
});

const tasks = ref([
  {
    id: 1,
    title: "Administer morning meds for Ethan Rivera",
    sub: "Due: due 11:30 AM",
    done: false,
    chip: "Important",
    chipClass: "chip-green",
  },
  {
    id: 2,
    title: "Assist in wound dressing for Robert Lee",
    sub: "Due: due 11:20 AM",
    done: false,
    chip: "Dressing Change",
    chipClass: "chip-blue",
  },
  {
    id: 3,
    title: "Check vitals for Mrs. Laura Williams",
    sub: "Due: sarah every 4 hours",
    done: true,
    chip: "Vital Signs",
    chipClass: "chip-beige",
  },
  {
    id: 4,
    title: "Prepare discharge paperwork for Olivia Harris",
    sub: "",
    done: false,
    chip: "Discharge",
    chipClass: "chip-pink",
  },
]);

const messages = ref([
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    time: "1dm ago",
    text: "Praires blah s harris needs to be regestigned, and have has V line changed: Please hamde it ASAP.",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: 2,
    name: "Dr. Ryan Lewis",
    time: "1h ago",
    text: "Follow up on lab results for ICU patient.",
    avatar: "https://i.pravatar.cc/40?img=15",
  },
]);
</script>

<style scoped>
/* overall */
.nd2{
  display:grid;
  gap: 18px;
  min-width: 0;
}

/* KPI row */
.nd2-kpis{
  display:grid;
  grid-template-columns: repeat(4, minmax(240px, 1fr));
  gap: 16px;
}
.nd2-kpi{
  border-radius: 12px;
  padding: 14px 16px;
  color: #fff;
  display:flex;
  align-items:center;
  justify-content: space-between;
  box-shadow: 0 14px 26px rgba(34,50,74,0.14);
  border: 1px solid rgba(255,255,255,0.25);
  min-width: 0;
}
.nd2-kpi-left{ min-width: 0; }
.nd2-kpi-title{
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nd2-kpi-sub{
  margin-top: 6px;
  opacity: 0.9;
  font-size: 14px;
}
.nd2-kpi-value{
  font-size: 42px;
  font-weight: 900;
  line-height: 1;
}

.nd2-kpi.blue{ background: linear-gradient(90deg, #356ee6, #5c8cf5); }
.nd2-kpi.teal{ background: linear-gradient(90deg, #2f9aa2, #4fc1cb); }
.nd2-kpi.orange{ background: linear-gradient(90deg, #ff7a3d, #ffa45b); }
.nd2-kpi.pink{ background: linear-gradient(90deg, #ff4d6d, #ff7d87); }

/* main grid */
.nd2-grid{
  display:grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 18px;
  align-items:start;
}
.nd2-left, .nd2-right{
  display:grid;
  gap: 18px;
  min-width:0;
}

/* panels (glassy purple) */
.nd2-panel{
  border-radius: 16px;
  border: 1px solid rgba(226,232,244,0.85);
  background: linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow: 0 18px 40px rgba(34,50,74,0.12);
  overflow: hidden;
}
.nd2-panel-head{
  padding: 14px 16px;
  border-bottom: 1px solid rgba(226,232,244,0.85);
}
.nd2-panel-head.row{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
}
.nd2-h{
  margin:0;
  font-size: 18px;
  font-weight: 900;
  color: #2a3550;
}

/* tabs */
.nd2-tabs{
  display:flex;
  gap: 10px;
  padding: 12px 16px 0;
}
.nd2-tab{
  border: 1px solid rgba(226,232,244,0.9);
  background: rgba(255,255,255,0.5);
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 900;
  color: #5b6b87;
  cursor:pointer;
}
.nd2-tab.active{
  color:#2d76d6;
  background: rgba(45,118,214,0.12);
  border-color: rgba(45,118,214,0.25);
}

/* search */
.nd2-search{
  margin: 12px 16px 0;
  border: 1px solid rgba(226,232,244,0.9);
  background: rgba(255,255,255,0.55);
  border-radius: 14px;
  padding: 10px 12px;
  display:flex;
  align-items:center;
  gap: 10px;
  color: #7486a6;
}
.nd2-search input{
  border:0;
  outline:none;
  background: transparent;
  width: 100%;
  font-weight: 800;
  color: #2a3550;
}

/* assignment row */
.nd2-assign-row{
  margin: 12px 16px 0;
  display:grid;
  grid-template-columns: 24px 1fr 160px 120px;
  gap: 12px;
  align-items:center;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(226,232,244,0.85);
  background: rgba(255,255,255,0.45);
}
.nd2-assign-label{
  font-weight: 900;
  color:#425574;
}
.nd2-assign-pill{
  justify-self: end;
  font-weight: 900;
  color:#6b7a90;
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(226,232,244,0.85);
  padding: 8px 10px;
  border-radius: 12px;
  width: fit-content;
}

.nd2-check{
  display:grid;
  place-items:center;
}
.nd2-check input{ display:none; }
.nd2-check span{
  width: 18px;height:18px;border-radius: 5px;
  border: 2px solid rgba(140,155,185,0.7);
  background: rgba(255,255,255,0.75);
}

/* list rows */
.nd2-list{
  padding: 10px 16px 8px;
}
.nd2-row{
  display:grid;
  grid-template-columns: minmax(220px, 1.2fr) 140px minmax(220px, 1fr) 120px;
  gap: 12px;
  align-items:center;
  padding: 12px 10px;
  border-radius: 14px;
}
.nd2-row + .nd2-row{
  border-top: 1px solid rgba(226,232,244,0.65);
  border-radius: 0;
}
.nd2-person{
  display:flex;
  align-items:center;
  gap: 10px;
  min-width:0;
}
.nd2-avatar{
  width: 36px;height:36px;border-radius: 999px; object-fit: cover;
  border: 2px solid rgba(255,255,255,0.75);
}
.nd2-avatar.sm{ width: 32px; height: 32px; }
.nd2-person-meta{ min-width:0; }
.nd2-name{
  font-weight: 900;
  color:#2a3550;
  white-space: nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
}
.nd2-mini{
  font-size: 11px;
  font-weight: 800;
  color: #7a8aa7;
}
.nd2-room{
  font-weight: 900;
  color:#4b5f80;
}

/* tags */
.nd2-tags{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.nd2-tag{
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  border: 1px solid rgba(226,232,244,0.85);
  background: rgba(255,255,255,0.55);
  color:#4b5f80;
}
.nd2-tag.soft{ opacity: 0.75; }
.nd2-tag.beige{ background: rgba(255,225,198,0.65); color:#91572a; }
.nd2-tag.green{ background: rgba(197,255,220,0.65); color:#1d6b44; }
.nd2-tag.pink{ background: rgba(255,199,226,0.65); color:#7b2e58; }
.nd2-tag.blue{ background: rgba(198,220,255,0.70); color:#284e9a; }

/* view buttons */
.nd2-view-btn{
  border: 1px solid rgba(226,232,244,0.9);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  cursor:pointer;
  color:#425574;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}
.nd2-view-btn.solid{
  background: linear-gradient(180deg, #2d76d6, #1e5fb7);
  color:#fff;
  border-color: rgba(255,255,255,0.25);
}

/* footer links */
.nd2-foot{
  padding: 10px 16px 14px;
  display:flex;
  justify-content: flex-end;
}
.nd2-foot.center{ justify-content: center; }
.nd2-link{
  border:0;
  background:transparent;
  color:#2d76d6;
  font-weight: 900;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap: 8px;
}

/* tasks */
.nd2-tasks{
  padding: 14px 16px 16px;
  display:grid;
  gap: 12px;
}
.nd2-task{
  display:grid;
  grid-template-columns: 18px 1fr auto;
  gap: 12px;
  position: relative;
  align-items:center;
  cursor:pointer;
}
.nd2-box{
  position: relative;
  display: inline-grid;
  place-items: center;
}
.nd2-task-input:checked ~ .nd2-task-body{
  opacity: 0.55;
}

.nd2-task-input:checked ~ .nd2-task-body .nd2-task-title{
  text-decoration: line-through;
  text-decoration-thickness: 2px;
  text-decoration-color: rgba(34,50,74,0.45);
}

.nd2-task-input:checked ~ .nd2-task-body .nd2-task-sub{
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
  text-decoration-color: rgba(34,50,74,0.35);
}
.nd2-task-body,
.nd2-task-title,
.nd2-task-sub{
  transition: opacity .2s ease, text-decoration-color .2s ease;
}

.nd2-task-input:checked + .nd2-box{
  background: rgba(45,118,214,0.18);
  border-color: rgba(45,118,214,0.55);
  box-shadow: 0 0 0 4px rgba(45,118,214,0.10);
}
.nd2-task-input:checked + .nd2-box::after{
  content: "";
  width: 8px;
  height: 4px;
  border-left: 3px solid #1e5fb7;
  border-bottom: 3px solid #1e5fb7;
  transform: rotate(-45deg);
  display: block;
  margin: 4px auto 0;
}

.nd2-task input{ display:none; }
.nd2-box{
  width: 16px;height:16px;border-radius: 5px;
  border: 2px solid rgba(140,155,185,0.7);
  background: rgba(255,255,255,0.75);
}
.nd2-task-body{ min-width:0; }
.nd2-task-title{
  font-weight: 900;
  color:#2a3550;
  white-space: nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
}
.nd2-task-sub{
  font-size: 11px;
  font-weight: 800;
  color:#7a8aa7;
  margin-top: 4px;
}

.nd2-chip{
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  border: 1px solid rgba(226,232,244,0.85);
}
.chip-green{ background: rgba(197,255,220,0.65); color:#1d6b44; }
.chip-blue{ background: rgba(198,220,255,0.70); color:#284e9a; }
.chip-beige{ background: rgba(255,225,198,0.65); color:#91572a; }
.chip-pink{ background: rgba(255,199,226,0.65); color:#7b2e58; }

/* quick actions */
.nd2-actions{
  padding: 14px 16px 16px;
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.nd2-action{
  border: 0;
  border-radius: 14px;
  padding: 18px 14px;
  color:#fff;
  font-weight: 900;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap: 12px;
  justify-content:center;
}
.nd2-action span{ line-height: 1.05; text-align:left; }
.nd2-action.teal{ background: linear-gradient(90deg, #2f9aa2, #4fc1cb); }
.nd2-action.blue{ background: linear-gradient(90deg, #356ee6, #5c8cf5); }
.nd2-action.orange{ background: linear-gradient(90deg, #ff7a3d, #ffa45b); }
.nd2-action.pink{ background: linear-gradient(90deg, #ff4d6d, #ff7d87); }

/* schedule */
.nd2-daytabs{
  padding: 10px 16px 0;
  display:flex;
  gap: 10px;
}
.nd2-day{
  flex: 1;
  border: 1px solid rgba(226,232,244,0.9);
  background: rgba(255,255,255,0.45);
  border-radius: 12px;
  padding: 10px 0;
  font-weight: 900;
  color:#7a8aa7;
  cursor:pointer;
}
.nd2-day.active{
  color:#2d76d6;
  background: rgba(45,118,214,0.12);
  border-color: rgba(45,118,214,0.25);
}

.nd2-shifts{
  padding: 14px 16px 12px;
  display:grid;
  gap: 12px;
}
.nd2-shift{
  border-radius: 14px;
  padding: 14px 14px;
  color:#fff;
  border: 1px solid rgba(255,255,255,0.25);
  box-shadow: 0 12px 24px rgba(34,50,74,0.12);
}
.nd2-shift-title{ font-weight: 900; font-size: 16px; }
.nd2-shift-time{ margin-top: 6px; opacity: 0.95; font-weight: 800; }

.nd2-shift.teal{ background: linear-gradient(90deg, #2f9aa2, #4fc1cb); }
.nd2-shift.purple{ background: linear-gradient(90deg, #6f5ee8, #9a7bff); }
.nd2-shift.peach{ background: linear-gradient(90deg, #f6b1a2, #f3c6b7); color:#2a3550; }

/* messages */
.nd2-msgs{
  padding: 14px 16px 16px;
  display:grid;
  gap: 14px;
}
.nd2-msg{
  display:flex;
  gap: 10px;
  align-items:flex-start;
}
.nd2-msg-body{ min-width:0; }
.nd2-msg-top{
  display:flex;
  justify-content: space-between;
  gap: 10px;
}
.nd2-msg-name{ font-weight: 900; color:#2a3550; }
.nd2-msg-time{ font-size: 11px; font-weight: 800; color:#7a8aa7; }
.nd2-msg-text{
  margin-top: 4px;
  font-size: 12px;
  font-weight: 800;
  color:#5b6b87;
  line-height: 1.35;
}

/* RESPONSIVE (800–1600 target) */
@media (max-width: 1400px){
  .nd2-grid{ grid-template-columns: minmax(0, 1fr) 360px; }
}
@media (max-width: 1200px){
  .nd2-kpis{ grid-template-columns: repeat(2, 1fr); }
  .nd2-grid{ grid-template-columns: 1fr; }
}
@media (max-width: 900px){
  .nd2-kpis{ grid-template-columns: 1fr; }
  .nd2-row{
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .nd2-tags{ justify-content: flex-start; }
  .nd2-view-btn.solid{ width: 140px; }
  .nd2-assign-row{
    grid-template-columns: 24px 1fr;
    grid-auto-rows: auto;
  }
  .nd2-assign-pill, .nd2-view-btn{ justify-self: start; }
}
</style>
