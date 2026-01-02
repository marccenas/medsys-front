<template>
  <div class="billing-ui">
    <!-- Top Header -->
    <div class="topbar">
      <div class="title-col">
        <h1 class="page-title">Billing</h1>
        <div class="breadcrumb">
          <span class="crumb-strong">Billing Overview</span>
          <span class="crumb-sep">›</span>
          <span class="crumb-muted">Manage all patient billing and invoices.</span>
        </div>
      </div>

      <div class="actions-col">
        <button class="btn btn-primary" type="button" @click="openAdd = true">
          <font-awesome-icon class="fa-ic" icon="plus" />
          <span>Add New Invoice</span>
        </button>

        <div class="dropdown" ref="topExportRef">
          <button class="btn btn-secondary" type="button" @click="toggleDropdown('topExport')">
            <font-awesome-icon class="fa-ic" icon="file-arrow-down" />
            <span>Export</span>
            <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
          </button>

          <div v-show="openDropdown === 'topExport'" class="menu menu-right" @click.stop>
            <button class="menu-item" type="button" @click="exportCsv('all')">Export all (CSV)</button>
            <button
              class="menu-item"
              type="button"
              :disabled="selectedIds.size === 0"
              @click="exportCsv('selected')"
            >
              Export selected (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters">
      <div class="search">
        <font-awesome-icon class="fa-ic" icon="magnifying-glass" />
        <input v-model.trim="filters.search" type="text" placeholder="Search..." />
      </div>

      <div class="dropdown" ref="deptRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('dept')">
          <span>{{ deptLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'dept'" class="menu" @click.stop>
          <button class="menu-item" type="button" @click="setDept('all')">All Departments</button>
          <button class="menu-item" type="button" @click="setDept('Cardiology')">Cardiology</button>
          <button class="menu-item" type="button" @click="setDept('Emergency')">Emergency</button>
          <button class="menu-item" type="button" @click="setDept('Pediatrics')">Pediatrics</button>
          <button class="menu-item" type="button" @click="setDept('Neurology')">Neurology</button>
        </div>
      </div>

      <div class="dropdown" ref="statusRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('status')">
          <span>{{ statusLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'status'" class="menu" @click.stop>
          <button class="menu-item" type="button" @click="setStatus('all')">All Status</button>
          <button class="menu-item" type="button" @click="setStatus('Upcoming')">Upcoming</button>
          <button class="menu-item" type="button" @click="setStatus('Updated')">Updated</button>
          <button class="menu-item" type="button" @click="setStatus('Paid')">Paid</button>
          <button class="menu-item" type="button" @click="setStatus('Insurance Pending')">Insurance Pending</button>
          <button class="menu-item" type="button" @click="setStatus('Overdue')">Overdue</button>
        </div>
      </div>

      <div class="dropdown" ref="payerRef">
        <button class="filter-btn" type="button" @click="toggleDropdown('payer')">
          <span>{{ payerLabel }}</span>
          <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
        </button>
        <div v-show="openDropdown === 'payer'" class="menu" @click.stop>
          <button class="menu-item" type="button" @click="setPayer('all')">All Payers</button>
          <button class="menu-item" type="button" @click="setPayer('Self-Pay')">Self-Pay</button>
          <button class="menu-item" type="button" @click="setPayer('BlueCross')">BlueCross</button>
          <button class="menu-item" type="button" @click="setPayer('UnitedCare')">UnitedCare</button>
          <button class="menu-item" type="button" @click="setPayer('Insurance')">Insurance</button>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="stats">
      <div class="stat-card stat-red">
        <div class="stat-meta">
          <div class="stat-label">Outstanding Balance</div>
          <div class="stat-value">{{ money(kpis.outstanding) }}</div>
        </div>
      </div>

      <div class="stat-card stat-green">
        <div class="stat-meta">
          <div class="stat-label">Paid Invoices</div>
          <div class="stat-value">{{ money(kpis.paid) }}</div>
        </div>
      </div>

      <div class="stat-card stat-purple">
        <div class="stat-meta">
          <div class="stat-label">Pending Insurance</div>
          <div class="stat-value">{{ money(kpis.pendingInsurance) }}</div>
        </div>
      </div>

      <div class="stat-card stat-orange">
        <div class="stat-meta">
          <div class="stat-label">Overdue Invoices</div>
          <div class="stat-value">{{ money(kpis.overdue) }}</div>
        </div>
      </div>
    </div>

    <!-- Table Controls -->
    <div class="table-controls">
      <div class="left-controls">
        <input
          class="chk"
          type="checkbox"
          :checked="isAllOnPageSelected"
          :indeterminate.prop="isSomeOnPageSelected && !isAllOnPageSelected"
          @change="toggleSelectAllOnPage($event.target.checked)"
        />

        <div class="dropdown" ref="tableExportRef">
          <button class="mini-btn" type="button" @click="toggleDropdown('tableExport')">
            <font-awesome-icon class="fa-ic" icon="file-arrow-down" />
            <span>Export</span>
          </button>
          <div v-show="openDropdown === 'tableExport'" class="menu" @click.stop>
            <button class="menu-item" type="button" @click="exportCsv('all')">Export all (CSV)</button>
            <button
              class="menu-item"
              type="button"
              :disabled="selectedIds.size === 0"
              @click="exportCsv('selected')"
            >
              Export selected (CSV)
            </button>
          </div>
        </div>
      </div>

      <div class="right-controls">
        <div class="dropdown" ref="bulkRef">
          <button class="mini-btn" type="button" @click="toggleDropdown('bulk')">
            <span>Bulk Actions</span>
            <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
          </button>

          <div v-show="openDropdown === 'bulk'" class="menu menu-right" @click.stop>
            <button class="menu-item" type="button" @click="bulkSetStatus('Paid')">Mark Paid</button>
            <button class="menu-item" type="button" @click="bulkSetStatus('Insurance Pending')">Mark Insurance Pending</button>
            <button class="menu-item" type="button" @click="bulkSetStatus('Overdue')">Mark Overdue</button>
            <div class="menu-sep"></div>
            <button class="menu-item danger" type="button" @click="bulkRemove">Remove Selected</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="billing-table">
        <thead>
          <tr>
            <th class="w-check"></th>
            <th>
              <div class="th-sort">
                <span>Name</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Invoice ID</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Date</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Department</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Total Amount</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th>
              <div class="th-sort">
                <span>Status</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>

            <th class="w-actions">
              <div class="th-sort">
                <span>Actions</span>
                <font-awesome-icon class="fa-ic th-caret" icon="chevron-down" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="inv in paged" :key="inv.id">
            <td class="w-check">
              <input class="chk" type="checkbox" :checked="selectedIds.has(inv.id)" @change="toggleRow(inv.id, $event.target.checked)" />
            </td>

            <td>
              <div class="name-cell">
                <img class="avatar" :src="inv.avatar" alt="" />
                <span class="name">{{ inv.name }}</span>
              </div>
            </td>

            <td>
              <a class="iid" href="#" @click.prevent="noop">{{ inv.invoiceId }}</a>
            </td>

            <td class="date">{{ formatDate(inv.date) }}</td>

            <td class="muted">{{ inv.department }}</td>

            <td class="amt">{{ money(inv.total) }}</td>

            <td>
              <span class="badge" :class="badgeClass(inv.status)">{{ inv.status }}</span>
            </td>

            <td class="w-actions">
              <div class="dropdown row-dd" :ref="setRowRef(inv.id)">
                <button class="view-btn" type="button" @click="toggleRowDropdown(inv.id)">
                  <span>View</span>
                  <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
                </button>

                <div v-show="openRowDropdown === inv.id" class="menu menu-right" @click.stop>
                  <button class="menu-item" type="button" @click="viewInvoice(inv)">View Invoice</button>
                  <button class="menu-item" type="button" @click="editInvoice(inv)">Edit</button>
                  <div class="menu-sep"></div>
                  <button class="menu-item" type="button" @click="setOneStatus(inv, 'Paid')">Mark Paid</button>
                  <button class="menu-item" type="button" @click="setOneStatus(inv, 'Insurance Pending')">Mark Insurance Pending</button>
                  <button class="menu-item" type="button" @click="setOneStatus(inv, 'Overdue')">Mark Overdue</button>
                  <div class="menu-sep"></div>
                  <button class="menu-item danger" type="button" @click="removeOne(inv)">Remove</button>
                </div>
              </div>
            </td>
          </tr>

          <tr v-if="paged.length === 0">
            <td colspan="8" class="empty">No invoices found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="table-footer">
      <div class="footer-left">Showing {{ paged.length }} out of {{ filtered.length }} invoices</div>

      <div class="footer-right">
        <div class="pager">
          <button class="pg-btn" :disabled="page === 1" @click="goTo(page - 1)">
            <font-awesome-icon class="fa-ic" icon="angle-left" />
          </button>

          <button
            v-for="p in pageButtons"
            :key="p"
            class="pg-num"
            :class="{ active: p === page }"
            @click="goTo(p)"
          >
            {{ p }}
          </button>

          <button class="pg-btn" :disabled="page === totalPages" @click="goTo(page + 1)">
            <font-awesome-icon class="fa-ic" icon="angle-right" />
          </button>
        </div>

        <div class="dropdown" ref="perRef">
          <button class="mini-btn mini-btn-compact" type="button" @click="toggleDropdown('per')">
            <span>{{ pageSize }}</span>
            <span>/ page</span>
            <font-awesome-icon class="fa-ic fa-caret" icon="chevron-down" />
          </button>

          <div v-show="openDropdown === 'per'" class="menu menu-right" @click.stop>
            <button class="menu-item" type="button" @click="setPageSize(10)">10 / page</button>
            <button class="menu-item" type="button" @click="setPageSize(20)">20 / page</button>
            <button class="menu-item" type="button" @click="setPageSize(50)">50 / page</button>
          </div>
        </div>
      </div>
    </div>

    <!-- clickout -->
    <div v-if="openDropdown || openRowDropdown" class="clickout" @click="closeAll"></div>

    <!-- Add Invoice Modal -->
    <div class="modal" v-if="openAdd" @click.self="openAdd = false">
      <div class="modal-card">
        <div class="modal-head">
          <div class="modal-title">Add New Invoice</div>
          <button class="x" type="button" @click="openAdd = false">✕</button>
        </div>

        <div class="modal-body">
          <div class="grid2">
            <input class="input2" v-model.trim="add.name" placeholder="Patient Name" />
            <input class="input2" v-model.trim="add.invoiceId" placeholder="Invoice ID (e.g., INV-10527)" />
            <input class="input2" v-model.trim="add.date" placeholder="Date (YYYY-MM-DD)" />
            <input class="input2" v-model.trim="add.department" placeholder="Department" />
            <input class="input2" v-model.number="add.total" placeholder="Total Amount" />

            <select class="input2" v-model="add.payer">
              <option>Self-Pay</option>
              <option>BlueCross</option>
              <option>UnitedCare</option>
              <option>Insurance</option>
            </select>

            <select class="input2" v-model="add.status">
              <option>Upcoming</option>
              <option>Updated</option>
              <option>Paid</option>
              <option>Insurance Pending</option>
              <option>Overdue</option>
            </select>
          </div>

          <div class="hint">Frontend-only: adds to table and localStorage.</div>
        </div>

        <div class="modal-foot">
          <button class="btn btn-secondary" type="button" @click="openAdd = false">Cancel</button>
          <button class="btn btn-primary" type="button" @click="addInvoice">Add Invoice</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

const STORAGE_KEY = "medsystem_ultra_billing_v1";

/* dropdown state */
const openDropdown = ref(null); // 'topExport'|'dept'|'status'|'payer'|'tableExport'|'bulk'|'per'|null
const openRowDropdown = ref(null); // invoice id | null

/* refs for click-out */
const topExportRef = ref(null);
const tableExportRef = ref(null);
const deptRef = ref(null);
const statusRef = ref(null);
const payerRef = ref(null);
const bulkRef = ref(null);
const perRef = ref(null);
const rowRefs = reactive(new Map());

/* filters */
const filters = reactive({
  search: "",
  dept: "all",
  status: "all",
  payer: "all",
});

/* KPIs (from screenshot values) */
const kpis = reactive({
  outstanding: 74320,
  paid: 128140,
  pendingInsurance: 23450,
  overdue: 9120,
});

/* paging */
const page = ref(1);
const pageSize = ref(10);

/* selection */
const selectedIds = ref(new Set());

/* modal */
const openAdd = ref(false);
const add = reactive({
  name: "",
  invoiceId: "",
  date: "",
  department: "Cardiology",
  total: 500,
  payer: "Insurance",
  status: "Upcoming",
});

/* data */
const invoices = ref([
  { id: 1, name: "Laura Williams", invoiceId: "INV-10527", date: "2024-04-22", department: "Cardiology", payer: "Insurance", total: 500, status: "Upcoming", avatar: "https://i.pravatar.cc/80?img=47" },
  { id: 2, name: "Mark Johnson", invoiceId: "INV-10521", date: "2024-04-22", department: "Emergency", payer: "Insurance", total: 590, status: "Updated", avatar: "https://i.pravatar.cc/80?img=12" },
  { id: 3, name: "Cleo Anderson", invoiceId: "INV-10530", date: "2024-04-22", department: "Pediatrics", payer: "Self-Pay", total: 500, status: "Paid", avatar: "https://i.pravatar.cc/80?img=32" },
  { id: 4, name: "Olivia Harris", invoiceId: "INV-10518", date: "2024-04-22", department: "Neurology", payer: "Insurance", total: 590, status: "Upcoming", avatar: "https://i.pravatar.cc/80?img=5" },
  { id: 5, name: "William Martinez", invoiceId: "INV-10523", date: "2024-04-19", department: "Neurology", payer: "Insurance", total: 500, status: "Insurance Pending", avatar: "https://i.pravatar.cc/80?img=68" },
  { id: 6, name: "William Clark", invoiceId: "INV-10524", date: "2024-04-10", department: "Emergency", payer: "Insurance", total: 500, status: "Overdue", avatar: "https://i.pravatar.cc/80?img=13" },
  { id: 7, name: "Emily Roberts", invoiceId: "INV-10524B", date: "2024-04-10", department: "Pediatrics", payer: "UnitedCare", total: 500, status: "Overdue", avatar: "https://i.pravatar.cc/80?img=43" },
  { id: 8, name: "James Garrett", invoiceId: "INV-10541", date: "2024-04-22", department: "Emergency", payer: "BlueCross", total: 590, status: "Updated", avatar: "https://i.pravatar.cc/80?img=59" },
  { id: 9, name: "Michael Foster", invoiceId: "INV-10548", date: "2024-04-12", department: "Neurology", payer: "Insurance", total: 500, status: "Overdue", avatar: "https://i.pravatar.cc/80?img=9" },
  { id: 10, name: "Angelina Ward", invoiceId: "INV-10540", date: "2024-04-29", department: "Neurology", payer: "Insurance", total: 500, status: "Updated", avatar: "https://i.pravatar.cc/80?img=30" },
]);

/* persist load/save */
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) invoices.value = parsed;
    } catch {}
  }
});
watch(
  () => invoices.value,
  (v) => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)),
  { deep: true }
);

/* labels */
const deptLabel = computed(() => (filters.dept === "all" ? "All Departments" : filters.dept));
const statusLabel = computed(() => (filters.status === "all" ? "All Status" : filters.status));
const payerLabel = computed(() => (filters.payer === "all" ? "All Payers" : filters.payer));

/* filtering */
const filtered = computed(() => {
  const q = filters.search.trim().toLowerCase();
  return invoices.value.filter((inv) => {
    const hit =
      !q ||
      `${inv.name} ${inv.invoiceId} ${inv.department} ${inv.status} ${inv.payer}`
        .toLowerCase()
        .includes(q);

    const okDept = filters.dept === "all" || inv.department === filters.dept;
    const okStatus = filters.status === "all" || inv.status === filters.status;
    const okPayer = filters.payer === "all" || inv.payer === filters.payer;

    return hit && okDept && okStatus && okPayer;
  });
});

/* paging */
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));

const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

const pageButtons = computed(() => {
  const max = totalPages.value;
  const current = page.value;
  const out = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(max, current + 2);
  for (let i = start; i <= end; i++) out.push(i);
  return out;
});

watch(
  [() => filters.search, () => filters.dept, () => filters.status, () => filters.payer, pageSize],
  () => {
    page.value = 1;
    closeAll();
  }
);

/* selection */
const isAllOnPageSelected = computed(() => paged.value.length && paged.value.every((r) => selectedIds.value.has(r.id)));
const isSomeOnPageSelected = computed(() => paged.value.some((r) => selectedIds.value.has(r.id)));

function toggleRow(id, checked) {
  const next = new Set(selectedIds.value);
  checked ? next.add(id) : next.delete(id);
  selectedIds.value = next;
}
function toggleSelectAllOnPage(checked) {
  const next = new Set(selectedIds.value);
  for (const r of paged.value) checked ? next.add(r.id) : next.delete(r.id);
  selectedIds.value = next;
}

/* dropdown helpers */
function toggleDropdown(name) {
  openRowDropdown.value = null;
  openDropdown.value = openDropdown.value === name ? null : name;
}
function toggleRowDropdown(id) {
  openDropdown.value = null;
  openRowDropdown.value = openRowDropdown.value === id ? null : id;
}
function closeAll() {
  openDropdown.value = null;
  openRowDropdown.value = null;
}

function setRowRef(id) {
  return (el) => {
    if (!el) rowRefs.delete(id);
    else rowRefs.set(id, el);
  };
}

/* click-out + esc */
function onDocClick(e) {
  if (!openDropdown.value && !openRowDropdown.value) return;
  const t = e.target;

  const globals = [
    topExportRef.value,
    tableExportRef.value,
    deptRef.value,
    statusRef.value,
    payerRef.value,
    bulkRef.value,
    perRef.value,
  ].filter(Boolean);

  const rowEl = openRowDropdown.value != null ? rowRefs.get(openRowDropdown.value) : null;

  const insideGlobal = globals.some((el) => el.contains(t));
  const insideRow = rowEl ? rowEl.contains(t) : false;

  if (!insideGlobal && !insideRow) closeAll();
}
function onEsc(e) {
  if (e.key === "Escape") closeAll();
}

onMounted(() => {
  document.addEventListener("click", onDocClick, true);
  document.addEventListener("keydown", onEsc, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick, true);
  document.removeEventListener("keydown", onEsc, true);
});

/* setters */
function setDept(v) { filters.dept = v; closeAll(); }
function setStatus(v) { filters.status = v; closeAll(); }
function setPayer(v) { filters.payer = v; closeAll(); }
function setPageSize(v) { pageSize.value = v; closeAll(); }

/* actions */
function goTo(p) {
  const next = Math.min(Math.max(1, p), totalPages.value);
  page.value = next;
}
function viewInvoice(inv) { console.log("View invoice", inv); closeAll(); }
function editInvoice(inv) { console.log("Edit invoice", inv); closeAll(); }
function setOneStatus(inv, s) { inv.status = s; closeAll(); }

function bulkSetStatus(s) {
  const ids = selectedIds.value;
  invoices.value = invoices.value.map((inv) => (ids.has(inv.id) ? { ...inv, status: s } : inv));
  closeAll();
}

function bulkRemove() {
  const ids = new Set(selectedIds.value);
  invoices.value = invoices.value.filter((inv) => !ids.has(inv.id));
  selectedIds.value = new Set();
  closeAll();
}

function removeOne(inv) {
  invoices.value = invoices.value.filter((x) => x.id !== inv.id);
  const next = new Set(selectedIds.value);
  next.delete(inv.id);
  selectedIds.value = next;
  closeAll();
}

/* modal add */
function addInvoice() {
  if (!add.name || !add.invoiceId || !add.date) return window.alert("Name, Invoice ID, and Date are required.");

  invoices.value.unshift({
    id: Date.now(),
    name: add.name,
    invoiceId: add.invoiceId,
    date: add.date,
    department: add.department || "Cardiology",
    payer: add.payer || "Insurance",
    total: Number(add.total || 0),
    status: add.status || "Upcoming",
    avatar: `https://i.pravatar.cc/80?img=${(Date.now() % 60) + 1}`,
  });

  openAdd.value = false;

  add.name = "";
  add.invoiceId = "";
  add.date = "";
  add.department = "Cardiology";
  add.total = 500;
  add.payer = "Insurance";
  add.status = "Upcoming";
}

/* export */
function exportCsv(mode) {
  const rows =
    mode === "selected"
      ? filtered.value.filter((inv) => selectedIds.value.has(inv.id))
      : filtered.value;

  const headers = ["Name", "Invoice ID", "Date", "Department", "Payer", "Total Amount", "Status"];
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };

  const csv = [
    headers.join(","),
    ...rows.map((inv) =>
      [inv.name, inv.invoiceId, inv.date, inv.department, inv.payer, money(inv.total), inv.status]
        .map(esc)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `billing_${mode}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  closeAll();
}

/* helpers */
function money(n) {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
function formatDate(yyyy_mm_dd) {
  const [y, m, d] = (yyyy_mm_dd || "").split("-").map(Number);
  if (!y || !m || !d) return yyyy_mm_dd;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "numeric" });
}
function badgeClass(s) {
  if (s === "Upcoming") return "badge-upcoming";
  if (s === "Updated") return "badge-updated";
  if (s === "Paid") return "badge-paid";
  if (s === "Insurance Pending") return "badge-insurance";
  if (s === "Overdue") return "badge-overdue";
  return "badge-upcoming";
}
function noop(){}
</script>

<style scoped>
/* Patients-style shell */
.billing-ui{
  padding: 22px 22px 16px;
  background: #eef3fb;
  min-height: calc(100vh - 60px);
}

/* header */
.topbar{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:16px;
  margin-bottom:14px;
}
.page-title{
  margin:0;
  font-size:32px;
  letter-spacing:-0.02em;
  font-weight:700;
  color:#1f2a44;
}
.breadcrumb{
  margin-top:6px;
  font-size:14px;
  display:flex;
  align-items:center;
  gap:10px;
}
.crumb-strong{ color:#26355f; font-weight:600; }
.crumb-sep{ opacity:.5; }
.crumb-muted{ opacity:.7; }

.actions-col{
  display:flex;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
  justify-content:flex-end;
}

/* buttons */
.btn{
  border:none;
  border-radius:8px;
  padding:10px 14px;
  font-weight:600;
  font-size:14px;
  display:inline-flex;
  align-items:center;
  gap:10px;
  cursor:pointer;
  box-shadow: 0 6px 18px rgba(17, 36, 80, 0.08);
}
.btn-primary{
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
}
.btn-secondary{
  background:#e9eef9;
  color:#33415c;
  border:1px solid rgba(45, 78, 140, .15);
}

/* filters */
.filters{
  display:flex;
  align-items:center;
  gap:14px;
  flex-wrap:wrap;
  margin: 6px 0 14px;
}
.search{
  flex: 1 1 260px;
  display:flex;
  align-items:center;
  gap:10px;
  background:#f6f8ff;
  border:1px solid rgba(45, 78, 140, .14);
  border-radius:8px;
  padding:10px 12px;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}
.search input{
  border:none;
  outline:none;
  background:transparent;
  width:100%;
  font-size:14px;
}
.filter-btn{
  display:inline-flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  min-width: 170px;
  padding:10px 12px;
  background:#f6f8ff;
  border:1px solid rgba(45, 78, 140, .14);
  border-radius:8px;
  cursor:pointer;
  font-weight:600;
  color:#33415c;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}

/* stats row */
.stats{
  display:flex;
  align-items:stretch;
  gap:14px;
  flex-wrap:wrap;
  margin-bottom:14px;
}
.stat-card{
  flex: 1 1 220px;
  min-width: 220px;
  border-radius:8px;
  padding:14px 16px;
  color:#fff;
  box-shadow: 0 14px 26px rgba(17, 36, 80, 0.14);
  display:flex;
  align-items:center;
}
.stat-meta{ min-width:0; }
.stat-label{ font-weight:800; opacity:.95; }
.stat-value{ font-size:30px; font-weight:900; letter-spacing:-0.01em; margin-top:4px; }
.stat-red{ background: linear-gradient(90deg, #ff7e7e, #ff5a5a); }
.stat-green{ background: linear-gradient(90deg, #43d8b7, #27b894); }
.stat-purple{ background: linear-gradient(90deg, #7b7cff, #5b5ce6); }
.stat-orange{ background: linear-gradient(90deg, #ffb15a, #ff8e3d); }

/* table controls */
.table-controls{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:10px;
}
.left-controls, .right-controls{
  display:flex;
  align-items:center;
  gap:10px;
}
.chk{
  width:18px;
  height:18px;
  accent-color:#2f86ff;
}
.mini-btn{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:10px 14px;
  border-radius:8px;
  border:1px solid rgba(45, 78, 140, .14);
  background:#f6f8ff;
  font-weight:700;
  color:#33415c;
  cursor:pointer;
  box-shadow: 0 10px 22px rgba(17, 36, 80, 0.06);
}
.mini-btn:disabled{ opacity:.55; cursor:not-allowed; }
.mini-btn-compact{ padding:10px 12px; }

/* dropdown */
.dropdown{ position:relative; }
.menu{
  position:absolute;
  top: calc(100% + 10px);
  left:0;
  min-width:220px;
  background:#ffffff;
  border:1px solid rgba(45, 78, 140, .16);
  border-radius:10px;
  padding:8px;
  box-shadow: 0 18px 40px rgba(17, 36, 80, 0.18);
  z-index: 9999;
}
.menu-right{ left:auto; right:0; }
.menu-item{
  width:100%;
  text-align:left;
  border:none;
  background:transparent;
  padding:10px 10px;
  border-radius:8px;
  font-weight:600;
  color:#2b3a5b;
  cursor:pointer;
}
.menu-item:hover{ background:#eef4ff; }
.menu-item:disabled{ opacity:.5; cursor:not-allowed; }
.menu-sep{
  height:1px;
  background: rgba(45, 78, 140, .14);
  margin:6px 4px;
}
.menu-item.danger{ color:#b42318; }
.menu-item.danger:hover{ background: rgba(180,35,24,.08); }

/* table */
.table-wrap{
  background:#fff;
  border-radius:10px;
  border:1px solid rgba(45, 78, 140, .14);
  box-shadow: 0 16px 32px rgba(17, 36, 80, 0.10);
  overflow:hidden;
}
.billing-table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
}
.billing-table thead th{
  background:#f3f6ff;
  font-size:13px;
  color:#43506b;
  font-weight:800;
  padding:14px 14px;
  border-bottom:1px solid rgba(45, 78, 140, .14);
}
.billing-table tbody td{
  padding:12px 14px;
  border-bottom:1px solid rgba(45, 78, 140, .10);
  font-weight:600;
  color:#2b3a5b;
}
.billing-table tbody tr:hover td{ background:#f8faff; }

.w-check{ width:46px; }
.w-actions{ width:150px; text-align:right; }

.th-sort{
  display:flex;
  align-items:center;
  gap:10px;
}
.th-caret{ opacity:.6; font-size:12px; }

.name-cell{
  display:flex;
  align-items:center;
  gap:12px;
}
.avatar{
  width:34px;
  height:34px;
  border-radius:999px;
  border:2px solid #dbe6ff;
  object-fit:cover;
  background:#fff;
}
.name{ font-weight:600; color:#1f2a44; }

.iid{
  color:#2f86ff;
  text-decoration:none;
  font-weight:800;
}
.iid:hover{ text-decoration:underline; }

.muted{ opacity:.85; }
.amt{ font-weight:900; color:#1f2a44; }

/* badges */
.badge{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:6px 12px;
  border-radius:6px;
  font-weight:900;
  font-size:13px;
  border:1px solid transparent;
}
.badge-upcoming{
  background: rgba(44, 214, 175, .16);
  border-color: rgba(44, 214, 175, .30);
  color:#1b8f79;
}
.badge-updated{
  background: rgba(255, 177, 90, .18);
  border-color: rgba(255, 177, 90, .34);
  color:#b56a14;
}
.badge-paid{
  background: rgba(255, 117, 170, .18);
  border-color: rgba(255, 117, 170, .32);
  color:#b12a63;
}
.badge-insurance{
  background: rgba(123, 124, 255, .16);
  border-color: rgba(123, 124, 255, .30);
  color:#4a4be0;
}
.badge-overdue{
  background: rgba(255, 153, 69, .18);
  border-color: rgba(255, 153, 69, .34);
  color:#b45309;
}

/* view button */
.view-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  width: 108px;
  padding:10px 12px;
  border:none;
  border-radius:8px;
  background: linear-gradient(180deg, #2f86ff, #1f6feb);
  color:#fff;
  font-weight:800;
  cursor:pointer;
  box-shadow: 0 10px 22px rgba(47, 134, 255, 0.28);
}

.empty{
  text-align:center;
  padding:22px 14px;
  color:#617093;
  font-weight:800;
}

/* footer */
.table-footer{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding: 10px 6px 0;
  margin-top:10px;
  color:#4b5873;
  font-weight:600;
}
.footer-right{
  display:flex;
  align-items:center;
  gap:12px;
}
.pager{
  display:flex;
  align-items:center;
  gap:6px;
}
.pg-btn, .pg-num{
  border:1px solid rgba(45, 78, 140, .18);
  background:#f6f8ff;
  color:#2b3a5b;
  border-radius:6px;
  height:30px;
  min-width:30px;
  padding:0 10px;
  cursor:pointer;
  font-weight:800;
}
.pg-btn:disabled{ opacity:.5; cursor:not-allowed; }
.pg-num.active{
  background:#2f86ff;
  border-color:#2f86ff;
  color:#fff;
}

/* clickout */
.clickout{
  position:fixed;
  inset:0;
  z-index: 9000;
  background:transparent;
}

/* modal */
.modal{
  position: fixed;
  inset: 0;
  background: rgba(17, 36, 80, 0.35);
  display:grid;
  place-items:center;
  z-index: 12000;
}
.modal-card{
  width: min(760px, 92vw);
  border-radius: 16px;
  background:#fff;
  border: 1px solid rgba(45, 78, 140, .14);
  box-shadow: 0 30px 70px rgba(17, 36, 80, 0.25);
  overflow:hidden;
}
.modal-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(248,251,255,0.95), rgba(245,249,255,0.85));
  border-bottom: 1px solid rgba(45, 78, 140, .12);
}
.modal-title{ font-weight:900; color:#1f2a44; }
.x{
  border:0;
  background:transparent;
  cursor:pointer;
  font-weight: 900;
  font-size: 16px;
  color:#33415c;
}
.modal-body{ padding: 14px; }
.grid2{ display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.input2{
  width:100%;
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid rgba(45, 78, 140, .14);
  background:#fbfdff;
  font-weight: 700;
  outline:none;
}
.hint{ margin-top: 10px; font-size: 12px; color:#64748b; font-weight: 700; }
.modal-foot{
  display:flex;
  justify-content:flex-end;
  gap: 10px;
  padding: 12px 14px;
  border-top: 1px solid rgba(45, 78, 140, .12);
}

/* FontAwesome minimal */
.fa-ic{
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -0.125em;
  line-height: 1;
}
.fa-caret{
  font-size: .85em;
  opacity: .75;
}
:deep(.fa-ic) svg{
  width: 1em;
  height: 1em;
  display: block;
}

/* responsive */
@media (max-width: 980px){
  .actions-col{ width:100%; justify-content:flex-start; }
  .btn{ width:100%; justify-content:center; }
  .filter-btn{ min-width: 180px; flex:1 1 180px; }
  .grid2{ grid-template-columns: 1fr; }
}
</style>
