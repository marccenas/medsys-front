<template>
  <div class="fb">
    <!-- Header -->
    <div class="fb-head">
      <div>
        <h2 class="fb-title">Finance &amp; Billing</h2>
        <div class="fb-sub">
          <span class="fb-sub-strong">Overview</span>
          <span class="fb-sub-sep">›</span>
          <span>and manage the financial operations of the healthcare system.</span>
        </div>
      </div>
    </div>

    <!-- KPI Row -->
    <section class="fb-kpis">
      <div class="fb-kpi blue">
        <div class="fb-kpi-top">
          <div class="fb-kpi-label">Total Revenue</div>
          <div class="fb-kpi-mini">
            <span class="fb-mini-dot">$</span>
          </div>
        </div>
        <div class="fb-kpi-value">${{ fmtMoney(totalRevenue) }}</div>
      </div>

      <div class="fb-kpi teal">
        <div class="fb-kpi-top">
          <div class="fb-kpi-label">Unpaid Invoices</div>
          <div class="fb-kpi-mini">
            <font-awesome-icon icon="file-invoice" />
          </div>
        </div>
        <div class="fb-kpi-value">{{ unpaidCount }}</div>
      </div>

      <div class="fb-kpi orange">
        <div class="fb-kpi-top">
          <div class="fb-kpi-label">Overdue Payments</div>
          <div class="fb-kpi-mini">
            <span class="fb-mini-dot">{{ overdueCount }}</span>
          </div>
        </div>
        <div class="fb-kpi-value">${{ fmtMoney(overdueAmount) }}</div>

        <div class="fb-kpi-pill">
          ${{ fmtMoney(overdueAmount) }}
          <span class="fb-kpi-pill-arr">›</span>
        </div>
      </div>

      <div class="fb-kpi purple">
        <div class="fb-kpi-top">
          <div class="fb-kpi-label">New Claims</div>
          <div class="fb-kpi-mini">
            <font-awesome-icon icon="file-lines" />
          </div>
        </div>
        <div class="fb-kpi-value">{{ newClaims }}</div>
      </div>
    </section>

    <!-- Main Grid -->
    <section class="fb-grid">
      <!-- Revenue Breakdown (pie + line) -->
      <div class="fb-card fb-rev">
        <div class="fb-card-head">
          <div class="fb-card-title">Revenue Breakdown</div>
          <div class="fb-tabs">
            <button class="fb-tab" :class="{ active: revTab === 'earnings' }" @click="revTab = 'earnings'">
              Earnings
            </button>
            <button class="fb-tab" :class="{ active: revTab === 'expenses' }" @click="revTab = 'expenses'">
              Expenses
            </button>
            <button class="fb-tab-icon" type="button" aria-label="Next">
              ›
            </button>
          </div>
        </div>

        <div class="fb-rev-body">
          <div class="fb-rev-left">
            <!-- Simple SVG donut (static look like mock) -->
            <div class="fb-donut">
              <svg viewBox="0 0 120 120" class="fb-donut-svg" aria-hidden="true">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#2f62ea" />
                    <stop offset="1" stop-color="#4b78ff" />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stop-color="#2f9aa2" />
                    <stop offset="1" stop-color="#4fc1cb" />
                  </linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stop-color="#ff7a3d" />
                    <stop offset="1" stop-color="#ffa45b" />
                  </linearGradient>
                  <linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#b7c6ea" />
                    <stop offset="1" stop-color="#d6def3" />
                  </linearGradient>
                </defs>

                <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(230,236,248,0.9)" stroke-width="18" />
                <!-- segments (approx look) -->
                <circle
                  cx="60"
                  cy="60"
                  r="42"
                  fill="none"
                  stroke="url(#g2)"
                  stroke-width="18"
                  stroke-linecap="butt"
                  :stroke-dasharray="dash(0.56)"
                  stroke-dashoffset="0"
                  transform="rotate(-90 60 60)"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="42"
                  fill="none"
                  stroke="url(#g1)"
                  stroke-width="18"
                  :stroke-dasharray="dash(0.22)"
                  :stroke-dashoffset="offset(0.56)"
                  transform="rotate(-90 60 60)"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="42"
                  fill="none"
                  stroke="url(#g3)"
                  stroke-width="18"
                  :stroke-dasharray="dash(0.14)"
                  :stroke-dashoffset="offset(0.78)"
                  transform="rotate(-90 60 60)"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="42"
                  fill="none"
                  stroke="url(#g4)"
                  stroke-width="18"
                  :stroke-dasharray="dash(0.08)"
                  :stroke-dashoffset="offset(0.92)"
                  transform="rotate(-90 60 60)"
                />

                <text x="60" y="66" text-anchor="middle" class="fb-donut-text">52%</text>
              </svg>

              <div class="fb-donut-side">
                <div class="fb-donut-big">56%</div>
              </div>
            </div>

            <div class="fb-legend">
              <div class="fb-leg" v-for="item in revenueLegend" :key="item.label">
                <span class="fb-leg-dot" :class="item.dot"></span>
                <span class="fb-leg-label">{{ item.label }}</span>
                <span class="fb-leg-val">{{ item.value }}</span>
              </div>
            </div>
          </div>

          <div class="fb-rev-right">
            <div class="fb-linebox">
              <!-- Simple static SVG line -->
              <svg class="fb-line" viewBox="0 0 520 180" aria-hidden="true">
                <defs>
                  <linearGradient id="linefill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="rgba(45,118,214,0.22)" />
                    <stop offset="1" stop-color="rgba(45,118,214,0.02)" />
                  </linearGradient>
                </defs>

                <!-- grid -->
                <g opacity="0.28">
                  <line x1="40" y1="30" x2="500" y2="30" stroke="rgba(180,195,220,0.9)" />
                  <line x1="40" y1="70" x2="500" y2="70" stroke="rgba(180,195,220,0.9)" />
                  <line x1="40" y1="110" x2="500" y2="110" stroke="rgba(180,195,220,0.9)" />
                  <line x1="40" y1="150" x2="500" y2="150" stroke="rgba(180,195,220,0.9)" />
                </g>

                <path
                  d="M40 130 C110 110, 160 105, 220 96 C300 84, 340 82, 400 64 C460 46, 480 42, 500 36"
                  fill="none"
                  stroke="rgba(45,118,214,0.95)"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M40 130 C110 110, 160 105, 220 96 C300 84, 340 82, 400 64 C460 46, 480 42, 500 36 L500 160 L40 160 Z"
                  fill="url(#linefill)"
                />

                <!-- points -->
                <g fill="#fff" stroke="rgba(45,118,214,0.95)" stroke-width="3">
                  <circle cx="40" cy="130" r="6" />
                  <circle cx="160" cy="105" r="6" />
                  <circle cx="280" cy="88" r="6" />
                  <circle cx="400" cy="64" r="6" />
                  <circle cx="500" cy="36" r="7" />
                </g>

                <!-- x labels -->
                <g class="fb-line-x">
                  <text x="40" y="175" text-anchor="middle">Jan</text>
                  <text x="160" y="175" text-anchor="middle">Feb</text>
                  <text x="280" y="175" text-anchor="middle">Mar</text>
                  <text x="360" y="175" text-anchor="middle">Apr</text>
                  <text x="420" y="175" text-anchor="middle">Apr</text>
                  <text x="470" y="175" text-anchor="middle">Apr</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Unpaid Invoices (right) -->
      <div class="fb-card fb-unpaid">
        <div class="fb-card-head">
          <div class="fb-card-title">Unpaid Invoices</div>
          <button class="fb-link" type="button" @click="uiOnly('View all invoices')">View All ›</button>
        </div>

        <div class="fb-table">
          <div class="fb-row fb-row-head">
            <div>Patient</div>
            <div>ID</div>
            <div>Due</div>
            <div class="end">Amount</div>
          </div>

          <div class="fb-row" v-for="i in unpaidInvoices" :key="i.id">
            <div class="fb-patient">
              <div class="fb-pname">{{ i.patient }}</div>
              <div class="fb-psub"> </div>
            </div>
            <div class="muted">#{{ i.id }}</div>
            <div class="muted">
              <span class="fb-doc">
                <font-awesome-icon icon="file-lines" />
              </span>
              {{ i.due }}
            </div>
            <div class="fb-amt end">
              <span class="fb-amt-pill">${{ fmtMoney(i.amount) }}</span>
              <span class="fb-status" :class="i.statusClass">{{ i.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="fb-card fb-trans">
        <div class="fb-card-head">
          <div class="fb-card-title">Recent Transactions</div>
          <button class="fb-link" type="button" @click="uiOnly('View all transactions')">View All ›</button>
        </div>

        <div class="fb-table2">
          <div class="fb-row fb-row-head">
            <div>Patient</div>
            <div>ID</div>
            <div>Status</div>
            <div class="end">Amount</div>
          </div>

          <div class="fb-row" v-for="t in transactions" :key="t.id">
            <div class="fb-pname">{{ t.patient }}</div>
            <div class="muted">#{{ t.id }}</div>
            <div>
              <span class="fb-chip" :class="t.statusClass">{{ t.status }}</span>
            </div>
            <div class="end">
              <span class="fb-money" :class="t.moneyClass">${{ fmtMoney(t.amount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Unpaid Invoices (small list) -->
      <div class="fb-card fb-unpaid2">
        <div class="fb-card-head">
          <div class="fb-card-title">Unpaid Invoices</div>
          <button class="fb-link" type="button" @click="uiOnly('View all unpaid')">View All ›</button>
        </div>

        <div class="fb-table2">
          <div class="fb-row fb-row-head">
            <div>Patient</div>
            <div>View</div>
            <div>Due</div>
            <div class="end">Amount</div>
          </div>

          <div class="fb-row" v-for="u in unpaidMini" :key="u.id">
            <div class="fb-pname">{{ u.patient }}</div>
            <div class="muted">#{{ u.id }}</div>
            <div class="muted">{{ u.due }}</div>
            <div class="end">
              <span class="fb-amt-pill">${{ fmtMoney(u.amount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Claims -->
      <div class="fb-card fb-claims">
        <div class="fb-card-head">
          <div class="fb-card-title">Recent Claims</div>
          <button class="fb-link" type="button" @click="uiOnly('View all claims')">View All ›</button>
        </div>

        <div class="fb-table2">
          <div class="fb-row fb-row-head">
            <div>Patient</div>
            <div>ID</div>
            <div>Insurance</div>
            <div class="end">Status</div>
          </div>

          <div class="fb-row" v-for="c in claims" :key="c.id">
            <div class="fb-pname">{{ c.patient }}</div>
            <div class="muted">#{{ c.id }}</div>
            <div class="muted">{{ c.insurance }}</div>
            <div class="end">
              <span class="fb-chip" :class="c.statusClass">{{ c.status }}</span>
              <span v-if="c.amount" class="fb-pill-money">${{ fmtMoney(c.amount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const revTab = ref("earnings");

/* KPI values (UI demo) */
const totalRevenue = ref(378500);
const newClaims = ref(8);

/* right unpaid list (matches mock feel) */
const unpaidInvoices = ref([
  { id: 6375, patient: "Lisa Thompson", due: "5 days ago", amount: 2100, status: "OVERDUE", statusClass: "overdue teal" },
  { id: 6496, patient: "Michael Davis", due: "Yesterday", amount: 975, status: "OVERDUE", statusClass: "overdue orange" },
  { id: 6452, patient: "Jason Clarke", due: "Tomorrow", amount: 600, status: "UNPAID", statusClass: "unpaid orange" },
  { id: 6618, patient: "Amanda Reed", due: "May 10", amount: 1500, status: "UNPAID", statusClass: "unpaid orange" },
  { id: 6322, patient: "Brian Hill", due: "May 15", amount: 420, status: "UNPAID", statusClass: "unpaid orange" },
]);

const transactions = ref([
  { id: 6523, patient: "Laura Mitchell", status: "PAID", statusClass: "paid", amount: 670, moneyClass: "good" },
  { id: 6351, patient: "David Brown", status: "OVERDUE", statusClass: "overdue", amount: 1260, moneyClass: "bad" },
  { id: 6290, patient: "Rachel Green", status: "OVERDUE", statusClass: "overdue", amount: 530, moneyClass: "bad" },
  { id: 6124, patient: "James Carter", status: "PENDING", statusClass: "pending", amount: 375, moneyClass: "warn" },
]);

const unpaidMini = ref([
  { id: 6575, patient: "Lisa Thompson", due: "5 days ago", amount: 2100 },
  { id: 6486, patient: "Michael Davis", due: "Yesterday", amount: 975 },
  { id: 6452, patient: "Jason Clarke", due: "Tomorrow", amount: 600 },
  { id: 6618, patient: "Amanda Reed", due: "May 10", amount: 1500 },
  { id: 6322, patient: "Brian Hill", due: "May 15", amount: 420 },
]);

const claims = ref([
  { id: 6234, patient: "Clara Owens", insurance: "Medicare", status: "PENDING", statusClass: "pending" },
  { id: 6578, patient: "Edward Turner", insurance: "Blue Cross", status: "DENIED", statusClass: "denied" },
  { id: 6391, patient: "Angela Foster", insurance: "UnitedHealth", status: "APPROVED", statusClass: "approved", amount: 1200 },
  { id: 6537, patient: "Kevin Adams", insurance: "Medicaid", status: "UNDER REVIEW", statusClass: "review", amount: 1500 },
  { id: 6410, patient: "Sophia King", insurance: "Aetna", status: "APPROVED", statusClass: "approved", amount: 930 },
]);

const unpaidCount = computed(() => unpaidInvoices.value.length);
const overdueCount = computed(() => unpaidInvoices.value.filter((x) => x.status === "OVERDUE").length);
const overdueAmount = computed(() =>
  unpaidInvoices.value.filter((x) => x.status === "OVERDUE").reduce((sum, x) => sum + x.amount, 0)
);

const revenueLegend = [
  { label: "Insurance", value: "", dot: "d1" },
  { label: "Private Pay", value: "", dot: "d2" },
  { label: "Medicare", value: "", dot: "d3" },
  { label: "Medicaid", value: "8%", dot: "d4" },
];

/* donut helpers (just for stroke-dash math) */
const C = 2 * Math.PI * 42;
function dash(pct) {
  const on = C * pct;
  const off = C - on;
  return `${on} ${off}`;
}
function offset(pctBefore) {
  return -C * pctBefore;
}

function fmtMoney(n) {
  const x = Math.round(Number(n || 0));
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function uiOnly(what) {
  window.alert(`${what} (UI only)`);
}
</script>

<style scoped>
.fb{ display:grid; gap:16px; min-width:0; }

/* header */
.fb-title{ margin:0; font-size:30px; font-weight:900; color:#1f2b46; letter-spacing:.2px; }
.fb-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.fb-sub-strong{ color:#1f2b46; }
.fb-sub-sep{ opacity:.6; }

/* kpis */
.fb-kpis{ display:grid; grid-template-columns: repeat(4, minmax(220px,1fr)); gap:14px; }
.fb-kpi{
  border-radius:14px;
  padding:14px 16px;
  color:#fff;
  position:relative;
  border:1px solid rgba(255,255,255,0.25);
  box-shadow:0 18px 34px rgba(17,24,39,0.14);
  overflow:hidden;
}
.fb-kpi-top{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
.fb-kpi-label{ font-weight:900; font-size:14px; opacity:.98; }
.fb-kpi-value{ margin-top:10px; font-size:34px; font-weight:900; line-height:1; letter-spacing:.3px; }

.fb-kpi-mini{
  width:30px; height:30px;
  border-radius:10px;
  background: rgba(255,255,255,0.18);
  border:1px solid rgba(255,255,255,0.25);
  display:grid; place-items:center;
  font-weight:900;
}
.fb-mini-dot{
  width:18px; height:18px;
  border-radius:999px;
  background: rgba(255,255,255,0.30);
  display:grid; place-items:center;
  font-size:12px;
}

.fb-kpi.blue{ background:linear-gradient(90deg,#356ee6,#5c8cf5); }
.fb-kpi.teal{ background:linear-gradient(90deg,#2f9aa2,#4fc1cb); }
.fb-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.fb-kpi.purple{ background:linear-gradient(90deg,#7c61ff,#a077ff); }

.fb-kpi-pill{
  position:absolute;
  right:14px;
  bottom:14px;
  padding:8px 12px;
  border-radius:12px;
  background: rgba(255,255,255,0.22);
  border:1px solid rgba(255,255,255,0.26);
  font-weight:900;
  display:flex;
  align-items:center;
  gap:10px;
}
.fb-kpi-pill-arr{
  width:18px; height:18px;
  display:grid; place-items:center;
  border-radius:999px;
  background: rgba(255,255,255,0.26);
}

/* grid */
.fb-grid{
  display:grid;
  grid-template-columns: 1.6fr 1fr;
  gap:14px;
  align-items:start;
}
.fb-card{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.88);
  background: linear-gradient(180deg, rgba(248,250,255,0.78), rgba(255,255,255,0.62));
  box-shadow:0 18px 44px rgba(15,23,42,0.14);
  overflow:hidden;
  min-width:0;
}
.fb-card-head{
  padding:12px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.fb-card-title{ font-weight:900; color:#1f2b46; }
.fb-link{
  border:0;
  background:transparent;
  color:#2d76d6;
  font-weight:900;
  cursor:pointer;
}
.fb-link:hover{ text-decoration:underline; }

/* revenue card */
.fb-rev{ grid-column:1 / 2; }
.fb-unpaid{ grid-column:2 / 3; }
.fb-trans{ grid-column:1 / 2; }
.fb-unpaid2{ grid-column:1 / 2; }
.fb-claims{ grid-column:2 / 3; grid-row: 3 / span 2; }

.fb-rev-body{
  padding:14px;
  display:grid;
  grid-template-columns: 340px 1fr;
  gap:14px;
}
.fb-rev-left{ min-width:0; display:grid; gap:12px; }
.fb-rev-right{ min-width:0; }

.fb-tabs{
  display:flex;
  align-items:center;
  gap:8px;
  background: rgba(230,236,248,0.55);
  border:1px solid rgba(226,232,244,0.85);
  padding:4px;
  border-radius:999px;
}
.fb-tab{
  border:0;
  background:transparent;
  padding:6px 14px;
  border-radius:999px;
  font-weight:900;
  color:#5a6a86;
  cursor:pointer;
}
.fb-tab.active{
  background:#fff;
  border:1px solid rgba(226,232,244,0.85);
  box-shadow:0 10px 22px rgba(15,23,42,0.10);
  color:#1f2b46;
}
.fb-tab-icon{
  border:0;
  background:transparent;
  width:30px; height:30px;
  border-radius:999px;
  cursor:pointer;
  font-weight:900;
  color:#5a6a86;
}

.fb-donut{
  display:flex;
  align-items:center;
  gap:12px;
}
.fb-donut-svg{ width:190px; height:190px; }
.fb-donut-text{
  font-size:22px;
  font-weight:900;
  fill:#1f2b46;
}
.fb-donut-side{ display:flex; align-items:center; }
.fb-donut-big{
  font-size:18px;
  font-weight:900;
  color:#2f9aa2;
}

.fb-legend{ display:grid; gap:10px; padding-left:8px; }
.fb-leg{ display:flex; align-items:center; gap:10px; color:#3c4c66; font-weight:900; }
.fb-leg-dot{ width:10px; height:10px; border-radius:999px; }
.fb-leg-dot.d1{ background:#2f9aa2; }
.fb-leg-dot.d2{ background:#356ee6; }
.fb-leg-dot.d3{ background:#ff7a3d; }
.fb-leg-dot.d4{ background:#c9d3ea; }
.fb-leg-label{ flex:1 1 auto; }
.fb-leg-val{ color:#7a8aa7; }

.fb-linebox{
  border-radius:14px;
  border:1px solid rgba(226,232,244,0.82);
  background: rgba(255,255,255,0.55);
  padding:10px 10px 2px;
}
.fb-line{ width:100%; height:auto; display:block; }
.fb-line-x text{ font-size:12px; font-weight:900; fill:#6b7a90; }

/* table-like lists */
.fb-table, .fb-table2{ padding: 10px 12px 12px; display:grid; gap:10px; }
.fb-row{
  display:grid;
  grid-template-columns: 1.3fr 0.8fr 0.9fr 1fr;
  gap:10px;
  align-items:center;
  padding:10px 10px;
  border-radius:12px;
}
.fb-row-head{
  padding:8px 10px;
  border-radius:12px;
  background: rgba(240,245,255,0.65);
  border:1px solid rgba(226,232,244,0.78);
  font-size:12px;
  font-weight:900;
  color:#667791;
}
.fb-row:not(.fb-row-head){
  border:1px solid rgba(226,232,244,0.68);
  background: rgba(255,255,255,0.55);
}
.fb-row:not(.fb-row-head):hover{ background: rgba(255,255,255,0.72); }
.muted{ color:#6b7a90; font-weight:800; }
.end{ justify-self:end; text-align:right; }

/* unpaid right rows use amount+status on same line */
.fb-amt{ display:flex; align-items:center; gap:10px; justify-content:flex-end; }
.fb-amt-pill{
  padding:6px 10px;
  border-radius:999px;
  background: rgba(255,210,185,0.55);
  border:1px solid rgba(255,210,185,0.85);
  color:#9a3b18;
  font-weight:900;
  white-space:nowrap;
}
.fb-status{
  padding:6px 10px;
  border-radius:999px;
  font-size:11px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  white-space:nowrap;
  display:inline-flex;
  align-items:center;
  gap:8px;
}
.fb-status.overdue.teal{ background: rgba(100,190,200,0.35); color:#1f5a63; }
.fb-status.overdue.orange{ background: rgba(255,170,85,0.45); color:#7a3a10; }
.fb-status.unpaid.orange{ background: rgba(255,170,85,0.30); color:#7a3a10; }

.fb-doc{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:22px; height:22px;
  border-radius:8px;
  background: rgba(230,236,248,0.65);
  border:1px solid rgba(226,232,244,0.82);
  margin-right:8px;
}

/* chips */
.fb-chip{
  padding:6px 10px;
  border-radius:999px;
  font-weight:900;
  font-size:11px;
  border:1px solid rgba(226,232,244,0.85);
  display:inline-flex;
  align-items:center;
}
.fb-chip.paid{ background: rgba(145, 220, 190, 0.35); color:#166a50; }
.fb-chip.overdue{ background: rgba(255,120,120,0.28); color:#7b1f1f; }
.fb-chip.pending{ background: rgba(255,190,95,0.35); color:#7a3a10; }
.fb-chip.denied{ background: rgba(255,120,120,0.28); color:#7b1f1f; }
.fb-chip.approved{ background: rgba(145, 220, 190, 0.35); color:#166a50; }
.fb-chip.review{ background: rgba(200,210,235,0.55); color:#2a3550; }

.fb-money{ font-weight:900; }
.fb-money.good{ color:#167a55; }
.fb-money.bad{ color:#b42318; }
.fb-money.warn{ color:#a14a00; }

.fb-pill-money{
  margin-left:10px;
  padding:6px 10px;
  border-radius:999px;
  background: rgba(100,190,200,0.35);
  border:1px solid rgba(100,190,200,0.55);
  color:#1f5a63;
  font-weight:900;
  white-space:nowrap;
}

/* responsive */
@media (max-width: 1300px){
  .fb-kpis{ grid-template-columns: repeat(2, minmax(220px,1fr)); }
  .fb-grid{ grid-template-columns: 1fr; }
  .fb-rev, .fb-unpaid, .fb-trans, .fb-unpaid2, .fb-claims{ grid-column:1 / -1; }
  .fb-rev-body{ grid-template-columns: 1fr; }
}
@media (max-width: 640px){
  .fb-title{ font-size:24px; }
  .fb-kpi-value{ font-size:30px; }
  .fb-row{ grid-template-columns: 1.2fr 0.7fr 0.9fr 1fr; }
}
</style>
