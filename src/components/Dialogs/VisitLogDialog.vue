<template>
  <v-row justify="center">
    <v-dialog :model-value="VisitDialog" persistent max-width="1000">
      <v-card>
        <v-toolbar class="elevation-0" density="compact">
          <strong>More Details</strong>
          <v-spacer />
          <v-btn icon @click="VisitEmit((Toggle = 1))">
            <v-icon color="red" medium>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider class="mx-2" />

        <v-toolbar class="elevation-0">
          <strong>Visit Details : </strong>
        </v-toolbar>
        <v-divider class="mx-2" />

        <v-card-title>
          <v-row no-gutters>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize mt-n2 text-black">
                POV Name :
                <span class="font-weight-light">
                  {{ this.visitObj.pov_name }}</span
                >
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="mt-n2 FontSize text-black">
                POV Type :
                <span class="font-weight-light">{{
                  this.visitObj.pov_type
                }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="mt-n2 FontSize text-black">
                Visit Date :
                <span class="font-weight-light"
                  >{{
                    new Date(this.visitObj.pov_visited_on).toLocaleDateString()
                  }}
                </span>
              </div>
            </v-col>

            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                POV Address :
                <span class="font-weight-light"
                  >{{ this.visitObj.pov_address }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                POV Category :
                <span class="font-weight-light"
                  >{{ this.visitObj.pov_category_name }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                POV Specialization :
                <span class="font-weight-light"
                  >{{ this.visitObj.specialization_name }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Hospital :
                <span class="font-weight-light"
                  >{{ this.visitObj.hospital_name }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Comments :
                <span class="font-weight-light"
                  >{{ this.visitObj.comments }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Territory :
                <span class="font-weight-light"
                  >{{ this.visitObj.territory_names }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Territory Category:
                <span class="font-weight-light"
                  >{{ this.visitObj.territory_categories }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
        <v-toolbar class="elevation-0">
          <strong>Field Rep Details : </strong>
        </v-toolbar>
        <v-divider class="mx-2" />
        <v-card-title>
          <v-row no-gutters>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Employee :
                <span class="font-weight-light"
                  >{{ this.visitObj.user_name }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Employee-Id:
                <span class="font-weight-light"
                  >{{ this.visitObj.user_employee_id }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Manager :
                <span class="font-weight-light"
                  >{{ this.visitObj.admin_or_manager_name }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Designation :
                <span class="font-weight-light"
                  >{{ this.visitObj.designation }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div class="FontSize text-black">
                Date of joining :
                <span class="font-weight-light"
                  >{{ new Date(this.visitObj.d_o_j * 1000).toLocaleString() }}
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
    VisitDialog: Boolean,
    visitObj: Object,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    VisitEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
