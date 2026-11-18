<template>
  <v-dialog :model-value="DetailedErrorDialog" max-width="700" persistent>
    
    <v-card rounded="lg">
      <v-toolbar density="compact" color="error">
        <v-icon class="mx-2" size="small">mdi-alert-circle</v-icon>
        <span class="text-subtitle-1 font-weight-medium">
          Error Details
          <span class="text-caption"
            >({{ ErrorText.display_bug_id }})</span
          ></span
        >
        <v-spacer />
        <v-btn icon variant="text" @click="detailedErrorDialogEmit()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <div class="error-box">
          {{ ErrorText.detailed_error }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red"
          variant="outlined"
          class="ma-2"
          size="small"
          @click="detailedErrorDialogEmit()"
        >
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    DetailedErrorDialog: Boolean,
    ErrorText: Object,
  },
  methods: {
    detailedErrorDialogEmit() {
      this.$emit("clicked");
    },
  },
};
</script>

<style scoped>
.error-box {
  max-height: 320px;
  overflow-y: auto;
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap; /* preserves line breaks */
}
</style>
