<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      :model-value="create_edit_drugtype_dialog"
      max-width="400px"
      transition="dialog-top-transition"
    >
      <v-card>
        <v-toolbar class="elevation-0" dark density="compact" color="primary">
          <v-icon
            v-text="
              StoreObj.Action == 'CREATE'
                ? 'mdi-plus'
                : StoreObj.Action == 'VIEW'
                ? 'mdi-clipboard-edit'
                : 'mdi-pencil'
            "
            small
            class="mr-2"
          ></v-icon
          ><span
            v-text="
              StoreObj.Action == 'CREATE'
                ? 'Create Drug Type'
                : StoreObj.Action == 'VIEW'
                ? 'Drug Type Details'
                : 'Edit Drug Type'
            "
          ></span>
          <v-spacer />
          <v-btn icon @click="CreateEditSpecEmit((Toggle = 1))">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4 pb-0">
          <v-form ref="form">
            <v-text-field
              outlined
              density="compact"
              label="Drug Type *"
              class="FontSize"
              :rules="[
                (v) => !!v || 'Required',
                (v) =>
                  /^(?=[a-zA-Z 0-9@._%+-]{0,100}$)[ a-z A-Z ]{0,100}$/.test(
                    v,
                  ) || 'Invalid',
              ]"
              :readonly="StoreObj.Action == 'VIEW'"
              v-model="create_edit_org.DrugType_name"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions v-if="StoreObj.Action != 'VIEW'" class="pt-0">
          <v-spacer />
          <v-btn
            small
            text
            color="primary"
            @click="CreateEditSpecEmit((Toggle = 1))"
            >Cancel</v-btn
          >
          <v-btn
            :loading="loading"
            small
            tile
            color="primary"
            @click="ValidateForm()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  createSpecialization,
  updateSpecialization,
} from "@/graphql/mutations.js";
import SnackBar from "@/components/SnackBar.vue";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    StoreObj: Object,
    create_edit_drugtype_dialog: Boolean,
  },
  components: {
    SnackBar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    SnackBarComponent: {},
    create_edit_org: {
      DrugType_name: "",
    },
  }),
  watch: {
    create_edit_drugtype_dialog(val) {
      if (val == true) {
        if (this.StoreObj.Action == "EDIT" || this.StoreObj.Action == "VIEW") {
          this.create_edit_org = {
            specialization_name: this.StoreObj.specialization_name,
          };
        }
      }
    },
  },
  methods: {
    ValidateForm() {
      if (this.$refs.form.validate()) {
        if (this.StoreObj.Action == "CREATE") {
          this.CreateSpecialization();
        } else if (this.StoreObj.Action == "EDIT") {
          this.EditSpecialization();
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Invalid inputs",
          Top: true,
        };
      }
    },
    async EditSpecialization() {
      try {
        this.loading = true;
        var inputparams = {
          specialization_name: this.create_edit_org.specialization_name,
          specialization_id: this.StoreObj.specialization_id,
        };

        let result = await client.graphql({
          query: updateSpecialization,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.UpdateSpecialization);
        if (ResultObject.status == "Success") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
          };
          this.CreateEditSpecEmit((this.Toggle = 2));
        }
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
        };
      }
    },
    async CreateSpecialization() {
      try {
        this.loading = true;
        var inputparams = {
          specialization_name: this.create_edit_org.specialization_name,
        };

        let result = await client.graphql({
          query: createSpecialization,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.CreateSpecialization);
        if (ResultObject.status == "Success") {
          this.$refs.form.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
          };
          this.CreateEditSpecEmit((this.Toggle = 2));
        }
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
        };
      }
    },
    CreateEditSpecEmit(Toggle) {
      this.$refs.form.reset();
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
<style scoped>
.FontSize {
  font-size: 12px;
}
</style>
