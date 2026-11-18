import xlsx from "json-as-xlsx";

export const DownloadExcel = {
  methods: {
    DownloadExcelMethod(excelHeader, excelData, excelFileName) {
      console.log("check Excel Header", excelHeader);
      let data = [
        {
          sheet: excelFileName,
          columns: excelHeader,
          content: excelData,
        },
      ];

      let settings = {
        fileName: excelFileName,
        extraLength: 3,
        writeMode: "writeFile",
        writeOptions: {},
        RTL: false,
      };
      xlsx(data, settings);
    },
  },
};
