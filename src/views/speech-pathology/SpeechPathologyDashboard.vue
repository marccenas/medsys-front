<template>
  <div class="spd">
    <!-- Header -->
    <div class="spd-head">
      <div>
        <h2 class="spd-title">Speech Pathology Dashboard</h2>
        <div class="spd-sub">
          <span class="spd-sub-strong">Patients Overview</span>
          <span class="spd-sub-sep">›</span>
          <span>Monitor and manage speech-language pathology activities.</span>
        </div>
      </div>
    </div>

    <!-- KPI Row -->
    <section class="spd-kpis">
      <div class="spd-kpi blue">
        <div class="spd-kpi-left">
          <div class="spd-kpi-label">Total Patients</div>
          <div class="spd-kpi-ico">👥</div>
        </div>
        <div class="spd-kpi-value">{{ kpiPatients }}</div>
      </div>

      <div class="spd-kpi teal">
        <div class="spd-kpi-left">
          <div class="spd-kpi-label">Sessions Today</div>
          <div class="spd-kpi-ico">📅</div>
        </div>
        <div class="spd-kpi-value">{{ kpiSessions }}</div>
      </div>

      <div class="spd-kpi orange">
        <div class="spd-kpi-left">
          <div class="spd-kpi-label">Upcoming Evaluations</div>
          <div class="spd-kpi-ico">🗂</div>
        </div>
        <div class="spd-kpi-value">{{ kpiUpcoming }}</div>
      </div>

      <div class="spd-kpi pink">
        <div class="spd-kpi-left">
          <div class="spd-kpi-label">New Referrals</div>
          <div class="spd-kpi-ico">📌</div>
        </div>
        <div class="spd-kpi-value">{{ kpiReferrals }}</div>
      </div>
    </section>

    <!-- Row 1 -->
    <section class="spd-row1">
      <!-- Therapy Progress -->
      <div class="spd-card">
        <div class="spd-card-head">
          <div class="spd-card-title">Therapy Progress</div>
          <button class="spd-link" type="button" @click="viewTherapy">Therapy ›</button>
        </div>

        <div class="spd-progress">
          <div class="spd-donut">
            <div class="spd-ring" :style="ringStyle"></div>
            <div class="spd-center">
              <div class="spd-pct">{{ progressPct }}%</div>
            </div>
          </div>

          <div class="spd-prog-right">
            <div class="spd-prog-block">
              <div class="spd-prog-top">
                <div class="spd-prog-label">Average Progress</div>
                <div class="spd-prog-meta">{{ progressDone }} of {{ progressTotal }}</div>
              </div>

              <div class="spd-prog-bar">
                <div class="spd-prog-fill" :style="{ width: progressFill + '%' }"></div>
              </div>
            </div>

            <div class="spd-goals">
              <div class="spd-goals-left">
                <div class="spd-goals-title">Therapy Goals Met</div>
                <div class="spd-goals-sub muted">
                  Total {{ goalsTotal }} • 10M <span class="spd-dot">•</span> 9
                </div>
              </div>
              <div class="spd-goals-right">{{ goalsMet }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Evaluations -->
      <div class="spd-card">
        <div class="spd-card-head">
          <div class="spd-card-title">Upcoming Evaluations</div>
          <button class="spd-link" type="button" @click="viewAllEvaluations">View All Refers ›</button>
        </div>

        <div class="spd-evals">
          <div class="spd-eval" v-for="e in upcomingEvals" :key="e.id">
            <div class="spd-eval-main">
              <div class="spd-eval-name">{{ e.name }}</div>
              <div class="spd-eval-sub muted">{{ e.sub }}</div>
            </div>
            <div class="spd-eval-time">
              <div class="spd-eval-when">{{ e.when }}</div>
              <div class="spd-eval-loc muted">{{ e.loc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Row 2 -->
    <section class="spd-row2">
      <!-- Therapy Sessions Today -->
      <div class="spd-card spd-wide">
        <div class="spd-card-head">
          <div class="spd-card-title">Therapy Sessions Today</div>
          <button class="spd-link" type="button" @click="viewAllSessions">View All Evaluations</button>
        </div>

        <div class="spd-sessions">
          <div class="spd-session" v-for="s in sessionsToday" :key="s.id">
            <div class="spd-session-left">
              <img class="spd-avatar" :src="s.avatar" alt="" />
              <div class="spd-session-meta">
                <div class="spd-session-name">{{ s.name }}</div>
                <div class="spd-session-sub muted">{{ s.sub }}</div>
              </div>
            </div>

            <div class="spd-session-mid muted">
              <div class="spd-mid-row">
                <span class="spd-icon">📄</span> {{ s.doc1 }}
              </div>
              <div class="spd-mid-row">
                <span class="spd-icon">📄</span> {{ s.doc2 }}
              </div>
            </div>

            <button class="spd-status" :class="s.tone" type="button" @click="statusClick(s)">
              {{ s.status }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right column: Recent Referrals + Team Messages -->
      <div class="spd-col">
        <div class="spd-card">
          <div class="spd-card-head">
            <div class="spd-card-title">Recent Referrals</div>
            <button class="spd-link" type="button" @click="viewAllReferrals">View All Refers ›</button>
          </div>

          <div class="spd-referrals">
            <div class="spd-ref" v-for="r in referrals" :key="r.id">
              <div class="spd-ref-left">
                <div class="spd-ref-ico" :class="r.tone">{{ r.ico }}</div>
                <div>
                  <div class="spd-ref-name">{{ r.name }}</div>
                  <div class="spd-ref-sub muted">{{ r.sub }}</div>
                </div>
              </div>
              <div class="spd-ref-time muted">{{ r.time }}</div>
            </div>
          </div>
        </div>

        <div class="spd-card">
          <div class="spd-card-head">
            <div class="spd-card-title">Team Messages</div>
            <button class="spd-link" type="button" @click="viewAllMessages">View All ›</button>
          </div>

          <div class="spd-msgs">
            <div class="spd-msg" v-for="m in teamMsgs" :key="m.id">
              <div class="spd-msg-text muted">{{ m.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Row 3 -->
    <section class="spd-row3">
      <!-- Progress Charts -->
      <div class="spd-card spd-wide">
        <div class="spd-card-head">
          <div class="spd-card-title">Progress Charts</div>

          <div class="spd-tabs">
            <button class="spd-tab" :class="{ active: tab === 'Adults' }" @click="tab='Adults'">Adults</button>
            <button class="spd-tab" :class="{ active: tab === 'Pediatrics' }" @click="tab='Pediatrics'">Pediatrics</button>
            <button class="spd-tab" :class="{ active: tab === 'Cognitive' }" @click="tab='Cognitive'">Cognitive</button>

            <button class="spd-link spd-link-right" type="button" @click="viewResources">Resources ›</button>
          </div>
        </div>

        <div class="spd-chart">
          <div class="spd-bars">
            <div class="spd-bargrp">
              <div class="spd-bar b1" style="height: 140px"></div>
              <div class="spd-bar b2" style="height: 120px"></div>
              <div class="spd-x muted">Feb</div>
            </div>
            <div class="spd-bargrp">
              <div class="spd-bar b1" style="height: 105px"></div>
              <div class="spd-bar b2" style="height: 96px"></div>
              <div class="spd-x muted">Mar</div>
            </div>
            <div class="spd-bargrp">
              <div class="spd-bar b1" style="height: 88px"></div>
              <div class="spd-bar b2" style="height: 74px"></div>
              <div class="spd-x muted">Apr</div>
            </div>
          </div>

          <div class="spd-chart-side">
            <div class="spd-leg">
              <span class="spd-sq s1"></span> Language
            </div>
            <div class="spd-leg">
              <span class="spd-sq s2"></span> Swallowing
            </div>

            <div class="spd-dd small">
              <select v-model="range">
                <option value="2m">Past 2 Months</option>
                <option value="3m">Past 3 Months</option>
                <option value="6m">Past 6 Months</option>
              </select>
              <span class="spd-dd-ico">▾</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Resources -->
      <div class="spd-card">
        <div class="spd-card-head">
          <div class="spd-card-title">Resources</div>
          <button class="spd-link" type="button" @click="viewAllResources">View All ›</button>
        </div>

        <div class="spd-res">
          <div class="spd-resitem" v-for="r in resources" :key="r.id">
            <div class="spd-resico" :class="r.tone">{{ r.ico }}</div>
            <div class="spd-resmain">
              <div class="spd-restitle">{{ r.title }}</div>
              <div class="spd-ressub muted">{{ r.sub }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column: Team Messages + CTA -->
      <div class="spd-card">
        <div class="spd-card-head">
          <div class="spd-card-title">Team Messages</div>
          <button class="spd-link" type="button" @click="viewAllMessages">View All ›</button>
        </div>

        <div class="spd-msgs big">
          <div class="spd-msg" v-for="m in teamMsgsLong" :key="m.id">
            <div class="spd-msg-text muted">{{ m.text }}</div>
          </div>

          <button class="spd-cta" type="button" @click="addReferral">+ Add New Referral</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

/* KPI values (from UI) */
const kpiPatients = ref(15);
const kpiSessions = ref(6);
const kpiUpcoming = ref(2);
const kpiReferrals = ref(1);

/* Therapy progress donut */
const progressPct = ref(89);
const progressDone = ref(32);
const progressTotal = ref(45);

const progressFill = computed(() => Math.round((progressDone.value / progressTotal.value) * 100));

const ringStyle = computed(() => {
  const v = Math.max(0, Math.min(100, progressPct.value));
  return {
    background: `conic-gradient(#67b9a4 ${v}%, rgba(226,232,244,0.95) ${v}% 100%)`,
  };
});

const goalsTotal = ref(45);
const goalsMet = ref(9);

/* Lists */
const upcomingEvals = ref([
  { id: 1, name: "Joseph Nguyen", sub: "Today, 11 AM • Inpatient", when: "Today, 11:00 AM", loc: "At Activities" },
  { id: 2, name: "Ettmay Brooks", sub: "Tomorrow, 2PM • Adult Speech Eval", when: "Tomorrow, 2:00 PM", loc: "At Activities" },
]);

const sessionsToday = ref([
  {
    id: 1,
    name: "Ethan Parker",
    sub: "Daily Therapy",
    doc1: "Ethan Progress",
    doc2: "Education & Tutorials",
    status: "Send Recap",
    tone: "orange",
    avatar: "https://i.pravatar.cc/64?img=12",
  },
  {
    id: 2,
    name: "Mia Rodriguez",
    sub: "Adult Therapy",
    doc1: "Speech Progress Therapy Log",
    doc2: "Exercise Plan",
    status: "Add Speech Eval",
    tone: "orange",
    avatar: "https://i.pravatar.cc/64?img=47",
  },
  {
    id: 3,
    name: "Daniel White",
    sub: "Daily Therapy",
    doc1: "Ethan Progress",
    doc2: "Mother’s materials",
    status: "Send Recap",
    tone: "purple",
    avatar: "https://i.pravatar.cc/64?img=22",
  },
  {
    id: 4,
    name: "Tina Kim",
    sub: "Lucas Ree",
    doc1: "Ethan Progress",
    doc2: "Mother’s materials",
    status: "View All Recap",
    tone: "green",
    avatar: "https://i.pravatar.cc/64?img=36",
  },
]);

const referrals = ref([
  { id: 1, name: "Elizabeth Collins", sub: "Urgent Swallowing today", time: "11 hours ago", ico: "👤", tone: "blue" },
  { id: 2, name: "Ethan Bennet", sub: "Adult Language Therapy", time: "2 hours ago", ico: "✳", tone: "teal" },
  { id: 3, name: "Leah Patel", sub: "Pediatric Speech Therapy", time: "3 hours ago", ico: "📩", tone: "green" },
]);

const teamMsgs = ref([
  { id: 1, text: "Janet Wells SLPs protocols for pediatric speech and cognitive therapy." },
  { id: 2, text: "Mark Foster MD: thank a session today as the progress documented." },
  { id: 3, text: "Brett Chen: check all discharge treatment final before progress is complete." },
]);

const teamMsgsLong = ref([
  { id: 1, text: "Janet Wells: SLP protocols for pediatric speech and cognitive therapy." },
  { id: 2, text: "Mark Foster MD: documentation review is needed for today’s session." },
  { id: 3, text: "Brett Chen: ensure treatment notes are finalized before closing referral." },
]);

const tab = ref("Adults");
const range = ref("2m");

const resources = ref([
  { id: 1, ico: "📄", tone: "yellow", title: "Aphasia Strategies Guide", sub: "Pediatric Speech Therapies" },
  { id: 2, ico: "📁", tone: "orange", title: "Pediatric Speech Milestones", sub: "Pediatric Patients" },
  { id: 3, ico: "🗂", tone: "purple", title: "Cognitive Therapy Checklist", sub: "Geriatric Patients" },
]);

/* UI actions */
function viewTherapy(){ window.alert("Therapy (UI only)"); }
function viewAllEvaluations(){ window.alert("View All Evaluations (UI only)"); }
function viewAllSessions(){ window.alert("View All Sessions (UI only)"); }
function viewAllReferrals(){ window.alert("View All Referrals (UI only)"); }
function viewAllMessages(){ window.alert("View All Messages (UI only)"); }
function viewResources(){ window.alert("Resources (UI only)"); }
function viewAllResources(){ window.alert("View All Resources (UI only)"); }
function addReferral(){ window.alert("Add New Referral (UI only)"); }
function statusClick(s){ window.alert(`${s.status}: ${s.name} (UI only)`); }
</script>

<style scoped>
.spd{ display:grid; gap:18px; min-width:0; }
.spd-title{ margin:0; font-size:28px; font-weight:900; color:#2a3550; }
.spd-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.spd-sub-strong{ color:#2a3550; }
.spd-sub-sep{ opacity:.6; }
.muted{ color:#7a8aa7; font-weight:800; }
.spd-dot{ opacity:.7; }

/* KPI row */
.spd-kpis{ display:grid; grid-template-columns:repeat(4, minmax(220px, 1fr)); gap:16px; }
.spd-kpi{
  border-radius:12px; padding:14px 16px; color:#fff; display:flex; justify-content:space-between; align-items:center;
  box-shadow:0 14px 26px rgba(34,50,74,0.14); border:1px solid rgba(255,255,255,0.25); min-width:0;
}
.spd-kpi-label{ font-weight:900; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.spd-kpi-ico{ margin-top:6px; opacity:.95; }
.spd-kpi-value{ font-size:42px; font-weight:900; line-height:1; }
.spd-kpi.blue{ background:linear-gradient(90deg,#356ee6,#5c8cf5); }
.spd-kpi.teal{ background:linear-gradient(90deg,#2f9aa2,#4fc1cb); }
.spd-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.spd-kpi.pink{ background:linear-gradient(90deg,#ff4d6d,#ff7d87); }

/* glass cards */
.spd-card{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
  min-width:0;
}
.spd-card-head{
  padding:12px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.spd-card-title{ font-weight:900; color:#2a3550; }
.spd-link{
  border:0; background:transparent; cursor:pointer;
  font-weight:900; color:#2d76d6; white-space:nowrap;
}
.spd-link:hover{ text-decoration:underline; }

.spd-row1{ display:grid; grid-template-columns: 1.55fr 1fr; gap:16px; align-items:start; }
.spd-row2{ display:grid; grid-template-columns: 1.8fr 1fr; gap:16px; align-items:start; }
.spd-row3{ display:grid; grid-template-columns: 1.8fr 1fr 1fr; gap:16px; align-items:start; }
.spd-col{ display:grid; gap:16px; }
.spd-wide{ grid-column: span 1; }

/* therapy progress block */
.spd-progress{ padding:14px; display:grid; grid-template-columns: 200px 1fr; gap:16px; align-items:center; }
.spd-donut{ position:relative; display:grid; place-items:center; }
.spd-ring{
  width: 160px; height: 160px; border-radius:999px;
  border:1px solid rgba(226,232,244,0.95);
  box-shadow:0 18px 32px rgba(34,50,74,0.10);
  position:relative;
}
.spd-ring::after{
  content:"";
  position:absolute;
  inset: 20px;
  border-radius:999px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(226,232,244,0.85);
}
.spd-center{ position:absolute; inset:0; display:grid; place-items:center; z-index:1; }
.spd-pct{ font-weight:900; font-size:24px; color:#2a3550; }

.spd-prog-right{ display:grid; gap:12px; }
.spd-prog-top{ display:flex; justify-content:space-between; align-items:baseline; }
.spd-prog-label{ font-weight:900; color:#2a3550; }
.spd-prog-meta{ font-weight:900; color:#6b7a90; }
.spd-prog-bar{
  height: 14px;
  border-radius: 999px;
  border:1px solid rgba(226,232,244,0.85);
  background: rgba(230,232,240,0.55);
  overflow:hidden;
}
.spd-prog-fill{
  height:100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(103,185,164,0.9), rgba(103,185,164,0.45));
  box-shadow: 0 12px 18px rgba(34,50,74,0.10);
}

.spd-goals{
  display:flex; justify-content:space-between; align-items:center;
  padding:10px 12px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.spd-goals-title{ font-weight:900; color:#2a3550; }
.spd-goals-sub{ margin-top:4px; font-size:12px; }
.spd-goals-right{ font-weight:900; color:#2a3550; font-size:18px; }

/* upcoming evals */
.spd-evals{ padding:12px 14px; display:grid; gap:12px; }
.spd-eval{
  display:flex; justify-content:space-between; gap:12px; align-items:flex-start;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.spd-eval-name{ font-weight:900; color:#2a3550; }
.spd-eval-sub{ margin-top:4px; font-size:12px; }
.spd-eval-time{ text-align:right; }
.spd-eval-when{ font-weight:900; color:#ff7a3d; }
.spd-eval-loc{ margin-top:4px; font-size:12px; }

/* sessions list */
.spd-sessions{ padding:12px 14px; display:grid; gap:12px; }
.spd-session{
  display:grid;
  grid-template-columns: 260px 1fr 140px;
  gap:12px;
  align-items:center;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.spd-session-left{ display:flex; gap:10px; align-items:center; min-width:0; }
.spd-avatar{ width:36px; height:36px; border-radius:999px; object-fit:cover; }
.spd-session-name{ font-weight:900; color:#2a3550; }
.spd-session-sub{ margin-top:4px; font-size:12px; }

.spd-session-mid{ display:grid; gap:6px; font-size:12px; }
.spd-mid-row{ display:flex; align-items:center; gap:8px; }
.spd-icon{ opacity:.8; }

.spd-status{
  justify-self:end;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
  border: 1px solid rgba(226,232,244,0.85);
  cursor:pointer;
  background: rgba(255,255,255,0.55);
  color:#2a3550;
}
.spd-status.orange{ background: rgba(255,170,85,0.55); color:#7a3a10; }
.spd-status.purple{ background: rgba(203,196,255,0.55); color:#3a2f8f; }
.spd-status.green{ background: rgba(184,219,201,0.70); color:#2c5b46; }

/* referrals */
.spd-referrals{ padding:12px 14px; display:grid; gap:12px; }
.spd-ref{
  display:flex; justify-content:space-between; gap:12px; align-items:center;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.spd-ref-left{ display:flex; gap:10px; align-items:center; }
.spd-ref-ico{
  width:32px; height:32px; border-radius:10px;
  display:grid; place-items:center;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(255,255,255,0.65);
  font-weight:900;
}
.spd-ref-ico.blue{ background:rgba(45,118,214,0.18); color:#1e5fb7; }
.spd-ref-ico.teal{ background:rgba(100,190,200,0.30); color:#1f5a63; }
.spd-ref-ico.green{ background:rgba(184,219,201,0.55); color:#2c5b46; }
.spd-ref-name{ font-weight:900; color:#2a3550; }
.spd-ref-sub{ margin-top:4px; font-size:12px; }

/* messages */
.spd-msgs{ padding:12px 14px; display:grid; gap:12px; }
.spd-msgs.big{ padding-bottom:14px; }
.spd-msg{
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.spd-msg-text{ font-size:12px; line-height:1.35; }

/* tabs + chart */
.spd-tabs{ display:flex; gap:10px; align-items:center; width:100%; }
.spd-tab{
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:12px;
  padding:8px 12px;
  font-weight:900;
  color:#425574;
  cursor:pointer;
}
.spd-tab.active{ background:rgba(45,118,214,0.18); border-color:rgba(45,118,214,0.35); color:#1e5fb7; }
.spd-link-right{ margin-left:auto; }

.spd-chart{
  padding:14px;
  display:grid;
  grid-template-columns: 1fr 220px;
  gap:16px;
  align-items:end;
}
.spd-bars{
  display:flex; gap:22px; align-items:flex-end;
  height: 190px;
  padding: 10px 10px;
  border-radius:14px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.spd-bargrp{ width: 90px; display:grid; gap:8px; justify-items:center; }
.spd-bar{ width: 46px; border-radius:10px 10px 6px 6px; border:1px solid rgba(226,232,244,0.75); }
.spd-bar.b1{ background:rgba(53,110,230,0.70); }
.spd-bar.b2{ background:rgba(255,170,85,0.65); width: 40px; }
.spd-x{ font-size:12px; font-weight:900; }

.spd-chart-side{ display:grid; gap:12px; align-content:start; }
.spd-leg{ display:flex; gap:10px; align-items:center; font-weight:900; color:#6b7a90; }
.spd-sq{ width:12px; height:12px; border-radius:4px; display:inline-block; }
.spd-sq.s1{ background:rgba(53,110,230,0.9); }
.spd-sq.s2{ background:rgba(255,170,85,0.9); }

.spd-dd{ position:relative; min-width:150px; }
.spd-dd.small{ min-width:170px; justify-self:end; }
.spd-dd select{
  width:100%; appearance:none;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:8px 34px 8px 12px;
  font-weight:900; color:#425574; outline:none;
}
.spd-dd-ico{
  position:absolute; right:12px; top:50%;
  transform:translateY(-50%);
  color:#7a8aa7; pointer-events:none;
}

/* resources */
.spd-res{ padding:12px 14px; display:grid; gap:12px; }
.spd-resitem{
  display:flex; gap:10px; align-items:flex-start;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.spd-resico{
  width:34px; height:34px; border-radius:10px;
  display:grid; place-items:center;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(255,255,255,0.65);
  font-weight:900;
}
.spd-resico.yellow{ background:rgba(255,220,120,0.40); color:#6b4e10; }
.spd-resico.orange{ background:rgba(255,170,85,0.45); color:#7a3a10; }
.spd-resico.purple{ background:rgba(203,196,255,0.55); color:#3a2f8f; }
.spd-restitle{ font-weight:900; color:#2a3550; }
.spd-ressub{ margin-top:4px; font-size:12px; }

/* CTA */
.spd-cta{
  margin-top: 6px;
  justify-self:end;
  border:1px solid rgba(90,150,150,0.85);
  background: rgba(120,185,185,0.55);
  color:#1f4f52;
  border-radius:12px;
  padding:10px 14px;
  font-weight:900;
  cursor:pointer;
}
.spd-cta:hover{ background: rgba(120,185,185,0.70); }

/* responsive */
@media (max-width: 1400px){
  .spd-kpis{ grid-template-columns:repeat(2,1fr); }
  .spd-row1{ grid-template-columns:1fr; }
  .spd-row2{ grid-template-columns:1fr; }
  .spd-row3{ grid-template-columns:1fr; }
  .spd-chart{ grid-template-columns:1fr; }
  .spd-chart-side{ grid-auto-flow:column; justify-content:space-between; align-items:center; }
}
@media (max-width: 820px){
  .spd-kpis{ grid-template-columns:1fr; }
  .spd-title{ font-size:24px; }
  .spd-session{ grid-template-columns: 1fr; }
  .spd-session-mid{ display:none; }
  .spd-status{ justify-self:start; }
}
</style>
