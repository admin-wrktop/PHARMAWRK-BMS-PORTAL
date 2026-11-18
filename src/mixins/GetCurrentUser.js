import { GetCurrentUserDetails } from "@/graphql/queries.js";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export const GetCurrentUser = {
  data() {
    return {
      GetCurrentUserDetailsObj: {},
      overlay: false,
    };
  },
  methods: {
    async GetCurrentUser() {
      try {
        this.overlay = true;
        this.GetCurrentUserDetailsObj = {};

        let result = await client.graphql({
          query: GetCurrentUserDetails,
          variables: {
            input: {
              user_email_id: this.$store.getters.get_user_email,
            },
          },
        });
        console.log("result", result);
        var StoreArray = JSON.parse(result.data.GetCurrentUserDetails);
        console.log("getusersmixins", StoreArray);
        this.GetCurrentUserDetailsObj = StoreArray.data.Items[0];
        this.$store.commit(
          "SET_CURRENTUSER_DETAILS",
          this.GetCurrentUserDetailsObj,
        );

        this.overlay = false;
      } catch (error) {
        // this.$router.push("/");
        this.overlay = false;
        console.warn("Error in get current user", error);
      }
    },
  },
};
