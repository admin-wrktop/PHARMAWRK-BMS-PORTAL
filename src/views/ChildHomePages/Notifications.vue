<template>
  <div>
    <v-card class="elevation-0">
      <Overlay :overlay="overlay" />

      <SendNotificationDialog
        :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
        :StoreObj="StoreObj"
        :sendnotification_dialog="sendnotification_dialog"
        @clicked="CreateEditSpecEmitSend"
      />
      <AddNotificationSetting
        :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
        :StoreObj="StoreObj"
        :create_edit_notification_dialog="create_edit_notification_dialog"
        @clicked="CreateEditSpecEmit"
      />
      <!-- <WarningDialog
        :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
        :DialogWarning="DialogWarning"
        :StoreObj="StoreObj"
        @clicked="WarningEmit"
      /> -->
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-toolbar class="elevation-0 mt-2" density="compact" color="white">
            <v-select
              variant="outlined"
              density="compact"
              class="FontSize mt-6 mx-1"
              label="Status"
              v-model="setting_status"
              :items="StatusItems"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            ></v-select>

            <v-text-field
              density="compact"
              variant="outlined"
              label="Search"
              class="mt-6 MaxWidth mr-1 ml-1"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>

            <v-btn
              v-if="StoreObj.Action != 'LIST'"
              size="small"
              class="ml-1 primary"
              color="primary"
              variant="elevated"
              @click="create_edit_notification_dialog = true"
              v-on:click="StoreObj.Action = 'CREATE'"
            >
              <v-tooltip color="primary" activator="parent" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">mdi-plus</v-icon>
                </template>
                <span>Create Notification</span>
              </v-tooltip></v-btn
            >

            <v-btn
              v-if="StoreObj.Action == 'LIST'"
              size="small"
              class="mt-n4 ml-1 primary"
              @click="backMethod()"
              >Back
              <v-tooltip color="primary" activator="parent" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">mdi-back</v-icon>
                </template>
                <span>Back</span>
              </v-tooltip></v-btn
            >
          </v-toolbar>
        </v-col>

        <v-col class="mt-2" cols="12" sm="12" md="12" xs="12">
          <v-data-table
            density="compact"
            :items="new_Remarkslist"
            :search="search"
            :headers="headers"
            :items-per-page="50"
            hide-default-footer
            class="elevation-0 ma-1 TableClass"
            :no-data-text="NoData"
            @page-count="pageCount = $event"
          >
            <template v-slot:[`item.Actions`]="{ item }">
              <v-tooltip
                v-if="item.setting_status == 'ACTIVE'"
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    size="small"
                    color="green"
                    class="mr-2"
                    @click.stop="CheckEachItem(item, 'EDIT')"
                    >mdi-pencil</v-icon
                  >
                </template>
                <span>Edit Notification Text</span>
              </v-tooltip>

              <!-- <v-tooltip color="primary" activator="parent" location="bottom">
              <template
                v-if="item.setting_status == 'ACTIVE'"
                v-slot:activator="{ props }"
              >
                <v-icon
                  v-bind="props"
                  size="small"
                  color="red"
                  @click.stop="CheckEachItem(item, 'DEACTIVATE')"
                  >mdi-close-outline</v-icon
                >
              </template>
              <span>Deactivate</span>
            </v-tooltip> -->

              <v-tooltip
                v-if="item.setting_status == 'ACTIVE'"
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    size="small"
                    color="indigo darken-1"
                    class="ml-2"
                    @click.stop="CheckEachItem(item, 'SEND')"
                    >mdi-share</v-icon
                  >
                </template>
                <span>Send Notification</span>
              </v-tooltip>
              <!-- 
              <v-tooltip v-if="item.setting_status == 'ACTIVE'" location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                 v-bind="props"
                  size="small"
                  color="teal"
                  class="ml-2"
                  @click.stop="CheckEachItem(item, 'LIST')"
                  >mdi-play-protected-content</v-icon
                >
              </template>
              <span>List Notification</span>
            </v-tooltip> -->

              <v-tooltip
                v-if="item.setting_status == 'INACTIVE'"
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    size="small"
                    color="green"
                    @click.stop="CheckEachItem(item, 'ACTIVE')"
                    >mdi-check</v-icon
                  >
                </template>
                <span>Activate</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
// import WarningDialog from "@/components/warning/Dialogs/WarningDialog.vue";
import SendNotificationDialog from "@/components/ListNotification/SendNotificationDialog.vue";
import Overlay from "@/components/Overlay.vue";
import AddNotificationSetting from "@/components/Notification/Dialog/AddNotificationSetting.vue";

import {
  ListNotificationsSettings,
  // ListSentNotifications,
} from "@/graphql/queries.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  components: {
    SendNotificationDialog,
    AddNotificationSetting,
    // WarningDialog,
    Overlay,
  },
  props: {
    GetCurrentUserDetailsObj: Object,
  },

  watch: {
    setting_status(val) {
      this.getNotificationSetting(val);
      console.log(val, "jjjjjjj");
    },
    notification(val) {
      if (val == "Notification_List") {
        this.getNotificationSetting("ACTIVE");
      } else if (val == "Sent_List") {
        this.getListSentNotifications();
      }
    },
  },

  data: () => ({
    count: 0,
    notification_List: [
      { text: "Notification Text", value: "Notification_List" },
      { text: "Sent Notification", value: "Sent_List" },
    ],
    notification: "Notification_List",
    DialogWarning: false,
    new_Remarkslist: [],
    create_edit_notification_dialog: false,
    setting_status: "ACTIVE",
    page: 1,
    NoData: "",
    StatusItems: ["ACTIVE", "INACTIVE"],
    StoreObj: {
      Action: "DEFAULT",
    },
    search: null,
    overlay: true,
    sendnotification_dialog: false,
    items: [],
    ListNotification: [],
    headers: [],
    default_headers: [
      { title: "Notification Text", key: "setting_name" },
      { title: "Notification Subject", key: "notification_subject" },
      { title: "Actions", key: "Actions" },
    ],

    headerList: [
      { title: "Notification Text", key: "notification_text" },
      { title: "User Name", key: "user_name" },
      { title: "User Number", key: "user_full_number" },
      { title: "Designation", key: "designation_name" },
      { title: "View Status", key: "view_status" },
    ],
  }),

  mounted() {
    this.headers = this.default_headers;
    setTimeout(() => {
      this.getNotificationSetting("ACTIVE");
    }, 300);

    // this.getListSentNotifications();
  },

  methods: {
    backMethod() {
      this.StoreObj.Action = "DEFAULT";
      this.headers = this.default_headers;
      this.getNotificationSetting();
    },

    CreateEditSpecEmitSend(Toggle) {
      if (Toggle == 1) {
        this.sendnotification_dialog = false;
      } else if (Toggle == 2) {
        this.sendnotification_dialog = false;
        this.getNotificationSetting("ACTIVE");
      }
    },

    CreateEditSpecEmit(Toggle) {
      this.StoreObj = {};
      this.create_edit_notification_dialog = false;
      if (Toggle == 2) {
        this.create_edit_notification_dialog = false;
        this.getNotificationSetting("ACTIVE");
      }
    },

    async getNotificationSetting() {
      try {
        this.overlay = true;
        this.new_Remarkslist = [];
        let result = await client.graphql({
          query: ListNotificationsSettings,
          variables: {
            input: {
              setting_status: this.setting_status,
            },
          },
        });
        var self = this;
        var StoreArray = JSON.parse(result.data.ListNotificationsSettings);
        self.new_Remarkslist = StoreArray.data.items;

        console.log("Panajajsj", this.new_Remarkslist);
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        // this.NoData = error.errors[0].message;
        console.log("error", error);
      }
    },

    // async getListSentNotifications() {
    //   try {
    //     this.overlay = true;
    //     this.CampaignTaggingList = [];
    //     let result = await API.graphql(
    //       graphqlOperation(ListSentNotifications, {
    //         input: {
    //           organization_id: this.GetCurrentUserDetailsObj.organization_id,
    //           setting_id: this.StoreObj.setting_id,
    //         },
    //       })
    //     );
    //     var StoreArray = JSON.parse(result.data.ListSentNotifications);
    //     this.ListNotification = StoreArray.data.items;
    //     this.headers = this.headerList;
    //     this.new_Remarkslist = this.ListNotification;
    //     this.overlay = false;
    //   } catch (error) {
    //     this.overlay = false;
    //     this.NoData = error.errors[0].message;
    //   }
    // },

    WarningEmit(Toggle) {
      this.StoreObj = {};
      this.DialogWarning = false;
      if (Toggle == 2) {
        this.getNotificationSetting("ACTIVE");
      }
      this.StoreObj = {};
    },

    CheckEachItem(item, Action) {
      this.StoreObj = {};
      if (Action == "EDIT") {
        this.create_edit_notification_dialog = true;
        this.StoreObj = item;
        this.StoreObj.Action = Action;
      }
      if (Action == "LIST") {
        this.StoreObj = item;
        this.StoreObj.Action = Action;

        this.getListSentNotifications();
      }
      if (Action == "SEND") {
        this.sendnotification_dialog = true;
        this.StoreObj = item;
        this.StoreObj.Action = Action;
      }
      if (Action == "ACTIVE" || Action == "DEACTIVATE") {
        this.DialogWarning = true;
        this.StoreObj = item;
        this.StoreObj.Action = Action;
      }
    },
  },
};
</script>

<style></style>
