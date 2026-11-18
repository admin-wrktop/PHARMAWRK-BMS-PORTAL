import { OrganizationDashboard } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetOrgDashboardDetail = {
  data: () => ({
    attendance_details: {},
    visit_details: {},
    povs_details: {},
    OrgDashboardDetail: [],
  }),
  methods: {
    async GetOrgDashboardDetailsmethod(Current_Date, OrganisationId) {
      try {
        let result = await client.graphql({
          query: OrganizationDashboard,
          variables: {
            input: {
              current_date: Current_Date,
              organization_id: OrganisationId,
            },
          },
        });
        var ResultObj = JSON.parse(result.data.OrganizationDashboard);
        console.log("ResultObj", ResultObj);
        if (ResultObj.status === "SUCCESS") {
          const { attendance_details, visit_details, povs_details } =
            ResultObj.data;
          this.attendance_details = attendance_details;
          this.attendance_details.type = "USER_ATTENDANCE";
          this.visit_details = visit_details;
          this.visit_details.type = "VISIT_POV";
          this.povs_details = povs_details;
          this.povs_details.type = "POV_DETAIL";
          this.OrgDashboardDetail = [
            this.attendance_details,
            this.visit_details,
            this.povs_details,
          ];
        }
      } catch (error) {
        console.log("Err", error);
      }
    },
  },
};
