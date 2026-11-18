<template>
  <v-card class="elevation-0">
    <Overlay :overlay="overlay" />
    <CreateDrugType
      :StoreObj="StoreObj"
      :create_edit_drugtype_dialog="create_edit_drugtype_dialog"
      @clicked="CreateEditOrgEmit"
    />
    <WarningDialog
      :DialogWarning="DialogWarning"
      :StoreObj="StoreObj"
      @clicked="WarningEmit"
    />
    <v-row no-gutters>
      <!-- <v-col cols="12" sm="12" md="6" xs="12" class="mt-4"> </v-col> -->
      <v-col cols="12" sm="12" md="4" xs="12" class="mt-4">
        <v-toolbar density="compact" class="elevation-0">
          <!-- <v-spacer/> -->
          <!-- <v-select
            density="compact"
            outlined
            label="Search"
            class="mt-4 mr-2"
            style="font-size: 12px; max-width: 160px"
            v-model="specialization_status"
            :items="StatusItems"
          ></v-select> -->
          <v-text-field
            density="compact"
            outlined
            label="Search"
            class="mt-4 MaxWidth"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
          <v-btn
            class="mb-3 ml-4"
            color="primary"
            @click="create_edit_drugtype_dialog = true"
            v-on:click="StoreObj.Action = 'CREATE'"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-toolbar>
      </v-col>
      <v-col cols="12" sm="12" md="12" xs="12">
        <!-- :items="filterarray" 
          :page.sync="page"-->
        <v-data-table
          density="compact"
          :search="search"
          :headers="headers"
          @click:row="handleRowClick"
          :items-per-page="50"
          hide-default-footer
          class="elevation-0 TableClass"
          :no-data-text="NoData"
          @page-count="pageCount = $event"
        >
          <!-- @update:pagination="get_user_pagination" -->
          <!-- :items="filterarray.length > 0 ? filterarray : items" -->
          <template v-slot:[`item.specialization_name`]="{ item }">
            <div
              v-if="
                item.specialization_name != undefined &&
                item.specialization_name != null &&
                item.specialization_name != ''
              "
              class="FontSize"
            >
              <v-icon small color="primary" class="mr-2"
                >mdi-clipboard-edit</v-icon
              >
              {{ item.specialization_name }}
            </div>
            <div v-else class="FontSize">-</div>
          </template>
          <template v-slot:[`item.organization_contact_email_id`]="{ item }">
            <div
              v-if="
                item.organization_contact_email_id != undefined &&
                item.organization_contact_email_id != null &&
                item.organization_contact_email_id != ''
              "
              class="FontSize"
            >
              {{ item.organization_contact_email_id }}
            </div>
            <div v-else class="FontSize">-</div>
          </template>
          <template v-slot:[`item.organization_created_on`]="{ item }">
            <div
              v-if="
                item.organization_created_on != undefined &&
                item.organization_created_on != null &&
                item.organization_created_on != ''
              "
              class="FontSize"
            >
              {{ item.organization_created_on }}
            </div>
            <div v-else class="FontSize">-</div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-icon
              small
              v-if="item.specialization_status == 'ACTIVE'"
              color="green"
              class="mr-2"
              @click.stop="CheckEachItem(item, 'EDIT')"
              >mdi-pencil</v-icon
            >
            <v-icon
              v-if="item.specialization_status == 'INACTIVE'"
              small
              color="green"
              @click.stop="CheckEachItem(item, 'ACTIVATE')"
              >mdi-check</v-icon
            >
            <v-icon
              v-if="item.specialization_status == 'ACTIVE'"
              small
              color="red"
              @click.stop="CheckEachItem(item, 'DEACTIVATE')"
              >mdi-close</v-icon
            >
          </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import WarningDialog from "@/components/Dialogs/WarningDialog.vue";
import CreateDrugType from "@/components/Dialogs/CreateDrugType.vue";
import Overlay from "@/components/Overlay.vue";
import { listSpecializations } from "@/graphql/queries.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  components: {
    Overlay,
    WarningDialog,
    CreateDrugType,
  },
  props: {
    GetCurrentUserDetailsObj: Object,
  },
  data: () => ({
    page: 1,
    NoData: "",
    StoreObj: {},
    pageCount: 0,
    search: null,
    overlay: true,
    filterarray: [],
    DialogWarning: false,
    StatusItems: ["ACTIVE", "INACTIVE"],
    specialization_status: "ACTIVE",
    create_edit_drugtype_dialog: false,
    SpecializationList: [],
    nextTokenValue: "",
    items: [],
    getNextTokenValues: [],
    headers: [
      { text: "Name", value: "specialization_name" },
      { text: "Actions", value: "Actions" },
    ],
  }),
  watch: {
    specialization_status() {
      this.filterarray = [];
      this.filterarray = this.SpecializationList.filter(
        (org) => org.specialization_status == this.specialization_status,
      );
      if (this.filterarray.length == 0) {
        this.NoData = "No Specialization Found";
      }
    },
  },
  mounted() {
    this.getSpecializationLists();
  },
  methods: {
    WarningEmit(Toggle) {
      this.StoreObj = {};
      this.DialogWarning = false;
      if (Toggle == 2) {
        this.getSpecializationLists();
      }
    },
    CreateEditOrgEmit(Toggle) {
      this.StoreObj = {};
      this.create_edit_drugtype_dialog = false;
      if (Toggle == 2) {
        this.getSpecializationLists();
      }
    },
    CheckEachItem(item, Action) {
      this.StoreObj = item;
      this.StoreObj.Action = Action;
      if (Action == "EDIT") {
        this.create_edit_drugtype_dialog = true;
      }
      if (Action == "ACTIVATE" || Action == "DEACTIVATE") {
        this.DialogWarning = true;
      }
    },
    handleRowClick(event, item) {
      this.StoreObj = item.item;
      this.StoreObj.Action = "VIEW";
      this.create_edit_drugtype_dialog = true;
    },

    async getSpecializationLists() {
      try {
        this.overlay = true;
        this.SpecializationList = [];

        let result = await client.graphql({
          query: listSpecializations,
          variables: {
            // specialization_status: "ACTIVE",
            next_token: null,
          },
        });
        var StoreArray = JSON.parse(result.data.listSpecializations);
        this.SpecializationList = StoreArray.data.Items;
        // this.nextTokenValue = StoreArray.data.next_token;
        // if (StoreArray.data.next_token != null) {
        //   this.get_user_pagination();
        // }
        // if (this.SpecializationList.length > 0) {
        //   this.filterarray = StoreArray.data.Items;
        //   this.nextTokenValue = StoreArray.data.next_token;
        // } else {
        //   this.filterarray = [];
        // }

        this.filterarray = [];
        this.filterarray = this.SpecializationList.filter(
          (org) => org.specialization_status == this.specialization_status,
        );
        if (this.filterarray.length == 0) {
          this.NoData = "No Specialization Found";
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        console.log(error, "error");
        this.NoData = error.errors[0].message;
      }
    },

    // async get_user_pagination() {
    //   if (this.nextTokenValue) {
    //     this.filterarray = [];
    //     try {
    //       this.overlay = true;

    //       let result = await API.graphql(
    //         graphqlOperation(listSpecializations, {
    //           limit: 100,
    //           next_token: this.nextTokenValue,
    //         })
    //       );

    //       var StoreArrayPage = JSON.parse(result.data.listSpecializations);
    //       this.SpecializationListPage = StoreArrayPage.data.Items;
    //       this.nextTokenValuePage = StoreArrayPage.data.next_token;
    //       if (this.SpecializationListPage.length >= 0) {
    //         var storeitemsValue = this.SpecializationListPage;
    //         this.filterarray.push(...storeitemsValue);
    //         this.$forceUpdate();
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // },

    /////////
  },
};
</script>
