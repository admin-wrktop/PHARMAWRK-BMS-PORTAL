<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog persistent :model-value="RemoveOTPDialog" max-width="500px">
      <v-card class="cardBorder">
        <v-toolbar density="compact" color="primary" class="text-white"
          ><span class="ml-2">Remove User</span>
          <v-spacer />
          <v-btn size="small" icon @click.stop="RemoveOTPDialogEmit(1)"
            ><v-icon color="white">mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div align="center" class="mt-6">
          Are you sure to remove
          <span class="font-weight-bold">{{ StoreObj.user_name }}</span> from
          the list ?
        </div>
        <v-card-actions class="mt-6">
          <v-spacer />
          <v-btn size="small" outlined @click.stop="RemoveOTPDialogEmit(1)"
            >Cancel</v-btn
          >
          <v-btn
            dark
            size="small"
            color="primary"
            variant="elevated"
            :loading="loading"
            @click.stop="removeUsersOTP()"
            >Remove</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { RemoveDefaultEnteredOtpUser } from "@/graphql/mutations.js";

import Snackbar from "@/components/SnackBar.vue";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    RemoveOTPDialog: Boolean,
    StoreObj: Object,
  },
  components: { Snackbar },
  data: () => ({
    loading: false,
    SnackBarComponent: {},
  }),
  methods: {
    async removeUsersOTP() {
      try {
        this.loading = true;
        let inputparams = {
          user_id: this.StoreObj.user_id,
        };

        let result = await client.graphql({
          query: RemoveDefaultEnteredOtpUser,
          variables: {
            input: inputparams,
          },
        });
        console.log("result", result);
        let ResultObj = JSON.parse(result.data.RemoveDefaultEnteredOtpUser);
        console.log("ResultObj", ResultObj);
        if (ResultObj.status == "SUCCESS") {
          this.RemoveOTPDialogEmit(2);
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            Top: true,
            SnackbarText: "User removed Successfully",
          };
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log("error", error);
      }
    },
    RemoveOTPDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
