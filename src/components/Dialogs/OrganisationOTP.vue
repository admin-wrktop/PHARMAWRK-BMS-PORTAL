<template>
  <div>
    <v-dialog
      persistent
      width="500px"
      :model-value="OrganisationOTP"
      transition="dialog-top-transition"
      content-class="DialogTrasition"
    >
      <v-card tile>
        <v-toolbar density="compact" color="primary" class="text-white">
          Set OTP
          <v-spacer />
          <v-btn dark icon small @click="OrganisationOTPEmit(1)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-6">
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="3" xs="4" sm="4">
                <div class="mt-2">Enter OTP *</div>
              </v-col>
              <v-col cols="12" md="9" xs="8" sm="8">
                <v-text-field
                  density="compact"
                  outlined
                  label="Enter Code *"
                  :rules="otp_rules"
                  v-model="custom_opt"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn small outlined @click.stop="OrganisationOTPEmit(1)"
            >Cancel</v-btn
          >
          <v-btn
            small
            color="primary"
            dark
            :loading="loading"
            @click.stop="Validateform()"
            >Set</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { UpdateOtpForUsers } from "@/graphql/mutations.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    OrganisationOTP: Boolean,
  },
  data: () => ({
    loading: false,
    custom_opt: "",
    otp_rules: [
      (v) =>
        /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
      (v) => (v && v.length < 7) || "Invalid",
      (v) => (v && v.length > 5) || "Invalid",
    ],
  }),
  methods: {
    Validateform() {
      if (this.$refs.form.validate()) {
        this.createPOVCategory();
      } else {
        console.log("Error");
      }
    },
    async createPOVCategory() {
      console.log("inside");
      let inputparams = {
        updater_user_id: this.$store.getters.get_current_user_details.user_id,
        custom_opt: this.custom_opt,
      };
      try {
        let result = await client.graphql({
          query: UpdateOtpForUsers,
          variables: {
            input: inputparams,
          },
        });
        console.log("myresult", result);
        var ResultObject = JSON.parse(result.data.UpdateOtpForUsers);
        if (ResultObject.status == "SUCCESS") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.OrganisationOTPEmit(2);
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
    OrganisationOTPEmit(Toggle) {
      // if (this.$refs.form == undefined) {
      this.$refs.form.reset();
      // }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
