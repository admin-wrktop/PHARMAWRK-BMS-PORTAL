<template>
  <div>
    <v-card :height="CardHeight" flat>
      <Overlay :overlay="overlay" />

      <!-- <ViewDetails
          :attendviewdetails="attendviewdetails"
          :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
          :StoreObj="StoreObj"
          @clicked="ViewDetailDialogEmit"
          :view_Details_dialog="view_Details_dialog"
          :locationArray="locationArray"
        />
  
        <EditViewDetails
          :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
          :StoreObj="StoreObj"
          @clicked="ViewDetailDialogEmit1"
          :view_Details_dialog1="view_Details_dialog1"
          :locationArray="locationArray"
        /> -->

      <v-row class="ml-3 mt-2" no-gutters>
        <v-col cols="12" sm="12" md="12" xs="12">
          <v-toolbar class="elevation-0" color="white">
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
                  class="FontSize mr-1 mt-2"
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
                  <v-btn text color="primary" @click.stop="confirmDate()">
                    OK
                  </v-btn>
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
                  class="FontSize mr-1 mt-2"
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
                    v-on:click="getAttendenceFilter()"
                    @click.stop="confirmDate()"
                  >
                    OK
                  </v-btn></v-card-actions
                ></v-card
              >
            </v-menu>
            <v-select
              item-title="text"
              item-value="value"
              density="compact"
              variant="outlined"
              class="FontSize mr-1 mt-2"
              label="Attendence Status"
              v-model="AttendenceFilter"
              :items="AttendenceStatus"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            >
            </v-select>

            <!-- <v-select
              item-title="designation_name"
              item-value="designation_name"
              density="compact"
              variant="outlined"
              class="FontSize mr-1"
              label="Role"
              v-model="designation"
              :items="DesignationList"
            >
            </v-select> -->
            <v-select
              density="compact"
              variant="outlined"
              class="FontSize mr-1 mt-2"
              label="Employee"
              v-model="employe"
              :items="userList"
              item-title="user_name"
              item-value="user_id"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            >
            </v-select>
            <v-text-field
              density="compact"
              variant="outlined"
              class="FontSize mr-1 mt-2"
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
            >
            </v-text-field>
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

        <v-col cols="12" sm="12" md="12" xs="12" class="mt-2">
          <!-- <Overlay :overlay="overlay" /> -->
          <v-data-table
            density="compact"
            :search="search"
            :headers="headers"
            :items="AttendenceList"
            class="dtwidth TableClass elevation-0 mt-n6"
            @page-count="pageCount = $event"
            hide-default-footer
            :page.sync="page"
            :loading="loading"
            fixed-header
            :height="height"
            :items-per-page="200"
          >
            <template v-slot:[`item.num`]="{ item }">
              <span v-if="item.num == undefined">-</span>

              <span v-else class="FontSize overflow">{{ item.num }}</span>
            </template>

            <template v-slot:[`item.user_employee_id`]="{ item }">
              <span v-if="item.user_employee_id == undefined">-</span>
              <span v-else class="FontSize overflow">{{
                item.user_employee_id
              }}</span>
            </template>

            <template v-slot:[`item.designation`]="{ item }">
              <v-tooltip color="primary" activator="parent" location="bottom">
                <template v-slot:activator="{ props }">
                  <div v-if="item.designation" class="FontSize" v-bind="props">
                    {{
                      item.designation.length > 6
                        ? item.designation.substr(0, 6) + "...."
                        : item.designation
                    }}
                  </div>
                  <div v-else>-</div>
                </template>
                <span class="primary">{{ item.designation }}</span>
              </v-tooltip>
            </template>

            <template v-slot:[`item.admin_or_manager_name`]="{ item }">
              <v-tooltip
                v-if="item.admin_or_manager_name"
                color="primary"
                activator="parent"
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <div class="FontSize" v-bind="props">
                    {{
                      item.admin_or_manager_name.length > 6
                        ? item.admin_or_manager_name.substr(0, 6) + "...."
                        : item.admin_or_manager_name
                    }}
                  </div>
                </template>
                <span class="primary">{{ item.admin_or_manager_name }}</span>
              </v-tooltip>
              <div v-else>-</div>
            </template>

            <template v-slot:[`item.user_name`]="{ item }">
              <v-tooltip color="primary" activator="parent" location="bottom">
                <template v-slot:activator="{ props }">
                  <div v-if="item.user_name" class="FontSize" v-bind="props">
                    {{
                      item.user_name.length > 6
                        ? item.user_name.substr(0, 6) + "...."
                        : item.user_name
                    }}
                  </div>
                  <div v-else>-</div>
                </template>
                <span class="primary">{{ item.user_name }}</span>
              </v-tooltip>
            </template>

            <template v-slot:[`item.attendance_date`]="{ item }">
              <v-tooltip color="primary" activator="parent" location="bottom">
                <template v-slot:activator="{ props }">
                  <div
                    v-if="item.attendance_date"
                    class="FontSize"
                    v-bind="props"
                  >
                    {{
                      item.attendance_date.length > 10
                        ? item.attendance_date.substr(0, 10) + "...."
                        : item.attendance_date
                    }}
                  </div>
                  <div v-else>-</div>
                </template>
                <span class="primary">{{ item.attendance_date }}</span>
              </v-tooltip>
            </template>

            <template v-slot:[`item.territory_names`]="{ item }">
              <v-tooltip
                v-if="item.territory_names"
                color="primary"
                activator="parent"
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <div class="FontSize" v-bind="props">
                    {{
                      item.territory_names.length > 6
                        ? item.territory_names.substr(0, 6) + "...."
                        : item.territory_names
                    }}
                  </div>
                </template>
                <span class="primary">{{ item.territory_names }}</span>
              </v-tooltip>
              <div v-else>-</div>
            </template>

            <template v-slot:[`item.login_time`]="{ item }">
              <div v-if="item.login_time != undefined" class="FontSize">
                {{ convertDate(item.login_time).split(" ")[1] }}
                {{ convertDate(item.login_time).split(" ")[2] }}
              </div>
              <div v-else>-</div>
            </template>

            <template v-slot:[`item.logout_time`]="{ item }">
              <div class="FontSize" v-if="item.logout_time != undefined">
                {{ convertDate(item.logout_time).split(" ")[1] }}
                {{ convertDate(item.logout_time).split(" ")[2] }}
              </div>
              <div v-else>-</div>
            </template>

            <template v-slot:[`item.login_duration`]="{ item }">
              <div class="FontSize">
                {{
                  item.login_duration != undefined ||
                  item.login_duration != null
                    ? getlogDuration(item)
                    : "0"
                }}
                min.
              </div>
            </template>

            <template v-slot:[`item.attendance_type`]="{ item }">
              <span v-if="item.attendance_type == undefined">-</span>
              <span v-else class="FontSize overflow text-blue">{{
                item.attendance_type
              }}</span>
            </template>

            <template v-slot:[`item.user_full_number`]="{ item }">
              <span v-if="item.user_full_number == undefined">-</span>
              <span v-else class="FontSize overflow">{{
                item.user_full_number
              }}</span>
            </template>

            <template v-slot:[`item.user_status`]="{ item }">
              <span v-if="item.user_status == undefined">-</span>
              <span v-else class="FontSize overflow">{{
                item.user_status
              }}</span>
            </template>

            <template v-slot:[`item.territory_hq`]="{ item }">
              <div v-if="item.territory_hq == true">
                <v-icon size="small" color="primary">mdi-check</v-icon>
              </div>
              <div v-else-if="item.territory_hq == false">
                <v-icon size="small" color="red">mdi-cancel</v-icon>
              </div>
              <div v-else>-</div>
            </template>

            <template v-slot:[`item.attendance_status`]="{ item }">
              <div
                class="text-green FontSize"
                v-if="item.attendance_status == 'IN'"
              >
                {{ item.attendance_status }}
              </div>
              <div
                v-else-if="item.attendance_status == 'OUT'"
                class="text-green FontSize"
              >
                {{ item.attendance_status }}
              </div>
              <div
                v-else-if="item.attendance_status == 'ABSENT'"
                class="text-red FontSize"
              >
                {{ item.attendance_status }}
              </div>

              <div
                v-else-if="item.attendance_status == 'WEEK_OFF'"
                class="text-blue FontSize"
              >
                {{ item.attendance_status.replace("_", " ") }}
              </div>

              <div
                v-else-if="item.attendance_status == 'HOLIDAY'"
                class="text-blue FontSize"
              >
                {{ item.attendance_status }}
              </div>

              <div
                v-else-if="item.attendance_status == 'LEAVE'"
                class="text-grey FontSize"
              >
                {{ item.attendance_status }}
              </div>
            </template>

            <!-- <template v-slot:[`item.Actions`]="{ item }">
              <v-row>
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-icon
                    v-bind="props"
                      size="small"
                      class="fontsize"
                      @click="dialog_open(item)"
                      >mdi-eye</v-icon
                    >
                  </template>
                  <span>Attendance Details</span>
                </v-tooltip>

                <v-tooltip
                  bottom
                
                >
                  <template v-slot:activator="{ props }">
                    <v-icon
                      v-bind="props"
                      size="small"
                      color="green"
                      class="fontsize ml-2"
                      @click="dialog_open1(item)"
                      >mdi-pencil-plus</v-icon
                    >
                  </template>
                  <span>Attendance Edit</span>
                </v-tooltip>
              </v-row>
            </template> -->
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
    <v-card-actions class="py-0">
      <v-spacer />
      <v-container>
        <v-pagination
          v-model="page"
          :length="pageCount"
          size="small"
        ></v-pagination>
      </v-container>
    </v-card-actions>
  </div>
</template>

<script>
import Overlay from "@/components/Overlay.vue";
import { DownloadExcel } from "@/mixins/Extras/DownloadExcel.js";
// import ViewDetails from "@/components/Attendence/Dialogs/ViewDetails.vue";

// import EditViewDetails from "@/components/Attendence/Dialogs/EditViewDetails.vue";
import {
  ListUserAttendanceHistory,
  ListAllDesignation,
  // ListUsers,
} from "@/graphql/queries.js";

// import { parseTime } from "@/utils";
import moment from "moment";
import { GetOrgUsers } from "@/mixins/ListUsers.js";
import { GetOrgDesignations } from "@/mixins/ListDesignation.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();

export default {
  components: {
    Overlay,
  },
  props: {
    ActionObj: Object,
  },
  mixins: [GetOrgUsers, GetOrgDesignations, DownloadExcel],
  data() {
    return {
      loading: false,
      next_token: null,
      page: 1,
      pageCount: 1,
      CardHeight: 0,
      Count: 0,
      height: 0,
      menuToDate: false,
      menuFromDate: false,
      FromDate: new Date(),
      ToDate: new Date(),
      FromDateValue: new Date().toISOString().substr(0, 10),
      ToDateValue: new Date().toISOString().substr(0, 10),
      designation: "ALL",
      DesignationList: [],
      view_Details_dialog: false,
      view_Details_dialog1: false,
      attendviewdetails: [],
      search: "",
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu: false,
      center: "",
      fixHeader: true,
      StoreObj: {},
      EmployeeNames: [],
      UserList: [],
      employe: "ALL",
      AttendenceFilter: "ALL",
      headers: [
        { title: "#", key: "num", width: "5px" },
        { title: "Date", key: "attendance_date", width: "100px" },
        {
          title: "Employee",

          key: "user_name",
          width: "5px",
        },
        {
          title: "Employee-Id",

          key: "user_employee_id",
          width: "5px",
        },
        // { title: "Status", key: "user_status" },

        { title: "Designation", key: "designation", width: "5px" },
        { title: "Territory Name", key: "territory_names", width: "5px" },
        { title: "Head Quarter", key: "territory_hq", width: "5px" },

        {
          title: "First Level Manager",
          key: "admin_or_manager_name",
          width: "5px",
        },
        // { title: "Swipe Date", key: "attendance_activity_time" },
        { title: "Log In", key: "login_time", width: "90px" },
        { title: "Log Out", key: "logout_time", width: "5px" },
        { title: "Log Duration", key: "login_duration", width: "5px" },
        { title: "Status", key: "attendance_status", width: "5px" },
        // { title: "Action", key: "Actions", width: "5px" },
      ],
      AttendenceList: [],
      overlay: true,
      SwipeItem: {},
      maps_Array: [],
      AttendenceListNew: [],
      locationArray: [],

      AttendenceStatus: [
        { text: "ALL", value: "ALL" },
        { text: "PRESENT", value: "PRESENT" },
        {
          text: "ABSENT",

          value: "ABSENT",
        },
        { text: "IN", value: "IN" },
        {
          text: "OUT",
          value: "OUT",
        },

        { text: "LEAVE", value: "LEAVE" },
        { text: "HOLIDAY", value: "HOLIDAY" },
        { text: "WEEK OFF", value: "WEEK_OFF" },
      ],
    };
  },

  computed: {
    formattedFromDate() {
      return this.FromDate
        ? new Date(this.FromDate)
            .toLocaleDateString("en-GB")
            .replaceAll("/", "-")
        : "";
    },
    // formattedToDate() {
    //   return this.ToDate
    //     ? new Date(this.ToDate).toLocaleDateString("en-GB").replaceAll("/", "-")
    //     : "";
    // },
  },

  watch: {
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        var toDatetimestamp = new Date(
          this.ToDate.split("-")[0],
          this.ToDate.split("-")[1] - 1,
          this.ToDate.split("-")[2],
          23,
          59,
          59,
        ).getTime();
        var fromDatetimestamp = new Date(
          this.FromDate.split("-")[0],
          this.FromDate.split("-")[1] - 1,
          this.FromDate.split("-")[2],
          0,
          0,
          59,
        ).getTime();

        this.getAttendence(
          fromDatetimestamp,
          toDatetimestamp,
          this.designation,
          this.employe,
          this.AttendenceFilter,
          this.next_token,
        );
      }
    },

    designation() {
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
      //   59
      // ).getTime();
      this.AttendenceList = [];
      this.getAttendence(
        new Date(this.FromDateValue).getTime(),
        new Date(this.ToDateValue).getTime(),
        this.designation,
        this.employe,
        this.AttendenceFilter,
        null,
      );
    },

    AttendenceFilter() {
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
      //   59
      // ).getTime();
      this.AttendenceList = [];
      this.getAttendence(
        new Date(this.FromDateValue).getTime(),
        new Date(this.ToDateValue).getTime(),
        this.designation,
        this.employe,
        this.AttendenceFilter,
        null,
      );
    },

    employe() {
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
      //   59
      // ).getTime();
      this.AttendenceList = [];
      this.getAttendence(
        new Date(this.FromDateValue).getTime(),
        new Date(this.ToDateValue).getTime(),
        this.designation,
        this.employe,
        this.AttendenceFilter,
        null,
      );
    },
  },
  mounted() {
    this.height = window.innerHeight - 210;
    this.CardHeight = window.innerHeight - 220;
    // this.FromDate = new Date(
    //   Math.floor(new Date().getTime() / 1000 - 2629743) * 1000
    // )
    //   .toISOString()
    //   .substr(0, 10);
    this.FromDateValue = new Date(
      Math.floor(new Date().getTime() / 1000 - 2629743) * 1000,
    )
      .toISOString()
      .substr(0, 10);
    this.getDesignationLists();
    // this.getUsersLists();
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
    //   59
    // ).getTime();
    // setTimeout(() => {
    this.getAttendence(
      new Date(this.FromDateValue).getTime(),
      new Date(this.ToDateValue).getTime(),
      this.designation,
      this.employe,
      this.AttendenceFilter,
      undefined,
    );
    this.getOrgorganisationUsers(this.ActionObj.organization_id);
    this.getOrgorganisationDesignations(this.ActionObj.organization_id);
    // }, 500);

    // this.getAttendence(fromDatetimestamp, toDatetimestamp, null, null);

    // console.log("GetCurrentUserDetails", this.GetCurrentUserDetailsObj);
  },
  methods: {
    confirmDate() {
      if (this.ToDate) {
        this.ToDateValue = this.formatDate(this.ToDate);
        this.menuToDate = false;
      }
      if (this.FromDate) {
        this.FromDateValue = this.formatDate(this.FromDate);
        this.menuFromDate = false;
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    getAttendenceFilter() {
      this.page = 1;
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
      //   59
      // ).getTime();
      this.AttendenceList = [];
      this.getAttendence(
        new Date(this.FromDateValue).getTime(),
        new Date(this.ToDateValue).getTime(),
        this.designation,
        this.employe,
        this.AttendenceFilter,
        null,
      );
    },

    getlogDuration(item) {
      var u = new Date(item.login_duration);
      return (
        ("0" + u.getUTCHours()).slice(-2) +
        ":" +
        ("0" + u.getUTCMinutes()).slice(-2)
      );
    },

    convertDate(date) {
      return moment(date).format("DD-MM-YYYY h:mm:ss a");
    },
    DownloadMyExcel() {
      let excelHeader = this.headers.map((header) => ({
        label: header.title,
        value: header.key,
      }));

      let formattedList = this.AttendenceList.map((item) => {
        let object = { ...item };
        if (item.login_time) {
          object.login_time = `${
            this.convertDate(item.login_time).split(" ")[1]
          } ${this.convertDate(item.login_time).split(" ")[2]}`;
        }
        if (item.logout_time) {
          object.logout_time = `${
            this.convertDate(item.logout_time).split(" ")[1]
          } ${this.convertDate(item.logout_time).split(" ")[2]}`;
        }
        if (item.login_duration) {
          object.login_duration = `${this.getlogDuration(item)} min.`;
        }
        return object;
      });

      this.DownloadExcelMethod(excelHeader, formattedList, "AttendenceReport");
    },

    // async getUsersLists(user_type) {
    //   try {
    //     this.overlay = true;
    //     this.UserList = [];
    //     this.filtereduser = [];
    //     let result = await client.graphql({
    //       query: ListUsers,
    //       variables: {
    //         input: {
    //           organization_id: this.ActionObj.organization_id,
    //           user_id: this.ActionObj.user_id,
    //           user_type: user_type,
    //           user_status: "ACTIVE",
    //         },
    //       },
    //     });
    //     var StoreArray = JSON.parse(result.data.ListUsers);
    //     this.UserList = StoreArray.data.Items;
    //     this.UserList.unshift("ALL");
    //     if (this.UserList.length == 0) {
    //       this.NoData = "No Users Found";
    //     }
    //     this.overlay = false;
    //   } catch (error) {
    //     // this.NoData = error.errors[0].message;
    //     console.log("errorrrrr", error);
    //     this.UserList = [];
    //     this.overlay = false;
    //   }
    // },

    async getDesignationLists() {
      try {
        this.overlay = true;
        this.DesignationList = [];

        let result = await client.graphql({
          query: ListAllDesignation,
          variables: {
            input: {
              setting_status: "ACTIVE",
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
        console.log("desigerror", error);
        // this.NoData = error.errors[0].message;
      }
    },

    async getAttendence(
      fromdate,
      todate,
      designation,
      employe,
      AttendenceFilter,
      next_token,
    ) {
      try {
        this.loading = true;
        this.overlay = true;

        let result = await client.graphql({
          query: ListUserAttendanceHistory,
          variables: {
            input: {
              organization_id: this.ActionObj.organization_id,
              from_date: fromdate,
              to_date: todate,
              designation_name:
                designation == "ALL" || designation == null
                  ? undefined
                  : designation,
              employee_user_id:
                employe == "ALL" || employe == null ? undefined : employe,
              attendance_status:
                AttendenceFilter == "ALL" ? undefined : AttendenceFilter,
              next_token:
                next_token != undefined ||
                next_token != null ||
                next_token != ""
                  ? next_token
                  : null,
              limit: 201,
            },
          },
        });
        console.log(
          "ListUserAttendanceHistory",
          JSON.parse(result.data.ListUserAttendanceHistory),
        );
        // this.AttendenceList = [];
        if (!this.next_token) {
          this.AttendenceList = JSON.parse(
            result.data.ListUserAttendanceHistory,
          ).data.items;
          this.next_token = JSON.parse(
            result.data.ListUserAttendanceHistory,
          ).data.next_token;
          console.log("Check Attendance  berfore", this.AttendenceList);
        } else {
          for (
            let i = 0;
            i <
            JSON.parse(result.data.ListUserAttendanceHistory).data.items.length;
            i++
          ) {
            this.AttendenceList.push({
              ...JSON.parse(result.data.ListUserAttendanceHistory).data.items[
                i
              ],
            });
          }
          this.next_token = JSON.parse(
            result.data.ListUserAttendanceHistory,
          ).data.next_token;
          console.log("Check Attendance  After", this.AttendenceList);
        }

        console.log(
          "ListUserAttendanceHistory",
          JSON.parse(result.data.ListUserAttendanceHistory),
        );
        console.log("AttendenceList", this.AttendenceList);
        this.EmployeeNames = this.AttendenceList.filter(
          (name) => name.user_name,
        );
        this.EmployeeNames.unshift("ALL");
        this.AttendenceList.forEach(function (OrgIndex, Idx) {
          OrgIndex.num = Idx + 1;
        });

        this.$forceUpdate();
        this.loading = false;
        this.overlay = false;
      } catch (error) {
        console.log("error", error);
        this.EmployeeNames = [];
        this.AttendenceList = [];
        this.loading = false;
        this.overlay = false;
      }
    },
    getcal() {
      this.menu = true;
    },

    handleRowClick(item) {
      this.StoreObj = item;
      this.StoreObj.Action = "VIEW";
      this.view_Details_dialog = true;
    },

    dialog_open(item) {
      this.StoreObj = item;
      var locationArray = [];
      for (let i = 0; i < item.attendance_details.length; i++) {
        locationArray.push({
          swipe_status: item.attendance_details[i].swipe_status,
          swipe_time: item.attendance_details[i].swipe_time,
          position: {
            lat: Number(item.attendance_details[i].swipe_location.lat),
            lng: Number(item.attendance_details[i].swipe_location.lng),
          },
        });
      }
      this.locationArray = locationArray;
      this.view_Details_dialog = true;
      // this.view_Details_dialog1 = true;
    },

    dialog_open1(item) {
      this.StoreObj = item;
      // console.log("dfdfdsff", this.StoreObj);
      this.view_Details_dialog1 = true;
    },

    ViewDetailDialogEmit() {
      this.view_Details_dialog = false;
    },

    ViewDetailDialogEmit1(Toggle) {
      this.view_Details_dialog1 = false;
      if (Toggle == 2) {
        this.FromDate = new Date(
          Math.floor(new Date().getTime() / 1000 - 2629743) * 1000,
        )
          .toISOString()
          .substr(0, 10);
        this.getDesignationLists();
        // this.getUsersLists();
        var toDatetimestamp = new Date(
          this.ToDate.split("-")[0],
          this.ToDate.split("-")[1] - 1,
          this.ToDate.split("-")[2],
          23,
          59,
          59,
        ).getTime();
        var fromDatetimestamp = new Date(
          this.FromDate.split("-")[0],
          this.FromDate.split("-")[1] - 1,
          this.FromDate.split("-")[2],
          0,
          0,
          59,
        ).getTime();
        setTimeout(() => {
          this.getAttendence(
            fromDatetimestamp,
            toDatetimestamp,
            null,
            null,
            this.AttendenceFilter,
            this.next_token,
          );
        }, 500);
      }
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
  max-width: 100%;
}
.v-data-table-header th {
  white-space: nowrap;
}
.overflow {
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  max-width: 100% !important;
}
</style>
