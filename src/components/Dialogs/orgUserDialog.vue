<template>
  <v-row justify="center">
    <v-dialog :model-value="userDialog" persistent max-width="800">
      <v-card>
        <v-toolbar class="elevation-0" density="compact">
          <strong>More Details</strong>
          <v-spacer />
          <v-btn icon @click="CreateEditSpecEmit((Toggle = 1))">
            <v-icon color="red" medium>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title>
          <v-row no-gutters>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize mt-n2 text-black">
                Employee-Id :
                <!-- <span class="font-weight-light">
									{{ this.userObj.user_employee_id }}</span
								> -->
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="mt-n2 FontSize text-black">
                User Type :
                <span class="font-weight-light">{{
                  this.userObj.user_type
                }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="mt-n2 FontSize text-black">
                Manager :
                <span class="font-weight-light"
                  >{{ this.userObj.admin_or_manager_name }}
                </span>
              </div>
            </v-col>

            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Designation :
                <span class="font-weight-light"
                  >{{ this.userObj.designation_name }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Version :
                <span
                  v-if="this.userObj.mobile_type == 'ANDROID'"
                  class="font-weight-light"
                  >{{ this.userObj.app_version }}
                  <v-icon color="green">mdi-android</v-icon>
                </span>
                <span
                  v-if="this.userObj.mobile_type == 'IOS'"
                  class="font-weight-light"
                  >{{ this.userObj.app_version
                  }}<v-icon color="green">mdi-apple</v-icon>
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="12" sm="12" xs="12">
              <div class="FontSize text-black">
                DOJ :
                <span class="font-weight-light"
                  >{{
                    new Date(
                      this.userObj.date_of_joining * 1000
                    ).toLocaleDateString()
                  }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    userDialog: Boolean,
    userObj: Object,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    CreateEditSpecEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
