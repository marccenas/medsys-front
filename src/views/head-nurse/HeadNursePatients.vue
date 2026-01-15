<template>
  <section class="hn-dash">
    <!-- Top heading -->
    <div class="dash-top">
      <div class="dash-title">
        <h1>Welcome, Sarah Thompson</h1>
        <p class="subtle">
          Head Nurse / Nurse Unit Manager <span class="sep">›</span> Misss First Manager.
        </p>
      </div>
    </div>

    <!-- KPI row -->
    <div class="kpi-row">
      <div class="kpi kpi-blue">
        <div class="kpi-left">
          <div class="kpi-label">Patients Admitted</div>
          <div class="kpi-ico"><font-awesome-icon icon="hospital-user" /></div>
        </div>
        <div class="kpi-value">32</div>
      </div>

      <div class="kpi kpi-teal">
        <div class="kpi-left">
          <div class="kpi-label">Nurses on Duty</div>
          <div class="kpi-ico"><font-awesome-icon icon="user-nurse" /></div>
        </div>
        <div class="kpi-value">10</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-left">
          <div class="kpi-label">Tasks Pending</div>
          <div class="kpi-ico"><font-awesome-icon icon="list-check" /></div>
        </div>
        <div class="kpi-value">12</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-left">
          <div class="kpi-label">Critical Alerts</div>
          <div class="kpi-ico"><font-awesome-icon icon="triangle-exclamation" /></div>
        </div>
        <div class="kpi-value">2</div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid">
      <!-- LEFT: Patient Overview + Comment/Activities BELOW it -->
      <div class="left-stack">
        <!-- Patient Overview -->
        <section class="panel glass po">
          <div class="panel-title po-title">
            <span>Patient Overview</span>
          </div>

          <div class="po-tabs">
            <button class="tab" :class="{ active: tab === 'all' }" type="button" @click="tab = 'all'">
              All Patients (32)
            </button>
            <button class="tab" :class="{ active: tab === 'icu' }" type="button" @click="tab = 'icu'">
              ICU (5)
            </button>
            <button class="tab" :class="{ active: tab === 'disc' }" type="button" @click="tab = 'disc'">
              Discharges Today (7)
            </button>
          </div>

          <div class="po-search">
            <font-awesome-icon class="po-search-ico" icon="magnifying-glass" />
            <input v-model="q" class="po-search-input" placeholder="Search..." type="text" />
          </div>

          <!-- header row -->
          <div class="po-head">
            <label class="po-check">
              <input type="checkbox" v-model="allChecked" @change="toggleAll" />
            </label>
            <div class="po-hcell">Name <font-awesome-icon class="chev" icon="chevron-down" /></div>
            <div class="po-hcell">Room <font-awesome-icon class="chev" icon="chevron-down" /></div>
            <div class="po-hcell">Status <font-awesome-icon class="chev" icon="chevron-down" /></div>
            <div class="po-hcell po-actions">Actions</div>
          </div>

          <!-- rows -->
          <div class="po-rows">
            <div class="po-row" v-for="p in filteredPatients" :key="p.id">
              <label class="po-check">
                <input type="checkbox" v-model="p.checked" />
              </label>

              <div class="po-name">
                <img class="ava" :src="p.avatar" alt="avatar" />
                <div class="name-meta">
                  <div class="name">{{ p.name }}</div>
                  <div class="sub">{{ p.sub }}</div>
                </div>
              </div>

              <div class="po-room">{{ p.room }}</div>

              <div class="po-status">
                <span class="pill" :class="p.statusClass">{{ p.status }}</span>
                <span v-if="p.note" class="note">{{ p.note }}</span>
              </div>

              <div class="po-actions">
                <button class="btn-view" type="button">
                  View <font-awesome-icon icon="chevron-right" />
                </button>
              </div>
            </div>
          </div>

          <div class="po-foot">
            <div class="subtle">Showing 1 to {{ Math.min(filteredPatients.length, 9) }} of {{ filteredPatients.length }} patients</div>
          </div>
        </section>

        <!-- ✅ Comment/Activities section BELOW the table -->
        <section class="panel glass comment-card">
          <div class="panel-title comment-title">
            <span>Comment / Activities</span>
          </div>

          <div class="comment-body">
            <div class="comment-row" v-for="c in comments" :key="c.id">
              <img class="ava sm" :src="c.avatar" alt="avatar" />
              <div class="comment-main">
                <div class="comment-head">
                  <div class="comment-name">{{ c.name }}</div>
                  <div class="comment-time">{{ c.time }}</div>
                </div>
                <div class="comment-text">{{ c.text }}</div>
              </div>
            </div>
          </div>

          <button class="center-link" type="button">
            View All Comments <font-awesome-icon icon="chevron-right" />
          </button>
        </section>
      </div>

      <!-- RIGHT column -->
      <div class="side">
        <!-- Nurse Assignments -->
        <section class="panel glass">
          <div class="panel-title side-title">
            <span>Nurse Assignments</span>
            <button class="ghost-btn" type="button">Manage Assignments</button>
          </div>

          <div class="assign-list">
            <button class="assign-item" v-for="n in nurseAssignments" :key="n.id" type="button">
              <img class="ava sm" :src="n.avatar" alt="avatar" />
              <div class="assign-mid">
                <div class="assign-name">
                  {{ n.name }}
                  <span v-if="n.badge" class="mini-badge">{{ n.badge }}</span>
                </div>
                <div class="assign-sub">{{ n.sub }}</div>
              </div>
              <div class="assign-right">
                <div class="assign-count">{{ n.count }} Patients</div>
                <font-awesome-icon class="arr" icon="chevron-right" />
              </div>
            </button>
          </div>
        </section>

        <!-- Upcoming Discharges -->
      <section class="panel glass bottom">
        <div class="panel-title side-title">
          <span>Critical Alerts</span>
          <button class="link-btn" type="button">View All</button>
        </div>

        <div class="list">
          <button class="list-item" v-for="c in critical" :key="c.id" type="button">
            <div class="list-ico warn">
              <font-awesome-icon icon="triangle-exclamation" />
            </div>
            <div class="list-mid">
              <div class="list-title">{{ c.title }}</div>
              <div class="list-sub">{{ c.sub }}</div>
            </div>
            <div class="time">{{ c.time }}</div>
          </button>
        </div>

        <button class="center-link" type="button">
          View All Alerts <font-awesome-icon icon="chevron-right" />
        </button>
      </section>
        <section class="panel glass">
          <div class="panel-title side-title">
            <span>Upcoming Discharges</span>
            <button class="link-btn" type="button">View All</button>
          </div>

          <div class="disc-list">
            <button class="disc-item" v-for="d in discharges" :key="d.id" type="button">
              <div class="disc-ico" :class="d.icoClass">
                <font-awesome-icon icon="clipboard-list" />
              </div>
              <div class="disc-mid">
                <div class="disc-name">{{ d.name }}</div>
                <div class="disc-sub">{{ d.sub }}</div>
              </div>
              <div class="disc-time">
                <font-awesome-icon class="trend" :icon="d.trendIcon" />
                <span>{{ d.time }}</span>
                <font-awesome-icon class="arr" icon="chevron-right" />
              </div>
            </button>
          </div>
        </section>
      </div>

      <!-- Bottom 3 cards -->
      <section class="panel glass bottom">
        <div class="panel-title">
          <span>Recent Activities</span>
        </div>

        <div class="list">
          <button class="list-item" v-for="a in activities" :key="a.id" type="button">
            <div class="list-ico" :class="a.icoClass">
              <font-awesome-icon icon="file-lines" />
            </div>
            <div class="list-mid">
              <div class="list-title">{{ a.title }}</div>
              <div class="list-sub">{{ a.sub }}</div>
            </div>
            <font-awesome-icon class="arr" icon="chevron-right" />
          </button>
        </div>

        <button class="center-link" type="button">
          View All Activities <font-awesome-icon icon="chevron-right" />
        </button>
      </section>

      <section class="panel glass bottom">
        <div class="panel-title">
          <span>Staff Performance</span>
        </div>

        <div class="list">
          <button class="list-item" v-for="s in staffPerformance" :key="s.id" type="button">
            <img class="avatar" :src="s.avatar" alt="" />
            <div class="list-mid">
              <div class="list-title">{{ s.name }}</div>
              <div class="list-sub">{{ s.sub }}</div>
            </div>
            <font-awesome-icon class="chev" icon="chevron-right" />
          </button>
        </div>
      </section>

    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const tab = ref("all");
const q = ref("");

const patients = ref([
  {
    id: 1,
    checked: false,
    name: "Laura Williams",
    sub: "Mid Align Tasks",
    room: "102A",
    status: "Outpatient",
    statusClass: "out",
    note: "",
    avatar: "https://i.pravatar.cc/64?img=47",
  },
  {
    id: 2,
    checked: false,
    name: "Ethan Rivera",
    sub: "Prent. Rere",
    room: "104A",
    status: "Inpatient",
    statusClass: "in",
    note: "ICU-2 • Oxygen Therapy, Radius",
    avatar: "https://i.pravatar.cc/64?img=12",
  },
  {
    id: 3,
    checked: false,
    name: "Megan Richards",
    sub: "Aduh Olio Tgaw",
    room: "105B",
    status: "Vital Signs",
    statusClass: "vs",
    note: "due at 2:00 PM",
    avatar: "https://i.pravatar.cc/64?img=32",
  },
  {
    id: 4,
    checked: false,
    name: "Olivia Harris",
    sub: "Karrts Today",
    room: "ICU-3",
    status: "Discharge Today",
    statusClass: "disc",
    note: "",
    avatar: "https://i.pravatar.cc/64?img=56",
  },
  {
    id: 5,
    checked: false,
    name: "Robert Lee",
    sub: "Karen Brooks, RN",
    room: "106A",
    status: "Wounds dressing",
    statusClass: "wd",
    note: "4:30 AM • Easte Swwerview",
    avatar: "https://i.pravatar.cc/64?img=18",
  },
]);

const filteredPatients = computed(() => {
  const s = q.value.trim().toLowerCase();
  if (!s) return patients.value;
  return patients.value.filter((p) => p.name.toLowerCase().includes(s));
});

/* header checkbox */
const allChecked = ref(false);
function toggleAll() {
  patients.value = patients.value.map((p) => ({ ...p, checked: allChecked.value }));
}
watch(
  () => patients.value.map((p) => p.checked),
  (vals) => {
    const all = vals.length > 0 && vals.every(Boolean);
    const none = vals.every((v) => !v);
    if (all) allChecked.value = true;
    if (none) allChecked.value = false;
  },
  { deep: true }
);

const staffPerformance = ref([
  {
    id: 1,
    name: "Nicole Reed, RN",
    sub: "Hcast Brooks, RN",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    id: 2,
    name: "Sarah Mitchell, RN",
    sub: "Saper Brooks, RN",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    id: 3,
    name: "Katie Nguyen, RN",
    sub: "Karen Brooks, MD",
    avatar: "https://i.pravatar.cc/80?img=44",
  },
]);


const nurseAssignments = ref([
  { id: 1, name: "Nicole Reed, RN", sub: "Laroa MUPatients", count: 4, badge: "", avatar: "https://i.pravatar.cc/64?img=21" },
  { id: 2, name: "Sarah Mitchell, RN", sub: "Icole Brooks", count: 3, badge: "CL Lead", avatar: "https://i.pravatar.cc/64?img=49" },
  { id: 3, name: "Karen Brooks, RN", sub: "Arogad Thukcen", count: 5, badge: "", avatar: "https://i.pravatar.cc/64?img=33" },
  { id: 4, name: "Katie Nguyen, RN", sub: "Katie Nguyen, RN", count: 2, badge: "", avatar: "https://i.pravatar.cc/64?img=55" },
  { id: 5, name: "Dr. Ryan Lewis, RN", sub: "Dr. Ryan Lewis, MD", count: 2, badge: "", avatar: "https://i.pravatar.cc/64?img=14" },
]);

const discharges = ref([
  { id: 1, name: "Olivia Harris (ICU-3)", sub: "B gricing ad e-ipe us divtics", time: "10:00 AM", trendIcon: "arrow-trend-up", icoClass: "blue" },
  { id: 2, name: "William Clark (ICU-1)", sub: "Oreiopssing provtitim prcseas", time: "11:00 AM", trendIcon: "arrow-trend-up", icoClass: "teal" },
]);

const activities = ref([
  { id: 1, title: "Cleo Anderson (ICU-3) discharged 10:00AM", sub: "Qiasen Theraw", icon: "clipboard-check", icoClass: "green" },
  { id: 2, title: "Ethan Rivera received Oxygen Therapy 9:00", sub: "Pee 3h Oatk", icon: "lungs", icoClass: "blue" },
  { id: 3, title: "William Clark 6; discharge paperwork 8:00", sub: "By fstip Phyician", icon: "file-lines", icoClass: "orange" },
]);

const staffPerf = ref([
  { id: 1, name: "Nicole Reed, RN", sub: "Hcast Brooks, RN", icoClass: "blue" },
  { id: 2, name: "Sarah Mitchell, RN", sub: "Saper Brooks, RN", icoClass: "teal" },
  { id: 3, name: "Katie Nguyen, RN", sub: "Karen Brooks, MD", icoClass: "purple" },
]);

const critical = ref([
  { id: 1, title: "Ethan Rivera", sub: "Raw 10th • 7h ago", time: "7m ago" },
  { id: 2, title: "William Clark", sub: "Reposition 10 Ventilation", time: "1 hour ago" },
]);

/* ✅ new comment/activity data below patient table */
const comments = ref([
  {
    id: 1,
    name: "Emily Davis - RN",
    time: "1m ago",
    text: "Patient: David Harris needs to be repositioned and have his IV line changed. Please handle it ASAP.",
    avatar: "https://i.pravatar.cc/64?img=15",
  },
  {
    id: 2,
    name: "Dr. Sarah Mitchell",
    time: "12m ago",
    text: "Please monitor vitals for ICU-3 patients and update the discharge summary before noon.",
    avatar: "https://i.pravatar.cc/64?img=49",
  },
]);
</script>

<style scoped>
/* ===== base spacing ===== */
.hn-dash{ padding: 18px 18px 24px; }
.sep{ margin: 0 6px; opacity: .55; }
.dash-title h1{ margin:0; font-size: 32px; font-weight: 300; letter-spacing: -0.02em; }
.dash-title p{ margin: 8px 0 0; font-size: 14px; }
.glass{ backdrop-filter: blur(10px); }

/* ===== KPI ===== */
.kpi-row{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 14px 0 14px;
}
.kpi{
  border-radius: 14px;
  padding: 14px 16px;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:space-between;
  box-shadow: 0 10px 24px rgba(0,0,0,0.10);
  min-height: 72px;
}
.kpi-left{ display:flex; flex-direction:column; gap: 8px; }
.kpi-label{ font-weight: 700; font-size: 15px; opacity: 0.95; }
.kpi-ico{ opacity:.9; font-size: 16px; }
.kpi-value{ font-weight: 300; font-size: 40px; line-height: 1; letter-spacing: -0.03em; }

.kpi-blue{ background: linear-gradient(135deg, #4f77ff, #2f56ff); }
.kpi-teal{ background: linear-gradient(135deg, #4cc3b8, #1a8e84); }
.kpi-orange{ background: linear-gradient(135deg, #ffbf70, #ff8c3a); }
.kpi-red{ background: linear-gradient(135deg, #ff6c6c, #ff4a4a); }

/* ===== Main grid ===== */
.grid{
  display:grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 14px;
  align-items:start;
}

.avatar{
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  flex: 0 0 auto;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.65);
}

.left-stack{ display:grid; gap: 14px; }

/* panel fallback (your base.css already has .panel) */
.panel{
  border: 1px solid var(--line);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78));
  box-shadow: var(--panel-glow), var(--panel-shadow);
  overflow:hidden;
}
.panel-title{
  padding: 12px 14px;
  font-weight: 700;
  border-bottom: 1px solid rgba(226,232,244,0.85);
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.75));
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
}

/* ===== Patient Overview ===== */
.po-tabs{
  padding: 10px 12px 0;
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}
.tab{
  border: 1px solid rgba(160,170,200,0.35);
  background: rgba(255,255,255,0.55);
  border-radius: 10px;
  padding: 9px 12px;
  font-weight: 700;
  color: rgba(40,55,90,0.75);
  cursor:pointer;
}
.tab.active{
  background: rgba(47,86,255,0.14);
  border-color: rgba(47,86,255,0.22);
  color: #2f56ff;
}

.po-search{ margin: 10px 12px 12px; position: relative; }
.po-search-ico{
  position:absolute;
  left: 12px; top: 50%;
  transform: translateY(-50%);
  opacity: .55;
}
.po-search-input{
  width: 100%;
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  outline:none;
  padding: 0 12px 0 38px;
}

.po-head{
  display:grid;
  grid-template-columns: 36px 1.15fr 0.6fr 1fr 0.7fr;
  align-items:center;
  gap: 10px;
  padding: 10px 12px;
  border-top: 1px solid rgba(226,232,244,0.85);
  border-bottom: 1px solid rgba(226,232,244,0.85);
  background: rgba(255,255,255,0.35);
  font-weight: 700;
  color: rgba(60,75,110,0.70);
}
.po-hcell{ display:flex; align-items:center; gap: 8px; }
.chev{ font-size: 12px; opacity: .7; }

.po-rows{ padding: 6px 0; }
.po-row{
  display:grid;
  grid-template-columns: 36px 1.15fr 0.6fr 1fr 0.7fr;
  align-items:center;
  gap: 10px;
  padding: 12px 12px;
  border-bottom: 1px solid rgba(226,232,244,0.70);
}
.po-row:last-child{ border-bottom: none; }

.po-check{ display:flex; align-items:center; justify-content:center; }
.po-check input{ width: 16px; height: 16px; }

.po-name{ display:flex; align-items:center; gap: 10px; min-width:0; }
.ava{
  width: 38px; height: 38px;
  border-radius: 999px;
  object-fit: cover;
  box-shadow: 0 8px 16px rgba(0,0,0,0.10);
}
.ava.sm{ width: 34px; height: 34px; }

.name-meta{ min-width:0; }
.name{ font-weight: 700; white-space: nowrap; overflow:hidden; text-overflow: ellipsis; }
.sub{ font-size: 12px; color: rgba(90,105,140,0.85); white-space: nowrap; overflow:hidden; text-overflow: ellipsis; }

.po-room{ font-weight: 600; color: rgba(40,55,90,0.78); }

.po-status{ display:flex; align-items:center; gap: 10px; flex-wrap: wrap; }
.pill{
  display:inline-flex;
  align-items:center;
  padding: 5px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid rgba(255,255,255,0.35);
  box-shadow: 0 10px 16px rgba(0,0,0,0.06);
}
.pill.out{ background: rgba(35,181,168,0.18); border: 1px solid rgba(35,181,168,0.18); color: rgba(10,90,80,0.95); }
.pill.in{ background: rgba(255,140,58,0.18); border: 1px solid rgba(255,140,58,0.18); color: rgba(120,55,10,0.92); }
.pill.vs{ background: rgba(79,119,255,0.18); border: 1px solid rgba(79,119,255,0.18); color: rgba(30,55,150,0.95); }
.pill.disc{ background: rgba(122,92,255,0.18); border: 1px solid rgba(122,92,255,0.18); color: rgba(55,35,150,0.95); }
.pill.wd{ background: rgba(160,140,255,0.14); border: 1px solid rgba(160,140,255,0.18); color: rgba(55,35,150,0.85); }

.note{
  font-size: 12px;
  color: rgba(85,100,135,0.86);
  white-space: nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}

.btn-view{
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(47,86,255,0.25);
  background: rgba(79,119,255,0.18);
  color: rgba(30,55,150,0.95);
  font-weight: 700;
  cursor: pointer;
  display:inline-flex;
  align-items:center;
  gap: 8px;
}

.po-foot{ padding: 10px 12px 12px; }

/* ===== Comment card below patient overview ===== */
.comment-body{ padding: 10px 12px 6px; }
.comment-row{
  display:flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(226,232,244,0.70);
}
.comment-row:last-child{ border-bottom: none; }

.comment-main{ min-width:0; flex:1; }
.comment-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
}
.comment-name{ font-weight: 800; color: rgba(30,40,70,0.92); }
.comment-time{ font-size: 12px; font-weight: 800; color: rgba(90,105,140,0.85); }
.comment-text{
  margin-top: 4px;
  font-size: 13px;
  color: rgba(60,75,110,0.88);
  line-height: 1.35;
}

/* ===== Right column ===== */
.side{ display:grid; gap: 14px; grid-column: 2 / 3; }
.link-btn{
  border: none;
  background: transparent;
  font-weight: 800;
  color: #2f56ff;
  cursor: pointer;
}
.ghost-btn{
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  font-weight: 800;
  color: rgba(40,55,90,0.75);
  cursor:pointer;
}

.assign-list{ padding: 6px 0; }
.assign-item{
  width:100%;
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-bottom: 1px solid rgba(226,232,244,0.70);
  text-align:left;
}
.assign-item:last-child{ border-bottom:none; }
.assign-mid{ min-width:0; flex:1; }
.assign-name{ font-weight: 800; display:flex; align-items:center; gap: 8px; }
.assign-sub{ font-size: 12px; color: rgba(90,105,140,0.85); }
.mini-badge{
  font-size: 11px;
  font-weight: 900;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(47,86,255,0.14);
  border: 1px solid rgba(47,86,255,0.18);
  color: #2f56ff;
}
.assign-right{
  display:flex;
  align-items:center;
  gap: 10px;
  color: rgba(70,85,120,0.80);
  font-weight: 800;
  white-space: nowrap;
}
.arr{ opacity: .7; }

.disc-list{ padding: 6px 0; }
.disc-item{
  width:100%;
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-bottom: 1px solid rgba(226,232,244,0.70);
  text-align:left;
}
.disc-item:last-child{ border-bottom:none; }

.disc-ico{
  width: 34px; height: 34px;
  border-radius: 10px;
  display:grid;
  place-items:center;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.55);
}
.disc-ico.blue{ background: rgba(79,119,255,0.18); border-color: rgba(79,119,255,0.18); color: rgba(30,55,150,0.95); }
.disc-ico.teal{ background: rgba(35,181,168,0.18); border-color: rgba(35,181,168,0.18); color: rgba(10,90,80,0.95); }

.disc-mid{ min-width:0; flex:1; }
.disc-name{ font-weight: 800; }
.disc-sub{ font-size: 12px; color: rgba(90,105,140,0.85); white-space: nowrap; overflow:hidden; text-overflow: ellipsis; }

.disc-time{
  display:flex;
  align-items:center;
  gap: 8px;
  font-weight: 800;
  color: rgba(70,85,120,0.80);
  white-space: nowrap;
}
.trend{ opacity: .75; }

/* ===== Bottom 3 panels ===== */
.bottom{ min-height: 240px; grid-column: 1 / 2; }
.list{ padding: 6px 0; }
.list-item{
  width:100%;
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-bottom: 1px solid rgba(226,232,244,0.70);
  text-align:left;
}
.list-item:last-child{ border-bottom:none; }

.list-ico{
  width: 34px; height: 34px;
  display:grid;
  place-items:center;
}
.list-ico.blue{ background: rgba(79,119,255,0.18); border-color: rgba(79,119,255,0.18); }
.list-ico.teal{ background: rgba(35,181,168,0.18); border-color: rgba(35,181,168,0.18); }
.list-ico.green{ background: rgba(67,200,159,0.18); border-color: rgba(67,200,159,0.18); }
.list-ico.purple{ background: rgba(122,92,255,0.18); border-color: rgba(122,92,255,0.18); }
.list-ico.orange{ background: rgba(255,140,58,0.18); border-color: rgba(255,140,58,0.18); }
.list-ico.warn{ background: rgba(255,76,76,0.14); border-color: rgba(255,76,76,0.18); }

.list-mid{ min-width:0; flex:1; }
.list-title{ font-weight: 800; }
.list-sub{ font-size: 12px; color: rgba(90,105,140,0.85); white-space: nowrap; overflow:hidden; text-overflow: ellipsis; }

.time{ font-size: 12px; color: rgba(90,105,140,0.85); font-weight: 800; white-space: nowrap; }

.center-link{
  width:100%;
  border:none;
  background: transparent;
  padding: 10px 0 14px;
  color:#2f56ff;
  font-weight: 900;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}

/* ===== Responsive ===== */
@media (max-width: 1180px){
  .kpi-row{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid{ grid-template-columns: 1fr; }
}
@media (max-width: 640px){
  .kpi-row{ grid-template-columns: 1fr; }
  .po-head, .po-row{
    grid-template-columns: 30px 1fr;
    row-gap: 8px;
  }
  .po-room, .po-status, .po-actions{ grid-column: 2 / 3; }
}
</style>
