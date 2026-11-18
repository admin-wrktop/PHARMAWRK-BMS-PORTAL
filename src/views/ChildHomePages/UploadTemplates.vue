<template>
  <div>
    <DownloadExcelTemplateDialog
      :DownloadExcelTemplateDialog="DownloadExcelTemplateDialog"
      @clicked="DownloadExcelTemplateEmit"
    />
    <v-toolbar color="white">
      <v-btn-toggle
        v-model="selectedType"
        mandatory
        color="primary"
        variant="outlined"
        divided
        class="mt-4 ml-4"
      >
        <v-btn value="DOCTOR" prepend-icon="mdi-account-heart"> Doctor </v-btn>
        <v-btn value="PHARMACIST" prepend-icon="mdi-hospital-box">
          Pharmacist
        </v-btn>
        <v-btn value="HOSPITAL" prepend-icon="mdi-hospital-building">
          Hospital
        </v-btn>
      </v-btn-toggle>
      <v-spacer />
      <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            size="small"
            v-bind="props"
            class="gradient-bg text-white text-capitalize mr-4"
            @click.stop="downloadTemplate()"
          >
            <v-icon color="white">mdi-package-down</v-icon>
          </v-btn>
        </template>
        <span>Download Template</span>
      </v-tooltip>
    </v-toolbar>
    <v-row class="mt-2">
      <v-col cols="5">
        <v-file-input
          v-model="excelFile"
          label="Upload Excel to get formatted data with Lat/Lng"
          accept=".xlsx,.xls"
          variant="outlined"
          density="compact"
          prepend-icon=""
          prepend-inner-icon="mdi-file-excel"
          hide-details
          class="ml-4"
        />
      </v-col>

      <v-col cols="2">
        <v-btn
          block
          color="primary"
          size="40"
          :loading="processing"
          :disabled="processing || !excelFile || !selectedType"
          @click="
            selectedType === 'DOCTOR'
              ? processDoctorExcel()
              : selectedType === 'PHARMACIST'
              ? processPharmacistExcel()
              : processHospitalExcel()
          "
          class=""
        >
          Get Lat/Lng
        </v-btn>
      </v-col>
    </v-row>

    <v-card
      v-if="processing || processedRows > 0"
      class="mt-4 pa-4"
      elevation="2"
    >
      <v-row>
        <v-col cols="12" md="3">
          <div class="text-center">
            <v-progress-circular
              :model-value="progressPercentage"
              :size="100"
              :width="10"
              color="primary"
            >
              {{ progressPercentage }}%
            </v-progress-circular>
          </div>
        </v-col>

        <v-col cols="12" md="9">
          <div class="mb-2">
            Total Rows :
            <strong>{{ totalRows }}</strong>
          </div>

          <div class="mb-2">
            Processed :
            <strong>{{ processedRows }}</strong>
          </div>

          <div class="mb-2">
            Remaining :
            <strong>{{ totalRows - processedRows }}</strong>
          </div>

          <v-progress-linear
            :model-value="progressPercentage"
            color="success"
            height="18"
            rounded
          />

          <div class="mt-2 text-center">
            {{ progressPercentage }}% Completed
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DownloadExcelTemplateDialog from "@/components/Templates/DownloadExcelTemplate.vue";

export default {
  components: {
    DownloadExcelTemplateDialog,
  },
  data: () => ({
    anIncreasingNumber: 1,
    excelFile: null,
    processing: false,
    totalRows: 0,
    processedRows: 0,
    progressPercentage: 0,
    selectedType: "",
    DownloadExcelTemplateDialog: false,
  }),

  methods: {
    downloadTemplate() {
      this.DownloadExcelTemplateDialog = true;
    },
    async processHospitalExcel() {
      if (!this.excelFile) {
        alert("Please select a file");
        return;
      }

      const file = Array.isArray(this.excelFile)
        ? this.excelFile[0]
        : this.excelFile;

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);

          const workbook = XLSX.read(data, {
            type: "array",
          });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          this.processing = true;
          this.totalRows = jsonData.length;
          this.processedRows = 0;
          this.progressPercentage = 0;

          const cache = {};
          const outputData = [];

          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];

            const hospitalName =
              row["Clinic/Hospital"]?.toString().trim() || "";

            const hospitalId = row["Institute ID"] || "";

            const address = row["Hospital Address"]?.toString().trim() || "";

            const Territory = row["Node"] || "";

            const city =
              row["Station"]
                ?.toString()
                .trim()
                .replace(/\(.*?\)/g, "") || "";

            const cacheKey = `${hospitalName}_${address}_${city}`;

            let lat = "";
            let lng = "";

            if (!cache[cacheKey]) {
              const searches = [
                `${hospitalName}, ${address}, ${city}, India`,
                `${hospitalName}, ${city}, India`,
                `${address}, ${city}, India`,
                `${city}, India`,
              ];

              let found = false;

              for (const searchQuery of searches) {
                try {
                  const response = await axios.get(
                    "https://photon.komoot.io/api/",
                    {
                      params: {
                        q: searchQuery,
                        limit: 10,
                      },
                      timeout: 10000,
                    },
                  );

                  if (
                    response.data?.features &&
                    response.data.features.length
                  ) {
                    const indiaResult = response.data.features.find((feature) =>
                      feature.properties?.country
                        ?.toLowerCase()
                        ?.includes("india"),
                    );

                    if (indiaResult) {
                      cache[cacheKey] = {
                        lat: indiaResult.geometry.coordinates[1],
                        lng: indiaResult.geometry.coordinates[0],
                      };

                      found = true;

                      break;
                    }
                  }
                } catch (error) {
                  console.error("Search Failed:", searchQuery, error.message);
                }
              }

              if (!found) {
                cache[cacheKey] = {
                  lat: "",
                  lng: "",
                };
              }
            }

            lat = cache[cacheKey].lat;
            lng = cache[cacheKey].lng;

            const bedValue = row["No. of Beds in Primary Hospital"] || "";

            let beds = "";

            if (bedValue.toString().includes("10 to 20")) {
              beds = 20;
            } else if (bedValue.toString().includes("20 to 50")) {
              beds = 50;
            } else if (bedValue.toString().includes("51 to 200")) {
              beds = 200;
            } else if (
              bedValue.toString().toLowerCase().includes("more than 200")
            ) {
              beds = 250;
            }

            outputData.push({
              "Pov Type*": "HOSPITAL",
              "Pov Name*": hospitalName,
              "Pov Id*": hospitalId,
              "Address*": address,
              "Lat*": lat,
              "Lng*": lng,
              "Pov City*": city,
              "Territory Name*": Territory,
              "No of beds": beds,
            });

            this.processedRows = i + 1;

            this.progressPercentage = Math.round(
              ((i + 1) / this.totalRows) * 100,
            );
          }

          const uniqueMap = new Map();

          outputData.forEach((row) => {
            const key = `${row["Pov Name*"]}_${row["Pov Id*"]}`;

            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, row);
            } else {
              const existing = uniqueMap.get(key);

              if (
                (!existing["Lat*"] || !existing["Lng*"]) &&
                row["Lat*"] &&
                row["Lng*"]
              ) {
                uniqueMap.set(key, row);
              }
            }
          });

          const uniqueOutputData = Array.from(uniqueMap.values());
          const newSheet = XLSX.utils.json_to_sheet(uniqueOutputData, {
            header: [
              "Pov Type*",
              "Pov Name*",
              "Pov Id*",
              "Address*",
              "Lat*",
              "Lng*",
              "Pov City*",
              "Territory Name*",
              "No of beds",
            ],
          });
          this.processing = false;

          const newWorkbook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(newWorkbook, newSheet, "POVs");

          const excelBuffer = XLSX.write(newWorkbook, {
            bookType: "xlsx",
            type: "array",
          });

          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(blob, "POVs_With_LatLng.xlsx");
          this.progressPercentage = 100;

          alert(`Completed. Generated ${outputData.length} rows.`);
        } catch (error) {
          console.error(error);
          this.processing = false;
          alert("Error processing file");
        }
      };

      reader.readAsArrayBuffer(file);
    },

    async processDoctorExcel() {
      if (!this.excelFile) {
        alert("Please select a file");
        return;
      }

      const file = Array.isArray(this.excelFile)
        ? this.excelFile[0]
        : this.excelFile;

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);

          const workbook = XLSX.read(data, {
            type: "array",
          });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          this.processing = true;
          this.totalRows = jsonData.length;
          this.processedRows = 0;
          this.progressPercentage = 0;

          const cache = {};
          const outputData = [];

          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];

            const DoctorName = row["Doctor"]?.toString().trim() || "";

            const DoctorId = row["Doctor ID"] || "";

            const EmailId = row["Email ID"]?.toString().trim() || "";

            const hospitalName =
              row["Clinic/Hospital"]?.toString().trim() || "";

            const hospitalId = row["Institute ID"] || "";

            const ContactNumber = row["Mobile Number"]?.toString().trim() || "";

            const SecondaryContact =
              row["SecondaryContact"]?.toString().trim() || "";

            const address = row["Hospital Address"]?.toString().trim() || "";
            const SpecializationValue =
              row["Primary Specialty"]?.toString().trim() || "";

            const Territory = row["Node"] || "";
            // const Qualification = row["Qualification"]?.toString().trim() || "";

            const city =
              row["Station"]
                ?.toString()
                .trim()
                .replace(/\(.*?\)/g, "") || "";

            const cacheKey = `${hospitalName}_${address}_${city}`;

            let lat = "";
            let lng = "";

            if (!cache[cacheKey]) {
              const searches = [
                `${hospitalName}, ${address}, ${city}, India`,
                `${hospitalName}, ${city}, India`,
                `${address}, ${city}, India`,
                `${city}, India`,
              ];

              let found = false;

              for (const searchQuery of searches) {
                try {
                  const response = await axios.get(
                    "https://photon.komoot.io/api/",
                    {
                      params: {
                        q: searchQuery,
                        limit: 10,
                      },
                      timeout: 10000,
                    },
                  );

                  if (
                    response.data?.features &&
                    response.data.features.length
                  ) {
                    const indiaResult = response.data.features.find((feature) =>
                      feature.properties?.country
                        ?.toLowerCase()
                        ?.includes("india"),
                    );

                    if (indiaResult) {
                      cache[cacheKey] = {
                        lat: indiaResult.geometry.coordinates[1],
                        lng: indiaResult.geometry.coordinates[0],
                      };

                      found = true;

                      break;
                    }
                  }
                } catch (error) {
                  console.error("Search Failed:", searchQuery, error.message);
                }
              }

              if (!found) {
                cache[cacheKey] = {
                  lat: "",
                  lng: "",
                };
              }
            }

            lat = cache[cacheKey].lat;
            lng = cache[cacheKey].lng;

            const bedValue = row["No. of Beds in Primary Hospital"] || "";

            let beds = "";

            if (bedValue.toString().includes("10 to 20")) {
              beds = 20;
            } else if (bedValue.toString().includes("20 to 50")) {
              beds = 50;
            } else if (bedValue.toString().includes("51 to 200")) {
              beds = 200;
            } else if (
              bedValue.toString().toLowerCase().includes("more than 200")
            ) {
              beds = 250;
            }

            outputData.push({
              "Pov Type*": "DOCTOR",
              "Pov Name*": DoctorName,
              "Pov Id*": DoctorId,
              "Address*": address,
              "Lat*": lat,
              "Lng*": lng,
              "Pov City*": city,
              "Country Code": "91",
              "Pov Contact Number*": ContactNumber,
              "Secondary Contact Number": SecondaryContact,
              "Pov Email Id": EmailId,
              Specialization: SpecializationValue,
              Qualification: "",
              "Registration Id": "",
              "Pov Category": "",
              Division: "",
              "Visit Frequency": "",
              "Territory Name*": Territory,
              "Hospital Name*": hospitalName,
              "Hospital Id*": hospitalId,
            });

            this.processedRows = i + 1;

            this.progressPercentage = Math.round(
              ((i + 1) / this.totalRows) * 100,
            );
          }

          const uniqueMap = new Map();

          outputData.forEach((row) => {
            const key = `${row["Pov Name*"]}_${row["Pov Id*"]}`;

            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, row);
            } else {
              const existing = uniqueMap.get(key);

              if (
                (!existing["Lat*"] || !existing["Lng*"]) &&
                row["Lat*"] &&
                row["Lng*"]
              ) {
                uniqueMap.set(key, row);
              }
            }
          });

          const uniqueOutputData = Array.from(uniqueMap.values());
          const newSheet = XLSX.utils.json_to_sheet(uniqueOutputData, {
            header: [
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
            ],
          });
          this.processing = false;
          const newWorkbook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(newWorkbook, newSheet, "POVs");

          const excelBuffer = XLSX.write(newWorkbook, {
            bookType: "xlsx",
            type: "array",
          });

          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(blob, "POVs_With_LatLng.xlsx");
          this.progressPercentage = 100;

          alert(`Completed. Generated ${outputData.length} rows.`);
        } catch (error) {
          console.error(error);
          this.processing = false;
          alert("Error processing file");
        }
      };

      reader.readAsArrayBuffer(file);
    },

    async processPharmacistExcel() {
      if (!this.excelFile) {
        alert("Please select a file");
        return;
      }

      const file = Array.isArray(this.excelFile)
        ? this.excelFile[0]
        : this.excelFile;

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);

          const workbook = XLSX.read(data, {
            type: "array",
          });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          this.processing = true;
          this.totalRows = jsonData.length;
          this.processedRows = 0;
          this.progressPercentage = 0;

          const cache = {};
          const outputData = [];

          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];

            const PharmacistName = row["chemist_name"]?.toString().trim() || "";

            const PharmacistId = row["chemist_id"] || "";

            const CompanyName = row["chemist_name"]?.toString().trim() || "";

            const ContactNumber = row["phone_no"]?.toString().trim() || "";

            const address = row["address"]?.toString().trim() || "";

            const Pincode = row["pincode"]?.toString().trim() || "";

            const Territory = row["emp_name"] || "";

            const TokenNo = row["token_no"]?.toString().trim() || "";

            const city =
              row["node_name"]
                ?.toString()
                .trim()
                .replace(/^TM\s+/i, "") // Remove TM at the beginning
                .replace(/\(.*?\)/g, "") // Remove text inside ()
                .replace(/\bPOOL\b/gi, "") // Remove POOL
                .trim() || "";

            const cacheKey = `${CompanyName}_${address}_${city}`;

            let lat = "";
            let lng = "";

            if (!cache[cacheKey]) {
              const searches = [
                `${CompanyName}, ${address}, ${city},${Pincode} India`,
                `${CompanyName}, ${city}, India`,
                `${address}, ${city}, India`,
                `${city}, India`,
              ];

              let found = false;

              for (const searchQuery of searches) {
                try {
                  const response = await axios.get(
                    "https://photon.komoot.io/api/",
                    {
                      params: {
                        q: searchQuery,
                        limit: 10,
                      },
                      timeout: 10000,
                    },
                  );

                  if (
                    response.data?.features &&
                    response.data.features.length
                  ) {
                    const indiaResult = response.data.features.find((feature) =>
                      feature.properties?.country
                        ?.toLowerCase()
                        ?.includes("india"),
                    );

                    if (indiaResult) {
                      cache[cacheKey] = {
                        lat: indiaResult.geometry.coordinates[1],
                        lng: indiaResult.geometry.coordinates[0],
                      };

                      found = true;

                      break;
                    }
                  }
                } catch (error) {
                  console.error("Search Failed:", searchQuery, error.message);
                }
              }

              if (!found) {
                cache[cacheKey] = {
                  lat: "",
                  lng: "",
                };
              }
            }

            lat = cache[cacheKey].lat;
            lng = cache[cacheKey].lng;

            const bedValue = row["No. of Beds in Primary Hospital"] || "";

            let beds = "";

            if (bedValue.toString().includes("10 to 20")) {
              beds = 20;
            } else if (bedValue.toString().includes("20 to 50")) {
              beds = 50;
            } else if (bedValue.toString().includes("51 to 200")) {
              beds = 200;
            } else if (
              bedValue.toString().toLowerCase().includes("more than 200")
            ) {
              beds = 250;
            }

            outputData.push({
              "Token No": TokenNo,
              "Pov Type*": "PHARMACIST",
              "Pov Name*": PharmacistName,
              "Pov Id*": PharmacistId,
              "Address*": address,
              "Lat*": lat,
              "Lng*": lng,
              "Pov City*": city,
              "Country Code": "91",
              "Pov Contact Number*": ContactNumber,
              "Pov Company Name": CompanyName,
              "Primary Contact Number": "",
              "Primary Contact Designation": "",
              "Secondary Contact Person_1": "",
              "Secondary Contact Number_1": "",
              "Secondary Contact Designation_1": "",
              "Secondary Contact Person_2": "",
              "Secondary Contact Number_2": "",
              "Secondary Contact Designation_2": "",
              "Secondary Contact Person_3": "",
              "Secondary Contact Number_3": "",
              "Secondary Contact Designation_3": "",
              "Secondary Contact Number": "",
              "Total Secondary Contact Count": "",
              "Pov Email Id": "",
              Division: "",
              "Visit Frequency": "",
              "Territory Name*": Territory,
            });

            this.processedRows = i + 1;

            this.progressPercentage = Math.round(
              ((i + 1) / this.totalRows) * 100,
            );
          }

          const uniqueMap = new Map();

          outputData.forEach((row) => {
            const key = `${row["Pov Name*"]}_${row["Pov Id*"]}`;

            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, row);
            } else {
              const existing = uniqueMap.get(key);

              if (
                (!existing["Lat*"] || !existing["Lng*"]) &&
                row["Lat*"] &&
                row["Lng*"]
              ) {
                uniqueMap.set(key, row);
              }
            }
          });

          const uniqueOutputData = Array.from(uniqueMap.values()).sort((a, b) =>
            a["Token No"].localeCompare(b["Token No"], undefined, {
              numeric: true,
            }),
          );

          const finalOutput = [];

          let previousToken = null;

          uniqueOutputData.forEach((row) => {
            if (previousToken !== null && previousToken !== row["Token No"]) {
              // Blank row between token groups
              finalOutput.push({});
            }

            finalOutput.push(row);
            previousToken = row["Token No"];
          });
          const newSheet = XLSX.utils.json_to_sheet(finalOutput, {
            header: [
              "Token No",
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
              "Secondary Contact Number",
              "Total Secondary Contact Count",
              "Pov Email Id",
              "Division",
              "Visit Frequency",
              "Territory Name*",
            ],
          });
          // const newSheet = XLSX.utils.json_to_sheet(uniqueOutputData, {
          //   header: [
          //     "Pov Type*",
          //     "Pov Name*",
          //     "Pov Id*",
          //     "Address*",
          //     "Lat*",
          //     "Lng*",
          //     "Pov City*",
          //     "Country Code",
          //     "Pov Contact Number*",
          //     "Secondary Contact Number",
          //     "Pov Email Id",
          //     "Specialization",
          //     "Qualification",
          //     "Registration Id",
          //     "Pov Category",
          //     "Division",
          //     "Visit Frequency",
          //     "Territory Name*",
          //     "Hospital Name*",
          //     "Hospital Id*",
          //   ],
          // });

          this.processing = false;
          const newWorkbook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(newWorkbook, newSheet, "POVs");

          const excelBuffer = XLSX.write(newWorkbook, {
            bookType: "xlsx",
            type: "array",
          });

          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(blob, "POVs_With_LatLng.xlsx");
          this.progressPercentage = 100;

          alert(`Completed. Generated ${outputData.length} rows.`);
        } catch (error) {
          console.error(error);
          this.processing = false;
          alert("Error processing file");
        }
      };

      reader.readAsArrayBuffer(file);
    },
    DownloadExcelTemplateEmit() {
      this.DownloadExcelTemplateDialog = false;
    },
  },
};
</script>
