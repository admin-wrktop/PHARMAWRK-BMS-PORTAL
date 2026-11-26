<template>
  <v-app>
    <ReleaseNotesBanner />
    <router-view />
  </v-app>
</template>
<script>
// Vuetify base styles first so the design-system layer overrides them.
import "vuetify/styles";
import "@/styles/design-system.css";
import "@/styles/legacy-utilities.css";
import ReleaseNotesBanner from "@/components/Extras/ReleaseNotesBanner.vue";

export default {
  name: "App",
  components: { ReleaseNotesBanner },
};
</script>
