<template>
  <div class="su">
    <!-- Header -->
    <div class="su-head">
      <div>
        <h2 class="su-title">Supplies</h2>
        <div class="su-sub">
          <span class="su-sub-strong">Supply Management</span>
          <span class="su-sub-sep">›</span>
          <span>Monitor and manage medical supplies in the unit.</span>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <section class="su-kpis">
      <div class="su-kpi blue">
        <div class="su-kpi-left">
          <div class="su-kpi-label">Total Items</div>
          <div class="su-kpi-ico">🛏</div>
        </div>
        <div class="su-kpi-value">{{ kpiTotal }}</div>
      </div>

      <div class="su-kpi teal">
        <div class="su-kpi-left">
          <div class="su-kpi-label">Low Stock</div>
          <div class="su-kpi-ico">☁</div>
        </div>
        <div class="su-kpi-value">{{ kpiLow }}</div>
      </div>

      <div class="su-kpi orange">
        <div class="su-kpi-left">
          <div class="su-kpi-label">Out of Stock</div>
          <div class="su-kpi-ico">☑</div>
        </div>
        <div class="su-kpi-value">{{ kpiOut }}</div>
      </div>

      <div class="su-kpi pink">
        <div class="su-kpi-left">
          <div class="su-kpi-label">Expiring Soon</div>
          <div class="su-kpi-ico">⚠</div>
        </div>
        <div class="su-kpi-value">{{ kpiExpiring }}</div>
      </div>
    </section>

    <!-- Main grid -->
    <section class="su-grid">
      <!-- LEFT -->
      <div class="su-left">
        <!-- Panel -->
        <section class="su-panel">
          <!-- Filters -->
          <div class="su-filters">
            <div class="su-search">
              <span class="su-search-ico">⌕</span>
              <input v-model="q" type="text" placeholder="Search..." />
            </div>

            <div class="su-dd">
              <select v-model="catFilter">
                <option value="all">All Categories</option>
                <option value="PPE">PPE</option>
                <option value="Medication">Medication</option>
                <option value="Equipment">Equipment</option>
                <option value="IV">IV Supplies</option>
                <option value="Wound Care">Wound Care</option>
              </select>
              <span class="su-dd-ico">▾</span>
            </div>

            <div class="su-dd">
              <select v-model="statusFilter">
                <option value="all">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Expiring Soon">Expiring Soon</option>
              </select>
              <span class="su-dd-ico">▾</span>
            </div>

            <div class="su-spacer"></div>

            <button class="su-new" type="button" @click="addItem">
              + Add New Item
            </button>
          </div>

          <!-- Table -->
          <div class="su-table-wrap">
            <table class="su-table">
              <colgroup>
                <col style="width: 44px" />
                <col style="width: 420px" />
                <col style="width: 170px" />
                <col style="width: 170px" />
                <col style="width: 150px" />
              </colgroup>

              <thead>
                <tr>
                  <th class="su-th-check">
                    <label class="su-check">
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
                    <button class="su-th" type="button" @click="toggleSort('name')">
                      Name <span class="su-th-ico">▾</span>
                    </button>
                  </th>

                  <th>
                    <button class="su-th" type="button" @click="toggleSort('category')">
                      Role <span class="su-th-ico">▾</span>
                    </button>
                  </th>

                  <th>
                    <button class="su-th" type="button" @click="toggleSort('dept')">
                      Department <span class="su-th-ico">▾</span>
                    </button>
                  </th>

                  <th class="su-th-actions">
                    <button class="su-th" type="button">
                      Status <span class="su-th-ico">▾</span>
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="row in pagedRows" :key="row.id">
                  <td class="su-td-check">
                    <label class="su-check">
                      <input type="checkbox" :checked="selected.has(row.id)" @change="toggleRow(row.id)" />
                      <span></span>
                    </label>
                  </td>

                  <td>
                    <div class="su-namecell">
                      <img class="su-avatar" :src="row.avatar" alt="" />
                      <div class="su-name-meta">
                        <div class="su-name-line">
                          <span class="su-name">{{ row.name }}</span>
                          <span class="su-id">{{ row.code }}</span>
                        </div>
                        <div class="su-subline">{{ row.note }}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span class="su-pill soft" :class="catClass(row.category)">
                      {{ row.category }}
                      <span v-if="row.badge" class="su-pill-badge">{{ row.badge }}</span>
                    </span>
                  </td>

                  <td>
                    <span class="su-pill dept">{{ row.dept }}</span>
                  </td>

                  <td class="su-status">
                    <button v-if="row.status === 'Message'" class="su-msg" type="button" @click="message(row)">
                      Message
                    </button>
                    <span v-else class="su-pill" :class="statusClass(row.status)">{{ row.status }}</span>
                  </td>
                </tr>

                <tr v-if="!pagedRows.length">
                  <td colspan="5" class="su-empty">No supplies found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div class="su-footer">
            <div class="su-foot-left">
              Showing {{ startRow }} to {{ endRow }} of {{ filteredRows.length }} items.
            </div>

            <div class="su-pager">
              <button class="su-pagebtn" type="button" :disabled="page === 1" @click="page--">‹</button>

              <button
                v-for="btn in pageButtons"
                :key="btn.key"
                class="su-pagebtn"
                type="button"
                :class="{ active: btn.num === page, dots: btn.dots }"
                :disabled="btn.dots"
                @click="!btn.dots && (page = btn.num)"
              >
                {{ btn.label }}
              </button>

              <button class="su-pagebtn" type="button" :disabled="page === pageCount" @click="page++">›</button>
            </div>

            <div class="su-foot-right">
              <div class="su-dd small">
                <select v-model.number="pageSize">
                  <option :value="8">8 / page</option>
                  <option :value="10">10 / page</option>
                  <option :value="12">12 / page</option>
                </select>
                <span class="su-dd-ico">▾</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Bottom banner -->
        <div class="su-banner">
          <div class="su-banner-left">
            <img class="su-avatar lg" :src="banner.avatar" alt="" />
            <div>
              <div class="su-banner-title">
                {{ banner.name }} <span class="muted">{{ banner.meta }}</span>
              </div>
              <div class="su-banner-text muted">
                {{ banner.text1 }}<br />
                {{ banner.text2 }}
              </div>
            </div>
          </div>

          <button class="su-banner-btn" type="button" @click="addItem">Add New Item</button>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="su-right">
        <div class="su-card">
          <div class="su-card-head">
            <div class="su-card-title">Department Stats:</div>
            <button class="su-x" type="button" aria-label="close">×</button>
          </div>

          <div class="su-card-body">
            <div class="su-stat"><span class="k">Registered Nurses:</span> <span class="v">ER</span></div>
            <div class="su-stat"><span class="k">Charge Nurses:</span> <span class="v">5</span></div>

            <div class="su-stat"><span class="k">Low Stock:</span> <span class="v">8</span></div>
            <div class="su-stat sub">IV Catheters expiring 16 May 2024</div>

            <div class="su-stat"><span class="k">Nurse Practitioners:</span> <span class="v">8</span></div>

            <div class="su-divider"></div>

            <div class="su-card-head slim">
              <div class="su-card-title">Staff on Shift</div>
              <button class="su-link" type="button" @click="viewAllShift">View All ›</button>
            </div>

            <div class="su-shift" v-for="s in shiftList" :key="s.id">
              <img class="su-mini-avatar" :src="s.avatar" alt="" />
              <div class="su-shift-main">
                <div class="su-shift-name">{{ s.name }}</div>
                <div class="su-shift-sub muted">{{ s.time }}</div>
              </div>
              <div class="su-shift-dept">{{ s.dept }}</div>
            </div>

            <div class="su-shift-foot">
              <button class="su-link" type="button" @click="viewSchedule">View Schedule</button>
              <span class="muted">+ 3 More</span>
            </div>
          </div>
        </div>

        <!-- note card -->
        <div class="su-note-card">
          <div class="su-note-top">
            <img class="su-avatar" :src="note.avatar" alt="" />
            <div>
              <div class="su-note-name">{{ note.name }}</div>
              <div class="muted">{{ note.role }}</div>
            </div>
          </div>

          <div class="su-note-text">{{ note.text }}</div>

          <button class="su-link wide" type="button" @click="manageRoles">Manage Roles ›</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from "vue";

/* filters */
const q = ref("");
const catFilter = ref("all");
const statusFilter = ref("all");

/* paging */
const page = ref(1);
const pageSize = ref(8);

/* sorting */
const sortKey = ref("name");
const sortDir = ref("asc");

/* selection */
const selected = ref(new Set());
const selectAllRef = ref(null);

/* rows (demo) */
const rows = ref([
  { id: 1, name: "Syringes (10ml)", code: "ID 22452", note: "General stock", category: "Equipment", badge: "", dept: "ER", status: "In Stock", avatar: "https://i.pravatar.cc/64?img=47" },
  { id: 2, name: "N95 Masks", code: "(3, 3961)", note: "Low stock", category: "PPE", badge: "2024", dept: "Cardiology", status: "Low Stock", avatar: "https://i.pravatar.cc/64?img=12" },
  { id: 3, name: "IV Catheters", code: "PA 33576", note: "Urgent restock needed", category: "IV", badge: "", dept: "ICU", status: "Out of Stock", avatar: "https://i.pravatar.cc/64?img=15" },
  { id: 4, name: "Gloves (Small)", code: "NP 46126", note: "Expiring soon", category: "PPE", badge: "May 2024", dept: "Pediatrics", status: "Expiring Soon", avatar: "https://i.pravatar.cc/64?img=28" },
  { id: 5, name: "Insulin Vials", code: "RN 39417", note: "Currently out of stock", category: "Medication", badge: "", dept: "Med-Surg", status: "Message", avatar: "https://i.pravatar.cc/64?img=22" },
  { id: 6, name: "Bandages", code: "RN 47529", note: "Restocked", category: "Wound Care", badge: "", dept: "ICU", status: "In Stock", avatar: "https://i.pravatar.cc/64?img=36" },
  { id: 7, name: "Oxygen Tubing", code: "ID 199628", note: "On order", category: "Equipment", badge: "", dept: "Pediatrics", status: "Message", avatar: "https://i.pravatar.cc/64?img=51" },
  { id: 8, name: "Saline Bags", code: "RN 34775", note: "Surges", category: "IV", badge: "100", dept: "ICU", status: "In Stock", avatar: "https://i.pravatar.cc/64?img=8" },
  { id: 9, name: "Surgical Tape", code: "RN 29215", note: "Low stock", category: "Wound Care", badge: "", dept: "ICU", status: "Low Stock", avatar: "https://i.pravatar.cc/64?img=10" },
]);

/* KPIs */
const kpiTotal = computed(() => rows.value.length);
const kpiLow = computed(() => rows.value.filter((r) => r.status === "Low Stock").length);
const kpiOut = computed(() => rows.value.filter((r) => r.status === "Out of Stock").length);
const kpiExpiring = computed(() => rows.value.filter((r) => r.status === "Expiring Soon").length);

/* filtering */
const filteredRows = computed(() => {
  const term = q.value.trim().toLowerCase();
  return rows.value.filter((r) => {
    const matchesSearch =
      !term ||
      r.name.toLowerCase().includes(term) ||
      r.note.toLowerCase().includes(term) ||
      r.dept.toLowerCase().includes(term) ||
      r.category.toLowerCase().includes(term);

    const matchesCat = catFilter.value === "all" ? true : r.category === catFilter.value;
    const matchesStatus = statusFilter.value === "all" ? true : r.status === statusFilter.value;

    return matchesSearch && matchesCat && matchesStatus;
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

watch([q, catFilter, statusFilter, pageSize], () => {
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
function catClass(cat) {
  const c = String(cat || "").toLowerCase();
  if (c.includes("ppe")) return "purple";
  if (c.includes("medication")) return "orange";
  if (c.includes("iv")) return "teal";
  if (c.includes("equipment")) return "muted";
  if (c.includes("wound")) return "blue";
  return "muted";
}
function statusClass(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("out")) return "red";
  if (s.includes("low")) return "orange";
  if (s.includes("expir")) return "pink";
  return "muted";
}

/* right content demo */
const shiftList = ref([
  { id: 1, name: "Kelly Miller, PA", time: "Today, 7 AM - 3 PM", dept: "ICU", avatar: "https://i.pravatar.cc/64?img=15" },
  { id: 2, name: "Dr. Emily Carter", time: "Today, 8 AM - 6 PM", dept: "Pediatrics", avatar: "https://i.pravatar.cc/64?img=51" },
  { id: 3, name: "Dr. Jake Nelson, DNP", time: "Today, 8 AM - 6 PM", dept: "Cardiology", avatar: "https://i.pravatar.cc/64?img=12" },
]);

const note = ref({
  name: "David Patel, RN",
  role: "in Training",
  text: "Insulin vials are currently out of stock. Restock has been placed for urgent delivery.",
  avatar: "https://i.pravatar.cc/64?img=22",
});

const banner = ref({
  name: "David Patel, RN",
  meta: "S 136",
  text1: "Insulin vials are currently out of stock.",
  text2: "Restock has been placed for urgent delivery.",
  avatar: "https://i.pravatar.cc/96?img=22",
});

/* UI actions */
function addItem(){ window.alert("Add New Item (UI only)"); }
function message(row){ window.alert(`Message: ${row.name} (UI only)`); }
function viewAllShift(){ window.alert("View All (UI only)"); }
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
/* identical styling to Staff, just "su" prefix */
.su{ display:grid; gap:18px; min-width:0; }
.su-title{ margin:0; font-size:28px; font-weight:900; color:#2a3550; }
.su-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.su-sub-strong{ color:#2a3550; }
.su-sub-sep{ opacity:.6; }
.muted{ color:#7a8aa7; }

/* kpis */
.su-kpis{ display:grid; grid-template-columns:repeat(4, minmax(240px, 1fr)); gap:16px; }
.su-kpi{
  border-radius:12px; padding:14px 16px; color:#fff; display:flex; justify-content:space-between; align-items:center;
  box-shadow:0 14px 26px rgba(34,50,74,0.14); border:1px solid rgba(255,255,255,0.25); min-width:0;
}
.su-kpi-label{ font-weight:900; font-size:14px; }
.su-kpi-value{ font-size:42px; font-weight:900; line-height:1; }
.su-kpi.blue{ background:linear-gradient(90deg,#356ee6,#5c8cf5); }
.su-kpi.teal{ background:linear-gradient(90deg,#2f9aa2,#4fc1cb); }
.su-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.su-kpi.pink{ background:linear-gradient(90deg,#ff4d6d,#ff7d87); }

/* grid */
.su-grid{ display:grid; grid-template-columns: 1.75fr 0.95fr; gap:16px; align-items:start; }
.su-left{ display:grid; gap:16px; min-width:0; }
.su-right{ display:grid; gap:16px; min-width:0; }

/* panel */
.su-panel{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
}

/* filters */
.su-filters{ padding:14px 16px; display:flex; gap:12px; align-items:center; border-bottom:1px solid rgba(226,232,244,0.75); }
.su-search{
  flex:1 1 320px; min-width:240px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 12px;
  display:flex; gap:10px; align-items:center;
  color:#7486a6;
}
.su-search input{ width:100%; border:0; outline:0; background:transparent; font-weight:800; color:#2a3550; }
.su-dd{ position:relative; min-width:170px; }
.su-dd.small{ min-width:120px; }
.su-dd select{
  width:100%; appearance:none;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 38px 10px 12px;
  font-weight:900; color:#425574; outline:none;
}
.su-dd-ico{ position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#7a8aa7; pointer-events:none; }
.su-spacer{ flex:1 1 auto; }
.su-new{
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 14px;
  font-weight:900; color:#425574;
  cursor:pointer;
}
.su-new:hover{ background:rgba(255,255,255,0.75); }

/* table */
.su-table-wrap{ overflow:auto; }
.su-table{ width:100%; border-collapse:collapse; table-layout:fixed; }
thead th{ padding:12px; font-size:12px; color:#6b7a90; font-weight:900; text-align:left; border-bottom:1px solid rgba(226,232,244,0.75); }
.su-th{ border:0; background:transparent; padding:0; color:inherit; font:inherit; font-weight:900; display:flex; gap:8px; align-items:center; cursor:pointer; }
.su-th-actions{ text-align:right; }
tbody td{ padding:14px 12px; border-bottom:1px solid rgba(226,232,244,0.55); font-size:13px; color:#2a3550; }
tbody tr:hover{ background:rgba(255,255,255,0.30); }
.su-th-check, .su-td-check{ padding-left:16px; }

/* checkbox */
.su-check{ display:grid; place-items:center; }
.su-check input{ display:none; }
.su-check span{
  width:18px; height:18px;
  border-radius:6px;
  border:2px solid rgba(140,155,185,0.7);
  background:rgba(255,255,255,0.75);
  position:relative;
  display:grid; place-items:center;
}
.su-check input:checked + span{
  background:rgba(45,118,214,0.18);
  border-color:rgba(45,118,214,0.55);
  box-shadow:0 0 0 4px rgba(45,118,214,0.10);
}
.su-check input:checked + span::after{
  content:"";
  width:8px; height:4px;
  border-left:3px solid #1e5fb7;
  border-bottom:3px solid #1e5fb7;
  transform:rotate(-45deg);
}

/* name cell */
.su-namecell{ display:flex; align-items:center; gap:12px; min-width:0; }
.su-avatar{ width:38px; height:38px; border-radius:999px; object-fit:cover; }
.su-avatar.lg{ width:46px; height:46px; }
.su-name-line{ display:flex; align-items:baseline; gap:10px; min-width:0; }
.su-name{ font-weight:900; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.su-id{ font-weight:900; font-size:12px; color:#7a8aa7; white-space:nowrap; }
.su-subline{ margin-top:6px; font-size:12px; color:#7a8aa7; font-weight:800; }

/* pills */
.su-pill{ padding:6px 10px; border-radius:10px; font-size:12px; font-weight:900; border:1px solid rgba(226,232,244,0.85); display:inline-flex; align-items:center; gap:8px; }
.su-pill.dept{ background:rgba(230,232,240,0.55); color:#51607a; }
.su-pill.soft.purple{ background:rgba(203,196,255,0.55); color:#3a2f8f; }
.su-pill.soft.orange{ background:rgba(255,170,85,0.45); color:#7a3a10; }
.su-pill.soft.teal{ background:rgba(150,220,225,0.35); color:#1f5a63; }
.su-pill.soft.blue{ background:rgba(185,205,255,0.45); color:#1e5fb7; }
.su-pill.soft.muted{ background:rgba(230,232,240,0.7); color:#51607a; }
.su-pill.red{ background:rgba(255,120,120,0.35); color:#7b1f1f; }
.su-pill.pink{ background:rgba(255,150,185,0.35); color:#7b1f4e; }
.su-pill.muted{ background:rgba(230,232,240,0.7); color:#51607a; }
.su-status{ text-align:right; }
.su-pill-badge{ opacity:.8; }

/* message button = same UI blue */
.su-msg{
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
.su-msg:hover{ filter: brightness(1.03); box-shadow: 0 12px 22px rgba(45,118,214,0.28); }

/* footer */
.su-footer{ padding:12px 16px; display:flex; align-items:center; gap:14px; }
.su-foot-left{ color:#6b7a90; font-weight:800; font-size:12px; }
.su-pager{ margin-left:auto; display:flex; gap:8px; align-items:center; }
.su-pagebtn{
  min-width:34px; height:30px;
  border-radius:8px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  font-weight:900;
  color:#425574;
  cursor:pointer;
}
.su-pagebtn.active{ background:rgba(45,118,214,0.18); border-color:rgba(45,118,214,0.35); color:#1e5fb7; }
.su-pagebtn.dots{ cursor:default; }
.su-pagebtn:disabled{ opacity:.5; cursor:not-allowed; }
.su-empty{ text-align:center; padding:18px 12px; color:#6b7a90; font-weight:900; }

/* right cards */
.su-card, .su-note-card, .su-banner{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
}
.su-card{ overflow:hidden; }
.su-card-head{ padding:12px 14px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(226,232,244,0.75); }
.su-card-head.slim{ border-bottom:0; padding:10px 0 6px; }
.su-card-body{ padding:12px 14px; }
.su-card-title{ font-weight:900; color:#2a3550; }
.su-x{ border:0; background:transparent; font-size:18px; font-weight:900; color:#7a8aa7; cursor:pointer; }

.su-stat{ display:flex; justify-content:space-between; font-weight:900; color:#425574; padding:8px 0; }
.su-stat .k{ color:#2a3550; }
.su-stat .v{ color:#51607a; }
.su-stat.sub{ justify-content:flex-start; color:#7a8aa7; font-weight:800; padding-top:0; }
.su-divider{ height:1px; background:rgba(226,232,244,0.75); margin:10px 0; }

.su-link{ border:0; background:transparent; cursor:pointer; font-weight:900; color:#2d76d6; }
.su-link:hover{ text-decoration:underline; }
.su-link.wide{ width:100%; text-align:right; margin-top: 10px; }

.su-shift{
  display:flex; align-items:center; gap:10px;
  padding:10px 10px;
  border-radius:12px;
  border:1px solid rgba(226,232,244,0.75);
  background:rgba(255,255,255,0.55);
  margin-top:10px;
}
.su-mini-avatar{ width:30px; height:30px; border-radius:999px; object-fit:cover; }
.su-shift-name{ font-weight:900; color:#2a3550; }
.su-shift-sub{ margin-top:6px; font-weight:800; font-size:12px; }
.su-shift-dept{ margin-left:auto; font-weight:900; color:#51607a; }
.su-shift-foot{ display:flex; justify-content:space-between; align-items:center; margin-top:10px; }

.su-note-card{ padding:14px; }
.su-note-top{ display:flex; align-items:center; gap:12px; }
.su-note-name{ font-weight:900; color:#2a3550; }
.su-note-text{ margin-top:10px; font-weight:800; color:#425574; line-height:1.45; }

/* banner */
.su-banner{ padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:14px; }
.su-banner-left{ display:flex; align-items:center; gap:12px; min-width:0; }
.su-banner-title{ font-weight:900; color:#2a3550; }
.su-banner-text{ margin-top:6px; font-weight:800; }
.su-banner-btn{
  border:1px solid rgba(145,185,165,0.95);
  background: rgba(184,219,201,0.70);
  color:#2c5b46;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 900;
  cursor:pointer;
  white-space: nowrap;
}
.su-banner-btn:hover{ background: rgba(184,219,201,0.85); }

/* responsive */
@media (max-width: 1400px){ .su-kpis{ grid-template-columns:repeat(2,1fr); } }
@media (max-width: 1100px){
  .su-grid{ grid-template-columns: 1fr; }
  .su-banner{ flex-direction: column; align-items: stretch; }
  .su-banner-btn{ width:100%; }
}
@media (max-width: 980px){
  .su-filters{ flex-wrap:wrap; }
  .su-spacer{ display:none; }
  .su-new{ width:100%; }
}
@media (max-width: 820px){
  .su-kpis{ grid-template-columns:1fr; }
  .su-title{ font-size:24px; }
}
</style>
