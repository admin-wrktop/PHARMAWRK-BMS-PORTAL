<template>
  <v-snackbar v-model="done.show" color="success" location="top" :timeout="5000" class="support-capture-exclude">
    {{ done.text }}
  </v-snackbar>
  <v-dialog v-model="visible" max-width="640" persistent scrollable :z-index="3000" class="support-capture-exclude">
    <v-card>
      <v-card-title class="d-flex align-center pt-4 px-5">
        <v-icon class="mr-2" color="primary">mdi-lifebuoy</v-icon>
        Raise a support case
        <v-spacer />
        <v-btn icon variant="text" size="small" aria-label="Close" :disabled="saving" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="px-5 pt-2">
        <v-form ref="form" @submit.prevent="submit">
          <div class="pw-section-title mb-2">Raise for</div>
          <v-btn-toggle v-model="scope" mandatory density="compact" variant="outlined" divided color="primary" class="mb-1">
            <v-btn value="ORG" size="small" prepend-icon="mdi-domain">A customer organisation</v-btn>
            <v-btn value="PLATFORM" size="small" prepend-icon="mdi-shield-lock-outline">Platform (internal)</v-btn>
          </v-btn-toggle>
          <div class="pw-muted rc-hint mb-4">
            {{
              scope === "PLATFORM"
                ? "A staff-only case for a platform issue. No customer ever sees it."
                : "Logged on the organisation's behalf, e.g. after a call. Pick a user to show it in their case list and email them."
            }}
          </div>

          <template v-if="scope === 'ORG'">
            <v-autocomplete
              v-model="form.organization_id"
              :items="orgs"
              label="Organisation *"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'Pick an organisation']"
            />
            <v-autocomplete
              v-model="form.on_behalf_of_user_id"
              :items="userItems"
              :loading="usersLoading"
              :disabled="!form.organization_id"
              label="On behalf of (optional)"
              variant="outlined"
              density="compact"
              clearable
              no-data-text="No users in this organisation"
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props" :subtitle="item.raw.subtitle" />
              </template>
            </v-autocomplete>
          </template>

          <v-text-field
            v-model.trim="form.subject"
            label="Subject *"
            variant="outlined"
            density="compact"
            maxlength="160"
            counter="160"
            :rules="[(v) => (v && v.length >= 5) || 'At least 5 characters']"
          />
          <v-textarea
            v-model.trim="form.description"
            label="Description *"
            hint="What happened, steps to reproduce, who is affected"
            persistent-hint
            variant="outlined"
            density="compact"
            rows="4"
            auto-grow
            max-rows="10"
            maxlength="8000"
            :rules="[(v) => (v && v.length >= 10) || 'At least 10 characters']"
            @paste="onPaste"
          />

          <div class="rc-grid">
            <v-select v-model="form.severity" :items="severityItems" label="Severity" variant="outlined" density="compact" />
            <v-select v-model="form.case_type" :items="typeItems" label="Type" variant="outlined" density="compact" />
            <v-select v-model="form.app_area" :items="areaItems" label="App area" variant="outlined" density="compact" clearable />
          </div>
          <v-text-field
            v-model.trim="form.category"
            label="Module (optional)"
            placeholder="e.g. Visit Log, Expenses, Sign-in"
            variant="outlined"
            density="compact"
            maxlength="80"
          />

          <div class="rc-shot mb-3">
            <div class="pw-section-title mb-2">Screenshot of the page</div>
            <div v-if="capturing" class="rc-shot__row pw-muted">
              <v-progress-circular indeterminate size="18" width="2" class="mr-2" /> Taking a screenshot…
            </div>
            <div v-else-if="shot" class="rc-shot__row">
              <a :href="shotUrl" target="_blank" rel="noopener" class="rc-shot__thumb" title="Open full size">
                <img :src="shotUrl" alt="Screenshot of the page" />
              </a>
              <div class="rc-shot__meta">
                <div>{{ shot.name }} <span class="pw-muted">· {{ bytes(shot.size) }}</span></div>
                <div class="pw-muted rc-hint">Attached to the case. Open dialogs on the page are included.</div>
                <div class="mt-1">
                  <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-camera-retake-outline" :disabled="saving" @click="retake">Retake</v-btn>
                  <v-btn size="small" variant="text" :disabled="saving" @click="dropShot">Remove</v-btn>
                </div>
              </div>
            </div>
            <v-alert v-else-if="captureNote" type="warning" variant="tonal" density="compact">
              {{ captureNote }}
              <template #append>
                <v-btn size="small" variant="text" :disabled="saving" @click="retake">Try again</v-btn>
              </template>
            </v-alert>
            <div v-else class="rc-shot__row">
              <span class="pw-muted rc-hint mr-2">No screenshot attached.</span>
              <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-monitor-screenshot" :disabled="saving" @click="retake">Take screenshot</v-btn>
            </div>
          </div>

          <div
            class="rc-drop"
            :class="{ 'rc-drop--over': dragging }"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
          >
            <input ref="fileInput" type="file" multiple :accept="accept" class="d-none" @change="onPick" />
            <v-icon size="20" class="mr-2">mdi-paperclip</v-icon>
            <span>Drop files, paste a screenshot, or</span>
            <v-btn variant="text" size="small" color="primary" class="ml-1" @click="$refs.fileInput.click()">browse</v-btn>
            <span class="pw-muted rc-hint ml-auto">Up to 10 files, 15 MB each</span>
          </div>
          <div v-if="files.length" class="rc-tray">
            <span v-for="(f, i) in files" :key="i" class="rc-chip">
              <v-icon size="14">{{ fileIcon(f.name) }}</v-icon>
              <span class="rc-chip__name">{{ f.name }}</span>
              <span class="pw-muted">{{ bytes(f.size) }}</span>
              <v-progress-circular v-if="saving && progress[i + (shot ? 1 : 0)] !== undefined" :model-value="progress[i + (shot ? 1 : 0)]" size="14" width="2" />
              <button v-else type="button" class="rc-chip__x" :aria-label="`Remove ${f.name}`" @click="files.splice(i, 1)">
                <v-icon size="14">mdi-close</v-icon>
              </button>
            </span>
          </div>
          <div v-if="fileErrors.length" class="rc-errors">
            <div v-for="(e, i) in fileErrors" :key="i">{{ e }}</div>
          </div>
        </v-form>
      </v-card-text>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="compact"
        class="mx-5 mb-2"
        closable
        @click:close="error = ''"
        >{{ error }}</v-alert
      >
      <v-card-actions class="px-5 pb-4">
        <v-spacer />
        <v-btn variant="text" :disabled="saving" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-send" :loading="saving" @click="submit">Raise case</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { generateClient } from "aws-amplify/api";
import { ListUsersOfOrganization } from "@/graphql/queries.js";
import { createStaffCase, uploadSupportAttachments } from "@/mixins/SupportCases/SupportCasesApi.js";
import { listActiveOrgs } from "@/mixins/UserOtps/UserOtpApi.js";
import { activeOrgsSorted } from "@/utils/orgDefaults.js";
import {
  captureCurrentPage,
  SUPPORT_SEVERITY,
  SEVERITY_ORDER,
  CASE_TYPES,
  ACCEPT_ATTR,
  validateFiles,
  imagesFromClipboard,
  fileIconFor,
  formatBytes,
  toItems,
} from "@/utils/supportCases.js";

const client = generateClient();
const blank = () => ({
  organization_id: null,
  on_behalf_of_user_id: null,
  subject: "",
  description: "",
  severity: "NORMAL",
  case_type: "BUG",
  app_area: null,
  category: "",
});

export default {
  name: "RaiseCaseDialog",
  /*
   * One instance lives in the app shell. Open it with open({ capture: true }):
   * it screenshots the page first (open dialogs included), then shows on top
   * of everything (z-index 3000). On success it fires window "pw-case-created".
   */
  data: () => ({
    visible: false,
    orgs: [],
    shot: null,
    shotUrl: "",
    capturing: false,
    captureNote: "",
    done: { show: false, text: "" },
    scope: "ORG",
    form: blank(),
    users: [],
    usersLoading: false,
    files: [],
    fileErrors: [],
    progress: {},
    dragging: false,
    saving: false,
    error: "",
    accept: ACCEPT_ATTR,
    severityItems: SEVERITY_ORDER.map((s) => ({ value: s, title: SUPPORT_SEVERITY[s].label })),
    typeItems: toItems(CASE_TYPES),
    areaItems: [
      { value: "PORTAL", title: "Portal" },
      { value: "MOBILE", title: "Mobile app" },
      { value: "BMS", title: "BMS" },
    ],
  }),
  computed: {
    userItems() {
      return this.users
        .map((u) => ({
          value: u.user_id,
          title: u.user_name || u.user_email_id || u.user_id,
          subtitle: [u.user_type, u.user_email_id || u.user_contact_number].filter(Boolean).join(" · "),
        }))
        .sort((a, b) => String(a.title).localeCompare(String(b.title)));
    },
  },
  watch: {
    "form.organization_id"(id) {
      this.form.on_behalf_of_user_id = null;
      this.loadUsers(id);
    },
  },
  methods: {
    fileIcon: fileIconFor,
    bytes: formatBytes,
    reset() {
      this.error = "";
      this.scope = "ORG";
      this.form = blank();
      this.users = [];
      this.files = [];
      this.fileErrors = [];
      this.progress = {};
      this.$nextTick(() => this.$refs.form && this.$refs.form.resetValidation());
    },
    async open({ capture = false } = {}) {
      if (this.visible || this.capturing) return;
      this.reset();
      this.dropShot();
      this.captureNote = "";
      this.loadOrgs();
      if (capture) await this.takeScreenshot();
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.dropShot();
    },
    async loadOrgs() {
      if (this.orgs.length) return;
      try {
        this.orgs = activeOrgsSorted(await listActiveOrgs()).map((o) => ({
          value: o.organization_id,
          title: o.organization_name,
        }));
      } catch (e) {
        this.orgs = [];
      }
    },
    async takeScreenshot() {
      this.capturing = true;
      try {
        const { file, reason } = await captureCurrentPage();
        if (file) {
          this.setShot(file);
          this.captureNote = "";
        } else {
          this.captureNote = `${reason || "The page couldn't be captured."} Paste a screenshot (Ctrl+V) into the description or attach one below.`;
        }
      } finally {
        this.capturing = false;
      }
    },
    /** Hide the form, capture the page as it is now, show the form again. */
    async retake() {
      this.visible = false;
      await new Promise((r) => setTimeout(r, 350)); // let the form fade out
      await this.takeScreenshot();
      this.visible = true;
    },
    setShot(file) {
      this.dropShot();
      this.shot = file;
      this.shotUrl = URL.createObjectURL(file);
    },
    dropShot() {
      if (this.shotUrl) URL.revokeObjectURL(this.shotUrl);
      this.shot = null;
      this.shotUrl = "";
    },
    async loadUsers(orgId) {
      this.users = [];
      if (!orgId) return;
      this.usersLoading = true;
      try {
        const result = await client.graphql({
          query: ListUsersOfOrganization,
          variables: { input: { organization_id: orgId } },
        });
        const res = JSON.parse(result.data.ListUsersOfOrganization);
        if (this.form.organization_id === orgId) this.users = (res.data && (res.data.Items || res.data.items)) || [];
      } catch (e) {
        this.users = [];
      } finally {
        this.usersLoading = false;
      }
    },
    addFiles(list) {
      const { ok, errors } = validateFiles(Array.from(list || []), this.files.length + (this.shot ? 1 : 0));
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
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;
      this.error = "";
      this.saving = true;
      try {
        const orgId = this.scope === "ORG" ? this.form.organization_id : undefined;
        this.progress = {};
        const toUpload = this.shot ? [this.shot, ...this.files] : this.files;
        const attachments = toUpload.length
          ? await uploadSupportAttachments(orgId ? { organization_id: orgId } : {}, toUpload, (i, pct) => {
              this.progress = { ...this.progress, [i]: pct };
            })
          : [];
        const res = await createStaffCase({
          organization_id: orgId,
          on_behalf_of_user_id: (orgId && this.form.on_behalf_of_user_id) || undefined,
          subject: this.form.subject,
          description: this.form.description,
          severity: this.form.severity,
          case_type: this.form.case_type,
          app_area: this.form.app_area || undefined,
          category: this.form.category || undefined,
          attachments,
        });
        const ticket = res && res.ticket;
        window.dispatchEvent(new CustomEvent("pw-case-created", { detail: ticket }));
        this.done = { show: true, text: `Case ${(ticket && ticket.case_number) || ""} raised`.replace("  ", " ") };
        this.close();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.rc-shot__row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}
.rc-shot__thumb {
  flex: 0 0 auto;
  width: 160px;
  height: 100px;
  border: 1px solid var(--pw-border);
  border-radius: 8px;
  overflow: hidden;
  display: block;
  background: #f4f5f7;
}
.rc-shot__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top left;
  display: block;
}
.rc-shot__meta {
  min-width: 0;
  font-size: 13px;
}
.rc-hint {
  font-size: 12px;
}
.rc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 12px;
  /* room for the description's hint/error line above the floating labels */
  margin-top: 14px;
}
@media (max-width: 600px) {
  .rc-grid {
    grid-template-columns: 1fr;
  }
}
.rc-drop {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  padding: 10px 12px;
  border: 1px dashed var(--pw-border-strong);
  border-radius: 10px;
  font-size: 13px;
}
.rc-drop--over {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
}
.rc-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.rc-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--pw-border);
  border-radius: 999px;
  font-size: 12.5px;
}
.rc-chip__name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rc-chip__x {
  background: none;
  border: 0;
  cursor: pointer;
  color: var(--pw-muted);
  display: inline-flex;
}
.rc-errors {
  font-size: 12px;
  color: rgb(var(--v-theme-error));
  margin-top: 6px;
}
</style>
