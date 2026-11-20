<template>
  <div>
    <Overlay :overlay="overlay" />
    <!-- <v-card class="elevation-0"> -->
    <v-row class="ml-2 mt-3" no-gutters>
      <v-col cols="12" sm="12" md="12" xs="12">
        <v-toolbar density="compact" class="elevation-0" color="white">
          <v-menu
            ref="menuFromDate"
            v-model="menuFromDate"
            :close-on-content-click="false"
            :return-value.sync="FromDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                density="compact"
                variant="outlined"
                v-model="FromDateValue"
                label="From Date"
                class="FontSize mr-4 ml-1 mt-6"
                append-inner-icon="mdi-calendar"
                @click:append="date ? getcal() : getcal()"
                readonly
                v-bind="props"
              ></v-text-field>
            </template>
            <v-card>
              <v-date-picker
                v-model="FromDate"
                :max="ToDate"
                no-title
                scrollable
                hide-header
              >
              </v-date-picker>
              <v-card-actions>
                <v-spacer />
                <v-btn text color="primary" @click="menuFromDate = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="confirmDate()"> OK </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-menu
            ref="menuToDate"
            v-model="menuToDate"
            :close-on-content-click="false"
            :return-value.sync="ToDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                density="compact"
                variant="outlined"
                v-model="ToDateValue"
                label="To Date"
                class="FontSize mr-4 ml-1 mt-6"
                append-inner-icon="mdi-calendar"
                @click:append="date ? getcal2() : getcal2()"
                readonly
                v-bind="props"
              ></v-text-field>
            </template>
            <v-card>
              <v-date-picker
                :min="FromDate"
                :max="new Date().toISOString().substr(0, 10)"
                v-model="ToDate"
                no-title
                scrollable
                hide-header
              >
              </v-date-picker>
              <v-card-actions>
                <v-spacer />
                <v-btn text color="primary" @click="menuToDate = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="confirmDate()"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <!-- <v-select
            item-title="designation_name"
            item-value="designation_name"
            density="compact"
            variant="outlined"
            class="FontSize mr-1"
            label="Role"
            v-model="designation"
            :items="DesignationList"
            @update:model-value="getFilters()"
          ></v-select> -->
          <v-select
            item-title="user_name"
            item-value="user_id"
            density="compact"
            variant="outlined"
            class="FontSize mr-1 mt-6"
            label="Employee"
            v-model="employe"
            :items="userList"
            :menu-props="{ contentClass: 'SelectFontSize' }"
          ></v-select>
          <v-tooltip color="primary" activator="parent" location="bottom">
            <template v-slot:activator="{ props }">
              <a>
                <v-icon
                  class="ml-0"
                  @click="DownloadMyExcel()"
                  color="primary"
                  v-bind="props"
                  size="large"
                >
                  mdi-file-export-outline
                </v-icon>
              </a>
            </template>
            <span class="text-white">Analytics Download</span>
          </v-tooltip>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-card-text class="mt-n3">
      <v-data-table
        density="compact"
        class="elevation-0 TableClass"
        :headers="LogsHeaders"
        :items="LogsItems"
        :no-data-text="NoData"
        @page-count="pageCount = $event"
        :page.sync="page"
        hide-default-footer
        fixed-header
        :height="height"
        :loading="loading"
        :items-per-page="300"
      >
        <template
          v-for="(h, i) in LogsHeaders"
          v-slot:[headerSlot(h)]="{ header }"
        >
          <div :key="i">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <span v-bind="props">{{ header.title || header.text }}</span>
              </template>
              <span>{{ header.tooltip_text }}</span>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:[`item.sl_no`]="{ item }">
          <div class="FontSize">
            {{ LogsItems.indexOf(item) + 1 }}
          </div>
        </template>
        <template v-slot:[`item.file_viewed_on`]="{ item }">
          <div class="FontSize">
            {{
              new Date(item.e_detail_logged_on)
                .toLocaleString()
                .replaceAll("/", "-")
            }}
          </div>
        </template>
        <template v-slot:[`item.user_name`]="{ item }">
          <v-tooltip color="primary" activator="parent" location="bottom">
            <template v-slot:activator="{ props }">
              <div class="FontSize" v-bind="props">
                {{
                  item.user_name.length >= 7
                    ? item.user_name.substr(0, 7) + "..."
                    : item.user_name
                }}
              </div>
            </template>
            <span class="primary">{{ item.user_name }}</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.pov_name`]="{ item }">
          <v-tooltip color="primary" activator="parent" location="bottom">
            <template v-slot:activator="{ props }">
              <div class="FontSize" v-bind="props">
                {{
                  item.pov_name.length >= 7
                    ? item.pov_name.substr(0, 7) + "..."
                    : item.pov_name
                }}
              </div>
            </template>
            <span class="primary">{{ item.pov_name }}</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.pov_identity`]="{ item }">
          <div
            v-if="item.pov_identity && item.pov_identity != '-'"
            class="FontSize"
          >
            {{ item.pov_identity }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.specialization_name`]="{ item }">
          <div
            v-if="item.specialization_name && item.specialization_name != '-'"
            class="FontSize"
          >
            {{ item.specialization_name }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.pov_category`]="{ item }">
          <div
            v-if="item.pov_category && item.pov_category != '-'"
            class="FontSize"
          >
            {{ item.pov_category }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.total_e_detail_time`]="{ item }">
          <div v-if="item.total_e_detail_time" class="FontSize">
            {{ item.total_e_detail_time }} Sec
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.admin_or_manager_name`]="{ item }">
          <div class="FontSize">{{ item.admin_or_manager_name }}</div>
        </template>
        <template v-slot:[`item.designation_name`]="{ item }">
          <v-tooltip color="primary" activator="parent" location="bottom">
            <template v-slot:activator="{ props }">
              <div class="FontSize" v-bind="props">
                {{
                  item.designation_name.length >= 8
                    ? item.designation_name.substr(0, 8) + "..."
                    : item.designation_name
                }}
              </div>
            </template>
            <span class="primary">{{ item.designation_name }}</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.employee_id`]="{ item }">
          <div class="FontSize">{{ item.employee_id }}</div>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip color="primary" activator="parent" location="bottom">
            <template v-slot:activator="{ props }">
              <div v-if="item.e_detail_logs[0].viewed_files" class="FontSize">
                {{ item.e_detail_logs[0].viewed_files.length }}
                <v-icon
                  v-if="item.e_detail_logs[0].viewed_files.length > 0"
                  @click.stop="checkItem(item, 'VIEW')"
                  color="primary"
                  v-bind="props"
                  size="small"
                >
                  mdi-information
                </v-icon>
              </div>
            </template>
            <span class="primary">View E-Detailing</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions class="py-0">
      <v-spacer />
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </v-card-actions>
    <!-- </v-card> -->
    <!-- <ViewEDetailsLogs
      :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
      :EDetailsDialog="EDetailsDialog"
      :StoreObj="StoreObj"
      @clicked="EDetailDialogEmit"
    /> -->
  </div>
</template>
<script>
import { dayStartMs, dayEndMs } from "@/utils/dates.js";
import Overlay from "@/components/Overlay.vue";
import moment from "moment";
import {
  ListAllEDetailLogs,
  ListAllDesignation,
  ListOrganizationUsers,
} from "@/graphql/queries.js";
// import ViewEDetailsLogs from "@/components/Report/ViewEDetailsLogs.vue";
import { DownloadExcel } from "@/mixins/Extras/DownloadExcel.js";
import { GetOrgUsers } from "@/mixins/ListUsers.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  components: {
    Overlay,
    // ViewEDetailsLogs,
  },
  props: {
    // GetCurrentUserDetailsObj: Object,
    ActionObj: Object,
  },
  mixins: [GetOrgUsers, DownloadExcel],
  data: () => ({
    NoData: "No records found",
    FromDate: new Date(),
    ToDate: new Date(),
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    FromDateValue: new Date().toISOString().substr(0, 10),
    ToDateValue: new Date().toISOString().substr(0, 10),
    menuToDate: false,
    menuFromDate: false,
    overlay: false,
    height: 0,
    loading: false,
    LogsItems: [],
    fixHeader: true,
    EDetailsDialog: false,
    StoreObj: {},
    designation: "ALL",
    DesignationList: [],
    EmployeeNames: [],
    employe: "ALL",
    page: 1,
    pageCount: 1,
    next_token: null,
    UserList: [],
    LogsHeaders: [
      {
        title: "#",
        key: "sl_no",
      },
      {
        title: "Month",
        key: "current_month",
        tooltip_text: "Month",
        width: "85px",
      },
      {
        title: "Employee",
        key: "user_name",
        tooltip_text: "Employee",
      },
      {
        title: "Doctor Name",
        key: "pov_name",
        tooltip_text: "Doctor Name",
      },
      {
        title: "Doctor Id",
        key: "pov_identity",
        tooltip_text: "Doctor ID",
      },
      {
        title: "Doctor specialization",
        key: "specialization_name",
        tooltip_text: "Doctor specialization",
      },
      {
        title: "Category Name",
        key: "pov_category",
        tooltip_text: "Category Name",
      },
      // {
      //   title: "E-Id",
      //   key: "employee_id",
      //    tooltip_text:"Employee ID"
      // },
      {
        title: "Designation",
        key: "designation_name",
        tooltip_text: "Designation",
      },
      {
        title: "FLR",
        key: "admin_or_manager_name",
        tooltip_text: "First Level Reporting",
      },
      //   {
      //   title: "#SLR",
      //   key: "secondary_reporter_name",
      //   tooltip_text: "Second Level Manager",
      // },
      {
        title: "Avg Call Time",
        key: "total_e_detail_time",
        tooltip_text: "Avg Call Time",
      },
      // {
      //   title: "Product",
      //   key: "user_name",
      // },

      {
        title: "Visited on",
        key: "file_viewed_on",
        tooltip_text: "File Viewed On",
      },
      {
        title: "Slides",
        key: "action",
        tooltip_text: "Slides",
      },
    ],
    store_obj: {},
  }),

  computed: {
    formattedFromDate() {
      return this.FromDate
        ? new Date(this.FromDate)
            .toLocaleDateString("en-GB")
            .replaceAll("/", "-")
        : "";
    },
    formattedToDate() {
      return this.ToDate
        ? new Date(this.ToDate).toLocaleDateString("en-GB").replaceAll("/", "-")
        : "";
    },
  },
  watch: {
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        // var toDatetimestamp = new Date(
        //   this.ToDate.split("-")[0],
        //   this.ToDate.split("-")[1] - 1,
        //   this.ToDate.split("-")[2],
        //   23,
        //   59,
        //   59
        // ).getTime();
        // var fromDatetimestamp = new Date(
        //   this.FromDate.split("-")[0],
        //   this.FromDate.split("-")[1] - 1,
        //   this.FromDate.split("-")[2],
        //   23,
        //   59,
        //   59
        // ).getTime();

        this.geEDtailingLogs(
          dayStartMs(this.FromDateValue),
          dayEndMs(this.ToDateValue),
          null,
          null,
        );
      }
    },
    employe(val) {
      if (val != "") {
        // var toDatetimestamp = new Date(
        //   this.ToDate.split("-")[0],
        //   this.ToDate.split("-")[1] - 1,
        //   this.ToDate.split("-")[2],
        //   23,
        //   59,
        //   59
        // ).getTime();
        // var fromDatetimestamp = new Date(
        //   this.FromDate.split("-")[0],
        //   this.FromDate.split("-")[1] - 1,
        //   this.FromDate.split("-")[2],
        //   23,
        //   59,
        //   59
        // ).getTime();
        this.geEDtailingLogs(
          dayStartMs(this.FromDateValue),
          dayEndMs(this.ToDateValue),
          null,
          val,
        );
      }
    },
  },

  mounted() {
    this.FromDateValue = new Date(
      Math.floor(new Date().getTime() / 1000 - 2629743) * 1000,
    )
      .toISOString()
      .substr(0, 10);
    this.height = window.innerHeight - 280;
    // var toDatetimestamp = new Date(
    //   this.ToDate.split("-")[0],
    //   this.ToDate.split("-")[1] - 1,
    //   this.ToDate.split("-")[2],
    //   23,
    //   59,
    //   59
    // ).getTime();
    // var fromDatetimestamp = new Date(
    //   this.FromDate.split("-")[0],
    //   this.FromDate.split("-")[1] - 1,
    //   this.FromDate.split("-")[2],
    //   23,
    //   59,
    //   59
    // ).getTime();

    this.geEDtailingLogs(
      dayStartMs(this.FromDateValue),
      dayEndMs(this.ToDateValue),
      null,
      null,
    );
    this.getDesignationLists();
    this.getUsersLists();
    this.getOrgorganisationUsers(this.ActionObj.organization_id);
    // this.geEDtailingLogs(fromDatetimestamp, toDatetimestamp, null, null);

    // this.getDesignationLists();
    // this.getUsersLists();
  },
  methods: {
    headerSlot(h) {
      return "header." + (h.key || h.value);
    },
    confirmDate() {
      if (this.ToDate) {
        this.ToDateValue = this.formatDate(this.ToDate);
        this.menuToDate = false;
      }
      if (this.FromDate) {
        this.FromDateValue = this.formatDate(this.FromDate);
        this.menuFromDate = false;
      }
      // Reload with the dates just picked (either OK button).
      this.getFilters();
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    getFilters() {
      this.next_token = "";
      // var toDatetimestamp = new Date(
      //   this.ToDate.split("-")[0],
      //   this.ToDate.split("-")[1] - 1,
      //   this.ToDate.split("-")[2],
      //   23,
      //   59,
      //   59
      // ).getTime();
      // var fromDatetimestamp = new Date(
      //   this.FromDate.split("-")[0],
      //   this.FromDate.split("-")[1] - 1,
      //   this.FromDate.split("-")[2],
      //   0,
      //   0,
      //   0
      // ).getTime();
      this.geEDtailingLogs(
        dayStartMs(this.FromDateValue),
        dayEndMs(this.ToDateValue),
        this.designation,
        this.employe,
        this.next_token,
      );
    },

    checkItem(item, action) {
      this.EDetailsDialog = true;
      this.StoreObj = item;
      // this.StoreObj.e_detail_logs[0].viewed_files[0].file_viewed_duration == 0
      //   ? 1
      //   : this.StoreObj.e_detail_logs[0].viewed_files[0].file_viewed_duration
      // console.log('eeeeeee', this.StoreObj.e_detail_logs[0].viewed_files)
      this.StoreObj.action = action;
    },
    EDetailDialogEmit(Toggle) {
      if (Toggle == 1 || Toggle == 2) {
        this.EDetailsDialog = false;
      }
    },
    async geEDtailingLogs(fromdate, todate, designation, employe) {
      try {
        this.overlay = true;
        this.loading = true;

        let result = await client.graphql({
          query: ListAllEDetailLogs,
          variables: {
            input: {
              organization_id: this.ActionObj.organization_id,
              from_date: fromdate,
              to_date: todate,
              designation_name: designation == "ALL" ? null : designation,
              user_employee_id: employe == "ALL" ? null : employe,
              next_token:
                this.next_token != undefined &&
                this.next_token != null &&
                this.next_token != ""
                  ? this.next_token
                  : null,
              limit: 500,
            },
          },
        });
        var LogList = JSON.parse(result.data.ListAllEDetailLogs).data.items;
        console.log("edtaills", LogList);

        // this.LogsItems = LogList;
        if (!this.next_token) {
          this.LogsItems = JSON.parse(
            result.data.ListAllEDetailLogs,
          ).data.items;
          this.next_token = JSON.parse(
            result.data.ListAllEDetailLogs,
          ).data.next_token;
          console.log("First next Token", this.next_token);
        } else {
          for (
            let i = 0;
            i < JSON.parse(result.data.ListAllEDetailLogs).data.items.length;
            i++
          ) {
            this.LogsItems.push({
              ...JSON.parse(result.data.ListAllEDetailLogs).data.items[i],
            });
          }
          this.next_token = JSON.parse(
            result.data.ListAllEDetailLogs,
          ).data.next_token;
          console.log("Else next Token", this.next_token);
        }
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.LogsItems = [];
        console.log("ListAllEDetailLogsError", error);
        this.NoData = (error && error.errors && error.errors[0] && error.errors[0].message) || "No data available";
      }
    },
    async getUsersLists(user_type) {
      try {
        this.overlay = true;
        this.UserList = [];
        this.filtereduser = [];

        let result = await client.graphql({
          query: ListOrganizationUsers,
          variables: {
            input: {
              organization_id: this.ActionObj.organization_id,
              //   user_id: this.$store.getters.get_current_user.user_id,
              user_type: user_type,
              user_status: "ACTIVE",
            },
          },
        });
        var StoreArray = JSON.parse(result.data.ListOrganizationUsers);
        this.UserList = StoreArray.data.Items;
        this.UserList.unshift("ALL");
        this.overlay = false;
      } catch (error) {
        this.UserList = [];
        this.overlay = false;
      }
    },

    async getDesignationLists() {
      try {
        this.overlay = true;
        this.DesignationList = [];

        let result = await client.graphql({
          query: ListAllDesignation,
          variables: {
            input: {
              organization_id: this.ActionObj.organization_id,
            },
          },
        });
        var self = this;
        var StoreArray = JSON.parse(result.data.ListAllDesignation);
        self.DesignationList = StoreArray.data.items;
        self.DesignationList.unshift("ALL");
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
      }
    },
    DownloadMyExcel() {
      let excelHeader = this.LogsHeaders.slice(0, -1).map((header) => ({
        label: header.title,
        value: header.key,
      }));

      let ExcelData = this.LogsItems.map((item) => {
        let object = { ...item };
        object.file_viewed_on = new Date(item.e_detail_logged_on)
          .toLocaleString()
          .replaceAll("/", "-");
        object.total_e_detail_time = item.total_e_detail_time;

        return object;
      });

      excelHeader.splice(0, 1);

      this.DownloadExcelMethod(excelHeader, ExcelData, "E-DetailedReport");
    },
    convertDate(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    getcal() {
      this.menuFromDate = true;
    },
    getcal2() {
      this.menuToDate = true;
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
.v-data-table-headers th {
  white-space: nowrap;
}
</style>
