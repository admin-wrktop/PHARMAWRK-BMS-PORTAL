<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-dialog
      :model-value="pov_conversion_dialog1"
      transition="scroll-y-transition"
      persistent
      max-width="750px"
    >
      <v-card>
        <v-toolbar
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          Attachment
          <v-spacer />

          <v-tooltip color="primary" activator="parent" location="bottom">
            <template v-slot:activator="{}">
              <v-icon color="white" @click="downloadPDFs()"
                >mdi-download</v-icon
              >
            </template>
            <span class="text-white">Download Image</span>
          </v-tooltip>

          <v-btn icon @click="PovConversionEmit1((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-2">
          <v-carousel
            v-model="model_c"
            height="400"
            :interval="TimerInterval"
            :cycle="true"
          >
            <v-sheet
              tile
              v-for="(item, i) in StoreObj.visit_attachments"
              :key="i"
            >
              <v-carousel-item>
                <v-img class="carousel-image" :src="item"></v-img>
              </v-carousel-item>
            </v-sheet>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
// import moment from "moment";
import Overlay from "@/components/Overlay.vue";
export default {
  props: {
    StoreObj: Object,
    pov_conversion_dialog1: Boolean,
    GetCurrentUserDetailsObj: Object,
  },
  components: { Overlay },
  data: () => ({
    overlay: false,
    fixHeader: true,
    Toggle: 0,
    loading: false,
    model_c: -1,
    TimerInterval: 0,
  }),
  watch: {
    pov_conversion_dialog1(val) {
      if (val == true) {
        console.log("StoreObj11111111111", this.StoreObj);
      }
    },
  },
  methods: {
    PovConversionEmit1(Toggle) {
      this.$emit("clicked", Toggle);
    },

    downloadPDFs() {
      console.log("storee", this.StoreObj);
      let PdfURLS = this.StoreObj.visit_attachments;
      PdfURLS.forEach((itm) => {
        this.downloadForm(itm);
      });
    },

    downloadForm(item) {
      window.open(item);
      console.log("item", item);
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

.carousel-image {
  height: 100%;
  width: auto; /* To maintain the aspect ratio */
}
</style>
