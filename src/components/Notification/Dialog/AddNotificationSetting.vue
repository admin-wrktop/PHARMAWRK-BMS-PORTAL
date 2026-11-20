<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      :model-value="create_edit_notification_dialog"
      max-width="400px"
      transition="dialog-top-transition"
      persistent
    >
      <v-card>
        <v-toolbar
          class="elevation-0 gradient-bg text-white"
          dark
          density="compact"
          color="gradient-bg "
        >
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
                ? 'Create Notification text '
                : StoreObj.Action == 'VIEW'
                ? 'POV Remarks Details'
                : 'Edit Notification text'
            "
          ></span>
          <v-spacer />
          <v-btn icon @click="CreateEditSpecEmit((Toggle = 1))">
            <v-icon size="small">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4 pb-0">
          <v-form ref="form">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Notification Text *"
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
              :items="DruglistArray"
              :readonly="StoreObj.Action == 'VIEW'"
              v-model="notification_text"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              density="compact"
              label="Notification Subject *"
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
              :readonly="StoreObj.Action == 'VIEW'"
              v-model="notification_subject"
            ></v-text-field>
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
            class="primary"
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
import {
  CreateNotificationsSettings,
  UpdateNotificationSettings,
} from "@/graphql/mutations.js";

import SnackBar from "@/components/SnackBar.vue";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    StoreObj: Object,
    create_edit_notification_dialog: Boolean,
    GetCurrentUserDetailsObj: Object,
  },
  components: {
    SnackBar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    SnackBarComponent: {},
    notification_text: "",
    DruglistArray: [],
    notification_subject: "",
  }),
  watch: {
    create_edit_notification_dialog(val) {
      if (val == true) {
        if (this.StoreObj.Action == "EDIT" || this.StoreObj.Action == "VIEW") {
          this.notification_text = this.StoreObj.setting_name;
          this.notification_subject = this.StoreObj.notification_subject;
        }
      }
    },
  },
  methods: {
    ValidateForm() {
      if (this.$refs.form.validate()) {
        if (this.StoreObj.Action == "CREATE") {
          this.CreateNotification();
        } else if (this.StoreObj.Action == "EDIT") {
          this.EditNotification();
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
    async EditNotification() {
      try {
        this.loading = true;
        var inputparams = {
          setting_name: this.notification_text,
          setting_id: this.StoreObj.setting_id,
          notification_subject: this.notification_subject,
        };
        let result = await client.graphql({
          query: UpdateNotificationSettings,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.UpdateNotificationSettings);
        if (ResultObject.status == "SUCCESS") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.CreateEditSpecEmit((this.Toggle = 2));
          this.loading = false;
        }
      } catch (error) {
        console.warn("Errorrr", error);
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
    async CreateNotification() {
      try {
        this.loading = true;
        var inputparams = {
          setting_name: this.notification_text,
          notification_subject: this.notification_subject,
        };
        let result = await client.graphql({
          query: CreateNotificationsSettings,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.CreateNotificationsSettings);
        if (ResultObject.status == "SUCCESS") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.CreateEditSpecEmit((this.Toggle = 2));
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
    CreateEditSpecEmit(Toggle) {
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
.gradient-btn {
  background: -webkit-linear-gradient(145deg, #0a876e 30%, #0fc566 80%);
  /* -webkit-background-clip: text; */
  -webkit-text-fill-color: white;
}
.gradient-bg {
  background: -webkit-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -moz-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -o-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -ms-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
}
</style>
