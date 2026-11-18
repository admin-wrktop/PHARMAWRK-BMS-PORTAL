<template>
  <div class="pw-signin">
    <SnackBar :SnackBarComponent="SnackBarComponent" />

    <!-- Step 1: email -->
    <template v-if="step === 1">
      <h2 class="pw-signin__title">Sign in to BMS</h2>
      <p class="pw-signin__sub">
        Enter your work email. We'll send a one-time code to it.
      </p>
      <v-form ref="form" @submit.prevent="ValidateLoginForm">
        <v-text-field
          v-model="Login.EmailID"
          label="Work email"
          type="email"
          autocomplete="username"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="comfortable"
          autofocus
          :rules="[
            (v) => !!v || 'Email is required',
            (v) => /.+@.+\..+/.test(v) || 'Enter a valid email',
          ]"
        />
        <v-btn
          type="submit"
          block
          size="large"
          color="primary"
          variant="flat"
          class="mt-2"
          :loading="loading"
          >Send code</v-btn
        >
      </v-form>
    </template>

    <!-- Step 2: OTP -->
    <template v-else>
      <v-btn
        variant="text"
        size="small"
        prepend-icon="mdi-arrow-left"
        class="pw-signin__back"
        @click="BackToEmail()"
        >Change email</v-btn
      >
      <h2 class="pw-signin__title">Check your email</h2>
      <p class="pw-signin__sub">
        Enter the 6-digit code sent to
        <strong>{{ Login.EmailID.toLowerCase() }}</strong>
      </p>
      <v-form ref="formOTP" @submit.prevent="ValidateConfirmSignIn">
        <v-otp-input
          v-model="Login.Password"
          length="6"
          type="number"
          autofocus
          class="pw-signin__otp"
          @finish="ValidateConfirmSignIn()"
        />
        <v-btn
          type="submit"
          block
          size="large"
          color="primary"
          variant="flat"
          class="mt-4"
          :loading="loadingPassword"
          :disabled="Login.Password.length !== 6"
          >Verify and sign in</v-btn
        >
        <div class="pw-signin__resend">
          Didn't get it?
          <v-btn
            variant="text"
            size="small"
            color="primary"
            :disabled="loading"
            @click="SignIn()"
            >Resend code</v-btn
          >
        </div>
      </v-form>
    </template>
  </div>
</template>

<script>
import { signIn, confirmSignIn, signOut } from "aws-amplify/auth";
import SnackBar from "@/components/SnackBar.vue";
import { safeRedirect } from "@/router";

/**
 * BMS sign-in: Cognito custom-auth email OTP (CUSTOM_WITHOUT_SRP).
 * Flow and Amplify calls are unchanged from the former SignInDialog.
 */
export default {
  components: { SnackBar },
  data: () => ({
    step: 1,
    Login: { EmailID: "", Password: "" },
    loading: false,
    loadingPassword: false,
    SnackBarComponent: {},
  }),
  methods: {
    notify(text, color = "red") {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: color,
        timeout: 3000,
        SnackbarText: text,
      };
    },
    BackToEmail() {
      this.step = 1;
      this.Login.Password = "";
    },
    async ValidateLoginForm() {
      this.Login.EmailID = this.Login.EmailID.trim();
      const { valid } = await this.$refs.form.validate();
      if (valid) this.SignIn();
    },
    async SignIn() {
      try {
        this.loading = true;
        const user = await signIn({
          username: this.Login.EmailID,
          options: { authFlowType: "CUSTOM_WITHOUT_SRP" },
        });
        if (
          user.nextStep &&
          user.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
        ) {
          this.Login.Password = "";
          this.step = 2;
          this.notify(
            `Code sent to ${this.Login.EmailID.toLowerCase()}`,
            "success",
          );
        }
      } catch (error) {
        console.warn("Sign in failed", error);
        if (error.message === "There is already a signed in user.") {
          await signOut({ global: true });
          this.loading = false;
          return this.SignIn();
        }
        this.notify(
          String(error).includes("NOT_AUTHORIZED")
            ? "No BMS account found for this email"
            : error.message,
        );
      } finally {
        this.loading = false;
      }
    },
    async ValidateConfirmSignIn() {
      if (this.loadingPassword) return;
      if (this.Login.Password.length !== 6) {
        this.notify("Enter the 6-digit code");
        return;
      }
      try {
        this.loadingPassword = true;
        const res = await confirmSignIn({
          challengeResponse: this.Login.Password,
        });
        if (res && res.isSignedIn === false) {
          this.Login.Password = "";
          this.notify("Incorrect code. Try again.");
          return;
        }
        localStorage.setItem("IsLoggedOut", "false");
        this.$store.commit("SET_USEREMAIL", this.Login.EmailID);
        this.$router.replace(
          safeRedirect(this.$route.query.redirect) || "/Dashboard",
        );
      } catch (error) {
        this.Login.Password = "";
        this.notify(error.message);
      } finally {
        this.loadingPassword = false;
      }
    },
  },
};
</script>

<style scoped>
.pw-signin {
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--pw-border);
  border-radius: var(--pw-radius-lg);
  box-shadow: var(--pw-shadow-md);
  padding: 32px 32px 28px;
}
.pw-signin__title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
}
.pw-signin__sub {
  font-size: 14px;
  color: var(--pw-muted);
  margin: 0 0 22px;
  line-height: 1.5;
}
.pw-signin__sub strong {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
}
.pw-signin__back {
  margin: -8px 0 12px -10px;
}
.pw-signin__otp {
  padding: 0;
}
.pw-signin__resend {
  margin-top: 14px;
  text-align: center;
  font-size: 13px;
  color: var(--pw-muted);
}
@media (max-width: 480px) {
  .pw-signin {
    padding: 24px 20px;
  }
}
</style>
