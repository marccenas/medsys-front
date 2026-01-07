<template>
  <div class="np">
    <!-- Header -->
    <div class="np-head">
      <div>
        <h2 class="np-title">Patients</h2>
        <div class="np-sub">
          <span class="np-sub-strong">Patient Overview</span>
          <span class="np-sub-sep">›</span>
          <span>Manage all assigned patients.</span>
        </div>
      </div>
    </div>

    <!-- KPI Row -->
    <section class="np-kpis">
      <div class="np-kpi blue">
        <div class="np-kpi-left">
          <div class="np-kpi-label">Total Patients</div>
          <div class="np-kpi-ico">
            <font-awesome-icon icon="hospital-user" />
          </div>
        </div>
        <div class="np-kpi-value">28</div>
      </div>

      <div class="np-kpi teal">
        <div class="np-kpi-left">
          <div class="np-kpi-label">ICU Patients</div>
          <div class="np-kpi-ico">
            <font-awesome-icon icon="heart" />
          </div>
        </div>
        <div class="np-kpi-value">6</div>
      </div>

      <div class="np-kpi orange">
        <div class="np-kpi-left">
          <div class="np-kpi-label">Discharges Today</div>
          <div class="np-kpi-ico">
            <font-awesome-icon icon="clipboard-check" />
          </div>
        </div>
        <div class="np-kpi-value">5</div>
      </div>

      <div class="np-kpi pink">
        <div class="np-kpi-left">
          <div class="np-kpi-label">Priority Patients</div>
          <div class="np-kpi-ico">
            <font-awesome-icon icon="bell" />
          </div>
        </div>
        <div class="np-kpi-value">4</div>
      </div>
    </section>

    <!-- Panel -->
    <section class="np-panel">
      <!-- Filters -->
      <div class="np-filters">
        <div class="np-search">
          <font-awesome-icon icon="magnifying-glass" />
          <input v-model="q" type="text" placeholder="Search..." />
        </div>

        <div class="np-dd">
          <select v-model="statusFilter">
            <option value="all">All Status</option>
            <option value="outpatient">Outpatient</option>
            <option value="inpatient">Inpatient</option>
            <option value="icu">ICU</option>
          </select>
          <font-awesome-icon class="np-dd-ico" icon="chevron-down" />
        </div>

        <div class="np-dd">
          <select v-model="unitFilter">
            <option value="all">All UC</option>
            <option value="uc-1">UC-1</option>
            <option value="uc-2">UC-2</option>
            <option value="uc-3">UC-3</option>
          </select>
          <font-awesome-icon class="np-dd-ico" icon="chevron-down" />
        </div>

        <div class="np-dd">
          <select v-model="dateFilter">
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
          <font-awesome-icon class="np-dd-ico" icon="chevron-down" />
        </div>

        <div class="np-spacer"></div>

        <button class="np-export" type="button">
          <font-awesome-icon icon="download" />
          Export
        </button>
      </div>

      <!-- Table -->
      <div class="np-table-wrap">
        <table class="np-table">
          <colgroup>
            <col style="width: 44px" />
            <col style="width: 340px" />
            <col style="width: 170px" />
            <col style="width: 230px" />
            <col style="width: 230px" />
            <col style="width: 160px" />
          </colgroup>

          <thead>
            <tr>
              <!-- select all (col 1) -->
              <th class="np-th-check">
                <label class="np-check">
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
                <button class="np-th" type="button">
                  Name <font-awesome-icon icon="chevron-down" />
                </button>
              </th>

              <th>
                <button class="np-th" type="button">
                  Room <font-awesome-icon icon="chevron-down" />
                </button>
              </th>

              <th>
                <button class="np-th" type="button">
                  Status <font-awesome-icon icon="chevron-down" />
                </button>
              </th>

              <th>
                <button class="np-th" type="button">
                  Nurse <font-awesome-icon icon="chevron-down" />
                </button>
              </th>

              <th class="np-th-actions">
                <button class="np-th" type="button">
                  Actions <font-awesome-icon icon="chevron-down" />
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in pagedRows" :key="row.id">
              <!-- checkbox col 1 -->
              <td class="np-td-check">
                <label class="np-check">
                  <input type="checkbox" :checked="selected.has(row.id)" @change="toggleRow(row.id)" />
                  <span></span>
                </label>
              </td>

              <!-- Name col includes checkbox col 2 -->
              <td>
                <div class="np-namecell">
                  <label class="np-check np-check--mini">
                    <input
                      type="checkbox"
                      :checked="secondarySelected.has(row.id)"
                      @change="toggleSecondary(row.id)"
                    />
                    <span></span>
                  </label>

                  <div class="np-nameinfo">
                    <div class="np-name">{{ row.name }}</div>
                    <div class="np-mini">{{ row.note }}</div>
                  </div>
                </div>
              </td>

              <td class="np-room">{{ row.room }}</td>

              <td>
                <div class="np-status-wrap">
                  <span class="np-status" :class="row.status">{{ statusLabel(row.status) }}</span>
                  <span v-if="row.badge" class="np-badge" :class="row.badgeClass">{{ row.badge }}</span>
                </div>
              </td>

              <td class="np-nurse">{{ row.nurse }}</td>

              <td class="np-actions">
                <button class="np-view" type="button">
                  View <font-awesome-icon icon="chevron-down" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="np-footer">
        <div class="np-foot-left">
          Showing {{ startRow }} to {{ endRow }} of {{ filteredRows.length }} patients
        </div>

        <div class="np-pager">
          <button class="np-pagebtn" type="button" :disabled="page === 1" @click="page--">
            <font-awesome-icon icon="angle-left" />
          </button>

          <button
            v-for="btn in pageButtons"
            :key="btn.key"
            class="np-pagebtn"
            type="button"
            :class="{ active: btn.num === page, dots: btn.dots }"
            :disabled="btn.dots"
            @click="!btn.dots && (page = btn.num)"
          >
            {{ btn.label }}
          </button>

          <button class="np-pagebtn" type="button" :disabled="page === pageCount" @click="page++">
            <font-awesome-icon icon="angle-right" />
          </button>
        </div>

        <div class="np-foot-right">
          <div class="np-dd small">
            <select v-model.number="pageSize">
              <option :value="8">8 / page</option>
              <option :value="10">10 / page</option>
              <option :value="12">12 / page</option>
            </select>
            <font-awesome-icon class="np-dd-ico" icon="chevron-down" />
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom message strip -->
    <div class="np-msgstrip">
      <img class="np-avatar" src="https://i.pravatar.cc/56?img=47" alt="" />
      <div class="np-msgtext">
        <div class="np-msgname">Emily Davis - RN</div>
        <div class="np-msgline">
          Patient: David Harris needs to be repositioned and have his IV line changed. Please handle it ASAP.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from "vue";

/* filters */
const q = ref("");
const statusFilter = ref("all");
const unitFilter = ref("all");
const dateFilter = ref("all");

/* paging */
const page = ref(1);
const pageSize = ref(8);

/* selection sets */
const selected = ref(new Set());
const secondarySelected = ref(new Set());

/* select-all indeterminate */
const selectAllRef = ref(null);

const rows = ref([
  { id: 1, name: "Laura Williams", note: "Vital Sign Check", room: "102A", status: "outpatient", nurse: "Nicole Reed, RN" },
  { id: 2, name: "David Harris", note: "New Now", room: "103B", status: "inpatient", nurse: "Karen Brooks, RN" },
  { id: 3, name: "Cleo Anderson", note: "iProntion", room: "ICU-1", status: "monitor", badge: "Monitoring every 2 hrs", badgeClass: "red", nurse: "Karen Brooks, RN" },
  { id: 4, name: "Ethan Rivera", note: "Wounds dressing - 11:30 AM", room: "104A", status: "inpatient", nurse: "Sarah Mitchell, RN" },
  { id: 5, name: "William Clark", note: "Oxygen Therapy", room: "ICU-2", status: "icu", badge: "Oxygen Therapy", badgeClass: "gray", nurse: "Katie Nguyen, RN" },
  { id: 6, name: "Megan Richards", note: "Inpatient", room: "105B", status: "vitals", badge: "due 2:00 PM", badgeClass: "muted", nurse: "Nicole Reed, RN" },
  { id: 7, name: "Olivia Harris", note: "Dreated iore Today", room: "ICU-3", status: "discharge", badge: "Discharge Today", badgeClass: "purple", nurse: "Dr. Ryan Lewis, MD" },
  { id: 8, name: "John Morris", note: "Blood Sure Check", room: "106A", status: "sugar", badge: "Blood Sugar Check - EOD", badgeClass: "beige", nurse: "Karen Brooks, RN" },
  { id: 9, name: "William Martinez", note: "Lab Results Review", room: "107A", status: "inpatient", nurse: "Katie Nguyen, RN" },
]);

function statusLabel(s) {
  const map = {
    outpatient: "Outpatient",
    inpatient: "Inpatient",
    icu: "ICU",
    monitor: "Monitoring",
    vitals: "Vital Signs",
    discharge: "Discharge",
    sugar: "Blood Sugar",
  };
  return map[s] || "Status";
}

const filteredRows = computed(() => {
  const term = q.value.trim().toLowerCase();

  return rows.value.filter((r) => {
    const matchesSearch =
      !term ||
      r.name.toLowerCase().includes(term) ||
      r.room.toLowerCase().includes(term) ||
      (r.note || "").toLowerCase().includes(term) ||
      (r.nurse || "").toLowerCase().includes(term);

    const matchesStatus = statusFilter.value === "all" ? true : r.status === statusFilter.value;

    // unit/date are UI-only for now (kept for layout parity)
    const matchesUnit = unitFilter.value === "all" ? true : true;
    const matchesDate = dateFilter.value === "all" ? true : true;

    return matchesSearch && matchesStatus && matchesUnit && matchesDate;
  });
});

const pageCount = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)));

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredRows.value.slice(start, start + pageSize.value);
});

const startRow = computed(() => (filteredRows.value.length ? (page.value - 1) * pageSize.value + 1 : 0));
const endRow = computed(() => Math.min(page.value * pageSize.value, filteredRows.value.length));

watch([q, statusFilter, unitFilter, dateFilter, pageSize], () => {
  page.value = 1;
  selected.value = new Set();
  secondarySelected.value = new Set();
});

/* checkbox helpers */
const isAllOnPageSelected = computed(() => {
  const ids = pagedRows.value.map((r) => r.id);
  return ids.length > 0 && ids.every((id) => selected.value.has(id));
});

const isSomeOnPageSelected = computed(() => {
  const ids = pagedRows.value.map((r) => r.id);
  const any = ids.some((id) => selected.value.has(id));
  return any && !isAllOnPageSelected.value;
});

/* set indeterminate correctly via ref */
watchEffect(() => {
  if (selectAllRef.value) {
    selectAllRef.value.indeterminate = isSomeOnPageSelected.value;
  }
});

function toggleAllOnPage() {
  const ids = pagedRows.value.map((r) => r.id);
  const next = new Set(selected.value);

  if (ids.every((id) => next.has(id))) {
    ids.forEach((id) => next.delete(id));
  } else {
    ids.forEach((id) => next.add(id));
  }
  selected.value = next;
}

function toggleRow(id) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
}

function toggleSecondary(id) {
  const next = new Set(secondarySelected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  secondarySelected.value = next;
}

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
/* (same styles as before, plus mini checkbox + name cell layout)
   Keeping your previous CSS structure; only adding what’s required. */

.np{ display:grid; gap:18px; min-width:0; }

/* header */
.np-title{ margin:0; font-size:28px; font-weight:900; color:#2a3550; }
.np-sub{ margin-top:6px; display:flex; gap:10px; color:#6b7a90; font-weight:800; }
.np-sub-strong{ color:#2a3550; }
.np-sub-sep{ opacity:.6; }

/* kpis */
.np-kpis{ display:grid; grid-template-columns:repeat(4, minmax(240px, 1fr)); gap:16px; }
.np-kpi{ border-radius:12px; padding:14px 16px; color:#fff; display:flex; justify-content:space-between; align-items:center;
  box-shadow:0 14px 26px rgba(34,50,74,0.14); border:1px solid rgba(255,255,255,0.25); min-width:0; }
.np-kpi-left{ min-width:0; }
.np-kpi-label{ font-weight:900; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.np-kpi-ico{ margin-top:6px; opacity:.95; }
.np-kpi-value{ font-size:42px; font-weight:900; line-height:1; }
.np-kpi.blue{ background:linear-gradient(90deg,#356ee6,#5c8cf5); }
.np-kpi.teal{ background:linear-gradient(90deg,#2f9aa2,#4fc1cb); }
.np-kpi.orange{ background:linear-gradient(90deg,#ff7a3d,#ffa45b); }
.np-kpi.pink{ background:linear-gradient(90deg,#ff4d6d,#ff7d87); }

/* panel */
.np-panel{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.75), rgba(255,255,255,0.65));
  box-shadow:0 18px 40px rgba(34,50,74,0.12);
  overflow:hidden;
}

/* filters */
.np-filters{ padding:14px 16px; display:flex; gap:12px; align-items:center; border-bottom:1px solid rgba(226,232,244,0.75); }
.np-search{ flex:1 1 320px; min-width:240px; border:1px solid rgba(226,232,244,0.9); background:rgba(255,255,255,0.55);
  border-radius:14px; padding:10px 12px; display:flex; gap:10px; align-items:center; color:#7486a6; }
.np-search input{ width:100%; border:0; outline:0; background:transparent; font-weight:800; color:#2a3550; }

.np-dd{ position:relative; min-width:150px; }
.np-dd.small{ min-width:120px; }
.np-dd select{
  width:100%; appearance:none;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 38px 10px 12px;
  font-weight:900; color:#425574; outline:none;
}
.np-dd-ico{ position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#7a8aa7; pointer-events:none; }
.np-spacer{ flex:1 1 auto; }
.np-export{
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  border-radius:14px;
  padding:10px 14px;
  font-weight:900; color:#425574;
  cursor:pointer;
  display:flex; align-items:center; gap:10px;
}
.np-export:hover{ background:rgba(255,255,255,0.75); }

/* table */
.np-table-wrap{ overflow:auto; }
.np-table{ width:100%; border-collapse:collapse; table-layout:fixed; }

thead th{ padding:12px; font-size:12px; color:#6b7a90; font-weight:900; text-align:left;
  border-bottom:1px solid rgba(226,232,244,0.75); }
.np-th{ border:0; background:transparent; padding:0; color:inherit; font:inherit; font-weight:900; display:flex; gap:8px; align-items:center; cursor:pointer; }
.np-th-actions{ text-align:right; }

tbody td{ padding:14px 12px; border-bottom:1px solid rgba(226,232,244,0.55); font-size:13px; color:#2a3550; }
tbody tr:hover{ background:rgba(255,255,255,0.30); }

.np-th-check, .np-td-check{ padding-left:16px; }

/* checkbox ui */
.np-check{ display:grid; place-items:center; }
.np-check input{ display:none; }
.np-check span{
  width:18px; height:18px;
  border-radius:6px;
  border:2px solid rgba(140,155,185,0.7);
  background:rgba(255,255,255,0.75);
  position:relative;
  display:grid;
  place-items:center;
}
.np-check input:checked + span{
  background:rgba(45,118,214,0.18);
  border-color:rgba(45,118,214,0.55);
  box-shadow:0 0 0 4px rgba(45,118,214,0.10);
}
.np-check input:checked + span::after{
  content:"";
  width:8px;
  height:4px;
  border-left:3px solid #1e5fb7;
  border-bottom:3px solid #1e5fb7;
  transform:rotate(-45deg);
}

/* second checkbox (mini) */
.np-check--mini span{
  width:16px;
  height:16px;
  border-radius:5px;
}
.np-check--mini input:checked + span::after{
  width:7px;
  height:3px;
}

/* name cell layout */
.np-namecell{
  display:flex;
  align-items:center;
  gap:12px;
  min-width:0;
}
.np-nameinfo{ min-width:0; }
.np-name{ font-weight:900; }
.np-mini{ margin-top:4px; font-size:11px; color:#7a8aa7; font-weight:800; }

.np-room, .np-nurse{ font-weight:900; color:#4b5f80; }

/* status pills */
.np-status-wrap{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.np-status, .np-badge{
  padding:6px 10px;
  border-radius:10px;
  font-size:12px;
  font-weight:900;
  border:1px solid rgba(226,232,244,0.85);
}
.np-status.outpatient{ background:rgba(100,190,200,0.35); color:#1f5a63; }
.np-status.inpatient{ background:rgba(255,214,165,0.55); color:#7a4a1c; }
.np-status.icu{ background:rgba(255,214,165,0.55); color:#7a4a1c; }
.np-status.monitor{ background:rgba(255,120,120,0.6); color:#7b1f1f; }
.np-status.vitals{ background:rgba(255,170,85,0.55); color:#7a3a10; }
.np-status.discharge{ background:rgba(173,165,255,0.55); color:#3f3a86; }
.np-status.sugar{ background:rgba(236,214,200,0.75); color:#5d4032; }

.np-badge.red{ background:rgba(255,120,120,0.35); color:#7b1f1f; }
.np-badge.gray{ background:rgba(230,232,240,0.75); color:#51607a; }
.np-badge.muted{ background:rgba(230,232,240,0.6); color:#51607a; }
.np-badge.purple{ background:rgba(173,165,255,0.55); color:#3f3a86; }
.np-badge.beige{ background:rgba(236,214,200,0.75); color:#5d4032; }

/* action btn */
.np-actions{ text-align:right; }
.np-view{
  border:0;
  border-radius:10px;
  padding:10px 14px;
  font-weight:900;
  cursor:pointer;
  color:#fff;
  background:linear-gradient(180deg,#2d76d6,#1e5fb7);
  display:inline-flex;
  align-items:center;
  gap:10px;
}

/* footer */
.np-footer{ padding:12px 16px; display:flex; align-items:center; gap:14px; }
.np-foot-left{ color:#6b7a90; font-weight:800; font-size:12px; }
.np-pager{ margin-left:auto; display:flex; gap:8px; align-items:center; }
.np-pagebtn{
  min-width:34px; height:30px;
  border-radius:8px;
  border:1px solid rgba(226,232,244,0.9);
  background:rgba(255,255,255,0.55);
  font-weight:900;
  color:#425574;
  cursor:pointer;
}
.np-pagebtn.active{ background:rgba(45,118,214,0.18); border-color:rgba(45,118,214,0.35); color:#1e5fb7; }
.np-pagebtn.dots{ cursor:default; }
.np-pagebtn:disabled{ opacity:.5; cursor:not-allowed; }

/* message strip */
.np-msgstrip{
  border-radius:16px;
  border:1px solid rgba(226,232,244,0.85);
  background:linear-gradient(180deg, rgba(243,238,255,0.55), rgba(255,255,255,0.55));
  box-shadow:0 14px 30px rgba(34,50,74,0.10);
  padding:12px 14px;
  display:flex;
  align-items:center;
  gap:12px;
}
.np-avatar{ width:44px; height:44px; border-radius:999px; object-fit:cover; border:2px solid rgba(255,255,255,0.75); }
.np-msgname{ font-weight:900; color:#2a3550; }
.np-msgline{ margin-top:4px; font-size:12px; font-weight:800; color:#5b6b87; }

/* responsive */
@media (max-width: 1400px){ .np-kpis{ grid-template-columns:repeat(2,1fr); } }
@media (max-width: 980px){
  .np-filters{ flex-wrap:wrap; }
  .np-spacer{ display:none; }
  .np-export{ width:100%; justify-content:center; }
}
@media (max-width: 820px){
  .np-kpis{ grid-template-columns:1fr; }
  .np-title{ font-size:24px; }
}
</style>
