<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-dialog
      :model-value="pov_conversion_dialog"
      transition="scroll-y-transition"
      persistent
      max-width="500px"
    >
      <v-card>
        <v-toolbar
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0 gradient-bg text-white"
        >
          <span class="ml-2">Pov Conversion</span>
          <v-spacer />
          <v-btn icon @click="PovConversionEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-data-table
            density="compact"
            :fixed-header="fixHeader"
            hide-default-footer
            :headers="headers"
            :items="StoreObj.items_given_list"
            class="overflow dtwidth TableClass elevation-0"
          >
            <template v-slot:[`item.product_name`]="{ item }">
              <div class="FontSize">
                {{ item.product_name }}
              </div>
            </template>
            <template v-slot:[`item.pov_conversion`]="{ item }">
              <div class="FontSize">
                {{ item.pov_conversion }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Overlay.vue";
export default {
  props: {
    StoreObj: Object,
    pov_conversion_dialog: Boolean,
    GetCurrentUserDetailsObj: Object,
  },
  components: { Overlay },
  data: () => ({
    overlay: false,
    fixHeader: true,
    Toggle: 0,
    loading: false,
    headers: [
      {
        title: "Product Name",
        align: "center",
        sortable: false,
        key: "product_name",
      },
      { title: "pov conversion", key: "pov_conversion" },
    ],
  }),
  watch: {
    pov_conversion_dialog(val) {
      if (val == true) {
        console.log("StoreObj", this.StoreObj);
      }
    },
  },
  methods: {
    PovConversionEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
<style scoped>
.gradient-btn {
  background: -webkit-linear-gradient(145deg, #0a876e 30%, #0fc566 80%);
  -webkit-text-fill-color: white;
}
.gradient-bg {
  background: -webkit-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -moz-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -o-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -ms-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
}
</style>
