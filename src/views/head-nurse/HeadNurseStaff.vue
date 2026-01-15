<template>
  <section class="hn-staff">
    <!-- Header -->
    <div class="dash-top">
      <div class="dash-title">
        <h1>Staff</h1>
        <p class="subtle">
          Staff Overview <span class="sep">›</span> Manage the nursing staff in your unit.
        </p>
      </div>
    </div>

    <!-- KPI row -->
    <div class="kpi-row">
      <div class="kpi kpi-blue">
        <div class="kpi-left">
          <div class="kpi-label">Total Staff</div>
        </div>
        <div class="kpi-value">27</div>
      </div>

      <div class="kpi kpi-teal">
        <div class="kpi-left">
          <div class="kpi-label">Nurses Scheduled</div>
        </div>
        <div class="kpi-value">10</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-left">
          <div class="kpi-label">In Training</div>
        </div>
        <div class="kpi-value">3</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-left">
          <div class="kpi-label">On Leave</div>
        </div>
        <div class="kpi-value">1</div>
      </div>
    </div>

    <!-- Main panel -->
    <section class="panel glass">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="left">
          <div class="search-row">
            <font-awesome-icon class="search-ico" icon="magnifying-glass" />
            <input v-model="q" class="search" placeholder="Search..." type="text" />
          </div>

          <div class="dd" @click.stop>
            <button class="dd-btn" type="button" @click="toggleDd('roles')">
              <span>{{ roleFilterLabel }}</span>
              <font-awesome-icon icon="chevron-down" />
            </button>
            <div v-if="openDd === 'roles'" class="dd-menu">
              <button class="dd-item" type="button" @click="setRole('all')">All Roles</button>
              <button class="dd-item" type="button" @click="setRole('rn')">RN</button>
              <button class="dd-item" type="button" @click="setRole('icu')">ICU</button>
              <button class="dd-item" type="button" @click="setRole('physician')">Staff Physician</button>
              <button class="dd-item" type="button" @click="setRole('training')">In Training</button>
              <button class="dd-item" type="button" @click="setRole('leave')">On Leave</button>
            </div>
          </div>

          <div class="dd" @click.stop>
            <button class="dd-btn" type="button" @click="toggleDd('shifts')">
              <span>{{ shiftFilterLabel }}</span>
              <font-awesome-icon icon="chevron-down" />
            </button>
            <div v-if="openDd === 'shifts'" class="dd-menu">
              <button class="dd-item" type="button" @click="setShift('all')">All Shifts</button>
              <button class="dd-item" type="button" @click="setShift('day')">Day Shift</button>
              <button class="dd-item" type="button" @click="setShift('night')">Night Shift</button>
              <button class="dd-item" type="button" @click="setShift('swing')">Swing</button>
            </div>
          </div>
        </div>

        <div class="right">
          <div class="dd" @click.stop>
            <button class="export-btn" type="button" @click="toggleDd('export')">
              <font-awesome-icon icon="download" />
              <span>Export</span>
              <font-awesome-icon icon="chevron-down" />
            </button>
            <div v-if="openDd === 'export'" class="dd-menu right">
              <button class="dd-item" type="button" @click="closeAll">Export CSV</button>
              <button class="dd-item" type="button" @click="closeAll">Export PDF</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <table class="tbl">
          <colgroup>
            <col class="c-check" />
            <col class="c-check2" />
            <col class="c-name" />
            <col class="c-role" />
            <col class="c-pa" />
            <col class="c-nurse" />
            <col class="c-actions" />
          </colgroup>

          <thead>
            <tr>
              <th class="th-center">
                <input
                  type="checkbox"
                  class="chk"
                  :checked="isAllOnPageSelected"
                  :indeterminate.prop="isSomeOnPageSelected"
                  @change="toggleAllOnPage($event.target.checked)"
                />
              </th>

              <!-- ✅ 2nd checkbox column header -->
              <th class="th-center">
                <input
                  type="checkbox"
                  class="chk"
                  :checked="isAllOnPageFlagged"
                  :indeterminate.prop="isSomeOnPageFlagged"
                  @change="toggleAllFlagOnPage($event.target.checked)"
                />
              </th>

              <th>
                <span class="th-sort">
                  Name <font-awesome-icon class="th-caret" icon="chevron-down" />
                </span>
              </th>
              <th>
                <span class="th-sort">
                  Role <font-awesome-icon class="th-caret" icon="chevron-down" />
                </span>
              </th>
              <th>
                <span class="th-sort">
                  Patients Assigned <font-awesome-icon class="th-caret" icon="chevron-down" />
                </span>
              </th>
              <th>
                <span class="th-sort">
                  Nurse <font-awesome-icon class="th-caret" icon="chevron-down" />
                </span>
              </th>
              <th>
                <span class="th-sort">
                  Actions <font-awesome-icon class="th-caret" icon="chevron-down" />
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in pagedRows" :key="row.id" :class="{ dim: row.onLeave }">
              <!-- checkbox 1 -->
              <td class="td-center">
                <input class="chk" type="checkbox" v-model="row.selected" />
              </td>

              <!-- ✅ checkbox 2 (flag/star-ish) -->
              <td class="td-center">
                <input class="chk chk-flag" type="checkbox" v-model="row.flagged" />
              </td>

              <!-- name cell -->
              <td>
                <div class="name-cell">
                  <img class="avatar" :src="row.avatar" alt="" />
                  <div class="name-meta">
                    <div class="name-line">
                      <span class="name">{{ row.name }}</span>
                      <span v-if="row.badge" class="mini-badge">{{ row.badge }}</span>
                    </div>
                    <div class="sub">{{ row.sub }}</div>
                  </div>
                </div>
              </td>

              <!-- role -->
              <td>
                <span class="pill" :class="pillClass(row.rolePill)">{{ row.rolePill }}</span>
              </td>

              <!-- patients assigned -->
              <td class="muted-strong">
                {{ row.patientsAssigned }} Patients
              </td>

              <!-- nurse -->
              <td class="muted-strong">
                {{ row.nurse }}
              </td>

              <!-- actions -->
              <td>
                <div class="actions">
                  <button class="btn-sm primary" type="button" @click="noop('Message')">Message</button>
                  <button class="btn-sm" type="button" @click="noop('Profile')">Profile</button>
                </div>
              </td>
            </tr>

            <tr v-if="pagedRows.length === 0">
              <td class="empty" colspan="7">No staff found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer / pagination -->
      <div class="table-foot">
        <div class="foot-left">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filtered.length }} staff
        </div>

        <div class="foot-right">
          <div class="pager">
            <button class="pg" type="button" @click="prevPage" :disabled="page === 1">
              <font-awesome-icon icon="angle-left" />
            </button>
            <button
              v-for="p in pageButtons"
              :key="p.key"
              class="pg"
              :class="{ active: p.num === page, dots: p.dots }"
              type="button"
              :disabled="p.dots"
              @click="p.num && (page = p.num)"
            >
              {{ p.label }}
            </button>
            <button class="pg" type="button" @click="nextPage" :disabled="page === pageCount">
              <font-awesome-icon icon="angle-right" />
            </button>
          </div>

          <div class="perpage dd" @click.stop>
            <button class="dd-btn sm" type="button" @click="toggleDd('per')">
              <span>{{ perPage }} / page</span>
              <font-awesome-icon icon="chevron-down" />
            </button>
            <div v-if="openDd === 'per'" class="dd-menu right">
              <button class="dd-item" type="button" @click="setPer(10)">10 / page</button>
              <button class="dd-item" type="button" @click="setPer(15)">15 / page</button>
              <button class="dd-item" type="button" @click="setPer(20)">20 / page</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom grid (matches design: left note / right panels) -->
    <section class="bottom-grid">
      <!-- left note card -->
      <section class="panel glass note">
        <div class="panel-title">
          <div class="note-head">
            <img class="avatar lg" :src="headNurse.avatar" alt="" />
            <div>
              <div class="note-name">{{ headNurse.name }}</div>
              <div class="note-role">{{ headNurse.role }}</div>
            </div>
          </div>
        </div>
        <div class="panel-body">
          <p class="note-msg">
            We have a new nursing extern, please welcome. Artejad Tuen to our team!
          </p>
          <button class="linkish" type="button" @click="noop('View All Activities')">
            View All Activities <font-awesome-icon icon="chevron-right" />
          </button>
        </div>
      </section>

      <!-- upcoming shifts -->
      <section class="panel glass">
        <div class="panel-title">Upcoming Shifts</div>
        <div class="panel-body">
          <div class="mini-list">
            <div class="mini-row" v-for="s in upcomingShifts" :key="s.id">
              <div class="mini-left">
                <input class="chk" type="checkbox" v-model="s.done" />
                <img class="avatar sm" :src="s.avatar" alt="" />
                <div class="mini-meta">
                  <div class="mini-title">{{ s.name }}</div>
                  <div class="mini-sub">{{ s.sub }}</div>
                </div>
              </div>

              <div class="mini-time">{{ s.when }}</div>

              <button class="btn-sm primary dd-like" type="button">
                Message <font-awesome-icon icon="chevron-down" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- staff announcements -->
      <section class="panel glass">
        <div class="panel-title">Staff Announcements</div>
        <div class="panel-body">
          <div class="announce">
            <div class="an-row" v-for="a in announcements" :key="a.id">
              <div class="an-left">
                <div class="an-ico" :class="a.kind">
                  <font-awesome-icon icon="file-lines" />
                </div>
                <div>
                  <div class="an-title">{{ a.title }}</div>
                  <div class="an-sub">{{ a.sub }}</div>
                </div>
              </div>
              <div class="an-time">{{ a.time }}</div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const q = ref("");
const openDd = ref(null);

const roleFilter = ref("all");
const shiftFilter = ref("all");

const perPage = ref(10);
const page = ref(1);

const headNurse = ref({
  name: "Sarah Thompson - RN",
  role: "Head Nurse / Nurse Unit Manager",
  avatar: "https://i.pravatar.cc/80?img=47",
});

/* Table rows */
const rows = ref([
  {
    id: 1,
    selected: false,
    flagged: false,
    avatar: "https://i.pravatar.cc/80?img=32",
    name: "Nicole Reed, RN",
    badge: "",
    sub: "Saren J. Jhan Sars",
    roleKey: "rn",
    rolePill: "RN",
    patientsAssigned: 4,
    nurse: "Nicole Reed, RN",
    shift: "day",
    onLeave: false,
  },
  {
    id: 2,
    selected: false,
    flagged: true,
    avatar: "https://i.pravatar.cc/80?img=12",
    name: "Sarah Mitchell, RN",
    badge: "ICU Lead",
    sub: "Saren J. Jhan Sars",
    roleKey: "rn",
    rolePill: "RN",
    patientsAssigned: 2,
    nurse: "Sarah Mitchell, RN",
    shift: "day",
    onLeave: false,
  },
  {
    id: 3,
    selected: false,
    flagged: false,
    avatar: "https://i.pravatar.cc/80?img=22",
    name: "Karen Brooks, RN",
    badge: "Training",
    sub: "Crod Brooks, RN",
    roleKey: "training",
    rolePill: "Training",
    patientsAssigned: 5,
    nurse: "Katie Nguyen, RN",
    shift: "swing",
    onLeave: false,
  },
  {
    id: 4,
    selected: false,
    flagged: false,
    avatar: "https://i.pravatar.cc/80?img=52",
    name: "Dr. Ryan Lewis, MD",
    badge: "",
    sub: "Saren Brooks, RN",
    roleKey: "physician",
    rolePill: "Staff Physician",
    patientsAssigned: 1,
    nurse: "Dr. Ryan Lewis, MD",
    shift: "day",
    onLeave: false,
  },
  {
    id: 5,
    selected: false,
    flagged: false,
    avatar: "https://i.pravatar.cc/80?img=5",
    name: "Jotin Morris",
    badge: "",
    sub: "Karen Brooks, RN",
    roleKey: "training",
    rolePill: "In Training",
    patientsAssigned: 0,
    nurse: "Karen Brooks, RN",
    shift: "night",
    onLeave: false,
  },
  {
    id: 6,
    selected: false,
    flagged: false,
    avatar: "https://i.pravatar.cc/80?img=40",
    name: "Amy Patel",
    badge: "",
    sub: "Dr. Ryan Perre",
    roleKey: "physician",
    rolePill: "Staff Physician",
    patientsAssigned: 1,
    nurse: "Dr. Amy Patel",
    shift: "day",
    onLeave: false,
  },
  {
    id: 7,
    selected: false,
    flagged: false,
    avatar: "https://i.pravatar.cc/80?img=36",
    name: "Natalie Foster, RN",
    badge: "",
    sub: "Saren Brooks, RN",
    roleKey: "leave",
    rolePill: "On Leave",
    patientsAssigned: 0,
    nurse: "Katie Nguyen, RN",
    shift: "all",
    onLeave: true,
  },
  {
    id: 8,
    selected: false,
    flagged: true,
    avatar: "https://i.pravatar.cc/80?img=41",
    name: "Karen Brooks, RN",
    badge: "",
    sub: "Saren Brooks, RN",
    roleKey: "icu",
    rolePill: "ICU",
    patientsAssigned: 2,
    nurse: "Karen Brooks, RN",
    shift: "night",
    onLeave: false,
  },
]);

/* Bottom widgets */
const upcomingShifts = ref([
  {
    id: 1,
    done: false,
    avatar: "https://i.pravatar.cc/80?img=32",
    name: "Nicole Reed, RN",
    sub: "Day Pam",
    when: "Tomorrow  7AM - 7 PM",
  },
  {
    id: 2,
    done: false,
    avatar: "https://i.pravatar.cc/80?img=12",
    name: "Sarah Mitchell, RN",
    sub: "ICU Lead",
    when: "Tomorrow  7AM - 3 PM",
  },
  {
    id: 3,
    done: false,
    avatar: "https://i.pravatar.cc/80?img=44",
    name: "Katie Nguyen, RN",
    sub: "Curbrunt",
    when: "Tomorrow  11 AM - 7 PM",
  },
]);

const announcements = ref([
  {
    id: 1,
    kind: "blue",
    title: "Nurses Training",
    sub: "Adjusts of Xemca, Un: Suspel ur’s Training",
    time: "Fri, April 25, 9:20am",
  },
  {
    id: 2,
    kind: "blue",
    title: "Nurses Training",
    sub: "Adjusts Bttcins, Erese, ore sperbilinetss",
    time: "Tomorrow  7AM-3 PM",
  },
  {
    id: 3,
    kind: "orange",
    title: "Staff Announcements",
    sub: "Important schedule and staff updates",
    time: "Tomorrow  11 AM - 7 PM",
  },
]);

/* Filtering */
const filtered = computed(() => {
  const text = q.value.trim().toLowerCase();

  return rows.value.filter((r) => {
    const matchesText =
      !text ||
      r.name.toLowerCase().includes(text) ||
      r.sub.toLowerCase().includes(text) ||
      r.nurse.toLowerCase().includes(text);

    const matchesRole = roleFilter.value === "all" ? true : r.roleKey === roleFilter.value;
    const matchesShift = shiftFilter.value === "all" ? true : r.shift === shiftFilter.value;

    return matchesText && matchesRole && matchesShift;
  });
});

/* Paging */
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)));

const startIndex = computed(() => (page.value - 1) * perPage.value);
const endIndex = computed(() => Math.min(filtered.value.length, startIndex.value + perPage.value));

const pagedRows = computed(() => filtered.value.slice(startIndex.value, endIndex.value));

function clampPage() {
  if (page.value > pageCount.value) page.value = pageCount.value;
  if (page.value < 1) page.value = 1;
}

function setPer(n) {
  perPage.value = n;
  page.value = 1;
  closeAll();
}

/* ✅ Select-all / indeterminate (column 1) */
const isAllOnPageSelected = computed(() => {
  if (!pagedRows.value.length) return false;
  return pagedRows.value.every((r) => r.selected);
});
const isSomeOnPageSelected = computed(() => {
  if (!pagedRows.value.length) return false;
  const some = pagedRows.value.some((r) => r.selected);
  return some && !isAllOnPageSelected.value;
});
function toggleAllOnPage(val) {
  pagedRows.value.forEach((r) => (r.selected = val));
}

/* ✅ Select-all / indeterminate (column 2) */
const isAllOnPageFlagged = computed(() => {
  if (!pagedRows.value.length) return false;
  return pagedRows.value.every((r) => r.flagged);
});
const isSomeOnPageFlagged = computed(() => {
  if (!pagedRows.value.length) return false;
  const some = pagedRows.value.some((r) => r.flagged);
  return some && !isAllOnPageFlagged.value;
});
function toggleAllFlagOnPage(val) {
  pagedRows.value.forEach((r) => (r.flagged = val));
}

/* Pager buttons: 1 2 3 ... n */
const pageButtons = computed(() => {
  const total = pageCount.value;
  const cur = page.value;
  const btns = [];

  const push = (num) => btns.push({ key: `p${num}`, num, label: String(num), dots: false });
  const dots = (k) => btns.push({ key: k, num: null, label: "…", dots: true });

  if (total <= 6) {
    for (let i = 1; i <= total; i++) push(i);
    return btns;
  }

  push(1);
  if (cur > 3) dots("d1");

  const start = Math.max(2, cur - 1);
  const end = Math.min(total - 1, cur + 1);
  for (let i = start; i <= end; i++) push(i);

  if (cur < total - 2) dots("d2");
  push(total);

  return btns;
});

function prevPage() {
  page.value -= 1;
  clampPage();
}
function nextPage() {
  page.value += 1;
  clampPage();
}

/* Dropdowns */
function toggleDd(key) {
  openDd.value = openDd.value === key ? null : key;
}
function closeAll() {
  openDd.value = null;
}
function setRole(key) {
  roleFilter.value = key;
  page.value = 1;
  closeAll();
}
function setShift(key) {
  shiftFilter.value = key;
  page.value = 1;
  closeAll();
}

const roleFilterLabel = computed(() => {
  if (roleFilter.value === "rn") return "RN";
  if (roleFilter.value === "icu") return "ICU";
  if (roleFilter.value === "physician") return "Staff Physician";
  if (roleFilter.value === "training") return "In Training";
  if (roleFilter.value === "leave") return "On Leave";
  return "All Roles";
});

const shiftFilterLabel = computed(() => {
  if (shiftFilter.value === "day") return "Day Shift";
  if (shiftFilter.value === "night") return "Night Shift";
  if (shiftFilter.value === "swing") return "Swing";
  return "All Shifts";
});

function pillClass(text) {
  const t = String(text || "").toLowerCase();
  if (t.includes("icu")) return "pill-icu";
  if (t.includes("training")) return "pill-training";
  if (t.includes("leave")) return "pill-leave";
  if (t.includes("physician")) return "pill-phys";
  return "pill-rn";
}

function noop(name) {
  window.alert(`${name} (UI only)`);
}

function onWindowClick() {
  closeAll();
}
onMounted(() => window.addEventListener("click", onWindowClick));
onBeforeUnmount(() => window.removeEventListener("click", onWindowClick));
</script>

<style scoped>
.hn-staff{ padding: 18px 18px 24px; }
.sep{ margin: 0 6px; opacity: .55; }
.dash-title h1{ margin:0; font-size: 34px; font-weight: 300; letter-spacing:-0.02em; }
.dash-title p{ margin: 10px 0 0; font-size: 15px; }

/* KPI */
.kpi-row{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0 14px;
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
.kpi-teal{ background: linear-gradient(135deg, #4cc3b8, #23b5a8); }
.kpi-orange{ background: linear-gradient(135deg, #ffbf70, #ff9a3d); }
.kpi-red{ background: linear-gradient(135deg, #ff6c6c, #ff4a4a); }

/* Panel glass */
.panel{
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  background: rgba(255,255,255,0.60);
  box-shadow: 0 10px 26px rgba(35, 55, 110, 0.12);
  overflow:hidden;
}
.glass{ backdrop-filter: blur(10px); }
.panel-title{
  padding: 12px 14px;
  font-weight: 900;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.35);
}
.panel-body{ padding: 14px; }

/* Toolbar */
.toolbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.left{ display:flex; align-items:center; gap: 12px; flex-wrap: wrap; }
.right{ display:flex; align-items:center; gap: 10px; }

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

/* Dropdown */
.dd{ position: relative; display:inline-flex; }
.dd-btn{
  height: 40px;
  min-width: 160px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.60);
  font-size: 14px;
  font-weight: 900;
  color: rgba(30,40,70,0.95);
  display: inline-flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  cursor: pointer;
}
.dd-btn.sm{ min-width: 130px; }
.dd-menu{
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
.dd-menu.right{ left:auto; right:0; }
.dd-item{
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
.dd-item:hover{ background: rgba(47,86,255,0.10); color: #2f56ff; }

.export-btn{
  height: 40px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.60);
  font-size: 14px;
  font-weight: 900;
  display:inline-flex;
  align-items:center;
  gap: 10px;
  cursor:pointer;
}

/* Table */
.table-wrap{ padding: 0 14px; }
.tbl{
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.c-check{ width: 44px; }
.c-check2{ width: 44px; }
.c-name{ width: 42%; }
.c-role{ width: 16%; }
.c-pa{ width: 16%; }
.c-nurse{ width: 16%; }
.c-actions{ width: 16%; }

th, td{
  padding: 12px 10px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  vertical-align: middle;
}
thead th{
  font-size: 13px;
  color: rgba(60,70,95,0.72);
  font-weight: 900;
  background: rgba(255,255,255,0.20);
}
.th-sort{ display:inline-flex; align-items:center; gap: 8px; }
.th-caret{ opacity: .55; font-size: 12px; }
.th-center, .td-center{ text-align:center; }

.chk{
  width: 16px;
  accent-color: #2f56ff;
}
.chk-flag{ accent-color: #ff9a3d; }

.name-cell{
  display:flex;
  align-items:center;
  gap: 10px;
  min-width: 0;
}
.avatar{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  object-fit: cover;
  flex: 0 0 auto;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.55);
}
.avatar.sm{ width: 30px; height: 30px; }
.avatar.lg{ width: 42px; height: 42px; }

.name-meta{ min-width:0; }
.name-line{
  display:flex;
  align-items:center;
  gap: 10px;
  min-width:0;
}
.name{
  font-weight: 900;
  color: rgba(20,30,55,0.95);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sub{
  font-size: 12px;
  font-weight: 800;
  color: rgba(90,105,130,0.75);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-badge{
  font-size: 11px;
  font-weight: 900;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(47,86,255,0.12);
  color: #2f56ff;
  border: 1px solid rgba(47,86,255,0.18);
  flex: 0 0 auto;
}

.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 5px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 900;
  border: 1px solid rgba(0,0,0,0.06);
}
.pill-rn{ background: rgba(47,86,255,0.14); color: #2f56ff; }
.pill-icu{ background: rgba(58,160,255,0.14); color: #1b6bff; }
.pill-training{ background: rgba(255,154,61,0.18); color: #c25500; }
.pill-leave{ background: rgba(148,163,184,0.22); color: rgba(50,60,85,0.85); }
.pill-phys{ background: rgba(124,58,237,0.12); color: rgba(80,30,170,0.95); }

.muted-strong{
  font-weight: 900;
  color: rgba(50,60,85,0.78);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions{
  display:flex;
  justify-content:flex-end;
  gap: 8px;
}
.btn-sm{
  height: 30px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid rgba(47,86,255,0.25);
  background: rgba(255,255,255,0.65);
  font-weight: 900;
  font-size: 12px;
  cursor:pointer;
  color: rgba(30,40,70,0.92);
}
.btn-sm.primary{
  background: linear-gradient(135deg, rgba(79,119,255,0.95), rgba(47,86,255,0.95));
  border-color: rgba(47,86,255,0.35);
  color: white;
}
.dd-like{ padding: 0 10px; gap: 8px; display:inline-flex; align-items:center; justify-self: end; min-width: 110px; }

.empty{
  text-align:center;
  padding: 18px;
  color: rgba(90,105,130,0.85);
  font-weight: 900;
}

/* table footer */
.table-foot{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 14px 14px;
}
.foot-left{
  color: rgba(90,105,130,0.85);
  font-weight: 800;
  font-size: 13px;
}
.foot-right{
  display:flex;
  align-items:center;
  gap: 10px;
  flex-wrap: wrap;
}
.pager{
  display:flex;
  align-items:center;
  gap: 6px;
}
.pg{
  height: 28px;
  min-width: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.55);
  font-weight: 900;
  color: rgba(30,40,70,0.85);
  cursor:pointer;
}
.pg:disabled{ opacity: .5; cursor:not-allowed; }
.pg.active{
  background: rgba(47,86,255,0.14);
  border-color: rgba(47,86,255,0.30);
  color: #2f56ff;
}
.pg.dots{ cursor: default; }

/* Bottom grid */
.bottom-grid{
  margin-top: 14px;
  display:grid;
  grid-template-columns: 1.1fr 1fr 1fr;
  gap: 12px;
  align-items:start;
}
.note .panel-title{ padding: 0; }
.note-head{
  display:flex;
  align-items:center;
  gap: 12px;
  padding: 12px 14px;
}
.note-name{ font-weight: 900; }
.note-role{ font-size: 12px; font-weight: 800; color: rgba(90,105,130,0.75); margin-top: 2px; }
.note-msg{
  margin: 0;
  color: rgba(30,40,70,0.78);
  font-weight: 800;
  line-height: 1.35;
}
.linkish{
  margin-top: 10px;
  border: none;
  background: transparent;
  color: #2f56ff;
  font-weight: 900;
  cursor: pointer;
  display:flex;
  align-items:center;
  gap: 10px;
}

/* Upcoming / announcements lists */
.mini-list{ display:grid; gap: 10px; }
.mini-row{
  display: grid;
  grid-template-columns: 1fr 170px 130px; /* left | time | button */
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.45);
}
.mini-left{ display:flex; align-items:center; gap: 10px; min-width:0; }
.mini-meta{ min-width:0; }
.mini-title{ font-weight: 900; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mini-sub{ font-size: 12px; font-weight: 800; color: rgba(90,105,130,0.75); margin-top: 2px; }
.mini-right{ display:flex; align-items:center; gap: 10px; }
.mini-time{ font-size: 12px; font-weight: 900; color: rgba(60,70,95,0.70); white-space:nowrap; justify-self: end; text-align: right; }

.announce{ display:grid; gap: 10px; }
.an-row{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.45);
}
.an-left{ display:flex; gap: 10px; min-width:0; }
.an-ico{
  width: 34px; height: 34px;
  border-radius: 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  color: rgba(20,30,55,0.95);
  border: 1px solid rgba(0,0,0,0.06);
}
.an-ico.blue{ background: rgba(47,86,255,0.14); }
.an-ico.orange{ background: rgba(255,154,61,0.18); }
.an-title{ font-weight: 900; }
.an-sub{
  font-size: 12px;
  font-weight: 800;
  color: rgba(90,105,130,0.75);
  margin-top: 2px;
  max-width: 420px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.an-time{
  font-size: 12px;
  font-weight: 900;
  color: rgba(60,70,95,0.70);
  white-space: nowrap;
}

/* Row dim */
tr.dim td{ opacity: .75; }

/* Responsive */
@media (max-width: 1200px){
  .bottom-grid{ grid-template-columns: 1fr; }
}
@media (max-width: 1100px){
  .kpi-row{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px){
  .toolbar{ flex-direction: column; align-items: stretch; }
  .search-row{ width: 100%; max-width: unset; }
  .right{ justify-content: flex-end; }
  .actions{ justify-content:flex-start; }
  .c-nurse{ display:none; }
}
@media (max-width: 640px){
  .kpi-row{ grid-template-columns: 1fr; }
  .c-pa{ display:none; }
}
@media (max-width: 520px){
  .mini-row{
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .mini-time, .dd-like{ justify-self: start; text-align: left; }
}

</style>
