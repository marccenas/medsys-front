<template>
  <section class="learn">
    <!-- Header -->
    <div class="dash-top">
      <div class="dash-title">
        <h1 style="font-weight: 800;">Learning</h1>
        <p class="subtle">
          Nurse Schedule Overview <span class="sep">›</span> Manage your nursing knowledge and skills.
        </p>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="kpi-row">
      <div class="kpi kpi-blue">
        <div class="kpi-left">
          <div class="kpi-label">Today's Tasks</div>
        </div>
        <div class="kpi-value" style="font-weight: 800;">9</div>
      </div>

      <div class="kpi kpi-teal">
        <div class="kpi-left">
          <div class="kpi-label">In Progress</div>
        </div>
        <div class="kpi-value" style="font-weight: 800;">2</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-left">
          <div class="kpi-label">Quizzes Scheduled</div>
        </div>
        <div class="kpi-value" style="font-weight: 800;">1</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-left">
          <div class="kpi-label">Completed Courses</div>
        </div>
        <div class="kpi-value" style="font-weight: 800;">9</div>
      </div>
    </div>

    <!-- Top bar (search + tiny schedule controls like design) -->
    <div class="top-controls panel">
      <div class="top-left">
        <div class="search-row">
          <font-awesome-icon class="search-ico" icon="magnifying-glass" />
          <input v-model="query" class="search" placeholder="Search..." type="text" />
        </div>
      </div>

      <div class="top-right">
        <button class="pill-btn" type="button" @click="jumpToToday">Today</button>

        <div class="nav-group">
          <button class="nav-btn" type="button" @click="miniPrevMonth" aria-label="Prev">
            <font-awesome-icon icon="angle-left" />
          </button>

          <div class="nav-pill">{{ rangeLabel }}</div>

          <button class="nav-btn" type="button" @click="miniNextMonth" aria-label="Next">
            <font-awesome-icon icon="angle-right" />
          </button>
        </div>

        <div class="dd" @click.stop>
          <button class="pill-btn dd-btn" type="button" @click="toggleDd">
            <span>Week</span>
            <font-awesome-icon icon="chevron-down" />
          </button>

          <div v-if="ddOpen" class="dd-menu right">
            <button class="dd-item" type="button" @click="closeDd">Week</button>
            <button class="dd-item" type="button" @click="closeDd">Month</button>
            <button class="dd-item" type="button" @click="closeDd">Day</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid">
      <!-- Left column -->
      <div class="col">
        <!-- Recent Activities -->
        <section class="panel">
          <div class="panel-title">Recent Activities</div>
          <div class="panel-body">
            <div class="activity" v-for="a in filteredActivities" :key="a.id">
              <div class="act-ico" :class="a.color">
                <font-awesome-icon :icon="a.icon" />
              </div>

              <div class="act-body">
                <div class="act-title">{{ a.title }}</div>
                <div class="act-sub">{{ a.sub }}</div>

                <span v-if="a.badge" class="act-badge" :class="a.badge.color">
                  {{ a.badge.text }}
                </span>
              </div>

              <div class="act-time">{{ a.time }}</div>
            </div>

            <button class="link-row" type="button">
              View All Activities <font-awesome-icon icon="chevron-right" />
            </button>
          </div>
        </section>

        <!-- Quizzes scheduled -->
        <section class="panel">
          <div class="panel-title">Quizzes Scheduled</div>
          <div class="panel-body">
            <div class="quiz" v-for="qz in filteredQuizzes" :key="qz.id">
              <div class="quiz-ico" :class="qz.color">
                <font-awesome-icon icon="file-lines" />
              </div>

              <div class="quiz-body">
                <div class="quiz-title">{{ qz.title }}</div>
                <div class="quiz-sub">{{ qz.sub }}</div>
              </div>

              <div class="quiz-right">
                <span v-if="qz.badge" class="chip" :class="qz.badge.color">{{ qz.badge.text }}</span>
                <button class="go" type="button">
                  <font-awesome-icon icon="chevron-right" />
                </button>
              </div>
            </div>

            <button class="link-row" type="button">
              View Full Calendar <font-awesome-icon icon="chevron-right" />
            </button>
          </div>
        </section>

        <!-- Completion progress -->
        <section class="panel">
          <div class="panel-title">Completion Progress</div>
          <div class="panel-body">
            <div class="progress-row">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
              </div>
              <div class="progress-pct">{{ progress }}%</div>
            </div>

            <div class="progress-foot">
              <div class="subtle">Keep up the excellent work, you're on track!</div>
              <button class="link-btn" type="button">View All Modules</button>
            </div>
          </div>
        </section>
      </div>

      <!-- Right column -->
      <div class="col col-right">
        <!-- Recommended modules -->
        <section class="panel">
          <div class="panel-title">Recommended Modules</div>
          <div class="panel-body">
            <div class="mods">
              <button class="mod" v-for="m in filteredModules" :key="m.id" type="button">
                <div class="mod-ico" :class="m.color">
                  <font-awesome-icon :icon="m.icon" />
                </div>
                <div class="mod-body">
                  <div class="mod-title">{{ m.title }}</div>
                  <div class="mod-sub">{{ m.sub }}</div>
                </div>
              </button>
            </div>

            <button class="link-row" type="button">
              View All Modules <font-awesome-icon icon="chevron-right" />
            </button>
          </div>
        </section>

        <!-- Quick resources -->
        <section class="panel">
          <div class="panel-title">Quick Resources</div>
          <div class="panel-body">
            <button class="res" v-for="r in filteredResources" :key="r.id" type="button">
              <div class="res-ico" :class="r.color">
                <font-awesome-icon icon="book-open" />
              </div>
              <div class="res-body">
                <div class="res-title">{{ r.title }}</div>
                <div class="res-sub">{{ r.sub }}</div>
              </div>
            </button>
          </div>
        </section>

        <!-- Mini Calendar -->
        <section class="panel mini">
          <div class="mini-head">
            <div class="mini-title">{{ miniMonthLabel }}</div>
            <div class="mini-nav">
              <button class="mini-nav-btn" type="button" @click="miniPrevMonth">
                <font-awesome-icon icon="angle-left" />
              </button>
              <button class="mini-nav-btn" type="button" @click="miniNextMonth">
                <font-awesome-icon icon="angle-right" />
              </button>
            </div>
          </div>

          <div class="mini-dow">
            <span v-for="d in miniDow" :key="d">{{ d }}</span>
          </div>

          <div class="mini-grid">
            <button
              v-for="cell in miniCells"
              :key="cell.key"
              class="mini-day"
              :class="{
                'is-out': !cell.inMonth,
                'is-today': cell.isToday,
                'is-selected': cell.isSelected
              }"
              type="button"
              @click="selectMiniDate(cell.date)"
            >
              {{ cell.day }}
            </button>
          </div>

          <button class="mini-link" type="button" @click="jumpToToday">
            View Full Calendar <font-awesome-icon icon="chevron-right" />
          </button>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const query = ref("");
const ddOpen = ref(false);

function toggleDd() {
  ddOpen.value = !ddOpen.value;
}
function closeDd() {
  ddOpen.value = false;
}
function onWindowClick() {
  ddOpen.value = false;
}
onMounted(() => window.addEventListener("click", onWindowClick, true));
onBeforeUnmount(() => window.removeEventListener("click", onWindowClick, true));

/* ===== Data (UI only) ===== */
const activities = ref([
  {
    id: 1,
    title: "Medication Administration Quiz",
    sub: "Passed 85%",
    time: "12 hours ago",
    icon: "clipboard-check",
    color: "green",
    badge: { text: "Passed 85%", color: "green" },
  },
  {
    id: 2,
    title: "New Module Assigned: Infection Control",
    sub: "Module assigned to you",
    time: "2 days ago",
    icon: "book-medical",
    color: "blue",
  },
  {
    id: 3,
    title: "New Quiz Scheduled: Basics of Wound Care",
    sub: "Quiz due soon",
    time: "3 days ago",
    icon: "file-lines",
    color: "orange",
  },
]);

const modules = ref([
  { id: 1, title: "Wound Care Mastery", sub: "Essential wound care techniques", icon: "heart", color: "orange" },
  { id: 2, title: "CPR & Basic Life Support", sub: "CPR and BLS training for healthcare", icon: "shield", color: "blue" },
  { id: 3, title: "Medication Administration", sub: "Focus on safe medication admins.", icon: "pills", color: "teal" },
  { id: 4, title: "Infection Control Essentials", sub: "Prevent and control infections", icon: "flask-vial", color: "purple" },
  { id: 5, title: "Pediatric Care Basics", sub: "0–8 yrs care + safety", icon: "user-injured", color: "blue2" },
]);

const quizzes = ref([
  { id: 1, title: "Basics of Wound Care", sub: "Quiz due in 2 days", color: "orange", badge: { text: "Important", color: "red" } },
  { id: 2, title: "CPR & Basic Life Support", sub: "Quiz due in 4 days", color: "blue", badge: { text: "Important", color: "blue" } },
  { id: 3, title: "Infection Control Essentials", sub: "Quiz due in 6 days", color: "teal", badge: { text: "Due 6 days", color: "muted" } },
]);

const resources = ref([
  { id: 1, title: "Medication Guidelines", sub: "Protocols and medication guidelines", color: "blue" },
  { id: 2, title: "Infection Control", sub: "Prevention protocols and hygiene", color: "purple" },
  { id: 3, title: "Skill Checklists", sub: "Procedures and checklists", color: "teal" },
]);

const progress = ref(66);

/* ===== Filtering ===== */
function matchesQ(text) {
  const q = query.value.trim().toLowerCase();
  if (!q) return true;
  return String(text).toLowerCase().includes(q);
}
const filteredActivities = computed(() => activities.value.filter((x) => matchesQ(x.title)));
const filteredModules = computed(() => modules.value.filter((x) => matchesQ(x.title)));
const filteredQuizzes = computed(() => quizzes.value.filter((x) => matchesQ(x.title)));
const filteredResources = computed(() => resources.value.filter((x) => matchesQ(x.title)));

/* ===== Mini calendar ===== */
const now = ref(new Date());
let nowTimer = null;

onMounted(() => {
  nowTimer = setInterval(() => (now.value = new Date()), 30_000);
});
onBeforeUnmount(() => {
  if (nowTimer) clearInterval(nowTimer);
});

const miniCursor = ref(new Date(2024, 3, 1)); // April 2024 (like design)
const miniSelected = ref(new Date(2024, 3, 10));
const miniDow = ["S", "M", "TU", "W", "TR", "F", "SA"]; // matches screenshot style

const miniMonthLabel = computed(() =>
  miniCursor.value.toLocaleDateString(undefined, { month: "long", year: "numeric" })
);

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function sameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

const miniCells = computed(() => {
  const y = miniCursor.value.getFullYear();
  const m = miniCursor.value.getMonth();

  const first = new Date(y, m, 1);
  const firstDowSunFirst = first.getDay(); // Sun first
  const gridStart = new Date(y, m, 1 - firstDowSunFirst);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);

    cells.push({
      key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
      date: d,
      day: d.getDate(),
      inMonth: d.getMonth() === m,
      isToday: sameDay(d, now.value),
      isSelected: sameDay(d, miniSelected.value),
    });
  }
  return cells;
});

function miniPrevMonth() {
  const d = new Date(miniCursor.value);
  d.setMonth(d.getMonth() - 1);
  miniCursor.value = d;
}
function miniNextMonth() {
  const d = new Date(miniCursor.value);
  d.setMonth(d.getMonth() + 1);
  miniCursor.value = d;
}
function selectMiniDate(d) {
  miniSelected.value = new Date(d);
}

/* top pill label like screenshot: "Apr 22 - 28" */
const rangeLabel = computed(() => {
  const d = miniSelected.value;
  // week start (Mon) then end
  const day = (d.getDay() + 6) % 7;
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const s = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const e = end.toLocaleDateString(undefined, { day: "numeric" });
  return `${s} - ${e}`;
});

function jumpToToday() {
  const t = new Date();
  miniCursor.value = new Date(t.getFullYear(), t.getMonth(), 1);
  miniSelected.value = t;
}
</script>

<style scoped>
.learn{ padding: 18px 18px 24px; }

.sep{ margin: 0 6px; opacity: .55; }

.dash-title h1{
  margin:0;
  font-size: 34px;
  font-weight: 300;
  letter-spacing: 0.01em;
  color: rgba(30,40,70,0.60);
}
.dash-title p{ margin: 10px 0 0; font-size: 14px; }

/* KPI row */
.kpi-row{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin: 14px 0 16px;
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
.kpi-label{ font-weight: 800; font-size: 14px; opacity: 0.96; }
.kpi-value{ font-weight: 300; font-size: 40px; line-height: 1; letter-spacing: -0.02em; }

.kpi-blue{ background: linear-gradient(135deg, #4f77ff, #2f56ff); }
.kpi-teal{ background: linear-gradient(135deg, #23b5a8, #1a8e84); }
.kpi-orange{ background: linear-gradient(135deg, #ffbf70, #ff8c3a); }
.kpi-red{ background: linear-gradient(135deg, #ff6c6c, #ff4a4a); }

/* top controls bar */
.top-controls{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 12px;
  margin-bottom: 14px;
}
.top-left{ display:flex; align-items:center; gap: 10px; }
.top-right{ display:flex; align-items:center; gap: 10px; flex-wrap: wrap; }

.search-row{ position: relative; width: 280px; max-width: 52vw; }
.search{
  width:100%;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 12px 10px 38px;
  outline: none;
}
.search:focus{
  border-color: rgba(45,118,214,0.40);
  box-shadow: 0 0 0 4px rgba(45,118,214,0.10);
}
.search-ico{ position:absolute; left: 12px; top: 11px; opacity: .65; }

.pill-btn{
  height: 40px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.55);
  font-weight: 900;
  color: rgba(30,40,70,0.85);
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  gap: 8px;
}
.pill-btn:hover{ background: rgba(255,255,255,0.68); }

.nav-group{ display:flex; align-items:center; gap: 8px; }
.nav-btn{
  height: 40px;
  width: 44px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.55);
  cursor:pointer;
}
.nav-pill{
  height: 40px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius: 12px;
  padding: 0 14px;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.55);
  font-weight: 900;
  min-width: 120px;
}

/* dropdown */
.dd{ position: relative; }
.dd-menu{
  position:absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 140px;
  z-index: 9999;
  border-radius: 14px;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 40px rgba(20, 30, 70, 0.18);
  padding: 6px;
}
.dd-menu.right{ left:auto; right:0; }
.dd-item{
  width:100%;
  border:none;
  background:transparent;
  text-align:left;
  padding: 10px 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 900;
  cursor:pointer;
}
.dd-item:hover{ background: rgba(45,118,214,0.10); color: #2d76d6; }

/* grid */
.grid{
  display:grid;
  grid-template-columns: 1.45fr 1fr;
  gap: 14px;
  align-items:start;
}
.col{ display:grid; gap: 14px; }
.col-right{ grid-auto-rows: max-content; }

/* panel uses base.css .panel styles; just enhance spacing */
.panel :deep(.panel-title){
  font-size: 18px;
  font-weight: 700;
  color: rgba(30,40,70,0.72);
}
.panel :deep(.panel-body){ padding: 14px; }

/* activities */
.activity{
  display:grid;
  grid-template-columns: 34px 1fr auto;
  gap: 12px;
  align-items:center;
  padding: 10px 10px;
  border-radius: 12px;
}
.activity + .activity{ margin-top: 8px; }
.activity:hover{ background: rgba(255,255,255,0.55); }

.act-ico{
  width: 34px; height: 34px;
  border-radius: 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  box-shadow: 0 10px 20px rgba(0,0,0,0.10);
}
.act-ico.blue{ background: linear-gradient(135deg, #7aa9ff, #4f77ff); }
.act-ico.green{ background: linear-gradient(135deg, #43c89f, #1a8e84); }
.act-ico.orange{ background: linear-gradient(135deg, #ffbf70, #ff8c3a); }

.act-title{ font-weight: 900; }
.act-sub{ margin-top: 2px; font-size: 12px; color: var(--muted); font-weight: 800; }
.act-time{ font-size: 12px; color: var(--muted); font-weight: 800; }

.act-badge{
  display:inline-flex;
  margin-top: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}
.act-badge.green{ background: #dcfce7; color: #166534; }

/* modules */
.mods{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.mod{
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.55);
  border-radius: 14px;
  padding: 12px;
  display:flex;
  gap: 12px;
  align-items:center;
  cursor:pointer;
  text-align:left;
}
.mod:hover{ background: rgba(255,255,255,0.68); }

.mod-ico{
  width: 42px; height: 42px;
  border-radius: 12px;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  flex: 0 0 auto;
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
}
.mod-ico.orange{ background: linear-gradient(135deg, #ffbf70, #ff8c3a); }
.mod-ico.blue{ background: linear-gradient(135deg, #7aa9ff, #4f77ff); }
.mod-ico.teal{ background: linear-gradient(135deg, #4cc3b8, #23b5a8); }
.mod-ico.purple{ background: linear-gradient(135deg, #9b7bff, #7a5cff); }
.mod-ico.blue2{ background: linear-gradient(135deg, #6f8cff, #4f77ff); }

.mod-title{ font-weight: 900; }
.mod-sub{ margin-top: 2px; font-size: 12px; color: var(--muted); font-weight: 800; }

/* quizzes */
.quiz{
  display:flex;
  gap: 12px;
  align-items:center;
  padding: 10px 10px;
  border-radius: 12px;
}
.quiz + .quiz{ margin-top: 8px; }
.quiz:hover{ background: rgba(255,255,255,0.55); }

.quiz-ico{
  width: 34px; height: 34px;
  border-radius: 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  box-shadow: 0 10px 20px rgba(0,0,0,0.10);
}
.quiz-ico.blue{ background: linear-gradient(135deg, #7aa9ff, #4f77ff); }
.quiz-ico.orange{ background: linear-gradient(135deg, #ffbf70, #ff8c3a); }
.quiz-ico.teal{ background: linear-gradient(135deg, #4cc3b8, #23b5a8); }

.quiz-title{ font-weight: 900; }
.quiz-sub{ margin-top: 2px; font-size: 12px; color: var(--muted); font-weight: 800; }

.quiz-right{ margin-left:auto; display:flex; align-items:center; gap: 10px; }
.go{
  width: 36px; height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.55);
  cursor:pointer;
}
.go:hover{ background: rgba(255,255,255,0.68); }

.chip{
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
}
.chip.red{ background: #fee2e2; color: #991b1b; }
.chip.blue{ background: #dbeafe; color: #1d4ed8; }
.chip.muted{ background: rgba(226,232,244,0.9); color: rgba(30,40,70,0.70); }

/* resources */
.res{
  width: 100%;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.55);
  border-radius: 14px;
  padding: 12px;
  display:flex;
  gap: 12px;
  align-items:center;
  cursor:pointer;
  text-align:left;
}
.res + .res{ margin-top: 10px; }
.res:hover{ background: rgba(255,255,255,0.68); }

.res-ico{
  width: 34px; height: 34px;
  border-radius: 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  box-shadow: 0 10px 20px rgba(0,0,0,0.10);
}
.res-ico.blue{ background: linear-gradient(135deg, #7aa9ff, #4f77ff); }
.res-ico.purple{ background: linear-gradient(135deg, #9b7bff, #7a5cff); }
.res-ico.teal{ background: linear-gradient(135deg, #4cc3b8, #23b5a8); }

.res-title{ font-weight: 900; }
.res-sub{ margin-top: 2px; font-size: 12px; color: var(--muted); font-weight: 800; }

/* progress */
.progress-row{
  display:flex;
  align-items:center;
  gap: 12px;
}
.progress-bar{
  flex: 1 1 auto;
  height: 12px;
  border-radius: 999px;
  background: rgba(226,232,244,0.95);
  overflow:hidden;
}
.progress-fill{
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #6f8cff, #4f77ff);
}
.progress-pct{
  font-weight: 900;
  color: rgba(30,40,70,0.75);
  min-width: 44px;
  text-align:right;
}
.progress-foot{
  margin-top: 10px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
}
.link-btn{
  border: none;
  background: transparent;
  color: #2d76d6;
  font-weight: 900;
  cursor:pointer;
}

/* link row */
.link-row{
  width: 100%;
  margin-top: 10px;
  border: none;
  background: transparent;
  color: #2d76d6;
  font-weight: 900;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}

/* mini calendar */
.mini{ padding-bottom: 10px; }
.mini-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(226,232,244,0.85);
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.75));
}
.mini-title{
  font-weight: 900;
  color: rgba(30,40,70,0.75);
}
.mini-nav{ display:flex; gap: 8px; }
.mini-nav-btn{
  width: 34px; height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.95);
  background: rgba(255,255,255,0.55);
  cursor:pointer;
}

.mini-dow{
  padding: 10px 14px 0;
  display:grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  font-size: 11px;
  font-weight: 900;
  color: rgba(60,70,95,0.60);
}
.mini-dow span{ text-align:center; }

.mini-grid{
  padding: 8px 14px 0;
  display:grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
.mini-day{
  height: 32px;
  border-radius: 10px;
  border: 1px solid rgba(226,232,244,0.75);
  background: rgba(255,255,255,0.55);
  font-weight: 900;
  color: rgba(30,40,70,0.85);
  cursor: pointer;
}
.mini-day.is-out{ opacity: 0.35; }
.mini-day.is-today{
  border-color: rgba(45,118,214,0.35);
  box-shadow: 0 0 0 3px rgba(45,118,214,0.10);
}
.mini-day.is-selected{
  background: rgba(45,118,214,0.14);
  border-color: rgba(45,118,214,0.28);
  color: #2d76d6;
}

.mini-link{
  margin: 8px 14px 0;
  width: calc(100% - 28px);
  border: none;
  background: transparent;
  color: #2d76d6;
  font-weight: 900;
  padding: 10px 0 0;
  cursor: pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}

/* responsive */
@media (max-width: 1100px){
  .kpi-row{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid{ grid-template-columns: 1fr; }
  .mods{ grid-template-columns: 1fr; }
}
@media (max-width: 760px){
  .top-controls{ flex-direction: column; align-items: stretch; }
  .search-row{ width: 100%; max-width: unset; }
  .top-right{ justify-content: space-between; }
}
@media (max-width: 640px){
  .kpi-row{ grid-template-columns: 1fr; }
}
</style>
