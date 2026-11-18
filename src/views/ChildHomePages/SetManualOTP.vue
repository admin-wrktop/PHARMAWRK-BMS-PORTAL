<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <RemoveOTPDialog
      :RemoveOTPDialog="RemoveOTPDialog"
      :StoreObj="StoreObj"
      @clicked="RemoveOTPDialogEmit"
    />
    <v-row justify="center">
      <v-col cols="12" md="11" xs="12" sm="12" class="mt-1">
        <div class="font-weight-bold text-black" style="font-size: 25px">
          Set OTP
        </div>
        <v-card class="elevation-0 mt-2">
          <v-card-text class="pa-0">
            <v-form ref="form">
              <v-row justify="center">
                <v-col cols="12" md="4" xs="12" sm="12">
                  <v-select
                    density="compact"
                    variant="outlined"
                    label="Organisation *"
                    :items="ListAllOrganisation"
                    item-title="organization_name"
                    item-value="organization_id"
                    v-model="Organisationvalue"
                    class="mt-2"
                    :rules="[(v) => !!v || '']"
                    :menu-props="{ contentClass: 'SelectFontSize' }"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4" xs="12" sm="12">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    label="Phone number *"
                    max-length="6"
                    v-model="Users_Phonenumber"
                    class="mt-2"
                    :rules="[(v) => !!v || '']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3" xs="12" sm="12">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    label="Verification Code *"
                    v-model="Verification_code"
                    class="mt-2"
                    :rules="[(v) => !!v || '']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="1" xs="12" sm="12">
                  <v-btn
                    class="mt-3"
                    size="small"
                    depressed
                    :loading="loading"
                    color="primary"
                    @click.stop="validatemethod()"
                    >Add</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <!-- <v-card :height="cardHeight" class="overflow-auto">
            <v-row justify="center" class="font-weight-bold">
              <v-col cols="12" md="3" xs="12" sm="12">
                <div class="ml-3">User name</div>
              </v-col>
              <v-col cols="12" md="2" xs="12" sm="12">
                <div>Number</div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div>Organisation</div></v-col
              >

              <v-col cols="12" md="3" xs="12" sm="12"> <div>Code</div></v-col>
            </v-row>
            <v-row
              justify="center"
              class="OTPUsersSet"
              v-for="(item, index) in ListEnterdDefaultOtpUsers"
              :key="index"
            >
              <v-col cols="12" md="3" xs="12" sm="12">
                <div class="ml-3">{{ item.user_name }}</div>
              </v-col>
              <v-col cols="12" md="2" xs="12" sm="12">
                <div>{{ item.user_contact_number }}</div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div>{{ item.organization_name }}</div></v-col
              >

              <v-col cols="12" md="2" xs="12" sm="12">
                <div>{{ item.otp }}</div></v-col
              >
              <v-col cols="12" md="1" xs="1" sm="1">
                <v-btn
                  class="pt-0"
                  icon
                  size="x-small"
                  variant="flat"
                  @click.stop="RemoveUserOTPmethod(item)"
                  ><v-icon color="red">mdi-delete</v-icon></v-btn
                ></v-col
              >
            </v-row>
          </v-card> -->
          <v-data-table
            :headers="headers"
            :items="ListEnterdDefaultOtpUsers"
            :height="cardHeight"
            fixed-header
            density="compact"
            class="otp-table elevation-0 overflow-auto"
            hide-default-footer
            items-per-page="100"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                size="x-small"
                variant="text"
                @click.stop="RemoveUserOTPmethod(item)"
              >
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { GetOrganisationListss } from "@/mixins/GetOrganisationList.js";

import {
  SetDefaultOtpForUser,
  // RemoveDefaultEnteredOtpUser,
} from "@/graphql/mutations.js";
import { GetEnterdDefaultOtpUsers } from "@/mixins/ListOTPUsers.js";
import RemoveOTPDialog from "@/components/Dialogs/RemoveUsersOTP.vue";
import Snackbar from "@/components/SnackBar.vue";
import Overlay from "@/components/Overlay.vue";

import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  components: {
    RemoveOTPDialog,
    Snackbar,
    Overlay,
  },
  mixins: [GetOrganisationListss, GetEnterdDefaultOtpUsers],
  data: () => ({
    overlay: false,
    RemoveOTPDialog: false,
    Users_Phonenumber: "",
    Organisationvalue: "",
    Verification_code: "",
    SnackBarComponent: {},
    StoreObj: {},
    loading: false,
    cardHeight: 0,

    headers: [
      {
        title: "User Name",
        key: "user_name",
      },
      {
        title: "Number",
        key: "user_contact_number",
      },
      {
        title: "Organisation",
        key: "organization_name",
      },
      {
        title: "Code",
        key: "otp",
      },
      {
        title: "",
        key: "actions",
        sortable: false,
        width: "50px",
      },
    ],
  }),
  mounted() {
    this.cardHeight = window.innerHeight - 240;
    this.getOrganisationlistsMethod();
    this.getEnterdDefaultOtpUsersMethod();
  },
  methods: {
    async validatemethod() {
      const valid = await this.$refs.form.validate();
      if (valid.valid) {
        this.setOTPForUser();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Fields with * are mandatory",
        };
      }
    },
    async setOTPForUser() {
      try {
        this.loading = true;
        let inputparams = {
          organization_id: this.Organisationvalue,
          user_full_number: `+91${this.Users_Phonenumber}`,
          default_otp: this.Verification_code,
        };
        let result = await client.graphql({
          query: SetDefaultOtpForUser,
          variables: {
            input: inputparams,
          },
        });
        console.log("result", result);
        let ResultObj = JSON.parse(result.data.SetDefaultOtpForUser);
        console.log("ResultObj", ResultObj);
        if (ResultObj.status == "SUCCESS") {
          this.getEnterdDefaultOtpUsersMethod();
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "User added successfully",
          };
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log("error", error);
      }
    },

    RemoveUserOTPmethod(item) {
      this.StoreObj = item;
      this.RemoveOTPDialog = true;
    },
    RemoveOTPDialogEmit(Toggle) {
      this.RemoveOTPDialog = false;
      if (Toggle == 2) {
        this.getEnterdDefaultOtpUsersMethod();
      }
    },
  },
};
</script>

<style scoped>
.otp-table {
  box-shadow: none !important;
  border: none !important;
  background: transparent !important;
}

/* Remove all borders */
.otp-table :deep(table),
.otp-table :deep(th),
.otp-table :deep(td),
.otp-table :deep(tr) {
  border: none !important;
  box-shadow: none !important;
}

/* Header */
.otp-table :deep(thead th) {
  background: white !important;
  color: #000 !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  height: 48px !important;
  border: none !important;
}

/* Body */
.otp-table :deep(tbody td) {
  color: grey !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  height: 52px !important;
  border: none !important;
}

/* Remove hover effect */
.otp-table :deep(tbody tr:hover) {
  background: transparent !important;
}

/* Remove footer */
.otp-table :deep(.v-data-table-footer) {
  display: none !important;
}

/* Remove wrapper border */
.otp-table :deep(.v-table__wrapper) {
  border: none !important;
}
</style>
