<template>
  <div class="phd">
    <!-- Header -->
    <div class="phd-head">
      <div>
        <h2 class="phd-title">Pharmacy Dashboard</h2>
        <div class="phd-sub">
          <span class="phd-sub-strong">Medications Overview</span>
          <span class="phd-sub-sep">›</span>
          <span>Monitor and manage pharmacy operations.</span>
        </div>
      </div>
    </div>

    <!-- KPI row -->
    <section class="phd-kpis">
      <div class="phd-kpi blue">
        <div class="phd-kpi-left">
          <div class="phd-kpi-label">Total Orders</div>
          <div class="phd-kpi-ico">👥</div>
        </div>
        <div class="phd-kpi-value">{{ kpiTotal }}</div>
      </div>

      <div class="phd-kpi teal">
        <div class="phd-kpi-left">
          <div class="phd-kpi-label">Orders Pending</div>
          <div class="phd-kpi-ico">⌛</div>
        </div>
        <div class="phd-kpi-value">{{ kpiPending }}</div>
      </div>

      <div class="phd-kpi orange">
        <div class="phd-kpi-left">
          <div class="phd-kpi-label">Orders Completed</div>
          <div class="phd-kpi-ico">✓</div>
        </div>
        <div class="phd-kpi-value">{{ kpiCompleted }}</div>
      </div>

      <div class="phd-kpi pink">
        <div class="phd-kpi-left">
          <div class="phd-kpi-label">Stock Alerts</div>
          <div class="phd-kpi-ico">⚑</div>
        </div>
        <div class="phd-kpi-value">{{ kpiAlerts }}</div>
      </div>
    </section>

    <!-- Row 1 -->
    <section class="phd-row1">
      <!-- Order Queue -->
      <div class="phd-card">
        <div class="phd-card-head">
          <div class="phd-card-title">Order Queue</div>
          <div class="phd-card-meta">6 of 56 ›</div>
        </div>

        <div class="phd-queue">
          <div class="phd-donut">
            <div class="phd-ring" :style="queueRingStyle"></div>
            <div class="phd-donut-center">
              <div class="phd-donut-pct">{{ queuePct }}%</div>
            </div>
          </div>

          <div class="phd-qlegend">
            <div class="phd-qrow" v-for="q in queueLegend" :key="q.id">
              <span class="phd-chip" :class="q.tone">{{ q.code }}</span>
              <span class="phd-qname">{{ q.label }}</span>
              <span class="phd-qnum">{{ q.value }}</span>
            </div>
          </div>
        </div>

        <div class="phd-card-foot">
          <div class="phd-foot-muted">Total Orders</div>
          <div class="phd-foot-right">
            <span class="phd-foot-muted">Total</span>
            <span class="phd-foot-strong">{{ kpiTotal }}</span>
          </div>
        </div>
      </div>

      <!-- Medication Stock Levels -->
      <div class="phd-card">
        <div class="phd-card-head">
          <div class="phd-card-title">Medication Stock Levels</div>
          <button class="phd-link" type="button" @click="viewAllOrders">View All Orders ›</button>
        </div>

        <div class="phd-stock">
          <div class="phd-stock-row" v-for="m in meds" :key="m.id">
            <div class="phd-stock-name">{{ m.name }}</div>

            <div class="phd-bar">
              <div class="phd-bar-fill" :class="m.tone" :style="{ width: m.fill + '%' }"></div>

              <div v-if="m.badge" class="phd-bar-badge" :class="m.tone">
                {{ m.badge }}
              </div>
            </div>

            <div class="phd-stock-right" :class="{ muted: m.rightTone === 'muted' }">
              {{ m.right }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Row 2 -->
    <section class="phd-row2">
      <!-- Recent Orders -->
      <div class="phd-card">
        <div class="phd-card-head">
          <div class="phd-card-title">Recent Orders</div>
          <button class="phd-link" type="button" @click="viewAllOrders">View All Orders ›</button>
        </div>

        <div class="phd-orders">
          <div class="phd-order" v-for="o in recentOrders" :key="o.id">
            <div class="phd-order-main">
              <div class="phd-order-title">{{ o.med }}</div>
              <div class="phd-order-sub muted">
                {{ o.when }} • {{ o.by }}
              </div>
            </div>

            <div class="phd-order-unit muted">{{ o.unit }}</div>

            <span class="phd-pill" :class="o.statusTone">{{ o.status }}</span>
          </div>
        </div>
      </div>

      <!-- To-Do List -->
      <div class="phd-card">
        <div class="phd-card-head">
          <div class="phd-card-title">To-Do List</div>
          <button class="phd-link" type="button" @click="viewAllTasks">View All Tasks ›</button>
        </div>

        <div class="phd-todos">
          <div class="phd-todo" v-for="t in todos" :key="t.id">
            <div class="phd-todo-ico" :class="t.tone">{{ t.ico }}</div>
            <div class="phd-todo-main">
              <div class="phd-todo-title">{{ t.title }}</div>
              <div class="phd-todo-sub muted">{{ t.sub }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Messages (top) -->
      <div class="phd-card">
        <div class="phd-card-head">
          <div class="phd-card-title">Team Messages</div>
          <button class="phd-link" type="button" @click="viewAllMessages">View All ›</button>
        </div>

        <div class="phd-messages">
          <div class="phd-msg" v-for="m in teamMsgsTop" :key="m.id">
            <img class="phd-avatar" :src="m.avatar" alt="" />
            <div class="phd-msg-main">
              <div class="phd-msg-name">{{ m.name }}</div>
              <div class="phd-msg-text muted">{{ m.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Row 3 -->
    <section class="phd-row3">
      <!-- Utilization chart -->
      <div class="phd-card phd-wide">
        <div class="phd-card-head">
          <div class="phd-card-title">Medication Utilization Charts</div>

          <div class="phd-head-controls">
            <div class="phd-dd">
              <select v-model="range">
                <option value="7">Past 7 Days</option>
                <option value="14">Past 14 Days</option>
                <option value="30">Past 30 Days</option>
              </select>
              <span class="phd-dd-ico">▾</span>
            </div>

            <button class="phd-link" type="button" @click="viewFullReport">View Full Report ›</button>
          </div>
        </div>

        <div class="phd-chart">
          <svg viewBox="0 0 760 210" class="phd-svg" role="img" aria-label="utilization chart">
            <g class="grid">
              <line x1="40" y1="22" x2="740" y2="22" />
              <line x1="40" y1="82" x2="740" y2="82" />
              <line x1="40" y1="142" x2="740" y2="142" />
              <line x1="40" y1="202" x2="740" y2="202" />
            </g>

            <path class="l1" d="M 40 170 L 140 110 L 240 125 L 340 95 L 440 120 L 540 105 L 640 80 L 740 60" />
            <path class="l2" d="M 40 150 L 140 140 L 240 118 L 340 130 L 440 110 L 540 115 L 640 110 L 740 98" />
            <path class="l3" d="M 40 120 L 140 70 L 240 100 L 340 85 L 440 130 L 540 118 L 640 125 L 740 110" />
            <path class="l4" d="M 40 185 L 140 178 L 240 165 L 340 160 L 440 148 L 540 140 L 640 130 L 740 120" />

            <g class="xlabels">
              <text x="40" y="208" text-anchor="middle">Tue</text>
              <text x="140" y="208" text-anchor="middle">Wed</text>
              <text x="240" y="208" text-anchor="middle">Thu</text>
              <text x="340" y="208" text-anchor="middle">Fri</text>
              <text x="440" y="208" text-anchor="middle">Sat</text>
              <text x="540" y="208" text-anchor="middle">Sun</text>
              <text x="640" y="208" text-anchor="middle">Mon</text>
              <text x="740" y="208" text-anchor="middle">Tue</text>
            </g>
          </svg>

          <div class="phd-legend">
            <div class="phd-leg"><span class="dot d1"></span> Ativan</div>
            <div class="phd-leg"><span class="dot d2"></span> Metoprolol</div>
            <div class="phd-leg"><span class="dot d3"></span> Insulin</div>
            <div class="phd-leg"><span class="dot d4"></span> Morphine</div>
          </div>

          <button class="phd-report" type="button" @click="viewFullReport">View Full Report</button>
        </div>
      </div>

      <!-- Team Messages (bottom) -->
      <div class="phd-card">
        <div class="phd-card-head">
          <div class="phd-card-title">Team Messages</div>
          <button class="phd-link" type="button" @click="viewAllMessages">View All ›</button>
        </div>

        <div class="phd-messages">
          <div class="phd-msg" v-for="m in teamMsgsBottom" :key="m.id">
            <img class="phd-avatar" :src="m.avatar" alt="" />
            <div class="phd-msg-main">
              <div class="phd-msg-name">{{ m.name }}</div>
              <div class="phd-msg-text muted">{{ m.text }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Announcements -->
      <div class="phd-card">
        <div class="phd-card-head">
          <div class="phd-card-title">Announcements</div>
        </div>

        <div class="phd-announce">
          <div class="phd-announce-item">
            <div class="phd-announce-title">Highlighting Ciprofloxacin Shortage:</div>
            <div class="phd-announce-text muted">
              500 mg stock is low. Next shipment expected by Wednesday.
            </div>
          </div>

          <div class="phd-announce-item">
            <div class="phd-announce-title">Double check all discharge medications</div>
            <div class="phd-announce-text muted">
              Before packing the pharmacy to ensure medication safety.
            </div>
          </div>

          <button class="phd-cta" type="button" @click="addNewOrder">+ Add New Order</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

/* KPIs */
const kpiTotal = ref(56);
const kpiPending = ref(6);
const kpiCompleted = ref(25);
const kpiAlerts = ref(3);

/* donut queue */
const queuePct = ref(61); // from UI
const queueRingStyle = computed(() => {
  const v = Math.max(0, Math.min(100, queuePct.value));
  return {
    background: `conic-gradient(#67b9a4 ${v}%, rgba(226,232,244,0.95) ${v}% 100%)`,
  };
});

const queueLegend = ref([
  { id: 1, code: "63", label: "Pending", value: 6, tone: "teal" },
  { id: 2, code: "93", label: "Completed", value: 6, tone: "blue" },
  { id: 3, code: "65", label: "Pending", value: 25, tone: "orange" },
]);

/* stock */
const meds = ref([
  { id: 1, name: "Morphine", fill: 72, tone: "pink", badge: "⚠ 15 units", right: "-15 units", rightTone: "" },
  { id: 2, name: "Ativan", fill: 54, tone: "orange", badge: null, right: "Adequate", rightTone: "muted" },
  { id: 3, name: "Ciprofloxacin", fill: 46, tone: "green", badge: null, right: "Adequate", rightTone: "muted" },
  { id: 4, name: "Insulin", fill: 68, tone: "pink", badge: "⚠ 10 units", right: "-10 units", rightTone: "" },
]);

/* recent orders */
const recentOrders = ref([
  { id: 1, med: "Fentanyl 100 mcg", unit: "ICU", when: "Hour ago", by: "Sarah Miller", status: "Pending", statusTone: "blue" },
  { id: 2, med: "Atorvastatin 40 mg", unit: "ER", when: "2 hour ago", by: "Sarah Miller", status: "Pending", statusTone: "green" },
  { id: 3, med: "Metoprolol 25 mg", unit: "ICU", when: "2 hour ago", by: "Sarah Miller", status: "Pending", statusTone: "orange" },
]);

/* todos */
const todos = ref([
  { id: 1, title: "Review Out of Stock Situation", sub: "", ico: "✉", tone: "teal" },
  { id: 2, title: "MTM Consult: Mr. Thompson", sub: "Consult Room 2 today 10:00 AM", ico: "🔒", tone: "blue" },
  { id: 3, title: "Inventory Check Putnam Pharmacy", sub: "restock scenarios today", ico: "🔒", tone: "blue" },
]);

/* messages */
const teamMsgsTop = ref([
  { id: 1, name: "Jill Chan, Pharmacy Tech", text: "Fentanyl restocked, updated in the system 16 min ago.", avatar: "https://i.pravatar.cc/64?img=47" },
  { id: 2, name: "Chris Rivera, Lead Pharmacist", text: "Complete signature before 2PM today.", avatar: "https://i.pravatar.cc/64?img=22" },
]);

const teamMsgsBottom = ref([
  { id: 1, name: "Jill Chan, Pharmacy Tech", text: "Fentanyl restocked and updated in the system.", avatar: "https://i.pravatar.cc/64?img=47" },
  { id: 2, name: "Chris Rivera, Lead Pharmacist", text: "Prescription signature requires review.", avatar: "https://i.pravatar.cc/64?img=22" },
  { id: 3, name: "David Patel, Pharmacy Tech", text: "Urgent package to be completed before 2:30PM.", avatar: "https://i.pravatar.cc/64?img=15" },
]);

/* chart range */
const range = ref("7");

/* actions */
function viewAllOrders(){ window.alert("View All Orders (UI only)"); }
function viewAllTasks(){ window.alert("View All Tasks (UI only)"); }
function viewAllMessages(){ window.alert("View All Messages (UI only)"); }
function viewFullReport(){ window.alert("View Full Report (UI only)"); }
function addNewOrder(){ window.alert("Add New Order (UI only)"); }
</script>

<style scoped>
.phd{ display:grid; gap:18px; min-width:0; }
.phd-title{ margin:0; font-size:28px; font-weight:900; color:#2a3550; }
.phd-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.phd-sub-strong{ color:#2a3550; }
.phd-sub-sep{ opacity:.6; }
.muted{ color:#7a8aa7; font-weight:800; }

/* KPIs */
.phd-kpis{ display:grid; grid-template-columns:repeat(4, minmax(220px, 1fr)); gap:16px; }
.phd-kpi{
  border-radius:12px; padding:14px 16px; color:#fff; display:flex; justify-content:space-between; align-items:center;
  box-shadow:0 14px 26px rgba(34,50,74,0.14); border:1px solid rgba(255,255,255,0.25); min-width:0;
}
.phd-kpi-label{ font-weight:900; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.phd-kpi-ico{ margin-top:6px; opacity:.95; }
.phd-kpi-value{ font-size:42px; font-weight:900; line-height:1; }
.phd-kpi.blue{ background:linear-gradient(90deg,#356ee6,#5c8cf5); }
.phd-kpi.teal{ background:linear-gradient(90deg,#2f9aa2,#4fc1cb); }
.phd-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.phd-kpi.pink{ background:linear-gradient(90deg,#ff4d6d,#ff7d87); }

/* glass cards */
.phd-card{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
  min-width:0;
}
.phd-card-head{
  padding:12px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.phd-card-title{ font-weight:900; color:#2a3550; }
.phd-card-meta{ font-weight:900; color:#6b7a90; }

.phd-link{
  border:0; background:transparent; cursor:pointer;
  font-weight:900; color:#2d76d6; white-space:nowrap;
}
.phd-link:hover{ text-decoration:underline; }

/* rows */
.phd-row1{ display:grid; grid-template-columns: 1.05fr 1.55fr; gap:16px; align-items:start; }
.phd-row2{ display:grid; grid-template-columns: 1.25fr 1fr 1fr; gap:16px; align-items:start; }
.phd-row3{ display:grid; grid-template-columns: 1.8fr 1fr 1fr; gap:16px; align-items:start; }
.phd-wide{ grid-column: span 1; }

/* Order queue */
.phd-queue{ padding:14px; display:grid; grid-template-columns: 200px 1fr; gap:16px; align-items:center; }
.phd-donut{ position:relative; display:grid; place-items:center; }
.phd-ring{
  width: 160px; height: 160px; border-radius:999px;
  border:1px solid rgba(226,232,244,0.95);
  box-shadow:0 18px 32px rgba(34,50,74,0.10);
  position:relative;
}
.phd-ring::after{
  content:"";
  position:absolute;
  inset: 20px;
  border-radius:999px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(226,232,244,0.85);
}
.phd-donut-center{ position:absolute; inset:0; display:grid; place-items:center; z-index:1; }
.phd-donut-pct{ font-weight:900; font-size:24px; color:#2a3550; }

.phd-qlegend{ display:grid; gap:10px; }
.phd-qrow{ display:flex; align-items:center; gap:10px; }
.phd-chip{
  min-width:44px; height:22px;
  border-radius:8px;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(255,255,255,0.55);
  display:grid; place-items:center;
  font-weight:900; font-size:12px; color:#425574;
}
.phd-chip.teal{ background:rgba(100,190,200,0.35); color:#1f5a63; }
.phd-chip.blue{ background:rgba(45,118,214,0.18); color:#1e5fb7; }
.phd-chip.orange{ background:rgba(255,170,85,0.55); color:#7a3a10; }
.phd-qname{ font-weight:900; color:#2a3550; }
.phd-qnum{ margin-left:auto; font-weight:900; color:#2a3550; }

/* card foot */
.phd-card-foot{
  padding:10px 14px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-top:1px solid rgba(226,232,244,0.55);
}
.phd-foot-muted{ color:#6b7a90; font-weight:800; font-size:12px; }
.phd-foot-right{ display:flex; gap:10px; align-items:baseline; }
.phd-foot-strong{ font-weight:900; color:#2a3550; }

/* stock */
.phd-stock{ padding:14px; display:grid; gap:14px; }
.phd-stock-row{ display:grid; grid-template-columns: 160px 1fr 110px; gap:12px; align-items:center; }
.phd-stock-name{ font-weight:900; color:#2a3550; }

.phd-bar{
  position:relative;
  height: 14px;
  border-radius: 999px;
  border:1px solid rgba(226,232,244,0.85);
  background: rgba(230,232,240,0.55);
  overflow:hidden;
}
.phd-bar-fill{
  height:100%;
  border-radius: 999px;
  box-shadow: 0 12px 18px rgba(34,50,74,0.10);
}
.phd-bar-fill.pink{ background: linear-gradient(90deg, rgba(255,77,109,0.85), rgba(255,125,135,0.65)); }
.phd-bar-fill.orange{ background: linear-gradient(90deg, rgba(255,170,85,0.85), rgba(255,170,85,0.35)); }
.phd-bar-fill.green{ background: linear-gradient(90deg, rgba(103,185,164,0.85), rgba(103,185,164,0.35)); }

.phd-bar-badge{
  position:absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 3px 8px;
  border-radius: 10px;
  font-weight:900;
  font-size:12px;
  border:1px solid rgba(226,232,244,0.85);
  background: rgba(255,255,255,0.55);
  color:#2a3550;
}
.phd-bar-badge.pink{ background: rgba(255,120,120,0.28); color:#7b1f1f; }

.phd-stock-right{ text-align:right; font-weight:900; color:#2a3550; }
.phd-stock-right.muted{ color:#7a8aa7; }

/* orders list */
.phd-orders{ padding:12px 14px; display:grid; gap:12px; }
.phd-order{
  display:grid;
  grid-template-columns: 1fr 56px 110px;
  gap:10px;
  align-items:center;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.phd-order-title{ font-weight:900; color:#2a3550; }
.phd-order-sub{ margin-top:4px; font-size:12px; }
.phd-order-unit{ text-align:right; font-weight:900; }

.phd-pill{
  justify-self:end;
  padding:6px 10px;
  border-radius:10px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  display:inline-flex;
}
.phd-pill.blue{ background:rgba(45,118,214,0.18); color:#1e5fb7; }
.phd-pill.green{ background:rgba(103,185,164,0.30); color:#1f5a63; }
.phd-pill.orange{ background:rgba(255,170,85,0.55); color:#7a3a10; }

/* todos */
.phd-todos{ padding:12px 14px; display:grid; gap:12px; }
.phd-todo{
  display:flex; gap:10px; align-items:flex-start;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.phd-todo-ico{
  width:32px; height:32px; border-radius:10px;
  display:grid; place-items:center;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(255,255,255,0.65);
  font-weight:900;
}
.phd-todo-ico.teal{ background:rgba(100,190,200,0.30); color:#1f5a63; }
.phd-todo-ico.blue{ background:rgba(45,118,214,0.18); color:#1e5fb7; }
.phd-todo-title{ font-weight:900; color:#2a3550; }
.phd-todo-sub{ margin-top:4px; font-size:12px; }

/* messages */
.phd-messages{ padding:12px 14px; display:grid; gap:12px; }
.phd-msg{
  display:flex; gap:10px; align-items:flex-start;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
}
.phd-avatar{ width:36px; height:36px; border-radius:999px; object-fit:cover; }
.phd-msg-name{ font-weight:900; color:#2a3550; }
.phd-msg-text{ margin-top:4px; font-size:12px; line-height:1.35; }

/* Chart area */
.phd-head-controls{ display:flex; gap:12px; align-items:center; }
.phd-dd{ position:relative; min-width:150px; }
.phd-dd select{
  width:100%; appearance:none;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:8px 34px 8px 12px;
  font-weight:900; color:#425574; outline:none;
}
.phd-dd-ico{ position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#7a8aa7; pointer-events:none; }

.phd-chart{ padding:14px; position:relative; }
.phd-svg{ width:100%; height:auto; display:block; }
.grid line{ stroke: rgba(226,232,244,0.95); stroke-width:1; }
.xlabels text{ fill:#7a8aa7; font-weight:900; font-size:12px; }
.l1,.l2,.l3,.l4{ fill:none; stroke-width:3.5; stroke-linecap:round; stroke-linejoin:round; }
.l1{ stroke:#356ee6; }
.l2{ stroke:#ff7a3d; }
.l3{ stroke:#67b9a4; }
.l4{ stroke:#9a7bff; }

.phd-legend{ margin-top:10px; display:flex; flex-wrap:wrap; gap:16px; color:#6b7a90; font-weight:900; font-size:12px; }
.phd-leg{ display:flex; align-items:center; gap:8px; }
.dot{ width:10px; height:10px; border-radius:999px; display:inline-block; }
.d1{ background:#356ee6; }
.d2{ background:#ff7a3d; }
.d3{ background:#67b9a4; }
.d4{ background:#9a7bff; }

.phd-report{
  position:absolute;
  right:14px;
  bottom:14px;
  border:1px solid rgba(145,185,165,0.95);
  background: rgba(184,219,201,0.70);
  color:#2c5b46;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
  cursor:pointer;
}
.phd-report:hover{ background: rgba(184,219,201,0.85); }

/* announcements */
.phd-announce{ padding:12px 14px 14px; display:grid; gap:14px; }
.phd-announce-item{ display:grid; gap:8px; }
.phd-announce-title{ font-weight:900; color:#2a3550; }
.phd-announce-text{ font-size:12px; line-height:1.35; }

.phd-cta{
  margin-top:4px;
  border: 1px solid rgba(90,150,150,0.85);
  background: rgba(120,185,185,0.55);
  color:#1f4f52;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
  cursor:pointer;
  justify-self:end;
}
.phd-cta:hover{ background: rgba(120,185,185,0.70); }

/* responsive */
@media (max-width: 1400px){
  .phd-kpis{ grid-template-columns:repeat(2,1fr); }
  .phd-row2{ grid-template-columns:1fr; }
  .phd-row3{ grid-template-columns:1fr; }
  .phd-row1{ grid-template-columns:1fr; }
}
@media (max-width: 820px){
  .phd-kpis{ grid-template-columns:1fr; }
  .phd-title{ font-size:24px; }
}
</style>
