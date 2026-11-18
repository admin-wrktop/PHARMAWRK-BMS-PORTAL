import { API } from "aws-amplify";
export const GetEachProjectDetails = {
  data() {
    return {
      getEachProjectDetails: {},
      overlay: false,
      project_details: {},
    };
  },
  methods: {
    async GetEachProjectDetailsMethod() {
      var self = this;
      self.getEachProjectDetails = {};
      const path = "externalbugreporting";
      const myInit = {
        body: {
          command: "getProjectDetailsByProjectDisplayID",
          project_display_id: "PHRMAWRK",
        },
        headers: {
          "x-api-key": process.env.VUE_APP_BUGTRAKR_API_KEY,
        },
      };
      await API.post("BUGTRAKR", path, myInit)
        .then((response) => {
          console.log("Check response", response);
          if (!response.errorType) {
            self.getEachProjectDetails = response.Items[0];
            console.log("Check getEachProjectDetails", self.getEachProjectDetails);
          } else {
            self.getEachProjectDetails = {};
          }
        })
        .catch(() => {
          self.getEachProjectDetails = {};
        });
      return self.getEachProjectDetails;
    },
  },
};