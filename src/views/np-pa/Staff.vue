<template>
  <div class="st">
    <!-- Header -->
    <div class="st-head">
      <div>
        <h2 class="st-title">Staff</h2>
        <div class="st-sub">
          <span class="st-sub-strong">Staff Management</span>
          <span class="st-sub-sep">›</span>
          <span>View and manage staff in your unit.</span>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <section class="st-kpis">
      <div class="st-kpi blue">
        <div class="st-kpi-left">
          <div class="st-kpi-label">Total Staff</div>
          <div class="st-kpi-ico">🛏</div>
        </div>
        <div class="st-kpi-value">{{ kpiTotal }}</div>
      </div>

      <div class="st-kpi teal">
        <div class="st-kpi-left">
          <div class="st-kpi-label">Registered Nurses</div>
          <div class="st-kpi-ico">👥</div>
        </div>
        <div class="st-kpi-value">{{ kpiRN }}</div>
      </div>

      <div class="st-kpi orange">
        <div class="st-kpi-left">
          <div class="st-kpi-label">Nurse Practitioners</div>
          <div class="st-kpi-ico">⏳</div>
        </div>
        <div class="st-kpi-value">{{ kpiNP }}</div>
      </div>

      <div class="st-kpi pink">
        <div class="st-kpi-left">
          <div class="st-kpi-label">Physicians</div>
          <div class="st-kpi-ico">🩺</div>
        </div>
        <div class="st-kpi-value">{{ kpiMD }}</div>
      </div>
    </section>

    <!-- Main grid -->
    <section class="st-grid">
      <!-- LEFT -->
      <div class="st-left">
        <!-- Panel -->
        <section class="st-panel">
          <!-- Filters -->
          <div class="st-filters">
            <div class="st-search">
              <span class="st-search-ico">⌕</span>
              <input v-model="q" type="text" placeholder="Search patient..." />
            </div>

            <div class="st-dd">
              <select v-model="roleFilter">
                <option value="all">All Roles</option>
                <option value="Head Nurse">Head Nurse</option>
                <option value="Charge Nurse">Charge Nurse</option>
                <option value="Registered Nurse">Registered Nurse</option>
                <option value="Nurse Practitioner">Nurse Practitioner</option>
                <option value="Physician Assistant">Physician Assistant</option>
                <option value="Physician">Physician</option>
              </select>
              <span class="st-dd-ico">▾</span>
            </div>

            <div class="st-dd">
              <select v-model="deptFilter">
                <option value="all">All Departments</option>
                <option value="ER">ER</option>
                <option value="ICU">ICU</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Med-Surg">Med-Surg</option>
              </select>
              <span class="st-dd-ico">▾</span>
            </div>

            <div class="st-spacer"></div>

            <button class="st-new" type="button" @click="addStaff">
              + Add New Staff
            </button>
          </div>

          <!-- Table -->
          <div class="st-table-wrap">
            <table class="st-table">
              <colgroup>
                <col style="width: 44px" />
                <col style="width: 420px" />
                <col style="width: 170px" />
                <col style="width: 170px" />
                <col style="width: 150px" />
              </colgroup>

              <thead>
                <tr>
                  <th class="st-th-check">
                    <label class="st-check">
                      <input
                        ref="selectAllRef"
                        type="checkbox"
                        :checked="isAllOnPageSelected"
                        @change="toggleAllOnPage"
                      />
                      <span></span>
                    </label>
                  </th>

                  <th>
                    <button class="st-th" type="button" @click="toggleSort('name')">
                      Name <span class="st-th-ico">▾</span>
                    </button>
                  </th>

                  <th>
                    <button class="st-th" type="button" @click="toggleSort('role')">
                      Role <span class="st-th-ico">▾</span>
                    </button>
                  </th>

                  <th>
                    <button class="st-th" type="button" @click="toggleSort('dept')">
                      Department <span class="st-th-ico">▾</span>
                    </button>
                  </th>

                  <th class="st-th-actions">
                    <button class="st-th" type="button">
                      Status <span class="st-th-ico">▾</span>
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="row in pagedRows" :key="row.id">
                  <td class="st-td-check">
                    <label class="st-check">
                      <input type="checkbox" :checked="selected.has(row.id)" @change="toggleRow(row.id)" />
                      <span></span>
                    </label>
                  </td>

                  <td>
                    <div class="st-namecell">
                      <img class="st-avatar" :src="row.avatar" alt="" />
                      <div class="st-name-meta">
                        <div class="st-name-line">
                          <span class="st-name">{{ row.name }}</span>
                          <span class="st-id">ID {{ row.sid }}</span>
                        </div>
                        <div class="st-subline">{{ row.sub }}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span class="st-pill soft" :class="roleClass(row.role)">{{ row.role }}</span>
                  </td>

                  <td>
                    <span class="st-pill dept">{{ row.dept }}</span>
                  </td>

                  <td class="st-status">
                    <button
                      v-if="row.status === 'Message'"
                      class="st-msg"
                      type="button"
                      @click="message(row)"
                    >
                      Message
                    </button>

                    <span v-else class="st-pill" :class="statusClass(row.status)">
                      {{ row.status }}
                    </span>
                  </td>
                </tr>

                <tr v-if="!pagedRows.length">
                  <td colspan="5" class="st-empty">No staff found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div class="st-footer">
            <div class="st-foot-left">
              Showing {{ startRow }} to {{ endRow }} of {{ filteredRows.length }} staff.
            </div>

            <div class="st-pager">
              <button class="st-pagebtn" type="button" :disabled="page === 1" @click="page--">‹</button>

              <button
                v-for="btn in pageButtons"
                :key="btn.key"
                class="st-pagebtn"
                type="button"
                :class="{ active: btn.num === page, dots: btn.dots }"
                :disabled="btn.dots"
                @click="!btn.dots && (page = btn.num)"
              >
                {{ btn.label }}
              </button>

              <button class="st-pagebtn" type="button" :disabled="page === pageCount" @click="page++">›</button>
            </div>

            <div class="st-foot-right">
              <div class="st-dd small">
                <select v-model.number="pageSize">
                  <option :value="8">8 / page</option>
                  <option :value="10">10 / page</option>
                  <option :value="12">12 / page</option>
                </select>
                <span class="st-dd-ico">▾</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Bottom banner -->
        <div class="st-banner">
          <div class="st-banner-left">
            <img class="st-avatar lg" :src="banner.avatar" alt="" />
            <div>
              <div class="st-banner-title">
                {{ banner.name }} <span class="muted">{{ banner.meta }}</span>
              </div>
              <div class="st-banner-text muted">
                {{ banner.text1 }}<br />
                {{ banner.text2 }}
              </div>
            </div>
          </div>

          <button class="st-banner-btn" type="button" @click="addStaff">Add New Staff</button>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="st-right">
        <div class="st-card">
          <div class="st-card-head">
            <div class="st-card-title">Department Stats:</div>
            <button class="st-x" type="button" aria-label="close">×</button>
          </div>

          <div class="st-card-body">
            <div class="st-stat"><span class="k">Registered Nurses:</span> <span class="v">ER</span></div>
            <div class="st-stat"><span class="k">Charge Nurses:</span> <span class="v">5</span></div>
            <div class="st-stat"><span class="k">Staffs:</span> <span class="v">3</span></div>
            <div class="st-stat sub">Physician Assistant</div>
            <div class="st-stat"><span class="k">Nurse Practitioners:</span> <span class="v">8</span></div>

            <div class="st-divider"></div>

            <div class="st-card-head slim">
              <div class="st-card-title">Staff on Shift</div>
              <button class="st-link" type="button" @click="viewAllShift">View All ›</button>
            </div>

            <div class="st-shift" v-for="s in shiftList" :key="s.id">
              <img class="st-mini-avatar" :src="s.avatar" alt="" />
              <div class="st-shift-main">
                <div class="st-shift-name">{{ s.name }}</div>
                <div class="st-shift-sub muted">{{ s.time }}</div>
              </div>
              <div class="st-shift-dept">{{ s.dept }}</div>
            </div>

            <div class="st-shift-foot">
              <button class="st-link" type="button" @click="viewSchedule">View Schedule</button>
              <span class="muted">+ 3 More</span>
            </div>
          </div>
        </div>

        <!-- left-note style card from UI bottom-left -->
        <div class="st-note-card">
          <div class="st-note-top">
            <img class="st-avatar" :src="note.avatar" alt="" />
            <div>
              <div class="st-note-name">{{ note.name }}</div>
              <div class="muted">{{ note.role }}</div>
            </div>
          </div>

          <div class="st-note-text">
            {{ note.text }}
          </div>

          <button class="st-link wide" type="button" @click="manageRoles">Manage Roles ›</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from "vue";

/* filters */
const q = ref("");
const roleFilter = ref("all");
const deptFilter = ref("all");

/* paging */
const page = ref(1);
const pageSize = ref(8);

/* sorting */
const sortKey = ref("name");
const sortDir = ref("asc");

/* selection */
const selected = ref(new Set());
const selectAllRef = ref(null);

/* rows (UI demo) */
const rows = ref([
  { id: 1, name: "Sarah Thompson", sid: "42452", sub: "Head Nurse / After Surgery", role: "Head Nurse", dept: "ER", status: "Active", avatar: "https://i.pravatar.cc/64?img=47" },
  { id: 2, name: "Dr. Jake Nelson, DNP", sid: "24981", sub: "Nurse Practitioner / DNP", role: "Nurse Practitioner", dept: "Cardiology", status: "On Shift", avatar: "https://i.pravatar.cc/64?img=12" },
  { id: 3, name: "Kelly Miller, PA", sid: "33578", sub: "Physician Assistant", role: "Physician Assistant", dept: "ICU", status: "Message", avatar: "https://i.pravatar.cc/64?img=15" },
  { id: 4, name: "Hannah Stevens, NP", sid: "46123", sub: "Nurse Practitioner", role: "Nurse Practitioner", dept: "Pediatrics", status: "Message", avatar: "https://i.pravatar.cc/64?img=28" },
  { id: 5, name: "David Patel, RN", sid: "39417", sub: "Ready for (…)", role: "Registered Nurse", dept: "Med-Surg", status: "On Leave", avatar: "https://i.pravatar.cc/64?img=22" },
  { id: 6, name: "Rachel Greene, RN", sid: "47529", sub: "Registered Nurse", role: "Registered Nurse", dept: "ICU", status: "Active", avatar: "https://i.pravatar.cc/64?img=36" },
  { id: 7, name: "Dr. Emily Carter", sid: "198828", sub: "Physician (MD)", role: "Physician", dept: "Pediatrics", status: "Message", avatar: "https://i.pravatar.cc/64?img=51" },
  { id: 8, name: "Sophia Torres, RN", sid: "34775", sub: "Sophie Precharge", role: "Registered Nurse", dept: "ICU", status: "Active", avatar: "https://i.pravatar.cc/64?img=8" },
  { id: 9, name: "Aaron Patel, NP", sid: "29215", sub: "In training", role: "Nurse Practitioner", dept: "ICU", status: "Message", avatar: "https://i.pravatar.cc/64?img=10" },
]);

/* KPI derived */
const kpiTotal = computed(() => rows.value.length);
const kpiRN = computed(() => rows.value.filter((r) => r.role === "Registered Nurse").length);
const kpiNP = computed(() => rows.value.filter((r) => r.role === "Nurse Practitioner").length);
const kpiMD = computed(() => rows.value.filter((r) => r.role === "Physician").length);

/* filtering */
const filteredRows = computed(() => {
  const term = q.value.trim().toLowerCase();

  return rows.value.filter((r) => {
    const matchesSearch =
      !term ||
      r.name.toLowerCase().includes(term) ||
      r.sub.toLowerCase().includes(term) ||
      r.dept.toLowerCase().includes(term) ||
      r.role.toLowerCase().includes(term);

    const matchesRole = roleFilter.value === "all" ? true : r.role === roleFilter.value;
    const matchesDept = deptFilter.value === "all" ? true : r.dept === deptFilter.value;

    return matchesSearch && matchesRole && matchesDept;
  });
});

/* sorting */
const sortedRows = computed(() => {
  const list = filteredRows.value.slice();
  const dir = sortDir.value === "asc" ? 1 : -1;

  list.sort((a, b) => {
    const av = String(a[sortKey.value] ?? "").toLowerCase();
    const bv = String(b[sortKey.value] ?? "").toLowerCase();
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  return list;
});

function toggleSort(key) {
  if (sortKey.value === key) sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
}

/* paging */
const pageCount = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value)));
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return sortedRows.value.slice(start, start + pageSize.value);
});
const startRow = computed(() => (sortedRows.value.length ? (page.value - 1) * pageSize.value + 1 : 0));
const endRow = computed(() => Math.min(page.value * pageSize.value, sortedRows.value.length));

watch([q, roleFilter, deptFilter, pageSize], () => {
  page.value = 1;
  selected.value = new Set();
});

/* selection */
const isAllOnPageSelected = computed(() => {
  const ids = pagedRows.value.map((r) => r.id);
  return ids.length > 0 && ids.every((id) => selected.value.has(id));
});
const isSomeOnPageSelected = computed(() => {
  const ids = pagedRows.value.map((r) => r.id);
  const any = ids.some((id) => selected.value.has(id));
  return any && !isAllOnPageSelected.value;
});
watchEffect(() => {
  if (selectAllRef.value) selectAllRef.value.indeterminate = isSomeOnPageSelected.value;
});

function toggleAllOnPage() {
  const ids = pagedRows.value.map((r) => r.id);
  const next = new Set(selected.value);
  if (ids.every((id) => next.has(id))) ids.forEach((id) => next.delete(id));
  else ids.forEach((id) => next.add(id));
  selected.value = next;
}
function toggleRow(id) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
}

/* pills */
function roleClass(role) {
  const r = String(role || "").toLowerCase();
  if (r.includes("head")) return "blue";
  if (r.includes("physician assistant")) return "purple";
  if (r.includes("nurse practitioner")) return "teal";
  if (r.includes("registered")) return "muted";
  if (r.includes("physician")) return "orange";
  return "muted";
}
function statusClass(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("leave")) return "orange";
  if (s.includes("shift")) return "teal";
  if (s.includes("active")) return "muted";
  return "muted";
}

/* right card demo */
const shiftList = ref([
  { id: 1, name: "Kelly Miller, PA", time: "Today, 7 AM - 3 PM", dept: "ICU", avatar: "https://i.pravatar.cc/64?img=15" },
  { id: 2, name: "Dr. Emily Carter", time: "Today, 8 AM - 6 PM", dept: "Pediatrics", avatar: "https://i.pravatar.cc/64?img=51" },
  { id: 3, name: "Dr. Jake Nelson, DNP", time: "Today, 8 AM - 6 PM", dept: "Cardiology", avatar: "https://i.pravatar.cc/64?img=12" },
]);

const note = ref({
  name: "David Patel, RN",
  role: "in Training",
  text: "David Patel is currently on leave. Expected to return to Med-Surg by May 15, 2024.",
  avatar: "https://i.pravatar.cc/64?img=22",
});

const banner = ref({
  name: "David Patel, RN",
  meta: "B 306",
  text1: "David Patel is currently on leave.",
  text2: "Expected to return to Med-Surg by May 15, 2024.",
  avatar: "https://i.pravatar.cc/96?img=22",
});

/* actions (UI only) */
function addStaff(){ window.alert("Add New Staff (UI only)"); }
function message(row){ window.alert(`Message: ${row.name} (UI only)`); }
function viewAllShift(){ window.alert("View All Staff on Shift (UI only)"); }
function viewSchedule(){ window.alert("View Schedule (UI only)"); }
function manageRoles(){ window.alert("Manage Roles (UI only)"); }

/* pager buttons */
const pageButtons = computed(() => {
  const total = pageCount.value;
  if (total <= 4) {
    return Array.from({ length: total }, (_, i) => ({
      key: `p-${i + 1}`,
      num: i + 1,
      label: String(i + 1),
      dots: false,
    }));
  }
  return [
    { key: "p-1", num: 1, label: "1", dots: false },
    { key: "p-2", num: 2, label: "2", dots: false },
    { key: "p-3", num: 3, label: "3", dots: false },
    { key: "dots", dots: true, label: "…" },
    { key: `p-last`, num: total, label: String(total), dots: false },
  ];
});
</script>

<style scoped>
.st{ display:grid; gap:18px; min-width:0; }

/* header */
.st-title{ margin:0; font-size:28px; font-weight:900; color:#2a3550; }
.st-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.st-sub-strong{ color:#2a3550; }
.st-sub-sep{ opacity:.6; }
.muted{ color:#7a8aa7; }

/* kpis */
.st-kpis{ display:grid; grid-template-columns:repeat(4, minmax(240px, 1fr)); gap:16px; }
.st-kpi{
  border-radius:12px; padding:14px 16px; color:#fff; display:flex; justify-content:space-between; align-items:center;
  box-shadow:0 14px 26px rgba(34,50,74,0.14); border:1px solid rgba(255,255,255,0.25); min-width:0;
}
.st-kpi-left{ min-width:0; }
.st-kpi-label{ font-weight:900; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.st-kpi-ico{ margin-top:6px; opacity:.95; }
.st-kpi-value{ font-size:42px; font-weight:900; line-height:1; }
.st-kpi.blue{ background:linear-gradient(90deg,#356ee6,#5c8cf5); }
.st-kpi.teal{ background:linear-gradient(90deg,#2f9aa2,#4fc1cb); }
.st-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.st-kpi.pink{ background:linear-gradient(90deg,#ff4d6d,#ff7d87); }

/* grid */
.st-grid{ display:grid; grid-template-columns: 1.75fr 0.95fr; gap:16px; align-items:start; }
.st-left{ display:grid; gap:16px; min-width:0; }
.st-right{ display:grid; gap:16px; min-width:0; }

/* panel */
.st-panel{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
}

/* filters */
.st-filters{
  padding:14px 16px;
  display:flex;
  gap:12px;
  align-items:center;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.st-search{
  flex:1 1 320px; min-width:240px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 12px;
  display:flex; gap:10px; align-items:center;
  color:#7486a6;
}
.st-search input{ width:100%; border:0; outline:0; background:transparent; font-weight:800; color:#2a3550; }
.st-search-ico{ font-weight:900; opacity:.75; }

.st-dd{ position:relative; min-width:170px; }
.st-dd.small{ min-width:120px; }
.st-dd select{
  width:100%; appearance:none;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 38px 10px 12px;
  font-weight:900; color:#425574; outline:none;
}
.st-dd-ico{ position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#7a8aa7; pointer-events:none; }
.st-spacer{ flex:1 1 auto; }

.st-new{
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 14px;
  font-weight:900; color:#425574;
  cursor:pointer;
}
.st-new:hover{ background:rgba(255,255,255,0.75); }

/* table */
.st-table-wrap{ overflow:auto; }
.st-table{ width:100%; border-collapse:collapse; table-layout:fixed; }
thead th{
  padding:12px; font-size:12px; color:#6b7a90; font-weight:900; text-align:left;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.st-th{ border:0; background:transparent; padding:0; color:inherit; font:inherit; font-weight:900; display:flex; gap:8px; align-items:center; cursor:pointer; }
.st-th-ico{ opacity:.8; }
.st-th-actions{ text-align:right; }

tbody td{ padding:14px 12px; border-bottom:1px solid rgba(226,232,244,0.55); font-size:13px; color:#2a3550; }
tbody tr:hover{ background:rgba(255,255,255,0.30); }
.st-th-check, .st-td-check{ padding-left:16px; }

/* checkbox */
.st-check{ display:grid; place-items:center; }
.st-check input{ display:none; }
.st-check span{
  width:18px; height:18px;
  border-radius:6px;
  border:2px solid rgba(140,155,185,0.7);
  background:rgba(255,255,255,0.75);
  position:relative;
  display:grid;
  place-items:center;
}
.st-check input:checked + span{
  background:rgba(45,118,214,0.18);
  border-color:rgba(45,118,214,0.55);
  box-shadow:0 0 0 4px rgba(45,118,214,0.10);
}
.st-check input:checked + span::after{
  content:"";
  width:8px;
  height:4px;
  border-left:3px solid #1e5fb7;
  border-bottom:3px solid #1e5fb7;
  transform:rotate(-45deg);
}

/* name cell */
.st-namecell{ display:flex; align-items:center; gap:12px; min-width:0; }
.st-avatar{ width:38px; height:38px; border-radius:999px; object-fit:cover; }
.st-avatar.lg{ width:46px; height:46px; }
.st-name-meta{ min-width:0; }
.st-name-line{ display:flex; align-items:baseline; gap:10px; min-width:0; }
.st-name{ font-weight:900; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.st-id{ font-weight:900; font-size:12px; color:#7a8aa7; white-space:nowrap; }
.st-subline{ margin-top:6px; font-size:12px; color:#7a8aa7; font-weight:800; }

/* pills */
.st-pill{
  padding:6px 10px;
  border-radius:10px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  display:inline-flex;
}
.st-pill.soft.blue{ background:rgba(185,205,255,0.45); color:#1e5fb7; }
.st-pill.soft.teal{ background:rgba(150,220,225,0.35); color:#1f5a63; }
.st-pill.soft.purple{ background:rgba(203,196,255,0.55); color:#3a2f8f; }
.st-pill.soft.orange{ background:rgba(255,170,85,0.45); color:#7a3a10; }
.st-pill.soft.muted{ background:rgba(230,232,240,0.7); color:#51607a; }
.st-pill.dept{ background:rgba(230,232,240,0.55); color:#51607a; }

.st-pill.orange{ background:rgba(255,170,85,0.55); color:#7a3a10; }
.st-pill.teal{ background:rgba(100,190,200,0.35); color:#1f5a63; }
.st-pill.muted{ background:rgba(230,232,240,0.7); color:#51607a; }

/* status */
.st-status{ text-align:right; }

/* ✅ original UI: "Message" blue button */
.st-msg{
  appearance:none; -webkit-appearance:none;
  height: 30px;
  min-width: 88px;
  padding: 0 14px;
  border-radius: 6px;
  border: 1px solid rgba(46, 95, 210, 0.55);
  background: linear-gradient(180deg, #4b78ff 0%, #2f62ea 100%);
  color:#fff;
  font-weight:900;
  font-size:13px;
  cursor:pointer;
  box-shadow: 0 10px 18px rgba(45,118,214,0.22);
}
.st-msg:hover{ filter: brightness(1.03); box-shadow: 0 12px 22px rgba(45,118,214,0.28); }

/* footer */
.st-footer{ padding:12px 16px; display:flex; align-items:center; gap:14px; }
.st-foot-left{ color:#6b7a90; font-weight:800; font-size:12px; }
.st-pager{ margin-left:auto; display:flex; gap:8px; align-items:center; }
.st-pagebtn{
  min-width:34px; height:30px;
  border-radius:8px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  font-weight:900;
  color:#425574;
  cursor:pointer;
}
.st-pagebtn.active{ background:rgba(45,118,214,0.18); border-color:rgba(45,118,214,0.35); color:#1e5fb7; }
.st-pagebtn.dots{ cursor:default; }
.st-pagebtn:disabled{ opacity:.5; cursor:not-allowed; }
.st-empty{ text-align:center; padding:18px 12px; color:#6b7a90; font-weight:900; }

/* right card */
.st-card{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
}
.st-card-head{
  padding:12px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.st-card-head.slim{ border-bottom:0; padding:10px 0 6px; }
.st-card-title{ font-weight:900; color:#2a3550; }
.st-x{ border:0; background:transparent; font-size:18px; font-weight:900; color:#7a8aa7; cursor:pointer; }
.st-card-body{ padding:12px 14px; }
.st-stat{ display:flex; justify-content:space-between; font-weight:900; color:#425574; padding:8px 0; }
.st-stat .k{ color:#2a3550; }
.st-stat .v{ color:#51607a; }
.st-stat.sub{ justify-content:flex-start; color:#7a8aa7; font-weight:800; padding-top:0; }
.st-divider{ height:1px; background:rgba(226,232,244,0.75); margin:10px 0; }

.st-link{ border:0; background:transparent; cursor:pointer; font-weight:900; color:#2d76d6; }
.st-link:hover{ text-decoration:underline; }
.st-link.wide{ width:100%; text-align:right; margin-top: 10px; }

.st-shift{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
  margin-top:10px;
}
.st-mini-avatar{ width:30px; height:30px; border-radius:999px; object-fit:cover; }
.st-shift-main{ min-width:0; }
.st-shift-name{ font-weight:900; color:#2a3550; }
.st-shift-sub{ margin-top:6px; font-weight:800; font-size:12px; }
.st-shift-dept{ margin-left:auto; font-weight:900; color:#51607a; }
.st-shift-foot{ display:flex; justify-content:space-between; align-items:center; margin-top:10px; }

/* note card */
.st-note-card{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  padding:14px;
}
.st-note-top{ display:flex; align-items:center; gap:12px; }
.st-note-name{ font-weight:900; color:#2a3550; }
.st-note-text{ margin-top:10px; font-weight:800; color:#425574; line-height:1.45; }

/* banner */
.st-banner{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  padding:14px 16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
}
.st-banner-left{ display:flex; align-items:center; gap:12px; min-width:0; }
.st-banner-title{ font-weight:900; color:#2a3550; }
.st-banner-text{ margin-top:6px; font-weight:800; }

.st-banner-btn{
  border:1px solid rgba(145, 185, 165, 0.95);
  background: rgba(184, 219, 201, 0.70);
  color:#2c5b46;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 900;
  cursor:pointer;
  white-space: nowrap;
}
.st-banner-btn:hover{ background: rgba(184, 219, 201, 0.85); }

/* responsive */
@media (max-width: 1400px){ .st-kpis{ grid-template-columns:repeat(2,1fr); } }
@media (max-width: 1100px){
  .st-grid{ grid-template-columns: 1fr; }
  .st-banner{ flex-direction: column; align-items: stretch; }
  .st-banner-btn{ width:100%; }
}
@media (max-width: 980px){
  .st-filters{ flex-wrap:wrap; }
  .st-spacer{ display:none; }
  .st-new{ width:100%; justify-content:center; }
}
@media (max-width: 820px){
  .st-kpis{ grid-template-columns:1fr; }
  .st-title{ font-size:24px; }
}
</style>
