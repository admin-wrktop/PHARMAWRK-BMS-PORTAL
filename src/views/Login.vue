<template>
  <SignInDialog :sign_in_dialog="sign_in_dialog" @clicked="SignInDialogEmit" />
  <v-card>
    <v-toolbar color="white">
      <v-card class="elevation-0" width="130px">
        <v-img src="@/assets/logo.jpg"></v-img>
      </v-card>
      <v-divider class="ml-4" vertical></v-divider>
      <h2 class="ml-2 wnite--text">BMS</h2>
      <v-spacer />
      <v-btn
        color="primary"
        style="border-radius: 20px"
        class="mr-2"
        @click="sign_in_dialog = true"
        variant="elevated"
        >Sign In</v-btn
      >
    </v-toolbar>
    <v-img src="@/assets/login.jpg" />
  </v-card>
</template>
<script>
import SignInDialog from "@/components/Dialogs/SignInDialog.vue";
export default {
  components: {
    SignInDialog,
  },
  data: () => ({
    center: { lat: 13.080954, lng: 77.559688 },
    markers: [],
    places: [],
    tab: 0,
    CountryCodeItems: ["+91"],
    sign_in_dialog: false,
    model: 0,
    CardHeight: 0,
    MapHeight: 0,
    colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
  }),
  mounted() {
    this.CardHeight = window.innerHeight - 65;
  },
  methods: {
    SignInDialogEmit() {
      this.sign_in_dialog = false;
    },
  },
};
</script>
