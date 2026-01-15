<template>
  <div class="rd">
    <!-- Header -->
    <div class="rd-head">
      <div>
        <h2 class="rd-title">Residents Dashboard</h2>
        <div class="rd-sub">
          <span class="rd-sub-strong">Training Overview</span>
          <span class="rd-sub-sep">›</span>
          <span>Monitor and manage your residency training progress.</span>
        </div>
      </div>
    </div>

    <!-- KPI row -->
    <section class="rd-kpis">
      <div class="rd-kpi blue">
        <div class="rd-kpi-left">
          <div class="rd-kpi-label">Total Residents</div>
          <div class="rd-kpi-ico">👥</div>
        </div>
        <div class="rd-kpi-value">{{ kpiResidents }}</div>
      </div>

      <div class="rd-kpi teal">
        <div class="rd-kpi-left">
          <div class="rd-kpi-label">On Shift Now</div>
          <div class="rd-kpi-ico">👤</div>
        </div>
        <div class="rd-kpi-value">{{ kpiOnShift }}</div>
      </div>

      <div class="rd-kpi orange">
        <div class="rd-kpi-left">
          <div class="rd-kpi-label">Upcoming Exams</div>
          <div class="rd-kpi-ico">📋</div>
        </div>
        <div class="rd-kpi-value">{{ kpiExams }}</div>
      </div>

      <div class="rd-kpi purple">
        <div class="rd-kpi-left">
          <div class="rd-kpi-label">New Requests</div>
          <div class="rd-kpi-ico">▶</div>
        </div>
        <div class="rd-kpi-value">{{ kpiRequests }}</div>
      </div>
    </section>

    <!-- Main grid -->
    <section class="rd-grid">
      <!-- LEFT -->
      <div class="rd-left">
        <!-- Academic performance -->
        <div class="rd-panel">
          <div class="rd-panel-head">
            <div class="rd-panel-title">Academic Performance</div>

            <button class="rd-link" type="button" @click="viewExamScores">
              Exam Scores AVG (%) <span class="chev">›</span>
            </button>
          </div>

          <div class="rd-acad">
            <!-- Donut -->
            <div class="rd-donut">
              <div class="rd-donut-top">
                <div class="rd-metric-label">Pass Rate:</div>
                <div class="rd-metric-value">{{ passRate }}%</div>
              </div>

              <div class="rd-donut-ring" :style="donutStyle" aria-label="Pass rate donut">
                <div class="rd-donut-center">
                  <div class="rd-check">✓</div>
                </div>
              </div>
            </div>

            <!-- Line chart -->
            <div class="rd-line">
              <div class="rd-line-wrap">
                <svg viewBox="0 0 520 180" class="rd-svg" role="img" aria-label="Exam score line chart">
                  <!-- grid -->
                  <g class="grid">
                    <line x1="40" y1="20" x2="40" y2="160" />
                    <line x1="40" y1="160" x2="500" y2="160" />
                    <line x1="40" y1="125" x2="500" y2="125" />
                    <line x1="40" y1="90" x2="500" y2="90" />
                    <line x1="40" y1="55" x2="500" y2="55" />
                    <line x1="40" y1="20" x2="500" y2="20" />
                  </g>

                  <!-- line path -->
                  <path class="line" :d="linePath" />

                  <!-- points -->
                  <g class="pts">
                    <circle
                      v-for="p in linePoints"
                      :key="p.key"
                      :cx="p.x"
                      :cy="p.y"
                      r="6"
                      class="pt"
                    />
                  </g>

                  <!-- last label bubble -->
                  <g v-if="linePoints.length">
                    <rect
                      :x="lastBubble.x"
                      :y="lastBubble.y"
                      width="62"
                      height="28"
                      rx="10"
                      class="bubble"
                    />
                    <text
                      :x="lastBubble.x + 31"
                      :y="lastBubble.y + 18"
                      text-anchor="middle"
                      class="bubbleText"
                    >
                      {{ lastScore }}%
                    </text>
                  </g>

                  <!-- x labels -->
                  <g class="xlabels">
                    <text v-for="t in xTicks" :key="t.key" :x="t.x" y="176" text-anchor="middle">
                      {{ t.label }}
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Mid row: Residents on shift + Upcoming exams -->
        <div class="rd-row2">
          <div class="rd-card">
            <div class="rd-card-head">
              <div class="rd-card-title">Residents On Shift</div>
              <button class="rd-link" type="button" @click="viewSchedule">View Schedule</button>
            </div>

            <div class="rd-list">
              <div class="rd-item" v-for="r in onShiftLeft" :key="r.id">
                <img class="rd-avatar" :src="r.avatar" alt="" />
                <div class="rd-item-main">
                  <div class="rd-item-name">{{ r.name }}</div>
                  <div class="rd-item-sub muted">Shift: {{ r.shift }}</div>
                </div>
                <div class="rd-pill dept">{{ r.dept }}</div>
              </div>
            </div>
          </div>

          <div class="rd-card">
            <div class="rd-card-head">
              <div class="rd-card-title">Upcoming Exams</div>
              <button class="rd-link" type="button" @click="viewAllExams">View All Exams</button>
            </div>

            <div class="rd-list">
              <div class="rd-item" v-for="e in upcomingExams" :key="e.id">
                <img class="rd-avatar" :src="e.avatar" alt="" />
                <div class="rd-item-main">
                  <div class="rd-item-name">{{ e.title }}</div>
                  <div class="rd-item-sub muted">{{ e.when }}</div>
                </div>
                <span class="rd-mini-ico">⤴</span>
              </div>
            </div>

            <div class="rd-card-foot">
              <button class="rd-link" type="button" @click="viewAllExams">View All Exams</button>
            </div>
          </div>
        </div>

        <!-- Bottom wide: Evaluation & Feedback -->
        <div class="rd-card wide">
          <div class="rd-card-head">
            <div class="rd-card-title">Evaluation &amp; Feedback</div>
            <button class="rd-link" type="button" @click="viewAllEvals">View All Evaluations</button>
          </div>

          <div class="rd-evals">
            <div class="rd-eval" v-for="ev in evalsWide" :key="ev.id">
              <img class="rd-avatar" :src="ev.avatar" alt="" />
              <div class="rd-eval-main">
                <div class="rd-item-name">
                  {{ ev.name }} <span class="muted">{{ ev.level }}</span>
                </div>
                <div class="rd-item-sub muted">{{ ev.note }}</div>
              </div>

              <div class="rd-stars" :aria-label="`Rating ${ev.rating}`">
                <span v-for="i in 5" :key="i" class="star" :class="{ on: i <= ev.rating }">★</span>
                <span class="rd-star-num">{{ ev.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="rd-right">
        <div class="rd-card">
          <div class="rd-card-head">
            <div class="rd-card-title">Residents On Shift</div>
            <button class="rd-link" type="button" @click="viewSchedule">View Schedule ›</button>
          </div>

          <div class="rd-list">
            <div class="rd-item" v-for="r in onShiftRight" :key="r.id">
              <img class="rd-avatar" :src="r.avatar" alt="" />
              <div class="rd-item-main">
                <div class="rd-item-name">{{ r.name }}</div>
                <div class="rd-item-sub muted">Shift: {{ r.shift }}</div>
              </div>
              <div class="rd-pill dept">{{ r.dept }}</div>
            </div>
          </div>
        </div>

        <div class="rd-card">
          <div class="rd-card-head">
            <div class="rd-card-title">Evaluation &amp; Feedback</div>
            <button class="rd-link" type="button" @click="viewAllEvals">›</button>
          </div>

          <div class="rd-list">
            <div class="rd-item" v-for="ev in evalsRight" :key="ev.id">
              <img class="rd-avatar" :src="ev.avatar" alt="" />
              <div class="rd-item-main">
                <div class="rd-item-name">{{ ev.name }} <span class="muted">{{ ev.level }}</span></div>
                <div class="rd-item-sub muted">{{ ev.note }}</div>
              </div>
              <span class="rd-mini-pill">↻</span>
            </div>
          </div>
        </div>

        <div class="rd-card">
          <div class="rd-card-head">
            <div class="rd-card-title">Announcements</div>
            <button class="rd-link" type="button" @click="viewAllAnnouncements">View All Exams ›</button>
          </div>

          <div class="rd-announce">
            <div class="rd-announce-item" v-for="a in announcements" :key="a.id">
              <div class="rd-announce-title">{{ a.title }}</div>
              <div class="rd-announce-sub muted">{{ a.sub }}</div>
            </div>
          </div>

          <button class="rd-cta" type="button" @click="addRequest">+ Add New Request</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

/* KPIs */
const kpiResidents = ref(12);
const kpiOnShift = ref(4);
const kpiExams = ref(3);
const kpiRequests = ref(1);

/* pass rate donut */
const passRate = ref(92);

/* line chart demo data */
const scores = ref([
  { label: "Feb", value: 62 },
  { label: "B+", value: 64 },
  { label: "March", value: 72 },
  { label: "Apr.", value: 84 },
  { label: "April", value: 89 },
]);

/* lists (demo) */
const onShiftLeft = ref([
  { id: 1, name: "Haley Smith", shift: "Today 11 AM - 7 PM", dept: "ER", avatar: "https://i.pravatar.cc/64?img=47" },
  { id: 2, name: "Julia Patel", shift: "Today 7 AM - 3 PM", dept: "Orientation", avatar: "https://i.pravatar.cc/64?img=12" },
  { id: 3, name: "David Brown", shift: "Today 8 AM - 6 PM", dept: "ICU", avatar: "https://i.pravatar.cc/64?img=15" },
  { id: 4, name: "Ryan Lincoln", shift: "Today 8 AM - 5 PM", dept: "Surgery", avatar: "https://i.pravatar.cc/64?img=22" },
]);

const onShiftRight = computed(() => onShiftLeft.value.slice(0, 3));

const upcomingExams = ref([
  { id: 1, title: "Pediatrics Exam", when: "Fri, 9 AM", avatar: "https://i.pravatar.cc/64?img=15" },
  { id: 2, title: "Cardiology Exam", when: "Mon, 2 PM", avatar: "https://i.pravatar.cc/64?img=47" },
  { id: 3, title: "ICU Exam", when: "In 2 Weeks", avatar: "https://i.pravatar.cc/64?img=12" },
]);

const evalsRight = ref([
  { id: 1, name: "Christina Foster", level: "PGY-1", note: "Ask for ICU rotation", avatar: "https://i.pravatar.cc/64?img=8" },
  { id: 2, name: "Alex Chen", level: "PGY-3", note: "Ask more NICU experience", avatar: "https://i.pravatar.cc/64?img=28" },
]);

const evalsWide = ref([
  { id: 1, name: "Christina Foster", level: "PGY-1", note: "Ask for ICU rotation", rating: 4, avatar: "https://i.pravatar.cc/64?img=8" },
  { id: 2, name: "Alex Chen", level: "PGY-3", note: "Ask more NICU experience", rating: 5, avatar: "https://i.pravatar.cc/64?img=28" },
]);

const announcements = ref([
  { id: 1, title: "Welcome new residents for orientation", sub: "Today, 6 AM, Room 215." },
  { id: 2, title: "Welcome to David Brown for outstanding performance in the ICU rotation this week", sub: "" },
]);

/* ===== Donut style (conic gradient) ===== */
const donutStyle = computed(() => {
  const v = Math.max(0, Math.min(100, passRate.value));
  return {
    background: `conic-gradient(#56b6b4 ${v}%, rgba(226,232,244,0.95) ${v}% 100%)`,
  };
});

/* ===== SVG line chart helpers ===== */
const linePoints = computed(() => {
  const w0 = 40, w1 = 500;
  const h0 = 20, h1 = 160;

  const vals = scores.value.map((s) => s.value);
  const min = Math.min(...vals, 50);
  const max = Math.max(...vals, 95);

  const stepX = (w1 - w0) / (scores.value.length - 1);

  return scores.value.map((s, i) => {
    const t = (s.value - min) / (max - min || 1);
    const x = w0 + stepX * i;
    const y = h1 - (h1 - h0) * t;
    return { key: `${s.label}-${i}`, x, y, value: s.value, label: s.label };
  });
});

const linePath = computed(() => {
  const pts = linePoints.value;
  if (!pts.length) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
});

const xTicks = computed(() =>
  linePoints.value.map((p) => ({ key: p.key, x: p.x, label: p.label }))
);

const lastScore = computed(() => {
  const pts = linePoints.value;
  return pts.length ? pts[pts.length - 1].value : 0;
});

const lastBubble = computed(() => {
  const pts = linePoints.value;
  if (!pts.length) return { x: 0, y: 0 };
  const last = pts[pts.length - 1];
  return { x: Math.min(500 - 62, last.x + 10), y: Math.max(20, last.y - 34) };
});

/* UI actions */
function viewExamScores(){ window.alert("Exam Scores (UI only)"); }
function viewSchedule(){ window.alert("View Schedule (UI only)"); }
function viewAllExams(){ window.alert("View All Exams (UI only)"); }
function viewAllEvals(){ window.alert("View All Evaluations (UI only)"); }
function viewAllAnnouncements(){ window.alert("View All (UI only)"); }
function addRequest(){ window.alert("Add New Request (UI only)"); }
</script>

<style scoped>
.rd{ display:grid; gap:18px; min-width:0; }
.rd-title{ margin:0; font-size:28px; font-weight:900; color:#2a3550; }
.rd-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.rd-sub-strong{ color:#2a3550; }
.rd-sub-sep{ opacity:.6; }
.muted{ color:#7a8aa7; font-weight:800; }

/* KPIs */
.rd-kpis{ display:grid; grid-template-columns:repeat(4, minmax(220px, 1fr)); gap:16px; }
.rd-kpi{
  border-radius:12px; padding:14px 16px; color:#fff; display:flex; justify-content:space-between; align-items:center;
  box-shadow:0 14px 26px rgba(34,50,74,0.14); border:1px solid rgba(255,255,255,0.25); min-width:0;
}
.rd-kpi-label{ font-weight:900; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rd-kpi-ico{ margin-top:6px; opacity:.95; }
.rd-kpi-value{ font-size:42px; font-weight:900; line-height:1; }
.rd-kpi.blue{ background:linear-gradient(90deg,#356ee6,#5c8cf5); }
.rd-kpi.teal{ background:linear-gradient(90deg,#2f9aa2,#4fc1cb); }
.rd-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.rd-kpi.purple{ background:linear-gradient(90deg,#6a4cff,#8d6cff); }

/* Main grid */
.rd-grid{ display:grid; grid-template-columns: 1.65fr 0.95fr; gap:16px; align-items:start; }
.rd-left, .rd-right{ display:grid; gap:16px; min-width:0; }

/* Panels/cards (glassy) */
.rd-panel, .rd-card{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
}
.rd-panel-head, .rd-card-head{
  padding:12px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.rd-panel-title, .rd-card-title{ font-weight:900; color:#2a3550; }

/* links */
.rd-link{
  border:0;
  background:transparent;
  cursor:pointer;
  font-weight:900;
  color:#2d76d6;
  white-space:nowrap;
}
.rd-link:hover{ text-decoration:underline; }
.chev{ opacity:.85; }

/* Academic layout */
.rd-acad{
  padding:14px;
  display:grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
  align-items:center;
}
.rd-donut{ display:grid; gap:12px; justify-items:center; }
.rd-donut-top{ display:flex; gap:10px; align-items:baseline; }
.rd-metric-label{ font-weight:900; color:#6b7a90; }
.rd-metric-value{ font-weight:900; color:#2f9aa2; font-size:22px; }

.rd-donut-ring{
  width: 180px;
  height: 180px;
  border-radius: 999px;
  position: relative;
  border: 1px solid rgba(226,232,244,0.95);
  box-shadow: 0 18px 32px rgba(34,50,74,0.10);
}
.rd-donut-ring::after{
  content:"";
  position:absolute;
  inset: 20px;
  border-radius: 999px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(226,232,244,0.85);
}
.rd-donut-center{
  position:absolute;
  inset: 0;
  display:grid;
  place-items:center;
  z-index: 1;
}
.rd-check{
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: rgba(86,182,180,0.18);
  border: 1px solid rgba(86,182,180,0.35);
  display:grid;
  place-items:center;
  font-weight: 900;
  color: #2f9aa2;
  font-size: 30px;
  box-shadow: 0 12px 24px rgba(47,154,162,0.10);
}

/* SVG chart */
.rd-line-wrap{
  border: 1px solid rgba(226,232,244,0.85);
  border-radius: 14px;
  background: rgba(255,255,255,0.55);
  padding: 10px 10px 6px;
}
.rd-svg{ width:100%; height:auto; display:block; }
.grid line{ stroke: rgba(226,232,244,0.95); stroke-width:1; }
.line{ fill:none; stroke:#356ee6; stroke-width:4; stroke-linecap:round; stroke-linejoin:round; }
.pt{ fill:#356ee6; stroke:#fff; stroke-width:3; }
.bubble{ fill:#356ee6; opacity:.92; }
.bubbleText{ fill:#fff; font-weight:900; font-size:13px; }
.xlabels text{ fill:#7a8aa7; font-weight:900; font-size:13px; }

/* shared list */
.rd-list{ padding:12px 14px; display:grid; gap:10px; }
.rd-item{
  display:flex; align-items:center; gap:10px;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.rd-avatar{ width:36px; height:36px; border-radius:999px; object-fit:cover; }
.rd-item-main{ min-width:0; }
.rd-item-name{ font-weight:900; color:#2a3550; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rd-item-sub{ margin-top:4px; font-size:12px; }
.rd-pill{
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
.rd-mini-ico{
  margin-left:auto;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display:grid;
  place-items:center;
  border:1px solid rgba(226,232,244,0.85);
  background: rgba(255,255,255,0.65);
  color:#2d76d6;
  font-weight:900;
}
.rd-mini-pill{
  margin-left:auto;
  padding:5px 8px;
  border-radius:10px;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(255,255,255,0.65);
  font-weight:900;
  color:#2d76d6;
}

/* second row */
.rd-row2{ display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
.rd-card-foot{ padding:10px 14px 14px; border-top: 1px solid rgba(226,232,244,0.55); text-align:right; }
.rd-card.wide{ overflow:hidden; }

/* evals wide */
.rd-evals{ padding:12px 14px; display:grid; gap:12px; }
.rd-eval{
  display:flex; align-items:center; gap:10px;
  padding:12px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.rd-eval-main{ min-width:0; }
.rd-stars{ margin-left:auto; display:flex; align-items:center; gap:4px; white-space:nowrap; }
.star{ font-size:16px; color: rgba(245,158,11,0.25); }
.star.on{ color: rgba(245,158,11,0.95); }
.rd-star-num{ margin-left:8px; font-weight:900; color:#6b7a90; }

/* announcements */
.rd-announce{ padding:12px 14px; display:grid; gap:14px; }
.rd-announce-item{
  padding-bottom:14px;
  border-bottom:1px solid rgba(226,232,244,0.55);
}
.rd-announce-item:last-child{ border-bottom:0; padding-bottom:0; }
.rd-announce-title{ font-weight:900; color:#2a3550; line-height:1.25; }
.rd-announce-sub{ margin-top:8px; }

/* CTA button */
.rd-cta{
  margin: 12px 14px 14px;
  border: 1px solid rgba(145,185,165,0.95);
  background: rgba(184,219,201,0.70);
  color:#2c5b46;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 900;
  cursor:pointer;
}
.rd-cta:hover{ background: rgba(184,219,201,0.85); }

/* responsive */
@media (max-width: 1400px){
  .rd-kpis{ grid-template-columns:repeat(2,1fr); }
}
@media (max-width: 1200px){
  .rd-grid{ grid-template-columns: 1fr; }
}
@media (max-width: 980px){
  .rd-row2{ grid-template-columns: 1fr; }
  .rd-acad{ grid-template-columns: 1fr; }
}
@media (max-width: 820px){
  .rd-kpis{ grid-template-columns:1fr; }
  .rd-title{ font-size:24px; }
}
</style>
