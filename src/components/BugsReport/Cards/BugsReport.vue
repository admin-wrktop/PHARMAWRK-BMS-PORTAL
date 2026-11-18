<template>
  <div>
    <Bugs_Status_Dialog
      :Bugs_Status_Dialog="Bugs_Status_Dialog"
      :StoreageObj="StoreageObj"
      @clicked="bugStatusDialogEmit"
    />
    <DetailedErrorDialog
      :DetailedErrorDialog="DetailedErrorDialog"
      :ErrorText="ErrorText"
      @clicked="detailedErrorDialogEmit"
    />
    <v-card-text>
      <v-toolbar class="elevation-0" color="white" extension-height="60">
        <v-menu
          ref="menu"
          v-model="MonthPickerMenu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              class="mr-2 mt-2 FontSize MaxWidthVariant1 FieldPointerCursor"
              variant="outlined"
              density="compact"
              v-model="date"
              label="Select Month"
              append-inner-icon="mdi-calendar"
              readonly
              v-bind="props"
            ></v-text-field>
          </template>
          <v-card>
            <div class="d-flex align-center justify-space-between pa-2">
              <v-btn icon variant="flat" @click="changeYear(-1)">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <div>{{ currentYear }}</div>
              <v-btn icon variant="flat" @click="changeYear(1)">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
            <v-date-picker-months
              color="white"
              type="month"
              v-model="dateMonth"
              no-title
              scrollable
            >
            </v-date-picker-months>
            <v-card-actions>
              <v-spacer />
              <v-btn text color="primary" @click="MonthPickerMenu = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="SaveSelectedMonth()">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-toolbar>
      <v-data-table
        density="compact"
        class="TableClass"
        fixed-header
        :headers="TableHeaders"
        :items="BugsListArray"
      >
        <template v-slot:[`item.bug_accured_on`]="{ item }">
          <div>{{ new Date(item.bug_accured_on).toLocaleDateString() }}</div>
        </template>
        <template v-slot:[`item.bug_modified_on`]="{ item }">
          <div>{{ new Date(item.bug_modified_on).toLocaleDateString() }}</div>
        </template>
        <template v-slot:[`item.detailed_error`]="{ item }">
          <v-icon
            size="small"
            color="primary"
            @click.stop="errorTextDialog_Method(item)"
            >mdi-information</v-icon
          >
        </template>
        <template v-slot:[`item.bug_status`]="{ item }">
          <div
            :class="item.bug_status == 'PENDING' ? 'text-red' : 'text-green'"
          >
            {{ item.bug_status }}
          </div>
        </template>
        <template v-slot:[`item.Actions`]="{ item }">
          <v-icon
            v-if="item.bug_status == 'PENDING'"
            size="small"
            color="primary"
            @click.stop="bugs_Status_Dialog_Method(item)"
            >mdi-cached</v-icon
          >
          <div v-else>-</div>
        </template></v-data-table
      >
    </v-card-text>
  </div>
</template>

<script>
import { GetBugsReportMixin } from "@/mixins/BugsReport/ListBugsReport.js";
import Bugs_Status_Dialog from "@/components/BugsReport/Dialogs/BugStatusDialog.vue";
import DetailedErrorDialog from "@/components/BugsReport/Dialogs/DetailedErrorDialog.vue";
const Now_Date = new Date();
export default {
  props: {
    ActionObj: Object,
  },
  components: {
    Bugs_Status_Dialog,
    DetailedErrorDialog,
  },
  mixins: [GetBugsReportMixin],
  data: () => ({
    Bugs_Status_Dialog: false,
    StoreageObj: {},
    MonthPickerMenu: false,
    DetailedErrorDialog: false,
    ErrorText: {},
    date: `${String(Now_Date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${Now_Date.getFullYear()}`,
    dateMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    TableHeaders: [
      {
        title: "Bug ID",
        key: "display_bug_id",
      },
      {
        title: "Message",
        key: "error_message",
      },
      {
        title: "Detailed Error",
        key: "detailed_error",
      },
      {
        title: "Created On",
        key: "bug_accured_on",
      },
      {
        title: "Modified On",
        key: "bug_modified_on",
      },
      {
        title: "User Name",
        key: "user_name",
      },
      {
        title: "App Version",
        key: "app_version",
      },
      {
        title: "Status",
        key: "bug_status",
      },
      {
        title: "Actions",
        key: "Actions",
      },
    ],
    BugsListArray: [],
  }),
  async mounted() {
    this.BugsListArray = await this.GetBugsReportMethod(
      this.ActionObj.organization_id,
      this.date
    );
  },
  methods: {
    changeYear(direction) {
      const currentYear = new Date().getFullYear();

      const newYear = this.currentYear + direction;

      if (newYear <= currentYear) {
        this.currentYear = newYear;
        const newDate = new Date(this.currentYear, 0, 1);
        this.dateMonth = newDate.toISOString().substr(0, 10);
      }
    },
    async SaveSelectedMonth() {
      const year = this.currentYear;
      const month = String(this.dateMonth + 1).padStart(2, "0");

      this.date = `${month}-${year}`;
      this.MonthPickerMenu = false;

      console.log(this.date);
      this.BugsListArray = await this.GetBugsReportMethod(
        this.ActionObj.organization_id,
        this.date
      );
    },
    bugs_Status_Dialog_Method(item) {
      this.StoreageObj = item;
      this.Bugs_Status_Dialog = true;
    },
    errorTextDialog_Method(item) {
      this.ErrorText = item;
      this.DetailedErrorDialog = true;
    },
    async bugStatusDialogEmit(Toggle) {
      this.Bugs_Status_Dialog = false;
      if (Toggle == 2) {
        this.BugsListArray = await this.GetBugsReportMethod(
          this.ActionObj.organization_id,
          this.date
        );
      }
    },
    detailedErrorDialogEmit() {
      this.DetailedErrorDialog = false;
    },
  },
};
</script>

<style></style>
