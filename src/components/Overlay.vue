<template>
  <v-overlay :model-value="overlay" class="align-center justify-center">
    <v-progress-circular size="130" color="primary" indeterminate :value="60">
      <v-img src="@/assets/WRKTOP_logo.png" width="70px"></v-img
    ></v-progress-circular>
  </v-overlay>
</template>
<script>
export default {
  props: {
    overlay: Boolean,
  },
};
</script>
