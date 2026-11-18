import { ListOrganizations } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetOrganisationListss = {
  data: () => ({
    ListAllOrganisation: [],
  }),
  methods: {
    async getOrganisationlistsMethod() {
      try {
        let result = await client.graphql({
          query: ListOrganizations,
          variables: {
            input: {},
          },
        });
        var ResultObj = JSON.parse(result.data.ListOrganizations).data.Items;
        this.ListAllOrganisation = ResultObj.filter((item) => {
          return item.organization_status == "ACTIVE";
        });
        console.log("check ResultObj", this.ListAllOrganisation);
        return this.ListAllOrganisation;
      } catch (error) {
        console.log("err", error);
      }
    },
  },
};
