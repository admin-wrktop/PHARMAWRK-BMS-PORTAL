<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      :model-value="DialogWarning"
      transition="dialog-top-transition"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar density="compact" dark color="primary" class="elevation-0">
          <v-icon size="small" class="mr-2">{{
            "StoreObj.Action == 'DEACTIVATE' ? 'mdi-close' : 'mdi-check'"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE'
                ? `Deactivate ${$route.name}`
                : `Activate ${$route.name}`
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center pb-0">
          <v-icon
            size="60px"
            :color="StoreObj.Action == 'DEACTIVATE' ? 'red' : 'green'"
            class="mt-4"
            >{{
              StoreObj.Action == "DEACTIVATE" ? "mdi-close" : "mdi-check"
            }}</v-icon
          >
          <div>
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span v-if="$route.name == 'Organization'">{{
              " " + StoreObj.organization_name
            }}</span>
            ?
          </div>
        </v-card-text>
        <v-card-actions class="mt-2">
          <v-spacer />
          <v-btn
            size="small"
            text
            color="primary"
            @click="WarningEmit((Toggle = 1))"
            >Cancel</v-btn
          >
          <v-btn
            size="small"
            tile
            v-if="$route.name == 'Organization'"
            :loading="loading"
            color="primary"
            variant="elevated"
            @click="ActivateInActiveOrglist((Toggle = 1))"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { errorMessage } from "@/utils/errorMessage.js";
import SnackBar from "@/components/SnackBar.vue";
import {
  DeactiveOrActivateOrganization,
} from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    StoreObj: Object,
    DialogWarning: Boolean,
    GetCurrentUserDetailsObj: Object,
  },
  components: {
    SnackBar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    SnackBarComponent: {},
  }),
  watch: {
    DialogWarning(val) {
      if (val == true) {
        console.log(this.$route.name, this.StoreObj);
      }
    },
  },
  methods: {
    async ActivateInActiveOrglist() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.StoreObj.organization_id,
          action: this.StoreObj.Action,
        };
        let result = await client.graphql({
          query: DeactiveOrActivateOrganization,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        // console.log("result", result);
        this.ResultObject = JSON.parse(
          result.data.DeactiveOrActivateOrganization
        );
        if (this.ResultObject.status == "SUCCESS") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: this.ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
        }
        this.WarningEmit((this.Toggle = 2));
      } catch (error) {
        console.warn(error);
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
    WarningEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
