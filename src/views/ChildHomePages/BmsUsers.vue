<template>
  <div class="bu-page">
    <section class="pw-surface">
      <div class="pw-filter-bar">
        <v-select
          v-model="status"
          :items="statusItems"
          label="Status"
          variant="outlined"
          density="compact"
          hide-details
        />
        <v-text-field
          v-model="search"
          class="pw-filter-bar__search"
          label="Search name or email"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
        <div class="pw-filter-bar__actions">
          <v-btn variant="tonal" size="small" color="primary" prepend-icon="mdi-refresh" :loading="loading" @click="load">
            Refresh
          </v-btn>
          <v-btn
            v-if="isAdmin"
            color="primary"
            variant="flat"
            size="small"
            prepend-icon="mdi-account-plus-outline"
            @click="openInvite"
            >Add user</v-btn
          >
        </div>
      </div>

      <v-alert v-if="!isAdmin && !loading" type="info" variant="tonal" density="compact" class="ma-4">
        Only BMS admins can add users or change their status.
      </v-alert>

      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="loading"
        item-value="user_id"
        density="comfortable"
        :items-per-page="25"
        :no-data-text="noData"
      >
        <template #[`item.user_name`]="{ item }">
          <div class="bu-name">
            {{ item.user_name || "–" }}
            <span v-if="item.user_id === me.user_id" class="bu-you">You</span>
          </div>
          <div class="pw-muted bu-small">{{ item.user_email_id }}</div>
        </template>
        <template #[`item.user_role`]="{ item }">
          <StatusChip :status="roleLabel(item.user_role)" :tone="item.user_role === 'BMS_ADMIN' ? 'info' : 'neutral'" />
        </template>
        <template #[`item.user_status`]="{ item }">
          <StatusChip :status="item.user_status" />
        </template>
        <template #[`item.user_created_on`]="{ item }">
          {{ fmtDate(item.user_created_on) }}
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="bu-actions">
            <v-btn
              v-if="isAdmin || item.user_id === me.user_id"
              size="small"
              variant="text"
              prepend-icon="mdi-pencil-outline"
              :aria-label="`Rename ${item.user_name}`"
              @click="openRename(item)"
              >Rename</v-btn
            >
            <v-btn
              v-if="isAdmin && item.user_id !== me.user_id"
              size="small"
              variant="text"
              :color="item.user_status === 'ACTIVE' ? 'error' : 'primary'"
              :prepend-icon="item.user_status === 'ACTIVE' ? 'mdi-account-off-outline' : 'mdi-account-check-outline'"
              @click="toggleTarget = item"
              >{{ item.user_status === "ACTIVE" ? "Deactivate" : "Activate" }}</v-btn
            >
          </div>
        </template>
      </v-data-table>
    </section>

    <!-- Add user -->
    <v-dialog v-model="inviteOpen" max-width="480" persistent>
      <v-card>
        <v-card-title class="pt-4 px-5">Add BMS user</v-card-title>
        <v-card-subtitle class="px-5 text-wrap">
          They sign in at this BMS with their email and a one-time code. No invitation email is sent, so let them know.
        </v-card-subtitle>
        <v-card-text class="px-5 pt-4">
          <v-form ref="inviteForm" @submit.prevent="createUser">
            <v-text-field
              v-model.trim="invite.user_name"
              label="Name *"
              variant="outlined"
              density="compact"
              :rules="[(v) => (v && v.length >= 2) || 'Enter a name']"
            />
            <v-text-field
              v-model.trim="invite.email"
              label="Work email *"
              type="email"
              variant="outlined"
              density="compact"
              :rules="[(v) => EMAIL_REGEX.test(v || '') || 'Enter a valid email']"
            />
            <div class="pw-section-title mb-2 mt-1">Role</div>
            <v-radio-group v-model="invite.role" hide-details class="mt-0">
              <v-radio value="BMS_USER" color="primary">
                <template #label>
                  <div>
                    <div class="bu-strong">BMS user</div>
                    <div class="pw-muted bu-small">Views and works with all back-office screens.</div>
                  </div>
                </template>
              </v-radio>
              <v-radio value="BMS_ADMIN" color="primary" class="mt-2">
                <template #label>
                  <div>
                    <div class="bu-strong">BMS admin</div>
                    <div class="pw-muted bu-small">Also adds BMS users, changes their status and manages fixed OTPs.</div>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
            <div class="pw-muted bu-small mt-3">The role can't be changed later.</div>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-5 pb-4">
          <v-spacer />
          <v-btn variant="text" @click="inviteOpen = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="createUser">Add user</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Rename -->
    <v-dialog :model-value="!!renameTarget" max-width="420" @update:model-value="renameTarget = null">
      <v-card v-if="renameTarget">
        <v-card-title class="pt-4 px-5">Rename user</v-card-title>
        <v-card-text class="px-5">
          <div class="pw-muted bu-small mb-3">{{ renameTarget.user_email_id }}</div>
          <v-text-field
            v-model.trim="renameValue"
            label="Name *"
            variant="outlined"
            density="compact"
            autofocus
            @keyup.enter="rename"
          />
        </v-card-text>
        <v-card-actions class="px-5 pb-4">
          <v-spacer />
          <v-btn variant="text" @click="renameTarget = null">Cancel</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" :disabled="!renameValue || renameValue.length < 2" @click="rename">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Activate / deactivate -->
    <v-dialog :model-value="!!toggleTarget" max-width="440" @update:model-value="toggleTarget = null">
      <v-card v-if="toggleTarget">
        <v-card-title class="pt-4 px-5">
          {{ toggleTarget.user_status === "ACTIVE" ? "Deactivate" : "Activate" }} {{ toggleTarget.user_name }}?
        </v-card-title>
        <v-card-text class="px-5">
          <template v-if="toggleTarget.user_status === 'ACTIVE'">
            They're signed out everywhere straight away and can't sign in to the BMS until reactivated.
          </template>
          <template v-else>They'll be able to sign in to the BMS again.</template>
        </v-card-text>
        <v-card-actions class="px-5 pb-4">
          <v-spacer />
          <v-btn variant="text" @click="toggleTarget = null">Cancel</v-btn>
          <v-btn
            :color="toggleTarget.user_status === 'ACTIVE' ? 'error' : 'primary'"
            variant="flat"
            :loading="saving"
            @click="toggleStatus"
            >{{ toggleTarget.user_status === "ACTIVE" ? "Deactivate" : "Activate" }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack.show" :color="snack.color" location="top" timeout="3500">{{ snack.text }}</v-snackbar>
  </div>
</template>

<script>
import StatusChip from "@/components/ui/StatusChip.vue";
import { listBmsUsers, createBmsUser, renameBmsUser, toggleBmsUser } from "@/mixins/BmsUsers/BmsUsersApi.js";
import { EMAIL_REGEX } from "@/utils/supportCases.js";

export default {
  name: "BmsUsers",
  components: { StatusChip },
  data: () => ({
    EMAIL_REGEX,
    status: "ACTIVE",
    statusItems: [
      { value: "ACTIVE", title: "Active" },
      { value: "INACTIVE", title: "Inactive" },
    ],
    users: [],
    loading: false,
    noData: "No users",
    search: "",
    inviteOpen: false,
    invite: { user_name: "", email: "", role: "BMS_USER" },
    renameTarget: null,
    renameValue: "",
    toggleTarget: null,
    saving: false,
    snack: { show: false, text: "", color: "primary" },
    headers: [
      { title: "User", key: "user_name" },
      { title: "Role", key: "user_role" },
      { title: "Status", key: "user_status" },
      { title: "Added on", key: "user_created_on" },
      { title: "", key: "actions", sortable: false, align: "end" },
    ],
  }),
  computed: {
    me() {
      return this.$store.getters.get_current_user_details || {};
    },
    isAdmin() {
      return this.me.user_role === "BMS_ADMIN";
    },
  },
  watch: {
    status() {
      this.load();
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    roleLabel: (r) => (r === "BMS_ADMIN" ? "Admin" : "User"),
    fmtDate(ms) {
      return ms ? new Date(Number(ms)).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "–";
    },
    toast(text, color = "primary") {
      this.snack = { show: true, text, color };
    },
    async load() {
      this.loading = true;
      try {
        const list = await listBmsUsers(this.status);
        this.users = list.sort((a, b) => String(a.user_name).localeCompare(String(b.user_name)));
        this.noData = "No users";
      } catch (e) {
        // The backend answers an empty list with "No Users Found".
        this.users = [];
        this.noData = e.message;
      } finally {
        this.loading = false;
      }
    },
    openInvite() {
      this.invite = { user_name: "", email: "", role: "BMS_USER" };
      this.inviteOpen = true;
      this.$nextTick(() => this.$refs.inviteForm && this.$refs.inviteForm.resetValidation());
    },
    async createUser() {
      const { valid } = await this.$refs.inviteForm.validate();
      if (!valid) return;
      this.saving = true;
      try {
        await createBmsUser({
          new_user_email_id: this.invite.email.toLowerCase(),
          user_name: this.invite.user_name,
          user_role: this.invite.role,
        });
        this.inviteOpen = false;
        this.toast(`${this.invite.user_name} can now sign in with ${this.invite.email.toLowerCase()}`);
        if (this.status !== "ACTIVE") this.status = "ACTIVE";
        else await this.load();
      } catch (e) {
        this.toast(e.message, "error");
      } finally {
        this.saving = false;
      }
    },
    openRename(item) {
      this.renameTarget = item;
      this.renameValue = item.user_name || "";
    },
    async rename() {
      if (!this.renameValue || this.renameValue.length < 2) return;
      this.saving = true;
      try {
        await renameBmsUser(this.renameTarget.user_id, this.renameValue);
        this.toast("Name updated");
        this.renameTarget = null;
        await this.load();
      } catch (e) {
        this.toast(e.message, "error");
      } finally {
        this.saving = false;
      }
    },
    async toggleStatus() {
      const t = this.toggleTarget;
      this.saving = true;
      try {
        await toggleBmsUser(t.user_id);
        this.toast(t.user_status === "ACTIVE" ? `${t.user_name} deactivated` : `${t.user_name} activated`);
        this.toggleTarget = null;
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
.bu-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.bu-name {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}
.bu-you {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
}
.bu-small {
  font-size: 12px;
}
.bu-strong {
  font-weight: 500;
  font-size: 14px;
}
.bu-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}
</style>
