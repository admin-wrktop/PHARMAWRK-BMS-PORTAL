<template>
  <div>
    <v-card v-if="current_view == 'LIST'" class="elevation-0">
      <SnackBar :SnackBarComponent="SnackbarComponent" />
      <Overlay :overlay="overlay" />

      <CreateEditOrganization
        :StoreObj="StoreObj"
        :create_edit_org_dialog="create_edit_org_dialog"
        @clicked="CreateEditOrgEmit"
      />
      <WarningDialog
        :DialogWarning="DialogWarning"
        :StoreObj="StoreObj"
        @clicked="WarningEmit"
      />
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-toolbar density="compact" color="white" class="elevation-0">
            <!-- <v-spacer/> -->
            <v-select
              density="compact"
              variant="outlined"
              label="Status"
              class="mt-6 mr-2"
              style="font-size: 12px; max-width: 160px"
              v-model="organization_status"
              :items="StatusItems"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            ></v-select>
            <v-text-field
              density="compact"
              variant="outlined"
              label="Search"
              class="mt-6"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  class="mb-1 ml-4"
                  color="primary"
                  variant="elevated"
                  size="small"
                  v-bind="props"
                  @click="create_edit_org_dialog = true"
                  v-on:click="StoreObj.Action = 'CREATE'"
                  ><v-icon>mdi-plus</v-icon></v-btn
                ></template
              >
              <span>Create Organization</span>
            </v-tooltip>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="12" xs="12" class="mt-2">
          <v-data-table
            density="compact"
            :search="search"
            :headers="headers"
            :items="filterarray"
            :page.sync="page"
            :footer-props="{
              'items-per-page-options': [10, 20, 30, 40, 50],
            }"
            :items-per-page="50"
            hide-default-footer
            class="elevation-0 TableClass"
            :no-data-text="NoData"
            @page-count="pageCount = $event"
            :row-props="row_classes"
            fixed-header
            height="560px"
          >
            <!-- <template v-slot:top>
              <v-switch
                v-model="singleSelect"
                label="Single select"
                class="mb-n3"
              ></v-switch>

 show-select
            :single-select="singleSelect"
            v-model="selected"
            item-key="organization_name"

            </template> -->

            <template v-slot:[`item.drug_mapping`]="{ item }">
              <span v-if="item.drug_mapping">{{ item.drug_mapping }}</span>
              <span v-else>-</span>
            </template>

            <template v-slot:[`item.organization_name`]="{ item }">
              <div
                v-if="
                  item.organization_name != undefined &&
                  item.organization_name != null &&
                  item.organization_name != ''
                "
                class="FontSize"
              >
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-earth</v-icon
                >{{ item.organization_name }}
              </div>
              <div v-else class="FontSize">-</div>
            </template>

            <template v-slot:[`item.organization_contact_email_id`]="{ item }">
              <div
                v-if="
                  item.organization_contact_email_id != undefined &&
                  item.organization_contact_email_id != null &&
                  item.organization_contact_email_id != ''
                "
                class="FontSize"
              >
                {{ item.organization_contact_email_id }}
              </div>
              <div v-else class="FontSize">-</div>
            </template>

            <template v-slot:[`item.organization_created_on`]="{ item }">
              <div
                v-if="
                  item.organization_created_on != undefined &&
                  item.organization_created_on != null &&
                  item.organization_created_on != ''
                "
                class="FontSize"
              >
                {{
                  new Date(item.organization_created_on)
                    .toLocaleString()
                    .split(",")[0] +
                  "," +
                  " " +
                  new Date(item.organization_created_on)
                    .toLocaleString()
                    .split(",")[1]
                }}
              </div>
              <div v-else class="FontSize">-</div>
            </template>
            <template v-slot:[`item.Actions`]="{ item }">
              <!-- <v-icon
                v-if="item.organization_status == 'ACTIVE'"
                size="small"
                color="green"
                class="mr-2"
                @click.stop="CheckEachItem(item, 'EDIT')"
                >mdi-pencil</v-icon
              >
              <v-icon
                v-if="item.organization_status == 'INACTIVE'"
                size="small"
                color="green"
                @click.stop="CheckEachItem(item, 'ACTIVATE')"
                >mdi-check</v-icon
              >
              <v-icon
                v-if="item.organization_status == 'ACTIVE'"
                size="small"
                color="red"
                @click.stop="CheckEachItem(item, 'DEACTIVATE')"
                >mdi-close</v-icon
              > -->
              <v-menu right bottom>
                <template v-slot:activator="{ props }">
                  <v-icon color="primary" size="large" v-bind="props"
                    >mdi-dots-vertical</v-icon
                  >
                </template>

                <v-list density="compact" nav>
                  <v-list-item
                    v-if="item.organization_status == 'ACTIVE'"
                    @click="CheckEachItem(item, 'EDIT')"
                  >
                    <v-icon size="small" color="green">mdi-pencil</v-icon>
                    <span class="ml-2">Edit Organisation</span>
                  </v-list-item>
                  <v-list-item
                    v-if="item.organization_status == 'INACTIVE'"
                    @click="CheckEachItem(item, 'ACTIVATE')"
                  >
                    <v-icon size="small" color="green">mdi-check</v-icon>
                    <span class="ml-2">Activate</span>
                  </v-list-item>
                  <v-list-item
                    v-if="item.organization_status == 'ACTIVE'"
                    @click="CheckEachItem(item, 'DEACTIVATE')"
                  >
                    <v-icon size="small" color="red">mdi-close</v-icon>
                    <span class="ml-2">Deactivate</span>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <template v-slot:[`item.veiw_details`]="{ item }">
              <v-icon
                size="18"
                class="ml-6"
                color="green"
                @click.stop="handleRowClick(item)"
                >mdi-eye</v-icon
              >
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <AuditTrailOrg
      v-if="current_view == 'AUDIT'"
      @clicked="backMethod"
      :StoreObj="StoreObj"
      :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
    />
  </div>
</template>
<script>
import WarningDialog from "@/components/Dialogs/WarningDialog.vue";
import CreateEditOrganization from "@/components/Dialogs/CreateEditOrganization.vue";
import SnackBar from "@/components/SnackBar.vue";
import Overlay from "@/components/Overlay.vue";

import { ListOrganizations } from "@/graphql/queries.js";
import AuditTrailOrg from "@/components/Cards/AuditTrailOrg.vue";

import { generateClient } from "aws-amplify/api";
const client = generateClient();

export default {
  components: {
    Overlay,
    SnackBar,
    WarningDialog,
    CreateEditOrganization,
    AuditTrailOrg,
  },
  props: {
    GetCurrentUserDetailsObj: Object,
  },
  data: () => ({
    // singleSelect: false,
    selected: [],
    current_view: "LIST",
    page: 1,
    NoData: "No Organization Found",

    StoreObj: {},
    SnackbarComponent: {},
    pageCount: 0,
    search: null,
    overlay: false,
    organization_status: "ACTIVE",
    filterarray: [],
    DialogWarning: false,
    create_edit_org_dialog: false,
    OrganizationList: [],
    StatusItems: ["ACTIVE", "INACTIVE"],
    headers: [
      { title: "Name", key: "organization_name" },
      { title: "Contact Email", key: "organization_contact_email_id" },
      { title: "Product Mapped to", key: "drug_mapping" },
      { title: "Manufacturer Type", key: "manufacturer_type" },
      { title: "Created On", key: "organization_created_on" },
      { title: "Organisation Details", key: "veiw_details" },
      { title: "Actions", key: "Actions" },
    ],
  }),
  watch: {
    organization_status() {
      this.filterarray = [];
      this.filterarray = this.OrganizationList.filter(
        (org) => org.organization_status == this.organization_status,
      );
      if (this.filterarray.length == 0) {
        this.NoData = "No Organization Found";
      }
    },
  },
  mounted() {
    this.getOrganizationLists();
    // console.log("abcdstore", this.GetCurrentUserDetailsObj);
  },
  methods: {
    row_classes({ item }) {
      if (item.is_actual_client == true) {
        return { style: "background-color: #d3ede4" };
      }
    },

    WarningEmit(Toggle) {
      this.StoreObj = {};
      this.DialogWarning = false;
      if (Toggle == 2) {
        this.getOrganizationLists();
      }
    },
    CreateEditOrgEmit(Toggle) {
      this.create_edit_org_dialog = false;
      this.StoreObj = {};
      if (Toggle == 2) {
        this.getOrganizationLists();
      }
    },
    backMethod() {
      this.current_view = "LIST";
    },
    CheckEachItem(item, Action) {
      this.StoreObj = item;
      //   console.log("storeeeee", this.StoreObj);
      this.StoreObj.Action = Action;
      if (Action == "EDIT") {
        this.create_edit_org_dialog = true;
      }
      if (Action == "ACTIVATE" || Action == "DEACTIVATE") {
        this.DialogWarning = true;
      }
    },
    handleRowClick(item) {
      this.StoreObj = item;
      this.StoreObj.Action = "VIEW";
      // this.create_edit_org_dialog = true;
      this.current_view = "AUDIT";
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
        // console.log("result", result);
        var StoreArray = JSON.parse(result.data.ListOrganizations);
        // console.log("organization", StoreArray);
        this.OrganizationList = StoreArray.data.Items;

        this.filterarray = [];
        this.filterarray = this.OrganizationList.filter(
          (org) => org.organization_status == this.organization_status,
        );

        console.log("dfgdfg", this.filterarray);
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
