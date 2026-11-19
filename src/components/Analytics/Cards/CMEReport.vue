<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-row no gutters class="ml-0 mt-2">
      <v-col cols="12" sm="12" md="12" xs="12">
        <v-toolbar class="elevation-0" color="white">
          <!-- <v-menu
            ref="menu"
            v-model="MonthPickerMenu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                class="mr-2 FontSize maxWidthVariant1 mt-2"
                variant="outlined"
                density="compact"
                v-model="date"
                label="Select Month"
                append-inner-icon="mdi-calendar"
                readonly
                v-bind="props"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" type="month" no-title scrollable>
              <v-spacer/>
              <v-btn text color="primary" @click="MonthPickerMenu = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="SaveSelectedMonth(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu> -->

          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                class="mr-2 FontSize mt-2"
                variant="outlined"
                density="compact"
                v-model="date"
                label="Select Month"
                @click:append="date ? getcal() : getcal()"
                readonly
                v-bind="props"
              ></v-text-field>
            </template>
            <v-card>
              <div class="d-flex align-center justify-space-between pa-2">
                <v-btn icon variant="flat" @click="changeYear(-1)">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <div>{{ currentYear }}</div>
                <v-btn icon variant="flat" @click="changeYear(1)">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
              <v-date-picker-months
                v-model="DateValue"
                type="month"
                no-title
                scrollable
                hide-header
              >
              </v-date-picker-months>
              <v-card-actions>
                <v-spacer />
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="getDate(date)"> OK </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-spacer />
          <v-autocomplete
            variant="outlined"
            density="compact"
            label="Designation"
            :items="DesignationList"
            v-model="FilterDesignation"
            item-title="designation_name"
            item-value="designation_name"
            class="mx-2 mt-2"
            return-object
          ></v-autocomplete>
          <v-autocomplete
            variant="outlined"
            density="compact"
            label="Host"
            :items="userList"
            v-model="FilterHost"
            item-title="user_name"
            item-value="user_id"
            class="mr-2 mt-2"
            return-object
          ></v-autocomplete>
          <v-autocomplete
            variant="outlined"
            density="compact"
            label="CME Status"
            :items="CMEStatusItems"
            v-model="CMEStatus"
            item-title="text"
            item-value="value"
            class="mr-2 FontSize mt-2"
          ></v-autocomplete>
          <v-text-field
            v-model="search"
            label="Search"
            density="compact"
            variant="outlined"
            class="FontSize mt-2"
            append-inner-icon="mdi-magnify"
            style="max-width: 300px"
          ></v-text-field>
          <v-card-actions class="">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <a>
                  <v-icon
                    class="mt-n6"
                    @click="DownloadMyExcel()"
                    color="primary"
                    v-bind="props"
                    size="x-large"
                  >
                    mdi-file-export-outline
                  </v-icon>
                </a>
              </template>
              <span class="text-white">Excel Download</span>
            </v-tooltip>
          </v-card-actions>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="12" class="mt-n2">
        <v-data-table
          :headers="headers"
          :items="ScheduledCMEList"
          density="compact"
          :search="search"
          class="dtwidth TableClass FontSize"
          @click:row="rowClick"
          fixed-header
          :height="height"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              {{ ScheduledCMEList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.view`]="{ item }">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <div
                  v-if="item.cme_attachments && item.cme_attachments.length > 0"
                  class="FontSize"
                >
                  {{ item.cme_attachments.length
                  }}<v-icon
                    class="ml-2"
                    size="small"
                    v-bind="props"
                    color="primary"
                    @click.stop="ViewCommentMethod(item)"
                    >mdi-information</v-icon
                  >
                </div>
                <div v-else>-</div>
              </template>
              <span class="text-white">View Attachments </span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.cme_scheduled_on`]="{ item }">
            <div class="FontSize">
              {{ new Date(item.cme_scheduled_on).toLocaleString() }}
            </div>
          </template>
          <template v-slot:[`item.event_type`]="{ item }">
            <div class="FontSize">{{ item.event_type }}</div>
          </template>
          <template v-slot:[`item.last_modified_on`]="{ item }">
            <div v-if="item.last_modified_on" class="FontSize">
              {{ new Date(item.last_modified_on).toLocaleString() }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.cme_topic`]="{ item }">
            <div class="FontSize">{{ item.cme_topic }}</div>
          </template>
          <template v-slot:[`item.initiator_user_name`]="{ item }">
            <div class="FontSize">{{ item.initiator_user_name }}</div>
          </template>
          <!-- <template v-slot:[`item.event_address`]="{ item }">
              <div class="FontSize">{{ item.event_address }}</div>
            </template> -->
          <template v-slot:[`item.event_address`]="{ item }">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <div class="FontSize" v-bind="props">
                  {{
                    item.event_address.length >= 12
                      ? item.event_address.substr(0, 12) + "..."
                      : item.event_address
                  }}
                </div>
              </template>
              <span class="primary">{{ item.event_address }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.cme_scheduled_status`]="{ item }">
            <div class="FontSize">
              {{
                item.cme_scheduled_status == "IN_PROGRESS"
                  ? "IN PROGRESS"
                  : item.cme_scheduled_status
              }}
            </div>
          </template>
          <template v-slot:[`item.event_host_designation`]="{ item }">
            <div class="FontSize">{{ item.event_host_designation }}</div>
          </template>
          <template v-slot:[`item.event_host_name`]="{ item }">
            <div class="FontSize">{{ item.event_host_name }}</div>
          </template>

          <template v-slot:[`item.cme_feedback`]="{ item }">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <div v-if="item.cme_feedback" class="FontSize" v-bind="props">
                  {{
                    item.cme_feedback.length >= 12
                      ? item.cme_feedback.substr(0, 12) + "..."
                      : item.cme_feedback
                  }}
                </div>
                <div v-else>-</div>
              </template>
              <span class="primary">{{ item.cme_feedback }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.event_duration`]="{ item }">
            <div
              class="FontSize"
              v-text="
                `${item.event_duration.toString()} ${
                  item.event_duration == 1 ? 'Hr' : 'Hrs'
                }`
              "
            ></div>
          </template>
          <template v-slot:[`item.my_learnings`]="{ item }">
            <v-btn
              v-if="
                item.rep_my_learnings != undefined &&
                item.manager_my_learnings != undefined
              "
              size="x-small"
              icon
              color="primary"
              @click.stop="MyLearningDialogMethod(item)"
              ><v-icon size="small">mdi-information</v-icon></v-btn
            >
            <div v-else>-</div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- <CMEAttendee
      :attendeeDialog="attendeeDialog"
      :obj="obj"
      @clicked="emitMethod"
    />
    <CMEAttachmnet
      :completeactiondialog="completeactiondialog"
      :StoreObj="StoreObj"
      :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
      @clicked="statusEmit"
    /> -->
  </div>
</template>

<script>
import {
  ListScheduledCMEs,
  ListAllDesignations,
  ListUsers,
} from "@/graphql/queries.js";
import Overlay from "@/components/Overlay.vue";
// import { parseTime } from "@/utils";
// import CMEAttendee from "@/components/Report/CMEAttendee.vue";
// import CMEAttachmnet from "@/components/Report/CMEAttachmnet.vue";
import { DownloadExcel } from "@/mixins/Extras/DownloadExcel.js";
import { GetOrgUsers } from "@/mixins/ListUsers.js";
// import { GetAllDesignationsLists } from "@/mixins/Designation/DesignationList.js";
// import MyLearningReportDialog from "@/components/CME/MyLearningDialog.vue";
import { GetOrgDesignations } from "@/mixins/ListDesignation.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    ActionObj: Object,
  },
  components: {
    Overlay,
    // CMEAttendee,
    // CMEAttachmnet,
    // MyLearningReportDialog,
  },
  mixins: [DownloadExcel, GetOrgUsers, GetOrgDesignations],
  data: () => ({
    date: new Date().toISOString().substring(0, 7),
    currentYear: new Date().getFullYear(),
    DateValue: new Date(),
    attendeeDialog: false,
    completeactiondialog: false,
    fixHeader: true,
    MonthPickerMenu: false,
    menu: false,
    MyLearningDialog: false,
    search: "",
    DesignationList: [],
    UserList: [],
    FilterDesignation: "ALL",
    FilterHost: "ALL",
    height: 0,
    ScheduledCMEList: [],
    NoData: "",
    overlay: false,
    headers: [
      { title: "#", key: "sl_no" },
      { title: "CME Topic", key: "cme_topic" },
      { title: "Scheduled On", key: "cme_scheduled_on" },
      { title: "Event Type", key: "event_type" },
      { title: "Event Coordinator", key: "initiator_user_name" },
      { title: "Event Address", key: "event_address" },
      { title: "Status", key: "cme_scheduled_status" },
      { title: "Host Name", key: "event_host_name" },
      { title: "Designation", key: "event_host_designation" },
      { title: "Last modified On", key: "last_modified_on" },
      { title: "My Learnings", key: "my_learnings" },
      { title: "Feedback", key: "cme_feedback" },
      { title: "Attachments", key: "view" },
      { title: "Duration", key: "event_duration" },
    ],
    obj: {},
    StoreObj: {},
    CMEStatus: "IN_PROGRESS",
    CMEStatusItems: [
      {
        text: "COMPLETED",
        value: "COMPLETED",
      },
      {
        text: "IN PROGRESS",
        value: "IN_PROGRESS",
      },
    ],
  }),
  watch: {
    FilterDesignation() {
      this.getScheduledCME(this.date);
    },
    FilterHost() {
      this.getScheduledCME(this.date);
    },
    CMEStatus() {
      this.getScheduledCME(this.date);
    },
    FilterHost(val) {
      if (val != "") {
        this.getScheduledCME(this.date);
      }
    },
  },
  getcal() {
    this.menu = true;
  },
  async mounted() {
    this.height = window.innerHeight - 180;
    this.getScheduledCME(this.date);
    await this.getOrgorganisationDesignations(this.ActionObj.organization_id);
    await this.getOrgorganisationUsers(this.ActionObj.organization_id);
  },
  methods: {
    changeYear(direction) {
      const currentYear = new Date().getFullYear();
      const minYear = currentYear - 1; // Restrict to the previous year and current year

      // Update the year only if it falls within the allowed range
      const newYear = this.currentYear + direction;
      if (newYear >= minYear && newYear <= currentYear) {
        this.currentYear = newYear; // Increment or decrement the year
        const newDate = new Date(this.currentYear, 0, 1); // Update the date with the new year
        this.DateValue = newDate.toISOString().substr(0, 10); // Update the DateValue
      }
    },
    getDate() {
      if (this.DateValue != "" && this.DateValue != null) {
        console.log("Selected value:", this.DateValue);

        let selectedYear = parseInt(this.currentYear);
        let selectedMonth = parseInt(this.DateValue) + 1;

        let date = new Date(selectedYear, selectedMonth);
        this.date = date.toISOString().substring(0, 7);

        console.log("Formatted Date:", this.date);

        this.next_token = null;
        this.getScheduledCME(this.date);

        this.menu = false;
      } else {
        this.menu = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "No data available for selected month",
          timeout: 2000,
        };
      }
    },
    SaveSelectedMonth(date) {
      this.$refs.menu.save(date);
      this.MonthPickerMenu = false;
      this.getScheduledCME(date);
    },
    ViewCommentMethod(item) {
      this.StoreObj = item;
      // console.log("storeee", this.StoreObj);
      this.completeactiondialog = true;
    },
    rowClick(event, item) {
      // console.log(item, "item");
      this.obj = item.item;
      // console.log(this.obj, "jjjjjjjjjjjj");
      this.attendeeDialog = true;
    },
    async getScheduledCME(Month, CMEStatus) {
      try {
        console.log("ActionObj", this.ActionObj);
        this.overlay = true;
        this.ScheduledCMEList = [];

        let result = await client.graphql({
          query: ListScheduledCMEs,
          variables: {
            input: {
              month: Month,
              organization_id: this.ActionObj.organization_id,
              cme_scheduled_status: this.CMEStatus,
              event_host_user_id:
                this.FilterHost != undefined ? this.FilterHost.user_id : null,
              event_host_designation:
                this.FilterDesignation != undefined
                  ? this.FilterDesignation.designation_name
                  : null,
            },
          },
        });
        // console.log("result", result);
        var self = this;
        var StoreArray = JSON.parse(result.data.ListScheduledCMEs);
        self.ScheduledCMEList = StoreArray.data.items;
        console.log("self.ScheduledCMEList", self.ScheduledCMEList);
        self.overlay = false;
      } catch (error) {
        this.overlay = false;
        console.log("ListCmeError", error);
        // this.NoData = error.errors[0].message;
      }
    },
    async getDesignationLists() {
      try {
        this.overlay = true;
        this.DesignationList = [];

        let result = await client.graphql({
          query: ListAllDesignations,
          variables: {
            input: {
              setting_status: "ACTIVE",
              organization_id: this.ActionObj.organization_id,
            },
          },
        });
        var self = this;
        var StoreArray = JSON.parse(result.data.ListAllDesignations);
        self.DesignationList = StoreArray.data.items;
        // console.log("self.DesignationList", self.DesignationList);
        self.DesignationList.unshift("ALL");
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        console.log("DesignationError", error);
        // this.NoData = error.errors[0].message;
      }
    },
    async getUsersLists(user_type) {
      try {
        this.overlay = true;
        this.UserList = [];
        this.filtereduser = [];

        let result = await client.graphql({
          query: ListUsers,
          variables: {
            input: {
              organization_id: this.ActionObj.organization_id,
              user_type: user_type,
              user_status: "ACTIVE",
            },
          },
        });
        var StoreArray = JSON.parse(result.data.ListUsers);
        this.UserList = StoreArray.data.Items;
        this.UserList.unshift("ALL");
        if (this.UserList.length == 0) {
          this.NoData = "No Users Found";
        }
        this.overlay = false;
      } catch (error) {
        console.log("UsersError", error);
        // this.NoData = error.errors[0].message;
        this.UserList = [];
        this.overlay = false;
      }
    },
    emitMethod(Toggle) {
      if (Toggle == 1) {
        this.attendeeDialog = false;
      }
    },
    statusEmit() {
      this.completeactiondialog = false;
    },
    DownloadMyExcel() {
      this.ScheduledCMEList.forEach((item) => {
        item.cme_scheduled_on = new Date(
          item.cme_scheduled_on,
        ).toLocaleString();
      });
      let excelHeader = this.headers.map((header) => ({
        label: header.title,
        value: header.key,
      }));

      this.DownloadExcelMethod(
        excelHeader,
        this.ScheduledCMEList,
        "CME REPORT",
      );
      this.getScheduledCME(this.date);
    },
    // DownloadMyExcel() {
    //   this.ScheduledCMEList.forEach((item) => {
    //     item.cme_scheduled_on = new Date(
    //       item.cme_scheduled_on
    //     ).toLocaleString();
    //   });

    //   let worksheetData = [
    //     ["CME REPORT"],
    //     [
    //       "CME Topic",
    //       "CME Scheduled On",
    //       "Event Type",
    //       "User Name",
    //       "Event Address",
    //       "Status",
    //       "Event Host Name",
    //       "Designation",
    //       "Reps Learnings",
    //       "Manager Learnings",
    //       "Feedback",
    //       "Duration",
    //     ],
    //   ];
    //   this.ScheduledCMEList.forEach((item) => {
    //     worksheetData.push([
    //       item.cme_topic,
    //       item.cme_scheduled_on,
    //       item.event_type,
    //       item.initiator_user_name,
    //       item.event_address,
    //       item.cme_scheduled_status,
    //       item.event_host_name,
    //       item.event_host_designation,
    //       item.rep_my_learnings != undefined && item.rep_my_learnings != ""
    //         ? item.rep_my_learnings
    //         : "-",
    //       item.manager_my_learnings != undefined &&
    //       item.manager_my_learnings != ""
    //         ? item.manager_my_learnings
    //         : "-",
    //       item.cme_feedback,
    //       item.event_duration,
    //     ]);
    //   });

    //   const workbook = XLSX.utils.book_new();
    //   const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    //   worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }];
    //   worksheet["!cols"] = Array(10).fill({ wch: 20 });

    //   XLSX.utils.book_append_sheet(workbook, worksheet, "CME Report");
    //   XLSX.writeFile(workbook, "CME REPORT.xlsx");
    // },
    MyLearningDialogMethod(item) {
      this.StoreObj = item;
      this.MyLearningDialog = true;
    },
    MyLearningEmit() {
      this.MyLearningDialog = false;
    },
  },
};
</script>

<style scoped>
.FontSize {
  font-size: 12px;
}
.dtwidth {
  text-overflow: ellipsis;
}
.v-data-table-header th {
  white-space: nowrap;
}
</style>
