<template>
  <v-card class="elevation-0">
    <Overlay :overlay="overlay" />
    <CreateDeviceDialog
      :StoreObj="StoreObj"
      :deviceDialog="deviceDialog"
      :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
      @clicked="CreateEditSpecEmit"
    />
    <WarningDialog
      :DialogWarning="DialogWarning"
      :StoreObj="StoreObj"
      @clicked="WarningEmit"
    />
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="6" xs="12" class="mt-4">
        <v-toolbar density="compact" class="elevation-0" color="white">
          <!-- <v-select
            density="compact"
            variant="outlined"
            label="Status"
            class="mt-4 mr-2"
            style="font-size: 12px; max-width: 160px"
            v-model="status"
            :items="StatusItems"
          ></v-select> -->
          <v-select
            density="compact"
            variant="outlined"
            label="Device Status"
            class="mt-6 mr-2"
            style="font-size: 12px; max-width: 160px"
            v-model="device_status"
            :items="DeviceStatusItems"
          ></v-select>

          <v-text-field
            density="compact"
            variant="outlined"
            label="Search"
            class="mt-6 MaxWidth"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
          <v-tooltip color="primary" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                @click="downloadMethod()"
                class="ml-2"
                medium
                color="primary"
                variant="elevated"
                dark
                v-bind="props"
              >
                Esper Link
              </v-btn>
            </template>
            <span>Visit Esper Website</span>
          </v-tooltip>
          <v-btn
            class="ml-4"
            color="primary"
            variant="elevated"
            @click="deviceDialog = true"
            v-on:click="StoreObj.Action = 'CREATE'"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-toolbar>
      </v-col>
      <v-col cols="12" sm="12" md="12" xs="12">
        <v-data-table
          density="compact"
          :search="search"
          :headers="headers"
          :items="filterarray"
          :page.sync="page"
          :footer-props="{
            'items-per-page-options': [10, 20, 30, 40, 50],
          }"
          @click:row="handleRowClick"
          :items-per-page="50"
          hide-default-footer
          class="elevation-0 TableClass"
          :no-data-text="NoData"
          @page-count="pageCount = $event"
        >
          <template v-slot:[`item.device_status`]="{ item }">
            <span
              class="FontSize text-teal"
              v-if="item.device_status == 'DISPATCH'"
              >{{ item.device_status }}</span
            >
            <span
              class="FontSize text-blue"
              v-if="item.device_status == 'ONBOARDING'"
              >{{ item.device_status }}</span
            >
            <span
              class="FontSize text-yellow"
              v-if="item.device_status == 'PENDING'"
              >{{ item.device_status }}</span
            >
          </template>

          <template v-slot:[`item.esper_device_id`]="{ item }">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <span class="FontSize" v-bind="props">{{
                  item.esper_device_id.length > 8
                    ? `${item.esper_device_id.slice(0, 8)}...`
                    : item.esper_device_id
                }}</span>
              </template>
              <span v-text="item.esper_device_id"></span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.device_holder_name`]="{ item }">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <span class="FontSize" v-bind="props">{{
                  item.device_holder_name.length > 8
                    ? `${item.device_holder_name.slice(0, 8)}...`
                    : item.device_holder_name
                }}</span>
              </template>
              <span v-text="item.device_holder_name"></span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.employee_id`]="{ item }">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <span class="FontSize" v-bind="props">{{
                  item.employee_id.length > 8
                    ? `${item.employee_id.slice(0, 8)}...`
                    : item.employee_id
                }}</span>
              </template>
              <span v-text="item.employee_id"></span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.device_model`]="{ item }">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <span class="FontSize" v-bind="props">{{
                  item.device_model.length > 8
                    ? `${item.device_model.slice(0, 8)}...`
                    : item.device_model
                }}</span>
              </template>
              <span v-text="item.device_model"></span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.imei_number`]="{ item }">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <span class="FontSize" v-bind="props">{{
                  item.imei_number.length > 8
                    ? `${item.imei_number.slice(0, 8)}...`
                    : item.imei_number
                }}</span>
              </template>
              <span v-text="item.imei_number"></span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.sim_card_number`]="{ item }">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <span class="FontSize" v-bind="props">{{
                  item.sim_card_number.length > 8
                    ? `${item.sim_card_number.slice(0, 8)}...`
                    : item.sim_card_number
                }}</span>
              </template>
              <span v-text="item.sim_card_number"></span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip color="primary" activator="parent" location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  small
                  color="primary"
                  @click.stop="CheckEachItem(item, 'EDIT')"
                  >mdi-pencil-plus</v-icon
                ></template
              >
              <span>Update Device Info</span>
            </v-tooltip>
          </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import WarningDialog from "@/components/Dialogs/WarningDialog.vue";
import CreateDeviceDialog from "@/components/Dialogs/CreateDeviceDialog.vue";
import Overlay from "@/components/Overlay.vue";
import { getConfig } from "@/config";

import { ListDevices } from "@/graphql/queries.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  components: {
    Overlay,
    WarningDialog,
    CreateDeviceDialog,
  },
  props: {
    GetCurrentUserDetailsObj: Object,
  },
  data: () => ({
    page: 1,
    NoData: "",
    StoreObj: {},
    pageCount: 0,
    search: null,
    overlay: false,
    status: "ACTIVE",
    filterarray: [],
    DialogWarning: false,
    deviceDialog: false,
    DeviceList: [],
    StatusItems: ["ACTIVE", "INACTIVE"],
    device_status: "ALL",
    DeviceStatusItems: ["PENDING", "ONBOARDING", "DISPATCH", "ALL"],
    headers: [
      { text: "Device Id", value: "esper_device_id" },
      { text: "User Name", value: "user_name" },
      { text: "Emp-Id", value: "employee_id" },
      { text: "Device Model", value: "device_model" },
      { text: "On-Boarded On", value: "on_boarded_on" },
      { text: "IMEI No", value: "imei_number" },
      { text: "Sim Card No", value: "sim_card_number" },
      { text: "Device Status", value: "device_status" },
      { text: "Actions", value: "Actions" },
    ],
  }),
  watch: {
    device_status() {
      this.filterarray = [];
      this.filterarray = this.DeviceList.filter(
        (org) => org.device_status == this.device_status,
      );
      if (this.device_status == "ALL") {
        this.getDeviceLists();
      }
      if (this.filterarray.length == 0) {
        this.NoData = "No Organization Found";
      }
    },
  },
  mounted() {
    this.getDeviceLists();
    console.log("abcdstore", this.GetCurrentUserDetailsObj);
  },
  methods: {
    downloadMethod() {
      var url = getConfig().esperConsoleUrl || "https://zrlzw.esper.cloud";
      window.open(url, "Open");
    },
    WarningEmit(Toggle) {
      this.StoreObj = {};
      this.DialogWarning = false;
      if (Toggle == 2) {
        this.getDeviceLists();
      }
    },
    CreateEditSpecEmit(Toggle) {
      this.StoreObj = {};
      this.deviceDialog = false;
      if (Toggle == 2) {
        this.getDeviceLists();
      }
    },
    CheckEachItem(item, Action) {
      this.StoreObj = item;
      this.StoreObj.Action = Action;
      if (Action == "EDIT") {
        this.deviceDialog = true;
      }
    },
    handleRowClick(event, item) {
      // console.warn(item);
      this.StoreObj = item.item;
      this.StoreObj.Action = "VIEW";
      this.deviceDialog = true;
    },
    async getDeviceLists() {
      try {
        this.overlay = true;
        this.DeviceList = [];

        let result = await client.graphql({
          query: ListDevices,
          variables: {
            input: {},
          },
        });
        const res = JSON.parse(result.data.ListDevices);
        // { status, data: { Items, Count } }; no devices → status "ERROR"
        this.DeviceList = (res && res.data && res.data.Items) || [];
        if (!this.DeviceList.length && res && res.message) {
          this.NoData = res.message;
        }
        this.filterarray = this.DeviceList;

        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData =
          (error && error.errors && error.errors[0] && error.errors[0].message) ||
          "Could not load devices";
      }
    },
  },
};
</script>
