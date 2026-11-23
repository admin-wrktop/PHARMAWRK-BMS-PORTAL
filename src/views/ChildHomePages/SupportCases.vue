<template>
  <div class="sc-page">
    <SupportSettingsDialog v-model="settingsOpen" />

    <!-- Per-status counts (click to filter) -->
    <div class="sc-counts">
      <button
        v-for="tile in countTiles"
        :key="tile.value"
        type="button"
        class="sc-count pw-card pw-card--interactive"
        :class="{ 'sc-count--active': statusFilter === tile.value }"
        :aria-pressed="statusFilter === tile.value"
        @click="setStatus(tile.value)"
      >
        <v-icon size="18" class="sc-count__icon" :class="`sc-tone--${tile.tone}`">{{ tile.icon }}</v-icon>
        <span class="sc-count__label">{{ tile.label }}</span>
        <span class="sc-count__value pw-num">
          <v-progress-circular v-if="loading && !countsLoaded" indeterminate size="14" width="2" />
          <template v-else>{{ tile.count }}</template>
        </span>
      </button>
    </div>

    <div class="pw-surface sc-surface">
      <!-- Filters -->
      <div class="pw-filter-bar">
        <v-select
          v-model="statusFilter"
          :items="statusItems"
          label="Status"
          variant="outlined"
          density="compact"
          hide-details
        />
        <v-select
          v-model="severityFilter"
          :items="severityItems"
          label="Severity"
          variant="outlined"
          density="compact"
          hide-details
        />
        <v-select
          v-model="typeFilter"
          :items="typeItems"
          label="Type"
          variant="outlined"
          density="compact"
          hide-details
        />
        <v-autocomplete
          v-model="orgFilter"
          :items="orgItems"
          label="Organisation"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
        <div class="pw-filter-bar__actions">
          <v-btn
            variant="text"
            size="small"
            prepend-icon="mdi-email-cog-outline"
            @click="settingsOpen = true"
            >Notifications</v-btn
          >
          <v-btn
            variant="tonal"
            size="small"
            color="primary"
            prepend-icon="mdi-refresh"
            :loading="loading"
            @click="loadCases()"
            >Refresh</v-btn
          >
          <v-btn
            variant="flat"
            size="small"
            color="primary"
            prepend-icon="mdi-plus"
            @click="raiseCase"
            >Raise case</v-btn
          >
        </div>
      </div>

      <div class="sc-body" :class="{ 'sc-body--split': !!selectedId }">
        <!-- Case list -->
        <section class="sc-list" :class="{ 'sc-list--hidden-sm': !!selectedId }" aria-label="Support cases">
          <v-alert v-if="error" type="error" variant="tonal" class="ma-4" density="compact">
            {{ error }}
            <template #append>
              <v-btn size="small" variant="text" @click="loadCases()">Retry</v-btn>
            </template>
          </v-alert>

          <div v-else-if="loading && !cases.length" class="pa-4">
            <v-skeleton-loader v-for="n in 6" :key="n" type="list-item-two-line" />
          </div>

          <div v-else-if="!cases.length" class="sc-empty">
            <v-icon size="40" class="mb-2">mdi-lifebuoy</v-icon>
            <div class="sc-empty__title">No cases match these filters</div>
            <div class="pw-muted">Change the status or organisation filter to see more.</div>
          </div>

          <template v-else>
            <button
              v-for="c in cases"
              :key="c.ticket_id"
              type="button"
              class="sc-row"
              :class="{ 'sc-row--active': c.ticket_id === selectedId }"
              @click="openCase(c.ticket_id)"
            >
              <div class="sc-row__top">
                <span class="sc-mono">{{ c.case_number }}</span>
                <span
                  v-if="c.last_reply_by === 'CUSTOMER' && c.case_status !== 'RESOLVED'"
                  class="sc-dot"
                  title="Customer replied last"
                ></span>
                <span class="sc-row__time pw-muted">{{ rel(c.updated_on) }}</span>
              </div>
              <div class="sc-row__subject">{{ c.subject }}</div>
              <div class="sc-row__meta">
                <StatusChip :status="statusLabel(c.case_status)" :tone="statusTone(c.case_status)" />
                <StatusChip :status="sevLabel(c.severity)" :tone="sevTone(c.severity)" />
                <span class="sc-tag">
                  <v-icon size="13">{{ typeIcon(c.case_type) }}</v-icon>
                  {{ typeLabel(c.case_type) }}
                </span>
                <span v-if="c.awaiting_release" class="sc-tag sc-tag--release">
                  <v-icon size="13">mdi-rocket-launch-outline</v-icon> Awaiting release
                </span>
              </div>
              <div class="sc-row__org pw-muted">
                {{ c.organization_name || c.organization_id }}
                <template v-if="c.assigned_to_name"> · {{ c.assigned_to_name }}</template>
                <template v-else> · Unassigned</template>
              </div>
            </button>

            <div v-if="nextToken" class="pa-3 text-center">
              <v-btn variant="text" size="small" :loading="loadingMore" @click="loadCases(true)"
                >Load more</v-btn
              >
            </div>
          </template>
        </section>

        <!-- Case detail -->
        <section v-if="selectedId" class="sc-detail" aria-label="Case detail">
          <SupportCaseDetail
            :key="selectedId"
            :ticket-id="selectedId"
            :staff="staff"
            @close="closeCase"
            @updated="onCaseUpdated"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { generateClient } from "aws-amplify/api";
import { ListOrganizations, ListBMSUsers } from "@/graphql/queries.js";
import StatusChip from "@/components/ui/StatusChip.vue";
import SupportCaseDetail from "@/components/SupportCases/SupportCaseDetail.vue";
import SupportSettingsDialog from "@/components/SupportCases/SupportSettingsDialog.vue";
import { supportCall } from "@/mixins/SupportCases/SupportCasesApi.js";
import {
  SUPPORT_STATUS,
  SUPPORT_SEVERITY,
  CASE_TYPES,
  STATUS_ORDER,
  OPEN_STATUSES,
  SEVERITY_ORDER,
  relativeTime,
} from "@/utils/supportCases.js";

const client = generateClient();
const PAGE_SIZE = 100;

export default {
  name: "SupportCases",
  components: { StatusChip, SupportCaseDetail, SupportSettingsDialog },
  data: () => ({
    cases: [],
    counts: {},
    countsLoaded: false,
    nextToken: null,
    loading: false,
    loadingMore: false,
    error: "",
    statusFilter: "OPEN_ONLY",
    severityFilter: "",
    typeFilter: "",
    orgFilter: null,
    orgs: [],
    staff: [],
    selectedId: null,
    settingsOpen: false,
    now: Date.now(),
    listSeq: 0,
    timer: null,
  }),
  computed: {
    statusItems() {
      return [
        { value: "OPEN_ONLY", title: "All open" },
        ...STATUS_ORDER.map((s) => ({ value: s, title: SUPPORT_STATUS[s].label })),
        { value: "ALL", title: "All cases" },
      ];
    },
    severityItems() {
      return [
        { value: "", title: "All severities" },
        ...SEVERITY_ORDER.map((s) => ({ value: s, title: SUPPORT_SEVERITY[s].label })),
      ];
    },
    typeItems() {
      return [
        { value: "", title: "All types" },
        ...Object.entries(CASE_TYPES).map(([value, v]) => ({ value, title: v.label })),
      ];
    },
    orgItems() {
      const map = new Map();
      this.orgs.forEach((o) => map.set(o.value, o.title));
      this.cases.forEach((c) => {
        const id = c.organization_id;
        if (id && !map.has(id)) map.set(id, c.organization_name || id);
      });
      map.delete("PLATFORM");
      const list = [...map.entries()]
        .map(([value, title]) => ({ value, title }))
        .sort((a, b) => a.title.localeCompare(b.title));
      return [{ value: "PLATFORM", title: "Platform (internal)" }, ...list];
    },
    countTiles() {
      const c = this.counts || {};
      const openTotal = OPEN_STATUSES.reduce((n, s) => n + (Number(c[s]) || 0), 0);
      return [
        { value: "OPEN_ONLY", label: "All open", icon: "mdi-tray-full", tone: "primary", count: openTotal },
        ...STATUS_ORDER.map((s) => ({
          value: s,
          label: SUPPORT_STATUS[s].label,
          icon: SUPPORT_STATUS[s].icon,
          tone: SUPPORT_STATUS[s].tone,
          count: Number(c[s]) || 0,
        })),
      ];
    },
  },
  watch: {
    statusFilter() { this.loadCases(); },
    severityFilter() { this.loadCases(); },
    typeFilter() { this.loadCases(); },
    orgFilter() { this.loadCases(); },
    "$route.query.case"(id) {
      this.selectedId = id || null;
    },
  },
  mounted() {
    this.selectedId = this.$route.query.case || null;
    this.loadCases();
    this.loadOrgs();
    this.loadStaff();
    this.timer = setInterval(() => (this.now = Date.now()), 60000);
    window.addEventListener("pw-case-created", this.onCaseCreatedEvent);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    window.removeEventListener("pw-case-created", this.onCaseCreatedEvent);
  },
  methods: {
    statusLabel: (s) => (SUPPORT_STATUS[s] || {}).label || s,
    statusTone: (s) => (SUPPORT_STATUS[s] || {}).tone || "neutral",
    sevLabel: (s) => (SUPPORT_SEVERITY[s] || SUPPORT_SEVERITY.NORMAL).label,
    sevTone: (s) => (SUPPORT_SEVERITY[s] || SUPPORT_SEVERITY.NORMAL).tone,
    typeLabel: (t) => (CASE_TYPES[t] || CASE_TYPES.BUG).label,
    typeIcon: (t) => (CASE_TYPES[t] || CASE_TYPES.BUG).icon,
    rel(ms) {
      return relativeTime(ms, this.now);
    },
    setStatus(v) {
      this.statusFilter = v;
    },
    async loadCases(more = false) {
      const seq = ++this.listSeq;
      if (more) this.loadingMore = true;
      else {
        this.loading = true;
        this.error = "";
      }
      try {
        const payload = {
          limit: PAGE_SIZE,
          status_filter: this.statusFilter,
          severity_filter: this.severityFilter || undefined,
          case_type_filter: this.typeFilter || undefined,
          organization_id_filter: this.orgFilter || undefined,
          next_token: more ? this.nextToken : undefined,
        };
        const res = await supportCall("bmsListSupportCases", payload);
        if (seq !== this.listSeq) return;
        const items = (res && res.items) || [];
        this.cases = more ? [...this.cases, ...items] : items;
        this.nextToken = (res && res.next_token) || null;
        if (res && res.counts) {
          this.counts = res.counts;
          this.countsLoaded = true;
        }
      } catch (e) {
        if (seq !== this.listSeq) return;
        if (!more) this.cases = [];
        this.error = e.message;
      } finally {
        if (seq === this.listSeq) {
          this.loading = false;
          this.loadingMore = false;
        }
      }
    },
    async loadOrgs() {
      try {
        const result = await client.graphql({ query: ListOrganizations });
        const items = JSON.parse(result.data.ListOrganizations).data.Items || [];
        this.orgs = items.map((o) => ({ value: o.organization_id, title: o.organization_name }));
      } catch (e) {
        this.orgs = [];
      }
    },
    async loadStaff() {
      try {
        const result = await client.graphql({
          query: ListBMSUsers,
          variables: { input: { user_status: "ACTIVE" } },
        });
        const res = JSON.parse(result.data.ListBMSUsers);
        this.staff = ((res.data && (res.data.items || res.data.Items)) || []).map((u) => ({
          value: u.user_id,
          title: u.user_name || u.user_email_id,
        }));
      } catch (e) {
        const me = this.$store.getters.get_current_user_details || {};
        this.staff = me.user_id ? [{ value: me.user_id, title: me.user_name || me.user_email_id }] : [];
      }
    },
    openCase(id) {
      this.selectedId = id;
      if (this.$route.query.case !== id) {
        this.$router.replace({ query: { ...this.$route.query, case: id } });
      }
    },
    closeCase() {
      this.selectedId = null;
      const q = { ...this.$route.query };
      delete q.case;
      this.$router.replace({ query: q });
    },
    /** The Raise case form lives in the app shell (with the floating button). */
    raiseCase() {
      window.dispatchEvent(new CustomEvent("pw-raise-case"));
    },
    onCaseCreatedEvent(e) {
      this.onRaised(e && e.detail);
    },
    async onRaised(ticket) {
      // Show the new case: back to "All open", reload, open it.
      if (this.statusFilter !== "OPEN_ONLY") this.statusFilter = "OPEN_ONLY";
      await this.loadCases();
      if (ticket && ticket.ticket_id) this.openCase(ticket.ticket_id);
    },
    onCaseUpdated(ticket) {
      if (!ticket) return;
      const i = this.cases.findIndex((c) => c.ticket_id === ticket.ticket_id);
      if (i >= 0) this.cases.splice(i, 1, { ...this.cases[i], ...ticket });
      this.refreshCountsQuietly();
    },
    async refreshCountsQuietly() {
      try {
        const res = await supportCall("bmsListSupportCases", { limit: 1, status_filter: "ALL" });
        if (res && res.counts) this.counts = res.counts;
      } catch (e) {
        /* counts refresh is best-effort */
      }
    },
  },
};
</script>

<style scoped>
.sc-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sc-counts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}
.sc-count {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  text-align: left;
  background: rgb(var(--v-theme-surface));
  cursor: pointer;
  font: inherit;
  color: inherit;
}
.sc-count--active {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary)) inset !important;
}
.sc-count__label {
  font-size: 13px;
  font-weight: 500;
  flex: 1;
  min-width: 0;
}
.sc-count__value {
  font-size: 18px;
  font-weight: 700;
}
.sc-tone--primary { color: rgb(var(--v-theme-primary)); }
.sc-tone--info { color: #3b82f6; }
.sc-tone--warning { color: #f59e0b; }
.sc-tone--error { color: #ef4444; }
.sc-tone--success { color: #10b981; }
.sc-tone--neutral { color: var(--pw-muted); }

.sc-surface {
  overflow: hidden;
}
.sc-body {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 520px;
}
.sc-body--split {
  grid-template-columns: minmax(300px, 400px) 1fr;
}
.sc-list {
  border-right: 1px solid var(--pw-border);
  max-height: calc(100vh - 290px);
  min-height: 520px;
  overflow-y: auto;
}
.sc-body:not(.sc-body--split) .sc-list {
  border-right: 0;
}
.sc-detail {
  min-width: 0;
}
@media (max-width: 960px) {
  .sc-body--split {
    grid-template-columns: 1fr;
  }
  .sc-list--hidden-sm {
    display: none;
  }
}

.sc-row {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--pw-border);
  background: transparent;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.sc-row:hover {
  background: rgba(var(--v-theme-on-surface), 0.03);
}
.sc-row--active {
  background: rgba(var(--v-theme-primary), 0.07) !important;
  box-shadow: inset 3px 0 0 rgb(var(--v-theme-primary));
}
.sc-row__top {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.sc-row__time {
  margin-left: auto;
}
.sc-row__subject {
  font-weight: 600;
  font-size: 14px;
  margin: 3px 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sc-row__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
.sc-row__org {
  font-size: 12px;
  margin-top: 6px;
}
.sc-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 600;
  font-size: 12px;
}
.sc-dot {
  width: 8px;
  height: 8px;
  border-radius: 99px;
  background: rgb(var(--v-theme-primary));
}
.sc-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--pw-muted);
}
.sc-tag--release {
  color: #7c3aed;
  font-weight: 600;
}
.sc-empty {
  text-align: center;
  padding: 72px 16px;
  color: var(--pw-muted);
}
.sc-empty__title {
  font-weight: 600;
  font-size: 15px;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 4px;
}
</style>
