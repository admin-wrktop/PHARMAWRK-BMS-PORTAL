<template>
  <div>
    <v-card class="elevation-0">
      <Overlay :overlay="overlay" />
      <v-card-text>
        <v-toolbar color="white" class="elevation-0">
          <v-col>
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
                  class="FontSize mt-2"
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
          </v-col>
          <v-col>
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
                  class="FontSize mt-2"
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
                    @click.stop="getFilteredValues()"
                  >
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>

          <v-col>
            <v-select
              density="compact"
              variant="outlined"
              class="FontSize mt-2 SelectFontSize"
              :items="AuditType"
              v-model="audit_log"
              label="Audit Type"
            ></v-select>
          </v-col>

          <!-- <v-autocomplete
            density="compact"
            label="Filter By Organization"
            variant="outlined"
           
          >
          </v-autocomplete> -->
          <v-autocomplete
            density="compact"
            variant="outlined"
            class="mt-2"
            label="Filter By Organization"
            v-model="organization_name"
            :items="filterarray"
            item-title="organization_name"
            item-value="organization_id"
          >
          </v-autocomplete>
          <v-tooltip color="primary" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                @click="getFilteredValues()"
                size="small"
                fab
                color="primary"
                variant="elevated"
                class="ml-1 mr-1 mt-n3 text-white"
                v-bind="props"
              >
                <v-icon>mdi-filter</v-icon>
              </v-btn>
            </template>
            <span>Filter</span>
          </v-tooltip>

          <v-col>
            <v-text-field
              density="compact"
              variant="outlined"
              class="FontSize mt-2"
              label="Search"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-toolbar>
        <v-row>
          <v-col cols="12" sm="12" md="12" xs="12">
            <Overlay :overlay="overlay" />
            <v-data-table
              density="compact"
              :headers="headers"
              :items="AuditLogs"
              class="elevation-0 TableClass"
              :search="search"
              :no-data-text="NoData"
              fixed-header
              :height="height"
              :loading="loading"
              :footer-props="{
                'items-per-page-options': [100, 200, 500],
              }"
              :items-per-page="100"
            >
              <template v-slot:[`item.num`]="{ item }">
                <span class="caption">{{ AuditLogs.indexOf(item) + 1 }}</span>
              </template>

              <template v-slot:[`item.log_source`]="{ item }">
                <div class="FontSize">{{ item.log_source }}</div>
              </template>

              <template v-slot:[`item.logged_on`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-if="item.logged_on" class="FontSize" v-bind="props">
                      {{ convertDate(item.logged_on) }}
                    </div>
                    <div
                      v-else-if="
                        item.logged_on == undefined &&
                        item.logged_on == 'INVALID DATE'
                      "
                    >
                      -
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ convertDate(item.logged_on) }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.log_action`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-if="
                        item.log_action != '' || item.log_action != undefined
                      "
                      class="FontSize"
                      v-bind="props"
                    >
                      {{ item.log_action }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.log_action }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.logged_by`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-if="item.logged_by" class="FontSize" v-bind="props">
                      {{ item.logged_by }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.logged_by }}</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { activeOrgsSorted, pickDefaultOrg, rememberOrg } from "@/utils/orgDefaults.js";
import moment from "moment";
import Overlay from "@/components/Overlay.vue";

import { ListAuditLogs, ListOrganizations } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export default {
  components: {
    Overlay,
  },
  props: {
    GetCurrentUserDetailsObj: Object,
  },
  data: () => ({
    organization_name: "",
    AuditType: ["POV MANAGEMENT", "USER MANAGEMENT"],
    audit_log: "POV MANAGEMENT",
    search: "",
    overlay: false,
    AuditLogs: [],
    NoData: "",
    loading: false,
    filterarray: [],
    headers: [
      { title: "SL. No", key: "num" },
      // { title: "Action for", key: "action_for" },
      // { title: "Acted By Name", key: "logged_by_name" },
      { title: "Acted By Email/Phone", key: "logged_by" },

      { title: "Date & Time", key: "logged_on" },
      { title: "Log Source", key: "log_source" },
      { title: "Log Action", key: "log_action" },
    ],
    menuToDate: false,
    menuFromDate: false,
    FromDate: new Date(),
    ToDate: new Date(),
    FromDateValue: new Date().toISOString().substr(0, 10),
    ToDateValue: new Date().toISOString().substr(0, 10),
    height: 0,
  }),

  mounted() {
    this.height = window.innerHeight - 210;
    this.FromDateValue = new Date(
      Math.floor(new Date().getTime() / 1000 - 2629743) * 1000,
    )
      .toISOString()
      .substr(0, 10);

    setTimeout(() => {
      this.AuditLog(
        new Date(this.FromDateValue).getTime(),
        new Date(this.ToDateValue).getTime(),
      );
    }, 200);

    this.getOrganizationLists();
  },

  watch: {
    audit_log() {
      // console.log("pankajajajajajajaaj",this.GetCurrentUserDetailsObj);
      this.AuditLog(
        new Date(this.FromDateValue).getTime(),
        new Date(this.ToDateValue).getTime(),
      );
    },

    organization_name(val) {
      rememberOrg(val);
      this.AuditLog(
        new Date(this.FromDateValue).getTime(),
        new Date(this.ToDateValue).getTime(),
      );
    },
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
    getcal() {
      this.menuFromDate = true;
    },

    getcal2() {
      this.menuToDate = true;
    },

    convertDate(date) {
      return moment(date).format("DD-MM-YYYY h:mm:ss a");
    },

    async AuditLog(FromDate, ToDate) {
      if (!this.organization_name) return;
      console.log("dsdcsfsd", this.audit_log);
      console.log("FromDate", FromDate);
      console.log("ToDate", ToDate);
      try {
        this.overlay = true;
        this.loading = true;
        const originalDate = new Date(this.ToDate);
        const updatedDate = new Date(originalDate);
        // updatedDate.setDate(updatedDate.getDate());

        this.AuditLogs = [];

        let result = await client.graphql({
          query: ListAuditLogs,
          variables: {
            input: {
              organization_id: this.organization_name,
              from_date: FromDate,
              to_date: ToDate,
              log_type: this.audit_log.replace(" ", "_"),
            },
          },
        });

        var self = this;
        var StoreArray = JSON.parse(result.data.ListAuditLogs);
        self.AuditLogs = StoreArray.data.items;
        console.log("AuditLogs", this.AuditLogs);

        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.AuditLogs = [];
        this.overlay = false;
        this.loading = false;
        this.NoData = error.errors[0].message;
      }
    },

    getFilteredValues() {
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
      this.filterVisitorList = [];
      this.AuditLog(
        new Date(this.FromDateValue).getTime(),
        new Date(this.ToDateValue).getTime(),
        this.audit_log,
      );
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
        this.NoData = error.errors[0].message;
      }
    },
  },
};
</script>

<style></style>
