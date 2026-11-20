<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      :model-value="sendnotification_dialog"
      max-width="400px"
      transition="dialog-top-transition"
      persistent
    >
      <v-card>
        <v-toolbar
          class="elevation-0 gradient-bg text-white"
          dark
          density="compact"
          color="gradient-bg "
        >
          <v-icon size="small" class="mr-2 ml-2">{{
            StoreObj.Action == "SEND"
              ? "mdi-share"
              : StoreObj.Action == "VIEW"
              ? "mdi-share"
              : "mdi-share"
          }}</v-icon
          ><span
            v-text="
              StoreObj.Action == 'SEND'
                ? 'Send Notification '
                : StoreObj.Action == 'VIEW'
                ? 'Notification Details'
                : 'Send Notification '
            "
          ></span>
          <v-spacer />
          <v-btn icon @click="CreateEditSpecEmitSend((Toggle = 1))">
            <v-icon size="small">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4 pb-0">
          <v-form ref="form">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Notification Text *"
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
              readonly
              v-model="notification_text"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              density="compact"
              label="Notification Subject *"
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
              :items="text"
              readonly
              v-model="notification_subject"
            ></v-text-field>

            <v-autocomplete
              class="FontSize"
              density="compact"
              label="Filter By Organization"
              variant="outlined"
              :rules="[(v) => !!v || 'Required']"
              v-model="organization_name"
              :items="filterarray"
              item-title="organization_name"
              item-value="organization_id"
              @update:model-value="UserNameFilter()"
            >
            </v-autocomplete>

            <v-select
              density="compact"
              variant="outlined"
              class="FontSize"
              :items="UserSelectType"
              v-model="UserType"
              label="Select User"
              item-title="text"
              item-value="value"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            >
            </v-select>

            <v-autocomplete
              v-if="UserType === 'INDIVIDUAL'"
              multiple
              variant="outlined"
              density="compact"
              label="User Name *"
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
              :items="UserList"
              :readonly="StoreObj.Action == 'VIEW'"
              v-model="userName"
              item-title="user_name"
              item-value="user_id"
            >
              <template v-slot:prepend-item>
                <v-list-item ripple @click="toggle">
                  <v-list-item-title
                    ><v-icon
                      :color="UserList.length > 0 ? 'primary darken-4' : ''"
                    >
                      {{ icon }}
                    </v-icon>
                    Select All
                  </v-list-item-title>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
            </v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions v-if="StoreObj.Action != 'VIEW'" class="pt-0">
          <v-spacer />
          <v-btn
            size="small"
            text
            color="primary"
            @click="CreateEditSpecEmitSend((Toggle = 1))"
            >Cancel</v-btn
          >
          <v-btn
            :loading="loading"
            size="small"
            tile
            color="primary"
            variant="elevated"
            @click="SendNotification()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { activeOrgsSorted, pickDefaultOrg } from "@/utils/orgDefaults.js";
import { SendNotificationsToUsers } from "@/graphql/mutations.js";

import {
  ListNotificationsSettings,
  ListUsersOfOrganization,
  ListOrganizations,
} from "@/graphql/queries.js";

import SnackBar from "@/components/SnackBar.vue";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    StoreObj: Object,
    sendnotification_dialog: Boolean,
    GetCurrentUserDetailsObj: Object,
  },
  components: {
    SnackBar,
  },
  data: () => ({
    organization_name: "",
    filterarray: [],
    UserType: "ALL",
    Toggle: 0,
    loading: false,
    SnackBarComponent: {},
    notification_text: "",
    UserList: [],
    UserList1: [],
    new_Remarkslist: "",
    userName: [],
    text: [],
    notification_subject: "",

    UserSelectType: [
      { text: "ALL", value: "ALL" },
      { text: "INDIVIDUAL", value: "INDIVIDUAL" },
    ],
  }),
  computed: {
    allProductsSelected() {
      return this.UserList.length === (this.userName || []).length;
    },
    someProductsSelected() {
      return this.UserList.length > 0 && !this.allProductsSelected;
    },
    icon() {
      if (this.allProductsSelected) return "mdi-close-box";
      if (this.someProductsSelected) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
  },

  mounted() {
    this.getOrganizationLists();
  },

  watch: {
    sendnotification_dialog(val) {
      if (val == true) {
        this.getOrganizationLists();
        // setTimeout(() => {
        this.getNotificationSetting();

        this.getUsersLists();
        // },2000);

        this.notification_text = this.StoreObj.setting_name;
        this.notification_subject = this.StoreObj.notification_subject;

        if (this.StoreObj.Action == "EDIT" || this.StoreObj.Action == "VIEW") {
          this.notification_text = this.StoreObj.setting_name;
        }
      }
    },
  },
  methods: {
    UserNameFilter() {
      this.getUsersLists();
    },

    async getOrganizationLists() {
      try {
        this.overlay = true;
        this.OrganizationList = [];

        let result = await client.graphql({
          query: ListOrganizations,
          variables: {
            input: {},
          },
        });
        var StoreArray = JSON.parse(result.data.ListOrganizations);
        this.OrganizationList = StoreArray.data.Items;
        this.filterarray = [];
        this.filterarray = activeOrgsSorted(this.OrganizationList);
        const picked = pickDefaultOrg(this.filterarray, this.organization_name);
        if (picked !== this.organization_name) {
          this.organization_name = picked;
          this.getUsersLists();
        }
        if (this.filterarray.length == 0) {
          this.NoData = "No Organization Found";
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        // this.NoData = error.errors[0].message;
        console.log("errorssss", error);
      }
    },

    toggle() {
      this.$nextTick(() => {
        if (this.allProductsSelected) {
          this.userName = [];
        } else {
          this.userName = this.UserList.map((item) => item.user_id);
        }
      });
    },
    async SendNotification() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.organization_name,
          user_ids:
            this.UserType == "ALL"
              ? undefined
              : (Array.isArray(this.userName) ? this.userName : [this.userName]).filter(Boolean),
          setting_id: this.StoreObj.setting_id,
          action: this.UserType,
        };

        let result = await client.graphql({
          query: SendNotificationsToUsers,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.SendNotificationsToUsers);
        if (ResultObject.status == "SUCCESS") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.CreateEditSpecEmitSend((this.Toggle = 2));
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText:
            (error && error.errors && error.errors[0] && error.errors[0].message) ||
            "Could not send the notification",
          Top: true,
          timeout: 3000,
        };
      }
    },
    async getUsersLists() {
      if (!this.organization_name) return;
      try {
        this.overlay = true;
        this.UserList = [];
        this.filtereduser = [];

        let result = await client.graphql({
          query: ListUsersOfOrganization,
          variables: {
            input: { organization_id: this.organization_name },
          },
        });
        var StoreArray = JSON.parse(result.data.ListUsersOfOrganization);
        this.UserList1 = StoreArray.data.Items;
        this.UserList = this.UserList1.filter(
          (val) =>
            val.user_type == "ADMIN" ||
            val.user_type == "MANAGER" ||
            val.user_type == "HOD" ||
            val.user_type == "MANAGEMENT" ||
            val.user_type == "MEDREP",
        );
        if (this.UserList.length == 0) {
          this.NoData = "No Users Found";
        }
        this.overlay = false;
      } catch (error) {
        // this.NoData = error.errors[0].message;
        console.log("errorssss", error);
        this.UserList = [];
        this.overlay = false;
      }
    },
    async getNotificationSetting() {
      try {
        this.overlay = true;
        this.SpecializationList = [];

        let result = await client.graphql({
          query: ListNotificationsSettings,
          variables: {
            input: { setting_status: "ACTIVE" },
          },
        });
        var self = this;
        var StoreArray = JSON.parse(result.data.ListNotificationsSettings);
        self.new_Remarkslist = StoreArray.data.items;
        this.text = self.new_Remarkslist.map((txt) => txt.setting_name);
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        console.log(error, "error");
        // this.NoData = error.errors[0].message;
        console.log("errorssss", error);
      }
    },
    CreateEditSpecEmitSend(Toggle) {
      this.$refs.form.reset();
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
<style scoped>
.FontSize {
  font-size: 12px;
}
.gradient-btn {
  background: -webkit-linear-gradient(145deg, #0a876e 30%, #0fc566 80%);
  /* -webkit-background-clip: text; */
  -webkit-text-fill-color: white;
}
.gradient-bg {
  background: -webkit-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -moz-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -o-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -ms-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
}
</style>
