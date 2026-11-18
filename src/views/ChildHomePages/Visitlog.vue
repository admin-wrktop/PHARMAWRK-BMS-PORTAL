<template>
  <div>
    <v-card class="elevation-0">
      <PovConversion
        :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
        :StoreObj="StoreObj"
        :pov_conversion_dialog="pov_conversion_dialog"
        @clicked="PovConversionEmit"
      />

      <PovConversionDialog1
        :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
        :StoreObj="StoreObj"
        :pov_conversion_dialog1="pov_conversion_dialog1"
        @clicked="PovConversionEmit1"
      />

      <v-card-text>
        <v-row>
          <v-toolbar class="elevation-0" color="white">
            <v-menu
              ref="menuFromDate"
              v-model="menuFromDate"
              :close-on-content-click="false"
              :return-value.sync="FromDate"
              transition="scale-transition"
              offset-y
              min-width="auto"
              class="mr-1"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  v-model="FromDateValue"
                  label="From Date"
                  @click:append="date ? getcal() : getcal()"
                  readonly
                  v-bind="props"
                  class="mt-6"
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
                  <v-btn text color="primary" @click="confirmDate()">
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
                  @click:append="date ? getcal2() : getcal2()"
                  readonly
                  v-bind="props"
                  class="ml-1 mt-6"
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
                    v-on:click="getDate()"
                  >
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>

            <v-select
              item-title="designation_name"
              item-value="designation_name"
              density="compact"
              variant="outlined"
              label="Role"
              v-model="designation"
              :items="DesignationList"
              @change="getMarkettingFilter()"
              class="ml-1 mt-6"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            >
            </v-select>

            <v-select
              item-title="user_name"
              item-value="user_id"
              density="compact"
              variant="outlined"
              label="Employee"
              v-model="employe"
              :items="UserList"
              @change="getMarkettingFilter()"
              class="ml-1 mt-6"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            >
            </v-select>

            <v-select
              density="compact"
              variant="outlined"
              class="FontSize mx-1 mt-6"
              :items="VisitLogType"
              v-model="povList"
              label="Pov Type"
              item-title="text"
              item-value="value"
              @change="getMarkettingFilter()"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            >
            </v-select>

            <v-autocomplete
              class="FontSize mr-1 ml-1 mt-6"
              density="compact"
              label="Filter By Organization"
              variant="outlined"
              v-model="organization_name"
              :items="filterarray"
              item-title="organization_name"
              item-value="organization_id"
              @change="getMarkettingFilter1()"
            >
            </v-autocomplete>

            <v-text-field
              density="compact"
              variant="outlined"
              class="FontSize mr-1 mt-6"
              label="Search"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-toolbar>

          <v-col cols="12" sm="12" md="12" xs="12">
            <Overlay :overlay="overlay" />
            <v-data-table
              v-model:page="page"
              density="compact"
              :headers="headers"
              :items="filterVisitorList"
              :search="search"
              class="dtwidth elevation-0 TableClass"
              :loading="loading"
              :no-data-text="NoData"
              hide-default-footer
              fixed-header
              height="530px"
              :footer-props="{
                'items-per-page-options': [100, 200, 500],
              }"
              :items-per-page="itemsPerPage"
            >
              <template v-for="(h, i) in headers" v-slot:[`header.${h.key}`]>
                <div :key="i">
                  <v-tooltip
                    color="primary"
                    activator="parent"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <span v-bind="props">{{ h.title }}</span>
                    </template>
                    <span>{{ h.tooltip_text }}</span>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:[`item.num`]="{ item }">
                <div class="FontSize">{{ item.num }}</div>
                <!-- <span class="caption">{{
                  filterVisitorList.indexOf(item) + 1
                }}</span> -->
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      <v-icon
                        v-if="item.visit_type == 'ADHOC'"
                        size="small"
                        color="primary"
                        >mdi-handshake</v-icon
                      >
                    </div>
                  </template>
                  <span class="primary">Adhoc</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.items_given_list`]="{ item }">
                <v-tooltip
                  v-if="item.items_given_list != null"
                  location="bottom"
                  color="primary"
                >
                  <template v-slot:activator="{ props }">
                    <div
                      v-if="item.items_given_list.length != 0"
                      v-bind="props"
                      v-text="
                        item.items_given_list == null
                          ? '0'
                          : `${
                              item.items_given_list[0].product_name != null
                                ? item.items_given_list[0].product_name
                                : '0'
                            } + ${item.items_given_list.length - 1} Others`
                      "
                      class="FontSize"
                    ></div>
                    <div v-else>-</div>
                  </template>

                  <div v-for="(item, idx) in item.items_given_list" :key="idx">
                    {{ item.product_name != null ? item.product_name : "0" }}
                  </div>
                </v-tooltip>
              </template>

              <template v-slot:[`item.icon`]="{ item }">
                <v-tooltip
                  location="bottom"
                  color="primary"
                  v-if="item.pov_type == 'DOCTOR'"
                >
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      <v-icon size="small" color="primary"
                        >mdi-stethoscope</v-icon
                      >
                    </div>
                  </template>
                  <span class="primary">DOCTOR</span>
                </v-tooltip>
                <v-tooltip
                  location="bottom"
                  color="primary"
                  v-if="item.pov_type == 'PHARMACIST'"
                >
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      <v-icon size="small" color="primary">mdi-store</v-icon>
                    </div>
                  </template>
                  <span class="primary">PHARMACIST</span>
                </v-tooltip>

                <v-tooltip
                  location="bottom"
                  color="primary"
                  v-if="item.pov_type == 'HOSPITAL'"
                >
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      <v-icon size="small" color="primary"
                        >mdi-hospital-building</v-icon
                      >
                    </div>
                  </template>
                  <span class="primary">HOSPITAL</span>
                </v-tooltip>
                <v-tooltip
                  location="bottom"
                  color="primary"
                  v-if="item.pov_type == 'DISTRIBUTOR'"
                >
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      <v-icon size="small" color="primary"
                        >mdi-medical-bag</v-icon
                      >
                    </div>
                  </template>
                  <span class="primary">DISTRIBUTOR</span>
                </v-tooltip>
                <v-tooltip
                  location="bottom"
                  color="primary"
                  v-if="item.pov_type == 'CLIENT'"
                >
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      <v-icon size="small" color="primary"
                        >mdi-lock-plus</v-icon
                      >
                    </div>
                  </template>
                  <span class="primary">CLIENT</span>
                </v-tooltip>

                <v-tooltip
                  location="bottom"
                  color="primary"
                  v-if="item.pov_type == 'COLLECTION_CENTER'"
                >
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      <v-icon size="small" color="primary"
                        >mdi-hospital-box</v-icon
                      >
                    </div>
                  </template>
                  <span class="primary">COLLECTION CENTER</span>
                </v-tooltip>

                <v-tooltip
                  location="bottom"
                  color="primary"
                  v-if="item.pov_type == 'PATIENT'"
                >
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      <v-icon size="small" color="primary"
                        >mdi-account-injury</v-icon
                      >
                    </div>
                  </template>
                  <span class="primary">PATIENT</span>
                </v-tooltip>

                <v-tooltip
                  location="bottom"
                  color="primary"
                  v-if="
                    item.pov_type != 'PATIENT' &&
                    item.pov_type != 'COLLECTION_CENTER' &&
                    item.pov_type != 'CLIENT' &&
                    item.pov_type != 'DISTRIBUTOR' &&
                    item.pov_type != 'HOSPITAL' &&
                    item.pov_type != 'PHARMACIST' &&
                    item.pov_type != 'DOCTOR'
                  "
                >
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      <v-icon size="small" color="primary">mdi-home</v-icon>
                    </div>
                  </template>
                  <span class="primary">NON POV VISIT</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.pov_visited_on`]="{ item }">
                <div class="FontSize">
                  {{ new Date(item.pov_visited_on).toLocaleString() }}
                </div>
              </template>

              <template v-slot:[`item.user_name`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-if="item.user_name" class="FontSize" v-bind="props">
                      {{
                        item.user_name.length > 6
                          ? item.user_name.substr(0, 6) + "..."
                          : item.user_name
                      }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.user_name }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.user_employee_id`]="{ item }">
                <div class="FontSize">
                  {{ item.user_employee_id }}
                </div>
                <!-- <div v-else class="FontSize">-</div> -->
              </template>

              <template v-slot:[`item.pov_identity`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-if="item.pov_identity"
                      class="FontSize"
                      v-bind="props"
                    >
                      {{
                        item.pov_identity.length > 0
                          ? item.pov_identity.substr(0, 6)
                          : item.pov_identity
                      }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.pov_identity }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.user_full_number`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-if="
                        item.user_full_number != null ||
                        item.user_full_number != undefined
                      "
                      class="FontSize"
                      v-bind="props"
                    >
                      {{
                        item.user_full_number.length > 0
                          ? item.user_full_number.substr(0, 13)
                          : item.user_full_number
                      }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.user_full_number }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.visit_attachments`]="{ item }">
                <div v-if="item.visit_attachments" class="FontSize">
                  {{ item.visit_attachments.length
                  }}<v-icon
                    v-if="item.visit_attachments.length > 0"
                    class="ml-2"
                    size="small"
                    color="primary"
                    @click.stop="ViewCommentMethod1(item)"
                    >mdi-information</v-icon
                  >
                </div>
                <div v-else>-</div>
              </template>

              <template v-slot:[`item.designation`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-if="item.designation"
                      class="FontSize"
                      v-bind="props"
                    >
                      {{
                        item.designation.length > 0
                          ? item.designation.substr(0, 12)
                          : item.designation
                      }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.designation }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.pov_name`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-if="item.pov_name" class="FontSize" v-bind="props">
                      {{
                        item.pov_name.length > 0
                          ? item.pov_name.substr(0, 6) + "..."
                          : item.pov_name.substr(0, 6)
                      }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.pov_name }}</span>
                </v-tooltip>
              </template>

              <template
                v-slot:[`item.accompanied_user_designation_name`]="{ item }"
              >
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-if="item.accompanied_user_designation_name != ''"
                      class="FontSize"
                      v-bind="props"
                    >
                      {{ `${item.accompanied_user_designation_name}` }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <div
                    v-for="(
                      device, idx
                    ) in item.accompanied_user_designation_name"
                    :key="idx"
                  >
                    {{ device }}
                  </div>
                </v-tooltip>
              </template>

              <template v-slot:[`item.pov_city`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-if="item.pov_city" class="FontSize" v-bind="props">
                      {{
                        item.pov_city.length > 6
                          ? item.pov_city.substr(0, 6) + "..."
                          : item.pov_city.substr(0, 6)
                      }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.pov_city }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.admin_or_manager_name`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      {{
                        item.admin_or_manager_name.length > 6
                          ? item.admin_or_manager_name.substr(0, 6) + "..."
                          : item.admin_or_manager_name
                      }}
                    </div>
                  </template>
                  <span class="primary">{{ item.admin_or_manager_name }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.secondary_reporter_name`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      {{
                        item.secondary_reporter_name.length >= 6
                          ? item.secondary_reporter_name.substr(0, 6) + "..."
                          : item.secondary_reporter_name
                      }}
                    </div>
                  </template>
                  <span class="primary">{{
                    item.secondary_reporter_name
                  }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.specialization_name`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-if="item.specialization_name"
                      class="FontSize"
                      v-bind="props"
                    >
                      {{
                        item.specialization_name.length > 8
                          ? item.specialization_name.substr(0, 8) + "..."
                          : item.specialization_name
                      }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.specialization_name }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.view`]="{ item }">
                <div v-if="item.items_given_list" class="FontSize">
                  {{ item.items_given_list.length
                  }}<v-icon
                    v-if="item.items_given_list.length > 0"
                    class="ml-2"
                    size="small"
                    color="primary"
                    @click.stop="ViewCommentMethod(item)"
                    >mdi-information</v-icon
                  >
                </div>
                <div v-else>-</div>
              </template>

              <template v-slot:[`item.comments`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-if="item.comments" class="FontSize" v-bind="props">
                      {{
                        item.comments.length > 8
                          ? item.comments.substr(0, 8) + "..."
                          : item.comments.substr(0, 8)
                      }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.comments }}</span>
                </v-tooltip>
              </template>
            </v-data-table>

            <v-card-actions class="py-0">
              <v-spacer />
              <v-container>
                <v-pagination
                  v-model="page"
                  :length="pageCount"
                  active-color="primary"
                  size="x-small"
                  variant="elevated"
                ></v-pagination>
              </v-container>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import PovConversionDialog1 from "@/components/Report/PovConversionDialog1.vue";
import PovConversion from "@/components/Report/PovConversion.vue";
import Overlay from "@/components/Overlay.vue";

import {
  ListVisitLogByTime,
  ListOrganizations,
  ListAllDesignation,
  ListUsersOfOrganization,
} from "@/graphql/queries.js";

import moment from "moment";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  components: {
    Overlay,
    PovConversion,
    PovConversionDialog1,
  },

  props: {
    GetCurrentUserDetailsObj: Object,
  },
  data: () => ({
    itemsPerPage: 100,
    StoreArray1: [],
    next_token: null,
    page: 1,
    loading: false,
    povList: "ALL",
    StoreObj: {},
    pov_conversion_dialog: false,
    pov_conversion_dialog1: false,
    organization_name: "4fc95aed-392c-455f-86ac-b9a0882d8666",
    filterarray: [],
    designation: "ALL",
    employe: "ALL",
    DesignationList: [],
    EmployeeNames: [],
    UserList: [],
    menuToDate: false,
    menuFromDate: false,
    ToDate: new Date(),
    FromDate: new Date(),
    FromDateValue: new Date().toISOString().substr(0, 10),
    ToDateValue: new Date().toISOString().substr(0, 10),
    NoData: "",
    search: "",
    filterVisitorList: [],
    overlay: false,
    headers: [
      { title: "#", key: "num", width: "15px" },
      { title: "#PT", key: "icon", tooltip_text: "POV Type", width: "15px" },
      {
        title: "Date",
        key: "pov_visited_on",
        tooltip_text: "Date",
        width: "15px",
      },

      {
        title: "Employee",
        align: "start",
        key: "user_name",
        tooltip_text: "Employee Name",
        width: "15px",
      },
      {
        title: "#EID",
        key: "user_employee_id",
        tooltip_text: "Employee ID",
        width: "15px",
      },
      {
        title: "#PID",
        key: "pov_identity",
        tooltip_text: "POV ID",
        width: "15px",
      },

      {
        title: "Phone",
        key: "user_full_number",
        tooltip_text: "Customer Mobile Number",
        width: "15px",
      },

      {
        title: "#D",
        key: "designation",
        tooltip_text: "Designation",
        width: "15px",
      },
      {
        title: "#PN",
        key: "pov_name",
        tooltip_text: "POV Name",
        width: "15px",
      },

      {
        title: "#AC",
        key: "accompanied_user_designation_name",
        tooltip_text: "Accompanied By",
        width: "15px",
      },
      {
        title: "City",
        key: "pov_city",
        tooltip_text: "City Name",
        width: "15px",
      },
      {
        title: "#FLM",
        key: "admin_or_manager_name",
        tooltip_text: "First Level Manager",
        width: "15px",
      },
      {
        title: "#SLR",
        key: "secondary_reporter_name",
        tooltip_text: "Second Level Manager",
        width: "15px",
      },

      {
        title: "Specialization",
        key: "specialization_name",
        tooltip_text: "Specialization",
      },

      // {
      //   title: "Status",
      //   key: "user_status",
      //   tooltip_text: "Status",
      //   width: "15px",
      // },

      // {
      //   title: "#TN",
      //   key: "territory_names",
      //   tooltip_text: "Territory Name",
      //   width: "15px",
      // },
      {
        title: "#PP",
        key: "items_given_list",
        tooltip_text: "Product Promoted",
        width: "15px",
      },

      {
        title: "#Attachment",
        key: "visit_attachments",
        tooltip_text: "Attachment",
        width: "15px",
      },

      // {
      //   title: "#TC",
      //   key: "territory_categories",
      //   tooltip_text: "Territory Category",
      //   width: "15px",
      // },
      // {
      //   title: "#PC",
      //   key: "pov_category_name",
      //   tooltip_text: "POV Category",
      //   width: "15px",
      // },
      // { title: "#HQ", key: "territory_hq", tooltip_text: "Head Quarter" },
      // {
      //   title: "Log Status",
      //   key: "visit_log_status",
      //   tooltip_text: "Visit Log Status",
      //   width: "15px",
      // },

      // {
      //   title: "Address",
      //   key: "pov_address",
      //   tooltip_text: "Address",
      //   width: "15px",
      // },

      {
        title: "POV Coversion",
        key: "view",
        tooltip_text: "POV Conversion",
        width: "15px",
      },

      {
        title: "Comments",
        key: "comments",
        tooltip_text: "Comments",
        width: "15px",
      },
    ],

    VisitLogType: [
      { text: "ALL", value: "ALL" },
      { text: "DOCTOR", value: "DOCTOR" },
      { text: "PHARMACIST", value: "PHARMACIST" },
      { text: "DISTRIBUTOR", value: "DISTRIBUTOR" },
      { text: "CLIENT", value: "CLIENT" },
      { text: "COLLECTION CENTER", value: "COLLECTION_CENTER" },
      { text: "HOSPITAL", value: "HOSPITAL" },
      { text: "PATIENT", value: "PATIENT" },
    ],
  }),

  computed: {
    pageCount() {
      return Math.ceil(this.filterVisitorList.length / this.itemsPerPage);
    },
  },

  mounted() {
    this.FromDateValue = new Date(
      Math.floor(new Date().getTime() / 1000 - 2629743) * 1000,
    )
      .toISOString()
      .substr(0, 10);

    this.height = window.innerHeight - 190;

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

    this.getOrganizationLists();
    this.getDesignationLists();
    this.getUsersLists();

    // setTimeout(() => {
    this.getvisitreport(
      new Date(this.FromDateValue).getTime(),
      new Date(this.ToDateValue).getTime(),
      this.designation,
      this.employe,
      this.povList,
      null,
    );
    // }, 200);
  },

  watch: {
    page() {
      if (
        this.next_token != null &&
        this.next_token != undefined &&
        this.next_token != ""
      ) {
        this.getvisitreport(
          new Date(this.FromDateValue).getTime(),
          new Date(this.ToDateValue).getTime(),
          this.designation,
          this.employe,
          this.povList,
          this.next_token,
        );
      }
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
    getDate() {
      this.getMarkettingFilter1();
      this.menuFromDate = false;
    },

    getDate1(ToDate) {
      if (this.ToDate != "" && this.ToDate != null) {
        this.getMarkettingFilter1();
        this.$refs.menuToDate.save(ToDate);
        this.menuToDate = false;
      } else {
        this.menuToDate = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "No data available for selected month",
          timeout: 2000,
        };
      }
    },

    ViewCommentMethod(item) {
      this.StoreObj = item;
      this.StoreObj.Action = "VIEW";
      this.pov_conversion_dialog = true;
    },

    PovConversionEmit() {
      this.StoreObj = {};
      this.pov_conversion_dialog = false;
    },
    PovConversionEmit1() {
      // this.StoreObj = {};
      this.pov_conversion_dialog1 = false;
    },

    ViewCommentMethod1(item) {
      this.StoreObj = item;
      this.pov_conversion_dialog1 = true;
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

    getMarkettingFilter1() {
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
      this.getDesignationLists();
      this.getUsersLists();
      // setTimeout(() => {
      this.filterVisitorList = [];
      this.getvisitreport(
        new Date(this.FromDateValue).getTime(),
        new Date(this.ToDateValue).getTime(),
        this.designation,
        this.employe,
        this.povList,
        null,
      );
      // }, 200);
    },

    getMarkettingFilter() {
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
      this.getDesignationLists();
      this.filterVisitorList = [];
      this.getvisitreport(
        new Date(this.FromDateValue).getTime(),
        new Date(this.ToDateValue).getTime(),
        this.designation,
        this.employe,
        this.povList,
        null,
      );
    },

    async getvisitreport(
      fromdate,
      todate,
      designation,
      employe,
      povList,
      next_token,
    ) {
      try {
        this.overlay = true;
        this.loading = true;

        let result = await client.graphql({
          query: ListVisitLogByTime,
          variables: {
            input: {
              organization_id: this.organization_name,
              user_id: this.$store.getters.get_current_user_details.user_id,
              from_date: fromdate,
              to_date: todate,
              designation_name: designation == "ALL" ? undefined : designation,
              user_employee_id: employe == "ALL" ? undefined : employe,
              pov_type: povList == "ALL" ? undefined : povList,
              next_token: next_token == null ? undefined : next_token,
              limit: 101,
            },
          },
        });
        this.StoreArray1 = JSON.parse(
          result.data.ListVisitLogByTime,
        ).data.Items;

        this.next_token =
          JSON.parse(result.data.ListVisitLogByTime).next_token != undefined
            ? JSON.parse(result.data.ListVisitLogByTime).next_token
            : null;

        for (let i = 0; i < this.StoreArray1.length; i++) {
          this.filterVisitorList.push(this.StoreArray1[i]);
        }
        this.$forceUpdate();
        this.filterVisitorList.forEach(function (OrgIndex, Idx) {
          OrgIndex.num = Idx + 1;
        });

        console.log("number sdhsd", this.filterVisitorList);
        console.log("next token", this.next_token);
        this.$forceUpdate();
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.NoData = error.message;
      }
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
        // console.log("orgggggg", this.OrganizationList);
        this.filterarray = [];
        this.filterarray = this.OrganizationList.filter(
          (org) => org.organization_status == "ACTIVE",
        );
        if (this.filterarray.length == 0) {
          this.NoData = "No Organization Found";
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = error.errors[0].message;
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
              user_id: this.$store.getters.get_current_user_details.user_id,
              organization_id: this.organization_name,
            },
          },
        });
        var self = this;
        var StoreArray = JSON.parse(result.data.ListAllDesignation);
        self.new_destinationlist = StoreArray.data.items;
        self.DesignationList = StoreArray.data.items;
        self.DesignationList.unshift("ALL");
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = error.errors[0].message;
      }
    },

    async getUsersLists() {
      try {
        this.overlay = true;
        this.UserList = [];
        this.filtereduser = [];

        let result = await client.graphql({
          query: ListUsersOfOrganization,
          variables: {
            input: {
              organization_id: this.organization_name,
              user_id: this.$store.getters.get_current_user_details.user_id,
            },
          },
        });
        var StoreArray = JSON.parse(result.data.ListUsersOfOrganization);
        this.UserList = StoreArray.data.Items;
        this.UserList.unshift("ALL");
        if (this.UserList.length == 0) {
          this.NoData = "No Users Found";
        }
        this.overlay = false;
      } catch (error) {
        this.UserList = [];
        this.overlay = false;
        this.NoData = error.errors[0].message;
      }
    },
  },
};
</script>

<style></style>
