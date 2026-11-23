<template>
  <v-dialog
    :model-value="modelValue"
    max-width="720"
    persistent
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center pt-4 px-5">
        <v-icon class="mr-2" color="primary">mdi-email-cog-outline</v-icon>
        Support notifications
        <v-spacer />
        <v-btn icon variant="text" size="small" aria-label="Close" @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle class="px-5 text-wrap">
        <template v-if="severityOn">
          Who is emailed when a case is raised, a customer replies or the severity is raised. Set different
          people per severity; a severity with no To uses the default lists.
        </template>
        <template v-else>Who is emailed when a case is raised or a customer replies.</template>
      </v-card-subtitle>

      <v-card-text class="px-5 pt-4">
        <v-skeleton-loader v-if="loading" type="text, text, text" />
        <v-alert v-else-if="loadError" type="error" variant="tonal" density="compact" class="mb-2">
          {{ loadError }}
          <template #append>
            <v-btn size="small" variant="text" @click="load">Retry</v-btn>
          </template>
        </v-alert>
        <template v-else>
          <!-- Default -->
          <div class="ss-section">Default</div>
          <div v-if="severityOn" class="pw-muted ss-help">Used for any severity that has no To of its own.</div>
          <v-combobox
            v-for="f in defaultFields"
            :key="f.key"
            v-model="form[f.key]"
            :label="f.label"
            :hint="!severityOn && f.key === 'urgent_to_emails' ? 'Also emailed for Urgent cases.' : f.hint"
            persistent-hint
            multiple
            chips
            closable-chips
            variant="outlined"
            density="compact"
            class="mb-4"
            :delimiters="DELIMS"
            :error-messages="listError(form[f.key])"
            @update:model-value="form[f.key] = clean($event)"
          />

          <!-- Per severity: only when this environment's backend supports it (see severityOn) -->
          <template v-if="severityOn">
          <div class="ss-section mt-2">By severity</div>
          <div class="pw-muted ss-help">
            A severity with its own To uses its own To and CC (an empty CC means no CC). A severity with no To
            uses the default To and CC.
          </div>
          <div v-for="sev in severities" :key="sev" class="ss-sev">
            <div class="ss-sev__head">
              <StatusChip :status="SUPPORT_SEVERITY[sev].label" :tone="SUPPORT_SEVERITY[sev].tone" />
            </div>
            <div class="ss-sev__fields">
              <v-combobox
                v-model="form.by_severity[sev].to_emails"
                label="To"
                :placeholder="form.to_emails.length ? 'Default To' : ''"
                persistent-placeholder
                multiple
                chips
                closable-chips
                variant="outlined"
                density="compact"
                :delimiters="DELIMS"
                :error-messages="listError(form.by_severity[sev].to_emails)"
                @update:model-value="form.by_severity[sev].to_emails = clean($event)"
              />
              <v-combobox
                v-model="form.by_severity[sev].cc_emails"
                label="CC"
                :placeholder="!who[sev].own && form.cc_emails.length ? 'Default CC' : ''"
                persistent-placeholder
                multiple
                chips
                closable-chips
                variant="outlined"
                density="compact"
                :delimiters="DELIMS"
                :error-messages="ccError(sev)"
                @update:model-value="form.by_severity[sev].cc_emails = clean($event)"
              />
            </div>
            <div class="ss-who">
              <span class="pw-muted mr-1">Who gets this:</span>
              <template v-if="who[sev].to.length">
                <strong>To</strong> {{ who[sev].to.join(", ") }}
                <span class="pw-muted">({{ who[sev].own ? "this severity" : "default" }}{{ sev === "URGENT" && form.urgent_to_emails.length ? " + urgent" : "" }})</span>
                <template v-if="who[sev].cc.length">
                  · <strong>CC</strong> {{ who[sev].cc.join(", ") }}
                  <span class="pw-muted">({{ who[sev].own ? "this severity" : "default" }})</span>
                </template>
              </template>
              <span v-else class="ss-nobody">nobody — add a To here or in Default</span>
            </div>
          </div>
          </template>

          <!-- Auto-close: only when this environment's backend supports it (see autoCloseOn) -->
          <template v-if="autoCloseOn">
            <div class="ss-section mt-4">Auto-close</div>
            <div class="pw-muted ss-help">
              Cases waiting on the customer are closed automatically after this many days without a reply; a
              reply re-opens the case.
            </div>
            <div class="ss-autoclose">
              <v-switch
                v-model="form.auto_close_enabled"
                label="Close cases automatically"
                color="primary"
                density="compact"
                hide-details
                inset
              />
              <v-text-field
                v-model.number="form.auto_close_days"
                type="number"
                :min="AUTO_CLOSE.MIN"
                :max="AUTO_CLOSE.MAX"
                step="1"
                label="Days without a reply"
                suffix="days"
                variant="outlined"
                density="compact"
                :disabled="!form.auto_close_enabled"
                :error-messages="autoCloseError"
              />
            </div>
          </template>
        </template>
      </v-card-text>

      <v-alert v-if="saveError" type="error" variant="tonal" density="compact" class="mx-5 mb-2">{{ saveError }}</v-alert>
      <v-card-actions class="px-5 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :loading="saving" :disabled="loading || !!loadError || hasInvalid" @click="save">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import StatusChip from "@/components/ui/StatusChip.vue";
import { supportCall } from "@/mixins/SupportCases/SupportCasesApi.js";
import { EMAIL_REGEX, SUPPORT_SEVERITY, SEVERITY_ORDER, severityRecipients } from "@/utils/supportCases.js";

const MAX_EMAILS = 20;
// Auto-close bounds and default (proposed contract; Backend confirms the final values).
const AUTO_CLOSE = { MIN: 1, MAX: 30, DEFAULT: 3 };
const DEFAULT_FIELDS = [
  { key: "to_emails", label: "To", hint: "Emailed for every new case and customer reply." },
  { key: "cc_emails", label: "CC", hint: "Copied on those emails." },
  { key: "urgent_to_emails", label: "Urgent cases (extra)", hint: "Also emailed for Urgent cases, on top of the Urgent To." },
];
const emptySeverities = () => Object.fromEntries(SEVERITY_ORDER.map((s) => [s, { to_emails: [], cc_emails: [] }]));

export default {
  name: "SupportSettingsDialog",
  components: { StatusChip },
  props: { modelValue: { type: Boolean, default: false } },
  emits: ["update:modelValue"],
  data: () => ({
    SUPPORT_SEVERITY,
    severities: SEVERITY_ORDER,
    // Shown only when the backend returns by_severity: a backend without severity routing (PROD until
    // Backend's release) would accept a save and drop the lists, so staff never see fields that don't work.
    severityOn: false,
    // Shown only when the backend returns the auto-close fields (same reason as severityOn).
    autoCloseOn: false,
    AUTO_CLOSE,
    DELIMS: [",", " ", ";"],
    defaultFields: DEFAULT_FIELDS,
    form: {
      to_emails: [],
      cc_emails: [],
      urgent_to_emails: [],
      by_severity: emptySeverities(),
      auto_close_enabled: true,
      auto_close_days: AUTO_CLOSE.DEFAULT,
    },
    loading: false,
    loadError: "",
    saving: false,
    saveError: "",
  }),
  computed: {
    who() {
      return Object.fromEntries(SEVERITY_ORDER.map((s) => [s, severityRecipients(this.form, s)]));
    },
    autoCloseError() {
      if (!this.autoCloseOn || !this.form.auto_close_enabled) return [];
      const d = this.form.auto_close_days;
      if (!Number.isInteger(d) || d < AUTO_CLOSE.MIN || d > AUTO_CLOSE.MAX)
        return [`Enter whole days from ${AUTO_CLOSE.MIN} to ${AUTO_CLOSE.MAX}`];
      return [];
    },
    hasInvalid() {
      const lists = [
        this.form.to_emails,
        this.form.cc_emails,
        this.form.urgent_to_emails,
        ...SEVERITY_ORDER.flatMap((s) => [this.form.by_severity[s].to_emails, this.form.by_severity[s].cc_emails]),
      ];
      return (
        lists.some((l) => this.listError(l).length) ||
        SEVERITY_ORDER.some((s) => this.ccError(s).length) ||
        this.autoCloseError.length > 0
      );
    },
  },
  watch: {
    modelValue(open) {
      if (open) this.load();
    },
  },
  methods: {
    clean(list) {
      const seen = new Set();
      return (list || [])
        .map((e) => String(e).trim().toLowerCase())
        .filter((e) => e && !seen.has(e) && seen.add(e));
    },
    listError(list) {
      const l = list || [];
      const bad = l.filter((e) => !EMAIL_REGEX.test(e));
      if (bad.length) return [`Not a valid email: ${bad.join(", ")}`];
      if (l.length > MAX_EMAILS) return [`At most ${MAX_EMAILS} emails`];
      return [];
    },
    /** The backend ignores a severity's CC unless that severity also has a To. */
    ccError(sev) {
      const r = this.form.by_severity[sev];
      if (r.cc_emails.length && !r.to_emails.length) return ["Add a To for this severity, or remove this CC (it would be ignored)"];
      return this.listError(r.cc_emails);
    },
    async load() {
      this.saveError = "";
      this.loading = true;
      this.loadError = "";
      try {
        const res = await supportCall("bmsGetSupportSettings", {});
        const s = (res && (res.settings || res)) || {};
        const has = (k) => Object.prototype.hasOwnProperty.call(s, k);
        this.severityOn = has("by_severity");
        this.autoCloseOn = has("auto_close_enabled") || has("auto_close_days");
        const bySev = emptySeverities();
        SEVERITY_ORDER.forEach((k) => {
          const v = (s.by_severity && s.by_severity[k]) || {};
          bySev[k] = { to_emails: v.to_emails || [], cc_emails: v.cc_emails || [] };
        });
        this.form = {
          to_emails: s.to_emails || [],
          cc_emails: s.cc_emails || [],
          urgent_to_emails: s.urgent_to_emails || [],
          by_severity: bySev,
          auto_close_enabled: s.auto_close_enabled !== false,
          auto_close_days: Number.isInteger(s.auto_close_days) ? s.auto_close_days : AUTO_CLOSE.DEFAULT,
        };
      } catch (e) {
        this.loadError = e.message;
      } finally {
        this.loading = false;
      }
    },
    async save() {
      this.saveError = "";
      this.saving = true;
      try {
        // The update replaces the whole settings row, so always send every field.
        await supportCall("bmsUpdateSupportSettings", {
          to_emails: this.form.to_emails,
          cc_emails: this.form.cc_emails,
          urgent_to_emails: this.form.urgent_to_emails,
          ...(this.autoCloseOn && {
            auto_close_enabled: this.form.auto_close_enabled,
            auto_close_days: this.form.auto_close_days,
          }),
          ...(this.severityOn && {
            by_severity: Object.fromEntries(
              SEVERITY_ORDER.map((k) => [
                k,
                { to_emails: this.form.by_severity[k].to_emails, cc_emails: this.form.by_severity[k].cc_emails },
              ]),
            ),
          }),
        });
        this.close();
      } catch (e) {
        this.saveError = e.message;
      } finally {
        this.saving = false;
      }
    },
    close() {
      this.$emit("update:modelValue", false);
    },
  },
};
</script>

<style scoped>
.ss-autoclose {
  display: grid;
  grid-template-columns: auto 200px;
  gap: 16px;
  align-items: center;
}
@media (max-width: 600px) {
  .ss-autoclose {
    grid-template-columns: 1fr;
  }
}
.ss-section {
  font-weight: 600;
  font-size: 14px;
}
.ss-help {
  font-size: 12.5px;
  margin: 2px 0 12px;
}
.ss-sev {
  border: 1px solid var(--pw-border);
  border-radius: 10px;
  padding: 10px 12px 10px;
  margin-bottom: 10px;
}
.ss-sev__head {
  margin-bottom: 10px;
}
.ss-sev__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.ss-who {
  font-size: 12.5px;
  line-height: 1.6;
  word-break: break-word;
}
.ss-nobody {
  color: rgb(var(--v-theme-error));
}
@media (max-width: 600px) {
  .ss-sev__fields {
    grid-template-columns: 1fr;
  }
}
</style>
