<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-card class="bg-transparent" flat>
      <v-card class="pw-card" flat>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="12">
            <v-card flat class="pa-3 bg-transparent">
              <v-row class="space-between">
                <v-radio-group
                  inline
                  density="compact"
                  class="mt-2"
                  v-model="SelectType"
                >
                  <v-radio
                    class="mx-3 font-weight-bold mt-2"
                    v-for="(radio, idx) in SelectTypeArray"
                    :key="idx"
                    :label="radio.text"
                    :value="radio.value"
                    color="primary"
                  ></v-radio>
                </v-radio-group>
                <v-text-field
                  v-model="from_date"
                  readonly
                  filled
                  variant="outlined"
                  density="compact"
                  class="MaxWidthVariant1 mt-3"
                  append-inner-icon="mdi-calendar"
                  bg-color="#f0f0f0"
                ></v-text-field>
                <v-menu v-model="toDateMenu" :close-on-content-click="true">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="displayToDate"
                      v-bind="props"
                      variant="outlined"
                      readonly
                      density="compact"
                      class="MaxWidthVariant1 mt-3 ml-3"
                      append-inner-icon="mdi-calendar"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :max="new Date().toISOString().substring(0, 10)"
                    v-model="to_date"
                    hide-header
                  ></v-date-picker>
                </v-menu>
                <v-select
                  class="ml-2 MaxWidthVariant2 mt-3 mr-2 CursorPointer"
                  density="compact"
                  label="Filter By Organization"
                  variant="outlined"
                  v-model="organization_name"
                  :items="filterarray"
                  item-title="organization_name"
                  item-value="organization_id"
                >
                </v-select>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- <v-row no-gutters>
        <v-radio-group v-model="radios" row class="ml-2">
          <v-radio value="TOTAL">
            <template v-slot:label>
              <div>
                <strong class="success--text">TOTAL VISITS</strong>
              </div>
            </template>
          </v-radio>
          <v-radio value="USER">
            <template v-slot:label>
              <div><strong class="blue-text-grey">ACTIVE USER</strong></div>
            </template>
          </v-radio>
          <v-radio value="AVERAGE">
            <template v-slot:label>
              <div><strong class="text-primary">AVERAGE VISITS</strong></div>
            </template>
          </v-radio>
        </v-radio-group>
        <v-col cols="12" sm="6" md="2" class="mt-3 ml-4">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                disabled
                class="mr-3"
                density="compact"
                variant="outlined"
                v-model="date"
                label="From Date"
                append-icon="mdi-calendar"
                readonly
                v-bind="props"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="2" class="mt-3">
          <v-menu
            v-model="menu3"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                density="compact"
                variant="outlined"
                v-model="todate"
                label="To Date"
                append-icon="mdi-calendar"
                readonly
                v-bind="props"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="todate"
              @input="menu3 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="mt-3">
          <v-autocomplete
            class="ml-2"
            density="compact"
            label="Filter By Organization"
            variant="outlined"
            v-model="organization_name"
            :items="filterarray"
            item-title="organization_name"
            item-value="organization_id"
            @change="
              getDashboardBarchart(from_date, to_date, organization_name)
            "
          >
          </v-autocomplete>
        </v-col>
      </v-row> -->
      </v-card>
      <!-- <v-card variant="outlined" class="mt-4">
      <v-col cols="12" md="12" xl="12" xs="12">
        <div v-if="radios == 'TOTAL'" class="ml-8 pa-1">
          <BarChart
            :height="100"
            :chartdata="datacollectionBar"
            :options="optionsgraphLineSales"
            :count="count"
          />
        </div>
        <div v-else-if="radios == 'AVERAGE'" class="ml-8 pa-1">
          <BarChart
            :height="100"
            :chartdata="datacollectionBarAvg"
            :options="optionsgraphLineSalesAvg"
            :count="count"
          />
        </div>
        <div v-else-if="radios == 'USER'" class="ml-8 pa-1">
          <BarChart
            :height="100"
            :chartdata="datacollectionBarUser"
            :options="optionsgraphLineSalesUser"
            :count="count"
          />
        </div>
      </v-col>
    </v-card> -->
    </v-card>
    <v-card flat class="mt-4 bg-transparent slide-in-from-bottom">
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12">
          <v-card flat class="pw-card pa-3">
            <div v-if="reportLoading" class="pa-6">
              <v-skeleton-loader type="image" height="240" />
            </div>
            <div v-else-if="!sortedReports.length" class="dash-empty">
              <v-icon size="36" class="mb-2">mdi-chart-bar</v-icon>
              <div class="dash-empty__title">No usage data for this range</div>
              <div class="pw-muted">
                {{ ReportMessage || "Pick another organization or date range." }}
              </div>
            </div>
            <apexchart
              v-else
              height="270px"
              type="bar"
              :options="ComputedChartOptions"
              :series="chartSeries"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
// import BarChart from "@/components/Charts/BarChart.js";
import Overlay from "@/components/Overlay.vue";

// var moment = require("moment");
import {
  // ListOrganizationsDailyReport,
  ListOrganizations,
} from "@/graphql/queries.js";
import { GetOrgReports } from "@/mixins/GetOrgDetailReport.js";
import { activeOrgsSorted, pickDefaultOrg, rememberOrg } from "@/utils/orgDefaults.js";
import VueApexCharts from "vue3-apexcharts";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {},
  components: { Overlay, apexchart: VueApexCharts },
  // , BarChart, apexchart: VueApexCharts
  mixins: [GetOrgReports],
  data: () => ({
    SelectType: "TOTAL_VISIT",
    from_date: null,
    to_date: new Date(),

    toDateMenu: false,
    mounted: true,

    ChartOtherSeries: [
      {
        name: "",
        data: [],
      },
    ],
    ChartSeries: [
      {
        name: "Total Visits",
        data: [],
      },
      // {
      //   name: "Total POVs Met",
      //   data: [],
      // },
      // {
      //   name: "Total E-Details",
      //   data: [],
      // },
    ],
    SelectTypeArray: [
      {
        text: "Total Visits",
        value: "TOTAL_VISIT",
      },
      {
        text: "Active Users",
        value: "ACTIVE_USERS",
      },
      {
        text: "Average Visits",
        value: "AVERAGE_VISITS",
      },
    ],
    organization_name: "",
    filterarray: [],
    date: new Date().toISOString().substr(0, 10),
    todate: new Date().toISOString().substr(0, 10),
    menu2: false,
    menu3: false,
    radios: "TOTAL",
    mapArray: [],
    count: 0,
    overlay: false,
    datacollectionBarUser: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "Active User",
          backgroundColor: [],
          borderColor: [],
          fill: false,
        },
      ],
    },
    datacollectionBarAvg: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "Average Visits",
          backgroundColor: [],
          borderColor: [],
          fill: false,
        },
      ],
    },
    datacollectionBar: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "Total Visits",
          backgroundColor: [],
          borderColor: [],
          fill: true,
        },
      ],
    },
    optionsgraphLineSalesAvg: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
    },
    optionsgraphLineSalesUser: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
    },
    optionsgraphLineSales: {
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
    },
    filterVisitorList: [],
    visitList: [],
    loading: false,
    ActiveMembers: "",
    InActiveReps: "",
    openTickets: "",
    closeTickets: "",
    wipTickets: "",
    remainingCredits: "",
    consumedCredits: "",
    ActiveRepresentative: "",
    isLoading: false,
    ActivemedReps: "",
    InActivemedReps: "",
    territoryvisitCount: "",
    totalorganizationsproduct: "",
    List: [],
    moment: "",
  }),
  computed: {
    sortedReports() {
      return (this.OverAllResult || [])
        .slice()
        .sort((a, b) => Number(a.created_on) - Number(b.created_on));
    },
    chartSeries() {
      const r = this.sortedReports;
      if (this.SelectType === "ACTIVE_USERS") {
        return [{ name: "Active Users", data: r.map((x) => x.total_users || 0) }];
      }
      if (this.SelectType === "AVERAGE_VISITS") {
        return [
          {
            name: "Average Visits",
            data: r.map((x) =>
              x.total_users ? Number((x.total_visits / x.total_users).toFixed(2)) : 0,
            ),
          },
        ];
      }
      return [{ name: "Total Visits", data: r.map((x) => x.total_visits || 0) }];
    },
    ComputedChartOptions() {
      return {
        colors: [this.SelectType == "ACTIVE_USERS" ? "#607d8b" : "#4db6ac"],
        chart: { type: "bar", height: 350, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
        legend: { position: "top" },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 1, colors: ["#fff"] },
        xaxis: { categories: this.sortedReports.map((x) => x.current_day) },
        fill: { opacity: 1 },
        tooltip: { y: { formatter: (val) => val } },
      };
    },
    displayToDate() {
      let currentDate = new Date(this.to_date);
      const getLast30Days = new Date(currentDate);
      getLast30Days.setDate(currentDate.getDate() - 30);
      this.from_date = new Date(getLast30Days).toISOString().substring(0, 10);
      return new Date(this.to_date).toISOString().substring(0, 10);
    },
  },
  mounted() {
    // console.log("rad  ", this.radios);
    // var new_to_date = new Date(this.todate).getTime();
    // var n_from_date = new Date(this.todate).getTime() / 1000;
    // var new_from_date = (n_from_date - 2629743) * 1000;
    // this.date = moment.unix(new_from_date / 1000).format("YYYY-MM-DD");
    this.getOrganizationLists();
    // this.getDashboardBarchart(
    //   new_from_date,
    //   new_to_date,
    //   this.organization_name
    // );
  },
  watch: {
    from_date() {
      if (!this.organization_name) return;
      this.GetOrgReportsMethods(
        new Date(this.from_date).getTime(),
        new Date(this.to_date).getTime() + 24 * 60 * 60 * 1000,
        this.$store.getters.get_current_user_details.user_id,
        this.organization_name,
      );
    },
    organization_name(val) {
      rememberOrg(val);
      if (val != "") {
        this.GetOrgReportsMethods(
          new Date(this.from_date).getTime(),
          new Date(this.to_date).getTime() + 24 * 60 * 60 * 1000,
          this.$store.getters.get_current_user_details.user_id,
          val,
        );
      }
    },
    // radios(val) {
    //   console.log("val", val);
    //   var new_to_date = new Date(this.todate).getTime();
    //   var n_from_date = new Date(this.todate).getTime() / 1000;
    //   console.log("oooo", n_from_date);
    //   var new_from_date = (n_from_date - 2629743) * 1000;
    //   this.date = moment.unix(new_from_date / 1000).format("YYYY-MM-DD");
    //   if (val == "TOTAL") {
    //     this.count = 0;
    //     this.getDashboardBarchart(
    //       new_from_date,
    //       new_to_date,
    //       this.organization_name
    //     );
    //   }
    //   if (val == "AVERAGE") {
    //     this.count = 0;
    //     this.getDashboardBarchartAvg(
    //       new_from_date,
    //       new_to_date,
    //       this.organization_name
    //     );
    //   }
    //   if (val == "USER") {
    //     this.count = 0;
    //     this.getDashboardBarchartUser(
    //       new_from_date,
    //       new_to_date,
    //       this.organization_name
    //     );
    //   }
    //   this.$forceUpdate();
    // },
    // todate(val) {
    //   var new_to_date = new Date(val).getTime();
    //   var n_from_date = new Date(val).getTime() / 1000;
    //   var new_from_date = (n_from_date - 2629743) * 1000;
    //   this.date = moment.unix(new_from_date / 1000).format("YYYY-MM-DD");
    //   if (this.radios == "TOTAL") {
    //     this.count = 0;
    //     console.log("coming here");
    //     this.getDashboardBarchart(
    //       new_from_date,
    //       new_to_date,
    //       this.organization_name
    //     );
    //     console.log("coming here2");
    //   }
    //   if (this.radios == "AVERAGE") {
    //     this.count = 0;
    //     this.getDashboardBarchartAvg(
    //       new_from_date,
    //       new_to_date,
    //       this.organization_name
    //     );
    //   }
    //   if (this.radios == "USER") {
    //     this.count = 0;
    //     this.getDashboardBarchartUser(
    //       new_from_date,
    //       new_to_date,
    //       this.organization_name
    //     );
    //   }
    //   this.$forceUpdate();
    // },
    // organization_name(val) {
    //   console.log("org", val);
    //   var new_to_date = new Date(this.todate).getTime();
    //   var n_from_date = new Date(this.todate).getTime() / 1000;
    //   var new_from_date = (n_from_date - 2629743) * 1000;
    //   this.date = moment.unix(new_from_date / 1000).format("YYYY-MM-DD");
    //   if (this.radios == "TOTAL") {
    //     this.count = 0;
    //     console.log("coming here");
    //     this.getDashboardBarchart(
    //       new_from_date,
    //       new_to_date,
    //       this.organization_name
    //     );
    //   }
    //   if (this.radios == "AVERAGE") {
    //     this.count = 0;
    //     this.getDashboardBarchartAvg(
    //       new_from_date,
    //       new_to_date,
    //       this.organization_name
    //     );
    //   }
    //   if (this.radios == "USER") {
    //     this.count = 0;
    //     this.getDashboardBarchartUser(
    //       new_from_date,
    //       new_to_date,
    //       this.organization_name
    //     );
    //   }
    //   this.$forceUpdate();
    //   // this.getDashboardBarchart(new_from_date, new_to_date, val);
    // },
  },

  methods: {
    // async getDashboardBarchartUser(from_date, to_date, organization_name) {
    //   this.overlay = true;

    //   try {
    //     this.overlay = true;
    //     this.List = [];
    //     let result = await API.graphql(
    //       graphqlOperation(ListOrganizationsDailyReport, {
    //         input: {
    //           organization_id: organization_name,
    //           user_id: this.GetCurrentUserDetailsObj.user_id,
    //           from_date: from_date,
    //           to_date:
    //             new Date().toISOString().substr(0, 10) == this.todate
    //               ? Date.now()
    //               : to_date,
    //         },
    //       })
    //     );
    //     this.List = JSON.parse(
    //       result.data.ListOrganizationsDailyReport
    //     ).data.items;
    //     console.log("nulllu", this.List);
    //     let total_visit_avg = [];
    //     var totlColorVisit = [];
    //     this.datacollectionBarUser.datasets[0].data = [];
    //     this.datacollectionBarUser.labels = [];
    //     for (let i = 0; i < this.List.length; i++) {
    //       total_visit_avg.push(this.List[i].total_users);
    //       totlColorVisit.push("#607D8B");
    //       this.datacollectionBarUser.datasets[0].data = total_visit_avg;
    //       this.datacollectionBarUser.datasets[0].borderColor = totlColorVisit;
    //       this.datacollectionBarUser.datasets[0].backgroundColor =
    //         totlColorVisit;
    //       this.datacollectionBarUser.labels.push(this.List[i].current_day);
    //       this.count = 1;
    //     }
    //     this.$forceUpdate();
    //     this.overlay = false;
    //   } catch (error) {
    //     this.NoData = "No Users Found";
    //     this.List = [];
    //     this.overlay = false;
    //     this.isLoading = false;
    //   }
    // },
    // async getDashboardBarchartAvg(from_date, to_date, organization_name) {
    //   try {
    //     this.overlay = true;
    //     this.List = [];
    //     let result = await API.graphql(
    //       graphqlOperation(ListOrganizationsDailyReport, {
    //         input: {
    //           organization_id: organization_name,
    //           user_id: this.GetCurrentUserDetailsObj.user_id,
    //           from_date: from_date,
    //           to_date:
    //             new Date().toISOString().substr(0, 10) == this.todate
    //               ? Date.now()
    //               : to_date,
    //         },
    //       })
    //     );
    //     this.List = JSON.parse(
    //       result.data.ListOrganizationsDailyReport
    //     ).data.items;
    //     console.log("nullllll", this.List);
    //     let total_visit_avg = [];
    //     var totlColorVisit = [];
    //     this.datacollectionBarAvg.datasets[0].data = [];
    //     this.datacollectionBarAvg.labels = [];
    //     for (let i = 0; i < this.List.length; i++) {
    //       total_visit_avg.push(
    //         (this.List[i].total_visits / this.List[i].total_users).toFixed(2)
    //       );
    //       // var numb = total_visit_avg[i];
    //       // var avg_visits = Math.round((numb + Number.EPSILON) * 100) / 100;
    //       // var avgVisits = Math.round(total_visit_avg[i])
    //       // console.log("jjj", avgVisits);
    //       // let result = text.substr(0, 5)+text.substr(6,6);

    //       totlColorVisit.push("#4DB6AC");
    //       this.datacollectionBarAvg.datasets[0].data = total_visit_avg;
    //       this.datacollectionBarAvg.datasets[0].borderColor = totlColorVisit;
    //       this.datacollectionBarAvg.datasets[0].backgroundColor =
    //         totlColorVisit;
    //       this.datacollectionBarAvg.labels.push(this.List[i].current_day);
    //       this.count = 1;
    //     }
    //     this.$forceUpdate();
    //     this.overlay = false;
    //   } catch (error) {
    //     this.NoData = "No Users Found";
    //     this.List = [];
    //     this.overlay = false;
    //     this.isLoading = false;
    //   }
    // },
    // async getDashboardBarchart(from_date, to_date, organization_name) {
    //   try {
    //     this.overlay = true;
    //     this.List = [];
    //     this.datacollectionBar.datasets[0].data = [];
    //     this.datacollectionBar.labels = [];
    //     let result = await API.graphql(
    //       graphqlOperation(ListOrganizationsDailyReport, {
    //         input: {
    //           organization_id: organization_name,
    //           user_id: this.GetCurrentUserDetailsObj.user_id,
    //           from_date: from_date,
    //           to_date:
    //             new Date().toISOString().substr(0, 10) == this.todate
    //               ? Date.now()
    //               : to_date,
    //         },
    //       })
    //     );
    //     this.List = JSON.parse(
    //       result.data.ListOrganizationsDailyReport
    //     ).data.items;

    //     console.log("this.List", this.List);
    //     var visits = [];
    //     var visit_dates = [];
    //     var totlColorVisit = [];
    //     for (let i = 0; i < this.List.length; i++) {
    //       visits.push(this.List[i].total_visits);
    //       visit_dates.push(this.List[i].current_day);
    //       totlColorVisit.push("#4DB6AC");
    //     }
    //     this.datacollectionBar.labels = visit_dates;
    //     this.datacollectionBar.datasets[0].data = visits;
    //     console.log(
    //       "this.datacollectionBar.datasets[0].data",
    //       this.datacollectionBar.datasets[0].data
    //     );
    //     this.datacollectionBar.datasets[0].borderColor = totlColorVisit;
    //     this.datacollectionBar.datasets[0].backgroundColor = totlColorVisit;
    //     this.count = 1;
    //     this.$forceUpdate();
    //     this.overlay = false;
    //   } catch (error) {
    //     console.log("error here", error);
    //     if (error.data.ListOrganizationsDailyReport == null) {
    //       this.List = [];
    //       this.datacollectionBar.datasets[0].data = [];
    //       this.datacollectionBar.labels = [];
    //     }
    //     this.$forceUpdate();
    //     this.NoData = "No Users Found";
    //     this.overlay = false;
    //     this.isLoading = false;
    //   }
    // },
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
        console.log("orgggggg", this.OrganizationList);
        this.filterarray = [];
        this.filterarray = activeOrgsSorted(this.OrganizationList);
        this.organization_name = pickDefaultOrg(this.filterarray, this.organization_name);
        if (this.filterarray.length == 0) {
          this.NoData = "No Organization Found";
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        // this.NoData = error.errors[0].message;
        console.log("error", error);
      }
    },

    callmethoddatetime(pov_visited_on) {
      let a = new Date(pov_visited_on * 1000).toLocaleDateString("en-In", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      let b = new Date(pov_visited_on * 1000).toLocaleTimeString("en-In", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return a + ", " + b;
    },
  },
};
</script>

<style>
.dash-empty {
  text-align: center;
  padding: 64px 16px;
  color: var(--pw-muted);
}
.dash-empty__title {
  font-weight: 600;
  font-size: 15px;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 4px;
}
.overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.card {
  min-height: 300px;
  padding: 10px;
  transition: 0.5s ease-out;
}
.opacity {
  opacity: 0.2;
}
.dtwidth {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.gradient-bg {
  background: -webkit-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -moz-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -o-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -ms-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
}
.gradient-bg2 {
  background: -webkit-linear-gradient(145deg, #0a876e 0%, #0fc566 100%);
  background: -moz-linear-gradient(145deg, #0a876e 0%, #0fc566 100%);
  background: -o-linear-gradient(145deg, #0a876e 0%, #0fc566 100%);
  background: -ms-linear-gradient(145deg, #0a876e 0%, #0fc566 100%);
  background: linear-gradient(145deg, #0a876e 0%, #0fc566 100%);
}
</style>
