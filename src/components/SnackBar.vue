<template>
  <v-snackbar
    v-model="SnackBarComponent.SnackbarVmodel"
    :color="SnackBarComponent.SnackbarColor"
    location="top"
    :timeout="SnackBarComponent.timeout"
    rounded="lg"
    min-width="320"
    class="pw-snackbar"
  >
    <div class="d-flex align-center" role="status">
      <v-icon size="20" class="mr-3">{{ icon }}</v-icon>
      <span class="pw-snackbar__text">{{
        SnackBarComponent.SnackbarText
      }}</span>
    </div>
    <template #actions>
      <v-btn
        icon="mdi-close"
        size="small"
        variant="text"
        aria-label="Dismiss"
        @click="SnackBarComponent.SnackbarVmodel = false"
      />
    </template>
  </v-snackbar>
</template>
<script>
export default {
  props: {
    SnackBarComponent: Object,
  },
  data: () => ({
    timeout: 2000,
  }),
  computed: {
    icon() {
      const c = String(this.SnackBarComponent?.SnackbarColor || "").toLowerCase();
      if (c.includes("red") || c.includes("error")) return "mdi-alert-circle";
      if (c.includes("orange") || c.includes("warn")) return "mdi-alert";
      if (c.includes("green") || c.includes("success") || c.includes("primary"))
        return "mdi-check-circle";
      return "mdi-information";
    },
  },
};
</script>
<style scoped>
.pw-snackbar__text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}
</style>
