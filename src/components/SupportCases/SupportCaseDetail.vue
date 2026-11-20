<template>
  <div class="scd">
    <div v-if="loading && !ticket" class="pa-5">
      <v-skeleton-loader type="heading, text, paragraph, paragraph" />
    </div>

    <v-alert v-else-if="error && !ticket" type="error" variant="tonal" class="ma-4" density="compact">
      {{ error }}
      <template #append>
        <v-btn size="small" variant="text" @click="load()">Retry</v-btn>
      </template>
    </v-alert>

    <template v-else-if="ticket">
      <!-- Header -->
      <header class="scd-head">
        <v-btn icon variant="text" size="small" class="scd-back" aria-label="Back to list" @click="$emit('close')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div class="scd-head__main">
          <div class="scd-head__id">
            <span class="scd-mono">{{ ticket.case_number }}</span>
            <StatusChip :status="statusLabel(ticket.case_status)" :tone="statusTone(ticket.case_status)" />
            <StatusChip :status="sevLabel(ticket.severity)" :tone="sevTone(ticket.severity)" />
          </div>
          <h2 class="scd-head__subject">{{ ticket.subject }}</h2>
          <div class="scd-head__meta pw-muted">
            <span><v-icon size="14">mdi-domain</v-icon> {{ ticket.organization_name || ticket.organization_id }}</span>
            <span>
              <v-icon size="14">mdi-account-outline</v-icon>
              {{ ticket.creator_name || ticket.creator_email || ticket.creator_phone || "Unknown" }}
              <template v-if="ticket.creator_email && ticket.creator_name"> ({{ ticket.creator_email }})</template>
            </span>
            <span><v-icon size="14">mdi-calendar-blank-outline</v-icon> {{ dt(ticket.created_on) }}</span>
          </div>
        </div>
        <v-btn icon variant="text" size="small" aria-label="Refresh case" :loading="loading" @click="load()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </header>

      <div class="scd-grid">
        <!-- Thread + composer -->
        <div class="scd-thread-col">
          <div ref="thread" class="scd-thread">
            <template v-for="m in messages" :key="m.message_id">
              <div v-if="m.author_type === 'SYSTEM'" class="scd-sys">
                <span>{{ m.body }} · {{ dt(m.created_on) }}</span>
              </div>
              <div
                v-else
                class="scd-msg"
                :class="{
                  'scd-msg--staff': m.author_type === 'STAFF',
                  'scd-msg--internal': m.internal,
                }"
              >
                <div class="scd-msg__head">
                  <v-icon v-if="m.author_type === 'STAFF'" size="14" color="primary">mdi-check-decagram</v-icon>
                  <strong>{{ m.author_name || m.author_email || (m.author_type === "STAFF" ? "Support" : "Customer") }}</strong>
                  <span v-if="m.internal" class="scd-internal-tag"><v-icon size="12">mdi-lock-outline</v-icon> Internal note</span>
                  <span class="pw-muted scd-msg__time">{{ dt(m.created_on) }}</span>
                </div>
                <div class="scd-msg__body">{{ m.body }}</div>
                <div v-if="m.attachments && m.attachments.length" class="scd-atts">
                  <template v-for="a in m.attachments" :key="a.key">
                    <button
                      v-if="isImage(a.name) && a.url"
                      type="button"
                      class="scd-thumb"
                      :aria-label="`Open ${a.name}`"
                      @click="lightbox = a"
                    >
                      <img :src="a.url" :alt="a.name" @load="scrollToEnd" />
                    </button>
                    <a v-else class="scd-file" :href="a.url" target="_blank" rel="noopener">
                      <v-icon size="16">{{ fileIcon(a.name) }}</v-icon>
                      <span class="scd-file__name">{{ a.name }}</span>
                      <span class="pw-muted">{{ bytes(a.size) }}</span>
                    </a>
                  </template>
                </div>
              </div>
            </template>
          </div>

          <!-- Composer -->
          <div
            class="scd-composer"
            :class="{ 'scd-composer--internal': internal, 'scd-composer--drag': dragging }"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
          >
            <div class="scd-composer__top">
              <v-btn-toggle
                v-if="!platform"
                v-model="internal"
                mandatory
                density="compact"
                variant="outlined"
                divided
                color="primary"
              >
                <v-btn :value="false" size="small" prepend-icon="mdi-reply-outline">Public reply</v-btn>
                <v-btn :value="true" size="small" prepend-icon="mdi-lock-outline">Internal note</v-btn>
              </v-btn-toggle>
              <span class="pw-muted scd-composer__hint">
                {{
                  platform
                    ? "Platform case: notes are visible to BMS staff only."
                    : internal
                    ? "Only BMS staff can see this note."
                    : ticket.source_app === "BMS" && !ticket.on_behalf_of_user
                    ? "Raised by staff: the organisation's admins see this reply; no one is emailed."
                    : "The customer is emailed this reply."
                }}
              </span>
            </div>
            <v-textarea
              v-model="body"
              :placeholder="internal ? 'Write an internal note…' : 'Write a reply to the customer…'"
              variant="outlined"
              density="compact"
              rows="3"
              auto-grow
              max-rows="10"
              maxlength="8000"
              hide-details
              @paste="onPaste"
            />
            <div v-if="files.length" class="scd-tray">
              <span v-for="(f, i) in files" :key="i" class="scd-chip">
                <v-icon size="14">{{ fileIcon(f.name) }}</v-icon>
                <span class="scd-file__name">{{ f.name }}</span>
                <span class="pw-muted">{{ bytes(f.size) }}</span>
                <v-progress-circular v-if="sending && progress[i] !== undefined" :model-value="progress[i]" size="14" width="2" />
                <button v-else type="button" class="scd-chip__x" :aria-label="`Remove ${f.name}`" @click="files.splice(i, 1)">
                  <v-icon size="14">mdi-close</v-icon>
                </button>
              </span>
            </div>
            <div v-if="fileErrors.length" class="scd-file-errors">
              <div v-for="(e, i) in fileErrors" :key="i">{{ e }}</div>
            </div>
            <div class="scd-composer__bar">
              <input ref="fileInput" type="file" multiple :accept="accept" class="d-none" @change="onPick" />
              <v-btn variant="text" size="small" prepend-icon="mdi-paperclip" @click="$refs.fileInput.click()">Attach</v-btn>
              <v-select
                v-if="!internal"
                v-model="replyStatus"
                :items="statusItems"
                label="Set status to"
                variant="outlined"
                density="compact"
                hide-details
                class="scd-status-after"
              />
              <v-spacer />
              <v-btn
                color="primary"
                variant="flat"
                size="small"
                :prepend-icon="internal ? 'mdi-note-plus-outline' : 'mdi-send'"
                :loading="sending"
                :disabled="!body.trim()"
                @click="send"
                >{{ internal ? "Add note" : "Send reply" }}</v-btn
              >
            </div>
          </div>
        </div>

        <!-- Case fields -->
        <aside class="scd-side">
          <div class="pw-section-title mb-3">Case details</div>
          <v-select v-model="form.case_status" :items="statusItems" label="Status" variant="outlined" density="compact" class="mb-1" />
          <v-select v-model="form.severity" :items="severityItems" label="Severity" variant="outlined" density="compact" class="mb-1" />
          <v-select v-model="form.case_type" :items="typeItems" label="Type" variant="outlined" density="compact" class="mb-1" />
          <v-select v-model="form.app_area" :items="areaItems" label="App area" variant="outlined" density="compact" class="mb-1" />
          <v-autocomplete
            v-model="form.assigned_to"
            :items="staffItems"
            label="Assignee"
            variant="outlined"
            density="compact"
            clearable
            class="mb-1"
          />
          <v-switch
            v-model="form.awaiting_release"
            label="Awaiting release"
            color="primary"
            density="compact"
            hide-details
            class="mb-3"
          />
          <v-btn block color="primary" variant="tonal" :disabled="!dirty" :loading="saving" @click="save">
            Save changes
          </v-btn>

          <v-divider class="my-4" />
          <div class="pw-section-title mb-2">Context</div>
          <dl class="scd-ctx">
            <template v-for="row in contextRows" :key="row[0]">
              <dt>{{ row[0] }}</dt>
              <dd>{{ row[1] }}</dd>
            </template>
          </dl>
          <template v-if="ccEmails.length || (ticket.additional_contacts || []).length">
            <v-divider class="my-4" />
            <div class="pw-section-title mb-2">Also emailed</div>
            <div v-for="e in [...(ticket.additional_contacts || []), ...ccEmails]" :key="e" class="scd-cc">{{ e }}</div>
          </template>
        </aside>
      </div>
    </template>

    <v-dialog :model-value="!!lightbox" max-width="1100" @update:model-value="lightbox = null">
      <v-card v-if="lightbox">
        <v-toolbar density="compact" color="transparent">
          <v-toolbar-title class="text-body-1">{{ lightbox.name }}</v-toolbar-title>
          <v-btn icon :href="lightbox.url" target="_blank" rel="noopener" aria-label="Open original"><v-icon>mdi-open-in-new</v-icon></v-btn>
          <v-btn icon aria-label="Close" @click="lightbox = null"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <img :src="lightbox.url" :alt="lightbox.name" class="scd-lightbox" />
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack.show" :color="snack.color" location="top" timeout="3000">{{ snack.text }}</v-snackbar>
  </div>
</template>

<script>
import StatusChip from "@/components/ui/StatusChip.vue";
import { supportCall, uploadSupportAttachments } from "@/mixins/SupportCases/SupportCasesApi.js";
import {
  SUPPORT_STATUS,
  SUPPORT_SEVERITY,
  CASE_TYPES,
  APP_AREAS,
  STATUS_ORDER,
  SEVERITY_ORDER,
  ACCEPT_ATTR,
  validateFiles,
  imagesFromClipboard,
  isImageName,
  fileIconFor,
  formatBytes,
  formatDateTime,
  toItems,
  isPlatformCase,
} from "@/utils/supportCases.js";

const EDITABLE = ["case_status", "severity", "case_type", "app_area", "assigned_to", "awaiting_release"];

export default {
  name: "SupportCaseDetail",
  components: { StatusChip },
  props: {
    ticketId: { type: String, required: true },
    staff: { type: Array, default: () => [] },
  },
  emits: ["close", "updated"],
  data: () => ({
    ticket: null,
    messages: [],
    ccEmails: [],
    loading: false,
    error: "",
    form: {},
    saving: false,
    body: "",
    internal: false,
    replyStatus: "PENDING_CUSTOMER",
    files: [],
    fileErrors: [],
    progress: {},
    sending: false,
    dragging: false,
    lightbox: null,
    snack: { show: false, text: "", color: "primary" },
    accept: ACCEPT_ATTR,
  }),
  computed: {
    platform() {
      return isPlatformCase(this.ticket);
    },
    statusItems: () => STATUS_ORDER.map((s) => ({ value: s, title: SUPPORT_STATUS[s].label })),
    severityItems: () => SEVERITY_ORDER.map((s) => ({ value: s, title: SUPPORT_SEVERITY[s].label })),
    typeItems: () => toItems(CASE_TYPES),
    areaItems: () => toItems(APP_AREAS),
    staffItems() {
      const list = [...this.staff];
      if (this.ticket && this.ticket.assigned_to && !list.some((s) => s.value === this.ticket.assigned_to)) {
        list.push({ value: this.ticket.assigned_to, title: this.ticket.assigned_to_name || this.ticket.assigned_to });
      }
      return list;
    },
    original() {
      const t = this.ticket || {};
      return {
        case_status: t.case_status,
        severity: t.severity || "NORMAL",
        case_type: t.case_type || "BUG",
        app_area: t.app_area || null,
        assigned_to: t.assigned_to || null,
        awaiting_release: !!t.awaiting_release,
      };
    },
    changes() {
      const out = {};
      EDITABLE.forEach((k) => {
        if ((this.form[k] ?? null) !== (this.original[k] ?? null)) out[k] = this.form[k];
      });
      return out;
    },
    dirty() {
      return Object.keys(this.changes).length > 0;
    },
    contextRows() {
      const t = this.ticket || {};
      const c = t.context || {};
      const rows = [
        ["Module", t.category],
        ["Raised from", (APP_AREAS[t.source_app] || {}).label || t.source_app],
        ["Page / screen", c.page || c.screen],
        ["App version", c.app_version],
        ["Device", c.device || c.user_agent],
        ["OS", c.os],
        ["Timezone", c.timezone],
        ["Phone", t.creator_phone],
        ["Last updated", formatDateTime(t.updated_on)],
        ["Resolved on", t.case_status === "RESOLVED" ? formatDateTime(t.resolved_on) : ""],
      ];
      return rows.filter((r) => r[1]);
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    statusLabel: (s) => (SUPPORT_STATUS[s] || {}).label || s,
    statusTone: (s) => (SUPPORT_STATUS[s] || {}).tone || "neutral",
    sevLabel: (s) => (SUPPORT_SEVERITY[s] || SUPPORT_SEVERITY.NORMAL).label,
    sevTone: (s) => (SUPPORT_SEVERITY[s] || SUPPORT_SEVERITY.NORMAL).tone,
    dt: formatDateTime,
    bytes: formatBytes,
    isImage: isImageName,
    fileIcon: fileIconFor,
    toast(text, color = "primary") {
      this.snack = { show: true, text, color };
    },
    setTicket(t) {
      this.ticket = t;
      if (isPlatformCase(t)) this.internal = true;
      this.form = { ...this.original };
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const res = await supportCall("bmsGetSupportCase", { ticket_id: this.ticketId });
        this.setTicket(res.ticket);
        this.messages = (res.messages || []).slice().sort((a, b) => Number(a.created_on) - Number(b.created_on));
        this.ccEmails = res.customer_cc_emails || [];
        this.$nextTick(this.scrollToEnd);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    scrollToEnd() {
      const go = () => {
        const el = this.$refs.thread;
        if (el) el.scrollTop = el.scrollHeight;
      };
      go();
      // Again once image thumbnails have laid out.
      setTimeout(go, 250);
    },
    addFiles(list) {
      const { ok, errors } = validateFiles(Array.from(list || []), this.files.length);
      this.files.push(...ok);
      this.fileErrors = errors;
    },
    onPick(e) {
      this.addFiles(e.target.files);
      e.target.value = "";
    },
    onDrop(e) {
      this.dragging = false;
      this.addFiles(e.dataTransfer && e.dataTransfer.files);
    },
    onPaste(e) {
      const imgs = imagesFromClipboard(e);
      if (imgs.length) this.addFiles(imgs);
    },
    async send() {
      if (!this.body.trim()) return;
      this.sending = true;
      try {
        this.progress = {};
        const attachments = this.files.length
          ? await uploadSupportAttachments(this.ticketId, this.files, (i, pct) => (this.progress = { ...this.progress, [i]: pct }))
          : [];
        const payload = {
          ticket_id: this.ticketId,
          body: this.body.trim(),
          attachments,
          internal: this.internal,
        };
        if (!this.internal) payload.new_status = this.replyStatus;
        const res = await supportCall("bmsReplySupportCase", payload);
        this.body = "";
        this.replyStatus = "PENDING_CUSTOMER";
        this.files = [];
        this.fileErrors = [];
        this.toast(this.internal ? "Internal note added" : "Reply sent");
        if (res && res.ticket) this.$emit("updated", res.ticket);
        await this.load();
      } catch (e) {
        this.toast(e.message, "error");
      } finally {
        this.sending = false;
      }
    },
    async save() {
      if (!this.dirty) return;
      this.saving = true;
      try {
        const payload = { ticket_id: this.ticketId, ...this.changes };
        if ("assigned_to" in this.changes) {
          const s = this.staffItems.find((x) => x.value === this.changes.assigned_to);
          payload.assigned_to = this.changes.assigned_to || "";
          payload.assigned_to_name = s ? s.title : "";
        }
        const res = await supportCall("bmsUpdateSupportCase", payload);
        this.toast("Case updated");
        if (res && res.ticket) this.$emit("updated", res.ticket);
        await this.load();
      } catch (e) {
        this.toast(e.message, "error");
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.scd {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.scd-head {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--pw-border);
}
.scd-back {
  display: none;
}
@media (max-width: 960px) {
  .scd-back {
    display: inline-flex;
  }
}
.scd-head__main {
  flex: 1;
  min-width: 0;
}
.scd-head__id {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.scd-head__subject {
  font-size: 17px;
  font-weight: 600;
  margin: 6px 0 4px;
  line-height: 1.35;
}
.scd-head__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  font-size: 12.5px;
}
.scd-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 600;
  font-size: 13px;
}
.scd-grid {
  display: grid;
  grid-template-columns: 1fr 260px;
  flex: 1;
  min-height: 0;
}
@media (max-width: 1200px) {
  .scd-grid {
    grid-template-columns: 1fr;
  }
  .scd-side {
    border-left: 0 !important;
    border-top: 1px solid var(--pw-border);
  }
}
.scd-thread-col {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.scd-thread {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 470px);
  min-height: 240px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(var(--v-theme-on-surface), 0.015);
}
.scd-sys {
  text-align: center;
  font-size: 12px;
  color: var(--pw-muted);
  display: flex;
  align-items: center;
  gap: 10px;
}
.scd-sys::before,
.scd-sys::after {
  content: "";
  flex: 1;
  border-top: 1px dashed var(--pw-border-strong);
}
.scd-msg {
  max-width: 82%;
  align-self: flex-end;
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--pw-border);
  border-radius: 12px 12px 4px 12px;
  padding: 10px 12px;
}
.scd-msg--staff {
  align-self: flex-start;
  border-radius: 12px 12px 12px 4px;
  background: rgba(var(--v-theme-primary), 0.06);
  border-color: rgba(var(--v-theme-primary), 0.2);
}
.scd-msg--internal {
  background: rgba(245, 158, 11, 0.09);
  border: 1px dashed rgba(245, 158, 11, 0.6);
}
.scd-msg__head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}
.scd-msg__time {
  margin-left: auto;
  font-size: 11.5px;
}
.scd-internal-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 600;
  color: #b45309;
}
.scd-msg__body {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.5;
}
.scd-atts {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
}
.scd-thumb {
  border: 1px solid var(--pw-border);
  border-radius: 8px;
  overflow: hidden;
  padding: 0;
  background: none;
  cursor: zoom-in;
}
.scd-thumb img {
  display: block;
  max-width: 180px;
  max-height: 120px;
  object-fit: cover;
}
.scd-file,
.scd-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--pw-border);
  border-radius: 999px;
  font-size: 12.5px;
  text-decoration: none;
  color: inherit;
  background: rgb(var(--v-theme-surface));
  max-width: 100%;
}
.scd-file__name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scd-chip__x {
  background: none;
  border: 0;
  cursor: pointer;
  color: var(--pw-muted);
  display: inline-flex;
}
.scd-composer {
  border-top: 1px solid var(--pw-border);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.scd-composer--internal {
  background: rgba(245, 158, 11, 0.05);
}
.scd-composer--drag {
  outline: 2px dashed rgb(var(--v-theme-primary));
  outline-offset: -6px;
}
.scd-composer__top {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.scd-composer__hint {
  font-size: 12px;
}
.scd-composer__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.scd-status-after {
  max-width: 210px;
}
.scd-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.scd-file-errors {
  font-size: 12px;
  color: rgb(var(--v-theme-error));
}
.scd-side {
  border-left: 1px solid var(--pw-border);
  padding: 16px;
}
.scd-ctx {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 10px;
  font-size: 12.5px;
  margin: 0;
}
.scd-ctx dt {
  color: var(--pw-muted);
}
.scd-ctx dd {
  margin: 0;
  word-break: break-word;
}
.scd-cc {
  font-size: 12.5px;
  word-break: break-all;
}
.scd-lightbox {
  display: block;
  max-width: 100%;
  margin: 0 auto;
}
</style>
