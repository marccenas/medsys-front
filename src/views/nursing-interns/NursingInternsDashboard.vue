<template>
  <div class="nid">
    <!-- Header -->
    <div class="nid-head">
      <div>
        <h2 class="nid-title">Nurse Interns</h2>
        <div class="nid-sub">
          <span class="nid-sub-strong">Program Overview</span>
          <span class="nid-sub-sep">›</span>
          <span>Monitor and manage the nurse intern cohort.</span>
        </div>
      </div>
    </div>

    <!-- KPI row -->
    <section class="nid-kpis">
      <div class="nid-kpi blue">
        <div class="nid-kpi-left">
          <div class="nid-kpi-label">Total Interns</div>
          <div class="nid-kpi-ico">▦</div>
        </div>
        <div class="nid-kpi-value">{{ kpiInterns }}</div>
      </div>

      <div class="nid-kpi teal">
        <div class="nid-kpi-left">
          <div class="nid-kpi-label">On Shift Now</div>
          <div class="nid-kpi-ico">👥</div>
        </div>
        <div class="nid-kpi-value">{{ kpiOnShift }}</div>
      </div>

      <div class="nid-kpi orange">
        <div class="nid-kpi-left">
          <div class="nid-kpi-label">Upcoming Exams</div>
          <div class="nid-kpi-ico">📋</div>
        </div>
        <div class="nid-kpi-value">{{ kpiExams }}</div>
      </div>

      <div class="nid-kpi purple">
        <div class="nid-kpi-left">
          <div class="nid-kpi-label">New Requests</div>
          <div class="nid-kpi-ico">★</div>
        </div>
        <div class="nid-kpi-value">{{ kpiRequests }}</div>
      </div>
    </section>

    <!-- Main grid -->
    <section class="nid-grid">
      <!-- LEFT column -->
      <div class="nid-left">
        <!-- Skill Competency (big panel) -->
        <div class="nid-panel">
          <div class="nid-panel-head">
            <div class="nid-panel-title">Skill Competency</div>
            <button class="nid-link" type="button" @click="goSkill">›</button>
          </div>

          <div class="nid-skill">
            <!-- donut -->
            <div class="nid-donut">
              <div class="nid-donut-ring" :style="donutStyle">
                <div class="nid-donut-center">
                  <div class="nid-check">✓</div>
                </div>
              </div>
              <div class="nid-donut-pct">{{ competency }}%</div>
            </div>

            <!-- mini line -->
            <div class="nid-mini">
              <svg viewBox="0 0 280 120" class="nid-svg" role="img" aria-label="competency trend">
                <g class="grid">
                  <line x1="16" y1="16" x2="16" y2="104" />
                  <line x1="16" y1="104" x2="264" y2="104" />
                  <line x1="16" y1="76" x2="264" y2="76" />
                  <line x1="16" y1="48" x2="264" y2="48" />
                  <line x1="16" y1="20" x2="264" y2="20" />
                </g>

                <path class="line" :d="miniPath" />

                <g class="pts">
                  <circle v-for="p in miniPts" :key="p.key" class="pt" :cx="p.x" :cy="p.y" r="5" />
                </g>

                <g class="xlabels">
                  <text v-for="t in miniTicks" :key="t.key" :x="t.x" y="116" text-anchor="middle">
                    {{ t.label }}
                  </text>
                </g>
              </svg>
            </div>

            <!-- recent evaluations list -->
            <div class="nid-recent">
              <div class="nid-recent-head">
                <div class="nid-recent-title">Recent Evaluations</div>
              </div>

              <div class="nid-recent-list">
                <div class="nid-recent-row" v-for="e in recentEvals" :key="e.id">
                  <div class="nid-recent-left">
                    <div class="nid-recent-name">{{ e.name }}</div>
                    <div class="nid-recent-sub">{{ e.when }}</div>
                  </div>
                  <div class="nid-recent-score">{{ e.score }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mid row: Interns on shift / Upcoming classes / Feedback -->
        <div class="nid-mid">
          <div class="nid-card">
            <div class="nid-card-head">
              <div class="nid-card-title">Interns On Shift</div>
              <button class="nid-link" type="button" @click="viewSchedule">View Schedule</button>
            </div>

            <div class="nid-list">
              <div class="nid-item" v-for="i in internsOnShift" :key="i.id">
                <img class="nid-avatar" :src="i.avatar" alt="" />
                <div class="nid-item-main">
                  <div class="nid-item-name">{{ i.name }}</div>
                  <div class="nid-item-sub muted">{{ i.shift }}</div>
                </div>
                <div class="nid-pill dept">{{ i.dept }}</div>
              </div>
            </div>

            <div class="nid-card-foot muted">
              Showing 1 to 6 of {{ internsTotal }} residents
            </div>
          </div>

          <div class="nid-card">
            <div class="nid-card-head">
              <div class="nid-card-title">Upcoming Classes</div>
              <button class="nid-link" type="button" @click="viewAllClasses">View All Classes</button>
            </div>

            <div class="nid-list">
              <div class="nid-item" v-for="c in upcomingClasses" :key="c.id">
                <img class="nid-avatar" :src="c.avatar" alt="" />
                <div class="nid-item-main">
                  <div class="nid-item-name">{{ c.title }}</div>
                  <div class="nid-item-sub muted">{{ c.when }}</div>
                </div>
                <div class="nid-pill dept">{{ c.dept }}</div>
              </div>
            </div>

            <div class="nid-card-foot right">
              <button class="nid-link" type="button" @click="viewAllClasses">View All Classes</button>
            </div>
          </div>

          <div class="nid-card">
            <div class="nid-card-head">
              <div class="nid-card-title">Feedback &amp; Evaluations</div>
              <button class="nid-link" type="button" @click="viewAllEvals">View All Exams</button>
            </div>

            <div class="nid-feedback">
              <div class="nid-feedback-item" v-for="f in feedbackCards" :key="f.id">
                <div class="nid-feedback-top">
                  <img class="nid-avatar sm" :src="f.avatar" alt="" />
                  <div class="nid-item-main">
                    <div class="nid-item-name">{{ f.name }}</div>
                    <div class="nid-item-sub muted">{{ f.role }}</div>
                  </div>
                  <div class="nid-stars">
                    <span v-for="n in 5" :key="n" class="star" :class="{ on: n <= f.rating }">★</span>
                  </div>
                </div>
                <div class="nid-feedback-text muted">{{ f.text }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom row -->
        <div class="nid-bottom">
          <!-- left announcements / profile -->
          <div class="nid-announce">
            <div class="nid-announce-top">
              <img class="nid-avatar lg" :src="coordinator.avatar" alt="" />
              <div class="nid-announce-meta">
                <div class="nid-announce-name">{{ coordinator.name }}</div>
                <div class="nid-announce-role muted">{{ coordinator.role }}</div>
              </div>
            </div>

            <div class="nid-announce-title">Announcements</div>
            <div class="nid-announce-body muted">
              Welcome new nurse interns! Orientation starts today 8 AM, Room 318.
            </div>

            <button class="nid-announce-btn" type="button" @click="addAnnouncement">
              + Add Announcement <span class="chev">›</span>
            </button>
          </div>

          <!-- 3 small cards -->
          <div class="nid-small-grid">
            <div class="nid-card">
              <div class="nid-card-head">
                <div class="nid-card-title">New Notes</div>
                <button class="nid-link" type="button" @click="viewNotes">›</button>
              </div>

              <div class="nid-list">
                <div class="nid-item" v-for="n in notesA" :key="n.id">
                  <img class="nid-avatar" :src="n.avatar" alt="" />
                  <div class="nid-item-main">
                    <div class="nid-item-name">{{ n.title }}</div>
                    <div class="nid-item-sub muted">{{ n.sub }}</div>
                  </div>
                  <div class="nid-time muted">{{ n.time }}</div>
                </div>
              </div>

              <div class="nid-card-foot right">
                <button class="nid-link" type="button" @click="viewAllClasses">View All Classes</button>
              </div>
            </div>

            <div class="nid-card">
              <div class="nid-card-head">
                <div class="nid-card-title">Feedback &amp; Evaluations</div>
                <button class="nid-link" type="button" @click="viewAllEvals">›</button>
              </div>

              <div class="nid-list">
                <div class="nid-item" v-for="ev in evalsMini" :key="ev.id">
                  <img class="nid-avatar" :src="ev.avatar" alt="" />
                  <div class="nid-item-main">
                    <div class="nid-item-name">{{ ev.name }}</div>
                    <div class="nid-item-sub muted">{{ ev.role }} • {{ ev.when }}</div>
                  </div>
                  <div class="nid-time muted">{{ ev.ago }}</div>
                </div>
              </div>

              <div class="nid-card-foot right">
                <button class="nid-link" type="button" @click="viewAllEvals">View All Evaluations ›</button>
              </div>
            </div>

            <div class="nid-card">
              <div class="nid-card-head">
                <div class="nid-card-title">New Notes</div>
                <button class="nid-link" type="button" @click="viewNotes">›</button>
              </div>

              <div class="nid-list">
                <div class="nid-item" v-for="n in notesB" :key="n.id">
                  <div class="nid-note-ico">🗒</div>
                  <div class="nid-item-main">
                    <div class="nid-item-name">{{ n.title }}</div>
                    <div class="nid-item-sub muted">{{ n.sub }}</div>
                  </div>
                  <div class="nid-time muted">{{ n.ago }}</div>
                </div>
              </div>

              <button class="nid-cta" type="button" @click="addRequest">+ Add New Request</button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT column -->
      <div class="nid-right">
        <div class="nid-card">
          <div class="nid-card-head">
            <div class="nid-card-title">Upcoming Classes</div>
            <button class="nid-link" type="button" @click="viewSchedule">View Schedule ›</button>
          </div>

          <div class="nid-list">
            <div class="nid-item" v-for="c in upcomingClassesRight" :key="c.id">
              <img class="nid-avatar" :src="c.avatar" alt="" />
              <div class="nid-item-main">
                <div class="nid-item-name">{{ c.title }}</div>
                <div class="nid-item-sub muted">{{ c.when }}</div>
              </div>
              <div class="nid-badge" v-if="c.badge">{{ c.badge }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

/* KPIs */
const kpiInterns = ref(24);
const kpiOnShift = ref(9);
const kpiExams = ref(4);
const kpiRequests = ref(1);

/* Skill competency */
const competency = ref(84);

/* donut (conic) */
const donutStyle = computed(() => {
  const v = Math.max(0, Math.min(100, competency.value));
  return {
    background: `conic-gradient(#67b9a4 ${v}%, rgba(226,232,244,0.95) ${v}% 100%)`,
  };
});

/* mini line */
const trend = ref([
  { label: "Feb", value: 54 },
  { label: "Mar", value: 78 },
  { label: "Apr.", value: 70 },
  { label: "", value: 74 },
]);

const miniPts = computed(() => {
  const w0 = 20, w1 = 260;
  const h0 = 16, h1 = 96;

  const vals = trend.value.map((t) => t.value);
  const min = Math.min(...vals, 45);
  const max = Math.max(...vals, 90);
  const stepX = (w1 - w0) / (trend.value.length - 1);

  return trend.value.map((t, i) => {
    const f = (t.value - min) / (max - min || 1);
    return { key: `t-${i}`, x: w0 + stepX * i, y: h1 - (h1 - h0) * f, label: t.label };
  });
});

const miniPath = computed(() => {
  const pts = miniPts.value;
  if (!pts.length) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
});

const miniTicks = computed(() => miniPts.value.map((p) => ({ key: p.key, x: p.x, label: p.label })));

/* data lists */
const internsTotal = ref(12);

const internsOnShift = ref([
  { id: 1, name: "Jessica M.", shift: "7 AM - 8 PM", dept: "Med-Surg", avatar: "https://i.pravatar.cc/64?img=47" },
  { id: 2, name: "Brandon R.", shift: "8 AM - 4 PM", dept: "ER", avatar: "https://i.pravatar.cc/64?img=15" },
  { id: 3, name: "Emily L.", shift: "11 AM - 7 PM", dept: "Pediatrics", avatar: "https://i.pravatar.cc/64?img=12" },
  { id: 4, name: "Chris S.", shift: "7 AM - 3 PM", dept: "ICU", avatar: "https://i.pravatar.cc/64?img=22" },
]);

const upcomingClasses = ref([
  { id: 1, title: "Patient Assessment", when: "Tomorrow 9 AM - 10 AM", dept: "ER", avatar: "https://i.pravatar.cc/64?img=12" },
  { id: 2, title: "Medication Administration", when: "Mon, 2 PM - 4 PM", dept: "ICU", avatar: "https://i.pravatar.cc/64?img=47" },
  { id: 3, title: "Infection Control", when: "Tue, 11 AM - 12 PM", dept: "ICU", avatar: "https://i.pravatar.cc/64?img=15" },
]);

const upcomingClassesRight = ref([
  { id: 1, title: "Patient Assessment", when: "Tomorrow % 40%,", badge: "56", avatar: "https://i.pravatar.cc/64?img=12" },
  { id: 2, title: "Medication Administration", when: "Mon, 2 PM - 4 PM", badge: "12", avatar: "https://i.pravatar.cc/64?img=47" },
  { id: 3, title: "Infection Control", when: "Tue, 11 AM - 12 PM", badge: "95", avatar: "https://i.pravatar.cc/64?img=15" },
]);

const recentEvals = ref([
  { id: 1, name: "Wound Care", when: "Yesterday 15 AM", score: 92 },
  { id: 2, name: "Foley Catheter Placement", when: "3 days ago 31 AM", score: 87 },
  { id: 3, name: "IV Insertion", when: "Tue, 11 AM - 18 PM", score: 78 },
]);

const feedbackCards = ref([
  {
    id: 1,
    name: "Jessica M.",
    role: "RN Preceptor",
    rating: 4,
    text: "Jessica has been outstanding in Med-Surg. Shows initiative and excellent patient care.",
    avatar: "https://i.pravatar.cc/64?img=47",
  },
  {
    id: 2,
    name: "Emily L.",
    role: "2 days ago",
    rating: 4,
    text: "Emily is doing well, in Pediatrics. Keep up the good work and continue to improve.",
    avatar: "https://i.pravatar.cc/64?img=12",
  },
]);

const coordinator = ref({
  name: "Amanda Lewis - RN",
  role: "Nurse Intern Coordinator",
  avatar: "https://i.pravatar.cc/64?img=8",
});

const notesA = ref([
  { id: 1, title: "Christina Foster PGY-1", sub: "Ask for more NICU experience 1", time: "" , avatar: "https://i.pravatar.cc/64?img=28" },
]);

const evalsMini = ref([
  { id: 1, name: "Jessica M.", role: "RN Preceptor", when: "Yesterday", ago: "2 days ago", avatar: "https://i.pravatar.cc/64?img=47" },
]);

const notesB = ref([
  { id: 1, title: "Documentation Reminder", sub: "Ask for ICU rotation", ago: "2 days ago" },
]);

/* actions */
function goSkill(){ window.alert("Skill Competency (UI only)"); }
function viewSchedule(){ window.alert("View Schedule (UI only)"); }
function viewAllClasses(){ window.alert("View All Classes (UI only)"); }
function viewAllEvals(){ window.alert("View All Evaluations (UI only)"); }
function viewNotes(){ window.alert("Notes (UI only)"); }
function addAnnouncement(){ window.alert("Add Announcement (UI only)"); }
function addRequest(){ window.alert("Add New Request (UI only)"); }
</script>

<style scoped>
.nid{ display:grid; gap:18px; min-width:0; }
.nid-title{ margin:0; font-size:28px; font-weight:900; color:#2a3550; }
.nid-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.nid-sub-strong{ color:#2a3550; }
.nid-sub-sep{ opacity:.6; }
.muted{ color:#7a8aa7; font-weight:800; }
.chev{ opacity:.85; }

/* KPIs */
.nid-kpis{ display:grid; grid-template-columns:repeat(4, minmax(220px, 1fr)); gap:16px; }
.nid-kpi{
  border-radius:12px; padding:14px 16px; color:#fff; display:flex; justify-content:space-between; align-items:center;
  box-shadow:0 14px 26px rgba(34,50,74,0.14); border:1px solid rgba(255,255,255,0.25); min-width:0;
}
.nid-kpi-label{ font-weight:900; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.nid-kpi-ico{ margin-top:6px; opacity:.95; }
.nid-kpi-value{ font-size:42px; font-weight:900; line-height:1; }
.nid-kpi.blue{ background:linear-gradient(90deg,#356ee6,#5c8cf5); }
.nid-kpi.teal{ background:linear-gradient(90deg,#2f9aa2,#4fc1cb); }
.nid-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.nid-kpi.purple{ background:linear-gradient(90deg,#6a4cff,#8d6cff); }

/* grid */
.nid-grid{ display:grid; grid-template-columns: 1.65fr 0.95fr; gap:16px; align-items:start; }
.nid-left, .nid-right{ display:grid; gap:16px; min-width:0; }

/* glass panels */
.nid-panel, .nid-card, .nid-announce{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
}
.nid-panel-head, .nid-card-head{
  padding:12px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.nid-panel-title, .nid-card-title{ font-weight:900; color:#2a3550; }

.nid-link{
  border:0; background:transparent; cursor:pointer;
  font-weight:900; color:#2d76d6; white-space:nowrap;
}
.nid-link:hover{ text-decoration:underline; }

/* Skill layout */
.nid-skill{
  padding:14px;
  display:grid;
  grid-template-columns: 260px 300px 1fr;
  gap:16px;
  align-items:center;
}

/* donut */
.nid-donut{ position:relative; display:grid; place-items:center; }
.nid-donut-ring{
  width: 170px;
  height: 170px;
  border-radius: 999px;
  border: 1px solid rgba(226,232,244,0.95);
  box-shadow: 0 18px 32px rgba(34,50,74,0.10);
  position:relative;
}
.nid-donut-ring::after{
  content:"";
  position:absolute;
  inset: 20px;
  border-radius: 999px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(226,232,244,0.85);
}
.nid-donut-center{
  position:absolute; inset:0;
  display:grid; place-items:center; z-index:1;
}
.nid-check{
  width: 62px; height: 62px;
  border-radius: 999px;
  background: rgba(103,185,164,0.18);
  border: 1px solid rgba(103,185,164,0.35);
  display:grid; place-items:center;
  font-weight:900; color:#2f9aa2; font-size:30px;
  box-shadow: 0 12px 24px rgba(47,154,162,0.10);
}
.nid-donut-pct{
  position:absolute;
  right: 10px;
  top: 16px;
  font-weight:900;
  color:#67b9a4;
  font-size: 20px;
}

/* mini chart */
.nid-mini{
  border: 1px solid rgba(226,232,244,0.85);
  border-radius: 14px;
  background: rgba(255,255,255,0.55);
  padding: 10px 10px 6px;
}
.nid-svg{ width:100%; height:auto; display:block; }
.grid line{ stroke: rgba(226,232,244,0.95); stroke-width:1; }
.line{ fill:none; stroke:#356ee6; stroke-width:3.5; stroke-linecap:round; stroke-linejoin:round; }
.pt{ fill:#356ee6; stroke:#fff; stroke-width:2.5; }
.xlabels text{ fill:#7a8aa7; font-weight:900; font-size:12px; }

/* Recent evals */
.nid-recent{
  border: 1px solid rgba(226,232,244,0.85);
  border-radius: 14px;
  background: rgba(255,255,255,0.55);
  overflow:hidden;
}
.nid-recent-head{ padding:10px 12px; border-bottom:1px solid rgba(226,232,244,0.65); }
.nid-recent-title{ font-weight:900; color:#6b7a90; font-size:12px; letter-spacing:.2px; }
.nid-recent-list{ padding: 8px 0; }
.nid-recent-row{
  padding:10px 12px;
  display:flex; align-items:center; gap:12px;
}
.nid-recent-row + .nid-recent-row{ border-top:1px solid rgba(226,232,244,0.55); }
.nid-recent-left{ min-width:0; }
.nid-recent-name{ font-weight:900; color:#2a3550; }
.nid-recent-sub{ margin-top:4px; font-size:12px; color:#7a8aa7; font-weight:800; }
.nid-recent-score{
  margin-left:auto;
  font-weight:900;
  color:#2a3550;
}

/* lists */
.nid-list{ padding:12px 14px; display:grid; gap:10px; }
.nid-item{
  display:flex; align-items:center; gap:10px;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.nid-avatar{ width:36px; height:36px; border-radius:999px; object-fit:cover; }
.nid-avatar.sm{ width:32px; height:32px; }
.nid-avatar.lg{ width:44px; height:44px; }
.nid-item-main{ min-width:0; }
.nid-item-name{ font-weight:900; color:#2a3550; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.nid-item-sub{ margin-top:4px; font-size:12px; }

.nid-pill{
  margin-left:auto;
  padding:6px 10px;
  border-radius:10px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(230,232,240,0.55);
  color:#51607a;
  white-space:nowrap;
}

.nid-badge{
  margin-left:auto;
  padding:4px 9px;
  border-radius:10px;
  font-weight:900;
  font-size:12px;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(255,180,180,0.35);
  color:#7b1f1f;
}

.nid-time{ margin-left:auto; font-size:12px; }

/* mid row */
.nid-mid{ display:grid; grid-template-columns: 1fr 1fr 1fr; gap:16px; align-items:start; }
.nid-card-foot{ padding:10px 14px 14px; border-top:1px solid rgba(226,232,244,0.55); font-size:12px; }
.nid-card-foot.right{ text-align:right; }

/* feedback cards inside */
.nid-feedback{ padding:12px 14px; display:grid; gap:12px; }
.nid-feedback-item{
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
  padding:12px;
}
.nid-feedback-top{ display:flex; gap:10px; align-items:center; }
.nid-stars{ margin-left:auto; display:flex; gap:3px; }
.star{ font-size:14px; color: rgba(245,158,11,0.25); }
.star.on{ color: rgba(245,158,11,0.95); }
.nid-feedback-text{ margin-top:10px; font-size:12px; line-height:1.35; }

/* bottom row */
.nid-bottom{ display:grid; grid-template-columns: 340px 1fr; gap:16px; align-items:start; }

.nid-announce{ padding:14px; }
.nid-announce-top{ display:flex; gap:12px; align-items:center; padding-bottom:12px; border-bottom:1px solid rgba(226,232,244,0.65); }
.nid-announce-name{ font-weight:900; color:#2a3550; }
.nid-announce-title{ margin-top:14px; font-weight:900; color:#2a3550; font-size:18px; }
.nid-announce-body{ margin-top:10px; line-height:1.4; }
.nid-announce-btn{
  margin-top:14px;
  border:0;
  background:transparent;
  color:#2d76d6;
  font-weight:900;
  cursor:pointer;
}
.nid-announce-btn:hover{ text-decoration:underline; }

.nid-small-grid{ display:grid; grid-template-columns: 1fr 1fr 1fr; gap:16px; align-items:start; }
.nid-note-ico{
  width:36px; height:36px; border-radius:12px;
  display:grid; place-items:center;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(255,255,255,0.65);
}

/* CTA */
.nid-cta{
  margin: 12px 14px 14px;
  border: 1px solid rgba(145,185,165,0.95);
  background: rgba(184,219,201,0.70);
  color:#2c5b46;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
  cursor:pointer;
}
.nid-cta:hover{ background: rgba(184,219,201,0.85); }

/* responsive */
@media (max-width: 1400px){
  .nid-kpis{ grid-template-columns:repeat(2,1fr); }
  .nid-mid{ grid-template-columns: 1fr; }
  .nid-small-grid{ grid-template-columns: 1fr; }
  .nid-bottom{ grid-template-columns: 1fr; }
  .nid-skill{ grid-template-columns: 1fr; }
}
@media (max-width: 1200px){
  .nid-grid{ grid-template-columns: 1fr; }
}
@media (max-width: 820px){
  .nid-kpis{ grid-template-columns:1fr; }
  .nid-title{ font-size:24px; }
}
</style>
