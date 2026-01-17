<template>
  <div class="pot">
    <!-- Header -->
    <div class="pot-head">
      <div>
        <h2 class="pot-title">Physical &amp; Occupational Therapy Dashboard</h2>
        <div class="pot-sub">
          <span class="pot-sub-strong">Patients Overview</span>
          <span class="pot-sub-sep">›</span>
          <span>Monitor and manage therapy activities.</span>
        </div>
      </div>
    </div>

    <!-- KPI Row -->
    <section class="pot-kpis">
      <div class="pot-kpi blue">
        <div class="pot-kpi-left">
          <div class="pot-kpi-label">Total Patients</div>
          <div class="pot-kpi-ico">👥</div>
        </div>
        <div class="pot-kpi-value">{{ kpiPatients }}</div>
      </div>

      <div class="pot-kpi teal">
        <div class="pot-kpi-left">
          <div class="pot-kpi-label">Sessions Today</div>
          <div class="pot-kpi-ico">📅</div>
        </div>
        <div class="pot-kpi-value">{{ kpiSessions }}</div>
      </div>

      <div class="pot-kpi orange">
        <div class="pot-kpi-left">
          <div class="pot-kpi-label">Upcoming Re-Evals</div>
          <div class="pot-kpi-ico">🗂</div>
        </div>
        <div class="pot-kpi-value">{{ kpiUpcoming }}</div>
      </div>

      <div class="pot-kpi pink">
        <div class="pot-kpi-left">
          <div class="pot-kpi-label">New Referrals</div>
          <div class="pot-kpi-ico">📌</div>
        </div>
        <div class="pot-kpi-value">{{ kpiReferrals }}</div>
      </div>
    </section>

    <!-- Row 1: Progress Overview + Patient Balance -->
    <section class="pot-row1">
      <!-- Progress Overview -->
      <div class="pot-card">
        <div class="pot-card-head">
          <div class="pot-card-title">Progress Overview</div>
          <button class="pot-link" type="button" @click="viewProgress">46 out of 669 ›</button>
        </div>

        <div class="pot-progress">
          <!-- donut -->
          <div class="pot-donut">
            <div class="pot-ring" :style="ringStyle"></div>
            <div class="pot-center">
              <div class="pot-pct">{{ progressPct }}%</div>
            </div>
            <div class="pot-donut-foot muted">Total Orders • {{ kpiPatients }}</div>
          </div>

          <!-- bars -->
          <div class="pot-prog-right">
            <div class="pot-prog-block">
              <div class="pot-prog-top">
                <div class="pot-prog-label">Average Progress</div>
                <div class="pot-prog-meta">{{ avgDone }} / {{ avgTotal }}</div>
              </div>
              <div class="pot-prog-bar">
                <div class="pot-prog-fill teal" :style="{ width: avgFill + '%' }"></div>
              </div>
              <div class="pot-prog-mini muted">{{ avgFill }} </div>
            </div>

            <div class="pot-prog-block">
              <div class="pot-prog-top">
                <div class="pot-prog-label">Goals in Progress</div>
                <div class="pot-prog-meta">{{ goalsDone }} / {{ goalsTotal }}</div>
              </div>
              <div class="pot-prog-bar">
                <div class="pot-prog-fill blue" :style="{ width: goalsFill + '%' }"></div>
              </div>
              <div class="pot-prog-mini muted">{{ goalsFill }}</div>
            </div>

            <div class="pot-total muted">Total Total • {{ totalTotal }}</div>
          </div>
        </div>
      </div>

      <!-- Patient Balance -->
      <div class="pot-card">
        <div class="pot-card-head">
          <div class="pot-card-title">Patient Balance</div>
          <button class="pot-link" type="button" @click="viewSchedule">View Full Schedule ›</button>
        </div>

        <div class="pot-balance">
          <div class="pot-bal-row">
            <div class="pot-bal-left">
              <div class="pot-bal-name">Good</div>
              <div class="pot-bal-bar">
                <div class="pot-bal-fill good" :style="{ width: balGood + '%' }"></div>
              </div>
            </div>
            <div class="pot-bal-right">
              <div class="pot-flag muted"><span class="pot-warn">▲</span> Fall Risk</div>
              <div class="pot-bal-pct">{{ balGood }}%</div>
            </div>
          </div>

          <div class="pot-bal-row">
            <div class="pot-bal-left">
              <div class="pot-bal-name">Moderate</div>
              <div class="pot-bal-bar">
                <div class="pot-bal-fill mod" :style="{ width: balModerate + '%' }"></div>
              </div>
            </div>
            <div class="pot-bal-right">
              <div class="pot-bal-pct">{{ balModerate }}%</div>
            </div>
          </div>

          <div class="pot-bal-row">
            <div class="pot-bal-left">
              <div class="pot-bal-name">At Risk</div>
              <div class="pot-bal-bar">
                <div class="pot-bal-fill risk" :style="{ width: balRisk + '%' }"></div>
              </div>
            </div>
            <div class="pot-bal-right">
              <div class="pot-flag muted"><span class="pot-warn">▲</span> Falls This Week</div>
              <div class="pot-bal-pct">{{ balRisk }}%</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Row 2: Sessions Today + Upcoming Re-Evals + New Referrals -->
    <section class="pot-row2">
      <!-- Therapy Sessions Today -->
      <div class="pot-card">
        <div class="pot-card-head">
          <div class="pot-card-title">Therapy Sessions Today</div>
          <button class="pot-link" type="button" @click="viewSchedule">View Full Schedule ›</button>
        </div>

        <div class="pot-sessions">
          <div class="pot-session" v-for="s in sessionsToday" :key="s.id">
            <div class="pot-session-left">
              <img class="pot-avatar" :src="s.avatar" alt="" />
              <div class="pot-session-meta">
                <div class="pot-session-name">{{ s.name }}</div>
                <div class="pot-session-sub muted">{{ s.when }}</div>
              </div>
            </div>

            <div class="pot-session-mid muted">
              <div class="pot-mid-row"><span class="pot-icon">🧾</span> {{ s.item1 }}</div>
              <div class="pot-mid-row"><span class="pot-icon">🧾</span> {{ s.item2 }}</div>
            </div>

            <span class="pot-chip" :class="s.shiftTone">{{ s.shift }}</span>
          </div>
        </div>
      </div>

      <!-- Upcoming Re-Evals -->
      <div class="pot-card">
        <div class="pot-card-head">
          <div class="pot-card-title">Upcoming Re-Evals</div>
          <button class="pot-link" type="button" @click="viewAllReEvals">View All Re-Evals ›</button>
        </div>

        <div class="pot-list">
          <div class="pot-li" v-for="u in reevals" :key="u.id">
            <div class="pot-li-main">
              <div class="pot-li-name">{{ u.name }}</div>
              <div class="pot-li-sub muted">{{ u.sub }}</div>
            </div>
            <div class="pot-li-time">
              <div class="pot-li-when">{{ u.when }}</div>
              <div class="pot-li-ago muted">{{ u.ago }}</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions small -->
        <div class="pot-minihead">
          <div class="pot-mini-title">Quick Actions</div>
          <button class="pot-link" type="button" @click="viewAllReEvals">View All Re-Evals ›</button>
        </div>
        <div class="pot-mini">
          <div class="pot-mini-row" v-for="q in quickActions" :key="q.id">
            <img class="pot-mini-av" :src="q.avatar" alt="" />
            <div class="pot-mini-meta">
              <div class="pot-mini-name">{{ q.name }}</div>
              <div class="pot-mini-sub muted">{{ q.sub }}</div>
            </div>
            <div class="pot-mini-time muted">{{ q.time }}</div>
          </div>
        </div>
      </div>

      <!-- New Referrals -->
      <div class="pot-card">
        <div class="pot-card-head">
          <div class="pot-card-title">New Referrals</div>
          <button class="pot-link" type="button" @click="viewAllReferrals">View All Referrals ›</button>
        </div>

        <div class="pot-ref">
          <div class="pot-refrow" v-for="r in referrals" :key="r.id">
            <img class="pot-avatar sm" :src="r.avatar" alt="" />
            <div class="pot-refmeta">
              <div class="pot-refname">{{ r.name }}</div>
              <div class="pot-refsub muted">{{ r.sub }}</div>
            </div>
            <div class="pot-refago muted">{{ r.ago }}</div>
          </div>
        </div>

        <div class="pot-minihead">
          <div class="pot-mini-title">Announcements</div>
        </div>
        <div class="pot-ann">
          <div class="pot-anntext muted" v-for="a in announcements" :key="a.id">
            {{ a.text }}
          </div>
          <button class="pot-cta" type="button" @click="newTherapyNote">+ New Therapy Note</button>
        </div>
      </div>
    </section>

    <!-- Row 3: Exercise Metrics + Quick Actions + Announcements -->
    <section class="pot-row3">
      <!-- Exercise Metrics -->
      <div class="pot-card">
        <div class="pot-card-head">
          <div class="pot-card-title">Exercise Metrics</div>
          <div class="pot-tabs">
            <button class="pot-tab" :class="{ active: tab === 'Mobility' }" @click="tab='Mobility'">Mobility</button>
            <button class="pot-tab" :class="{ active: tab === 'Strength' }" @click="tab='Strength'">Strength</button>
            <button class="pot-tab" :class="{ active: tab === 'Coordination' }" @click="tab='Coordination'">Coordination</button>
          </div>
        </div>

        <div class="pot-linechart">
          <div class="pot-grid"></div>

          <div class="pot-series">
            <div class="pot-dot d1" style="left: 10%; top: 62%"></div>
            <div class="pot-dot d1" style="left: 30%; top: 54%"></div>
            <div class="pot-dot d1" style="left: 50%; top: 46%"></div>
            <div class="pot-dot d1" style="left: 70%; top: 38%"></div>
            <div class="pot-dot d1" style="left: 90%; top: 30%"></div>

            <div class="pot-dot d2" style="left: 10%; top: 78%"></div>
            <div class="pot-dot d2" style="left: 30%; top: 70%"></div>
            <div class="pot-dot d2" style="left: 50%; top: 62%"></div>
            <div class="pot-dot d2" style="left: 70%; top: 56%"></div>
            <div class="pot-dot d2" style="left: 90%; top: 48%"></div>

            <div class="pot-dot d3" style="left: 10%; top: 86%"></div>
            <div class="pot-dot d3" style="left: 30%; top: 82%"></div>
            <div class="pot-dot d3" style="left: 50%; top: 78%"></div>
            <div class="pot-dot d3" style="left: 70%; top: 70%"></div>
            <div class="pot-dot d3" style="left: 90%; top: 60%"></div>
          </div>

          <div class="pot-x muted">
            <span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sun</span>
          </div>

          <div class="pot-leg">
            <div class="pot-legitem"><span class="pot-sq s1"></span> Mobility</div>
            <div class="pot-legitem"><span class="pot-sq s2"></span> Strength</div>
            <div class="pot-legitem"><span class="pot-sq s3"></span> Coordination</div>
            <button class="pot-report" type="button" @click="viewReport">View Full Report</button>
          </div>
        </div>
      </div>

      <!-- Quick Actions (large) -->
      <div class="pot-card">
        <div class="pot-card-head">
          <div class="pot-card-title">Quick Actions</div>
          <button class="pot-link" type="button" @click="viewAllQuick">View All ›</button>
        </div>

        <div class="pot-qbig">
          <div class="pot-qitem" v-for="q in quickCards" :key="q.id">
            <div class="pot-qico" :class="q.tone">{{ q.ico }}</div>
            <div class="pot-qmeta">
              <div class="pot-qtitle">{{ q.title }}</div>
              <div class="pot-qsub muted">{{ q.sub }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Announcements -->
      <div class="pot-card">
        <div class="pot-card-head">
          <div class="pot-card-title">Announcements</div>
        </div>

        <div class="pot-ann big">
          <div class="pot-anntext muted" v-for="a in announcementsLong" :key="a.id">
            {{ a.text }}
          </div>

          <button class="pot-cta" type="button" @click="newTherapyNote">+ New Therapy Note</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

/* KPIs (from UI) */
const kpiPatients = ref(22);
const kpiSessions = ref(9);
const kpiUpcoming = ref(3);
const kpiReferrals = ref(2);

/* Progress donut + bars (from UI) */
const progressPct = ref(76);
const avgDone = ref(46);
const avgTotal = ref(60);
const goalsDone = ref(12);
const goalsTotal = ref(60);
const totalTotal = ref(2205);

const avgFill = computed(() => Math.round((avgDone.value / avgTotal.value) * 100));
const goalsFill = computed(() => Math.round((goalsDone.value / goalsTotal.value) * 100));

const ringStyle = computed(() => {
  const v = Math.max(0, Math.min(100, progressPct.value));
  return { background: `conic-gradient(#67b9a4 ${v}%, rgba(226,232,244,0.95) ${v}% 100%)` };
});

/* Patient balance (from UI) */
const balGood = ref(45);
const balModerate = ref(35);
const balRisk = ref(20);

/* Lists */
const sessionsToday = ref([
  {
    id: 1,
    name: "Matt Collins",
    when: "Morning • M. • Day",
    item1: "Knee Injury",
    item2: "Balance Therapy",
    shift: "Morning",
    shiftTone: "green",
    avatar: "https://i.pravatar.cc/64?img=12",
  },
  {
    id: 2,
    name: "Julia Gomez",
    when: "Morning • S. • OT",
    item1: "Stroke Recovery",
    item2: "ADL Training",
    shift: "Morning",
    shiftTone: "orange",
    avatar: "https://i.pravatar.cc/64?img=47",
  },
  {
    id: 3,
    name: "Alex Rivera",
    when: "Afternoon • S. • PT",
    item1: "Heat & Stretching",
    item2: "Heat & Stretching",
    shift: "Afternoon P",
    shiftTone: "teal",
    avatar: "https://i.pravatar.cc/64?img=22",
  },
  {
    id: 4,
    name: "Heather Wang",
    when: "Morning • S. • OT",
    item1: "Fine Motor Skills",
    item2: "Rehab Exercises",
    shift: "Afternoon P",
    shiftTone: "orange",
    avatar: "https://i.pravatar.cc/64?img=36",
  },
]);

const reevals = ref([
  { id: 1, name: "Sarah Powell", sub: "OT Re-Eval | Hip Fracture", when: "Tomorrow, 10 AM", ago: "1 day ago" },
  { id: 2, name: "Aaron Reed", sub: "PT Re-Eval | Shoulder injury", when: "Tomorrow, 11 AM", ago: "2 hour ago" },
  { id: 3, name: "Olivia Ma", sub: "OT Re-Eval | OT Re-Eval", when: "2 Weeks, 00 AM", ago: "8 hours ago" },
]);

const quickActions = ref([
  { id: 1, name: "Kevin Anderson, PTA", sub: "Updated the progress; session today", time: "1 hr ago", avatar: "https://i.pravatar.cc/64?img=15" },
  { id: 2, name: "Ashley Reed, PT", sub: "Updated her EMs as a result today", time: "2 hrs ago", avatar: "https://i.pravatar.cc/64?img=8" },
  { id: 3, name: "David Grant, OT", sub: "Therapy goals updated", time: "3 hrs ago", avatar: "https://i.pravatar.cc/64?img=51" },
]);

const referrals = ref([
  { id: 1, name: "Lucas Brooks", sub: "Dr Taylor • Post-surgery ADL therapy.", ago: "2 hours ago", avatar: "https://i.pravatar.cc/64?img=10" },
  { id: 2, name: "Tom Hastings", sub: "Dr Morgan • Home care rehab plan.", ago: "3 hours ago", avatar: "https://i.pravatar.cc/64?img=13" },
  { id: 3, name: "Cynthia Lee", sub: "Dr Ahmad • New OT referral.", ago: "5 hours ago", avatar: "https://i.pravatar.cc/64?img=28" },
]);

const announcements = ref([
  { id: 1, text: "Please note adaptive equipment has been restored and is now available." },
  { id: 2, text: "Friendly Reminder: Ensure all therapy session notes are completed before you end your shift." },
]);

const announcementsLong = ref([
  { id: 1, text: "Please note adaptive equipment has been restored and is now available." },
  { id: 2, text: "Friendly Reminder: Ensure all therapy session notes are completed before you end your shift." },
  { id: 3, text: "Update: Fall risk monitoring guidelines have been refreshed for the week." },
]);

/* Bottom section */
const tab = ref("Strength");

const quickCards = ref([
  { id: 1, ico: "🗓", tone: "teal", title: "Schedule Session", sub: "Team housed for scan or Ethan Baker. Track and update the progress service." },
  { id: 2, ico: "📝", tone: "orange", title: "Document Progress Note", sub: "Patient should be restocked before update. Add progress notes as needed." },
]);

/* UI actions */
function viewProgress(){ window.alert("Progress Overview (UI only)"); }
function viewSchedule(){ window.alert("View Full Schedule (UI only)"); }
function viewAllReEvals(){ window.alert("View All Re-Evals (UI only)"); }
function viewAllReferrals(){ window.alert("View All Referrals (UI only)"); }
function viewAllQuick(){ window.alert("View All Quick Actions (UI only)"); }
function viewReport(){ window.alert("View Full Report (UI only)"); }
function newTherapyNote(){ window.alert("New Therapy Note (UI only)"); }
</script>

<style scoped>
.pot{ display:grid; gap:18px; min-width:0; }
.pot-title{ margin:0; font-size:28px; font-weight:900; color:#2a3550; }
.pot-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.pot-sub-strong{ color:#2a3550; }
.pot-sub-sep{ opacity:.6; }
.muted{ color:#7a8aa7; font-weight:800; }

/* KPI row */
.pot-kpis{ display:grid; grid-template-columns:repeat(4, minmax(220px, 1fr)); gap:16px; }
.pot-kpi{
  border-radius:12px; padding:14px 16px; color:#fff; display:flex; justify-content:space-between; align-items:center;
  box-shadow:0 14px 26px rgba(34,50,74,0.14); border:1px solid rgba(255,255,255,0.25); min-width:0;
}
.pot-kpi-label{ font-weight:900; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pot-kpi-ico{ margin-top:6px; opacity:.95; }
.pot-kpi-value{ font-size:42px; font-weight:900; line-height:1; }
.pot-kpi.blue{ background:linear-gradient(90deg,#356ee6,#5c8cf5); }
.pot-kpi.teal{ background:linear-gradient(90deg,#2f9aa2,#4fc1cb); }
.pot-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.pot-kpi.pink{ background:linear-gradient(90deg,#7e4ae6,#b073ff); }

/* glass cards */
.pot-card{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
  min-width:0;
}
.pot-card-head{
  padding:12px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.pot-card-title{ font-weight:900; color:#2a3550; }
.pot-link{
  border:0; background:transparent; cursor:pointer;
  font-weight:900; color:#2d76d6; white-space:nowrap;
}
.pot-link:hover{ text-decoration:underline; }

.pot-row1{ display:grid; grid-template-columns: 1.4fr 1fr; gap:16px; align-items:start; }
.pot-row2{ display:grid; grid-template-columns: 1.4fr 1fr 1fr; gap:16px; align-items:start; }
.pot-row3{ display:grid; grid-template-columns: 1.4fr 1fr 1fr; gap:16px; align-items:start; }

/* Progress Overview */
.pot-progress{ padding:14px; display:grid; grid-template-columns: 220px 1fr; gap:16px; align-items:center; }
.pot-donut{ display:grid; justify-items:center; gap:10px; }
.pot-ring{
  width: 160px; height: 160px; border-radius:999px;
  border:1px solid rgba(226,232,244,0.95);
  box-shadow:0 18px 32px rgba(34,50,74,0.10);
  position:relative;
}
.pot-ring::after{
  content:"";
  position:absolute;
  inset: 20px;
  border-radius:999px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(226,232,244,0.85);
}
.pot-center{ position:absolute; inset:0; display:grid; place-items:center; z-index:1; }
.pot-pct{ font-weight:900; font-size:24px; color:#2a3550; }
.pot-donut-foot{ font-size:12px; }

.pot-prog-right{ display:grid; gap:14px; }
.pot-prog-top{ display:flex; justify-content:space-between; align-items:baseline; }
.pot-prog-label{ font-weight:900; color:#2a3550; }
.pot-prog-meta{ font-weight:900; color:#6b7a90; }
.pot-prog-bar{
  height: 14px;
  border-radius: 999px;
  border:1px solid rgba(226,232,244,0.85);
  background: rgba(230,232,240,0.55);
  overflow:hidden;
  margin-top:8px;
}
.pot-prog-fill{ height:100%; border-radius:999px; }
.pot-prog-fill.teal{ background: linear-gradient(90deg, rgba(103,185,164,0.95), rgba(103,185,164,0.45)); }
.pot-prog-fill.blue{ background: linear-gradient(90deg, rgba(53,110,230,0.90), rgba(92,140,245,0.45)); }
.pot-prog-mini{ margin-top:6px; font-size:12px; }
.pot-total{ margin-top:2px; font-size:12px; }

/* Patient Balance */
.pot-balance{ padding:14px; display:grid; gap:14px; }
.pot-bal-row{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.pot-bal-left{ flex: 1 1 auto; display:grid; gap:8px; }
.pot-bal-name{ font-weight:900; color:#2a3550; }
.pot-bal-bar{
  height: 14px;
  border-radius: 999px;
  border:1px solid rgba(226,232,244,0.85);
  background: rgba(230,232,240,0.55);
  overflow:hidden;
}
.pot-bal-fill{ height:100%; border-radius:999px; }
.pot-bal-fill.good{ background: rgba(103,185,164,0.85); }
.pot-bal-fill.mod{ background: rgba(255,170,85,0.85); }
.pot-bal-fill.risk{ background: rgba(255,120,120,0.70); }
.pot-bal-right{ display:flex; align-items:center; gap:12px; }
.pot-flag{ display:flex; align-items:center; gap:8px; font-size:12px; white-space:nowrap; }
.pot-warn{ color:#ff7a3d; font-weight:900; }
.pot-bal-pct{ font-weight:900; color:#2a3550; }

/* Sessions Today */
.pot-sessions{ padding:12px 14px; display:grid; gap:12px; }
.pot-session{
  display:grid;
  grid-template-columns: 240px 1fr 110px;
  gap:12px;
  align-items:center;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.pot-session-left{ display:flex; gap:10px; align-items:center; min-width:0; }
.pot-avatar{ width:34px; height:34px; border-radius:999px; object-fit:cover; }
.pot-avatar.sm{ width:30px; height:30px; }
.pot-session-name{ font-weight:900; color:#2a3550; }
.pot-session-sub{ margin-top:4px; font-size:12px; }
.pot-session-mid{ display:grid; gap:6px; font-size:12px; }
.pot-mid-row{ display:flex; align-items:center; gap:8px; }
.pot-icon{ opacity:.85; }

.pot-chip{
  justify-self:end;
  padding:6px 10px;
  border-radius:10px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  display:inline-flex;
}
.pot-chip.green{ background: rgba(184,219,201,0.70); color:#2c5b46; }
.pot-chip.orange{ background: rgba(255,170,85,0.55); color:#7a3a10; }
.pot-chip.teal{ background: rgba(100,190,200,0.35); color:#1f5a63; }

/* Upcoming Re-Evals list */
.pot-list{ padding:12px 14px; display:grid; gap:12px; }
.pot-li{
  display:flex; justify-content:space-between; gap:12px; align-items:flex-start;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.pot-li-name{ font-weight:900; color:#2a3550; }
.pot-li-sub{ margin-top:4px; font-size:12px; }
.pot-li-time{ text-align:right; }
.pot-li-when{ font-weight:900; color:#ff7a3d; }
.pot-li-ago{ margin-top:4px; font-size:12px; }

/* mini quick actions under reevals */
.pot-minihead{
  padding:10px 14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-top:1px solid rgba(226,232,244,0.75);
}
.pot-mini-title{ font-weight:900; color:#2a3550; }
.pot-mini{ padding:10px 14px 14px; display:grid; gap:12px; }
.pot-mini-row{
  display:flex; align-items:center; gap:10px;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.pot-mini-av{ width:30px; height:30px; border-radius:999px; object-fit:cover; }
.pot-mini-name{ font-weight:900; color:#2a3550; }
.pot-mini-sub{ margin-top:4px; font-size:12px; }
.pot-mini-time{ margin-left:auto; font-size:12px; white-space:nowrap; }

/* Referrals + announcements */
.pot-ref{ padding:12px 14px; display:grid; gap:12px; }
.pot-refrow{
  display:flex; align-items:center; gap:10px;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.pot-refname{ font-weight:900; color:#2a3550; }
.pot-refsub{ margin-top:4px; font-size:12px; }
.pot-refago{ margin-left:auto; font-size:12px; white-space:nowrap; }

.pot-ann{ padding:12px 14px 14px; display:grid; gap:12px; }
.pot-ann.big{ padding-top:14px; }
.pot-anntext{
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
  font-size:12px;
  line-height:1.35;
}

/* Exercise metrics pseudo line chart */
.pot-linechart{ padding:14px; position:relative; min-height:240px; }
.pot-grid{
  position:absolute; inset:14px 14px 64px 14px;
  border-radius:14px;
  border:1px solid rgba(226,232,244,0.75);
  background:
    linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)),
    repeating-linear-gradient(0deg, rgba(226,232,244,0.7) 0px, rgba(226,232,244,0.7) 1px, transparent 1px, transparent 34px),
    repeating-linear-gradient(90deg, rgba(226,232,244,0.7) 0px, rgba(226,232,244,0.7) 1px, transparent 1px, transparent 64px);
  opacity:.95;
}
.pot-series{ position:absolute; inset:14px 14px 64px 14px; }
.pot-dot{
  position:absolute;
  width:10px; height:10px; border-radius:999px;
  border:2px solid rgba(226,232,244,0.95);
  box-shadow:0 10px 18px rgba(34,50,74,0.12);
}
.pot-dot.d1{ background:rgba(53,110,230,0.85); }
.pot-dot.d2{ background:rgba(103,185,164,0.85); }
.pot-dot.d3{ background:rgba(255,170,85,0.85); }

.pot-x{
  position:absolute; left:14px; right:14px; bottom:48px;
  display:flex; justify-content:space-between;
  font-size:12px;
}
.pot-leg{
  position:absolute; left:14px; right:14px; bottom:14px;
  display:flex; align-items:center; gap:14px;
  font-weight:900; color:#6b7a90;
}
.pot-legitem{ display:flex; align-items:center; gap:8px; font-size:12px; }
.pot-sq{ width:12px; height:12px; border-radius:4px; display:inline-block; }
.pot-sq.s1{ background:rgba(53,110,230,0.9); }
.pot-sq.s2{ background:rgba(103,185,164,0.9); }
.pot-sq.s3{ background:rgba(255,170,85,0.9); }
.pot-report{
  margin-left:auto;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:12px;
  padding:8px 12px;
  font-weight:900;
  color:#425574;
  cursor:pointer;
}
.pot-report:hover{ background:rgba(255,255,255,0.75); }

/* tabs in header for exercise metrics */
.pot-tabs{ display:flex; gap:10px; align-items:center; margin-left:auto; }
.pot-tab{
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:12px;
  padding:8px 12px;
  font-weight:900;
  color:#425574;
  cursor:pointer;
}
.pot-tab.active{ background:rgba(45,118,214,0.18); border-color:rgba(45,118,214,0.35); color:#1e5fb7; }

/* Quick actions cards */
.pot-qbig{ padding:12px 14px 14px; display:grid; gap:12px; }
.pot-qitem{
  display:flex; gap:12px; align-items:flex-start;
  padding:12px 12px;
  border-radius:14px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.pot-qico{
  width:38px; height:38px; border-radius:14px;
  display:grid; place-items:center;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(255,255,255,0.65);
  font-weight:900;
}
.pot-qico.teal{ background:rgba(100,190,200,0.35); color:#1f5a63; }
.pot-qico.orange{ background:rgba(255,170,85,0.55); color:#7a3a10; }
.pot-qtitle{ font-weight:900; color:#2a3550; }
.pot-qsub{ margin-top:6px; font-size:12px; line-height:1.35; }

/* CTA */
.pot-cta{
  justify-self:end;
  border:1px solid rgba(90,150,150,0.85);
  background: rgba(120,185,185,0.55);
  color:#1f4f52;
  border-radius:12px;
  padding:10px 14px;
  font-weight:900;
  cursor:pointer;
}
.pot-cta:hover{ background: rgba(120,185,185,0.70); }

/* responsive */
@media (max-width: 1400px){
  .pot-kpis{ grid-template-columns:repeat(2,1fr); }
  .pot-row1, .pot-row2, .pot-row3{ grid-template-columns:1fr; }
  .pot-progress{ grid-template-columns:1fr; }
  .pot-session{ grid-template-columns: 1fr; }
  .pot-session-mid{ display:none; }
  .pot-chip{ justify-self:start; }
}
@media (max-width: 820px){
  .pot-kpis{ grid-template-columns:1fr; }
  .pot-title{ font-size:24px; }
  .pot-tabs{ flex-wrap:wrap; }
}
</style>
