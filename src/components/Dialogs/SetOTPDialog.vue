<template>
  <div>
    <v-dialog :model-value="SetOTPDialog" persistent width="500px">
      <v-card tile>
        <v-toolbar density="compact" color="primary">
          <div>Set OTP</div>
          <v-spacer />
          <v-btn small icon dark @click.stop="SetOTPEmit(1)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div class="mt-4">
          <v-card-text>
            <v-form ref="forms">
              <v-text-field
                density="compact"
                label="Enter code"
                v-model="OTPInput"
              >
              </v-text-field>
            </v-form>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn small outlined @click.stop="SetOTPEmit(1)">Cancel</v-btn>
          <v-btn small outlined color="primary">Set</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    SetOTPDialog: Boolean,
    StoreObj: Object,
  },
  data: () => ({
    OTPInput,
  }),
  methods: {
    SetOTPEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
