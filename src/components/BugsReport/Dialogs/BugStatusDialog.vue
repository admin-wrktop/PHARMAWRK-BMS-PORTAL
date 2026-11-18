<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />

    <v-dialog persistent :model-value="Bugs_Status_Dialog" max-width="520">
      <v-card rounded="lg">
        <!-- Header -->
        <v-toolbar density="compact" color="primary">
          <v-icon class="mx-2" size="small">mdi-laptop-off</v-icon>
          <span class="text-subtitle-1 font-weight-medium">
            Update Bug Status
          </span>
          <v-spacer />
          <v-btn icon variant="text" @click="bugStatusDialogEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-6">
          <!-- <div class="text-center text-body-1 mb-6">
            Are you sure you want to mark this issue as
            <strong class="text-success">Fixed</strong>?
          </div> -->

          <v-form ref="form">
            <v-menu
              ref="menu"
              v-model="MonthPickerMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="330px"
              min-width="330px"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  class="mt-2 FontSize FieldPointerCursor"
                  variant="outlined"
                  density="compact"
                  v-model="date"
                  label="Fixed On *"
                  append-inner-icon="mdi-calendar"
                  readonly
                  v-bind="props"
                ></v-text-field>
              </template>
              <v-card>
                <v-date-picker
                  :max="new Date().toISOString().substring(0, 10)"
                  color="primary"
                  class="mt-4"
                  hide-header
                  v-model="dateMonth"
                  no-title
                  scrollable
                >
                </v-date-picker>
                <!-- <v-card-actions>
                  <v-spacer />
                  <v-btn text color="primary" @click="MonthPickerMenu = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="SaveSelectedMonth()">
                    OK
                  </v-btn>
                </v-card-actions> -->
              </v-card>
            </v-menu>
            <v-textarea
              v-model="bug_comments"
              label="Comments *"
              auto-grow
              rows="2"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-comment-text-outline"
              :rules="[(v) => !!v || 'Comments are required']"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn
            variant="outlined"
            size="small"
            @click="bugStatusDialogEmit(1)"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            size="small"
            variant="elevated"
            :loading="loading"
            @click="validateForm"
          >
            <v-icon start size="small">mdi-check-circle-outline</v-icon>
            Update Status
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { UpdateBugReport } from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

import SnackBar from "@/components/SnackBar.vue";

export default {
  props: {
    Bugs_Status_Dialog: Boolean,
    StoreageObj: Object,
  },
  components: { SnackBar },
  data: () => ({
    bug_comments: "",
    SnackBarComponent: {},
    loading: false,
    MonthPickerMenu: false,
    dateMonth: new Date(),
    date: (() => {
      const now = new Date();
      const d = String(now.getDate()).padStart(2, "0");
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const y = now.getFullYear();
      return `${d}-${m}-${y}`;
    })(),
  }),
  computed: {
    fixedOnEpoch() {
      if (!this.date) return null;

      const [day, month, year] = this.date.split("-");

      return new Date(`${year}-${month}-${day}T12:00:00`).getTime();
    },
  },
  watch: {
    dateMonth(val) {
      if (!val) return;

      const selectedDate = new Date(val);

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");

      this.date = `${day}-${month}-${year}`;
      this.MonthPickerMenu = false;
    },
  },
  methods: {
    async validateForm() {
      const validate = await this.$refs.form.validate();
      if (validate.valid) {
        await this.changeBug_Status_Method();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Please Add Comments",
        };
      }
    },
    async changeBug_Status_Method() {
      try {
        this.loading = true;
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          bug_id: this.StoreageObj.bug_id,
          bug_status: "FIXED",
          fixed_on: this.fixedOnEpoch,
          bug_comments: this.bug_comments,
        };
        console.log("inputParams", inputParams);
        const result = await client.graphql({
          query: UpdateBugReport,
          variables: {
            input: inputParams,
          },
        });
        console.log("result", result);
        let ResultObj = JSON.parse(result.data.UpdateBugReport);
        console.log("ResultObj", ResultObj);
        if (ResultObj.status == "SUCCESS") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            Top: true,
            SnackbarText: "Status changed successfully",
          };
          this.bugStatusDialogEmit(2);
        }
        this.loading = false;
        return ResultObj;
      } catch (error) {
        this.loading = false;
        console.log("err", error);
      }
    },
    bugStatusDialogEmit(Toggle) {
      this.$refs.form.reset();
      (this.date = (() => {
        const now = new Date();
        const d = String(now.getDate()).padStart(2, "0");
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const y = now.getFullYear();
        return `${d}-${m}-${y}`;
      })()),
        this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
