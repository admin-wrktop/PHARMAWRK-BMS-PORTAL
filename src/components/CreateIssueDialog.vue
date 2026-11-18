<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />

    <v-dialog
      persistent
      :fullscreen="
        selectedFiles.length == 0 || selectedFiles.length > 1 ? false : true
      "
      :max-width="
        selectedFiles.length == 0 || selectedFiles.length > 1
          ? '500px'
          : '1000px'
      "
      :model-value="dialogCreateIssue"
    >
      <v-overlay :value="overlayAttachments">
        <v-progress-circular
          :rotate="180"
          :width="5"
          :value="loaderPercentage"
          color="white"
          size="120"
        >
          {{ count + 1 }} /{{ selectedFiles.length }}
        </v-progress-circular>
        <div class="PrimaryFontColorXSmall">Uploading Attachments...</div>
      </v-overlay>
      <v-card>
        <v-toolbar density="compact" dark color="primary" class="elevation-0">
          <div>Facing An Issue On PharmaWrk ?</div>
          <v-spacer />
          <v-btn icon @click="dialogCreateIssueEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pb-0 pt-4">
          <v-row no-gutters>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              :md="
                selectedFiles.length == 0 || selectedFiles.length > 1 ? 12 : 4
              "
            >
              <v-form ref="form">
                <v-textarea
                  density="compact"
                  outlined
                  rows="3"
                  :counter="1000"
                  class="FontSize field_height field_label_size"
                  label="Description"
                  v-model="report_issue.issue_description"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) =>
                      (v && v.length <= 1000) ||
                      'Description must be less than 1000 characters',
                  ]"
                ></v-textarea>
                <!-- <v-select
                  density="compact"
                  outlined
                  class="FontSize field_height field_label_size"
                  label="Sub-System"
                  :items="sub_systems"
                  item-title="text"
                  item-value="value"
                  :rules="[(v) => !!v || 'Required']"
                  v-model="report_issue.issue_reported_platform"
                ></v-select> -->
                <v-file-input
                  density="compact"
                  v-model="selectedFiles"
                  color="primary accent-4"
                  counter
                  multiple
                  class="FontSize field_height field_label_size"
                  label="Upload Attachments"
                  prepend-icon=""
                  :rules="[(v) => !!v || 'Required']"
                  prepend-inner-icon="mdi-paperclip"
                  outlined
                  :show-size="1000"
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                      x-small
                      v-if="selectedFiles.length != 0 && index < 1"
                      color="primary"
                      dark
                      label
                      small
                    >
                      <div class="FontSizeSmall">{{ text.slice(0, 20) }}</div>
                    </v-chip>

                    <span
                      v-else-if="index === 1"
                      class="text-overline text-grey text--darken-3 mx-2"
                    >
                      +{{ selectedFiles.length - 1 }} File(s)
                    </span>
                  </template>
                </v-file-input>
              </v-form>
            </v-col>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="8"
              v-if="selectedFiles.length == 1"
            >
              <v-card outlined content-class class="mx-3">
                <v-btn
                  small
                  fab
                  absolute
                  top
                  right
                  color="red"
                  class="mt-6"
                  @click="clearImage()"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-img contain :src="imageSRC"></v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pr-6 pb-4">
          <v-spacer />
          <v-btn
            small
            outlined
            color="primary"
            @click="dialogCreateIssueEmit(1)"
            >Cancel</v-btn
          >
          <v-btn
            small
            color="primary"
            :loading="loading"
            @click="validateMethod()"
            >Report</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API } from "aws-amplify";
import SnackBar from "@/components/SnackBar.vue";

import { GetEachProjectDetails } from "@/mixins/GetEachProjectDetails.js";
export default {
  props: {
    selectedFilesFromDrop: Array,
    dialogCreateIssue: Boolean,
    StoreObj: Object,
  },
  components: {
    SnackBar,
  },
  mixins: [GetEachProjectDetails],
  data: () => ({
    count: 0,
    overlayAttachments: false,
    report_issue: {
      issue_type: "",
      issue_module_name: "",
      issue_sub_module_name: "",
      issue_description: "",
      assign_to: "",
      issue_severity: "",
      issue_reported_platform: "",
      issue_reported_project_version: "",
    },
    loading: false,
    SnackBarComponent: {},
    selectedFiles: [],
    sub_systems: [],
    issue_attachments: [],
    issue_severityItems: [
      {
        text: "Not Specified",
        value: "NOT_SPECIFIED",
      },
      {
        text: "High",
        value: "HIGH",
      },
      {
        text: "Medium",
        value: "MEDIUM",
      },
      {
        text: "Low",
        value: "LOW",
      },
    ],
    imageSRC: "",
    loaderPercentage: 0,
    loaderPercentageDivider: 0,
  }),
  watch: {
    async dialogCreateIssue(value) {
      if (value == true) {
        this.imageSRC = "";
        this.sub_systems = [];
        let result = await this.GetEachProjectDetailsMethod();
        if (result.sub_systems.length != 0) {
          this.sub_systems = result.sub_systems.map((subsystem) => {
            let object = {};
            object.text = subsystem.project_platform;
            object.value = subsystem.project_platform;
            return object;
          });
        }
        this.sub_systems.push({
          text: "Not Specified",
          value: "NOT_SPECIFIED",
        });
        this.report_issue.issue_reported_platform = "NOT_SPECIFIED";
        this.report_issue.issue_severity = "NOT_SPECIFIED";
        if (
          this.selectedFilesFromDrop &&
          this.selectedFilesFromDrop.length != 0
        ) {
          this.selectedFiles = this.selectedFilesFromDrop;
        }
        if (this.selectedFilesFromDrop.length == 1) {
          var fileReader = new FileReader();
          var self = this;
          fileReader.readAsDataURL(self.selectedFilesFromDrop[0]);
          fileReader.onload = async function (value) {
            self.imageSRC = value.target.result;
          };
        }
      }
    },
    "report_issue.issue_module_name"(value) {
      this.report_issue.issue_description = value;
    },
  },

  methods: {
    clearImage() {
      this.selectedFiles = [];
      this.imageSRC = "";
    },
    validateMethod() {
      if (this.$refs.form.validate() == true) {
        this.uploadImageToS3();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Invalid Input(s)",
        };
      }
    },
    async uploadImageToS3() {
      var self = this;
      for (let i = 0; i < self.selectedFiles.length; i++) {
        const file = self.selectedFiles[i];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = async function () {
          var base64FileContent = fileReader.result.split(",");
          let Attachments = {
            file_data: base64FileContent[1],
            content_type: self.selectedFiles[i].type,
            file_extension: `.${self.selectedFiles[i].name.split(".").pop()}`,
          };
          self.issue_attachments.push(Attachments);
        };
      }
      const path = "report_issue_for_other_projects";
      const Report_issue = {
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.VUE_APP_BUGTRAKR_API_KEY,
        },
        body: {
          command: "reportIssueForOtherProjects",
          user_email_id: self.$store.getters.get_user_email,
          project_display_id: self.getEachProjectDetails.project_display_id,
          issue_description: self.report_issue.issue_description,
          issue_attachments: self.issue_attachments,
        },
      };
      self.loading = true;
      setTimeout(() => {
        API.post("BUGTRAKR", path, Report_issue)
          .then((res) => {
            console.log("rss", res);
            if (res.status == "success") {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: res.message,
              };
              self.dialogCreateIssue = false;
              self.$refs.form.reset();
            } else {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: res.errorMessage,
              };
              self.$refs.form.reset();
            }
            self.loading = false;
          })
          .catch((error) => {
            self.loading = false;
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: error,
            };
          });
      }, 1000);
    },
    dialogCreateIssueEmit(Toggle) {
      this.loading = false;
      this.selectedFiles = [];
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
