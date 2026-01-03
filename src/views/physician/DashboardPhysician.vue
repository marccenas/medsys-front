<template>
  <div class="phys-dashboard">
    <!-- KPI ROW -->
    <section class="kpis">
      <div class="kpi kpi-blue">
        <div class="kpi-left">
          <span class="kpi-bullet"></span>
          <div class="kpi-title">Today's Appointments</div>
        </div>
        <div class="kpi-value">8</div>
      </div>

      <div class="kpi kpi-teal">
        <div class="kpi-left">
          <span class="kpi-bullet"></span>
          <div class="kpi-title">Pending Lab Results</div>
        </div>
        <div class="kpi-value">6</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-left">
          <span class="kpi-bullet"></span>
          <div class="kpi-title">New Patient Cases</div>
        </div>
        <div class="kpi-value">4</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-left">
          <span class="kpi-bullet"></span>
          <div class="kpi-title">Follow-Up Tasks</div>
        </div>
        <div class="kpi-value">5</div>
      </div>
    </section>

    <!-- GRID -->
    <section class="grid">
      <!-- LEFT -->
      <div class="col">
        <!-- My Schedule -->
        <div class="card">
          <div class="card-head">
            <div class="card-title">My Schedule</div>
          </div>

          <div class="tabs">
            <button class="tab active" type="button">Today</button>
            <button class="tab" type="button">MON</button>
            <button class="tab" type="button">21</button>
            <button class="tab" type="button">22</button>
            <button class="tab" type="button">THU</button>
            <button class="tab" type="button">WES</button>
            <button class="tab" type="button">TUE</button>
            <button class="tab" type="button">WED</button>
            <button class="tab" type="button">FRI</button>
          </div>

          <div class="list">
            <div class="row" v-for="(r, i) in schedule" :key="i">
              <div class="time">
                <span class="time-ic"></span>
                {{ r.time }}
              </div>
              <div class="who">{{ r.name }}</div>
              <div class="type muted">{{ r.type }}</div>
            </div>
          </div>
        </div>

        <!-- Recent Patients (table) -->
        <div class="card">
          <div class="card-head">
            <div class="card-title">Recent Patients</div>
          </div>

          <div class="mini-table">
            <div class="mini-head">
              <div class="c-check"><input class="chk" type="checkbox" /></div>

              <div class="c-name">
                Name
                <font-awesome-icon class="mini-caret" icon="chevron-down" />
              </div>

              <div class="c-email">
                Email
                <font-awesome-icon class="mini-caret" icon="chevron-down" />
              </div>

              <div class="c-role">
                Role
                <font-awesome-icon class="mini-caret" icon="chevron-down" />
              </div>

              <div class="c-status">
                Status
                <font-awesome-icon class="mini-caret" icon="chevron-down" />
              </div>
            </div>

            <div class="mini-row" v-for="(p, i) in samplePatients" :key="i">
              <div class="c-check"><input class="chk" type="checkbox" /></div>

              <div class="c-name">
                <div class="namecell">
                  <img class="av" :src="`https://i.pravatar.cc/80?img=${10 + i}`" alt="" />
                  <div class="nm">{{ p.name }}</div>
                </div>
              </div>

              <div class="c-email">
                <a class="link" href="#" @click.prevent>{{ p.email }}</a>
              </div>

              <div class="c-role muted">{{ p.role }}</div>

              <div class="c-status">
                <span class="pill">Active</span>
              </div>
            </div>

            <!-- footer like screenshot -->
            <div class="mini-foot">
              <div class="muted">Showing 1 to 5 of 58 accounts</div>
              <div class="pager">
                <button class="pg" type="button">‹</button>
                <button class="pg active" type="button">1</button>
                <button class="pg" type="button">2</button>
                <button class="pg" type="button">3</button>
                <span class="dots">…</span>
                <button class="pg" type="button">6</button>
                <div class="per">
                  <span class="muted">10 pags</span>
                  <font-awesome-icon class="mini-caret" icon="chevron-down" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="col">
        <!-- Alerts & Actions -->
        <div class="card">
          <div class="card-head">
            <div class="card-title">Alerts & Actions</div>
          </div>

          <div class="alerts">
            <div class="alert" v-for="(a, i) in alerts" :key="i">
              <input class="chk" type="checkbox" checked />
              <div class="alert-text">{{ a.text }}</div>
              <span class="tag" :class="a.tagClass">{{ a.tag }}</span>
            </div>

            <button class="cta" type="button">Create Account</button>
          </div>
        </div>

        <!-- Lab Results Overview -->
        <div class="card">
          <div class="card-head">
            <div class="card-title">Lab Results Overview</div>
          </div>

          <div class="lab">
            <div class="legend">
              <div class="leg-row" v-for="item in labItems" :key="item.label">
                <span class="sw" :style="{ background: item.color }"></span>
                <span class="leg-label">{{ item.label }}</span>
                <b class="leg-val">{{ item.value }}</b>
              </div>

              <button class="mini-cta" type="button">View Report</button>
            </div>

            <div class="donut-wrap">
              <LabResultsDonut
                :items="[
                  { label: 'Normal', value: 15, color: '#2F86FF' },
                  { label: 'Pending', value: 5,  color: '#6EE7E6' },
                  { label: 'Abnormal', value: 7, color: '#F6B24A' },
                  { label: 'Critical', value: 3, color: '#FF6B6B' },
                ]"
              />
            </div>
          </div>
        </div>

        <!-- Recent Patients (list) -->
        <div class="card">
          <div class="card-head">
            <div class="card-title">Recent Patients</div>
          </div>

          <div class="recent-list">
            <div class="rp" v-for="(r, i) in recentPatients" :key="i">
              <img class="av" :src="r.avatar" alt="" />
              <div class="rp-mid">
                <div class="rp-name">{{ r.name }}</div>
                <div class="rp-sub muted">{{ r.type }}</div>
              </div>
              <div class="rp-time muted">{{ r.time }}</div>
              <button class="view-mini" type="button">
                View
                <font-awesome-icon class="mini-caret" icon="chevron-down" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import LabResultsDonut from "@/components/charts/LabResultsDonut.vue";

const schedule = [
  { time: "9:00 AM", name: "Laura Williams", type: "Follow-Up" },
  { time: "10:00 AM", name: "Mark Johnson", type: "New Consult" },
  { time: "11:00 AM", name: "Cleo Anderson", type: "Follow-Up" },
  { time: "1:00 PM", name: "Ethan Rivera", type: "Routine Checkup" },
];

const samplePatients = [
  { name: "John Evans", email: "john.evans@abc.com", role: "Ultra Admin" },
  { name: "Dr. Sarah M.", email: "dr-sarah.m@abc.com", role: "New Consult" },
  { name: "Dr. William P.", email: "dr-william@abc.com", role: "Resident Doctor" },
  { name: "Michael Reynolds", email: "michael.red@sssc", role: "Intern Doctor" },
  { name: "Karen S.", email: "karen.s@sting/auagra", role: "Head Nurse" },
];

const alerts = [
  { text: "Review lab results for Cleo Anderson", tag: "High", tagClass: "tag-red" },
  { text: "Approve medication refill for Mark Johnson", tag: "Normal", tagClass: "tag-green" },
  { text: "Call Laura Williams for follow-up", tag: "Call", tagClass: "tag-orange" },
];

const recentPatients = [
  {
    name: "Laura Williams",
    type: "Follow-Up",
    time: "9:00AM  Today",
    avatar: "https://i.pravatar.cc/80?img=22",
  },
  {
    name: "Mark Johnson",
    type: "New Consult",
    time: "10:00AM  Today",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
];

const labItems = [
  { label: "Normal", value: 15, color: "#2f86ff" },
  { label: "Pending", value: 5, color: "#57d6c9" },
  { label: "Abnormal", value: 7, color: "#ffb15a" },
  { label: "Critical", value: 3, color: "#ff5a5a" },
];
</script>

<style scoped>
/* page wrapper (match screenshot airy layout) */
.phys-dashboard{
  width: 100%;
  padding-top: 2px;
}

/* KPI row */
.kpis{
  display:grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}

.kpi{
  border-radius: 8px;
  padding: 14px 16px;
  color:#fff;
  box-shadow: 0 14px 26px rgba(17,36,80,.14);
  display:flex;
  justify-content:space-between;
  align-items:center;
  position: relative;
  overflow: hidden;
}
.kpi::after{
  content:"";
  position:absolute;
  inset:0;
  background: radial-gradient(circle at 18% 35%, rgba(255,255,255,.18), transparent 55%);
  pointer-events:none;
}
.kpi-left{
  display:flex;
  align-items:center;
  gap:10px;
  min-width: 0;
}
.kpi-title{
  font-weight: 800;
  font-size: 15px;
  opacity:.95;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kpi-value{
  font-size: 40px;
  font-weight: 950;
  letter-spacing:-.02em;
  line-height: 1;
  text-shadow: 0 10px 18px rgba(0,0,0,.15);
}
.kpi-bullet{
  width:10px; height:10px;
  border-radius:999px;
  background: rgba(255,255,255,.55);
  box-shadow: 0 0 0 3px rgba(255,255,255,.18);
}

.kpi-blue{ background: linear-gradient(90deg, #6aa8ff, #3f7fff); }
.kpi-teal{ background: linear-gradient(90deg, #57d6c9, #33b9ae); }
.kpi-red{ background: linear-gradient(90deg, #ff7e7e, #ff5a5a); }
.kpi-orange{ background: linear-gradient(90deg, #ffb15a, #ff8e3d); }

/* Grid */
.grid{
  display:grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 14px;
  align-items:start;
}
.col{ display:flex; flex-direction:column; gap: 14px; }

/* Cards: softer like screenshot */
.card{
  background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.90));
  border-radius: 10px;
  border: 1px solid rgba(45,78,140,.14);
  box-shadow: 0 18px 38px rgba(17,36,80,.10);
  overflow:hidden;
}
.card-head{
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(248,251,255,.96), rgba(245,249,255,.80));
  border-bottom: 1px solid rgba(45,78,140,.10);
}
.card-title{
  font-weight: 900;
  color:#273451;
  letter-spacing: .2px;
}

/* Schedule tabs (pill bar look) */
.tabs{
  display:flex;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(45,78,140,.08);
  flex-wrap:wrap;
  background: linear-gradient(180deg, rgba(246,249,255,.95), rgba(244,248,255,.80));
}
.tab{
  border:1px solid rgba(45,78,140,.14);
  background:#f6f8ff;
  color:#41506b;
  font-weight:900;
  border-radius: 6px;
  padding: 8px 12px;
  cursor:pointer;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.75);
}
.tab.active{
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  border-color: rgba(255,255,255,.15);
  color:#fff;
  box-shadow: 0 10px 18px rgba(47,134,255,.22);
}

/* schedule list */
.list{ padding: 8px 12px 12px; }
.row{
  display:grid;
  grid-template-columns: 140px 1fr 160px;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 10px;
}
.row:hover{ background: rgba(246,248,255,.85); }
.time{
  display:flex;
  align-items:center;
  gap:10px;
  font-weight:900;
  color:#2b3a5b;
}
.time-ic{
  width:18px; height:18px;
  border-radius:999px;
  background: rgba(47,134,255,.12);
  border: 1px solid rgba(47,134,255,.22);
  position: relative;
}
.time-ic::after{
  content:"";
  position:absolute;
  inset:5px;
  border-radius:999px;
  background: rgba(47,134,255,.55);
}
.who{ font-weight:900; color:#1f2a44; }
.muted{ color:#6b7a95; font-weight:800; }

/* Mini table */
.chk{ width:16px; height:16px; accent-color:#2f86ff; }
.mini-table{ width:100%; }
.mini-head, .mini-row{
  display:grid;
  grid-template-columns: 44px 1.2fr 1.6fr 1.1fr 0.8fr;
  align-items:center;
}
.mini-head{
  background: linear-gradient(180deg, rgba(243,246,255,1), rgba(240,244,255,.9));
  color:#43506b;
  font-weight:950;
  font-size: 12px;
  border-bottom: 1px solid rgba(45,78,140,.12);
  padding: 10px 10px;
}
.mini-row{
  padding: 10px 10px;
  border-bottom: 1px solid rgba(45,78,140,.08);
}
.mini-row:hover{ background: rgba(248,250,255,.9); }
.mini-caret{ font-size: 11px; opacity:.65; margin-left: 6px; }
.namecell{ display:flex; align-items:center; gap: 10px; }
.av{ width:30px; height:30px; border-radius:999px; border:2px solid #dbe6ff; object-fit:cover; }
.nm{ font-weight: 900; color:#1f2a44; }
.link{ color:#2f86ff; font-weight:950; text-decoration:none; }
.link:hover{ text-decoration:underline; }

.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(44,214,175,.16);
  border: 1px solid rgba(44,214,175,.30);
  color:#1b8f79;
  font-weight:950;
  font-size: 12px;
}

/* table footer */
.mini-foot{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 10px;
  padding: 10px 10px;
  background: linear-gradient(180deg, rgba(248,251,255,.95), rgba(245,249,255,.82));
}
.pager{ display:flex; align-items:center; gap: 6px; }
.pg{
  border:1px solid rgba(45,78,140,.18);
  background:#f6f8ff;
  color:#2b3a5b;
  border-radius:6px;
  height:28px;
  min-width:28px;
  padding: 0 10px;
  cursor:pointer;
  font-weight:950;
}
.pg.active{ background:#2f86ff; border-color:#2f86ff; color:#fff; }
.dots{ color:#6b7a95; font-weight:950; padding: 0 4px; }
.per{
  display:flex; align-items:center; gap: 8px;
  border:1px solid rgba(45,78,140,.18);
  background:#f6f8ff;
  border-radius: 8px;
  padding: 6px 10px;
  font-weight:950;
}

/* Alerts */
.alerts{ padding: 10px 12px 12px; display:flex; flex-direction:column; gap: 10px; }
.alert{
  display:flex;
  align-items:center;
  gap: 10px;
  background: linear-gradient(180deg, rgba(246,248,255,1), rgba(244,246,255,.92));
  border:1px solid rgba(45,78,140,.14);
  border-radius: 10px;
  padding: 10px 10px;
}
.alert-text{ flex:1; font-weight:950; color:#2b3a5b; }
.tag{
  font-weight:950;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  min-width: 72px;
  text-align:center;
}
.tag-red{ background: rgba(255,90,90,.18); border-color: rgba(255,90,90,.30); color:#b42318; }
.tag-green{ background: rgba(44,214,175,.16); border-color: rgba(44,214,175,.30); color:#1b8f79; }
.tag-orange{ background: rgba(255,177,90,.18); border-color: rgba(255,177,90,.32); color:#b56a14; }

.cta{
  margin-top: 2px;
  border:0;
  width:100%;
  padding: 11px 12px;
  border-radius: 8px;
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
  font-weight:950;
  cursor:pointer;
  box-shadow: 0 14px 28px rgba(47,134,255,.22);
}

/* Lab */
.lab{
  display:grid;
  grid-template-columns: 1fr 260px;
  gap: 12px;
  padding: 12px;
  align-items:center;
}
.legend{ display:flex; flex-direction:column; gap: 10px; }
.leg-row{ display:flex; align-items:center; gap: 10px; font-weight:900; color:#2b3a5b; }
.leg-label{ opacity: .95; }
.leg-val{ margin-left:auto; color:#2b3a5b; }
.sw{
  width:14px; height:14px; border-radius: 4px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.35);
}
.sw.sm{ width:10px; height:10px; border-radius: 3px; }

.mini-cta{
  margin-top: 6px;
  border:1px solid rgba(45,78,140,.14);
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
  font-weight:950;
  border-radius: 8px;
  padding: 10px 12px;
  cursor:pointer;
  box-shadow: 0 12px 22px rgba(47,134,255,.18);
}

.donut-wrap{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap: 10px;
}
.donut-legend-inline{
  display:flex;
  gap: 10px;
  flex-wrap:wrap;
  justify-content:center;
}
.dl-item{
  display:flex;
  align-items:center;
  gap: 8px;
  font-weight:900;
  color:#2b3a5b;
}
.dl-label{ font-size: 12px; opacity: .9; }
.dl-pill{
  font-size: 12px;
  font-weight: 950;
  background: rgba(45,78,140,.10);
  border: 1px solid rgba(45,78,140,.14);
  padding: 2px 8px;
  border-radius: 999px;
}

/* Recent list */
.recent-list{ padding: 10px 12px 12px; display:flex; flex-direction:column; gap: 10px; }
.rp{
  display:grid;
  grid-template-columns: 40px 1fr 140px 110px;
  align-items:center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 10px;
  border: 1px solid rgba(45,78,140,.10);
  background: linear-gradient(180deg, rgba(246,248,255,1), rgba(244,246,255,.92));
}
.rp-name{ font-weight:950; color:#1f2a44; }
.view-mini{
  border:0;
  border-radius: 8px;
  padding: 10px 12px;
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
  font-weight:950;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
  box-shadow: 0 12px 22px rgba(47,134,255,.18);
}

/* Responsive */
@media (max-width: 1100px){
  .kpis{ grid-template-columns: repeat(2, minmax(180px, 1fr)); }
  .grid{ grid-template-columns: 1fr; }
  .lab{ grid-template-columns: 1fr; }
  .donut-wrap{ align-items:flex-start; }
}
</style>
