<template>
  <v-dialog :model-value="modelValue" max-width="560" persistent @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="d-flex align-center pt-4 px-5">
        <v-icon class="mr-2" color="primary">mdi-email-cog-outline</v-icon>
        Support notifications
        <v-spacer />
        <v-btn icon variant="text" size="small" aria-label="Close" @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle class="px-5 text-wrap">
        Who is emailed when customers raise or reply to support cases.
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
          <v-combobox
            v-for="f in fields"
            :key="f.key"
            v-model="form[f.key]"
            :label="f.label"
            :hint="f.hint"
            persistent-hint
            multiple
            chips
            closable-chips
            variant="outlined"
            density="compact"
            class="mb-4"
            :delimiters="[',', ' ', ';']"
            :error-messages="invalid(f.key)"
            @update:model-value="normalise(f.key)"
          />
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
import { supportCall } from "@/mixins/SupportCases/SupportCasesApi.js";
import { EMAIL_REGEX } from "@/utils/supportCases.js";

const FIELDS = [
  { key: "to_emails", label: "To", hint: "Emailed for every new case and customer reply." },
  { key: "cc_emails", label: "CC", hint: "Copied on those emails." },
  { key: "urgent_to_emails", label: "Urgent cases", hint: "Also emailed when a case is raised or set to Urgent." },
];

export default {
  name: "SupportSettingsDialog",
  props: { modelValue: { type: Boolean, default: false } },
  emits: ["update:modelValue"],
  data: () => ({
    fields: FIELDS,
    form: { to_emails: [], cc_emails: [], urgent_to_emails: [] },
    loading: false,
    loadError: "",
    saving: false,
    saveError: "",
  }),
  computed: {
    hasInvalid() {
      return FIELDS.some((f) => this.invalid(f.key).length);
    },
  },
  watch: {
    modelValue(open) {
      if (open) this.load();
    },
  },
  methods: {
    normalise(key) {
      const seen = new Set();
      this.form[key] = (this.form[key] || [])
        .map((e) => String(e).trim().toLowerCase())
        .filter((e) => e && !seen.has(e) && seen.add(e));
    },
    invalid(key) {
      const bad = (this.form[key] || []).filter((e) => !EMAIL_REGEX.test(e));
      return bad.length ? [`Not a valid email: ${bad.join(", ")}`] : [];
    },
    async load() {
      this.saveError = "";
      this.loading = true;
      this.loadError = "";
      try {
        const res = await supportCall("bmsGetSupportSettings", {});
        const s = (res && (res.settings || res)) || {};
        this.form = {
          to_emails: s.to_emails || [],
          cc_emails: s.cc_emails || [],
          urgent_to_emails: s.urgent_to_emails || [],
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
        await supportCall("bmsUpdateSupportSettings", { ...this.form });
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
