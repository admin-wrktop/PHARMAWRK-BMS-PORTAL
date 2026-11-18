<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <Overlay :overlay="overlay" />
    <v-data-table
      density="compact"
      :headers="headers"
      :items="ListMobileApiKeys1"
      class="TableClass"
    >
      <!-- <v-data-table
        density="compact"
        :headers="headers"
        :items="ListMobileApiKeys1"
        class="elevation-0"
        hide-default-footer
        :no-data-text="NoData"
      > -->
      <!-- <template v-slot:[`item.expire_date`]="{ item }">
            <v-tooltip>
              <template v-slot:activator="{props }">
                <div class="FontSize">
                  <v-btn
                   v-bind="props"
                    icon
                    :color="timestamp1 > timestamp  ? 'green' : 'red'"
                  >
                    <v-icon small>{{
                      timestamp1 > timestamp 
                        ? `${item.expire_date}`
                        : `${item.expire_date}`
                    }}</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-tooltip>
            <span>{{ timestamp1 > timestamp  ? `${item.expire_date}` : `${item.expire_date}` }}</span>
          
          </template> -->

      <!-- <template v-slot:[`item.expire_date`]="{ item }">
                <v-tooltip color="primary" activator="parent" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      :color="
                        item.expire_date == true || null ? 'green' : 'red'
                      "
                      ><v-icon x-small>{{
                        item.expire_date == true ? "Yes" : "No"
                      }}</v-icon></v-btn
                    >
                  </template>
                  <span>{{ item.expire_date == true ? "YES" : "NO" }}</span>
                </v-tooltip>
              </template> -->
    </v-data-table>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        :loading="loading"
        variant="elevated"
        @click="UpdateApiKey()"
        >Generate Api Key</v-btn
      ></v-card-actions
    >
  </div>
</template>

<script>
import Overlay from "@/components/Overlay.vue";
import { UpdateExpiryApiKey } from "@/graphql/mutations.js";
import SnackBar from "@/components/SnackBar.vue";
import { ListMobileApiKeys } from "@/graphql/queries.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  components: {
    Overlay,
    SnackBar,
  },
  data: () => ({
    abc: "",
    overlay: false,
    loading: false,
    NoData: "",
    date: "",

    ListMobileApiKeys1: [],
    SnackBarComponent: {},
    timestamp: "",
    timestamp1: "",
    headers: [
      { title: "Api Key", key: "apiId" },
      { title: "Api Key Expiry Date", key: "expire_date" },
    ],
  }),

  mounted() {
    this.ListMobileApiKeys();

    setTimeout(() => {
      this.date = new Date();
      this.timestamp = this.date.getTime();
      //   console.log("timestamp", this.timestamp);
    }, 500);
  },

  watch: {},

  methods: {
    async ListMobileApiKeys() {
      try {
        this.overlay = true;
        this.ListMobileApiKeys1 = [];

        let result = await client.graphql({
          query: ListMobileApiKeys,
          variables: {
            input: {},
          },
        });
        var StoreArray = JSON.parse(result.data.ListMobileApiKeys);
        this.ListMobileApiKeys1 = StoreArray.data.items;
        // console.log("hdfigkjfgdfbgfb", this.ListMobileApiKeys1);

        // console.log("dhjbfsbsdfk", this.ListMobileApiKeys1[0].expire_date);
        setTimeout(() => {
          this.dateapi = this.ListMobileApiKeys1[0].expire_date.replace(
            /-/g,
            "/",
          );
          //   console.log("dhjbfsbsdfk", this.dateapi);

          const dateParts = this.dateapi.split("/");
          const year = dateParts[2];
          const month = dateParts[0];
          const day = dateParts[1];

          this.date1 = new Date(year, month - 1, day);
          //   console.log("dhjbfsbsdfk1", this.date1);
          this.timestamp1 = this.date1.getTime();
          //   console.log("timestamp1", this.timestamp1);
        }, 500);

        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = error.errors[0].message;
      }
    },

    async UpdateApiKey() {
      try {
        this.overlay = true;
        this.loading = true;
        var inputparams = {
          //
        };
        let result = await client.graphql({
          query: UpdateExpiryApiKey,
          variables: {
            input: inputparams,
          },
        });

        this.loading = false;
        var ResultObject = JSON.parse(result.data.UpdateExpiryApiKey);

        if (ResultObject.status == "SUCCESS") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
        }
      } catch (error) {
        // this.loading = false;

        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
        };
      }
    },
  },
};
</script>

<style></style>
