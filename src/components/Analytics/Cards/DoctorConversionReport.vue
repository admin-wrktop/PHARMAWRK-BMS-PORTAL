<template>
  <div>
    <Overlay :overlay="overlay" />
    <!-- <v-card class="elevation-0"> -->
    <v-row no-gutters class="mt-1 ml-3">
      <v-col cols="12" sm="12" md="12" xs="12">
        <v-toolbar class="elevation-0" color="white">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            max-width="190px"
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                class="mr-2 FontSize mt-2 MaxWidth"
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
              <div class="d-flex align-center justify-space-between">
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
          <!-- <v-select
            item-title="catalog_name"
            item-value="catalog_id"
            density="compact"
            variant="outlined"
            class="FontSize mr-1"
            label="Product"
            v-model="catelog_name"
            :items="DruglistArray"
          >
          </v-select> -->
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
              >
              </v-select> -->
          <!-- <v-select
            item-title="setting_name"
            item-value="setting_name"
            density="compact"
            variant="outlined"
            class="FontSize mr-1"
            label="POV conversion"
            v-model="povConversion"
            :items="SpecializationList"
          >
          </v-select> -->
          <v-select
            item-title="user_name"
            item-value="user_id"
            density="compact"
            variant="outlined"
            class="FontSize mr-1 mt-2"
            label="Employee"
            v-model="employe"
            :items="UserList"
            :menu-props="{ contentClass: 'SelectFontSize' }"
          >
          </v-select>

          <v-text-field
            density="compact"
            class="mr-2 mt-2"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            v-model="search"
          ></v-text-field>
          <v-tooltip color="primary" location="bottom">
            <template v-slot:activator="{ props }">
              <a>
                <v-icon
                  class="ml-0 mt-n6"
                  @click="DownloadMyExcel"
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
    <v-col cols="12" sm="12" md="12" xs="12" class="mt-n5">
      <v-data-table
            :no-data-text="ReportNoData"
        v-model:page="page"
        density="compact"
        :search="search"
        :headers="headers"
        :items="DoctorConversionList"
        class="dtwidth TableClass elevation-0"
        fixed-header
        :height="height"
        :loading="loading"
        hide-default-footer
        :items-per-page="itemsPerPage"
      >
        <template
          v-for="(h, i) in headers"
          :key="i"
          v-slot:[headerSlot(h)]="{ header }"
        >
          <div>
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
            {{ DoctorConversionList.indexOf(item) + 1 }}
          </div>
        </template>
        <template v-slot:[`item.current_month`]="{ item }">
          <div class="FontSize" v-if="item.current_month">
            {{ item.current_month }}
          </div>
          <div v-else class="FontSize">-</div>
        </template>
        <template v-slot:[`item.user_name`]="{ item }">
          <div class="FontSize" v-if="item.user_name">
            {{ item.user_name }}
          </div>
          <div v-else class="FontSize">-</div>
        </template>
        <template v-slot:[`item.pov_name`]="{ item }">
          <div class="FontSize" v-if="item.pov_name">
            {{ item.pov_name }}
          </div>
          <div v-else class="FontSize">-</div>
        </template>
        <template v-slot:[`item.pov_identity`]="{ item }">
          <div class="FontSize" v-if="item.pov_identity">
            {{ item.pov_identity }}
          </div>
          <div v-else class="FontSize">-</div>
        </template>
        <template v-slot:[`item.designation_name`]="{ item }">
          <div class="FontSize" v-if="item.designation_name">
            {{ item.designation_name }}
          </div>
          <div v-else class="FontSize">-</div>
        </template>
        <template v-slot:[`item.pov_category`]="{ item }">
          <div class="FontSize" v-if="item.pov_category">
            {{ item.pov_category }}
          </div>
          <div v-else class="FontSize">-</div>
        </template>
        <template v-slot:[`item.hospital_name`]="{ item }">
          <div class="FontSize" v-if="item.hospital_name">
            {{ item.hospital_name }}
          </div>
          <div v-else class="FontSize">-</div>
        </template>
        <template v-slot:[`item.specialization_name`]="{ item }">
          <div class="FontSize" v-if="item.specialization_name">
            {{ item.specialization_name }}
          </div>
          <div v-else class="FontSize">-</div>
        </template>
        <template v-slot:[`item.product_name`]="{ item }">
          <div class="FontSize" v-if="item.product_name">
            {{ item.product_name }}
          </div>
          <div v-else class="FontSize">-</div>
        </template>
        <!-- <template v-slot:[`item.feedback_on`]="{ item }">
              <span class="FontSize" v-if="item.feedback_on">{{
                new Date(item.feedback_on).toLocaleString()
              }}</span>
              <span v-else>-</span>
            </template> -->
        <template v-slot:[`item.feedback_on`]="{ item }">
          <span class="FontSize" v-if="item.feedback_on">
            {{ convertDate(item.feedback_on) }}
          </span>
          <span v-else>-</span>
        </template>
        <template v-slot:[`item.pov_conversion_level`]="{ item }">
          <div class="FontSize" v-if="item.pov_conversion_level">
            {{ item.pov_conversion_level }}
          </div>
          <div v-else class="FontSize">-</div>
        </template>
        <template v-slot:[`item.pov_address`]="{ item }">
          <v-tooltip color="primary" activator="parent" location="bottom">
            <template v-slot:activator="{ props }">
              <div v-if="item.pov_address" class="FontSize" v-bind="props">
                {{
                  item.pov_address.length >= 15
                    ? item.pov_address.substr(0, 15) + "..."
                    : item.pov_address
                }}
              </div>
              <div v-else>-</div>
            </template>
            <span class="primary">{{ item.pov_address }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
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
    </v-col>
    <!-- </v-card> -->
    <!-- test -->
  </div>
</template>
<script>
import Overlay from "@/components/Overlay.vue";
import { format, parseISO } from "date-fns";
import moment from "moment";
import {
  ListPOVConversionReport,
  ListOrganizationUsers,
  ListAllDesignation,
  ListPOVRemarks,
  ListAllCatalogs,
} from "@/graphql/queries.js";
// import { parseTime } from "@/utils";
// var xlsx = require("json-as-xlsx");
import { GetOrgUsers } from "@/mixins/ListUsers.js";
import { DownloadExcel } from "@/mixins/Extras/DownloadExcel.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  components: {
    Overlay,
  },
  props: {
    ActionObj: Object,
  },
  mixins: [GetOrgUsers, DownloadExcel],
  data: () => ({
    NoData: "No data available",
    ReportNoData: "No data available",
    // product_name: "ALL",
    productList: [],
    DruglistArray: [],
    employe: "ALL",
    catelog_name: "ALL",
    povConversion: "ALL",
    EmployeeNames: [],
    // designation: "ALL",
    DesignationList: [],
    SpecializationList: [],
    overlay: false,
    StoreObj: {},
    search: "",
    headers: [],
    next_token: null,
    loading: false,

    itemsPerPage: 300,

    date: format(parseISO(new Date().toISOString()), "yyyy-MM"),
    DateValue: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    menu: false,
    fixHeader: true,
    page: 1,
    height: 0,
    DoctorConversionList: [],
    UserList: [],
    columnName: [
      { label: "Month", value: "current_month" },
      { label: "Month", value: "current_month" },
      {
        label: "E-Name",
        value: "user_name",
      },
      {
        label: "D-ID",
        value: "pov_identity",
      },
      {
        label: "Designation-Name",
        value: "designation_name",
      },
      {
        label: "DN",
        value: "pov_name",
      },
      {
        label: "DC",
        value: "pov_category",
      },
      {
        label: "Speciality",
        value: "specialization_name",
      },
      {
        label: "Hospital",
        value: "hospital_name",
      },
      {
        label: "Address",
        value: "pov_address",
      },
      {
        label: "Product",
        value: "product_name",
      },
      {
        label: "Created Date",
        // value: `${new Date('feedback_on').toLocaleDateString()}`,
        value: "date",
      },
      {
        label: "Created Time",
        value: "time",
      },
      {
        label: "Conversion Stage",
        value: "pov_conversion_level",
      },
    ],
  }),

  mounted() {
    this.height = window.innerHeight - 280;
    this.getUsersLists();
    this.getDoctorConversionReport();
    this.getRemarks(this.catelog_name);
    this.getDrugLists();
    this.getOrgorganisationUsers(this.ActionObj.organization_id);
    // this.getDesignationLists();
    // this.getDoctorConversionReport();
    this.getRemarks(this.catelog_name);
    // this.getDrugLists();
  },
  computed: {
    computedDateFormattedMomentjs() {
      return this.date ? moment(this.date).format("dddd, MMMM Do YYYY") : "";
    },
    computedDateFormattedDatefns() {
      return this.date ? format(parseISO(this.date), "EEEE, MMMM do yyyy") : "";
    },
    pageCount() {
      return Math.ceil(this.DoctorConversionList.length / this.itemsPerPage);
    },
  },
  watch: {
    async catelog_name(val) {
      // console.log("val", val);
      await this.getRemarks(val);
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.getDoctorConversionReport();
      }
    },
    employe(val) {
      if (val != "") {
        this.getDoctorConversionReport(
          this.date,
          this.povConversion,
          this.employe,
          null,
        );
      }
    },
  },
  methods: {
    headerSlot(h) {
      return "header." + (h.key || h.value);
    },
    checkPagination() {
      this.getDoctorConversionReport(this.next_token);
    },
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

    // getDate() {
    //   if (this.DateValue != "" && this.DateValue != null) {
    //     console.log("date", this.DateValue);
    //     let Selectedyear = new Date().getFullYear();
    //     let selectedMonth = parseInt(this.DateValue) + 1;
    //     let date = new Date(Selectedyear, selectedMonth);
    //     this.date = date.toISOString().substring(0, 7);
    //     this.next_token = null;
    //     this.getDoctorConversionReport();
    //     // this.$refs.menu.save(date);
    //     this.menu = false;
    //   } else {
    //     this.menu = false;
    //     this.SnackBarComponent = {
    //       SnackbarVmodel: true,
    //       SnackbarColor: "red",
    //       SnackbarText: "No data available for selected month",
    //       timeout: 2000,
    //     };
    //   }
    // },

    getDate() {
      if (this.DateValue != "" && this.DateValue != null) {
        console.log("Selected value:", this.DateValue);

        let selectedYear = parseInt(this.currentYear);
        let selectedMonth = parseInt(this.DateValue);

        let date = new Date(selectedYear, selectedMonth);
        this.date = date.toISOString().substring(0, 7);

        console.log("Formatted Date:", this.date);

        this.next_token = null;
        this.getDoctorConversionReport();

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
    getFilters() {
      this.next_token = "";
      this.DoctorConversionList = [];
      this.getDoctorConversionReport(
        this.date,
        this.povConversion,
        this.employe,
        // this.product_name
        this.next_token,
      );
    },
    convertDate(date) {
      return moment(date).format("DD-MM-YYYY h:mm:ss a");
    },
    getcal() {
      this.menu = true;
    },
    async getDoctorConversionReport() {
      // console.log("getDoctorConversionReport method called!");
      // this.DoctorConversionList = [];
      this.overlay = true;
      this.loading = true;
      this.headers = [];
      this.headers = [
        { title: "#", key: "sl_no" },
        { title: "Month", key: "current_month", tooltip_text: "Month" },
        {
          title: "E-Name",
          key: "user_name",
          tooltip_text: "Employee Name",
        },
        {
          title: "D-ID",
          key: "pov_identity",
          tooltip_text: "Doctor ID",
        },
        {
          title: "Designation-Name",
          key: "designation_name",
          tooltip_text: "Designation Name",
        },
        {
          title: "DN",
          key: "pov_name",
          tooltip_text: "Doctor Name",
        },
        {
          title: "DC",
          key: "pov_category",
          tooltip_text: "Doctor Category",
        },
        {
          title: "Speciality",
          key: "specialization_name",
          tooltip_text: "Speciality",
        },
        {
          title: "Hospital",
          key: "hospital_name",
          tooltip_text: "Hospital Name",
        },
        {
          title: "Address",
          key: "pov_address",
          tooltip_text: "Address",
        },
        {
          title: "Product",
          key: "product_name",
          tooltip_text: "Product",
        },
        {
          title: "Created On",
          key: "feedback_on",
          tooltip_text: "Created On",
        },
      ];
      try {
        var inputParams = {
          organization_id: this.ActionObj.organization_id,
          //   user_id: this.$store.getters.get_current_user.user_id,
          months_list: this.date,
          designation_name: this.designation,
          user_employee_id: this.employe,
          pov_conversion_level: this.povConversion,
          next_token:
            this.next_token != undefined &&
            this.next_token != null &&
            this.next_token != ""
              ? this.next_token
              : null,
          Limit: 1000,
          // product_id: this.product_name,
        };
        if (
          this.povConversion == null ||
          this.povConversion == undefined ||
          this.povConversion.trim() == "ALL"
        ) {
          delete inputParams.pov_conversion_level;
        }
        if (
          this.employe == null ||
          this.employe == undefined ||
          this.employe.trim() == "ALL"
        ) {
          delete inputParams.user_employee_id;
        }

        let result = await client.graphql({
          query: ListPOVConversionReport,
          variables: {
            input: inputParams,
          },
        });

        var ResultObj = JSON.parse(result.data.ListPOVConversionReport);
        console.log("Check ResultObj", ResultObj);
        // var StoreArray = JSON.parse(result.data.ListPOVConversionReport).data
        //   .items;
        if (!this.next_token) {
          this.DoctorConversionList = JSON.parse(
            result.data.ListPOVConversionReport,
          ).data.items;
          this.next_token = JSON.parse(
            result.data.ListPOVConversionReport,
          ).data.next_token;
          console.log("First next Token", this.next_token);
        } else {
          let TestArray = JSON.parse(result.data.ListPOVConversionReport).data
            .items;

          for (
            let i = 0;
            i <
            JSON.parse(result.data.ListPOVConversionReport).data.items.length;
            i++
          ) {
            this.DoctorConversionList.push({
              ...JSON.parse(result.data.ListPOVConversionReport).data.items[i],
            });
          }

          this.next_token = JSON.parse(
            result.data.ListPOVConversionReport,
          ).data.next_token;
          console.log("Else next Token", this.next_token);
        }

        this.EmployeeNames = [...this.DoctorConversionList].filter(
          (name) => name.user_name,
        );
        this.EmployeeNames.unshift("ALL");
        this.productList = [...this.DoctorConversionList].filter(
          (pro) => pro.product_name,
        );
        this.productList.unshift("ALL");

        if (this.date.split("-")[1] === "01") {
          this.headers.push({
            title: "January Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "January Conversion Stage",
          });
        }
        if (this.date.split("-")[1] === "02") {
          this.headers.push({
            title: "February Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "February Conversion Stage",
          });
        }
        if (this.date.split("-")[1] === "03") {
          this.headers.push({
            title: "March Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "March Conversion Stage",
          });
        }
        if (this.date.split("-")[1] === "04") {
          this.headers.push({
            title: "April Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "April Conversion Stage",
          });
        }
        if (this.date.split("-")[1] === "05") {
          this.headers.push({
            title: "May Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "May Conversion Stage",
          });
        }
        if (this.date.split("-")[1] === "06") {
          this.headers.push({
            title: "June Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "June Conversion Stag",
          });
        }
        if (this.date.split("-")[1] === "07") {
          this.headers.push({
            title: "July Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "July Conversion Stage",
          });
        }
        if (this.date.split("-")[1] === "08") {
          this.headers.push({
            title: "August Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "August Conversion Stage",
          });
        }
        if (this.date.split("-")[1] === "09") {
          this.headers.push({
            title: "September Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "September Conversion Stage",
          });
        }
        if (this.date.split("-")[1] === "10") {
          this.headers.push({
            title: "October Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "October Conversion Stage",
          });
        }
        if (this.date.split("-")[1] === "11") {
          this.headers.push({
            title: "November Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "November Conversion Stage",
          });
        }
        if (this.date.split("-")[1] === "12") {
          this.headers.push({
            title: "December Conversion Stage",
            key: "pov_conversion_level",
            tooltip_text: "December Conversion Stage",
          });
        }
        this.$forceUpdate();

        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log("Err", error);
        this.ReportNoData = (error && error.errors && error.errors[0] && error.errors[0].message) || "No data available";
        this.DoctorConversionList = [];
        this.overlay = false;
      }
    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },

    async getDesignationLists() {
      try {
        this.overlay = true;
        this.DesignationList = [];
        let result = await client.graphql({
          query: ListAllDesignation,
          variables: {
            input: {
              organization_id: this.GetCurrentUserDetailsObj.organization_id,
            },
          },
        });
        var self = this;
        var StoreArray = JSON.parse(result.data.ListAllDesignation);
        self.new_destinationlist = StoreArray.data.items;
        self.DesignationList = StoreArray.data.items;
        self.DesignationList.push("ALL");
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        console.log(error, "error");
        this.NoData = error.errors[0].message;
      }
    },
    async getRemarks(catelog_name) {
      try {
        this.overlay = true;
        this.SpecializationList = [];

        let result = await client.graphql({
          query: ListPOVRemarks,
          variables: {
            input: {
              organization_id: this.ActionObj.organization_id,
              setting_status: "ACTIVE",
              product_id: catelog_name == "ALL" ? undefined : catelog_name,
            },
          },
        });
        // console.log("store", result);
        // var self = this;
        var StoreArray = JSON.parse(result.data.ListPOVRemarks);
        // self.new_Remarkslist = StoreArray.data.items;
        // console.log("self.new_Remarkslist", self.new_Remarkslist);

        this.SpecializationList = StoreArray.data.items;
        // this.SpecializationList.push("ALL");
        if (this.SpecializationList.length == 0) {
          this.NoData = "No Users Found";
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        // console.log(error, "error");
        this.NoData = error.errors[0].message;
      }
    },

    async getDrugLists() {
      try {
        this.overlay = true;

        let result = await client.graphql({
          query: ListAllCatalogs,
          variables: {
            input: {
              organization_id: this.ActionObj.organization_id,
            },
          },
        });
        var StoreArray = JSON.parse(result.data.ListAllCatalogs);
        this.DruglistArray = StoreArray.data.Items;
        // console.log("kkk", this.DruglistArray);
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = error.errors[0].message;
      }
    },
    // getDate() {
    //   if (this.date != "" && this.date != null) {
    //     // console.log("date", this.date);
    //     this.next_token = null;
    //     this.getDoctorConversionReport(
    //       this.date,
    //       this.designation,
    //       this.employe,
    //       this.product_name,
    //       this.next_token
    //     );
    //     this.menu = false;
    //   } else {
    //     this.menu = false;
    //     this.SnackBarComponent = {
    //       SnackbarVmodel: true,
    //       SnackbarColor: "red",
    //       SnackbarText: "No data available for selected month",
    //       timeout: 2000,
    //     };
    //   }
    // },

    // exporttoexcel() {
    //   this.DoctorConversionList.map((item) => {
    //     let Object;
    //     Object = item;
    //     Object.date = new Date(item.feedback_on).toLocaleDateString("en-IN");
    //     Object.time = new Date(item.feedback_on).toLocaleTimeString();
    //   });
    //   let data = [
    //     {
    //       sheet: "DoctorConversionReport",
    //       columns: this.columnName,
    //       content: this.DoctorConversionList,
    //     },
    //   ];
    //   let settings = {
    //     fileName: "DoctorConversionReport",
    //     extraLength: 3,
    //     writeOptions: {},
    //   };
    //   xlsx(data, settings);
    // },
    DownloadMyExcel() {
      let excelHeader = this.columnName.map((header) => ({
        label: header.label,
        value: header.value,
      }));

      let formattedList = this.DoctorConversionList.map((item) => {
        let object = { ...item };
        if (item.feedback_on) {
          object.date = new Date(item.feedback_on)
            .toLocaleDateString()
            .replaceAll("/", "-");
        }
        if (item.feedback_on) {
          object.time = new Date(item.feedback_on).toLocaleTimeString();
        }
        return object;
      });

      this.DownloadExcelMethod(
        excelHeader,
        formattedList,
        "Doctor Conversion Report",
      );
    },
  },
};
</script>
