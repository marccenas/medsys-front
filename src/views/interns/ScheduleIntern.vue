<template>
  <section class="intern-schedule">
    <div class="dash-top">
      <div class="dash-title">
        <h1>Schedule</h1>
        <p class="subtle">
          Intern Schedule Overview <span class="sep">›</span> Manage your weekly schedule of shifts.
        </p>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi kpi-blue">
        <div class="kpi-left"><div class="kpi-label">Today's Tasks</div></div>
        <div class="kpi-value">8</div>
      </div>

      <div class="kpi kpi-green">
        <div class="kpi-left"><div class="kpi-label">Due Upcoming</div></div>
        <div class="kpi-value">5</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-left"><div class="kpi-label">Overdue</div></div>
        <div class="kpi-value">3</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-left"><div class="kpi-label">Pending Follow-Up</div></div>
        <div class="kpi-value">4</div>
      </div>
    </div>

    <section class="card glass">
      <div class="cal-toolbar">
        <div class="cal-left">
          <div class="search-row">
            <font-awesome-icon class="search-ico" icon="magnifying-glass" />
            <input v-model="query" class="search" placeholder="Search..." type="text" />
          </div>
        </div>

        <div class="cal-right">
          <div class="nav-group">
            <button class="nav-btn" type="button" @click="goPrev">
              <font-awesome-icon icon="angle-left" />
            </button>

            <div class="nav-pill">{{ rangeLabel }}</div>

            <button class="nav-btn" type="button" @click="goNext">
              <font-awesome-icon icon="angle-right" />
            </button>
          </div>

          <div class="filter-dd" @click.stop>
            <button class="filter-dd-btn sm" type="button" @click="toggleDd('manage')">
              <span>Manage Schedule</span>
              <font-awesome-icon icon="chevron-down" />
            </button>

            <div v-if="openDd === 'manage'" class="filter-dd-menu right">
              <button class="filter-dd-item" type="button" @click="closeAll">Add Shift</button>
              <button class="filter-dd-item" type="button" @click="closeAll">Import</button>
              <button class="filter-dd-item" type="button" @click="closeAll">Export</button>
            </div>
          </div>

          <div class="seg">
            <button class="seg-btn" :class="{ active: viewMode === 'week' }" type="button" @click="setView('week')">
              Week
            </button>
            <button class="seg-btn" :class="{ active: viewMode === 'day' }" type="button" @click="setView('day')">
              Day
            </button>
          </div>
        </div>
      </div>

      <div class="cal-wrap">
        <FullCalendar ref="calendarRef" :options="calendarOptions" />
      </div>

      <div class="below-grid">
        <section class="mini-cal card glass">
          <div class="mini-cal-head">
            <div class="mini-cal-title">{{ miniMonthLabel }}</div>

            <div class="mini-cal-nav">
              <button class="mini-nav" type="button" @click="miniPrevMonth">
                <font-awesome-icon icon="angle-left" />
              </button>
              <button class="mini-nav" type="button" @click="miniNextMonth">
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
    </section>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const query = ref("");
const viewMode = ref("week");
const openDd = ref(null);
const calendarRef = ref(null);

const anchorDate = ref(new Date());


const events = ref([
  { id: "1", title: "ER Rotation", start: "2024-05-23T14:00:00", end: "2024-05-23T20:00:00", classNames: ["ev-blue"] },
  { id: "2", title: "Pediatrics", start: "2024-05-24T07:00:00", end: "2024-05-24T15:00:00", classNames: ["ev-orange"] },
  { id: "3", title: "Internal Medicine", start: "2024-05-25T08:00:00", end: "2024-05-25T16:00:00", classNames: ["ev-teal"] },
  { id: "4", title: "Surgery Rotation", start: "2024-05-27T06:00:00", end: "2024-05-27T15:00:00", classNames: ["ev-purple"] },
  { id: "5", title: "Surgery Rotation", start: "2024-05-28T06:00:00", end: "2024-05-28T14:00:00", classNames: ["ev-green"] },
  { id: "6", title: "Clinic Rotation", start: "2024-05-28T13:00:00", end: "2024-05-28T19:00:00", classNames: ["ev-blue2"] },
]);

const filteredEvents = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return events.value;
  return events.value.filter((e) => e.title.toLowerCase().includes(q));
});

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: viewMode.value === "day" ? "timeGridDay" : "timeGridWeek",
  headerToolbar: false,

datesSet(info) {
    anchorDate.value = new Date(info.view.currentStart);
  },

  allDaySlot: false,
  height: "auto",
  nowIndicator: true,
  editable: true,
  selectable: true,
  selectMirror: true,

  slotDuration: "00:30:00",
  snapDuration: "00:30:00",
  selectMinDistance: 0,

  slotMinTime: "06:00:00",
  slotMaxTime: "20:00:00",
  events: filteredEvents.value,
  eventTimeFormat: { hour: "numeric", minute: "2-digit", meridiem: "short" },

  eventContent(arg) {
    const title = arg.event.title;
    const timeText = arg.timeText;
    return {
      html: `
        <div class="ev-title">${title}</div>
        <div class="ev-time">${timeText}</div>
      `,
    };
  },
}));

const rangeLabel = computed(() => {
  const d = anchorDate.value;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
});

function setView(mode) {
  viewMode.value = mode;
  const api = calendarRef.value?.getApi?.();
  if (!api) return;
  api.changeView(mode === "day" ? "timeGridDay" : "timeGridWeek");
}

function goPrev() {
  calendarRef.value?.getApi?.().prev();
}
function goNext() {
  calendarRef.value?.getApi?.().next();
}

function toggleDd(key) {
  openDd.value = openDd.value === key ? null : key;
}
function closeAll() {
  openDd.value = null;
}

onMounted(() => window.addEventListener("click", closeAll));
onBeforeUnmount(() => window.removeEventListener("click", closeAll));

const now = ref(new Date());
let nowTimer = null;

onMounted(() => {
  nowTimer = setInterval(() => (now.value = new Date()), 30_000);
});
onBeforeUnmount(() => {
  if (nowTimer) clearInterval(nowTimer);
});

const miniCursor = ref(new Date());
const miniSelected = ref(new Date());
const miniDow = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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
  const firstDowMonFirst = (first.getDay() + 6) % 7;
  const gridStart = new Date(y, m, 1 - firstDowMonFirst);

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
  const api = calendarRef.value?.getApi?.();
  if (api) api.gotoDate(d);
}

function jumpToToday() {
  const t = new Date();
  miniCursor.value = new Date(t.getFullYear(), t.getMonth(), 1);
  miniSelected.value = t;

  const api = calendarRef.value?.getApi?.();
  if (api) api.today();
}
</script>

<style scoped>
:deep(.fc .fc-timegrid-event.fc-event-mirror),
:deep(.fc .fc-timegrid-event-harness.fc-event-mirror) {
  display: flex;
  align-items: center;
}
:deep(.fc .fc-timegrid-event.fc-event-mirror .fc-event-main),
:deep(.fc .fc-timegrid-event.fc-event-mirror .fc-event-main-frame) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
:deep(.fc .fc-timegrid-event.fc-event-mirror .fc-event-time) {
  margin: 0 !important;
  line-height: 1 !important;
  white-space: nowrap;
}

.intern-schedule{ padding: 18px 18px 24px; }
.sep{ margin: 0 6px; opacity: .55; }
.dash-title h1{ margin:0; font-size: 30px; font-weight: 900; letter-spacing:-0.02em; }
.dash-title p{ margin: 6px 0 0; font-size: 14px; }

.kpi-row{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 12px 0 14px;
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
.kpi-value{ font-weight: 900; font-size: 34px; line-height: 1; letter-spacing: -0.03em; }
.kpi-blue{ background: linear-gradient(135deg, #4f77ff, #2f56ff); }
.kpi-green{ background: linear-gradient(135deg, #23b5a8, #1a8e84); }
.kpi-red{ background: linear-gradient(135deg, #ff6c6c, #ff4a4a); }
.kpi-orange{ background: linear-gradient(135deg, #ffb35a, #ff8c3a); }

.card{
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  background: rgba(255,255,255,0.60);
  box-shadow: 0 10px 26px rgba(35, 55, 110, 0.12);
  overflow:hidden;
}
.glass{ backdrop-filter: blur(10px); }

.cal-toolbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.cal-left{ display:flex; align-items:center; gap: 10px; }
.cal-right{ display:flex; align-items:center; gap: 10px; flex-wrap: wrap; }

.search-row{ position: relative; width: 260px; max-width: 52vw; }
.search{
  width:100%;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 12px 10px 38px;
  outline: none;
}
.search-ico{ position:absolute; left: 12px; top: 11px; opacity: .65; }

.nav-group{ display:flex; align-items:center; gap: 8px; }
.nav-btn{
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  cursor:pointer;
}
.nav-pill{
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
  min-width: 110px;
  text-align:center;
}

.seg{
  display:flex;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  overflow:hidden;
}
.seg-btn{
  border: none;
  background: transparent;
  padding: 10px 14px;
  font-weight: 900;
  cursor:pointer;
  color: rgba(30,40,70,0.85);
}
.seg-btn.active{
  background: rgba(47,86,255,0.14);
  color: #2f56ff;
}

.filter-dd{ position: relative; display: inline-flex; }
.filter-dd-btn{
  height: 40px; min-width: 170px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.60);
  font-size: 14px; font-weight: 900;
  color: rgba(30,40,70,0.95);
  display: inline-flex; align-items:center; justify-content:space-between; gap: 10px;
  cursor: pointer;
}
.filter-dd-btn.sm{ min-width: 190px; }
.filter-dd-menu{
  position:absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 100%;
  z-index: 9999;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 40px rgba(20, 30, 70, 0.22);
  padding: 6px;
}
.filter-dd-menu.right{ left:auto; right:0; }
.filter-dd-item{
  width:100%;
  border:none;
  background:transparent;
  text-align:left;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 900;
  color: rgba(30,40,70,0.92);
  cursor:pointer;
}
.filter-dd-item:hover{ background: rgba(47,86,255,0.10); color: #2f56ff; }

.cal-wrap{ padding: 12px 12px 14px; }

:deep(.fc){ font-family: inherit; }
:deep(.fc .fc-scrollgrid){
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  overflow: hidden;
}
:deep(.fc .fc-timegrid-slot){ background: rgba(255,255,255,0.35); }
:deep(.fc .fc-col-header-cell){
  background: rgba(255,255,255,0.40);
  font-weight: 900;
}
:deep(.fc .fc-event){
  border: none;
  border-radius: 12px;
  padding: 8px 10px;
  box-shadow: 0 10px 18px rgba(0,0,0,0.12);
}
:deep(.ev-title){ font-weight: 900; font-size: 14px; }
:deep(.ev-time){ margin-top: 4px; font-weight: 800; font-size: 12px; opacity: .95; }

:deep(.ev-blue){ background: linear-gradient(135deg, #6f8cff, #4f77ff) !important; color:#fff; }
:deep(.ev-orange){ background: linear-gradient(135deg, #ffbf70, #ff9a3d) !important; color:#fff; }
:deep(.ev-teal){ background: linear-gradient(135deg, #4cc3b8, #23b5a8) !important; color:#fff; }
:deep(.ev-purple){ background: linear-gradient(135deg, #9b7bff, #7a5cff) !important; color:#fff; }
:deep(.ev-green){ background: linear-gradient(135deg, #43c89f, #1a8e84) !important; color:#fff; }
:deep(.ev-blue2){ background: linear-gradient(135deg, #7aa9ff, #4f77ff) !important; color:#fff; }

.below-grid{
  padding: 0 12px 14px;
}

.mini-cal{
  padding: 14px 16px;
}
.mini-cal-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.mini-cal-title{
  font-weight: 900;
  font-size: 16px;
  color: rgba(30,40,70,0.92);
}
.mini-cal-nav{
  display:flex;
  gap: 8px;
}
.mini-nav{
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
}

.mini-dow{
  display:grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 900;
  color: rgba(60,70,95,0.62);
  letter-spacing: 0.04em;
}
.mini-dow span{ text-align:center; }

.mini-grid{
  display:grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
.mini-day{
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.55);
  font-weight: 900;
  color: rgba(30,40,70,0.88);
  cursor: pointer;
}
.mini-day.is-out{ opacity: 0.35; }
.mini-day.is-today{
  border-color: rgba(47,86,255,0.35);
  box-shadow: 0 0 0 3px rgba(47,86,255,0.10);
}
.mini-day.is-selected{
  background: rgba(47,86,255,0.14);
  border-color: rgba(47,86,255,0.28);
  color: #2f56ff;
}
.mini-link{
  margin-top: 10px;
  width: 100%;
  border: none;
  background: transparent;
  color: #2f56ff;
  font-weight: 900;
  padding: 8px 0 0;
  cursor: pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}

@media (max-width: 1100px){
  .kpi-row{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px){
  .cal-toolbar{ flex-direction: column; align-items: stretch; }
  .search-row{ width: 100%; max-width: unset; }
  .cal-right{ justify-content: space-between; }
}
@media (max-width: 640px){
  .kpi-row{ grid-template-columns: 1fr; }
}
</style>
