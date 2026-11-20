import { ListOrganizationsDailyReport } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetOrgReports = {
  data: () => ({
    OverAllResult: [],
    ReportMessage: "",
    reportLoading: false,
    reportSeq: 0,
  }),
  methods: {
    // User_id is unused (the backend takes the caller from the token); kept for call sites.
    // eslint-disable-next-line no-unused-vars
    async GetOrgReportsMethods(from_date, to_date, User_id, organization_name) {
      if (!organization_name) return;
      const seq = ++this.reportSeq;
      this.reportLoading = true;
      this.ReportMessage = "";
      try {
        let result = await client.graphql({
          query: ListOrganizationsDailyReport,
          variables: {
            input: {
              organization_id: organization_name,
              from_date,
              to_date,
            },
          },
        });
        if (seq !== this.reportSeq) return;
        var ResultObj = JSON.parse(result.data.ListOrganizationsDailyReport);
        this.OverAllResult = (ResultObj.data && ResultObj.data.items) || [];
      } catch (error) {
        if (seq !== this.reportSeq) return;
        this.OverAllResult = [];
        this.ReportMessage =
          (error && error.errors && error.errors[0] && error.errors[0].message) || "";
      } finally {
        if (seq === this.reportSeq) this.reportLoading = false;
      }
    },
  },
};
