<template>
  <div class="pt">
    <!-- Header -->
    <div class="pt-head">
      <div>
        <h2 class="pt-title">Patients</h2>
        <div class="pt-sub">
          <span class="pt-sub-strong">Patient Management</span>
          <span class="pt-sub-sep">›</span>
          <span>View and manage patients in your unit.</span>
        </div>
      </div>
    </div>

    <!-- Panel (Tasks-style) -->
    <section class="pt-panel">
      <!-- Filters -->
      <div class="pt-filters">
        <div class="pt-search">
          <span class="pt-search-ico">⌕</span>
          <input v-model="q" type="text" placeholder="Search patient..." />
        </div>

        <div class="pt-dd">
          <select v-model="unitFilter">
            <option value="all">All Units</option>
            <option value="ICU">ICU</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Rehab">Rehab</option>
          </select>
          <span class="pt-dd-ico">▾</span>
        </div>

        <div class="pt-dd">
          <select v-model="statusFilter">
            <option value="all">All Statuses</option>
            <option value="Admitted">Admitted</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Discharged">Discharged</option>
          </select>
          <span class="pt-dd-ico">▾</span>
        </div>

        <div class="pt-dd">
          <select v-model="conditionFilter">
            <option value="all">All Conditions</option>
            <option value="Recovering">Recovering</option>
            <option value="Pneumonia">Pneumonia</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Stable">Stable</option>
            <option value="Post-Surgery">Post-Surgery</option>
            <option value="Critical">Critical</option>
            <option value="Ready for Discharge">Ready for Discharge</option>
          </select>
          <span class="pt-dd-ico">▾</span>
        </div>

        <div class="pt-spacer"></div>

        <button class="pt-new" type="button" @click="addPatient">
          + Add New Patient
        </button>
      </div>

      <!-- Table -->
      <div class="pt-table-wrap">
        <table class="pt-table">
          <colgroup>
            <col style="width: 44px" />
            <col style="width: 520px" />
            <col style="width: 140px" />
            <col style="width: 220px" />
            <col style="width: 200px" />
          </colgroup>

          <thead>
            <tr>
              <!-- ✅ Select-all (Tasks style) -->
              <th class="pt-th-check">
                <label class="pt-check">
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
                <button class="pt-th" type="button" @click="toggleSort('name')">
                  Name <span class="pt-th-ico">▾</span>
                </button>
              </th>

              <th>
                <button class="pt-th" type="button" @click="toggleSort('room')">
                  Room <span class="pt-th-ico">▾</span>
                </button>
              </th>

              <th>
                <button class="pt-th" type="button" @click="toggleSort('condition')">
                  Condition <span class="pt-th-ico">▾</span>
                </button>
              </th>

              <th class="pt-th-actions">
                <button class="pt-th" type="button">
                  Actions <span class="pt-th-ico">▾</span>
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in pagedRows" :key="row.id">
              <!-- Row select checkbox -->
              <td class="pt-td-check">
                <label class="pt-check">
                  <input
                    type="checkbox"
                    :checked="selected.has(row.id)"
                    @change="toggleRow(row.id)"
                  />
                  <span></span>
                </label>
              </td>

              <!-- Name cell -->
              <td>
                <div class="pt-namecell">
                  <img class="pt-avatar" :src="row.avatar" alt="" />
                  <div class="pt-name-meta">
                    <div class="pt-name-line">
                      <span class="pt-name">{{ row.name }}</span>
                      <span class="pt-id">ID {{ row.pid }}</span>
                    </div>
                    <div class="pt-subline">{{ row.note }}</div>
                  </div>
                </div>
              </td>

              <!-- Room -->
              <td class="pt-room">
                {{ row.room }}
                <span v-if="row.unit === 'ICU'" class="pt-tag icu">ICU</span>
              </td>

              <!-- Condition (Tasks-style pill system) -->
              <td>
                <span class="pt-pill" :class="condClass(row.condition)">
                  <span v-if="row.condition === 'Critical'" class="pt-warn">▲</span>
                  {{ row.condition }}
                </span>
              </td>

              <!-- Actions (exact button style you required) -->
              <td class="pt-actions">
                <button class="pt-act" type="button" @click="viewPatient(row)">
                  View
                </button>

                <button class="pt-act" type="button" @click="openChart(row)">
                  Chart
                </button>
              </td>


            </tr>

            <tr v-if="!pagedRows.length">
              <td colspan="5" class="pt-empty">No patients found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer (Tasks-style) -->
      <div class="pt-footer">
        <div class="pt-foot-left">
          Showing {{ startRow }} to {{ endRow }} of {{ filteredRows.length }} patients.
        </div>

        <div class="pt-pager">
          <button class="pt-pagebtn" type="button" :disabled="page === 1" @click="page--">
            ‹
          </button>

          <button
            v-for="btn in pageButtons"
            :key="btn.key"
            class="pt-pagebtn"
            type="button"
            :class="{ active: btn.num === page, dots: btn.dots }"
            :disabled="btn.dots"
            @click="!btn.dots && (page = btn.num)"
          >
            {{ btn.label }}
          </button>

          <button class="pt-pagebtn" type="button" :disabled="page === pageCount" @click="page++">
            ›
          </button>
        </div>

        <div class="pt-foot-right">
          <div class="pt-dd small">
            <select v-model.number="pageSize">
              <option :value="8">8 / page</option>
              <option :value="10">10 / page</option>
              <option :value="12">12 / page</option>
            </select>
            <span class="pt-dd-ico">▾</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from "vue";

/* filters */
const q = ref("");
const unitFilter = ref("all");
const statusFilter = ref("all");
const conditionFilter = ref("all");

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
  {
    id: 1,
    name: "John Anderson.",
    pid: "48392",
    note: "Recovering after surgery",
    room: "102",
    unit: "Cardiology",
    status: "Admitted",
    condition: "Recovering",
    avatar: "https://i.pravatar.cc/64?img=12",
  },
  {
    id: 2,
    name: "Emily Johnson",
    pid: "47256",
    note: "Pneumonia",
    room: "202",
    unit: "Pediatrics",
    status: "Admitted",
    condition: "Pneumonia",
    avatar: "https://i.pravatar.cc/64?img=47",
  },
  {
    id: 3,
    name: "Mark Sanders",
    pid: "49518",
    note: "Critical",
    room: "305",
    unit: "ICU",
    status: "Monitoring",
    condition: "Critical",
    avatar: "https://i.pravatar.cc/64?img=15",
  },
  {
    id: 4,
    name: "Tina Nguyen",
    pid: "46875",
    note: "Monitoring",
    room: "210",
    unit: "Rehab",
    status: "Monitoring",
    condition: "Monitoring",
    avatar: "https://i.pravatar.cc/64?img=28",
  },
  {
    id: 5,
    name: "Charles Davis",
    pid: "48902",
    note: "Heart Failure",
    room: "103",
    unit: "Cardiology",
    status: "Monitoring",
    condition: "Stable",
    avatar: "https://i.pravatar.cc/64?img=22",
  },
  {
    id: 6,
    name: "Lisa Berry",
    pid: "47821",
    note: "Post-surgery recovery",
    room: "401",
    unit: "Rehab",
    status: "Admitted",
    condition: "Post-Surgery",
    avatar: "https://i.pravatar.cc/64?img=36",
  },
  {
    id: 7,
    name: "David Wilson",
    pid: "46250",
    note: "ICU",
    room: "205",
    unit: "ICU",
    status: "Monitoring",
    condition: "Critical",
    avatar: "https://i.pravatar.cc/64?img=51",
  },
  {
    id: 8,
    name: "Sarah Evans",
    pid: "47513",
    note: "Ready for discharge",
    room: "110",
    unit: "Pediatrics",
    status: "Discharged",
    condition: "Ready for Discharge",
    avatar: "https://i.pravatar.cc/64?img=8",
  },
  // a few more for paging
  {
    id: 9,
    name: "Noah Carter",
    pid: "49910",
    note: "Monitoring",
    room: "112",
    unit: "Cardiology",
    status: "Monitoring",
    condition: "Monitoring",
    avatar: "https://i.pravatar.cc/64?img=10",
  },
  {
    id: 10,
    name: "Ava Morgan",
    pid: "45521",
    note: "Recovering",
    room: "215",
    unit: "Rehab",
    status: "Admitted",
    condition: "Recovering",
    avatar: "https://i.pravatar.cc/64?img=13",
  },
]);

/* filtering */
const filteredRows = computed(() => {
  const term = q.value.trim().toLowerCase();

  return rows.value.filter((r) => {
    const matchesSearch =
      !term ||
      r.name.toLowerCase().includes(term) ||
      r.pid.toLowerCase().includes(term) ||
      r.note.toLowerCase().includes(term) ||
      r.room.toLowerCase().includes(term);

    const matchesUnit = unitFilter.value === "all" ? true : r.unit === unitFilter.value;
    const matchesStatus = statusFilter.value === "all" ? true : r.status === statusFilter.value;
    const matchesCond = conditionFilter.value === "all" ? true : r.condition === conditionFilter.value;

    return matchesSearch && matchesUnit && matchesStatus && matchesCond;
  });
});

/* sorting (Tasks-style simple) */
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
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
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

watch([q, unitFilter, statusFilter, conditionFilter, pageSize], () => {
  page.value = 1;
  selected.value = new Set();
});

/* selection helpers */
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

/* condition pill class (Tasks-style) */
function condClass(condition) {
  const c = String(condition || "").toLowerCase();
  if (c.includes("critical")) return "red";
  if (c.includes("pneumonia")) return "orange";
  if (c.includes("recover")) return "teal";
  if (c.includes("stable")) return "muted";
  if (c.includes("post")) return "orange";
  if (c.includes("monitor")) return "teal";
  if (c.includes("ready")) return "teal";
  return "muted";
}

/* UI actions */
function addPatient() {
  window.alert("Add New Patient (UI only)");
}
function viewPatient(row) {
  window.alert(`View: ${row.name} (UI only)`);
}
function openChart(row) {
  window.alert(`Chart: ${row.name} (UI only)`);
}

/* pager buttons (same logic you sent) */
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
    { key: "p-last", num: total, label: String(total), dots: false },
  ];
});
</script>

<style scoped>
.pt{ display:grid; gap:18px; min-width:0; }

/* header (copied language from Tasks) */
.pt-title{ margin:0; font-size:28px; font-weight:900; color:#2a3550; }
.pt-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.pt-sub-strong{ color:#2a3550; }
.pt-sub-sep{ opacity:.6; }

/* panel (copied from nt-panel) */
.pt-panel{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
}

/* filters (copied from nt-filters) */
.pt-filters{
  padding:14px 16px;
  display:flex;
  gap:12px;
  align-items:center;
  border-bottom:1px solid rgba(226,232,244,0.75);
}

.pt-search{
  flex:1 1 320px; min-width:240px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 12px;
  display:flex; gap:10px; align-items:center;
  color:#7486a6;
}
.pt-search input{
  width:100%;
  border:0;
  outline:0;
  background:transparent;
  font-weight:800;
  color:#2a3550;
}
.pt-search-ico{ font-weight:900; opacity:.75; }

.pt-dd{ position:relative; min-width:150px; }
.pt-dd.small{ min-width:120px; }
.pt-dd select{
  width:100%;
  appearance:none;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 38px 10px 12px;
  font-weight:900;
  color:#425574;
  outline:none;
}
.pt-dd-ico{
  position:absolute;
  right:12px;
  top:50%;
  transform:translateY(-50%);
  color:#7a8aa7;
  pointer-events:none;
}

.pt-spacer{ flex:1 1 auto; }

/* Add button (match nt-new feel) */
.pt-new{
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 14px;
  font-weight:900;
  color:#425574;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:10px;
}
.pt-new:hover{ background:rgba(255,255,255,0.75); }

/* table wrap */
.pt-table-wrap{ overflow:auto; }
.pt-table{ width:100%; border-collapse:collapse; table-layout:fixed; }

thead th{
  padding:12px;
  font-size:12px;
  color:#6b7a90;
  font-weight:900;
  text-align:left;
  border-bottom:1px solid rgba(226,232,244,0.75);
}
.pt-th{
  border:0;
  background:transparent;
  padding:0;
  color:inherit;
  font:inherit;
  font-weight:900;
  display:flex;
  gap:8px;
  align-items:center;
  cursor:pointer;
}
.pt-th-ico{ opacity:.8; }
/* .pt-th-actions{ text-align:right; } */

tbody td{
  padding:14px 12px;
  border-bottom:1px solid rgba(226,232,244,0.55);
  font-size:13px;
  color:#2a3550;
}
tbody tr:hover{ background:rgba(255,255,255,0.30); }
.pt-th-check, .pt-td-check{ padding-left:16px; }

/* checkbox ui (copied exactly from nt-check) */
.pt-check{ display:grid; place-items:center; }
.pt-check input{ display:none; }
.pt-check span{
  width:18px; height:18px;
  border-radius:6px;
  border:2px solid rgba(140,155,185,0.7);
  background:rgba(255,255,255,0.75);
  position:relative;
  display:grid;
  place-items:center;
}
.pt-check input:checked + span{
  background:rgba(45,118,214,0.18);
  border-color:rgba(45,118,214,0.55);
  box-shadow:0 0 0 4px rgba(45,118,214,0.10);
}
.pt-check input:checked + span::after{
  content:"";
  width:8px;
  height:4px;
  border-left:3px solid #1e5fb7;
  border-bottom:3px solid #1e5fb7;
  transform:rotate(-45deg);
}

/* name cell */
.pt-namecell{ display:flex; align-items:center; gap:12px; min-width:0; }
.pt-avatar{ width:38px; height:38px; border-radius:999px; object-fit:cover; }
.pt-name-meta{ min-width:0; }
.pt-name-line{ display:flex; align-items:baseline; gap:10px; min-width:0; }
.pt-name{ font-weight:900; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#2a3550; }
.pt-id{ font-weight:900; font-size:12px; color:#7a8aa7; white-space:nowrap; }
.pt-subline{ margin-top:6px; font-size:12px; color:#7a8aa7; font-weight:800; }

/* room */
.pt-room{ font-weight:900; color:#4b5f80; display:flex; align-items:center; gap:10px; }

/* tiny unit tag (Tasks tag styling language) */
.pt-tag{
  padding:5px 10px;
  border-radius:10px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  background:rgba(230,232,240,0.7);
  color:#51607a;
}
.pt-tag.icu{ background:rgba(203,196,255,0.55); color:#3a2f8f; }

/* condition pill (copied from nt-pill) */
.pt-pill{
  padding:6px 10px;
  border-radius:10px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
  display:inline-flex;
  align-items:center;
  gap:8px;
}
.pt-pill.orange{ background:rgba(255,170,85,0.55); color:#7a3a10; }
.pt-pill.red{ background:rgba(255,120,120,0.35); color:#7b1f1f; }
.pt-pill.teal{ background:rgba(100,190,200,0.35); color:#1f5a63; }
.pt-pill.muted{ background:rgba(230,232,240,0.7); color:#51607a; }
.pt-warn{ font-size:12px; opacity:.9; }

/* actions (EXACT button rules you required) */
.pt-actions{
  text-align:right;
  display:flex;
  justify-content:flex-end;
  gap: 10px;
  white-space: nowrap;
}
.pt-act{
  appearance:none;
  -webkit-appearance:none;

  height: 30px;
  min-width: 72px;
  padding: 0 14px;

  border-radius: 6px; /* ✅ more “square” than pill */
  border: 1px solid rgba(46, 95, 210, 0.55);

  background: linear-gradient(180deg, #4b78ff 0%, #2f62ea 100%);
  color: #ffffff;

  font-weight: 900;
  font-size: 13px;
  line-height: 1;

  cursor: pointer;
  box-shadow: 0 10px 18px rgba(45, 118, 214, 0.22);
}
.pt-act:hover{ filter: brightness(1.03);
  box-shadow: 0 12px 22px rgba(45, 118, 214, 0.28); 
}

.pt-act:active{
  transform: translateY(0.5px);
  box-shadow: 0 8px 16px rgba(45, 118, 214, 0.20);
}

/* empty */
.pt-empty{ text-align:center; padding:18px 12px; color:#6b7a90; font-weight:900; }

/* footer (copied from nt-footer/pager) */
.pt-footer{ padding:12px 16px; display:flex; align-items:center; gap:14px; }
.pt-foot-left{ color:#6b7a90; font-weight:800; font-size:12px; }
.pt-pager{ margin-left:auto; display:flex; gap:8px; align-items:center; }
.pt-pagebtn{
  min-width:34px; height:30px;
  border-radius:8px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  font-weight:900;
  color:#425574;
  cursor:pointer;
}
.pt-pagebtn.active{ background:rgba(45,118,214,0.18); border-color:rgba(45,118,214,0.35); color:#1e5fb7; }
.pt-pagebtn.dots{ cursor:default; }
.pt-pagebtn:disabled{ opacity:.5; cursor:not-allowed; }

/* responsive */
@media (max-width: 980px){
  .pt-filters{ flex-wrap:wrap; }
  .pt-spacer{ display:none; }
  .pt-new{ width:100%; justify-content:center; }
}
</style>
