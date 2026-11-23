import { errorMessage } from "@/utils/errorMessage.js";
import { ListAllDesignation } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const GetOrgDesignations = {
  data: () => ({
    DesignationList: [],
  }),
  methods: {
    async getOrgorganisationDesignations(organisation_id) {
      try {
        this.overlay = true;
        let result = await client.graphql({
          query: ListAllDesignation,
          variables: {
            input: { organization_id: organisation_id },
          },
        });
        var StoreArray = JSON.parse(result.data.ListAllDesignation);
        this.DesignationList = StoreArray.data.items;
        console.log("result", this.DesignationList);
        this.DesignationList.unshift("ALL");
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = errorMessage(error);
      }
    },
  },
};
