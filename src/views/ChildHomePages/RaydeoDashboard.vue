<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-card class="elevation-0">
      <v-toolbar density="compact" color="white" class="elevation-0 heading1">
        <v-spacer />
        <div class="font-weight-bold">Raydeo Integration</div>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" md="12" xs="12" sm="12">
            <v-expansion-panels class="mb-4 ml-3 mr-3" focusable>
              <v-expansion-panel density="compact">
                <v-expansion-panel-title
                  class="font-weight-bold text-black"
                  expand-icon="mdi-menu-down"
                >
                  Dashboard Global Keys
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row class="mb-4 my-4">
                    <v-col cols="12" md="4" sm="12" xs="12">
                      Last Updated By :
                      <b class="">{{ modified_dashboard_keys_by_mail }}</b>
                    </v-col>
                    <!-- <v-col cols="12" md="3" xs="12" sm="12">
                      <div class="FontSize">
                        {{ modified_dashboard_keys_by_mail }}
                      </div>
                    </v-col> -->
                    <v-col cols="12" md="4" sm="12" xs="12">
                      Last Modified on :
                      <b class="">{{
                        new Date(last_modified_on).toLocaleString()
                      }}</b>
                    </v-col>
                    <v-col cols="12" md="4" sm="12" xs="12">
                      Created On :
                      <b class="">{{
                        new Date(dashboard_keys_created_on).toLocaleString()
                      }}</b>
                    </v-col>
                    <!-- <v-col cols="12" md="3" sm="12" xs="12">
                      <div class="FontSize">
                        {{ dashboard_keys_created_on }}
                      </div>
                    </v-col> -->
                  </v-row>
                  <v-form ref="form_dashboard">
                    <v-row no-gutters class="mt-8">
                      <v-col cols="12" md="2" xs="12" sm="12">
                        <b class="FontSize">Dashboard Channel API Key :</b>
                      </v-col>
                      <v-col cols="12" md="4" xs="12" sm="12">
                        <v-text-field
                          density="compact"
                          variant="outlined"
                          class="FontSize ml-2"
                          :rules="[(v) => !!v || 'Required']"
                          label="Dashboard Channel API Key *"
                          v-model="dashboard_channel_api_key"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12" md="2" xs="12" sm="12">
                        <b class="FontSize">Dashboard X API Key :</b>
                      </v-col>
                      <v-col cols="12" md="4" xs="12" sm="12">
                        <v-text-field
                          density="compact"
                          variant="outlined"
                          class="FontSize ml-2"
                          v-model="dashboard_x_api_key"
                          label="Dashboard X API Key *"
                          :rules="[(v) => !!v || 'Required']"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      size="small"
                      class="primary text-white"
                      color="primary"
                      variant="elevated"
                      @click="saveDashboardKeys()"
                      :loading="loading_dashboard_btn"
                      >Save</v-btn
                    >
                  </v-card-actions>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Overlay.vue";
import Snackbar from "@/components/SnackBar.vue";

import { ListDashboardGlobalRaydeoApiKeys } from "@/graphql/queries.js";
import { UpdateGlobalRaydeoApiKeys } from "@/graphql/mutations.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  mixins: [],
  components: {
    Overlay,
    Snackbar,
  },
  data: () => ({
    overlay: false,
    loading_dashboard_btn: false,
    loading_ticket_trial_btn: false,
    dashboard_x_api_key: "",
    ticket_trail_x_api_key: "",
    ticket_trail_created_on: "",
    dashboard_channel_api_key: "",
    dashboard_keys_created_on: "",
    ticket_trail_channel_api_key: "",
    ticket_trail_modified_by_mail: "",
    modified_dashboard_keys_by_mail: "",
    SnackBarComponent: {},
    GetTrialAPIsItems: [],
    GetDashboardAPIsItems: [],
    last_modified_on: "",
  }),
  mounted() {
    this.ListRaydeoDashboard();
    // this.GetTrialAPIsItemsMethod();
    // this.GetDashboardAPIsItemsMethod();
    // setTimeout(() => {
    //   this.ticket_trail_x_api_key = this.GetTrialAPIsItems[0].x_api_key;
    //   this.ticket_trail_channel_api_key =
    //     this.GetTrialAPIsItems[0].channel_api_key;
    //   this.ticket_trail_modified_by_mail =
    //     this.GetTrialAPIsItems[0].modified_by_email;
    //   this.ticket_trail_created_on = new Date(
    //     this.GetTrialAPIsItems[0].modified_by_on * 1000
    //   ).toLocaleString("en-GB");
    //   this.modified_dashboard_keys_by_mail =
    //     this.GetDashboardAPIsItems[0].modified_by_email;
    //   this.dashboard_keys_created_on = new Date(
    //     this.GetDashboardAPIsItems[0].modified_by_on * 1000
    //   ).toLocaleString("en-GB");
    //   this.dashboard_channel_api_key =
    //     this.GetDashboardAPIsItems[0].channel_api_key;
    //   this.dashboard_x_api_key = this.GetDashboardAPIsItems[0].x_api_key;
    // }, 1000);
  },
  methods: {
    async saveDashboardKeys() {
      if (this.$refs.form_dashboard.validate()) {
        this.loading_dashboard_btn = true;
        this.overlay = true;
        try {
          var inputParams = {
            user_id: this.$store.getters.get_current_user_details.user_id,
            setting_id: this.GetDashboardAPIsItems.setting_id,
            channel_api_key: this.dashboard_channel_api_key,
            x_api_key: this.dashboard_x_api_key,
          };

          let result = await client.graphql({
            query: UpdateGlobalRaydeoApiKeys,
            variables: {
              input: inputParams,
            },
          });
          var ResultObject = JSON.parse(result.data.UpdateGlobalRaydeoApiKeys);
          if (ResultObject.status == "SUCCESS") {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.ListRaydeoDashboard();
            setTimeout(() => {
              this.modified_dashboard_keys_by_mail =
                this.GetDashboardAPIsItems.modified_by_email;
              this.dashboard_keys_created_on =
                this.GetDashboardAPIsItems.setting_created_on;
              this.dashboard_channel_api_key =
                this.GetDashboardAPIsItems.channel_api_key;
              this.dashboard_x_api_key = this.GetDashboardAPIsItems.x_api_key;
            }, 1000);
          }
          this.loading_dashboard_btn = false;
          this.overlay = false;
        } catch (error) {
          this.loading_dashboard_btn = false;
          this.overlay = false;
          console.log("error", error);
          // this.SnackBarComponent = {
          //   SnackbarVmodel: true,
          //   SnackbarColor: "red",
          //   Top: true,
          //   SnackbarText: error.errors[0].message,
          // };
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Fill All Mandatory Fields..!",
        };
      }
    },
    async ListRaydeoDashboard() {
      try {
        let result = await client.graphql({
          query: ListDashboardGlobalRaydeoApiKeys,
          variables: {
            input: {},
          },
        });
        console.log("reultss", result);
        var ResultObj = JSON.parse(result.data.ListDashboardGlobalRaydeoApiKeys)
          .data.items;
        // console.log("check ResultObj", ResultObj);
        this.GetDashboardAPIsItems = ResultObj[0];
        this.modified_dashboard_keys_by_mail =
          this.GetDashboardAPIsItems.modified_by_email;
        this.dashboard_keys_created_on =
          this.GetDashboardAPIsItems.setting_created_on;
        this.last_modified_on = this.GetDashboardAPIsItems.modified_by_on;
        this.dashboard_channel_api_key =
          this.GetDashboardAPIsItems.channel_api_key;
        this.dashboard_x_api_key = this.GetDashboardAPIsItems.x_api_key;
      } catch (error) {
        console.log("err", error);
      }
    },
  },
};
</script>

<style></style>
