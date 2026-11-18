import { ListOrganizationsDailyReport } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetOrgReports = {
  data: () => ({
    OverAllResult: [],
  }),
  methods: {
    async GetOrgReportsMethods(from_date, to_date, User_id, organization_name) {
      try {
        let result = await client.graphql({
          query: ListOrganizationsDailyReport,
          variables: {
            input: {
              organization_id: organization_name,
              user_id: User_id,
              from_date,
              to_date,
            },
          },
        });
        var ResultObj = JSON.parse(result.data.ListOrganizationsDailyReport);
        this.OverAllResult = ResultObj.data.items;
        console.log("check ResultObj", ResultObj);
      } catch (error) {
        console.log("err", error);
        this.OverAllResult = [];
      }
    },
  },
};
