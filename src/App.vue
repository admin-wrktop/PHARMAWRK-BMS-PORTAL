<template>
  <v-app>
    <router-view />
  </v-app>
</template>
<script>
// Vuetify base styles first so the design-system layer overrides them.
import "vuetify/styles";
import "@/styles/design-system.css";
import "@/styles/legacy-utilities.css";

export default {
  name: "App",
};
</script>
