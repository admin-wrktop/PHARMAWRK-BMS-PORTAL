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
        <v-select
          density="compact"
          variant="outlined"
          label="Organisation *"
          :items="ListAllOrganisation"
          item-title="organization_name"
          item-value="organization_id"
          v-model="Organisationvalue"
          class="mt-2 MaxWidthVariant2"
          :rules="[(v) => !!v || '']"
          :menu-props="{ contentClass: 'SelectFontSize' }"
        ></v-select>
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
              class="mx-2 mt-2 FontSize MaxWidthVariant1 FieldPointerCursor"
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
        <v-tooltip color="primary" location="bottom">
          <template v-slot:activator="{ props }">
            <a>
              <v-icon
                class="mt-n6"
                @click="DownloadMyExcel()"
                color="primary"
                v-bind="props"
                size="x-large"
              >
                mdi-file-export-outline
              </v-icon>
            </a>
          </template>
          <span class="text-white">Excel Download</span>
        </v-tooltip>
      </v-toolbar>
      <v-data-table
        density="compact"
        class="TableClass"
        :height="height"
        fixed-header
        hide-default-footer
        :loading="TableLoading"
        :headers="TableHeaders"
        :items="BugsListArray"
        v-model:page="page"
        :items-per-page="itemsPerPage"
      >
        <template v-slot:[`item.bug_accured_on`]="{ item }">
          <div>{{ new Date(item.bug_accured_on).toLocaleString() }}</div>
        </template>
        <template v-slot:[`item.bug_modified_on`]="{ item }">
          <div>{{ new Date(item.bug_modified_on).toLocaleString() }}</div>
        </template>
        <template v-slot:[`item.bug_status`]="{ item }">
          <div
            :class="item.bug_status == 'PENDING' ? 'text-red' : 'text-green'"
          >
            {{ item.bug_status }}
          </div>
        </template>
        <template v-slot:[`item.detailed_error`]="{ item }">
          <v-icon
            size="small"
            color="primary"
            @click.stop="errorTextDialog_Method(item)"
            >mdi-information</v-icon
          >
        </template>
        <template v-slot:[`item.bug_comments`]="{ item }">
          <v-tooltip
            v-if="item.bug_comments"
            color="primary"
            activator="parent"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <div class="FontSize" v-bind="props">
                {{
                  item.bug_comments?.length >= 15
                    ? item.bug_comments.substr(0, 15) + "..."
                    : item.bug_comments
                }}
              </div>
            </template>
            <span class="primary">{{ item.bug_comments }}</span>
          </v-tooltip>
          <div v-else>-</div>
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
      <v-card-actions class="py-0">
        <v-container>
          <v-spacer />
          <v-pagination
            size="x-small"
            active-color="primary"
            variant="elevated"
            v-model="page"
            :length="pageCount"
          ></v-pagination>
        </v-container>
      </v-card-actions>
    </v-card-text>
  </div>
</template>

<script>
import { GetBugsReportMixin } from "@/mixins/BugsReport/ListBugsReport.js";
import { GetOrganisationListss } from "@/mixins/GetOrganisationList.js";
import { DownloadExcel } from "@/mixins/Extras/DownloadExcel.js";

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
  mixins: [GetBugsReportMixin, GetOrganisationListss, DownloadExcel],
  data: () => ({
    page: 1,
    height: 0,
    ErrorText: {},
    next_token: null,
    itemsPerPage: 300,
    DetailedErrorDialog: false,
    Bugs_Status_Dialog: false,
    StoreageObj: {},
    MonthPickerMenu: false,
    date: `${String(Now_Date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${Now_Date.getFullYear()}`,
    dateMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    Organisationvalue: "",
    TableLoading: false,
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
        title: "Comments",
        key: "bug_comments",
      },
      {
        title: "Actions",
        key: "Actions",
      },
    ],
    BugsListArray: [],
  }),
  computed: {
    pageCount() {
      return Math.ceil(this.BugsListArray?.length / this.itemsPerPage);
    },
  },
  watch: {
    async Organisationvalue(val) {
      if (val != "") {
        this.BugsListArray = await this.GetBugsReportMethod(val, this.date);
      }
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetBugsReportMethod(
          this.Organisationvalue,
          this.date,
          this.next_token
        );
      }
    },
  },
  async mounted() {
    this.height = window.innerHeight - 200;
    let OrganisationList = await this.getOrganisationlistsMethod();
    if (OrganisationList && OrganisationList.length > 0) {
      this.Organisationvalue = OrganisationList[0].organization_id;
    }
    this.BugsListArray = await this.GetBugsReportMethod(
      this.Organisationvalue,
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
        this.Organisationvalue,
        this.date
      );
    },
    bugs_Status_Dialog_Method(item) {
      this.StoreageObj = item;
      this.Bugs_Status_Dialog = true;
    },
    async bugStatusDialogEmit(Toggle) {
      this.Bugs_Status_Dialog = false;
      if (Toggle == 2) {
        this.BugsListArray = await this.GetBugsReportMethod(
          this.Organisationvalue,
          this.date
        );
      }
    },
    DownloadMyExcel() {
      let excelHeader = this.TableHeaders.map((header) => ({
        label: header.title,
        value: header.key,
      }));

      excelHeader = excelHeader.filter(
        (item) => item.value != "Actions" && item.value != "detailed_error"
      );

      let formattedList = this.BugsListArray.map((item) => {
        let object = { ...item };
        if (item.bug_accured_on) {
          object.bug_accured_on = new Date(
            item.bug_accured_on
          ).toLocaleString();
        }
        if (item.bug_modified_on) {
          object.bug_modified_on = new Date(
            item.bug_modified_on
          ).toLocaleString();
        }

        return object;
      });

      this.DownloadExcelMethod(excelHeader, formattedList, "Bug Report");
    },

    errorTextDialog_Method(item) {
      this.ErrorText = item;
      this.DetailedErrorDialog = true;
    },
    detailedErrorDialogEmit() {
      this.DetailedErrorDialog = false;
    },
  },
};
</script>

<style></style>
