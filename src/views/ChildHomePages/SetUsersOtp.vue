<template>
  <div class="otp-page">
    <!-- Set a fixed code -->
    <section class="pw-surface otp-form-card">
      <div class="pw-section-title">Set a fixed sign-in code</div>
      <div class="pw-muted otp-sub">
        While the code is valid, the user gets no SMS and signs in with this code. It is stored only as a
        hash and can never be shown again, so note it down before you save. Every change is audit-logged
        and emailed to you.
      </div>

      <v-form ref="form" class="otp-form" @submit.prevent="askConfirm">
        <v-autocomplete
          v-model="form.organization_id"
          :items="orgItems"
          :loading="orgsLoading"
          label="Organisation *"
          variant="outlined"
          density="compact"
          :rules="[(v) => !!v || 'Pick an organisation']"
        />
        <v-autocomplete
          v-model="form.target_user_id"
          :items="userItems"
          :loading="usersLoading"
          :disabled="!form.organization_id"
          :no-data-text="usersError || 'No users in this organisation'"
          label="User *"
          variant="outlined"
          density="compact"
          :rules="[(v) => !!v || 'Pick a user']"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props" :subtitle="item.raw.subtitle" />
          </template>
        </v-autocomplete>
        <v-text-field
          v-model.trim="form.otp"
          label="6-digit code *"
          variant="outlined"
          density="compact"
          inputmode="numeric"
          maxlength="6"
          autocomplete="off"
          :type="showCode ? 'text' : 'password'"
          :append-inner-icon="showCode ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          :rules="[(v) => !otpProblem(v) || otpProblem(v)]"
          @click:append-inner="showCode = !showCode"
        />
        <v-select
          v-model="form.expires_in_days"
          :items="dayItems"
          label="Valid for *"
          variant="outlined"
          density="compact"
        />
        <v-text-field
          v-model.trim="form.reason"
          label="Reason *"
          placeholder="e.g. Play Store review"
          variant="outlined"
          density="compact"
          maxlength="200"
          counter="200"
          class="otp-form__reason"
          :rules="[(v) => (v && v.length >= 3) || 'At least 3 characters']"
        />
        <div class="otp-form__actions">
          <v-btn type="submit" color="primary" variant="flat" prepend-icon="mdi-shield-key-outline" :loading="saving">
            Set code
          </v-btn>
        </div>
      </v-form>
    </section>

    <!-- Who has a fixed code -->
    <section class="pw-surface">
      <div class="pw-filter-bar">
        <div class="pw-section-title otp-list-title">Users with a fixed code</div>
        <v-text-field
          v-model="search"
          class="pw-filter-bar__search"
          label="Search user, organisation or reason"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
        <v-switch
          v-model="includeExpired"
          label="Show expired"
          color="primary"
          density="compact"
          hide-details
          class="otp-switch"
        />
        <div class="pw-filter-bar__actions">
          <v-btn variant="tonal" size="small" color="primary" prepend-icon="mdi-refresh" :loading="loading" @click="load">
            Refresh
          </v-btn>
        </div>
      </div>

      <v-alert v-if="error" type="error" variant="tonal" density="compact" class="ma-4">
        {{ error }}
        <template #append>
          <v-btn size="small" variant="text" @click="load">Retry</v-btn>
        </template>
      </v-alert>

      <v-data-table
        v-else
        :headers="headers"
        :items="items"
        :search="search"
        :loading="loading"
        item-value="user_id"
        density="comfortable"
        :items-per-page="25"
        :no-data-text="includeExpired ? 'No fixed codes.' : 'No user has an active fixed code.'"
      >
        <template #[`item.user_name`]="{ item }">
          <div class="otp-strong">{{ item.user_name || "–" }}</div>
          <div v-if="item.phone_hint" class="pw-muted otp-small otp-mono">{{ item.phone_hint }}</div>
        </template>
        <template #[`item.expires_at_ms`]="{ item }">
          <StatusChip :status="expiryLabel(item)" :tone="expiryTone(item)" />
        </template>
        <template #[`item.set_by_name`]="{ item }">
          <div>{{ item.set_by_name || "–" }}</div>
          <div class="pw-muted otp-small">{{ fmtDateTime(item.set_on) }}</div>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            v-if="isActive(item)"
            size="small"
            variant="text"
            color="error"
            prepend-icon="mdi-delete-outline"
            :aria-label="`Remove fixed code for ${item.user_name || item.user_id}`"
            @click="removeTarget = item"
            >Remove</v-btn
          >
        </template>
      </v-data-table>
    </section>

    <!-- Confirm set -->
    <v-dialog v-model="confirmOpen" max-width="480">
      <v-card>
        <v-card-title class="pt-4 px-5">Set a fixed code?</v-card-title>
        <v-card-text class="px-5">
          <p class="mb-3">
            <strong>{{ selectedUserName }}</strong> in <strong>{{ orgName(form.organization_id) }}</strong>
            will sign in with this code for <strong>{{ form.expires_in_days }} day{{ form.expires_in_days > 1 ? "s" : "" }}</strong>
            and won't receive SMS codes. Any existing fixed code for this user is replaced.
          </p>
          <div class="otp-note">
            <v-icon size="18" class="mr-2">mdi-alert-outline</v-icon>
            <div>
              Note the code now: <span class="otp-mono otp-code">{{ form.otp }}</span><br />
              It can't be shown again after you save.
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-5 pb-4">
          <v-spacer />
          <v-btn variant="text" @click="confirmOpen = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="save">I've noted it, set code</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm remove -->
    <v-dialog :model-value="!!removeTarget" max-width="440" @update:model-value="removeTarget = null">
      <v-card v-if="removeTarget">
        <v-card-title class="pt-4 px-5">Remove fixed code?</v-card-title>
        <v-card-text class="px-5">
          <strong>{{ removeTarget.user_name || removeTarget.user_id }}</strong>
          ({{ removeTarget.organization_name }}) will go back to normal SMS codes.
        </v-card-text>
        <v-card-actions class="px-5 pb-4">
          <v-spacer />
          <v-btn variant="text" @click="removeTarget = null">Cancel</v-btn>
          <v-btn color="error" variant="flat" :loading="removing" @click="remove">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack.show" :color="snack.color" location="top" timeout="3500">{{ snack.text }}</v-snackbar>
  </div>
</template>

<script>
import StatusChip from "@/components/ui/StatusChip.vue";
import {
  listUserOtps,
  setUserOtp,
  removeUserOtp,
  listOrgUsers,
  listActiveOrgs,
  otpProblem,
} from "@/mixins/UserOtps/UserOtpApi.js";
import { activeOrgsSorted } from "@/utils/orgDefaults.js";

const DAY = 86400000;

export default {
  name: "SetUsersOtp",
  components: { StatusChip },
  data: () => ({
    orgs: [],
    orgsLoading: false,
    users: [],
    usersLoading: false,
    usersError: "",
    form: { organization_id: null, target_user_id: null, otp: "", expires_in_days: 7, reason: "" },
    showCode: false,
    saving: false,
    confirmOpen: false,
    items: [],
    includeExpired: false,
    loading: false,
    error: "",
    search: "",
    removeTarget: null,
    removing: false,
    snack: { show: false, text: "", color: "primary" },
    dayItems: [1, 2, 3, 5, 7, 14, 21, 30].map((d) => ({ value: d, title: `${d} day${d > 1 ? "s" : ""}` })),
    headers: [
      { title: "User", key: "user_name" },
      { title: "Organisation", key: "organization_name" },
      { title: "Reason", key: "reason" },
      { title: "Expiry", key: "expires_at_ms" },
      { title: "Set by", key: "set_by_name" },
      { title: "", key: "actions", sortable: false, align: "end" },
    ],
  }),
  computed: {
    orgItems() {
      return this.orgs.map((o) => ({ value: o.organization_id, title: o.organization_name }));
    },
    userItems() {
      return this.users
        .filter((u) => u.user_type !== "OWNER")
        .map((u) => ({
          value: u.user_id,
          title: u.user_name || u.user_id,
          subtitle: [u.user_type, u.user_contact_number].filter(Boolean).join(" · "),
        }))
        .sort((a, b) => String(a.title).localeCompare(String(b.title)));
    },
    selectedUserName() {
      const u = this.userItems.find((x) => x.value === this.form.target_user_id);
      return u ? u.title : "";
    },
  },
  watch: {
    "form.organization_id"(id) {
      this.form.target_user_id = null;
      this.loadUsers(id);
    },
    includeExpired() {
      this.load();
    },
  },
  mounted() {
    this.loadOrgs();
    this.load();
  },
  methods: {
    otpProblem,
    isActive(item) {
      return item.active !== false && Number(item.expires_at_ms) > Date.now();
    },
    expiryLabel(item) {
      return this.isActive(item) ? `Until ${this.fmtDate(item.expires_at_ms)}` : "Expired";
    },
    expiryTone(item) {
      if (!this.isActive(item)) return "error";
      return Number(item.expires_at_ms) - Date.now() < 2 * DAY ? "warning" : "success";
    },
    orgName(id) {
      const o = this.orgs.find((x) => x.organization_id === id);
      return o ? o.organization_name : "";
    },
    fmtDate(ms) {
      return ms ? new Date(Number(ms)).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "";
    },
    fmtDateTime(ms) {
      return ms
        ? new Date(Number(ms)).toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : "";
    },
    toast(text, color = "primary") {
      this.snack = { show: true, text, color };
    },
    async loadOrgs() {
      this.orgsLoading = true;
      try {
        this.orgs = activeOrgsSorted(await listActiveOrgs());
      } catch (e) {
        this.orgs = [];
      } finally {
        this.orgsLoading = false;
      }
    },
    async loadUsers(orgId) {
      this.users = [];
      this.usersError = "";
      if (!orgId) return;
      this.usersLoading = true;
      try {
        const list = await listOrgUsers(orgId);
        if (this.form.organization_id === orgId) this.users = list;
      } catch (e) {
        this.usersError = e.message;
      } finally {
        this.usersLoading = false;
      }
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        this.items = await listUserOtps({ include_expired: this.includeExpired });
      } catch (e) {
        this.items = [];
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async askConfirm() {
      const { valid } = await this.$refs.form.validate();
      if (valid) this.confirmOpen = true;
    },
    async save() {
      this.saving = true;
      try {
        const res = await setUserOtp({
          organization_id: this.form.organization_id,
          target_user_id: this.form.target_user_id,
          otp: this.form.otp,
          expires_in_days: this.form.expires_in_days,
          reason: this.form.reason,
        });
        this.confirmOpen = false;
        this.toast((res && res.Status_Message) || `Fixed code set for ${this.selectedUserName}`);
        // Never keep the code around after it's saved.
        this.form.otp = "";
        this.form.target_user_id = null;
        this.form.reason = "";
        this.showCode = false;
        await this.$nextTick();
        this.$refs.form.resetValidation();
        await this.load();
      } catch (e) {
        this.confirmOpen = false;
        this.toast(e.message, "error");
      } finally {
        this.saving = false;
      }
    },
    async remove() {
      const target = this.removeTarget;
      this.removing = true;
      try {
        const res = await removeUserOtp(target.user_id);
        this.toast((res && res.Status_Message) || "Fixed code removed");
        this.removeTarget = null;
        await this.load();
      } catch (e) {
        this.toast(e.message, "error");
      } finally {
        this.removing = false;
      }
    },
  },
};
</script>

<style scoped>
.otp-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.otp-form-card {
  padding: 16px 20px 8px;
}
.otp-sub {
  font-size: 13px;
  margin-top: 4px;
  max-width: 820px;
}
.otp-form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 4px 12px;
  margin-top: 16px;
  align-items: start;
}
.otp-form__reason {
  grid-column: span 2;
}
.otp-form__actions {
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
}
@media (max-width: 600px) {
  .otp-form__reason {
    grid-column: auto;
  }
}
.otp-list-title {
  margin-right: 8px;
}
.otp-switch {
  flex: 0 0 auto !important;
  min-width: 0 !important;
}
.otp-strong {
  font-weight: 500;
}
.otp-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.otp-small {
  font-size: 12px;
}
.otp-note {
  display: flex;
  align-items: flex-start;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.12);
  color: #92400e;
  font-size: 13.5px;
}
.otp-code {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.12em;
}
</style>
