import { ListOrganizationUsers } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetOrgUsers = {
  data: () => ({
    userList: [],
  }),
  methods: {
    async getOrgorganisationUsers(organisation_id, user_status) {
      try {
        this.userList = [];
        let result = await client.graphql({
          query: ListOrganizationUsers,
          variables: {
            input: {
              organization_id: organisation_id,
              user_status: user_status,
              //   user_type: user_type,
            },
          },
        });
        console.log("result", result);
        var StoreArray = JSON.parse(result.data.ListOrganizationUsers);
        this.userList = StoreArray.data.Items;
        this.userList.unshift("ALL");
        console.log("userrrsss", this.userList);
      } catch (error) {
        this.overlay = false;
        this.NoData = error.errors[0].message;
      }
    },
  },
};
