import { ListBugReports } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetBugsReportMixin = {
  data: () => ({
    LogsItems: [],
  }),
  methods: {
    async GetBugsReportMethod(Organization_id, Month, NextToken) {
      try {
        this.TableLoading = true;
        const result = await client.graphql({
          query: ListBugReports,
          variables: {
            input: {
              organization_id: Organization_id,
              bug_month: Month,
              next_token: NextToken,
              limit: 301,
            },
          },
        });
        console.log("result", result);
        let ResultObj = JSON.parse(result.data.ListBugReports).data.items;

        if (!NextToken) {
          this.LogsItems = JSON.parse(result.data.ListBugReports).data.items;
          this.next_token = JSON.parse(
            result.data.ListBugReports
          ).data.next_token;
          console.log("First next Token", this.next_token);
        } else {
          for (
            let i = 0;
            i < JSON.parse(result.data.ListBugReports).data.items.length;
            i++
          ) {
            this.LogsItems.push({
              ...JSON.parse(result.data.ListBugReports).data.items[i],
            });
          }
          this.next_token = JSON.parse(
            result.data.ListBugReports
          ).data.next_token;
          console.log("Else next Token", this.next_token);
        }
        console.log("ResultObj", ResultObj);
        this.TableLoading = false;
        // return ResultObj;
        return this.LogsItems;
      } catch (error) {
        this.TableLoading = false;
        console.log("err", error);
      }
    },
  },
};
