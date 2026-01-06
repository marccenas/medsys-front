<template>
  <section class="intern-dash">

    <div class="dash-top">
      <div class="dash-title">
        <h1>Dashboard</h1>
        <p class="subtle">
          Dashboard Overview <span class="sep">›</span>
        </p>
      </div>
    </div>

    <!-- KPI cards -->
    <div class="kpi-row">
      <div class="kpi kpi-blue">
        <div class="kpi-left">
          <div class="kpi-label">Patients Assigned</div>
          <div class="kpi-ico"><font-awesome-icon icon="user-group" /></div>
        </div>
        <div class="kpi-value">12</div>
      </div>

      <div class="kpi kpi-green">
        <div class="kpi-left">
          <div class="kpi-label">Tasks for Today</div>
          <div class="kpi-ico"><font-awesome-icon icon="clipboard-check" /></div>
        </div>
        <div class="kpi-value">8</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-left">
          <div class="kpi-label">Upcoming Shifts</div>
          <div class="kpi-ico"><font-awesome-icon icon="calendar-days" /></div>
        </div>
        <div class="kpi-value">3</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-left">
          <div class="kpi-label">Unread Messages</div>
          <div class="kpi-ico"><font-awesome-icon icon="envelope" /></div>
        </div>
        <div class="kpi-value">5</div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="dash-grid">
      <!-- My Patient List -->
      <section class="card glass">
        <div class="card-head">
          <h2 class="card-title">My Patient List</h2>
        </div>

        <div class="tabs-row">
          <button
            class="tab"
            :class="{ active: activeTab === 'assigned' }"
            @click="activeTab = 'assigned'"
            type="button"
          >
            Assigned (12)
          </button>
          <button
            class="tab"
            :class="{ active: activeTab === 'followup' }"
            @click="activeTab = 'followup'"
            type="button"
          >
            Follow-Up (4)
          </button>

          <div class="tab-dd">
            <button class="tab tab-dd-btn" type="button">
              New Consults (3)
              <font-awesome-icon icon="chevron-down" />
            </button>
          </div>
        </div>

        <div class="search-row">
          <font-awesome-icon class="search-ico" icon="magnifying-glass" />
          <input
            v-model="patientQuery"
            class="search"
            placeholder="Search..."
            type="text"
          />
        </div>

        <div class="list">
          <div
            v-for="p in filteredPatients"
            :key="p.id"
            class="row-item"
          >
            <div class="row-left">
              <div class="mini-avatar">
                <img :src="p.avatar" alt="" />
              </div>
              <div>
                <div class="row-title">{{ p.name }}</div>
                <div class="row-sub subtle">{{ p.type }}</div>
              </div>
            </div>

            <div class="row-mid">
              <div class="row-time">{{ p.time }}</div>
              <div class="row-note subtle">{{ p.kind }}</div>
            </div>

            <div class="row-right">
              <span class="pill" :class="pillClass(p.badge1)">{{ p.badge1 }}</span>
              <span v-if="p.badge2" class="pill outline" :class="pillClass(p.badge2)">{{ p.badge2 }}</span>
            </div>
          </div>
        </div>

        <div class="card-foot subtle">
          Showing 4 Lab tests for <span class="linkish">Ethan Rivera</span>
        </div>
      </section>

      <!-- Today's Tasks -->
      <section class="card glass">
        <div class="card-head row-between">
          <h2 class="card-title">Today’s Tasks</h2>

          <div class="actions">
            <button class="btn-soft" type="button">
              <font-awesome-icon icon="plus" />
              New Task
              <font-awesome-icon icon="chevron-down" />
            </button>
          </div>
        </div>

        <div class="task-list">
          <div v-for="t in tasks" :key="t.id" class="task">
            <label class="task-left">
              <input type="checkbox" v-model="t.done" />
              <span class="check-ui"></span>
            </label>

            <div class="task-main">
              <div class="task-title">
                {{ t.title }}
              </div>
              <div class="task-meta">
                <span class="subtle">{{ t.location }}</span>
                <span class="pill tiny" :class="pillClass(t.tag)">{{ t.tag }}</span>
              </div>
            </div>

            <div class="task-time">
              <span class="time-pill">{{ t.due }}</span>
            </div>
          </div>
        </div>

        <button class="view-all" type="button">
          View All <font-awesome-icon icon="chevron-right" />
        </button>
      </section>

      <!-- My Schedule -->
      <section class="card glass">
        <div class="card-head">
          <h2 class="card-title">My Schedule</h2>
        </div>

        <div class="week-strip">
          <div class="day active">
            <div class="dow">
              <font-awesome-icon icon="calendar" />
              <span>MON</span>
            </div>
            <div class="date">21</div>
          </div>

          <div class="day"><div class="dow">THU</div><div class="date subtle">—</div></div>
          <div class="day"><div class="dow">WES</div><div class="date subtle">—</div></div>
          <div class="day"><div class="dow">THU</div><div class="date subtle">—</div></div>
          <div class="day"><div class="dow">WED</div><div class="date subtle">—</div></div>
          <div class="day"><div class="dow">FRI</div><div class="date subtle">—</div></div>

          <button class="day next" type="button" aria-label="Next">
            <font-awesome-icon icon="chevron-right" />
          </button>
        </div>

        <div class="schedule-list">
          <div v-for="s in schedule" :key="s.id" class="sched">
            <div class="dot" :class="s.dot"></div>
            <div class="sched-main">
              <div class="sched-title">{{ s.title }}</div>
              <div class="sched-sub subtle">{{ s.when }} <span class="pill tiny muted">{{ s.badge }}</span></div>
            </div>
            <div class="sched-time">{{ s.time }}</div>
            <button class="sched-go" type="button" aria-label="Open">
              <font-awesome-icon icon="chevron-right" />
            </button>
          </div>
        </div>
      </section>

      <!-- Quick Resources -->
      <section class="card glass">
        <div class="card-head">
          <h2 class="card-title">Quick Resources</h2>
        </div>

        <div class="qr-grid">
          <button class="qr qr-blue" type="button">
            <div class="qr-ico"><font-awesome-icon icon="file-lines" /></div>
            <div class="qr-text">
              <div class="qr-title">Clinical guidelines</div>
              <div class="qr-sub subtle">Review important protocols and guidelines.</div>
            </div>
          </button>

          <button class="qr qr-orange" type="button">
            <div class="qr-ico"><font-awesome-icon icon="list-check" /></div>
            <div class="qr-text">
              <div class="qr-title">Task Management</div>
              <div class="qr-sub subtle">Organize and track your assigned tasks.</div>
            </div>
          </button>

          <button class="qr qr-blue2" type="button">
            <div class="qr-ico"><font-awesome-icon icon="graduation-cap" /></div>
            <div class="qr-text">
              <div class="qr-title">Educational Modules</div>
              <div class="qr-sub subtle">Access learning resources and tutorials.</div>
            </div>
          </button>

          <button class="qr qr-purple" type="button">
            <div class="qr-ico"><font-awesome-icon icon="message" /></div>
            <div class="qr-text">
              <div class="qr-title">Message Center</div>
              <div class="qr-sub subtle">Reminder: new education module on ERG interpretation.</div>
            </div>
          </button>
        </div>

        <button class="view-full" type="button">
          View Full Schedule
        </button>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

const activeTab = ref("assigned");
const patientQuery = ref("");

const patients = reactive([
  {
    id: 1,
    name: "Laura Williams",
    type: "Outpatient",
    time: "9:00 AM",
    kind: "Follow-Up",
    badge1: "Follow-Up",
    badge2: "Follow-Up",
    avatar: "https://i.pravatar.cc/48?img=32",
  },
  {
    id: 2,
    name: "Mark Johnson",
    type: "Outpatient",
    time: "10:00 AM",
    kind: "New Consult",
    badge1: "Outpatient",
    badge2: null,
    avatar: "https://i.pravatar.cc/48?img=56",
  },
  {
    id: 3,
    name: "Cleo Anderson",
    type: "Inpatient",
    time: "11:00 AM",
    kind: "Follow-Up",
    badge1: "Inpatient",
    badge2: null,
    avatar: "https://i.pravatar.cc/48?img=45",
  },
  {
    id: 4,
    name: "Ethan Rivera",
    type: "Outpatient",
    time: "1:00 PM",
    kind: "Routine Checkup",
    badge1: "Normal",
    badge2: null,
    avatar: "https://i.pravatar.cc/48?img=15",
  },
]);

const tasks = reactive([
  { id: 1, done: true,  title: "Check in on Laura Williams", location: "Outpatient", tag: "Important", due: "9:00 AM" },
  { id: 2, done: true,  title: "Prepare discharge summary for Olivia Harris", location: "Inpatient", tag: "Inpatient", due: "12:00 PM" },
  { id: 3, done: true,  title: "Assist in routine checkup for Ethan Rivera", location: "Outpatient", tag: "Outpatient", due: "1:00 PM" },
  { id: 4, done: true,  title: "Follow up on lab results for Mark Johnson", location: "New Consult", tag: "Urgent", due: "Due EOD" },
]);

const schedule = reactive([
  { id: 1, title: "ER Rotation", when: "Today", badge: "In-Patient", time: "2:00 PM - 8:00 PM", dot: "blue" },
  { id: 2, title: "Internal Medicine", when: "Tomorrow", badge: "On-call", time: "8:00 AM - 4:00 PM", dot: "green" },
  { id: 3, title: "Surgery Rotation", when: "Wednesday", badge: "Off-duty", time: "6:00 AM - 2:00 PM", dot: "blue" },
]);

const filteredPatients = computed(() => {
  const q = patientQuery.value.trim().toLowerCase();
  if (!q) return patients;
  return patients.filter((p) => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
});

function pillClass(label) {
  const v = String(label || "").toLowerCase();
  if (v.includes("important")) return "pill-green";
  if (v.includes("urgent")) return "pill-purple";
  if (v.includes("inpatient")) return "pill-orange";
  if (v.includes("outpatient")) return "pill-teal";
  if (v.includes("follow")) return "pill-teal";
  if (v.includes("normal")) return "pill-green";
  return "pill-muted";
}
</script>

<style scoped>
/* Page */
.intern-dash{
  padding: 18px 18px 24px;
}

/* Top header */
.dash-top{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 14px;
  margin-bottom: 14px;
}
.dash-title h1{
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.dash-title p{
  margin: 6px 0 0;
  font-size: 14px;
}

.dash-user{
  display:flex;
  align-items:center;
  gap: 10px;
}
.icon-btn{
  position: relative;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
}
.icon-btn.ghost{
  border-color: transparent;
  background: transparent;
  padding: 8px 10px;
}
.badge-dot{
  position:absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4f;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  padding: 4px 7px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.9);
}

.user-chip{
  display:flex;
  align-items:center;
  gap: 10px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.55);
  padding: 8px 10px;
  border-radius: 16px;
}
.avatar{
  width: 36px;
  height: 36px;
  border-radius: 999px;
  overflow:hidden;
  flex: 0 0 auto;
}
.avatar img{ width:100%; height:100%; object-fit:cover; }
.user-meta .name{ font-weight: 800; font-size: 14px; }
.user-meta .role{ font-size: 12px; margin-top: 2px; }

/* KPI */
.kpi-row{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}
.kpi{
  border-radius: 14px;
  padding: 14px 16px;
  color: #fff;
  display:flex;
  align-items:center;
  justify-content:space-between;
  box-shadow: 0 10px 24px rgba(0,0,0,0.10);
  min-height: 70px;
}
.kpi-left{
  display:flex;
  flex-direction:column;
  gap: 8px;
}
.kpi-label{
  font-weight: 700;
  font-size: 14px;
  opacity: 0.95;
}
.kpi-ico{
  font-size: 16px;
  opacity: 0.9;
}
.kpi-value{
  font-weight: 900;
  font-size: 34px;
  line-height: 1;
  letter-spacing: -0.03em;
}

.kpi-blue{ background: linear-gradient(135deg, #4f77ff, #2f56ff); }
.kpi-green{ background: linear-gradient(135deg, #23b5a8, #1a8e84); }
.kpi-red{ background: linear-gradient(135deg, #ff6c6c, #ff4a4a); }
.kpi-orange{ background: linear-gradient(135deg, #ffb35a, #ff8c3a); }

/* Grid */
.dash-grid{
  display:grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 14px;
}
.card{
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  background: rgba(255,255,255,0.60);
  box-shadow: 0 10px 26px rgba(35, 55, 110, 0.12);
  overflow:hidden;
}
.glass{
  backdrop-filter: blur(10px);
}
.card-head{
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.row-between{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
}
.card-title{
  margin:0;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.card-foot{
  text-align:center;
  padding: 10px 12px 14px;
  border-top: 1px solid rgba(0,0,0,0.06);
  font-size: 12px;
}
.linkish{ color: var(--blue); font-weight: 800; }

/* Tabs & search */
.tabs-row{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px 16px 10px;
}
.tab{
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.50);
  padding: 8px 12px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 13px;
  cursor:pointer;
  color: rgba(30,40,70,0.92);
}
.tab.active{
  border-color: rgba(79,119,255,0.35);
  background: rgba(79,119,255,0.12);
  color: #2f56ff;
}
.tab-dd{ margin-left:auto; }
.tab-dd-btn{
  display:flex;
  align-items:center;
  gap: 8px;
}

.search-row{
  position: relative;
  padding: 0 16px 12px;
}
.search{
  width: 100%;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.50);
  border-radius: 12px;
  padding: 11px 12px 11px 38px;
  outline: none;
}
.search-ico{
  position:absolute;
  left: 28px;
  top: 11px;
  color: rgba(90,100,130,0.7);
}

/* Patient list rows */
.list{
  padding: 0 10px 10px;
}
.row-item{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 14px;
}
.row-item:hover{
  background: rgba(255,255,255,0.55);
}
.row-left{
  display:flex;
  align-items:center;
  gap: 10px;
  min-width: 220px;
}
.mini-avatar{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  overflow:hidden;
  border: 2px solid rgba(255,255,255,0.8);
}
.mini-avatar img{ width:100%; height:100%; object-fit:cover; }
.row-title{ font-weight: 900; }
.row-sub{ font-size: 12px; margin-top: 2px; }

.row-mid{
  display:flex;
  align-items:center;
  gap: 14px;
  color: rgba(30,40,70,0.90);
  flex: 1 1 auto;
  min-width: 180px;
}
.row-time{
  font-weight: 900;
  font-size: 13px;
  white-space: nowrap;
}
.row-note{
  font-size: 12px;
  white-space: nowrap;
}

.row-right{
  display:flex;
  align-items:center;
  gap: 8px;
  justify-content:flex-end;
  min-width: 160px;
}

/* Pills */
.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
  border: 1px solid transparent;
}
.pill.outline{
  background: transparent !important;
  border-color: rgba(0,0,0,0.10);
  color: rgba(30,40,70,0.86);
}
.pill.tiny{ padding: 4px 8px; font-size: 11px; font-weight: 900; }

.pill-teal{ background: rgba(35,181,168,0.16); color: #17867d; border-color: rgba(35,181,168,0.22); }
.pill-green{ background: rgba(42,183,120,0.16); color: #1b8a57; border-color: rgba(42,183,120,0.22); }
.pill-orange{ background: rgba(255,153,59,0.18); color: #cc6f10; border-color: rgba(255,153,59,0.26); }
.pill-purple{ background: rgba(136,97,255,0.16); color: #5a3cff; border-color: rgba(136,97,255,0.22); }
.pill-muted{ background: rgba(130,140,170,0.14); color: rgba(60,70,95,0.88); border-color: rgba(130,140,170,0.22); }
.pill.muted{ background: rgba(130,140,170,0.14); color: rgba(60,70,95,0.88); border-color: rgba(130,140,170,0.22); }

/* Tasks */
.actions{ display:flex; align-items:center; gap: 10px; }
.btn-soft{
  border: 1px solid rgba(79,119,255,0.22);
  background: rgba(79,119,255,0.10);
  color: #2f56ff;
  font-weight: 900;
  border-radius: 12px;
  padding: 9px 12px;
  display:flex;
  align-items:center;
  gap: 8px;
  cursor:pointer;
}
.task-list{ padding: 8px 12px 12px; }
.task{
  display:flex;
  align-items:flex-start;
  gap: 10px;
  padding: 12px 8px;
  border-radius: 14px;
}
.task:hover{ background: rgba(255,255,255,0.55); }
.task-left{
  position: relative;
  width: 18px;
  margin-top: 2px;
  flex: 0 0 auto;
}
.task-left input{
  position:absolute;
  opacity:0;
  pointer-events:none;
}
.check-ui{
  display:inline-block;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.14);
  background: rgba(255,255,255,0.65);
}
.task-left input:checked + .check-ui{
  background: rgba(47,86,255,0.14);
  border-color: rgba(47,86,255,0.35);
  box-shadow: inset 0 0 0 3px rgba(47,86,255,0.25);
}
.task-main{ flex: 1 1 auto; }
.task-title{
  font-weight: 900;
  color: rgba(25,35,65,0.92);
}
.task-meta{
  display:flex;
  align-items:center;
  gap: 10px;
  margin-top: 4px;
  font-size: 12px;
}
.task-time{ flex: 0 0 auto; }
.time-pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.55);
  font-weight: 900;
  font-size: 12px;
  color: rgba(45,55,85,0.9);
  white-space: nowrap;
}
.view-all{
  width: 100%;
  border: none;
  background: transparent;
  color: #2f56ff;
  font-weight: 900;
  padding: 10px 12px 14px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
  border-top: 1px solid rgba(0,0,0,0.06);
}

/* Schedule */
.week-strip{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px 16px 8px;
}
.day{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.50);
  min-width: 86px;
}
.day.active{
  border-color: rgba(47,86,255,0.30);
  background: rgba(47,86,255,0.10);
}
.dow{
  display:flex;
  align-items:center;
  gap: 8px;
  font-weight: 900;
  font-size: 12px;
  color: rgba(45,55,85,0.86);
}
.date{
  margin-left:auto;
  font-weight: 900;
  color: rgba(45,55,85,0.88);
}
.day.next{
  min-width: unset;
  padding: 10px 12px;
  border-radius: 14px;
  cursor:pointer;
}

.schedule-list{
  padding: 6px 12px 14px;
}
.sched{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px 10px;
  border-radius: 14px;
}
.sched:hover{ background: rgba(255,255,255,0.55); }
.dot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex: 0 0 auto;
}
.dot.blue{ background: #2f56ff; }
.dot.green{ background: #23b5a8; }

.sched-main{ flex: 1 1 auto; }
.sched-title{ font-weight: 900; }
.sched-sub{ margin-top: 3px; font-size: 12px; display:flex; gap: 10px; align-items:center; flex-wrap: wrap; }
.sched-time{ font-weight: 900; font-size: 12px; white-space: nowrap; color: rgba(45,55,85,0.86); }
.sched-go{
  border:none;
  background: transparent;
  cursor:pointer;
  color: rgba(60,70,95,0.85);
}

/* Quick resources */
.qr-grid{
  padding: 12px 12px 10px;
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.qr{
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.55);
  border-radius: 16px;
  padding: 14px;
  display:flex;
  gap: 12px;
  text-align:left;
  cursor:pointer;
}
.qr:hover{ transform: translateY(-1px); }
.qr-ico{
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 18px;
  flex: 0 0 auto;
}
.qr-title{ font-weight: 900; }
.qr-sub{ font-size: 12px; margin-top: 4px; line-height: 1.2; }

.qr-blue .qr-ico{ background: rgba(47,86,255,0.14); color: #2f56ff; }
.qr-orange .qr-ico{ background: rgba(255,140,58,0.18); color: #ff8c3a; }
.qr-blue2 .qr-ico{ background: rgba(62,120,255,0.14); color: #3e78ff; }
.qr-purple .qr-ico{ background: rgba(136,97,255,0.16); color: #6c4bff; }

.view-full{
  width: calc(100% - 24px);
  margin: 10px 12px 14px;
  border: 1px solid rgba(47,86,255,0.22);
  background: rgba(47,86,255,0.10);
  color: #2f56ff;
  font-weight: 900;
  border-radius: 14px;
  padding: 10px 12px;
  cursor:pointer;
}

/* Responsive */
@media (max-width: 1100px){
  .kpi-row{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dash-grid{ grid-template-columns: 1fr; }
}

@media (max-width: 640px){
  .dash-top{ flex-direction: column; align-items: stretch; }
  .dash-user{ justify-content: space-between; }
  .kpi-row{ grid-template-columns: 1fr; }
  .row-mid{ display:none; }
  .qr-grid{ grid-template-columns: 1fr; }
}
</style>
