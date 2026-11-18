<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      persistent
      :model-value="create_pov_dialog"
      max-width="1100px"
      transition="dialog-top-transition"
    >
      <v-card>
        <v-toolbar dark class="elevation-0" density="compact" color="primary">
          <v-icon
            small
            class="mr-2"
            v-text="
              StoreObj.Action == 'CREATE'
                ? 'mdi-plus'
                : StoreObj.Action == 'VIEW'
                ? 'mdi-clipboard-edit'
                : 'mdi-pencil'
            "
          ></v-icon
          ><span
            v-text="
              StoreObj.Action == 'CREATE'
                ? 'Create POV'
                : StoreObj.Action == 'VIEW'
                ? 'POV Details'
                : 'Edit POV'
            "
          ></span>
          <v-spacer />
          <v-btn icon @click="CreatePOVEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-toolbar
          v-if="StoreObj.Action == 'CREATE'"
          outlined
          class="elevation-0 my-3 mx-6"
          density="compact"
        >
          <v-icon class="ml-n4">mdi-magnify</v-icon>
          <gmap-autocomplete
            placeholder="Search Location"
            style="
              width: 1050px;
              border-bottom: 1px solid grey;
              font-size: 12px;
            "
            :value="search"
            class="ml-0"
            ref="clearSearch"
            @place_changed="setPlace"
          >
          </gmap-autocomplete>
        </v-toolbar>
        <v-card-text class="mt-2 pb-0">
          <v-row no-gutters>
            <v-col cols="12" sm="12" md="6" xs="12">
              <v-card class="elevation-0" height="325px">
                <gmap-map
                  :center="center"
                  :zoom="12"
                  style="width: 100%; height: 100%"
                >
                  <gmap-marker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    @click="center = m.position"
                  ></gmap-marker>
                </gmap-map>
              </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="6" xs="12">
              <v-form ref="form">
                <v-card class="elevation-0">
                  <v-card-text>
                    <v-text-field
                      density="compact"
                      outlined
                      class="FontSize"
                      label="POV Name"
                      v-model="POV.pov_name"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                    <v-text-field
                      density="compact"
                      outlined
                      :readonly="StoreObj.Action == 'EDIT'"
                      class="FontSize py-0 my-0"
                      label="POV Address *"
                      v-model="POV.pov_address"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" md="6" xs="12">
                        <v-text-field
                          density="compact"
                          outlined
                          readonly
                          :rules="[(v) => !!v || 'Required']"
                          class="FontSize mr-1"
                          label="Latitude *"
                          v-model="POV.lat"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6" xs="12">
                        <v-text-field
                          density="compact"
                          readonly
                          outlined
                          :rules="[(v) => !!v || 'Required']"
                          class="FontSize ml-1"
                          label="Longitude *"
                          v-model="POV.lng"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" md="3" xs="12">
                        <v-select
                          density="compact"
                          outlined
                          class="FontSize mr-1"
                          label="Country Code"
                          :items="CountryCodeItems"
                          v-model="POV.pov_country_code"
                          :rules="[(v) => !!v || 'Required']"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="9" xs="12">
                        <v-text-field
                          density="compact"
                          outlined
                          class="FontSize ml-1"
                          label="Contact Number"
                          v-model="POV.pov_contact_number"
                          :rules="ContactRules"
                          @input="ValidateContactRulesMethod"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6" xs="12">
                        <!-- :md="POV.pov_type != 'HOSPITAL' ? 4 : 6" -->
                        <v-select
                          density="compact"
                          outlined
                          class="FontSize mr-2"
                          label="POV Type"
                          v-model="POV.pov_type"
                          :items="POVTypeItems"
                          :readonly="
                            StoreObj.Action == 'EDIT' ||
                            StoreObj.Action == 'EDITTABLE'
                          "
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="6" xs="12">
                        <!-- :md="POV.pov_type != 'HOSPITAL' ? 4 : 6" -->
                        <v-select
                          density="compact"
                          outlined
                          :disabled="
                            POV.pov_type == 'PHARMACIST' ||
                            POV.pov_type == 'DISTRIBUTOR' ||
                            POV.pov_type == 'HOSPITAL'
                          "
                          class="FontSize"
                          label="POV Specialization"
                          v-model="POV.specialization_name"
                          :items="POVSpecializationArray"
                          item-title="specialization_name"
                          item-value="specialization_name"
                        ></v-select>
                        <!-- :disabled="POV.pov_type != 'DOCTOR'" -->
                      </v-col>
                      <!-- <v-col cols="12" sm="12" xs="12" md="4">
                        <v-text-field
                          density="compact"
                          :disabled="POV.pov_type == 'HOSPITAL'"
                          outlined
                          class="FontSize ml-2"
                          label="Unique ID"
                          :counter="10"
                          :rules="UniqueidRules"
                          @input="ValidateUniqueIdRulesMethod"
                          v-model="POV.pov_unique_display_id"
                        ></v-text-field>
                      </v-col> -->
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="pt-0" v-if="StoreObj.Action != 'VIEW'">
                    <v-spacer />
                    <v-btn
                      text
                      small
                      color="primary"
                      @click="CreatePOVEmit((Toggle = 1))"
                      >Cancel</v-btn
                    >
                    <v-btn
                      tile
                      small
                      :loading="loading"
                      color="primary"
                      @click="ValidateForm()"
                      >Confirm</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import { listSpecializations } from "@/graphql/queries.js";
import { createPOV, updatePOV } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    pov_type: String,
    StoreObj: Object,
    create_pov_dialog: Boolean,
    GetCurrentUserDetailsObj: Object,
  },
  components: {
    SnackBar,
  },
  data: () => ({
    POVTypeItems: ["DOCTOR", "PHARMACIST", "DISTRIBUTOR"],
    // POVTypeItems: ["DOCTOR", "PHARMACIST", "DISTRIBUTOR", "HOSPITAL"],
    UniqueidRules: [],
    ContactRules: [],
    Toggle: 0,
    loading: false,
    center: { lat: 0, lng: 0 },
    markers: [],
    places: [],
    search: null,
    currentPlace: null,
    POV: {
      pov_address: "",
      lat: "",
      lng: "",
      pov_name: "",
      // pov_unique_display_id: "",
      pov_country_code: "+91",
      pov_contact_number: "",
      specialization_name: "",
      pov_type: "",
    },

    CountryCodeItems: ["+91"],
    POVSpecializationArray: [],
    SnackBarComponent: {},
  }),
  watch: {
    create_pov_dialog(val) {
      if (val == true) {
        (this.center = { lat: 0, lng: 0 }), (this.ContactRules = []);
        this.UniqueidRules = [];
        (this.POV.pov_country_code = "+91"), this.listSpecializationsLists();
        if (this.StoreObj.Action == "CREATE") {
          this.GetCurrentLocation();
        }

        if (this.StoreObj.Action == "EDIT" || this.StoreObj.Action == "VIEW") {
          (this.center = {
            lat: this.StoreObj.lat,
            lng: this.StoreObj.lng,
          }),
            // console.log("StoreObjff", this.StoreObj);
            (this.POV = {
              pov_address: this.StoreObj.pov_address,
              lat: this.StoreObj.lat,
              lng: this.StoreObj.lng,
              pov_name: this.StoreObj.pov_name,
              // pov_unique_display_id: this.StoreObj.pov_unique_display_id,
              // specialization_name: this.StoreObj.specialization_name,
              specialization_name:
                this.StoreObj.pov_type != "DOCTOR"
                  ? ""
                  : this.StoreObj.specialization_name,
            });
          if (
            this.StoreObj.pov_type != undefined &&
            this.StoreObj.pov_type != null &&
            this.StoreObj.pov_type != ""
          ) {
            this.POV.pov_type = this.StoreObj.pov_type;
          }
          if (
            this.StoreObj.pov_contact_number != undefined &&
            this.StoreObj.pov_contact_number != null &&
            this.StoreObj.pov_contact_number != ""
          ) {
            this.POV.pov_country_code = this.StoreObj.pov_country_code;
            this.POV.pov_contact_number = this.StoreObj.pov_contact_number;
          } else {
            this.POV.pov_country_code = "+91";
          }
        }
        //////////
        if (
          this.StoreObj.Action == "EDITTABLE" ||
          this.StoreObj.Action == "VIEW"
        ) {
          (this.center = {
            lat: this.StoreObj.pov_location.lat,
            lng: this.StoreObj.pov_location.lng,
          }),
            (this.POV = {
              pov_address: this.StoreObj.pov_address,
              lat: this.StoreObj.pov_location.lat,
              lng: this.StoreObj.pov_location.lng,
              pov_name: this.StoreObj.pov_name,
              // pov_unique_display_id: this.StoreObj.pov_unique_display_id,
              // specialization_name: this.StoreObj.specialization_name,
              specialization_name:
                this.StoreObj.pov_type != "DOCTOR"
                  ? ""
                  : this.StoreObj.specialization_name,
            });
          if (
            this.StoreObj.pov_type != undefined &&
            this.StoreObj.pov_type != null &&
            this.StoreObj.pov_type != ""
          ) {
            this.POV.pov_type = this.StoreObj.pov_type;
          }
          if (
            this.StoreObj.pov_contact_number != undefined &&
            this.StoreObj.pov_contact_number != null &&
            this.StoreObj.pov_contact_number != ""
          ) {
            this.POV.pov_country_code = this.StoreObj.pov_country_code;
            this.POV.pov_contact_number = this.StoreObj.pov_contact_number;
          } else {
            this.POV.pov_country_code = "+91";
          }
        }
      }
    },
  },
  methods: {
    ValidateContactRulesMethod() {
      this.ContactRules = [
        (v) => !!v || "Required",
        (v) =>
          /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
        (v) => (v && v.length >= 10) || "Minimum 10 Digits",
        (v) => (v && v.length < 11) || "Maximum 10 Digits",
      ];
    },

    ValidateUniqueIdRulesMethod() {
      this.UniqueidRules = [
        (v) => !!v || "Required",
        (v) => (v && v.length < 11) || "Maximum 10 characters",
        (v) =>
          /^(?=[a-zA-Z 0-9@._%+-]{0,100}$)[ a-z0-9A-Z ]{0,100}$/.test(v) ||
          "Invalid",
      ];
    },
    async UpdatePOV() {
      try {
        this.loading = true;
        var inputparams = {
          pov_id: this.StoreObj.pov_id,
          pov_name: this.POV.pov_name,
        };
        // if (
        //   this.POV.pov_unique_display_id != null &&
        //   this.POV.pov_unique_display_id != "" &&
        //   this.POV.pov_unique_display_id != undefined
        // ) {
        //   inputparams.pov_unique_display_id = this.POV.pov_unique_display_id;
        // }
        if (
          this.POV.pov_contact_number != null &&
          this.POV.pov_contact_number != "" &&
          this.POV.pov_contact_number != undefined
        ) {
          inputparams.pov_country_code = this.POV.pov_country_code;
          inputparams.pov_contact_number = this.POV.pov_contact_number;
        }
        if (
          this.POV.specialization_name != null &&
          this.POV.specialization_name != "" &&
          this.POV.specialization_name != undefined
        ) {
          inputparams.specialization_name = this.POV.specialization_name;
        }

        let result = await client.graphql({
          query: updatePOV,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.UpdatePOV);
        if (ResultObject.status == "Success") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
          };
          this.CreatePOVEmit((this.Toggle = 2));
        }
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
        };
      }
    },
    async CreatePOV() {
      try {
        this.loading = true;
        var inputparams = {
          lat: this.POV.lat,
          lng: this.POV.lng,
          pov_type: this.pov_type,
          pov_name: this.POV.pov_name,
          pov_address: this.POV.pov_address,
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
        };
        // if (
        //   this.POV.pov_unique_display_id != null &&
        //   this.POV.pov_unique_display_id != "" &&
        //   this.POV.pov_unique_display_id != undefined
        // ) {
        //   inputparams.pov_unique_display_id = this.POV.pov_unique_display_id;
        // }
        if (
          this.POV.pov_contact_number != null &&
          this.POV.pov_contact_number != "" &&
          this.POV.pov_contact_number != undefined
        ) {
          inputparams.pov_country_code = this.POV.pov_country_code;
          inputparams.pov_contact_number = this.POV.pov_contact_number;
        }
        if (
          this.POV.specialization_name != null &&
          this.POV.specialization_name != "" &&
          this.POV.specialization_name != undefined
        ) {
          inputparams.specialization_name = this.POV.specialization_name;
        }

        let result = await client.graphql({
          query: createPOV,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.CreatePOV);
        if (ResultObject.status == "Success") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
          };
          this.CreatePOVEmit((this.Toggle = 2));
        }
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
        };
      }
    },
    ValidateForm() {
      if (this.$refs.form.validate()) {
        if (this.StoreObj.Action == "CREATE") {
          this.CreatePOV();
        } else if (
          this.StoreObj.Action == "EDIT" ||
          this.StoreObj.Action == "EDITTABLE"
        ) {
          this.UpdatePOV();
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "primary",
          SnackbarText: "Invalid Inputs",
          Top: true,
        };
      }
    },
    async listSpecializationsLists() {
      this.POVSpecializationArray = [];
      let result = await client.graphql({
        query: listSpecializations,
        variables: {
          input: {},
        },
      });
      var StoreArray = JSON.parse(result.data.listSpecializations);
      this.POVSpecializationArray = StoreArray.data.Items;
    },
    GetCurrentLocation() {
      var self = this;
      navigator.geolocation.getCurrentPosition(function (pos) {
        self.center.lat = pos.coords.latitude;
        self.center.lng = pos.coords.longitude;
        self.latitude = pos.coords.latitude;
        self.longitude = pos.coords.longitude;
      });
    },
    setPlace(place) {
      // console.warn("place", place);
      this.currentPlace = place;
      (this.center.lat = this.currentPlace.geometry.location.lat()),
        (this.center.lng = this.currentPlace.geometry.location.lng());
      this.POV.lat = this.currentPlace.geometry.location.lat();
      this.POV.lng = this.currentPlace.geometry.location.lng();
      this.POV.pov_address = place.formatted_address;
      this.POV.pov_name = place.name;
    },
    CreatePOVEmit(Toggle) {
      this.$refs.form.reset();
      (this.center = { lat: 0, lng: 0 }), this.$emit("clicked", Toggle);
    },
  },
};
</script>
<style scoped>
.FontSize {
  font-size: 12px;
}
</style>
