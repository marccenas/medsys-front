<template>
  <div class="sec">
    <!-- Header -->
    <div class="sec-head">
      <div>
        <h2 class="sec-title">Security Dashboard</h2>
        <div class="sec-sub">
          <span class="sec-sub-strong">Overview</span>
          <span class="sec-sub-sep">›</span>
          <span>Manage the security operations of the healthcare system.</span>
        </div>
      </div>
    </div>Recent Security Logs


    <!-- KPI Row -->
      <section class="sec-kpis">
        <div class="sec-kpi blue">
          <div class="sec-kpi-left">
            <div class="sec-kpi-label">Total Incidents</div>
            <div class="sec-kpi-ico">
              <font-awesome-icon icon="shield-halved" />
            </div>
          </div>
          <div class="sec-kpi-value">{{ kpiTotal }}</div>
        </div>

        <div class="sec-kpi teal">
          <div class="sec-kpi-left">
            <div class="sec-kpi-label">Open Incidents</div>
            <div class="sec-kpi-ico">
              <font-awesome-icon icon="clipboard-list" />
            </div>
          </div>
          <div class="sec-kpi-value">{{ kpiOpen }}</div>
        </div>

        <div class="sec-kpi orange">
          <div class="sec-kpi-left">
            <div class="sec-kpi-label">Critical Alerts</div>
            <div class="sec-kpi-ico">
              <font-awesome-icon icon="triangle-exclamation" />
            </div>
          </div>
          <div class="sec-kpi-value">{{ kpiCritical }}</div>
        </div>

        <div class="sec-kpi coral">
          <div class="sec-kpi-left">
            <div class="sec-kpi-label">Security Staff</div>
            <div class="sec-kpi-ico">
              <font-awesome-icon icon="user-shield" />
            </div>
          </div>
          <div class="sec-kpi-value">{{ kpiStaff }}</div>
        </div>

        <div class="sec-kpi purple">
          <div class="sec-kpi-left">
            <div class="sec-kpi-label">On Duty</div>
            <div class="sec-kpi-ico">
              <font-awesome-icon icon="clock" />
            </div>
          </div>
          <div class="sec-kpi-value">{{ kpiOnDuty }}</div>
        </div>
      </section>


    <!-- Top panels -->
    <section class="sec-grid">
      <!-- Incident Status -->
      <div class="sec-panel">
        <div class="sec-panel-head">
          <div class="sec-panel-title">Incident Status</div>
        </div>

        <div class="sec-status">
          <div class="sec-donut">
            <div class="sec-donut-ring" :style="{ background: donutBg }"></div>
            <div class="sec-donut-hole">
              <div class="sec-donut-big">{{ donutMain }}%</div>
            </div>
          </div>

          <div class="sec-legend">
            <div v-for="s in statusBreakdown" :key="s.key" class="sec-leg-row">
              <div class="sec-leg-left">
                <span class="sec-dot" :style="{ background: s.color }"></span>
                <span class="sec-leg-name">{{ s.label }}</span>
              </div>
              <div class="sec-leg-val">{{ s.pct }}%</div>
            </div>
          </div>
        </div>

        <div class="sec-status-foot">
          <div class="sec-foot-chip" v-for="s in statusBreakdown" :key="s.key">
            <span class="sec-dot" :style="{ background: s.color }"></span>
            {{ s.label }}
          </div>
        </div>
      </div>

      <!-- Incident Trends -->
      <div class="sec-panel">
        <div class="sec-panel-head">
          <div class="sec-panel-title">Incident Trends</div>

          <div class="sec-tabs">
            <button class="sec-tab" :class="{ active: trendTab === 'incidents' }" type="button" @click="trendTab='incidents'">
              Incidents
            </button>
            <button class="sec-tab" :class="{ active: trendTab === 'alerts' }" type="button" @click="trendTab='alerts'">
              Alerts
            </button>
          </div>

          <button class="sec-viewall" type="button" @click="uiOnly('View all trends')">View All ›</button>
        </div>

        <div class="sec-chart">
          <svg class="sec-svg" viewBox="0 0 740 240" preserveAspectRatio="none" aria-hidden="true">
            <!-- grid -->
            <g opacity="0.28">
              <line v-for="y in 5" :key="'gy'+y" :x1="0" :x2="740" :y1="y*40" :y2="y*40" stroke="#94a3b8" />
            </g>

            <!-- area under line -->
            <path :d="areaPath" fill="rgba(45,118,214,0.10)" />

            <!-- line -->
            <path :d="linePath" fill="none" stroke="#2d76d6" stroke-width="4" stroke-linecap="round" />

            <!-- points -->
            <g>
              <circle
                v-for="(p, i) in plotPoints"
                :key="'pt'+i"
                :cx="p.x"
                :cy="p.y"
                r="7"
                fill="#fff"
                stroke="#2d76d6"
                stroke-width="4"
              />
            </g>
          </svg>

          <div class="sec-xlabels">
            <div v-for="(l, i) in trendLabels" :key="'xl'+i" class="sec-xlab">{{ l }}</div>
          </div>
        </div>

        <div class="sec-chart-foot">
          <div class="sec-mini-tabs">
            <button class="sec-mini" :class="{ active: trendTab === 'incidents' }" type="button" @click="trendTab='incidents'">
              Incidents
            </button>
            <button class="sec-mini" :class="{ active: trendTab === 'alerts' }" type="button" @click="trendTab='alerts'">
              Alerts
            </button>
          </div>

          <div class="sec-icons">
            <button class="sec-ic" type="button" @click="uiOnly('List view')">≡</button>
            <button class="sec-ic" type="button" @click="uiOnly('Chart view')">▮▮</button>
          </div>
        </div>
      </div>

      <!-- Recent Security Logs -->
      <div class="sec-panel">
        <div class="sec-panel-head">
          <div class="sec-panel-title">Recent Security Logs</div>
          <button class="sec-viewall" type="button" @click="uiOnly('View all logs')">View All ›</button>
        </div>

        <div class="sec-table-wrap">
          <table class="sec-table">
            <colgroup>
              <col style="width: 130px" />
              <col style="width: 320px" />
              <col style="width: 200px" />
              <col style="width: 150px" />
              <col style="width: 46px" />
            </colgroup>
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="r in recentLogs" :key="r.id">
                <td class="sec-time">{{ r.time }}</td>
                <td class="sec-type">
                  <span class="sec-type-ico" :class="r.icoClass">{{ r.ico }}</span>
                  <span class="sec-type-txt">{{ r.type }}</span>
                </td>
                <td class="sec-loc">{{ r.location }}</td>
                <td>
                  <span class="sec-pill" style=" font-weight: 300 !important;" :class="pillClass(r.status)">{{ r.status }}</span>
                </td>
                <td class="sec-dotcell">
                  <span class="sec-rightdot" :class="rightDotClass(r.status)"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Security Alerts -->
      <div class="sec-panel">
        <div class="sec-panel-head">
          <div class="sec-panel-title">Security Alerts</div>
          <button class="sec-viewall" type="button" @click="uiOnly('View all alerts')">View All ›</button>
        </div>

        <div class="sec-table-wrap">
          <table class="sec-table">
            <colgroup>
              <col style="width: 330px" />
              <col style="width: 190px" />
              <col style="width: 160px" />
              <col style="width: 150px" />
              <col style="width: 46px" />
            </colgroup>
            <thead>
              <tr>
                <th>Alert</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="a in alerts" :key="a.id">
                <td class="sec-ellip">{{ a.alert }}</td>
                <td class="sec-loc">{{ a.location }}</td>
                <td>
                  <span class="sec-pill" :class="pillClass(a.priority)">{{ a.priority }}</span>
                </td>
                <td class="sec-muted">{{ a.time }}</td>
                <td class="sec-dotcell">
                  <button class="sec-rowgo" type="button" @click="uiOnly('Open alert')">›</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

/* KPI */
const kpiTotal = ref(24);
const kpiOpen = ref(5);
const kpiCritical = ref(2);
const kpiStaff = ref(12);
const kpiOnDuty = ref(12);

/* Donut breakdown (matches UI: 33/29/25/13) */
const statusBreakdown = ref([
  { key: "open", label: "Open", pct: 33, color: "#3b82f6" },
  { key: "progress", label: "In Progress", pct: 29, color: "#22c55e" },
  { key: "resolved", label: "Resolved", pct: 25, color: "#f59e0b" },
  { key: "critical", label: "Critical", pct: 13, color: "#fb7185" },
]);

const donutMain = computed(() => statusBreakdown.value[0]?.pct ?? 0);

/* Build conic-gradient for donut */
const donutBg = computed(() => {
  let acc = 0;
  const stops = statusBreakdown.value.map((s) => {
    const start = acc;
    acc += s.pct;
    return `${s.color} ${start}% ${acc}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
});

/* Trend chart */
const trendTab = ref("incidents");

const trendLabels = computed(() => [
  "7 days ago",
  "7 days ago",
  "7 days ago",
  "7 days ago",
  "Today",
  "Today",
]);

const seriesIncidents = [5.0, 4.6, 5.6, 5.1, 6.1, 6.8];
const seriesAlerts = [3.0, 2.8, 3.4, 3.2, 3.8, 4.1];

const trendSeries = computed(() => (trendTab.value === "alerts" ? seriesAlerts : seriesIncidents));

/* Map series to SVG points */
const plotPoints = computed(() => {
  const w = 740;
  const h = 240;
  const padX = 70;
  const padY = 28;

  const vals = trendSeries.value;
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);

  const usableW = w - padX * 2;
  const usableH = h - padY * 2;

  return vals.map((v, i) => {
    const t = vals.length === 1 ? 0 : i / (vals.length - 1);
    const x = padX + t * usableW;

    // invert y
    const norm = maxV === minV ? 0.5 : (v - minV) / (maxV - minV);
    const y = padY + (1 - norm) * usableH;

    return { x, y };
  });
});

function toPath(points) {
  if (!points.length) return "";
  return points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");
}

const linePath = computed(() => toPath(plotPoints.value));

const areaPath = computed(() => {
  const pts = plotPoints.value;
  if (!pts.length) return "";
  const last = pts[pts.length - 1];
  const first = pts[0];
  const baseY = 240 - 28; // same padY bottom
  return `${toPath(pts)} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
});

/* Tables */
const recentLogs = ref([
  { id: 1, time: "09:15 AM", type: "Attempted Access", location: "Main Entrance", status: "Critical", ico: "!", icoClass: "red" },
  { id: 2, time: "09:45 AM", type: "Suspicious Activity", location: "Ward B", status: "In Progress", ico: "•", icoClass: "orange" },
  { id: 3, time: "07:30 AM", type: "Unauthorized Entry", location: "Pharmacy", status: "Critical", ico: "!", icoClass: "red" },
  { id: 4, time: "07:00 AM", type: "Door Ajar", location: "ICU Hall", status: "Open", ico: "i", icoClass: "blue" },
  { id: 5, time: "06:30 AM", type: "System Check", location: "ER", status: "Resolved", ico: "✓", icoClass: "teal" },
]);

const alerts = ref([
  { id: 1, alert: "Attempted access by unauthorized user...", location: "Main Entrance", priority: "Critical", time: "5 mins ago" },
  { id: 2, alert: "Suspicious activity reported by staff...", location: "Ward B", priority: "High", time: "20 mins ago" },
  { id: 3, alert: "Unauthorized entry detected in...", location: "Pharmacy", priority: "Critical", time: "45 mins ago" },
  { id: 4, alert: "System Check", location: "ER", priority: "Resolved", time: "06 mins ago" },
]);

function pillClass(val) {
  const s = String(val || "").toLowerCase();
  if (s.includes("critical")) return "red";
  if (s.includes("high")) return "orange";
  if (s.includes("progress")) return "peach";
  if (s.includes("open")) return "blue";
  if (s.includes("resolved")) return "green";
  return "muted";
}

function rightDotClass(val) {
  const s = String(val || "").toLowerCase();
  if (s.includes("critical")) return "rd-red";
  if (s.includes("progress")) return "rd-orange";
  if (s.includes("open")) return "rd-blue";
  if (s.includes("resolved")) return "rd-green";
  return "rd-muted";
}

function uiOnly(name) {
  window.alert(`${name} (UI only)`);
}
</script>

<style scoped>
td {
  font-weight: 500 !important;
  font-size: medium !important;
}

.sec{ display:grid; gap:16px; min-width:0; }

/* header */
.sec-title{ margin:0; font-size:30px; font-weight:900; color:#1f2a44; }
.sec-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.sec-sub-strong{ color:#2a3550; }
.sec-sub-sep{ opacity:.6; }

/* kpis */
.sec-kpis{
  display:grid;
  grid-template-columns: repeat(5, minmax(190px, 1fr));
  gap:14px;
}
.sec-kpi{
  border-radius:14px;
  padding:14px 16px;
  color:#fff;
  display:flex;
  justify-content:space-between;
  align-items:center;
  box-shadow:0 16px 34px rgba(34,50,74,0.14);
  border:1px solid rgba(255,255,255,0.25);
  min-width:0;
}
.sec-kpi-left{ min-width:0; }
.sec-kpi-label{ font-weight:900; font-size:13px; opacity:.95; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sec-kpi-ico{
  margin-top:8px;
  width:34px; height:34px;
  display:grid; place-items:center;
}
.sec-kpi-value{ font-size:40px; font-weight:900; line-height:1; }
.sec-kpi.blue{ background:linear-gradient(90deg,#2e6be6,#5b8df6); }
.sec-kpi.teal{ background:linear-gradient(90deg,#1f97a3,#49c0cb); }
.sec-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.sec-kpi.coral{ background:linear-gradient(90deg,#ff5a5f,#ff7a87); }
.sec-kpi.purple{ background:linear-gradient(90deg,#6d5ef8,#9a7cff); }

/* main grid */
.sec-grid{
  display:grid;
  grid-template-columns: 1.05fr 1fr;
  grid-auto-rows: min-content;
  gap:14px;
}

/* panel */
.sec-panel{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.70));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
}
.sec-panel-head{
  padding:14px 16px;
  display:flex;
  align-items:center;
  gap:12px;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.sec-panel-title{ font-weight:900; color:#1f2a44; }
.sec-viewall{
  margin-left:auto;
  border:0;
  background:transparent;
  cursor:pointer;
  font-weight:900;
  color:#2d76d6;
}
.sec-viewall:hover{ text-decoration: underline; }

/* tabs */
.sec-tabs{
  margin-left:auto;
  display:flex;
  background:rgba(248,251,255,0.85);
  border:1px solid rgba(226,232,244,0.9);
  border-radius:999px;
  padding:4px;
  gap:4px;
}
.sec-tab{
  border:0;
  background:transparent;
  cursor:pointer;
  font-weight:900;
  color:#64748b;
  padding:8px 14px;
  border-radius:999px;
}
.sec-tab.active{
  background:#fff;
  border:1px solid rgba(226,232,244,0.95);
  color:#1f2a44;
  box-shadow:0 10px 22px rgba(15,23,42,0.08);
}

/* incident status layout */
.sec-status{
  padding:16px;
  display:grid;
  grid-template-columns: 260px 1fr;
  gap:16px;
  align-items:center;
}
.sec-donut{ position:relative; width:220px; height:220px; margin:0 auto; }
.sec-donut-ring{
  width:220px; height:220px;
  border-radius:999px;
  box-shadow: inset 0 0 0 1px rgba(226,232,244,0.65);
}
.sec-donut-hole{
  position:absolute; inset:24px;
  border-radius:999px;
  background:rgba(255,255,255,0.85);
  border:1px solid rgba(226,232,244,0.9);
  box-shadow:0 16px 30px rgba(15,23,42,0.10);
  display:grid; place-items:center;
}
.sec-donut-big{ font-size:44px; font-weight:900; color:#1f2a44; }

.sec-legend{
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:14px 14px;
  box-shadow:0 14px 28px rgba(15,23,42,0.08);
}
.sec-leg-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:9px 6px;
  border-bottom:1px solid rgba(226,232,244,0.6);
}
.sec-leg-row:last-child{ border-bottom:0; }
.sec-leg-left{ display:flex; align-items:center; gap:10px; }
.sec-dot{ width:10px; height:10px; border-radius:999px; }
.sec-leg-name{ font-weight:900; color:#1f2a44; }
.sec-leg-val{ font-weight:900; color:#1f2a44; opacity:.85; }

.sec-status-foot{
  padding:0 16px 16px;
  display:flex;
  gap:18px;
  align-items:center;
  justify-content:center;
  color:#5b6b86;
  font-weight:900;
}
.sec-foot-chip{ display:flex; align-items:center; gap:10px; }

/* chart */
.sec-chart{ padding: 12px 16px 16px; }
.sec-svg{
  width:100%;
  height:220px;
  border-radius:14px;
  background:linear-gradient(180deg, rgba(255,255,255,0.55), rgba(250,252,255,0.30));
  border:1px solid rgba(226,232,244,0.85);
}
.sec-xlabels{
  display:grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: 10px;
  color:#6b7a90;
  font-weight:900;
  font-size:12px;
}
.sec-xlab{ text-align:center; }

.sec-chart-foot{
  padding: 10px 16px 14px;
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap: 12px;
}
.sec-mini-tabs{
  margin-right:auto;
  display:flex;
  border-radius:12px;
  overflow:hidden;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
}
.sec-mini{
  border:0;
  background:transparent;
  cursor:pointer;
  padding:10px 16px;
  font-weight:900;
  color:#64748b;
}
.sec-mini.active{
  background:rgba(45,118,214,0.18);
  color:#1e5fb7;
}
.sec-icons{ display:flex; gap:10px; }
.sec-ic{
  width:44px; height:36px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  font-weight:900;
  color:#425574;
  cursor:pointer;
}
.sec-ic:hover{ background:rgba(255,255,255,0.75); }

/* tables */
.sec-table-wrap{ padding: 10px 14px 14px; overflow:auto; }
.sec-table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
  table-layout:fixed;
  background:rgba(255,255,255,0.50);
  border:1px solid rgba(226,232,244,0.85);
  border-radius:14px;
  overflow:hidden;
}
.sec-table thead th{
  text-align:left;
  font-size:12px;
  color:#6b7a90;
  font-weight:900;
  padding:12px 12px;
  border-bottom:1px solid rgba(226,232,244,0.75);
  background:linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.80));
}
.sec-table tbody td{
  padding:12px 12px;
  border-bottom:1px solid rgba(226,232,244,0.55);
  color:#2a3550;
  font-size:13px;
}
.sec-table tbody tr:last-child td{ border-bottom:0; }
.sec-time{ font-weight:900; color:#44567a; }
.sec-type{ display:flex; align-items:center; gap:10px; }
.sec-type-ico{
  width:22px; height:22px; border-radius:999px;
  display:grid; place-items:center;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(255,255,255,0.65);
}
.sec-type-ico.red{ background:rgba(255,120,120,0.25); color:#b4232a; border-color:rgba(255,120,120,0.35); }
.sec-type-ico.orange{ background:rgba(255,170,85,0.25); color:#8a3b12; border-color:rgba(255,170,85,0.35); }
.sec-type-ico.blue{ background:rgba(45,118,214,0.18); color:#1e5fb7; border-color:rgba(45,118,214,0.30); }
.sec-type-ico.teal{ background:rgba(100,190,200,0.25); color:#1f5a63; border-color:rgba(100,190,200,0.35); }

.sec-type-txt{ font-weight:900; }
.sec-loc{ color:#51607a; font-weight:800; }
.sec-muted{ color:#6b7a90; font-weight:800; }
.sec-ellip{ font-weight:900; color:#2a3550; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

.sec-pill{
  padding:6px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  display:inline-flex;
  align-items:center;
  gap:8px;
  white-space:nowrap;
}
.sec-pill.red{ background:rgba(255,120,120,0.28); color:#7b1f1f; border-color:rgba(255,120,120,0.35); }
.sec-pill.orange{ background:rgba(255,170,85,0.40); color:#7a3a10; border-color:rgba(255,170,85,0.45); }
.sec-pill.peach{ background:rgba(255,220,200,0.70); color:#6b3b2b; border-color:rgba(255,210,190,0.85); }
.sec-pill.blue{ background:rgba(45,118,214,0.18); color:#1e5fb7; border-color:rgba(45,118,214,0.30); }
.sec-pill.green{ background:rgba(100,190,200,0.28); color:#1f5a63; border-color:rgba(100,190,200,0.35); }
.sec-pill.muted{ background:rgba(230,232,240,0.7); color:#51607a; }

.sec-dotcell{ text-align:right; }
.sec-rightdot{
  width:12px; height:12px; border-radius:999px;
  display:inline-block;
  border:1px solid rgba(226,232,244,0.8);
}
.rd-red{ background:rgba(255,120,120,0.60); box-shadow:0 0 0 6px rgba(255,120,120,0.14); }
.rd-orange{ background:rgba(255,170,85,0.65); box-shadow:0 0 0 6px rgba(255,170,85,0.14); }
.rd-blue{ background:rgba(45,118,214,0.55); box-shadow:0 0 0 6px rgba(45,118,214,0.12); }
.rd-green{ background:rgba(100,190,200,0.60); box-shadow:0 0 0 6px rgba(100,190,200,0.12); }
.rd-muted{ background:rgba(148,163,184,0.55); box-shadow:0 0 0 6px rgba(148,163,184,0.10); }

.sec-rowgo{
  width:34px; height:30px;
  border-radius:10px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  font-weight:900;
  color:#2d76d6;
  cursor:pointer;
}
.sec-rowgo:hover{ background:rgba(255,255,255,0.75); }

/* responsive */
@media (max-width: 1400px){
  .sec-kpis{ grid-template-columns: repeat(3, minmax(200px, 1fr)); }
  .sec-grid{ grid-template-columns: 1fr; }
}
@media (max-width: 820px){
  .sec-kpis{ grid-template-columns: 1fr; }
  .sec-title{ font-size:24px; }
  .sec-status{ grid-template-columns: 1fr; }
  .sec-donut{ width:200px; height:200px; }
  .sec-donut-ring{ width:200px; height:200px; }
}
</style>
