<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      :model-value="deviceDialog"
      max-width="400px"
      transition="dialog-top-transition"
      persistent
    >
      <v-card>
        <v-toolbar class="elevation-0" dark density="compact" color="primary">
          <v-icon size="small" class="mr-2 ml-2">{{
            StoreObj.Action == "CREATE"
              ? "mdi-plus"
              : StoreObj.Action == "VIEW"
              ? "mdi-clipboard-edit"
              : "mdi-pencil"
          }}</v-icon
          ><span
            v-text="
              StoreObj.Action == 'CREATE'
                ? 'Add Device Info'
                : StoreObj.Action == 'VIEW'
                ? 'Device Info Details'
                : 'Update Device Info'
            "
          ></span>
          <v-spacer />
          <v-btn icon @click="CreateEditSpecEmit((Toggle = 1))">
            <v-icon size="small">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4 pb-0">
          <v-form ref="form">
            <v-select
              variant="outlined"
              density="compact"
              label="Organization"
              class="FontSize"
              :readonly="StoreObj.Action == 'VIEW'"
              v-model="create_edit_div.organization"
              :menu-props="{ contentClass: 'SelectFontSize' }"
              :items="filterarray"
              item-title="organization_name"
              item-value="organization_name"
              return-object
            ></v-select>
            <v-select
              v-if="create_edit_div.organization"
              variant="outlined"
              density="compact"
              label="User Name"
              class="FontSize"
              :readonly="StoreObj.Action == 'VIEW'"
              v-model="create_edit_div.user_name"
              :items="userList_filter"
              item-title="user_name"
              item-value="user_id"
              :menu-props="{ contentClass: 'SelectFontSize' }"
              return-object
            ></v-select>
            <v-text-field
              variant="outlined"
              density="compact"
              label="Device-Id"
              class="FontSize"
              :readonly="StoreObj.Action == 'VIEW'"
              v-model="create_edit_div.device_id"
            ></v-text-field>

            <v-text-field
              variant="outlined"
              density="compact"
              label="Employee-Id"
              class="FontSize"
              :readonly="StoreObj.Action == 'VIEW'"
              v-model="create_edit_div.employee_id"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              density="compact"
              label="Device Model *"
              class="FontSize"
              :readonly="StoreObj.Action == 'VIEW' || StoreObj.Action == 'EDIT'"
              v-model="create_edit_div.device_model"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>
            <v-menu
              v-model="menuFromDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  class="FontSize field_label_size field_height mr-2"
                  density="compact"
                  variant="outlined"
                  v-model="date"
                  label="On Boarded On *"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="props"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                @input="menuFromDate = false"
              ></v-date-picker>
            </v-menu>
            <v-text-field
              variant="outlined"
              density="compact"
              label="IMEI Number *"
              class="FontSize"
              :readonly="StoreObj.Action == 'VIEW' || StoreObj.Action == 'EDIT'"
              v-model="create_edit_div.imei_number"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              density="compact"
              label="Sim Card Number *"
              class="FontSize"
              :readonly="StoreObj.Action == 'VIEW'"
              v-model="create_edit_div.sim_card_number"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>
            <v-select
              variant="outlined"
              density="compact"
              label="Device Status *"
              :items="status"
              v-model="create_edit_div.device_status"
              class="FontSize"
              :readonly="StoreObj.Action == 'VIEW'"
              :rules="[(v) => !!v || 'Required']"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            >
            </v-select>
          </v-form>
        </v-card-text>
        <v-card-actions v-if="StoreObj.Action != 'VIEW'" class="pt-0">
          <v-spacer />
          <v-btn
            size="small"
            text
            color="primary"
            @click="CreateEditSpecEmit((Toggle = 1))"
            >Cancel</v-btn
          >
          <v-btn
            :loading="loading"
            size="small"
            tile
            color="primary"
            variant="elevated"
            @click="ValidateForm()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { errorMessage } from "@/utils/errorMessage.js";
import { CreateDevice, UpdateDevice } from "@/graphql/mutations.js";
import { ListOrganizationUsers, ListOrganizations } from "@/graphql/queries.js";
import SnackBar from "@/components/SnackBar.vue";

import { generateClient } from "aws-amplify/api";
const client = generateClient();

export default {
  props: {
    deviceDialog: Boolean,
    StoreObj: Object,
    GetCurrentUserDetailsObj: Object,
  },
  components: {
    SnackBar,
  },
  data: () => ({
    SnackBarComponent: {},
    menuFromDate: false,
    date: new Date().toISOString().substr(0, 10),
    create_edit_div: {
      device_id: "",
      user_name: "",
      device_model: "",
      imei_number: "",
      sim_card_number: "",
      device_status: "",
      employee_id: "",
      organization: "",
    },
    status: ["PENDING", "ONBOARDING", "DISPATCHED"],
    loading: false,
    OrganizationList: [],
    filterarray: [],
    user_List: [],
    userList_filter: [],
    org_id: {},
  }),
  mounted() {},
  watch: {
    deviceDialog(val) {
      if (val == true) {
        this.getOrganizationLists();
        if (this.StoreObj.Action == "EDIT") {
          console.log("sttrrrr", this.StoreObj);
          (this.date = this.StoreObj.on_boarded_on),
            (this.create_edit_div = {
              device_id: this.StoreObj.esper_device_id,
              imei_number: this.StoreObj.imei_number,
              sim_card_number: this.StoreObj.sim_card_number,
              employee_id: this.StoreObj.employee_id,
              user_name: this.StoreObj.user_id,
              device_model: this.StoreObj.device_model,
              organization: this.StoreObj.organization_name,
              device_status: this.StoreObj.device_status,
            });
          this.create_edit_div.user_name = this.StoreObj.user_id;
          console.log("user", this.create_edit_div.user_name);
        }
      }
    },
    "create_edit_div.organization"(val) {
      if (!val) return; // form reset
      // Edit mode starts with the organisation's name; look up the object.
      const org =
        typeof val === "object"
          ? val
          : (this.filterarray || []).find((o) => o.organization_name === val);
      this.org_id = org ? org.organization_id : undefined;
      if (this.org_id) this.getOrgLists(this.org_id);
    },
    "create_edit_div.user_name"(val) {
      if (!val || typeof val !== "object") return; // reset, or edit-mode id
      if (this.StoreObj.Action == "CREATE") {
        this.emp_id = val.user_employee_id;
        this.create_edit_div.employee_id = this.emp_id;
        this.create_edit_div.sim_card_number = val.user_contact_number;
      }
      // if(this.StoreObj.Action == "EDIT"){
      //   this.create_edit_div.user_name = this.StoreObj.user_name;
      //   console.log("kjulklkl",this.create_edit_div.user_name);
      // }
    },
  },
  methods: {
    async ValidateForm() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        if (this.StoreObj.Action == "CREATE") {
          this.createDevice();
        } else if (this.StoreObj.Action == "EDIT") {
          this.EditDevice();
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Invalid inputs",
          Top: true,
          timeout: 2000,
        };
      }
    },
    async createDevice() {
      try {
        this.loading = true;
        var inputparams = {
          device_model: this.create_edit_div.device_model,
          on_boarded_on: this.date,
          imei_number: this.create_edit_div.imei_number,
          sim_card_number: this.create_edit_div.sim_card_number,
          device_status: this.create_edit_div.device_status,
        };
        if (
          this.create_edit_div.user_name != null &&
          this.create_edit_div.user_name != "" &&
          this.create_edit_div.user_name != undefined
        ) {
          inputparams.target_user_id = this.create_edit_div.user_name.user_id;
        }
        if (
          this.create_edit_div.organization != null &&
          this.create_edit_div.organization != "" &&
          this.create_edit_div.organization != undefined
        ) {
          inputparams.organization_name =
            this.create_edit_div.organization.organization_name;
          inputparams.organization_id =
            this.create_edit_div.organization.organization_id;
        }
        if (
          this.create_edit_div.employee_id != null &&
          this.create_edit_div.employee_id != "" &&
          this.create_edit_div.employee_id != undefined
        ) {
          inputparams.employee_id = this.create_edit_div.employee_id;
        }
        if (
          this.create_edit_div.user_name != null &&
          this.create_edit_div.user_name != "" &&
          this.create_edit_div.user_name != undefined
        ) {
          inputparams.user_name = this.create_edit_div.user_name.user_name;
        }
        if (
          this.create_edit_div.device_id != null &&
          this.create_edit_div.device_id != "" &&
          this.create_edit_div.device_id != undefined
        ) {
          inputparams.esper_device_id = this.create_edit_div.device_id;
        }

        let result = await client.graphql({
          query: CreateDevice,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.CreateDevice);
        console.log("devicelist", ResultObject);
        if (String(ResultObject.status).toUpperCase() == "SUCCESS") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.CreateEditSpecEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.log("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: errorMessage(error),
          Top: true,
          timeout: 2000,
        };
        this.CreateEditSpecEmit((this.Toggle = 2));
      }
    },
    async EditDevice() {
      try {
        this.loading = true;
        var inputparams = {
          device_id: this.StoreObj.device_id,
          on_boarded_on: this.date,
          sim_card_number: this.create_edit_div.sim_card_number,
          device_status: this.create_edit_div.device_status,
        };
        if (
          this.create_edit_div.user_name != null &&
          this.create_edit_div.user_name != "" &&
          this.create_edit_div.user_name != undefined
        ) {
          inputparams.user_name = this.create_edit_div.user_name.user_name;
          inputparams.target_user_id = this.create_edit_div.user_name.user_id;
        }
        if (
          this.create_edit_div.organization != null &&
          this.create_edit_div.organization != "" &&
          this.create_edit_div.organization != undefined
        ) {
          inputparams.organization_name =
            this.create_edit_div.organization.organization_name;
          inputparams.organization_id =
            this.create_edit_div.organization.organization_id;
        }
        if (
          this.create_edit_div.employee_id != null &&
          this.create_edit_div.employee_id != "" &&
          this.create_edit_div.employee_id != undefined
        ) {
          inputparams.employee_id = this.create_edit_div.employee_id;
        }

        let result = await client.graphql({
          query: UpdateDevice,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.UpdateDevice);
        if (ResultObject.status == "SUCCESS") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.status_message,
            Top: true,
            timeout: 2000,
          };
          this.CreateEditSpecEmit((this.Toggle = 2));
        }
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: errorMessage(error),
          Top: true,
          timeout: 2000,
        };
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
        console.log("orgggggg", this.OrganizationList);
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
        this.NoData = errorMessage(error);
      }
    },
    async getOrgLists(org_id) {
      try {
        this.overlay = true;
        this.user_List = [];

        let result = await client.graphql({
          query: ListOrganizationUsers,
          variables: {
            input: { organization_id: org_id },
          },
        });
        var StoreArray = JSON.parse(result.data.ListOrganizationUsers);
        this.user_List = StoreArray.data.Items;
        console.log("user_List", this.user_List);
        this.userList_filter = [];
        this.userList_filter = this.user_List.filter(
          (org) => org.user_status == "ACTIVE",
        );

        if (this.userList_filter.length == 0) {
          this.NoData = "No users in this organisation";
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.userList_filter = [];
        this.NoData =
          (error && error.errors && error.errors[0] && error.errors[0].message) || "Could not load users";
      }
    },
    CreateEditSpecEmit(Toggle) {
      this.$emit("clicked", Toggle);
      this.$refs.form.reset();
    },
  },
};
</script>
