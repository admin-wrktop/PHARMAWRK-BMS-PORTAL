<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      width="600px"
      persistent
      :model-value="DownloadExcelTemplateDialog"
    >
      <v-card>
        <v-toolbar
          density="compact"
          color="primary"
          class="white--text elevation-0"
        >
          <span class="ml-3">Download Template</span>
          <v-spacer />
          <v-btn size="small" icon @click.stop="DownloadExcelTemplateEmit()"
            ><v-icon size="small" color="white">mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-autocomplete
          class="mt-4 mx-4"
          density="compact"
          variant="outlined"
          label="POV Type"
          :items="ExcelDownloadTypeArray"
          v-model="ExcelDownloadType"
        ></v-autocomplete>

        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="black"
            size="small"
            @click="DownloadExcelTemplateEmit()"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            size="small"
            variant="elevated"
            @click.stop="validateMethod()"
            dark
            :loading="loading"
            ><v-icon>mdi-download</v-icon>Download</v-btn
          >
        </v-card-actions></v-card
      ></v-dialog
    >
  </div>
</template>

<script>
const ExcelJS = require("exceljs");
import SnackBar from "@/components/SnackBar.vue";

export default {
  props: {
    DownloadExcelTemplateDialog: Boolean,
  },
  components: {
    SnackBar,
  },
  data: () => ({
    ExcelDownloadTypeArray: ["DOCTOR", "OTHER"],
    ExcelDownloadType: "",
    SnackBarComponent: {},
    loading: false,
  }),
  methods: {
    validateMethod() {
      if (this.ExcelDownloadType == "") {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Select POV Type",
        };
      } else {
        this.handleDownloadClick();
      }
    },
    handleDownloadClick() {
      this.DownloadMyExcel(this.ExcelDownloadType);
    },
    DownloadMyExcel(action) {
      this.loading = true;
      let DoctorExcelHeaders = [
        "Pov Type*",
        "Pov Name*",
        "Pov Id*",
        "Address*",
        "Lat*",
        "Lng*",
        "Pov City*",
        "Country Code",
        "Pov Contact Number*",
        "Secondary Contact Number",
        "Pov Email Id",
        "Specialization",
        "Qualification",
        "Registration Id",
        "Pov Category",
        "Division",
        "Visit Frequency",
        "Territory Name*",
        "Hospital Name*",
        "Hospital Id*",
      ];
      let ExcelHeaders = [
        "Pov Type*",
        "Pov Name*",
        "Pov Id*",
        "Address*",
        "Lat*",
        "Lng*",
        "Pov City*",
        "Country Code",
        "Pov Contact Number*",
        "Pov Company Name",
        "Primary Contact Number",
        "Primary Contact Designation",
        "Secondary Contact Person_1",
        "Secondary Contact Number_1",
        "Secondary Contact Designation_1",
        "Secondary Contact Person_2",
        "Secondary Contact Number_2",
        "Secondary Contact Designation_2",
        "Secondary Contact Person_3",
        "Secondary Contact Number_3",
        "Secondary Contact Designation_3",
        "Total Secondary Contact Count",

        "Secondary Contact Number",
        "Pov Email Id",
        "Division",
        "Visit Frequency",
        "Territory Name*",
      ];
      async function generateExcel() {
        try {
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("Bulk Upload POVs");
          if (action == "DOCTOR") {
            sheet.addRow(DoctorExcelHeaders);
          } else if (action == "OTHER") {
            sheet.addRow(ExcelHeaders);
          }
          for (let num = 2; num < 5000; num++) {
            for (let i = 0; i < sheet._columns.length; i++) {
              sheet.getColumn(sheet._columns[i].number).width = 30;
            }
          }
          const buffer = await workbook.xlsx.writeBuffer();
          return buffer;
        } catch (err) {
          this.loading = false;
          console.error(err);
          throw err;
        }
      }
      setTimeout(() => {
        generateExcel()
          .then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${
              this.ExcelDownloadType
            } POV-Upload-${new Date().toLocaleString("en-GB")}.xlsx`;
            downloadLink.click();
            this.loading = false;
            this.DownloadExcelTemplateEmit();
          })
          .catch((err) => {
            this.loading = false;
            console.error("Error:", err);
          });
      }, 1000);
    },
    DownloadExcelTemplateEmit() {
      this.ExcelDownloadType = "";
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
