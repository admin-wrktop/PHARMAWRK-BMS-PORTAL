<template>
  <v-row justify="center">
    <v-dialog :model-value="showDialog" persistent max-width="600px">
      <v-card class="elevation-1 pa-3">
        <v-card-text>
          <div class="layout column align-center">
            <h1 class="flex my-3">Set password</h1>
          </div>
          <v-form ref="changePassword" v-model="valid" lazy-validation>
            <v-text-field
              append-icon="mdi-lock"
              label=" New Password"
              type="password"
              v-model="newPassword"
            ></v-text-field>
            <v-text-field
              append-icon="mdi-lock"
              label="Confirm Password"
              type="password"
              v-model="confirmPassword"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="primary"
            @click.prevent="changePassword"
            :loading="loading"
            :disabled="!valid"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
// import { rules } from "@/mixins/rules.js";
export default {
  name: "ChangePassword",
  props: ["showDialog"],
  //   mixins: [rules],
  data() {
    return {
      challenge: "",
      dialog: false,
      newPassword: "",
      confirmPassword: "",
      loading: false,
      valid: true,
    };
  },
  methods: {
    changePassword() {
      this.loading = true;
      if (this.$refs.changePassword.validate()) {
        this.$emit("new-password", this.newPassword);
      }
    },
  },
};
</script>

<style></style>
