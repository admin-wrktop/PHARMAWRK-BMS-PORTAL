<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      :model-value="create_edit_org_dialog"
      max-width="700px"
      transition="dialog-top-transition"
      persistent
    >
      <v-card>
        <v-toolbar class="elevation-0" dark density="compact" color="primary">
          <v-icon size="small" class="mr-2 ml-2">{{
            StoreObj.Action == "CREATE"
              ? "mdi-plus"
              : StoreObj.Action == "VIEW"
              ? "mdi-earth"
              : "mdi-pencil"
          }}</v-icon
          ><span
            v-text="
              StoreObj.Action == 'CREATE'
                ? 'Create Organization'
                : StoreObj.Action == 'VIEW'
                ? 'Organization Details'
                : 'Update Organization'
            "
          ></span>
          <v-spacer />
          <v-btn icon @click="CreateEditOrgEmit((Toggle = 1))">
            <v-icon size="small">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4 pb-0">
          <v-form ref="form">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Name *"
              class="FontSize"
              :rules="[
                (v) => !!v || 'Required',
                (v) => (v && v.length <= 40) || 'Maximum 40 characters',
              ]"
              :readonly="StoreObj.Action == 'VIEW'"
              v-model="create_edit_org.organization_name"
            ></v-text-field>
            <!-- (v) =>
                  /^(?=[a-zA-Z 0-9@._%+-]{0,100}$)[ a-z A-Z0-9 ]{0,100}$/.test(
                    v
                  ) || 'Invalid', -->
            <v-text-field
              variant="outlined"
              density="compact"
              label="Email ID *"
              class="FontSize"
              v-model="create_edit_org.organization_contact_email_id"
              :rules="[
                (v) => !!v || 'Required',
                (v) =>
                  /^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(v) ||
                  'Email must be valid',
              ]"
              :readonly="StoreObj.Action == 'VIEW' || StoreObj.Action == 'EDIT'"
            ></v-text-field>
            <v-select
              class="FontSize"
              :items="DrugMappingList"
              v-model="create_edit_org.DrugMap"
              :rules="[(v) => !!v || 'Required']"
              label="Select Product Map *"
              density="compact"
              variant="outlined"
              item-title="text"
              item-value="value"
              :readonly="StoreObj.Action == 'VIEW' || StoreObj.Action == 'EDIT'"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            >
            </v-select>
            <v-select
              class="FontSize"
              :items="ManufacturerList"
              v-model="create_edit_org.Manufacturer"
              :rules="[(v) => !!v || 'Required']"
              label="Select Manufacturer Type *"
              density="compact"
              variant="outlined"
              item-title="text"
              item-value="value"
              :readonly="StoreObj.Action == 'VIEW'"
              :menu-props="{ contentClass: 'SelectFontSize' }"
            >
            </v-select>

            <v-autocomplete
              v-model="selectedCountry"
              :items="countries"
              item-title="name"
              item-value="name"
              label="Select a Country"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || '']"
              @update:model-value="fetchTimezones()"
              return-object
            ></v-autocomplete>

            <v-autocomplete
              v-model="selectedTimezone"
              :items="filteredTimezones"
              item-title="tz"
              item-value="tz"
              label="Select a Timezone"
              density="compact"
              variant="outlined"
              :rules="[(v) => !!v || '']"
            ></v-autocomplete>

            <v-row>
              <v-col cols="12" md="4" xs="6" sm="6">
                <v-checkbox
                  v-model="create_edit_org.checkbox"
                  color="primary"
                  label="Enable Web hook"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" md="4" xs="6" sm="6">
                <v-checkbox
                  v-model="create_edit_org.enable_device_login_management"
                  color="primary"
                  label="Enable/Disable Device Login management"
                ></v-checkbox>
              </v-col>
              <v-col
                cols="12"
                md="4"
                xs="6"
                sm="6"
                v-if="StoreObj.Action == 'EDIT'"
              >
                <v-checkbox
                  v-model="create_edit_org.mcl_bulk_upload"
                  color="primary"
                  label="Enable MCL Bulk Upload"
                ></v-checkbox>
              </v-col>
              <v-col
                cols="12"
                md="4"
                xs="6"
                sm="6"
                v-if="StoreObj.Action == 'EDIT'"
              >
                <v-checkbox
                  v-model="create_edit_org.Enable_POV_Map"
                  label="Enable POV Map-Unmap"
                  color="primary"
                ></v-checkbox>
              </v-col>

              <v-col
                cols="12"
                md="4"
                xs="6"
                sm="6"
                class="mt-n9"
                v-if="StoreObj.Action == 'EDIT'"
              >
                <v-checkbox
                  v-model="create_edit_org.EnableGeneratePOVVisitReport"
                  color="primary"
                  label="Enable POV Visit Excel Export"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-radio-group
              v-if="StoreObj.Action == 'EDIT'"
              color="primary"
              v-model="POV_List_Type"
              inline
            >
              <div class="font-weight-bold">POVs List :</div>
              <v-radio
                label="MCL"
                value="MCL"
                class="font-weight-bold mt-n2 ml-1"
              ></v-radio>
              <v-radio
                label="TERRITORY"
                value="TERRITORY"
                class="font-weight-bold mt-n2"
              ></v-radio>
            </v-radio-group>
          </v-form>
        </v-card-text>
        <v-card-actions v-if="StoreObj.Action != 'VIEW'" class="pt-4 mb-2">
          <v-spacer />
          <v-btn
            size="small"
            text
            color="primary"
            @click="CreateEditOrgEmit((Toggle = 1))"
            >Cancel</v-btn
          >
          <v-btn
            :loading="loading"
            size="small"
            color="primary"
            variant="elevated"
            @click="ValidateForm()"
            >{{ StoreObj.Action == "CREATE" ? "Create" : "Update" }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  CreateOrganization,
  UpdateOrganizationDetails,
} from "@/graphql/mutations.js";
import SnackBar from "@/components/SnackBar.vue";
import ct from "countries-and-timezones";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    StoreObj: Object,
    create_edit_org_dialog: Boolean,
  },
  components: {
    SnackBar,
  },
  data: () => ({
    selectedCountry: null,
    selectedTimezone: null,
    countries: [],
    filteredTimezones: [],
    Toggle: 0,
    checkbox: false,
    loading: false,
    SnackBarComponent: {},
    create_edit_org: {
      organization_name: "",
      organization_contact_email_id: "",
      DrugMap: "",
      Manufacturer: "",
      checkbox: "",
      enable_device_login_management: false,
      mcl_bulk_upload: false,
      Enable_POV_Map: false,
      EnableGeneratePOVVisitReport: false,
    },
    DrugMappingList: [
      { text: "Point Of Visit", value: "POV" },
      { text: "Medical Representatives", value: "MEDREP" },
    ],
    ManufacturerList: [
      { text: "PRODUCT", value: "DRUG" },
      { text: "EQUIPMENT", value: "EQUIPMENT" },
    ],

    POV_List_Type: "TERRITORY",
  }),
  watch: {
    async create_edit_org_dialog(val) {
      if (val == true) {
        if (this.StoreObj.Action == "EDIT" || this.StoreObj.Action == "VIEW") {
          this.create_edit_org = {
            organization_name: this.StoreObj.organization_name,
            organization_contact_email_id:
              this.StoreObj.organization_contact_email_id,
            Manufacturer: this.StoreObj.manufacturer_type,
            DrugMap: this.StoreObj.drug_mapping,
            checkbox: this.StoreObj.enable_web_hook,
            enable_device_login_management:
              this.StoreObj.enable_device_login_management,
            mcl_bulk_upload: this.StoreObj.is_enable_mcl_bulk_upload,
            Enable_POV_Map: this.StoreObj.enable_pov_map_or_unmap_in_users_pov,
            EnableGeneratePOVVisitReport:
              this.StoreObj.enable_to_generate_povs_visit_reports,
          };
          this.POV_List_Type = this.StoreObj.povs_listing_type;
        }
        this.loadCountries();
        this.selectedCountry =
          this.countries.find((c) => c.name === this.StoreObj.country) || null;

        console.log("Selected Country:", this.selectedCountry);

        await this.fetchTimezones();
        this.selectedTimezone = this.StoreObj.time_zone;
      }
    },
  },
  methods: {
    loadCountries() {
      const allCountries = ct.getAllCountries();
      this.countries = Object.keys(allCountries).map((code) => ({
        name: allCountries[code].name,
        code: code,
      }));
    },
    fetchTimezones() {
      if (this.selectedCountry) {
        const countryData = ct.getCountry(this.selectedCountry.code);
        this.filteredTimezones =
          countryData && countryData.timezones
            ? countryData.timezones.map((tz) => ({ tz }))
            : [];
        this.selectedTimezone = null;
      }
    },
    async ValidateForm() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        if (this.StoreObj.Action == "CREATE") {
          this.CreateOrg();
        } else if (this.StoreObj.Action == "EDIT") {
          this.EditOrg();
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Invalid inputs",
          Top: true,
        };
      }
    },
    async EditOrg() {
      try {
        this.loading = true;
        var inputparams = {
          organization_name: this.create_edit_org.organization_name,
          organization_id: this.StoreObj.organization_id,
          manufacturer_type: this.create_edit_org.Manufacturer,
          enable_web_hook: this.create_edit_org.checkbox,
          enable_device_login_management:
            this.create_edit_org.enable_device_login_management,
          is_enable_mcl_bulk_upload: this.create_edit_org.mcl_bulk_upload,
          country: this.selectedCountry.name,
          time_zone: this.selectedTimezone,
          povs_listing_type: this.POV_List_Type,
          enable_pov_map_or_unmap_in_users_pov:
            this.create_edit_org.Enable_POV_Map,
          enable_to_generate_povs_visit_reports:
            this.create_edit_org.EnableGeneratePOVVisitReport,
        };

        let result = await client.graphql({
          query: UpdateOrganizationDetails,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.UpdateOrganizationDetails);
        if (ResultObject.status == "SUCCESS") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.CreateEditOrgEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText:
            (error && error.errors && error.errors[0] && error.errors[0].message) ||
            (error && error.message) ||
            "Something went wrong. Please try again.",
          Top: true,
        };
      }
    },
    async CreateOrg() {
      try {
        this.loading = true;
        var inputparams = {
          organization_name: this.create_edit_org.organization_name,
          organization_contact_email_id:
            this.create_edit_org.organization_contact_email_id,
          drug_mapping: this.create_edit_org.DrugMap,
          manufacturer_type: this.create_edit_org.Manufacturer,
          enable_web_hook: this.create_edit_org.checkbox,
          enable_device_login_management:
            this.create_edit_org.enable_device_login_management,
          country: this.selectedCountry.name,
          time_zone: this.selectedTimezone,
          // is_enable_mcl_bulk_upload: this.create_edit_org.mcl_bulk_upload,
        };

        let result = await client.graphql({
          query: CreateOrganization,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.CreateOrganization);
        if (ResultObject.status == "SUCCESS") {
          this.$refs.form.reset();

          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.CreateEditOrgEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText:
            (error && error.errors && error.errors[0] && error.errors[0].message) ||
            (error && error.message) ||
            "Something went wrong. Please try again.",
          Top: true,
        };
      }
    },
    CreateEditOrgEmit(Toggle) {
      this.$refs.form.reset();
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
<style scoped>
.FontSize {
  font-size: 12px;
}
</style>
