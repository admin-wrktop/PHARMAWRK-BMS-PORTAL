<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-toolbar density="compact" color="white">
      <v-tabs v-model="tab" density="compact" color="primary">
        <v-tab>Organization Details</v-tab>
        <v-tab class="text-capitalize">POVs</v-tab>
        <v-tab class="text-capitalize">USERS</v-tab>
        <v-tab>VISITS</v-tab>
        <v-tab>PRODUCTS</v-tab>
        <v-tab>TERRITORIES</v-tab>
        <v-tab>AUDIT LOGS</v-tab>
        <v-tab>Analytics</v-tab>
      </v-tabs>
      <v-spacer />
      <v-btn
        @click="backMethod((Toggle = 1))"
        variant="elevated"
        size="small"
        color="primary"
        ><v-icon>mdi-chevron-double-left</v-icon> Back
      </v-btn>
    </v-toolbar>
    <v-row no-gutters>
      <v-col cols="12" md="12">
        <v-card-text v-if="tab == 0" flat class="mt-6 mx-2">
          <v-row no-gutters>
            <v-col cols="12" md="4">
              <v-row no-gutters class="mt-2">
                <v-col cols="12" md="5"><h5>Name :</h5></v-col>
                <v-col cols="12" md="7"
                  ><h5 class="text-blue-grey">
                    {{ this.StoreObj.organization_name }}
                  </h5></v-col
                >
              </v-row>
              <v-row no-gutters class="mt-2">
                <v-col cols="12" md="5"><h5>Contact Email-Id :</h5></v-col>
                <v-col cols="12" md="7"
                  ><h5 class="text-blue-grey">
                    {{ this.StoreObj.organization_contact_email_id }}
                  </h5></v-col
                >
              </v-row>
              <v-row no-gutters class="mt-2">
                <v-col cols="12" md="5"><h5>Created On :</h5></v-col>
                <v-col cols="12" md="7"
                  ><h5 class="text-blue-grey">
                    {{
                      new Date(
                        this.StoreObj.organization_created_on,
                      ).toLocaleString()
                    }}
                  </h5></v-col
                >
              </v-row>
              <v-row no-gutters class="mt-2">
                <v-col cols="12" md="5"><h5>Mapped To :</h5></v-col>
                <v-col cols="12" md="7"
                  ><h5 class="text-blue-grey">
                    {{ this.StoreObj.drug_mapping }}
                  </h5></v-col
                >
              </v-row>
              <v-row no-gutters class="mt-2">
                <v-col cols="12" md="5"><h5>Manufacturer Type :</h5></v-col>
                <v-col cols="12" md="7"
                  ><h5 class="text-blue-grey">
                    {{ this.StoreObj.manufacturer_type }}
                  </h5></v-col
                >
              </v-row>
              <v-row no-gutters class="mt-2">
                <v-col cols="12" md="5"><h5>Status :</h5></v-col>
                <v-col cols="12" md="7"
                  ><h5 class="text-green">
                    {{ this.StoreObj.organization_status }}
                  </h5></v-col
                >
              </v-row>
              <!-- <v-row no-gutters class="mt-2">
                <v-col cols="12" md="5"><h5></h5></v-col>
                <v-col cols="12" md="7"><h5 class="text-green"></h5></v-col>
              </v-row>
              <v-row no-gutters class="mt-2">
                <v-col cols="12" md="5"><h5></h5></v-col>
                <v-col cols="12" md="7"><h5 class="text-green"></h5></v-col>
              </v-row>
              <v-row no-gutters class="mt-2">
                <v-col cols="12" md="5"><h5></h5></v-col>
                <v-col cols="12" md="7"><h5 class="text-green"></h5></v-col>
              </v-row>
              <v-row no-gutters class="mt-2">
                <v-col cols="12" md="5"><h5></h5></v-col>
                <v-col cols="12" md="7"><h5 class="text-green"></h5></v-col>
              </v-row> -->
            </v-col>
            <v-col cols="8">
              <v-card flat variant="outlined" class="pa-3">
                <div v-if="reportLoading" class="pa-4">
                  <v-skeleton-loader type="image" height="220" />
                </div>
                <div v-else-if="!OverAllResult.length" class="org-chart-empty">
                  <v-icon size="32" class="mb-2">mdi-chart-bar</v-icon>
                  <div class="org-chart-empty__title">No visits in the 30 days before the selected date</div>
                  <div class="pw-muted">{{ ReportMessage || "Pick another date to see earlier activity." }}</div>
                </div>
                <template v-else>
                  <apexchart
                    height="240px"
                    type="bar"
                    :options="ComputedChartOptions"
                    :series="orgChartSeries"
                  />
                  <div align="center" class="mt-n4 font-weight-bold">
                    Total Visits
                  </div>
                </template>
              </v-card>
            </v-col>
            <v-col cols="12" md="12">
              <v-menu
                ref="OrgMenu"
                v-model="OrgMenu"
                :close-on-content-click="false"
                :return-value.sync="Orgdate"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="displayToDateValue"
                    label="Select Date"
                    prepend-inner-icon="mdi-calendar"
                    variant="outlined"
                    density="compact"
                    readonly
                    v-bind="props"
                    class="MaxWidthVariant2 mt-6"
                  ></v-text-field>
                </template>
                <v-card>
                  <v-date-picker
                    v-model="Orgdate"
                    no-title
                    scrollable
                    :max="maxDate"
                    hide-header
                  >
                  </v-date-picker>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn text color="primary" @click="OrgMenu = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      v-on:click="getDoctorReportFilter()"
                    >
                      OK
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
              <!-- <div class="pa-2">
               
                <v-card flat class="slide-in-from-bottom">
                  <v-row>
                    <v-col cols="12" xs="12" sm="12" md="12">
                      <v-card flat variant="outlined" class="pa-3">
                        <apexchart
                          v-if="mounted"
                          height="240px"
                          type="bar"
                          :options="ComputedChartOptions"
                          :series="ChartSeries"
                        />
                        <div align="center" class="mt-n4 font-weight-bold">
                          Total Visits
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </div> -->
            </v-col>
          </v-row>

          <v-row class="mt-n3">
            <v-col
              cols="12"
              md="4"
              sm="12"
              xs="12"
              v-for="(dashboardObj, idx) in OrgDashboardDetail"
              :key="idx"
            >
              <v-card
                height="100%"
                fill-height
                @click="GetRouterMethod(dashboardObj)"
                class="gradient-back"
              >
                <v-row justify="end" class="mr-1">
                  <v-btn depressed size="small" color="primary" class="mt-4">
                    <v-icon>{{
                      dashboardObj.type === "USER_ATTENDANCE"
                        ? "mdi-account-star"
                        : dashboardObj.type === "VISIT_POV"
                        ? "mdi-map-marker-radius"
                        : "mdi-medical-bag"
                    }}</v-icon>
                  </v-btn>
                </v-row>
                <v-row no-gutters class="pl-5 mt-5">
                  <v-col cols="12" md="12" sm="12" xs="12">
                    <div class="text-black darken-3 font-weight-bold">
                      {{
                        dashboardObj.type === "USER_ATTENDANCE"
                          ? "Users Attendance"
                          : dashboardObj.type === "VISIT_POV"
                          ? "Visit Details"
                          : "POV Details"
                      }}
                    </div>
                    <div
                      v-if="dashboardObj.type === 'USER_ATTENDANCE'"
                      class="mt-3 text-grey font-weight-bold"
                    >
                      Total Users :
                      <span class="text-black font-weight-bold">{{
                        userList.length
                      }}</span>
                    </div>
                  </v-col>

                  <!----User Attendance-->
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'USER_ATTENDANCE'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Present :<span class="mx-2">{{
                        dashboardObj.users_present
                      }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'USER_ATTENDANCE'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Absent :<span class="mx-2">{{
                        dashboardObj.users_absent
                      }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'USER_ATTENDANCE'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Logged In :<span class="mx-2">{{
                        dashboardObj.users_logged_in
                      }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'USER_ATTENDANCE'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Logged Out :<span class="mx-2">{{
                        dashboardObj.users_logged_out
                      }}</span>
                    </div>
                  </v-col>
                  <!---------VISit Pov------------------>

                  <v-col cols="12" md="12" sm="12" xs="12">
                    <div
                      v-if="dashboardObj.type === 'VISIT_POV'"
                      class="mt-3 text-grey font-weight-bold"
                    >
                      Total Visits :
                      <span class="text-black font-weight-bold">{{
                        dashboardObj.overall_visits
                      }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'VISIT_POV'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Visits :<span class="mx-2">{{
                        dashboardObj.current_days_visit
                      }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'VISIT_POV'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Monthly :<span class="mx-2">{{
                        dashboardObj.monthly_visits
                      }}</span>
                    </div>
                  </v-col>
                  <!-- <v-col
                      cols="12"
                      xs="12"
                      sm="12"
                      md="6"
                      v-if="dashboardObj.type === 'VISIT_POV'"
                      class="pt-2"
                    >
                      <div class="FontSize10px">
                        Overall :<span class="mx-2">{{
                          dashboardObj.overall_visits
                        }}</span>
                      </div>
                    </v-col> -->
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'VISIT_POV'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Visited Users :<span class="mx-2">{{
                        dashboardObj.visited_users
                      }}</span>
                    </div>
                  </v-col>
                  <!---------Pov Vist------------------>
                  <v-col cols="12" md="12" sm="12" xs="12">
                    <div
                      v-if="dashboardObj.type === 'POV_DETAIL'"
                      class="mt-3 text-grey font-weight-bold"
                    >
                      Total POVs :
                      <span class="text-black font-weight-bold">{{
                        dashboardObj.total_povs
                      }}</span>
                    </div>
                  </v-col>
                  <!-- <v-col
                      cols="12"
                      xs="12"
                      sm="12"
                      md="6"
                      v-if="dashboardObj.type === 'POV_DETAIL'"
                      class="pt-2"
                    >
                      <div class="FontSize10px">
                        POVs :<span class="mx-2">{{
                          dashboardObj.total_povs
                        }}</span>
                      </div>
                    </v-col> -->
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'POV_DETAIL'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Doctors :<span class="mx-2">{{
                        dashboardObj.total_doctors
                      }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'POV_DETAIL'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Distributors :<span class="mx-2">{{
                        dashboardObj.total_distributors
                      }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'POV_DETAIL'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Clients :<span class="mx-2">{{
                        dashboardObj.total_clients
                      }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'POV_DETAIL'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Pharmacists :<span class="mx-2">{{
                        dashboardObj.total_pharmacists
                      }}</span>
                    </div> </v-col
                  ><v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'POV_DETAIL'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Hospitals :<span class="mx-2">{{
                        dashboardObj.total_hospitals
                      }}</span>
                    </div> </v-col
                  ><v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'POV_DETAIL'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Collect Center :<span class="mx-2">{{
                        dashboardObj.total_collection_centers
                      }}</span>
                    </div> </v-col
                  ><v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'POV_DETAIL'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Patient :<span class="mx-2">{{
                        dashboardObj.total_patients
                      }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="dashboardObj.type === 'POV_DETAIL'"
                    class="pt-2"
                  >
                    <div class="FontSize10px">
                      Draft POVs :<span class="mx-2">{{
                        dashboardObj.draft_povs
                      }}</span>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card v-if="tab == 1" class="pa-2">
          <v-row no-gutters>
            <v-col cols="12" sm="12" md="12" xs="12">
              <v-toolbar density="compact" color="white" class="elevation-0">
                <v-spacer />
                <v-select
                  :items="pov_typeList"
                  v-model="pov_type"
                  class="mt-6 mr-2 MaxWidth"
                  variant="outlined"
                  density="compact"
                  label="Pov Type"
                  item-title="text"
                  item-value="value"
                  :menu-props="{ contentClass: 'SelectFontSize' }"
                >
                </v-select>
                <v-select
                  :items="statusItems"
                  v-model="status"
                  class="mt-6 mr-2 MaxWidth"
                  variant="outlined"
                  density="compact"
                  label="Pov Status"
                  :menu-props="{ contentClass: 'SelectFontSize' }"
                >
                </v-select>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  label="Search"
                  class="mt-6 MaxWidth"
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                ></v-text-field>
                <v-card-actions class="">
                  <v-tooltip
                    color="primary"
                    activator="parent"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <a>
                        <v-icon
                          class="mt-n2"
                          @click="
                            DownloadMyExcel(
                              pov_type == 'PHARMACIST' ||
                                pov_type == 'DISTRIBUTOR'
                                ? headersPhar
                                : headers1,
                              povList,
                              'POVs',
                            )
                          "
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
          <v-col cols="12" sm="12" md="12" xs="12">
            <v-data-table
              v-model:page="page"
              density="compact"
              :search="search"
              :headers="
                pov_type == 'PHARMACIST' || pov_type == 'DISTRIBUTOR'
                  ? headersPhar
                  : headers1
              "
              :items="povList"
              hide-default-footer
              class="elevation-0 TableClass"
              :no-data-text="NoData"
              fixed-header
              :height="productheight"
              :footer-props="{
                'items-per-page-options': [100, 200, 500],
              }"
              :items-per-page="itemsPerPage"
            >
              <template v-slot:[`item.num`]="{ item }">
                <span class="FontSize">{{ povList.indexOf(item) + 1 }}</span>
              </template>

              <template v-slot:[`item.pov_name`]="{ item }">
                <span class="FontSize" v-if="item.pov_name">{{
                  item.pov_name
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.pov_city`]="{ item }">
                <span class="FontSize" v-if="item.pov_city">{{
                  item.pov_city
                }}</span>
                <span v-else> -</span>
              </template>
              <template v-slot:[`item.pov_identity`]="{ item }">
                <span class="FontSize" v-if="item.pov_identity">{{
                  item.pov_identity
                }}</span>
                <span v-else> -</span>
              </template>

              <template v-slot:[`item.specialization_name`]="{ item }">
                <span class="FontSize" v-if="item.specialization_name">{{
                  item.specialization_name
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.pov_company_name`]="{ item }">
                <span class="FontSize" v-if="item.pov_company_name">{{
                  item.pov_company_name
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.pov_creator_name`]="{ item }">
                <span class="FontSize" v-if="item.pov_creator_name">{{
                  item.pov_creator_name
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.pov_contact_number`]="{ item }">
                <span class="FontSize" v-if="item.pov_contact_number">{{
                  item.pov_contact_number
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.pov_email_id`]="{ item }">
                <span class="FontSize" v-if="item.pov_email_id">{{
                  item.pov_email_id
                }}</span>
                <span v-else>-</span>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-container>
                <v-pagination
                  v-model="page"
                  variant="elevated"
                  size="small"
                  active-color="primary"
                  :length="pageCount"
                  @click.stop="checkPagination()"
                ></v-pagination>
              </v-container>
            </div>
          </v-col>
        </v-card>
        <v-card v-if="tab == 2" class="pa-2 elevation-0">
          <v-row no-gutters>
            <div class="ml-2">
              Users :
              <span class="font-weight-bold">{{ userList.length }}</span>
            </div>
            <v-spacer />
            <v-col cols="12" sm="12" md="8" xs="12">
              <v-toolbar density="compact" color="white" class="elevation-0">
                <v-spacer />
                <v-select
                  :items="user_typeList"
                  v-model="user_type"
                  class="mt-6 mr-2 MaxWidth"
                  variant="outlined"
                  density="compact"
                  label="User Type"
                  item-title="text"
                  item-value="value"
                  :menu-props="{ contentClass: 'SelectFontSize' }"
                >
                </v-select>
                <v-select
                  :items="userstatusItems"
                  v-model="user_status"
                  class="mt-6 mr-2 MaxWidth"
                  variant="outlined"
                  density="compact"
                  label="User Status"
                  :menu-props="{ contentClass: 'SelectFontSize' }"
                >
                </v-select>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  label="Search"
                  class="mt-6 MaxWidth"
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                ></v-text-field>
                <v-card-actions class="">
                  <v-tooltip
                    color="primary"
                    activator="parent"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <a>
                        <v-icon
                          @click="DownloadMyExcel(headers, userList, 'Users')"
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
          <v-col cols="12" sm="12" md="12" xs="12">
            <!-- 
						show-select
            :single-select="singleSelect"
            v-model="selected"
            item-key="user_name" -->
            <v-data-table
              density="compact"
              :search="search"
              :headers="headers"
              :items="userList"
              hide-default-footer
              class="elevation-0 TableClass"
              :no-data-text="NoData"
              @click:row="handleRowClick"
              :page.sync="page"
              @page-count="pageCount = $event"
              fixed-header
              :height="productheight"
              :footer-props="{
                'items-per-page-options': [100, 200, 500],
              }"
              :items-per-page="100"
            >
              <template v-slot:[`item.num`]="{ item }">
                <span class="FontSize">{{ userList.indexOf(item) + 1 }}</span>
              </template>

              <template v-slot:[`item.user_name`]="{ item }">
                <span class="FontSize" v-if="item.user_name">{{
                  item.user_name
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.user_type`]="{ item }">
                <span class="FontSize" v-if="item.user_type">{{
                  item.user_type
                }}</span>
                <span v-else> -</span>
              </template>
              <template v-slot:[`item.user_status`]="{ item }">
                <span class="FontSize" v-if="item.user_status">{{
                  item.user_status
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.user_full_number`]="{ item }">
                <span class="FontSize" v-if="item.user_full_number">{{
                  item.user_full_number
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.user_email_id`]="{ item }">
                <span class="FontSize" v-if="item.user_email_id">{{
                  item.user_email_id
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.app_version`]="{ item }">
                <v-row>
                  <v-icon v-if="item.mobile_type == 'IOS'" size="25px"
                    >mdi-apple</v-icon
                  >
                  <v-icon
                    v-else-if="item.mobile_type == 'ANDROID'"
                    size="20px"
                    color="green"
                    >mdi-android</v-icon
                  >
                  <span v-else color="black" class="ml-2 mr-2"> - </span>
                  <span class="ml-3 caption">{{ item.app_version }}</span>
                </v-row>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination
                v-model="page"
                :length="pageCount"
                variant="elevated"
                active-color="primary"
                size="small"
              ></v-pagination>
            </div>
          </v-col>
          <orgUserDialog
            :userDialog="userDialog"
            :userObj="userObj"
            @clicked="CreateEditSpecEmit"
          />
        </v-card>

        <v-card v-if="tab == 3" class="pa-2 elevation-0">
          <v-col cols="12" sm="12" md="12" xs="12" class="mt-n2">
            <v-toolbar color="white" class="elevation-0">
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
                    v-model="formattedFromDate"
                    label="From Date"
                    class="FontSize mr-1 mt-2"
                    @click:append="date ? getcal() : getcal()"
                    readonly
                    v-bind="props"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="FromDate"
                  :max="ToDate"
                  no-title
                  scrollable
                  hide-header
                >
                  <v-spacer />
                  <v-btn text color="primary" @click="menuFromDate = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuFromDate.save(FromDate)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
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
                    v-model="formattedToDate"
                    label="To Date"
                    class="FontSize mr-2 mt-2"
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
                      @click="$refs.menuToDate.save(ToDate)"
                      v-on:click="getFilteredValues"
                    >
                      OK
                    </v-btn>
                  </v-card-actions></v-card
                >
              </v-menu>
              <v-select
                density="compact"
                variant="outlined"
                class="FontSize mr-2 mt-2"
                :items="povTypeItems"
                v-model="pov_List"
                item-title="text"
                item-value="value"
                label="Pov Type"
                :menu-props="{ contentClass: 'SelectFontSize' }"
              >
                <!-- @input="getFilteredValues" -->
              </v-select>
              <v-text-field
                variant="outlined"
                ref="search"
                density="compact"
                class="FontSize mr-2 mt-2"
                v-model="search"
                label="Search"
                append-inner-icon="mdi-magnify"
              >
              </v-text-field>
              <v-card-actions class="">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <a>
                      <v-icon
                        class="mt-n7"
                        @click="
                          DownloadMyExcel(visitheaders, visitList, 'Visits')
                        "
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
          <v-col cols="12" sm="12" md="12" xs="12" class="mt-n8">
            <v-data-table
              v-model:page="pageVisit"
              density="compact"
              :search="search"
              :headers="visitheaders"
              :items="visitList"
              hide-default-footer
              class="elevation-0 TableClass"
              :no-data-text="NoData"
              @click:row="VisithandleRowClick"
              fixed-header
              :height="productheight"
              :footer-props="{
                'items-per-page-options': [100, 200, 500],
              }"
              :items-per-page="itemsPerPage"
            >
              <template v-slot:[`item.pov_visited_on`]="{ item }">
                <span class="FontSize" v-if="item.pov_visited_on">{{
                  new Date(item.pov_visited_on)
                    .toLocaleString()
                    .replaceAll("/", "-")
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.user_name`]="{ item }">
                <span class="FontSize" v-if="item.user_name">{{
                  item.user_name
                }}</span>
                <span v-else> -</span>
              </template>
              <template v-slot:[`item.user_employee_id`]="{ item }">
                <span class="FontSize" v-if="item.user_employee_id">{{
                  item.user_employee_id
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.d_o_j`]="{ item }">
                <span class="FontSize" v-if="item.d_o_j">{{
                  convertDate(item.d_o_j * 1000)
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.designation`]="{ item }">
                <span class="FontSize" v-if="item.designation">{{
                  item.designation
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.territory_names`]="{ item }">
                <span class="FontSize" v-if="item.territory_names">{{
                  item.territory_names
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.admin_or_manager_name`]="{ item }">
                <span class="FontSize" v-if="item.admin_or_manager_name">{{
                  item.admin_or_manager_name
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.pov_type`]="{ item }">
                <span class="FontSize" v-if="item.pov_type">{{
                  item.pov_type
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.pov_name`]="{ item }">
                <span class="FontSize" v-if="item.pov_name">{{
                  item.pov_name
                }}</span>
                <span v-else>-</span>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-container>
                <v-pagination
                  variant="elevated"
                  active-color="primary"
                  size="small"
                  v-model="pageVisit"
                  :length="visitpageCount"
                ></v-pagination>
              </v-container>
            </div>
          </v-col>
          <VisitLogDialog
            :VisitDialog="VisitDialog"
            :visitObj="visitObj"
            @clicked="VisitEmit"
          />
        </v-card>
        <v-card v-if="tab == 4" class="pa-2">
          <v-toolbar class="elevation-0" color="white" density="compact">
            <div class="text-grey font-weight-bold">
              Total Products :
              <span class="text-black font-weight-bold">{{
                productList.length
              }}</span>
            </div>
            <v-spacer />
            <v-select
              density="compact"
              variant="outlined"
              :items="Product_Status"
              v-model="product_status_value"
              class="MaxWidthVariant2 mt-6 mr-3"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            ></v-select>
            <v-tooltip color="primary" location="bottom">
              <template v-slot:activator="{ props }">
                <a>
                  <v-icon
                    class=""
                    @click="
                      DownloadMyExcel(productheaders, productList, 'Products')
                    "
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
          </v-toolbar>
          <v-col cols="12" sm="12" md="12" xs="12">
            <v-data-table
              v-model:page="page"
              density="compact"
              :search="search"
              :headers="productheaders"
              :items="productList"
              hide-default-footer
              class="elevation-0 TableClass"
              :no-data-text="NoData"
              @click:row="handleRowClick"
              fixed-header
              :height="productheight"
              :footer-props="{
                'items-per-page-options': [100, 200, 500],
              }"
              :items-per-page="itemsPerPage"
            >
              <template v-slot:[`item.num`]="{ item }">
                <span class="FontSize">{{
                  productList.indexOf(item) + 1
                }}</span>
              </template>
              <template v-slot:[`item.catalog_mrp`]="{ item }">
                <div v-if="item.catalog_mrp" class="FontSize">
                  {{ item.catalog_mrp }}
                </div>
                <div v-else>-</div>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-container>
                <v-pagination
                  variant="elevated"
                  active-color="primary"
                  size="small"
                  v-model="page"
                  :length="pageCount"
                ></v-pagination>
              </v-container>
            </div>
          </v-col>
        </v-card>
        <v-card v-if="tab == 5" class="pa-2">
          <v-toolbar class="elevation-0" color="white" density="compact">
            <div class="text-grey font-weight-bold">
              Total Territories :
              <span class="text-black font-weight-bold">{{
                territoryList.length
              }}</span>
            </div>
            <v-spacer />
            <v-select
              density="compact"
              variant="outlined"
              :items="Territory_Status"
              v-model="territory_status_value"
              class="MaxWidthVariant2 mt-6 mr-3"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            ></v-select>
            <v-tooltip color="primary" location="bottom">
              <template v-slot:activator="{ props }">
                <a>
                  <v-icon
                    class=""
                    @click="
                      DownloadMyExcel(
                        territoryheaders,
                        territoryList,
                        'Territories',
                      )
                    "
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
          </v-toolbar>
          <v-col cols="12" sm="12" md="12" xs="12">
            <v-data-table
              v-model="page"
              density="compact"
              :search="search"
              :headers="territoryheaders"
              :items="territoryList"
              hide-default-footer
              class="elevation-0 TableClass"
              :no-data-text="NoData"
              @click:row="handleRowClick"
              fixed-header
              :height="productheight"
              :footer-props="{
                'items-per-page-options': [100, 200, 500],
              }"
              :items-per-page="itemsPerPage"
            >
              <template v-slot:[`item.num`]="{ item }">
                <span class="FontSize">{{
                  territoryList.indexOf(item) + 1
                }}</span>
              </template>

              <template v-slot:[`item.territory_name`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      {{
                        item.territory_name.length > 28
                          ? item.territory_name.substr(0, 28) + "..."
                          : item.territory_name
                      }}
                    </div>
                  </template>
                  <span class="primary">{{ item.territory_name }}</span>
                </v-tooltip>
              </template>
              <template v-slot:[`item.territory_description`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div
                      v-if="item.territory_description"
                      class="FontSize"
                      v-bind="props"
                    >
                      {{
                        item.territory_description.length > 40
                          ? item.territory_description.substr(0, 40) + "..."
                          : item.territory_description
                      }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <span class="primary">{{ item.territory_description }}</span>
                </v-tooltip>
              </template>
              <template v-slot:[`item.territory_type`]="{ item }">
                <span
                  class="FontSize text-teal"
                  v-if="item.territory_type == 'NON_GEO_BASED'"
                >
                  Non Geo Based
                </span>
                <span
                  class="FontSize text-primary"
                  v-if="item.territory_type == 'ACTUAL'"
                >
                  Geo Based
                </span>
                <span
                  class="FontSize text-teal"
                  v-if="item.territory_type == 'VIRTUAL'"
                >
                  Aggregate
                </span>
                <!-- <span v-else>-</span> -->
              </template>
              <template v-slot:[`item.territory_category_name`]="{ item }">
                <span class="FontSize" v-if="item.territory_category_name">{{
                  item.territory_category_name
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.territory_area`]="{ item }">
                <span class="FontSize" v-if="item.territory_area">{{
                  item.territory_area
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.territory_budget`]="{ item }">
                <span class="FontSize" v-if="item.territory_budget">{{
                  item.territory_budget
                }}</span>
                <span v-else>-</span>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-container>
                <v-pagination
                  variant="elevated"
                  active-color="primary"
                  size="small"
                  v-model="page"
                  :length="pageCount"
                ></v-pagination>
              </v-container>
            </div>
          </v-col>
        </v-card>
        <v-card v-if="tab == 6" class="pa-2">
          <v-toolbar density="compact" color="white">
            <v-spacer />
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
                  class="FontSize mr-1 mt-6 MaxWidth"
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
                  class="FontSize mr-2 mt-6 MaxWidth"
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
                  <v-btn text color="primary" @click.stop="confirmDate()">
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <v-select
              density="compact"
              variant="outlined"
              label="Log Type"
              class="mt-6 mr-2"
              v-model="log_type"
              :items="log_type_list"
              item-title="text"
              item-value="value"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            >
            </v-select>

            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <a>
                  <v-icon
                    @click="DownloadMyExcel(auditLogs, auditList, 'Audit Logs')"
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
          </v-toolbar>

          <v-col cols="12" sm="12" md="12" xs="12" class="">
            <v-data-table
              v-model:page="page"
              density="compact"
              :search="search"
              :headers="auditLogs"
              :items="auditList"
              hide-default-footer
              class="elevation-0 TableClass"
              :no-data-text="NoData"
              fixed-header
              height="500px"
              :footer-props="{
                'items-per-page-options': [100, 200, 500],
              }"
              :items-per-page="itemsPerPage"
            >
              <template v-slot:[`item.num`]="{ item }">
                <span class="FontSize">{{ auditList.indexOf(item) + 1 }}</span>
              </template>

              <template v-slot:[`item.log_action`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div class="FontSize" v-bind="props">
                      {{
                        item.log_action.length >= 15
                          ? item.log_action.substr(0, 15) + "..."
                          : item.log_action
                      }}
                    </div>
                  </template>
                  <span class="primary">{{ item.log_action }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.logged_on`]="{ item }">
                <span class="FontSize" v-if="item.logged_on">{{
                  new Date(item.logged_on).toLocaleString()
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.log_type`]="{ item }">
                <span class="FontSize" v-if="item.log_type">{{
                  item.log_type.replace("_", " ")
                }}</span>
                <span v-else>-</span>
              </template>
              <template v-slot:[`item.log_source`]="{ item }">
                <span class="FontSize" v-if="item.log_source">{{
                  item.log_source
                }}</span>
                <span v-else>-</span>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-container>
                <v-pagination
                  variant="elevated"
                  active-color="primary"
                  size="small"
                  v-model="page"
                  :length="pageCount"
                ></v-pagination>
              </v-container>
            </div>
          </v-col>
        </v-card>
        <v-card v-if="tab == 7" elevation="0">
          <v-toolbar density="compact" color="white" class="elevation-0">
            <v-select
              variant="outlined"
              density="compact"
              class="mt-6 ml-3 MaxWidthVariant2"
              :items="AnalyticsItems"
              v-model="AnalyticsValue"
              bg-color="#e3e3e3"
              item-title="text"
              item-value="value"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            ></v-select
          ></v-toolbar>
          <AttendanceReport
            :ActionObj="StoreObj"
            v-if="AnalyticsValue == 'ATTENDANCE_REPORT'"
          />
          <CMEReport
            :ActionObj="StoreObj"
            v-if="AnalyticsValue == 'CME_REPORT'"
          />
          <EdetailLogReport
            :ActionObj="StoreObj"
            v-if="AnalyticsValue == 'EDETAIL_LOGS'"
          />
          <DoctorConversionReport
            :ActionObj="StoreObj"
            v-if="AnalyticsValue == 'DOCTOR_CONVERSION'"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { errorMessage } from "@/utils/errorMessage.js";
import { dayStartMs, dayEndMs } from "@/utils/dates.js";
import {
  ListOrganizationUsers,
  ListOrganizationsDailyReport,
  ListOrganizationPOVs,
  ListVisitLogsOfOrganization,
  ListOrganizationProducts,
  ListOrganizationTerritories,
  ListOrganizationsAuditLogs,
  ListVisitLogByTime,
} from "@/graphql/queries.js";
// import BarChart from "@/components/Charts/BarChart.js";
import Overlay from "@/components/Overlay.vue";
import orgUserDialog from "@/components/Dialogs/orgUserDialog.vue";
import VisitLogDialog from "@/components/Dialogs/VisitLogDialog.vue";
import { GetOrgReports } from "@/mixins/GetOrgDetailReport.js";
import { GetOrgDashboardDetail } from "@/mixins/GetDashBoardDetails.js";
import { DownloadExcel } from "@/mixins/Extras/DownloadExcel.js";

import AttendanceReport from "@/components/Analytics/Cards/AttendanceReport.vue";
import CMEReport from "@/components/Analytics/Cards/CMEReport.vue";
import EdetailLogReport from "@/components/Analytics/Cards/EdetailLogs.vue";
import DoctorConversionReport from "@/components/Analytics/Cards/DoctorConversionReport.vue";

import moment from "moment";
import VueApexCharts from "vue3-apexcharts";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  components: {
    Overlay,
    orgUserDialog,
    // BarChart,
    VisitLogDialog,
    apexchart: VueApexCharts,
    AttendanceReport,
    CMEReport,
    EdetailLogReport,
    DoctorConversionReport,
  },
  props: {
    StoreObj: Object,
    GetCurrentUserDetailsObj: Object,
  },
  mixins: [GetOrgReports, GetOrgDashboardDetail, DownloadExcel],
  data: () => ({
    Orgdate: new Date(),
    maxDate: new Date().toISOString().substring(0, 10),
    OrgMenu: false,
    ChartSeries: [
      {
        name: "Total Visits",
        data: [],
      },
    ],
    ActionObj: {},
    selected: [],
    VisitDialog: false,
    tab: 0,
    userList: [],
    overlay: false,
    search: null,
    page: 1,
    pageVisit: 1,
    NoData: "No records found",
    userObj: {},
    visitObj: {},
    userDialog: false,
    pov_type: "DOCTOR",
    status: "ACTIVE",
    menuToDate: false,
    menuFromDate: false,
    FromDate: new Date(),
    ToDate: new Date(),
    FromDateValue: new Date().toISOString().substr(0, 10),
    ToDateValue: new Date().toISOString().substr(0, 10),
    DoctorTypeList: [],
    employe: "ALL",
    EmployeeNames: [],
    designation: "ALL",
    DesignationList: [],
    pov_categoryList: [],
    pov_category: "ALL",
    // povTypeItems: ["DOCTOR", "PHARMACIST", "PHARMACIST"],
    Product_Status: ["ACTIVE", "INACTIVE"],
    product_status_value: "ACTIVE",
    Territory_Status: ["ACTIVE", "INACTIVE"],
    territory_status_value: "ACTIVE",
    povTypeItems: [
      { text: "DOCTOR", value: "DOCTOR" },
      { text: "PHARMACIST", value: "PHARMACIST" },
      { text: "DISTRIBUTOR", value: "DISTRIBUTOR" },
      { text: "HOSPITAL", value: "HOSPITAL" },
      { text: "CLIENT", value: "CLIENT" },
      { text: "COLLECTION CENTER", value: "COLLECTION_CENTER" },
      { text: "PATIENT", value: "PATIENT" },
    ],
    UserList: [],
    auditList: [],
    log_type: "POV_MANAGEMENT",
    log_type_list: [
      { text: "POV MANAGEMENT", value: "POV_MANAGEMENT" },
      { text: "USER MANAGEMENT", value: "USER_MANAGEMENT" },
      { text: "REPORT MANAGEMENT", value: "REPORT_MANAGEMENT" },
    ],

    auditLogs: [
      { title: "#", key: "num" },
      { title: "Log Action", key: "log_action" },
      { title: "Log Source", key: "log_source" },
      { title: "Type", key: "log_type" },
      { title: "Logged On", key: "logged_on" },
      { title: "Logged By", key: "logged_by" },
    ],

    headers: [
      { title: "#", key: "num" },
      { title: "User Name", key: "user_name" },
      { title: "User Type", key: "user_type" },
      { title: "Status", key: "user_status" },
      { title: "Version", key: "app_version" },
      { title: "Contact", key: "user_full_number" },
      { title: "Email-Id", key: "user_email_id" },
    ],
    // povheaders: [
    //   { title: "#", key: "num" },
    //   { title: "POV's", key: "pov_name" },
    //   { title: "Type", key: "pov_type" },
    //   { title: "Status", key: "pov_status" },
    //   { title: "Contact", key: "pov_full_number" },
    //   { title: "Email-Id", key: "pov_email_id" },
    // ],
    headersPhar: [
      {
        title: "SI",
        align: "start",
        key: "num",
      },
      {
        title: "Name",
        key: "pov_name",
      },
      {
        title: "Company Name",
        key: "pov_company_name",
      },
      { title: "Address", key: "pov_address" },
      { title: "City", key: "pov_city" },
      { title: "Contact No.", key: "pov_contact_number" },
      { title: "POV Id", key: "pov_identity" },
      { title: "POV Creator", key: "pov_creator_name" },
      // { title: "Territories", key: "territory_count" },
    ],

    headers1: [
      {
        title: "SI",
        align: "start",
        key: "num",
      },
      {
        title: "Name",
        key: "pov_name",
      },

      { title: "Address", key: "pov_address" },
      { title: "City", key: "pov_city" },
      { title: "Contact No.", key: "pov_contact_number" },
      { title: "Specialization", key: "specialization_name" },
      { title: "POV Id", key: "pov_identity" },
      // { title: "Territories", key: "territory_count" },
    ],
    visitheaders: [
      { title: "#", key: "num" },
      {
        title: "Date",
        key: "pov_visited_on",
        tooltip_text: "Date",
        width: "100px",
      },
      {
        title: "Employee",
        align: "start",
        key: "user_name",
        tooltip_text: "Employee",
      },
      { title: "E-Id", key: "user_employee_id", tooltip_text: "Employee-Id" },
      {
        title: "DOJ",
        key: "d_o_j",
        tooltip_text: "Date Of Joining",
        width: "100px",
      },
      // { title: "Status", key: "user_status", tooltip_text: "Status" },
      {
        title: "Designation",
        key: "designation",
        tooltip_text: "Designation",
      },
      {
        title: "Territory",
        key: "territory_names",
        tooltip_text: "Territory Name",
      },
      // {
      //   title: "T C",
      //   key: "territory_categories",
      //   tooltip_text: "Territory Category",
      // },
      // { title: "HQ", key: "territory_hq", tooltip_text: "Head Quarter" },
      {
        title: "Manager",
        key: "admin_or_manager_name",
        tooltip_text: "First Level Manager",
      },
      // {
      //   title: "SLR",
      //   key: "secondary_reporter_name",
      //   tooltip_text: "Second Level Reporting",
      // },
      { title: "POV Name", key: "pov_name", tooltip_text: "POV Name" },
      { title: "POV Type", key: "pov_type", tooltip_text: "POV Type" },

      // {
      //   title: "P C",
      //   key: "pov_category_name",
      //   tooltip_text: "POV Category",
      // },
      // {
      //   title: "P V D",
      //   key: "pov_last_visited_on",
      //   tooltip_text: "Previous Visit to Doctor",
      // },
      // {
      //   title: "Specialization",
      //   key: "specialization_name",
      //   tooltip_text: "Specialization",
      // },
      // {
      //   title: "PP",
      //   key: "items_given_list",

      //   tooltip_text: "Product Promoted",
      // },
      // {
      //   title: "A C",
      //   key: "accompanied_user_designation_name",
      //   tooltip_text: "Accompanied By",
      // },
      // {
      //   title: "Log Status",
      //   key: "visit_log_status",
      //   tooltip_text: "Visit Log Status",
      // },
      // { title: "Comments", key: "comments", tooltip_text: "Comments" },
    ],
    productheaders: [
      { title: "#", key: "num" },
      { title: "Product", key: "catalog_name" },
      { title: "MRP", key: "catalog_mrp" },
      { title: "Product Type", key: "drug_type" },
      { title: "PTR", key: "catalog_ptr" },
      { title: "PTS", key: "catalog_pts" },
      { title: "Qty", key: "drug_quantity" },
    ],
    territoryheaders: [
      { title: "#", key: "num" },
      { title: "Territory", key: "territory_name" },
      { title: "Type", key: "territory_type" },
      { title: "Description", key: "territory_description" },
      { title: "Category", key: "territory_category_name" },
      { title: "Area", key: "territory_area" },
      { title: "Budget", key: "territory_budget" },
    ],
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
    optionsgraphLineSales: {
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
    mounted: true,
    next_token: null,
    from_dates: null,
    fromdatess: null,
    count: 0,
    displayToDateValue: new Date().toISOString().substr(0, 10),
    productheight: 0,
    pov_List: "DOCTOR",
    povList: [],
    visitList: [],
    productList: [],
    territoryList: [],
    storePageCount: 0,
    storePageCountVisit: 0,
    user_type: "ALL",
    itemsPerPage: 100,
    user_status: "ACTIVE",
    userstatusItems: ["ACTIVE", "INACTIVE"],
    user_typeList: [
      { text: "ALL", value: "ALL" },
      { text: "OWNER", value: "OWNER" },
      { text: "ADMIN", value: "ADMIN" },
      { text: "MANAGER", value: "MANAGER" },
      { text: "HOD", value: "HOD" },
      { text: "FIELD REPS", value: "MEDREP" },
    ],
    pov_typeList: [
      {
        text: "DOCTOR",
        value: "DOCTOR",
      },
      {
        text: "PHARMACIST",
        value: "PHARMACIST",
      },
      {
        text: "DISTRIBUTOR",
        value: "DISTRIBUTOR",
      },
      {
        text: "HOSPITAL",
        value: "HOSPITAL",
      },
      {
        text: "CLIENT",
        value: "CLIENT",
      },
      {
        text: "COLLECTION CENTER",
        value: "COLLECTION_CENTER",
      },
      {
        text: "PATIENT",
        value: "PATIENT",
      },
    ],
    statusItems: ["ACTIVE", "INACTIVE", "UNVERIFIED", "DRAFT"],
    AnalyticsItems: [
      {
        text: "ATTENDANCE REPORT",
        value: "ATTENDANCE_REPORT",
      },
      {
        text: "CME REPORT",
        value: "CME_REPORT",
      },
      // {
      //   text: "Monthly Coverage",
      //   value: "MONTHLY_COVERAGE",
      // },
      {
        text: "EDetail logs",
        value: "EDETAIL_LOGS",
      },
      {
        text: "Doctor Conversion",
        value: "DOCTOR_CONVERSION",
      },
    ],
    AnalyticsValue: "ATTENDANCE_REPORT",
  }),
  computed: {
    // displayToDateValue() {
    //   let currentDate = new Date(this.to_date);
    //   const getLast30Days = new Date(currentDate);
    //   getLast30Days.setDate(currentDate.getDate() - 30);
    //   this.from_date = new Date(getLast30Days).toISOString().substring(0, 10);
    //   // this.GetInbetweenDatesMethod(this.from_date, this.to_date);
    //   return new Date(this.to_date).toISOString().substring(0, 10);
    // },
    pageCount() {
      if (this.tab == 1) {
        return Math.ceil(this.povList.length / this.itemsPerPage);
      } else if (this.tab == 4) {
        return Math.ceil(this.productList.length / this.itemsPerPage);
      } else if (this.tab == 5) {
        return Math.ceil(this.territoryList.length / this.itemsPerPage);
      } else if (this.tab == 6) {
        return Math.ceil(this.auditList.length / this.itemsPerPage);
      }
    },
    visitpageCount() {
      if (this.tab == 3) {
        return Math.ceil(this.visitList.length / this.itemsPerPage);
      }
    },
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
    OrgFormatDate() {
      return this.Orgdate
        ? new Date(this.Orgdate)
            .toLocaleDateString("en-GB")
            .replaceAll("/", "-")
        : "";
    },
    sortedOrgReports() {
      return (this.OverAllResult || [])
        .slice()
        .sort((x, y) => Number(x.created_on) - Number(y.created_on));
    },
    orgChartSeries() {
      return [{ name: "Total Visits", data: this.sortedOrgReports.map((x) => x.total_visits || 0) }];
    },
    ComputedChartOptions() {
      const ChartOptions = {
        colors: ["#607d8b"],
        chart: {
          type: "bar",
          height: 350,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        legend: {
          position: "top",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["#607d8b"],
        },
        xaxis: {
          categories: [],
        },

        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val;
            },
          },
        },
      };
      ChartOptions.xaxis.categories = this.sortedOrgReports.map((x) => x.current_day);
      return ChartOptions;
    },
  },
  watch: {
    tab(val) {
      if (val == 0) {
        console.log("jj");
        // this.getDashboardBarchart();
      } else if (val == 1) {
        this.getOrgbyPOV(this.pov_type, this.status, undefined, null);
      } else if (val == 2) {
        this.getOrgbyUser(this.user_status, "ALL");
      } else if (val == 3) {
        this.FromDate = new Date(
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
        // console.log("tostamp", toDatetimestamp);
        // var fromDatetimestamp = new Date(
        //   this.FromDate.split("-")[0],
        //   this.FromDate.split("-")[1] - 1,
        //   this.FromDate.split("-")[2],
        //   23,
        //   59,
        //   59
        // ).getTime();
        // console.log("from", fromDatetimestamp);
        const FromOneMonthAgo = new Date(
          Math.floor(new Date().getTime() / 1000 - 2629743) * 1000,
        );

        this.FromDate = FromOneMonthAgo;
        this.FromDateValue = FromOneMonthAgo.toISOString().substr(0, 10);
        this.getOrgbyVisits(
          new Date(new Date(this.FromDateValue).setHours(0, 0, 1, 0)).getTime(),
          new Date(
            new Date(this.ToDateValue).setHours(23, 59, 59, 999),
          ).getTime(),
          this.pov_List,
          null,
        );
      } else if (val == 4) {
        this.getOrgbyProduct();
      } else if (val == 5) {
        this.getOrgbyTerritory();
      } else if (val == 6) {
        this.getOrgbyAuditLogs();
      }
    },
    log_type(val) {
      console.log("value log type", val);
      this.getOrgbyAuditLogs(val);
    },
    user_type(val) {
      if (val != "") {
        this.getOrgbyUser(this.user_status, val);
      }
    },
    user_status(val) {
      if (val != "") {
        this.getOrgbyUser(val, this.user_type);
      }
    },
    pov_type() {
      this.getOrgbyPOV(this.pov_type, this.status, null, "SWITCH");
    },
    status() {
      this.getOrgbyPOV(this.pov_type, this.status, null, "SWITCH");
    },
    pov_List(val) {
      if (val != "") {
        var toDatetimestamp = dayEndMs(this.ToDateValue);
        var fromDatetimestamp = dayStartMs(this.FromDateValue);
        // this.visitList = [];
        this.getOrgbyVisits(fromDatetimestamp, toDatetimestamp, val, null);
      }
    },
    territory_status_value(val) {
      if (val != "") {
        this.getOrgbyTerritory();
      }
    },
    product_status_value(val) {
      if (val != "") {
        this.getOrgbyProduct();
      }
    },
    pageVisit() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        var toDatetimestamp = dayEndMs(this.ToDateValue);
        var fromDatetimestamp = dayStartMs(this.FromDateValue);
        this.getOrgbyVisits(
          fromDatetimestamp,
          toDatetimestamp,
          this.pov_List,
          this.next_token,
        );
      }
    },

    // AnalyticsValue(val) {
    //   if (val == "ATTENDANCE_REPORT") {
    //   }
    // },
  },
  async mounted() {
    this.productheight = window.innerHeight - 245;
    this.fromdatess = await this.displayToDate();

    setTimeout(() => {
      this.GetOrgDashboardDetailsmethod(
        new Date(this.Orgdate).getTime(),
        this.StoreObj.organization_id,
      );

      this.GetOrgReportsMethods(
        this.fromdatess,
        new Date(this.Orgdate).getTime() + 24 * 60 * 60 * 1000,
        this.$store.getters.get_current_user_details.user_id,
        this.StoreObj.organization_id,
      );
    }, 1000);
    this.getOrgbyUser(this.user_status, this.user_type);
    // this.getDashboardBarchart();
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
      // Reload with the dates just picked (either OK button).
      this.getOrgbyAuditLogs();
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    displayToDate() {
      let currentDate = new Date(this.Orgdate);
      const getLast30Days = new Date(currentDate);
      getLast30Days.setDate(currentDate.getDate() - 30);
      // this.from_dates = new Date(getLast30Days).toISOString().substring(0, 10);
      // this.GetInbetweenDatesMethod(this.from_date, this.to_date);
      return getLast30Days.getTime();
    },
    getDoctorReportFilter() {
      this.OrgMenu = false;

      const selectedDate = new Date(this.Orgdate);

      // Keep to_date same as selected
      const toDateEpoch = selectedDate.getTime() + 24 * 60 * 60 * 1000;

      // from_date = exactly 1 month before selected date
      const fromDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() - 1,
        selectedDate.getDate(),
      );

      const fromDateEpoch = fromDate.getTime();

      // For display (YYYY-MM-DD in local time)
      this.displayToDateValue = selectedDate.toLocaleDateString("en-CA"); // avoids UTC shift

      this.fromdatess = fromDateEpoch;

      // Dashboard call
      this.GetOrgDashboardDetailsmethod(
        selectedDate.getTime(),
        this.StoreObj.organization_id,
      );

      // Reports call
      setTimeout(() => {
        this.GetOrgReportsMethods(
          this.fromdatess, // 1 month before in epoch
          toDateEpoch, // selected day end in epoch
          this.$store.getters.get_current_user_details.user_id,
          this.StoreObj.organization_id,
        );
      }, 1000);
    },
    GetRouterMethod(item) {
      if (item.type === "USER_ATTENDANCE") {
        this.tab = 7;
      } else if (item.type === "VISIT_POV") {
        this.tab = 3;
      } else if (item.type === "POV_DETAIL") {
        this.tab = 1;
      }
    },
    convertDate(date) {
      return moment(date).format("MM-DD-YYYY");
    },
    getFilteredValues() {
      var toDatetimestamp = dayEndMs(this.ToDateValue);
      var fromDatetimestamp = dayStartMs(this.FromDateValue);
      // this.visitList = [];
      this.getOrgbyVisits(
        fromDatetimestamp,
        toDatetimestamp,
        this.pov_List,
        this.next_token,
      );
    },
    backMethod(Toggle) {
      this.$emit("clicked", Toggle);
    },
    handleRowClick(event, item) {
      this.userObj = item.item;
      console.log("userObj", this.userObj);
      this.userDialog = true;
    },
    VisithandleRowClick(event, item) {
      this.visitObj = item.item;
      console.log("viist", this.visitObj);
      this.VisitDialog = true;
    },
    CreateEditSpecEmit(Toggle) {
      this.userDialog = false;
      if (Toggle == 2) {
        this.getOrgbyUser(this.user_status, this.user_type);
      }
    },
    VisitEmit(Toggle) {
      if (Toggle == 1 || Toggle == 2) {
        this.VisitDialog = false;
        // this.getOrgbyVisits()
      }
    },
    async checkPaginationVisit() {
      if (this.next_token && this.pageVisit > this.storePageCountVisit) {
        console.log(this.next_token, this.pageVisit);
        this.FromDate = new Date(
          Math.floor(new Date().getTime() / 1000 - 2629743) * 1000,
        )
          .toISOString()
          .substr(0, 10);
        console.log("from", this.FromDate);
        this.height = window.innerHeight - 190;
        var toDatetimestamp = dayEndMs(this.ToDateValue);
        console.log("tostamp", toDatetimestamp);
        var fromDatetimestamp = dayStartMs(this.FromDateValue);
        console.log("from", fromDatetimestamp);
        await this.getOrgbyVisits(
          fromDatetimestamp,
          toDatetimestamp,
          this.pov_List,
          this.next_token,
        );
      }
    },
    async checkPagination() {
      if (this.next_token && this.page > this.storePageCount) {
        console.log(this.next_token, this.page);
        await this.getOrgbyPOV(
          this.pov_type,
          this.status,
          this.next_token,
          null,
          null,
        );
      }
    },
    async getDashboardBarchart() {
      try {
        this.overlay = true;
        this.List = [];
        this.datacollectionBar.datasets[0].data = [];
        this.datacollectionBar.labels = [];

        let result = await client.graphql({
          query: ListOrganizationsDailyReport,
          variables: {
            input: {
              organization_id: this.StoreObj.organization_id,
            },
          },
        });
        this.List = JSON.parse(
          result.data.ListOrganizationsDailyReport,
        ).data.items;
        var visits = [];
        var visit_dates = [];
        var totlColorVisit = [];
        for (let i = 0; i < this.List.length; i++) {
          visits.push(this.List[i].total_visits);
          visit_dates.push(this.List[i].current_day);
          totlColorVisit.push("#4DB6AC");
        }
        this.datacollectionBar.labels = visit_dates;
        this.datacollectionBar.datasets[0].data = visits;
        this.datacollectionBar.datasets[0].borderColor = totlColorVisit;
        this.datacollectionBar.datasets[0].backgroundColor = totlColorVisit;
        this.count = 1;
        this.$forceUpdate();
        this.overlay = false;
      } catch (error) {
        console.log("sdnfkjs", error);
        if (error.data == null) {
          this.List = [];
          this.datacollectionBar.datasets[0].data = [];
          this.datacollectionBar.labels = [];
        }
        this.$forceUpdate();
        this.NoData = "No Users Found";
        this.overlay = false;
        this.isLoading = false;
      }
    },
    async getOrgbyPOV(pov_type, status, next_token, type) {
      if (type == "SWITCH") {
        this.povList = [];
        next_token = null;
      }
      try {
        this.overlay = true;

        let result = await client.graphql({
          query: ListOrganizationPOVs,
          variables: {
            input: {
              organization_id: this.StoreObj.organization_id,
              pov_status: status,
              pov_type: pov_type,
              next_token:
                next_token != undefined ||
                next_token != null ||
                next_token != ""
                  ? next_token
                  : null,
              limit: 101,
            },
          },
        });
        console.log("result", result);
        var StoreArray = JSON.parse(result.data.ListOrganizationPOVs);
        console.log("StoreArray here", StoreArray);
        if (
          StoreArray.next_token != undefined &&
          StoreArray.next_token != null
        ) {
          this.next_token = StoreArray.next_token;
        } else {
          this.next_token = null;
        }
        var new_array = StoreArray.data.Items;
        // this.povList = [];

        for (let i = 0; i < new_array.length; i++) {
          // console.log(this.povList.push(new_array[i]), "jjjjjjjjjjjjjjjjj");
          this.povList.push(new_array[i]);
        }
        console.log("new_array", new_array);
        this.$forceUpdate();
        this.overlay = false;
      } catch (error) {
        console.log("erroe pov", error);
        this.overlay = false;
        this.NoData = errorMessage(error);
      }
    },
    async getOrgbyUser(user_status, user_type) {
      try {
        this.overlay = true;
        this.userList = [];

        let result = await client.graphql({
          query: ListOrganizationUsers,
          variables: {
            input: {
              organization_id: this.StoreObj.organization_id,
              user_status: user_status,
              user_type: user_type == "ALL" ? undefined : user_type,
            },
          },
        });
        console.log("result", result);
        var StoreArray = JSON.parse(result.data.ListOrganizationUsers);
        this.userList = StoreArray.data.Items;
        console.log("userrrsss", this.userList);
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = errorMessage(error);
      }
    },
    async getOrgbyVisits(from_date, to_date, pov_type, next_token) {
      if (next_token == undefined) {
        console.log("nennnn");
        this.visitList = [];
      }
      try {
        this.overlay = true;
        // this.visitList = [];

        let result = await client.graphql({
          query: ListVisitLogByTime,
          variables: {
            input: {
              organization_id: this.StoreObj.organization_id,
              from_date: from_date,
              to_date: to_date,
              pov_type: pov_type,
              next_token: next_token ? next_token : undefined,
              limit: 101,
            },
          },
        });
        console.log("result visit", result);
        var StoreArrayVisit = JSON.parse(result.data.ListVisitLogByTime);
        console.log("visitreort", StoreArrayVisit);

        if (
          StoreArrayVisit.next_token != undefined &&
          StoreArrayVisit.next_token != null
        ) {
          this.next_token = StoreArrayVisit.next_token;
        } else {
          this.next_token = null;
        }

        console.log("nextttt", this.next_token);
        var arrayList = StoreArrayVisit.data.Items;
        console.log("arrry", arrayList);
        for (let i = 0; i < arrayList.length; i++) {
          this.visitList.push(arrayList[i]);
        }
        //  this.visitpageCount = this.visitList.length;
        // console.log("pagess",this.visitpageCount);
        console.log("arraylenghth", arrayList.length);
        this.$forceUpdate();
        this.visitList.forEach(function (OrgIndex, Idx) {
          OrgIndex.num = Idx + 1;
        });
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = errorMessage(error);
      }
    },
    async getOrgbyProduct() {
      try {
        this.overlay = true;
        this.productList = [];

        let result = await client.graphql({
          query: ListOrganizationProducts,
          variables: {
            input: {
              organization_id: this.StoreObj.organization_id,
              catalog_status: this.product_status_value,
            },
          },
        });
        console.log("result", result);
        var StoreArray = JSON.parse(result.data.ListOrganizationProducts);
        this.productList = StoreArray.data.Items;
        console.log("productList", this.productList);
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = errorMessage(error);
      }
    },
    async getOrgbyTerritory() {
      try {
        this.overlay = true;
        this.territoryList = [];

        let result = await client.graphql({
          query: ListOrganizationTerritories,
          variables: {
            input: {
              organization_id: this.StoreObj.organization_id,
              territory_status: this.territory_status_value,
            },
          },
        });
        console.log("result", result);
        var StoreArray = JSON.parse(result.data.ListOrganizationTerritories);
        this.territoryList = StoreArray.data.Items;
        console.log("territoryList", this.territoryList);
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = errorMessage(error);
      }
    },
    async getOrgbyAuditLogs() {
      try {
        var fromDatetimestamp = new Date(
          new Date(this.FromDateValue).setHours(0, 0, 1, 0),
        ).getTime();
        var toDatetimestamp = new Date(
          new Date(this.ToDateValue).setHours(23, 59, 59, 999),
        ).getTime();
        this.overlay = true;
        this.auditList = [];

        let result = await client.graphql({
          query: ListOrganizationsAuditLogs,
          variables: {
            input: {
              organization_id: this.StoreObj.organization_id,
              log_type: this.log_type,
              from_date: fromDatetimestamp,
              to_date: toDatetimestamp,
            },
          },
        });
        console.log("result", result);
        var StoreArray = result.data.ListOrganizationsAuditLogs;
        this.auditList = StoreArray.data.items;
        console.log("auditList", this.auditList);
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = errorMessage(error);
      }
    },
    DownloadMyExcel(Header, ArrayList, FileName) {
      let excelHeader = Header.map((header) => ({
        label: header.title || header.text,
        value: header.key || header.value,
      }));
      excelHeader.splice(0, 1);
      if (FileName == "Visits") {
        ArrayList = ArrayList.map((item) => {
          let object = { ...item };
          object.pov_visited_on = new Date(item.pov_visited_on)
            .toLocaleString()
            .replaceAll("/", "-");
          object.d_o_j = this.convertDate(item.d_o_j * 1000);

          return object;
        });
      }
      this.DownloadExcelMethod(excelHeader, ArrayList, FileName);
    },
  },
};
</script>.org-chart-empty {
  text-align: center;
  padding: 48px 16px;
  color: var(--pw-muted);
}
.org-chart-empty__title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 4px;
}

