import { ListEnterdDefaultOtpUsers } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetEnterdDefaultOtpUsers = {
  data: () => ({
    ListEnterdDefaultOtpUsers: [],
  }),
  methods: {
    async getEnterdDefaultOtpUsersMethod() {
      try {
        this.overlay = true;
        let result = await client.graphql({
          query: ListEnterdDefaultOtpUsers,
          variables: {
            input: {},
          },
        });
        var ResultObj = JSON.parse(result.data.ListEnterdDefaultOtpUsers).data
          .items;
        this.ListEnterdDefaultOtpUsers = ResultObj;
        console.log("ListEnterdDefaultOtpUsers", ResultObj);

        console.log("check ResultObj", ResultObj);
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        console.log("err", error);
      }
    },
  },
};
