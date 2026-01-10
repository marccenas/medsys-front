<template>
  <section class="hn-dash">
    <!-- TOP HEADER -->
    <header class="hn-top">
      <div class="hn-title">
        <h1>Welcome, Sarah Thompson</h1>
        <p class="subtle">
          Head Nurse / Nurse Unit Manager <span class="sep">›</span> Misss First Manager.
        </p>
      </div>
    </header>

    <!-- KPI ROW -->
    <section class="kpi-row">
      <div class="kpi kpi-blue">
        <div class="kpi-label">Patients Admitted</div>
        <div class="kpi-value">32</div>
      </div>

      <div class="kpi kpi-teal">
        <div class="kpi-label">Nurses on Duty</div>
        <div class="kpi-value">10</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-label">Tasks Pending</div>
        <div class="kpi-value">12</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-label">Critical Alerts</div>
        <div class="kpi-value">2</div>
      </div>
    </section>

    <!-- MAIN GRID -->
    <section class="grid">
      <!-- LEFT: Patient Overview -->
      <section class="panel">
        <div class="panel-head">
          <h2>Patient Overview</h2>
        </div>

        <div class="tabs">
          <button class="tab" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
            All Patients (32)
          </button>
          <button class="tab" :class="{ active: activeTab === 'icu' }" @click="activeTab = 'icu'">
            ICU (5)
          </button>
          <button class="tab" :class="{ active: activeTab === 'discharges' }" @click="activeTab = 'discharges'">
            Discharges Today (7)
          </button>
        </div>

        <div class="row">
          <div class="search">
            <font-awesome-icon class="search-ico" icon="magnifying-glass" />
            <input v-model="query" type="text" placeholder="Search..." />
          </div>
          <button class="view-btn" type="button">
            View <font-awesome-icon icon="chevron-down" />
          </button>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th class="w-name">Name</th>
                <th class="w-room">Room</th>
                <th class="w-status">Status</th>
                <th class="w-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in filteredPatients" :key="p.id">
                <td>
                  <div class="name-cell">
                    <img class="mini" :src="p.avatar" alt="" />
                    <div class="nm">
                      <div class="nm-main">{{ p.name }}</div>
                      <div class="nm-sub">{{ p.note }}</div>
                    </div>
                  </div>
                </td>
                <td class="muted">{{ p.room }}</td>
                <td>
                  <span class="pill" :class="p.pillClass">{{ p.status }}</span>
                </td>
                <td class="right">
                  <button class="tiny-link" type="button" aria-label="Open patient">
                    <font-awesome-icon icon="chevron-right" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="tfoot">
            <div class="muted">Showing 1 to 5 of 32 patients</div>
          </div>
        </div>
      </section>

      <!-- RIGHT TOP: Nurse Assignments -->
      <section class="panel">
        <div class="panel-head split">
          <h2>Nurse Assignments</h2>
          <button class="soft-btn" type="button">Manage Assignments</button>
        </div>

        <div class="list">
          <div class="list-row" v-for="n in nurseAssignments" :key="n.id">
            <div class="left">
              <img class="mini" :src="n.avatar" alt="" />
              <div class="nm">
                <div class="nm-main">
                  {{ n.name }}
                  <span v-if="n.tag" class="tag">{{ n.tag }}</span>
                </div>
                <div class="nm-sub">{{ n.sub }}</div>
              </div>
            </div>

            <div class="right2">
              <div class="muted">{{ n.countLabel }}</div>
              <div class="count">{{ n.count }}</div>
              <button class="tiny-link" type="button" aria-label="Open assignment">
                <font-awesome-icon icon="chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- RIGHT MID: Upcoming Discharges -->
      <section class="panel">
        <div class="panel-head split">
          <h2>Upcoming Discharges</h2>
          <button class="link" type="button">View All</button>
        </div>

        <div class="list">
          <div class="list-row discharge" v-for="d in discharges" :key="d.id">
            <div class="left">
              <div class="iconbox" :class="d.icon">
                <font-awesome-icon icon="clipboard-check" />
              </div>
              <div class="nm">
                <div class="nm-main">{{ d.name }}</div>
                <div class="nm-sub">{{ d.sub }}</div>
              </div>
            </div>

            <div class="right2">
              <div class="time" :class="d.timeClass">
                <font-awesome-icon icon="arrow-up" v-if="d.timeClass === 'up'" />
                <font-awesome-icon icon="arrow-down" v-else />
                {{ d.time }}
              </div>
              <button class="tiny-link" type="button" aria-label="Open discharge">
                <font-awesome-icon icon="chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- BOTTOM ROW -->
      <section class="panel">
        <div class="panel-head split">
          <h2>Recent Activities</h2>
          <button class="link" type="button">View All Activities</button>
        </div>

        <div class="list">
          <div class="act" v-for="a in activities" :key="a.id">
            <div class="iconbox" :class="a.icon">
              <font-awesome-icon :icon="a.fa" />
            </div>
            <div class="act-body">
              <div class="act-main">{{ a.text }}</div>
              <div class="act-sub muted">{{ a.sub }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <h2>Staff Performance</h2>
        </div>

        <div class="list">
          <div class="perf" v-for="s in performance" :key="s.id">
            <div class="left">
              <div class="iconbox blue">
                <font-awesome-icon icon="user-nurse" />
              </div>
              <div class="nm">
                <div class="nm-main">{{ s.name }}</div>
                <div class="nm-sub">{{ s.sub }}</div>
              </div>
            </div>
            <button class="tiny-link" type="button">
              <font-awesome-icon icon="chevron-right" />
            </button>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head split">
          <h2>Critical Alerts</h2>
          <button class="link" type="button">View All</button>
        </div>

        <div class="list">
          <div class="alert" v-for="c in critical" :key="c.id">
            <div class="iconbox red">
              <font-awesome-icon icon="triangle-exclamation" />
            </div>
            <div class="act-body">
              <div class="act-main">{{ c.name }}</div>
              <div class="act-sub muted">{{ c.sub }}</div>
            </div>
            <div class="muted">{{ c.time }}</div>
          </div>

          <button class="bottom-link" type="button">
            View All Alerts <font-awesome-icon icon="chevron-right" />
          </button>
        </div>
      </section>
    </section>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const avatarUrl = "https://i.pravatar.cc/64?img=32";

/* Notifications */
const notifRef = ref(null);
const notifOpen = ref(false);
const notifications = ref([
  { id: 1, text: "New discharge request pending approval.", time: "Just now", read: false },
  { id: 2, text: "Staff schedule updated successfully.", time: "10 min ago", read: false },
  { id: 3, text: "Weekly report is ready to review.", time: "1 hr ago", read: true },
]);
const notifCount = computed(() => notifications.value.filter((n) => !n.read).length);

function toggleNotif() {
  notifOpen.value = !notifOpen.value;
}
function closeNotif() {
  notifOpen.value = false;
}
function markAllRead() {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
}
function openNotif(n) {
  notifications.value = notifications.value.map((x) => (x.id === n.id ? { ...x, read: true } : x));
  closeNotif();
}
function onWindowClick(e) {
  if (!notifOpen.value) return;
  const el = notifRef.value;
  if (el && !el.contains(e.target)) closeNotif();
}
function onEsc(e) {
  if (e.key === "Escape") closeNotif();
}
onMounted(() => {
  window.addEventListener("click", onWindowClick, true);
  window.addEventListener("keydown", onEsc);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", onWindowClick, true);
  window.removeEventListener("keydown", onEsc);
});

/* Patient Overview */
const activeTab = ref("all");
const query = ref("");

const patients = ref([
  {
    id: 1,
    name: "Laura Williams",
    note: "Vital Sign Check",
    room: "102A",
    status: "Outpatient",
    pillClass: "teal",
    avatar: "https://i.pravatar.cc/40?img=12",
  },
  {
    id: 2,
    name: "Ethan Rivera",
    note: "ICU-2 • Oxygen Therapy",
    room: "104A",
    status: "Inpatient",
    pillClass: "orange",
    avatar: "https://i.pravatar.cc/40?img=20",
  },
  {
    id: 3,
    name: "Megan Richards",
    note: "Vital Signs • due at 2:00 PM",
    room: "105B",
    status: "Vital Signs",
    pillClass: "blue",
    avatar: "https://i.pravatar.cc/40?img=47",
  },
  {
    id: 4,
    name: "Olivia Harris",
    note: "Discharge Today",
    room: "ICU-3",
    status: "Discharge Today",
    pillClass: "purple",
    avatar: "https://i.pravatar.cc/40?img=31",
  },
  {
    id: 5,
    name: "Robert Lee",
    note: "Wounds dressing • 4:30 AM",
    room: "106A",
    status: "Wounds",
    pillClass: "gray",
    avatar: "https://i.pravatar.cc/40?img=55",
  },
]);

const filteredPatients = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return patients.value;
  return patients.value.filter((p) => p.name.toLowerCase().includes(q) || p.note.toLowerCase().includes(q));
});

/* Right panels */
const nurseAssignments = ref([
  { id: 1, name: "Nicole Reed, RN", sub: "Laura Williams", countLabel: "Patients", count: "4 Patients", avatar: "https://i.pravatar.cc/40?img=8" },
  { id: 2, name: "Sarah Mitchell, RN", sub: "ICU Lead", tag: "ICU Lead", countLabel: "Patients", count: "3 Patients", avatar: "https://i.pravatar.cc/40?img=5" },
  { id: 3, name: "Karen Brooks, RN", sub: "Assigned Unit", countLabel: "Patients", count: "5 Patients", avatar: "https://i.pravatar.cc/40?img=18" },
  { id: 4, name: "Katie Nguyen, RN", sub: "Assigned Unit", countLabel: "Patients", count: "2 Patients", avatar: "https://i.pravatar.cc/40?img=24" },
  { id: 5, name: "Dr. Ryan Lewis, RN", sub: "Dr. Ryan Lewis, MD", countLabel: "Patients", count: "2 Patients", avatar: "https://i.pravatar.cc/40?img=15" },
]);

const discharges = ref([
  { id: 1, name: "Olivia Harris (ICU-3)", sub: "Discharging and needs IV line change", time: "10:00 AM", timeClass: "up", icon: "blue" },
  { id: 2, name: "William Clark (ICU-1)", sub: "Dropping provider processes", time: "11:00 AM", timeClass: "down", icon: "teal" },
]);

const activities = ref([
  { id: 1, text: "Cleo Anderson (ICU-3) discharged 10:00AM", sub: "Queen Therapy", icon: "green", fa: "clipboard-check" },
  { id: 2, text: "Ethan Rivera received Oxygen Therapy 9:00", sub: "Pee 3h O2k", icon: "blue", fa: "flask" },
  { id: 3, text: "William Clark: discharge paperwork 8:00", sub: "By Estip Physician", icon: "orange", fa: "file-lines" },
]);

const performance = ref([
  { id: 1, name: "Nicole Reed, RN", sub: "Head Brooks, RN" },
  { id: 2, name: "Sarah Mitchell, RN", sub: "Sapar Brooks, RN" },
  { id: 3, name: "Katie Nguyen, RN", sub: "Karen Brooks, MD" },
]);

const critical = ref([
  { id: 1, name: "Ethan Rivera", sub: "Raw 10h + 7h ago", time: "7m ago" },
  { id: 2, name: "William Clark", sub: "Reposition to Ventilation", time: "1 hour ago" },
]);
</script>

<style scoped>
.hn-dash {
  padding: 18px 18px 24px;
  display: grid;
  gap: 14px;
}

/* Top header */
.hn-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.hn-title h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.02em;
}
.hn-title p {
  margin: 6px 0 0;
  font-size: 14px;
}
.sep {
  margin: 0 6px;
  opacity: 0.55;
}
.hn-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Icon button */
.icon-btn {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
  cursor: pointer;
}
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff3b30;
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  border-radius: 999px;
  padding: 2px 6px;
  border: 2px solid #fff;
}

/* Notif dropdown */
.hn-notif {
  position: relative;
}
.notif-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: min(360px, 92vw);
  background: #fff;
  border: 1px solid rgba(226, 232, 244, 0.95);
  border-radius: 14px;
  box-shadow: 0 22px 44px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  z-index: 999;
}
.notif-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(180deg, rgba(248, 251, 255, 0.95), rgba(245, 249, 255, 0.85));
  border-bottom: 1px solid rgba(226, 232, 244, 0.9);
}
.notif-title {
  font-weight: 900;
}
.notif-action {
  border: 1px solid rgba(226, 232, 244, 0.95);
  background: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 900;
  color: var(--blue2);
}
.notif-action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.notif-list {
  max-height: 300px;
  overflow: auto;
}
.notif-item {
  width: 100%;
  display: flex;
  gap: 10px;
  padding: 12px;
  background: #fff;
  border: 0;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid rgba(226, 232, 244, 0.75);
}
.notif-item:hover {
  background: #f6f9ff;
}
.notif-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 6px;
  background: rgba(148, 163, 184, 0.55);
  flex: 0 0 auto;
}
.notif-dot.on {
  background: var(--blue);
  box-shadow: 0 0 0 4px rgba(45, 118, 214, 0.12);
}
.notif-body {
  min-width: 0;
}
.notif-msg {
  font-weight: 900;
  font-size: 13px;
  line-height: 1.2;
}
.notif-time {
  margin-top: 4px;
  font-size: 11px;
  color: var(--muted);
  font-weight: 800;
}
.notif-empty {
  padding: 16px 12px;
  color: var(--muted);
  font-weight: 900;
}
.notif-foot {
  padding: 10px 12px;
  background: rgba(245, 248, 255, 0.65);
}
.notif-viewall {
  width: 100%;
  border: 1px solid rgba(226, 232, 244, 0.95);
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 900;
}

/* Profile */
.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
}
.avatar {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  object-fit: cover;
}
.user {
  line-height: 1.1;
}
.name {
  font-weight: 900;
  font-size: 13px;
}
.role {
  font-size: 11px;
  color: var(--muted);
}
.chev {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: rgba(34, 50, 74, 0.75);
}

/* KPI Row */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.kpi {
  border-radius: 14px;
  padding: 14px 16px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}
.kpi-label {
  font-weight: 800;
  font-size: 14px;
  opacity: 0.96;
}
.kpi-value {
  font-weight: 900;
  font-size: 38px;
  line-height: 1;
  letter-spacing: -0.03em;
}
.kpi-blue {
  background: linear-gradient(135deg, #6f8cff, #4f77ff);
}
.kpi-teal {
  background: linear-gradient(135deg, #4cc3b8, #23b5a8);
}
.kpi-orange {
  background: linear-gradient(135deg, #ffbf70, #ff9a3d);
}
.kpi-red {
  background: linear-gradient(135deg, #ff6c6c, #ff4a4a);
}

/* Main grid (matches screenshot layout) */
.grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 14px;
  align-items: start;
}

/* Panels */
.panel {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.66));
  box-shadow: var(--panel-glow), var(--panel-shadow-soft);
  overflow: hidden;
}
.panel-head {
  padding: 12px 14px;
  font-weight: 900;
  border-bottom: 1px solid rgba(226, 232, 244, 0.85);
  background: linear-gradient(180deg, rgba(248, 251, 255, 0.95), rgba(245, 249, 255, 0.75));
}
.panel-head h2 {
  margin: 0;
  font-size: 18px;
}
.panel-head.split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  padding: 12px 14px 0;
  flex-wrap: wrap;
}
.tab {
  border: 1px solid rgba(226, 232, 244, 0.95);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 8px 12px;
  font-weight: 900;
  cursor: pointer;
  color: rgba(34, 50, 74, 0.75);
}
.tab.active {
  background: rgba(45, 118, 214, 0.12);
  color: var(--blue);
  border-color: rgba(45, 118, 214, 0.2);
}

/* Search row */
.row {
  display: flex;
  gap: 10px;
  padding: 12px 14px 14px;
  align-items: center;
  flex-wrap: wrap;
}
.search {
  position: relative;
  flex: 1 1 280px;
}
.search input {
  width: 100%;
  border: 1px solid rgba(226, 232, 244, 0.95);
  border-radius: 12px;
  padding: 10px 12px 10px 38px;
  background: rgba(255, 255, 255, 0.65);
  outline: none;
}
.search-ico {
  position: absolute;
  left: 12px;
  top: 11px;
  opacity: 0.6;
}
.view-btn {
  border: 1px solid rgba(226, 232, 244, 0.95);
  background: rgba(255, 255, 255, 0.65);
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Table */
.table-wrap {
  padding: 0 14px 14px;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 12px 10px;
  font-size: 13px;
  border-top: 1px solid rgba(226, 232, 244, 0.75);
  vertical-align: middle;
}
.table th {
  color: var(--muted);
  font-weight: 900;
  border-top: 0;
}
.w-name {
  width: 52%;
}
.w-room {
  width: 14%;
}
.w-status {
  width: 24%;
}
.w-actions {
  width: 10%;
}
.name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mini {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  object-fit: cover;
}
.nm-main {
  font-weight: 900;
}
.nm-sub {
  font-size: 11px;
  color: var(--muted);
  font-weight: 800;
  margin-top: 2px;
}
.right {
  text-align: right;
}

/* Pills */
.pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  border: 1px solid rgba(226, 232, 244, 0.65);
}
.pill.teal {
  background: rgba(76, 195, 184, 0.18);
  color: #0f766e;
}
.pill.orange {
  background: rgba(255, 154, 61, 0.2);
  color: #9a3412;
}
.pill.blue {
  background: rgba(79, 119, 255, 0.18);
  color: #1e40af;
}
.pill.purple {
  background: rgba(154, 123, 255, 0.18);
  color: #5b21b6;
}
.pill.gray {
  background: rgba(148, 163, 184, 0.18);
  color: #334155;
}

/* Buttons / links */
.soft-btn {
  border: 1px solid rgba(226, 232, 244, 0.95);
  background: rgba(255, 255, 255, 0.65);
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  cursor: pointer;
  color: rgba(34, 50, 74, 0.85);
}
.link {
  border: 0;
  background: transparent;
  color: var(--blue);
  font-weight: 900;
  cursor: pointer;
}
.tiny-link {
  width: 36px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(226, 232, 244, 0.95);
  background: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Lists */
.list {
  padding: 10px 14px 14px;
  display: grid;
  gap: 10px;
}
.list-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(226, 232, 244, 0.85);
  background: rgba(255, 255, 255, 0.55);
}
.left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.right2 {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}
.count {
  font-weight: 900;
}
.tag {
  margin-left: 8px;
  font-size: 11px;
  font-weight: 900;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(45, 118, 214, 0.12);
  color: var(--blue2);
  border: 1px solid rgba(45, 118, 214, 0.18);
}

/* Icon boxes */
.iconbox {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex: 0 0 auto;
}
.iconbox.blue {
  background: linear-gradient(135deg, #6f8cff, #4f77ff);
}
.iconbox.teal {
  background: linear-gradient(135deg, #4cc3b8, #23b5a8);
}
.iconbox.green {
  background: linear-gradient(135deg, #43c89f, #1a8e84);
}
.iconbox.orange {
  background: linear-gradient(135deg, #ffbf70, #ff9a3d);
}
.iconbox.red {
  background: linear-gradient(135deg, #ff6c6c, #ff4a4a);
}

/* Discharge time */
.time {
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.time.up {
  color: #16a34a;
}
.time.down {
  color: #7c3aed;
}

/* Activities */
.act {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(226, 232, 244, 0.85);
  background: rgba(255, 255, 255, 0.55);
}
.act-main {
  font-weight: 900;
  font-size: 13px;
}
.act-sub {
  margin-top: 2px;
  font-size: 11px;
  font-weight: 800;
}
.perf,
.alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(226, 232, 244, 0.85);
  background: rgba(255, 255, 255, 0.55);
}
.bottom-link {
  margin-top: 4px;
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--blue);
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0 0;
}

/* Responsive */
@media (max-width: 1100px) {
  .kpi-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 760px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }
  .hn-title h1 {
    font-size: 26px;
  }
  .user {
    display: none;
  }
}
</style>
