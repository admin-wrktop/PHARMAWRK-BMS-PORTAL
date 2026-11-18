<template>
  <div>
    <Overlay :overlay="overlay" />
    <CreatePovDialog
      :StoreObj="StoreObj"
      :pov_type="pov_type"
      :create_pov_dialog="create_pov_dialog"
      :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
      @clicked="CreatePOVEmit"
    />
    <WarningDialog
      :GetCurrentUserDetailsObj="GetCurrentUserDetailsObj"
      :DialogWarning="DialogWarning"
      :StoreObj="StoreObj"
      @clicked="WarningEmit"
    />
    <v-card class="elevation-0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="2" xs="12">
          <v-select
            density="compact"
            outlined
            class="mt-4 mr-2 ml-4"
            style="font-size: 12px"
            v-model="pov_type"
            label="POV Type"
            :items="POVTypeItems"
            @change="getPOVLists()"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="12" md="2" xs="12">
          <v-select
            density="compact"
            outlined
            class="mt-4 mr-2"
            style="font-size: 12px"
            v-model="pov_source_type"
            label="Source Type"
            :items="POVSourceTypeItems"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="12" md="2" xs="12">
          <v-select
            density="compact"
            outlined
            class="mt-4 mr-2"
            style="font-size: 12px"
            v-model="pov_status"
            label="Status"
            :items="POVStatusItems"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="12" md="2" xs="12">
          <v-select
            density="compact"
            outlined
            class="mt-4 mr-2"
            style="font-size: 12px"
            v-model="viewFormat"
            label="View"
            :items="POVFormats"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="12" md="3" xs="12" v-if="viewFormat == 'MAP'">
          <!-- <v-icon>mdi-magnify</v-icon> -->
          <gmap-autocomplete
            flat
            class="ml-0 rounded-sm"
            placeholder="Search Location"
            style="
              width: 280px;
              height: 38px;
              font-size: 14px;
              border: 1px solid grey;
              margin-top: 17px;
            "
            :value="search"
            ref="clearSearch"
            @place_changed="setPlace"
          >
          </gmap-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="3" xs="12" v-if="viewFormat == 'TABLE'">
          <v-text-field
            density="compact"
            outlined
            class="FontSize mt-4 mr-2"
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="12" sm="12" md="3" xs="12"> -->
        <v-btn
          class="mt-4"
          color="primary"
          v-on:click="StoreObj.Action = 'CREATE'"
          @click="create_pov_dialog = true"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
        <!-- </v-col> -->
        <!-------------------------MAP-------------------------------->
        <v-col cols="12" sm="12" md="12" xs="12" v-if="viewFormat == 'MAP'">
          <div class="ml-2 mr-2">
            <gmap-map
              ref="mymap"
              :center="startLocation"
              :zoom="9"
              style="width: 100%; height: 490px"
            >
              <gmap-info-window
                :options="infoOptions"
                :position="infoPosition"
                :opened="infoOpened"
                @closeclick="infoOpened = true"
              >
                <v-card
                  flat
                  class="font-weight-medium card"
                  style="font-size: 13px"
                  elevation="0"
                  width="600px"
                  height="100%"
                >
                  <v-row no-gutters class="mt-2 ml-2">
                    <v-col cols="4"> Name : {{ pov_name }} </v-col>
                    <v-col cols="3" class="ml-2">
                      Source Type : {{ pov_source_type_value }}
                    </v-col>
                    <v-col cols="3" class="ml-14">
                      POV Type : {{ pov_type_value }}
                      <!-- <span
                        v-if="
                          pov_unique_display_id > 0 ||
                          pov_unique_display_id != null
                        "
                      >
                        Unique ID : {{ pov_unique_display_id }}
                      </span>

                      <div v-else>Unique ID : -</div> -->
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-3 ml-2">
                    <v-col cols="4">
                      <span
                        v-if="
                          pov_contact_number > 0 || pov_contact_number != null
                        "
                      >
                        Contact Number : {{ pov_contact_number }}
                      </span>
                      <div v-else>Contact Number : -</div>
                    </v-col>
                    <v-col cols="4" class="ml-2">
                      <span
                        v-if="
                          specialization_name > 0 || specialization_name != null
                        "
                      >
                        Specialization : {{ specialization_name }}
                      </span>
                      <div v-else>Specialization : -</div>
                    </v-col>
                    <!-- <v-col cols="3" class="ml-2">
                      POV Type : {{ pov_type_value }}
                    </v-col> -->
                  </v-row>
                  <v-row no-gutters class="mt-3 ml-2">
                    <v-col cols="12"> Address : {{ pov_address }} </v-col>
                  </v-row>
                  <v-row justify="end" class="mt-5 mb-3">
                    <v-btn
                      small
                      tile
                      outlined
                      color="primary"
                      v-model="editButton"
                      v-if="
                        pov_source_type_value == 'MASTER' &&
                        pov_status_value == 'ACTIVE'
                      "
                      @click="
                        checkValue(
                          pov_name,
                          pov_source_type_value,
                          pov_contact_number,
                          specialization_name,
                          pov_type_value,
                          pov_address,
                          lat,
                          lng,
                          pov_id_value,
                          pov_country_code,
                          'EDIT',
                        )
                      "
                    >
                      <!-- pov_unique_display_id, -->
                      <v-icon small color="primary">mdi-pencil</v-icon></v-btn
                    >
                    <v-btn
                      small
                      tile
                      v-model="deactivateButton"
                      outlined
                      color="red"
                      class="ml-2 mr-6"
                      v-if="
                        pov_status_value == 'ACTIVE' &&
                        pov_source_type_value == 'MASTER'
                      "
                      @click="CheckDeactivate(pov_id, pov_name, 'DEACTIVATE')"
                    >
                      <v-icon small color="red">mdi-close</v-icon>
                    </v-btn>
                    <v-btn
                      small
                      tile
                      v-model="activateButton"
                      outlined
                      color="primary"
                      class="ml-2 mr-6"
                      v-if="
                        pov_status_value == 'INACTIVE' &&
                        pov_source_type_value == 'MASTER'
                      "
                      @click="CheckActivate(pov_id, pov_name, 'ACTIVATE')"
                    >
                      <v-icon small color="primary">mdi-check</v-icon>
                    </v-btn>
                  </v-row>
                </v-card>
              </gmap-info-window>

              <gmap-marker
                v-for="(item, key) in filterArray"
                :key="key"
                :position="getPosition(item)"
                :clickable="true"
                @click="toggleInfo(item, key)"
              />
            </gmap-map>
          </div>
        </v-col>
        <!--------------ENDS---------------->
        <!---------------TABLE VIEW------------------>

        <v-col cols="12" sm="12" md="12" xs="12" v-if="viewFormat == 'TABLE'">
          <v-data-table
            density="compact"
            :headers="headers"
            :items="filterArray"
            :page.sync="page"
            :footer-props="{
              'items-per-page-options': [10, 20, 30, 40, 50],
            }"
            @click:row="handleRowClick"
            :items-per-page="50"
            hide-default-footer
            class="elevation-0 TableClass"
            :search="search"
            :no-data-text="NoData"
            @page-count="pageCount = $event"
          >
            <template v-slot:[`item.pov_name`]="{ item }">
              <div
                v-if="
                  item.pov_name != null &&
                  item.pov_name != '' &&
                  item.pov_name != undefined
                "
                class="FontSize"
              >
                <v-icon small color="primary" class="mr-2"
                  >mdi-map-marker</v-icon
                >{{ item.pov_name }}
              </div>
              <div v-else class="FontSize">-</div>
            </template>
            <template v-slot:[`item.specialization_name`]="{ item }">
              <div
                v-if="
                  item.specialization_name != null &&
                  item.specialization_name != '' &&
                  item.specialization_name != undefined
                "
                class="FontSize"
              >
                {{ item.specialization_name }}
              </div>
              <div v-else class="FontSize">-</div>
            </template>
            <template v-slot:[`item.pov_source_type`]="{ item }">
              <div
                v-if="
                  item.pov_source_type != null &&
                  item.pov_source_type != '' &&
                  item.pov_source_type != undefined &&
                  item.pov_source_type == 'MASTER'
                "
                class="FontSize text-primary"
              >
                <b>{{ item.pov_source_type }}</b>
              </div>
              <div
                v-else-if="
                  item.pov_source_type != null &&
                  item.pov_source_type != '' &&
                  item.pov_source_type != undefined &&
                  item.pov_source_type == 'CUSTOM'
                "
                class="FontSize text-blue"
              >
                <b>{{ item.organization_name }}</b>
              </div>
              <div v-else class="FontSize">-</div>
            </template>
            <template v-slot:[`item.pov_contact_number`]="{ item }">
              <div
                v-if="
                  item.pov_contact_number != null &&
                  item.pov_contact_number != '' &&
                  item.pov_contact_number != undefined
                "
                class="FontSize"
              >
                {{ item.pov_country_code }}-{{ item.pov_contact_number }}
              </div>
              <div v-else class="FontSize">-</div>
            </template>
            <template v-slot:[`item.pov_status`]="{ item }">
              <div class="FontSize">{{ item.pov_status }}</div>
            </template>
            <template v-slot:[`item.Actions`]="{ item }">
              <v-icon
                small
                color="green"
                class="mr-2"
                v-if="
                  item.pov_source_type == 'MASTER' &&
                  item.pov_status == 'ACTIVE'
                "
                @click.stop="CheckEachItem(item, 'EDITTABLE')"
                >mdi-pencil</v-icon
              >
              <v-icon
                v-if="
                  item.pov_status == 'INACTIVE' &&
                  item.pov_source_type == 'MASTER'
                "
                small
                color="green"
                @click.stop="CheckEachItem(item, 'ACTIVATE')"
                >mdi-check</v-icon
              >
              <v-icon
                v-if="
                  item.pov_status == 'ACTIVE' &&
                  item.pov_source_type == 'MASTER'
                "
                small
                color="red"
                @click.stop="CheckEachItem(item, 'DEACTIVATE')"
                >mdi-close</v-icon
              >
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps";
import MarkerClusterer from "marker-clusterer-plus";
import WarningDialog from "@/components/Dialogs/WarningDialog.vue";
import CreatePovDialog from "@/components/Dialogs/CreatePovDialog.vue";
import Overlay from "@/components/Overlay.vue";
import { listPOVsByType } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    GetCurrentUserDetailsObj: Object,
  },
  components: {
    Overlay,
    CreatePovDialog,
    WarningDialog,
  },
  data: () => ({
    num: "",
    // startLocation: {
    //   lat: 12.9716,
    //   lng: 77.5946,
    // },
    startLocation: { lat: 0, lng: 0 },
    currentPlace: null,
    search: null,
    coordinates: {},
    infoPosition: null,
    infoContent: null,
    infoOpened: false,
    infoCurrentKey: null,
    infoOptions: {
      pixelOffset: {
        width: 0,
        height: -35,
      },
    },
    pov_address: null,
    pov_id: null,
    pov_name: null,
    pov_type_value: null,
    pov_source_type_value: null,
    // pov_unique_display_id: null,
    pov_contact_number: null,
    specialization_name: null,
    pov_status_value: null,
    lat: null,
    lng: null,
    pov_id_value: null,
    pov_country_code: null,
    editButton: "",
    deactivateButton: "",
    activateButton: "",
    ///////////////////////////
    pov_status: "ACTIVE",
    POVStatusItems: ["ACTIVE", "INACTIVE"],
    pov_source_type: "ALL",
    POVSourceTypeItems: ["ALL", "CUSTOM", "MASTER"],
    pov_type: "DOCTOR",
    POVTypeItems: ["DOCTOR", "PHARMACIST", "DISTRIBUTOR"],
    // POVTypeItems: ["DOCTOR", "PHARMACIST", "DISTRIBUTOR", "HOSPITAL"],
    create_pov_dialog: false,
    NoData: "",
    // search: "",
    PovList: [],
    page: 1,
    pageCount: 0,
    overlay: false,
    viewFormat: "TABLE",
    POVFormats: ["MAP", "TABLE"],
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "pov_name",
      },
      { text: "POV Source Type", value: "pov_source_type" },
      { text: "Contact Number", value: "pov_contact_number" },
      { text: "Specialization", value: "specialization_name" },
      { text: "Actions", value: "Actions" },
    ],
    StoreObj: {},
    DialogWarning: false,
    filterArray: [],
  }),
  watch: {
    pov_type() {
      this.filterArray = [];
      if (this.pov_source_type == "ALL") {
        this.filterArray = this.coordinates.filter(
          (pov) =>
            pov.pov_type == this.pov_type && pov.pov_status == this.pov_status,
        );
      } else if (this.pov_source_type != "ALL") {
        this.filterArray = this.coordinates.filter(
          (pov) =>
            pov.pov_type == this.pov_type &&
            pov.pov_source_type == this.pov_source_type &&
            pov.pov_status == this.pov_status,
        );
      }
      if (this.filterArray.length == 0) {
        this.NoData = "No Pov Found";
      }
    },
    pov_source_type() {
      this.filterArray = [];
      if (this.pov_source_type == "ALL") {
        this.filterArray = this.coordinates.filter(
          (pov) =>
            pov.pov_type == this.pov_type && pov.pov_status == this.pov_status,
        );
      } else if (this.pov_source_type != "ALL") {
        this.filterArray = this.coordinates.filter(
          (pov) =>
            pov.pov_type == this.pov_type &&
            pov.pov_source_type == this.pov_source_type &&
            pov.pov_status == this.pov_status,
        );
      }
      if (this.filterArray.length == 0) {
        this.NoData = "No Pov Found";
      }
    },
    pov_status() {
      this.filterArray = [];
      if (this.pov_source_type == "ALL") {
        this.filterArray = this.coordinates.filter(
          (pov) =>
            pov.pov_type == this.pov_type && pov.pov_status == this.pov_status,
        );
      } else if (this.pov_source_type != "ALL") {
        this.filterArray = this.coordinates.filter(
          (pov) =>
            pov.pov_type == this.pov_type &&
            pov.pov_source_type == this.pov_source_type &&
            pov.pov_status == this.pov_status,
        );
      }
      if (this.filterArray.length == 0) {
        this.NoData = "No Pov Found";
      }
    },
  },
  mounted() {
    this.getPOVLists();
  },
  methods: {
    //////TABLE FORMAT METHODS///////////
    CheckEachItem(item, Action) {
      this.StoreObj = item;
      this.StoreObj.Action = Action;
      if (Action == "EDITTABLE") {
        this.create_pov_dialog = true;
      } else if (Action == "ACTIVATE" || Action == "DEACTIVATE") {
        this.DialogWarning = true;
      }
    },
    handleRowClick(event, item) {
      this.StoreObj = item.item;
      this.StoreObj.Action = "VIEW";
      this.create_pov_dialog = true;
    },

    ///////MAP FORMAT METHODS//////////
    MarkerClusterer: MarkerClusterer,
    gmapApi: gmapApi,

    clearField() {
      this.$refs.clearSearch.$el.value = null;
    },

    checkValue(
      item1,
      item2,
      // item3,
      item4,
      item5,
      item6,
      item7,
      item8,
      item9,
      item10,
      item11,
      Action,
    ) {
      this.StoreObj = {
        pov_name: item1,
        pov_source_type: item2,
        pov_address: item7,
        lat: item8,
        lng: item9,
        pov_contact_number: item4,
        pov_type: item6,
        specialization_name: item5,
        // pov_unique_display_id: item3,
        pov_id: item10,
        pov_country_code: item11,
        Action: Action,
      };
      this.create_pov_dialog = true;
    },

    CheckDeactivate(pov_id, pov_name, Action) {
      this.StoreObj = {
        pov_id: pov_id,
        pov_name: pov_name,
        Action: Action,
      };
      this.DialogWarning = true;
    },

    CheckActivate(pov_id, pov_name, Action) {
      this.StoreObj = {
        pov_id: pov_id,
        pov_name: pov_name,
        Action: Action,
      };
      this.DialogWarning = true;
    },

    VerifyApprove(pov_id, pov_name, Action) {
      this.VerifyObj = {
        pov_id: pov_id,
        pov_name: pov_name,
        Action: Action,
      };
      this.approve_dialog = true;
    },

    VerifyReject(pov_id, pov_name, Action) {
      this.VerifyObj = {
        pov_id: pov_id,
        pov_name: pov_name,
        Action: Action,
      };
      this.reject_dialog = true;
    },

    setPlace(place) {
      this.currentPlace = place;
      (this.startLocation.lat = this.currentPlace.geometry.location.lat()),
        (this.startLocation.lng = this.currentPlace.geometry.location.lng());
      this.clearField();
    },

    getPosition: function (marker) {
      // console.log("marker", marker);
      return {
        lat: marker.pov_location.lat,
        lng: marker.pov_location.lng,
      };
    },
    toggleInfo: function (marker, key) {
      // console.log("MARKER", marker);
      this.infoPosition = this.getPosition(marker);
      this.pov_id = marker.pov_id;
      this.pov_name = marker.pov_name;
      this.pov_type_value = marker.pov_type;
      this.pov_address = marker.pov_address;
      this.pov_source_type_value = marker.pov_source_type;
      // this.pov_unique_display_id = marker.pov_unique_display_id;
      this.pov_contact_number = marker.pov_contact_number;
      this.specialization_name = marker.specialization_name;
      this.pov_status_value = marker.pov_status;
      this.lat = marker.pov_location.lat;
      this.lng = marker.pov_location.lng;
      this.pov_id_value = marker.pov_id;
      this.pov_country_code = marker.pov_country_code;

      if (this.infoCurrentKey == key) {
        this.infoOpened = !this.infoOpened;
      } else {
        this.infoOpened = true;
        this.infoCurrentKey = key;
      }
    },

    /////////////////////////////////////////////////////////////////////////////////////////
    WarningEmit(Toggle) {
      this.DialogWarning = false;
      this.infoOpened = false;
      if (Toggle == 2) {
        this.getPOVLists();
      }
      this.StoreObj = {};
    },
    // CheckEachItem(item, Action) {
    //   this.StoreObj = item;
    //   this.StoreObj.Action = Action;
    //   if (Action == "EDIT") {
    //     this.create_pov_dialog = true;
    //   } else if (Action == "ACTIVATE" || Action == "DEACTIVATE") {
    //     this.DialogWarning = true;
    //   }
    // },
    // handleRowClick(item) {
    //   this.StoreObj = item;
    //   this.StoreObj.Action = "VIEW";
    //   this.create_pov_dialog = true;
    // },
    CreatePOVEmit(Toggle) {
      this.StoreObj = {};
      this.infoOpened = false;
      this.create_pov_dialog = false;
      if (Toggle == 2) {
        this.getPOVLists();
      }
    },
    async getPOVLists() {
      try {
        this.overlay = true;
        // this.PovList = [];
        this.coordinates = [];

        let result = await client.graphql({
          query: ListPOVsByType,
          variables: {
            input: {
              organization_id: this.StoreObj.organization_id,
              pov_type: this.pov_type,
              next_token: null,
              limit: 101,
            },
          },
        });
        var StoreArray = JSON.parse(result.data.ListPOVsByType);
        this.coordinates = StoreArray.data.Items;
        // console.log("getPOVLists", this.coordinates);
        this.startLocation.lat = this.coordinates[1].pov_location.lat;
        this.startLocation.lng = this.coordinates[1].pov_location.lng;
        // this.filterArray = [];
        if (this.pov_source_type == "ALL") {
          this.filterArray = this.coordinates.filter(
            (pov) =>
              pov.pov_type == this.pov_type &&
              pov.pov_status == this.pov_status,
          );
        } else if (this.pov_source_type != "ALL") {
          this.filterArray = this.coordinates.filter(
            (pov) =>
              pov.pov_type == this.pov_type &&
              pov.pov_source_type == this.pov_source_type &&
              pov.pov_status == this.pov_status,
          );
        }
        if (this.filterArray.length == 0) {
          this.NoData = "No Pov Found";
        }
        this.overlay = false;
      } catch (error) {
        this.NoData = error.errors[0].message;
        this.UserList = [];
        this.overlay = false;
      }
    },
  },
};
</script>
<style scoped>
.card {
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
