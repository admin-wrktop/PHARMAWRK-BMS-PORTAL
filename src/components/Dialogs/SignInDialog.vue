<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      :model-value="sign_in_dialog"
      max-width="400px"
      persistent
      transition="dialog-top-transition"
    >
      <v-card class="elevation-0">
        <v-toolbar density="compact" class="elevation-0" dark color="primary">
          <v-toolbar-title class="font-weight-light">{{
            currentTitle
          }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="SignInDialogEmit()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div class="pt-4" align="center" justify="center">
          <v-img max-width="175px" src="@/assets/logo.jpg"></v-img>
        </div>
        <v-card-text>
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card-text>
                <v-form
                  ref="form"
                  lazy-validation
                  @submit.prevent="ValidateLoginForm"
                >
                  <v-text-field
                    density="compact"
                    label="Email ID *"
                    class="FontSize"
                    autocomplete="off"
                    prepend-inner-icon="mdi-account"
                    :rules="[
                      (v) => !!v || 'Required',
                      (v) => /.+@.+/.test(v) || 'Email must be valid',
                    ]"
                    variant="underlined"
                    v-model="Login.EmailID"
                  ></v-text-field>
                  <!-- <v-text-field
                    autocomplete="off"
                    label="Password *"
                    class="FontSize"
                    :type="isPwd ? 'text' : 'password'"
                    @click:append="isPwd = !isPwd"
                    required
                    :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-inner-icon="mdi-lock"
                    :rules="[(v) => !!v || 'Password is required']"
                    v-model="Login.Password"
                  ></v-text-field> -->
                </v-form>
              </v-card-text>
              <!-- <v-card-actions class="py-0">
                <v-checkbox
                  density="compact"
                  class="my-0 ml-2"
                  v-model="rememberme"
                  label="Remember Me"
                  :disabled="Login.EmailID == '' || Login.Password === ''"
                />
                <v-spacer/>
                <v-btn
                  x-small
                  text
                  class="FontSize mb-4"
                  color="primary"
                  @click="step = 3"
                  >Forgot Password ?</v-btn
                >
              </v-card-actions> -->
              <v-card-actions class="pt-0 pb-8 px-4">
                <v-btn
                  block
                  :loading="loading"
                  tile
                  variant="elevated"
                  color="primary"
                  @click="ValidateLoginForm()"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-window-item>
            <v-window-item :value="2">
              <!-- <v-card-text>
                <v-form ref="formCP" lazy-validation>
                  <v-text-field
                    class="BorderRadius FontSize"
                    density="compact"
                    autocomplete="off"
                    label="Enter New Password *"
                    :type="isPwdNew ? 'text' : 'password'"
                    @click:append="isPwdNew = !isPwdNew"
                    required
                    :append-icon="isPwdNew ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-inner-icon="mdi-lock"
                    :rules="[(v) => !!v || 'Password is required']"
                    v-model="Password.NewPassword"
                  ></v-text-field>
                  <v-text-field
                    class="BorderRadius FontSize"
                    density="compact"
                    autocomplete="off"
                    label="Confirm New Password *"
                    :type="isPwdConfirm ? 'text' : 'password'"
                    @click:append="isPwdConfirm = !isPwdConfirm"
                    required
                    :append-icon="isPwdConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-inner-icon="mdi-lock"
                    :rules="[(v) => !!v || 'Password is required']"
                    v-model="Password.ConfirmPassword"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="pt-0 pb-8 px-4">
                <v-btn
                  block
                  :loading="loading"
                  tile
                  color="primary"
                  @click="ValidateConfirmPasswordForm()"
                  >Login</v-btn
                >
              </v-card-actions> -->
              <v-form ref="formOTP" lazy-validation>
                <div class="py-2">Enter OTP *</div>
                <v-otp-input
                  density="compact"
                  label=""
                  length="6"
                  :rules="[(v) => !!v || 'Password is required']"
                  @keydown.enter="ValidateConfirmSignIn()"
                  v-model="Login.Password"
                >
                </v-otp-input>
              </v-form>
              <v-card-actions class="pa-0 pb-10 pt-4">
                <v-btn
                  block
                  :loading="loadingPassword"
                  tile
                  color="primary"
                  variant="elevated"
                  @click="ValidateConfirmSignIn()"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-window-item>
            <v-window-item :value="3">
              <v-card-text>
                <!-- <v-form ref="formOTP"> -->
                <div class="text-center" style="color: #0c9f6b">
                  Please Enter The Registered Email
                </div>
                <v-text-field
                  label="Email"
                  variant="outlined"
                  autocomplete="off"
                  v-model="OTPEmail"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) => /.+@.+/.test(v) || 'Email must be valid',
                  ]"
                  class="mt-4 FontSize"
                >
                </v-text-field>
                <div class="FontSize text-center" style="color: #0c9f6b">
                  *Please enter the e-mail used for login/registration
                </div>
                <!-- </v-form> -->
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" small @click="step = 1"
                  >Back To Sign In</v-btn
                >
                <v-spacer />
                <v-btn text color="primary" small @click="ValidateOTP()"
                  >Next</v-btn
                >
              </v-card-actions>
            </v-window-item>
            <v-window-item :value="4">
              <v-card-text>
                <v-form ref="formConfirmOTP">
                  <div class="text-center" style="color: #0c9f6b">
                    Enter the Activation Code
                  </div>
                  <v-text-field
                    label="Code *"
                    autocomplete="off"
                    v-model="ConfirmOTP"
                    :rules="[(v) => !!v || 'Code is required']"
                    class="mt-4 FontSize"
                  >
                  </v-text-field>
                  <v-text-field
                    autocomplete="off"
                    label="Enter New Password *"
                    v-model="ConfirmNewPassword"
                    :rules="[(v) => !!v || 'Password is required']"
                    class="mt-4 FontSize"
                    :type="isPwdConfirmCode ? 'text' : 'password'"
                    @click:append="isPwdConfirmCode = !isPwdConfirmCode"
                    required
                    :append-icon="isPwdConfirmCode ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-inner-icon="mdi-lock"
                  >
                  </v-text-field>
                  <div class="FontSize text-center" style="color: #0c9f6b">
                    Enter the Activation Code sent to your registered Email.
                  </div>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" small @click="step = 1"
                  >Back To Sign In</v-btn
                >
                <v-spacer />
                <v-btn text color="primary" small @click="ValidateEnteredOTP()"
                  >Next</v-btn
                >
              </v-card-actions>
            </v-window-item>
            <!--              
              
               -->
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { Auth } from "aws-amplify";
import { signIn, confirmSignIn, signOut } from "aws-amplify/auth";
import SnackBar from "@/components/SnackBar.vue";
export default {
  props: {
    sign_in_dialog: Boolean,
  },
  components: {
    SnackBar,
  },
  data: () => ({
    step: 1,
    Login: {
      EmailID: "",
      Password: "",
    },
    ConfirmOTP: "",
    ConfirmNewPassword: "",
    OTPEmail: "",
    isPwdNew: false,
    isPwdConfirm: false,
    isPwdConfirmCode: false,
    loadingPassword: false,
    Password: {
      NewPassword: "",
      ConfirmPassword: "",
    },
    isPwd: false,
    loading: false,
    rememberme: false,
    SnackBarComponent: {},
  }),
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Sign In-BMS";
        case 2:
          return "Validate OTP";
        case 3:
          return "Forgot Password ?";
        case 4:
          return "Forgot Password ?";
        case 5:
          return "Sign Up";
        default:
          return "Account created";
      }
    },
  },
  watch: {
    rememberme(val) {
      if (val == true) {
        localStorage.setItem("currentuseremail", JSON.stringify(this.Login));
        // console.warn("After Setting Item");
      } else if (val == false) {
        delete localStorage.currentuseremail;
      }
    },
  },
  mounted() {
    this.CheckRememberMe();
  },
  methods: {
    CheckRememberMe() {
      if (localStorage.getItem("currentuseremail") != null) {
        this.Login = JSON.parse(localStorage.getItem("currentuseremail"));
        this.rememberme = true;
      }
    },
    ConfirmOTPMethod() {
      Auth.forgotPasswordSubmit(
        this.OTPEmail,
        this.ConfirmOTP,
        this.ConfirmNewPassword
      )
        .then(() => {
          this.$refs.formConfirmOTP.reset();
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "Password Changed Successfully",
          };
          this.step = 1;
        })
        .catch((err) => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: err.message,
          };
        });
    },
    ValidateEnteredOTP() {
      (this.OTPEmail = this.OTPEmail.trim()),
        (this.ConfirmOTP = this.ConfirmOTP.trim()),
        (this.ConfirmNewPassword = this.ConfirmNewPassword.trim());
      if (this.$refs.formConfirmOTP.validate()) {
        this.ConfirmOTPMethod();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Please Enter The Code Sent To Registered Email",
        };
      }
    },
    ValidateOTP() {
      this.OTPEmail = this.OTPEmail.trim();
      if (this.$refs.formOTP.validate()) {
        if (this.OTPEmail != "" && this.OTPEmail != null) {
          this.SendOTPEmail();
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Please Enter Registered Email",
        };
      }
    },
    SendOTPEmail() {
      Auth.forgotPassword(this.OTPEmail)
        .then(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "OTP Sent To Registered Email",
          };
          this.step = 4;
        })
        .catch((err) => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: err.message,
          };
        });
    },
    async ConfirmPassword() {
      try {
        this.loading = true;
        const result = await Auth.completeNewPassword(
          this.user,
          this.Password.ConfirmPassword
        )
          .then((user) => {
            return user;
          })
          .catch((e) => {
            return e;
          });
        if (result.username) {
          this.$refs.formCP.reset();
          this.loading = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "Login Successful",
          };
          this.ActivateMethod();
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: error.message,
        };
      }
    },
    ValidateConfirmPasswordForm() {
      this.Password.NewPassword = this.Password.NewPassword.trim();
      this.Password.ConfirmPassword = this.Password.ConfirmPassword.trim();
      if (this.$refs.formCP.validate()) {
        if (
          this.Password.NewPassword != "" &&
          this.Password.NewPassword != null &&
          this.Password.ConfirmPassword != "" &&
          this.Password.ConfirmPassword != null
        ) {
          if (this.Password.NewPassword == this.Password.ConfirmPassword) {
            this.ConfirmPassword();
          } else {
            this.$refs.form.reset();
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Password does not match",
            };
          }
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Fields marked with asterisks (*) are mandatory",
        };
      }
    },
    ValidateLoginForm() {
      this.Login.EmailID = this.Login.EmailID.trim();
      // (this.Login.Password = this.Login.Password.trim());
      if (this.$refs.form.validate()) {
        if (
          this.Login.EmailID != "" &&
          this.Login.EmailID != null
          // &&
          // this.Login.Password != "" &&
          // this.Login.Password != null
        ) {
          this.SignIn();
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Fields marked with asterisks (*) are mandatory",
        };
      }
    },
    async SignIn() {
      try {
        this.loading = true;
        // this.user = await Auth.signIn(this.Login.EmailID);
        this.user = await signIn({
          username: this.Login.EmailID,
          options: {
            authFlowType: "CUSTOM_WITHOUT_SRP",
          },
        });
        if (
          this.user.nextStep.signInStep ==
          "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
        ) {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            timeout: 2000,
            SnackbarText: `Verification OTP sent to ${this.Login.EmailID.toLocaleLowerCase()}`,
          };
          this.step = 2;
          this.$forceUpdate();
        }
        // this.$store.commit("SET_USEREMAIL", this.Login.EmailID);
        if (this.user.challengeName === "CUSTOM_CHALLENGE") {
          this.Login.Password = "";
          this.step = 2;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "OTP Sent Successfully!!",
          };
        }
        this.loading = false;
      } catch (error) {
        console.log("error", error);
        this.loading = false;
        if (error.message == "There is already a signed in user.") {
          this.loginLoader = true;
          await signOut({ global: true });
          this.SignIn();
        } else if (
          error ==
          "UserLambdaValidationException: DefineAuthChallenge failed with error Error: NOT_AUTHORIZED : Kindly Sigup."
        ) {
          this.loginLoader = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            timeout: 2000,
            SnackbarText: "User not found",
          };
        } else {
          this.loginLoader = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            timeout: 2000,
            SnackbarText: error.message,
          };
        }
      }
    },
    ValidateConfirmSignIn() {
      if (this.$refs.formOTP.validate()) {
        this.confirmOTP();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Fields marked with asterisks (*) are mandatory",
        };
      }
    },
    async confirmOTP() {
      try {
        this.loadingPassword = true;
        // await Auth.sendCustomChallengeAnswer(
        //   this.user,
        //   this.Login.Password
        // ).then((res) => {
        //   console.log("Check The Result", res);
        //   if (res.attributes.email_verified == undefined) {
        //     this.loadingPassword = false;
        //     console.log("AAAAAAAAAAAAAAAAa");
        //     this.SnackBarComponent = {
        //       SnackbarVmodel: true,
        //       SnackbarColor: "red",
        //       Top: true,
        //       SnackbarText: "Invalid OTP Entered",
        //     };
        //   } else {
        //     this.ActivateMethod();
        //     this.loadingPassword = false;
        //   }
        // });

        await confirmSignIn({ challengeResponse: this.Login.Password })
          .then((res) => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              SnackbarText: "Login Successfull",
            };
            console.log("yes");
            this.IsOTPFieldEnabled = false;
            this.IsSessionLoggedOut = false;
            localStorage.setItem("IsLoggedOut", "false");
            this.loginLoader = false;
            this.ActivateMethod();
          })
          .catch((err) => {
            if (err) {
              this.counter = 0;
              this.Login.otp = "";
            }
            this.SnackBarComponent.SnackbarVmodel = false;
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              SnackbarText: err.message,
            };
            this.OTPErrorMessage = err.message;
            this.loginLoader = false;
          });

        console.log("HellllllllllllllllllllllErro");
      } catch (error) {
        console.log("errorrrrrrrrrrrrrrrrrrrrrr", error);
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: error.message,
        };
        this.loadingPassword = false;
      }
    },
    // async SignIn() {
    //   try {
    //     this.overlay = true;
    //     this.loading = true;
    //     const user = await Auth.signIn(this.Login.EmailID, this.Login.Password);
    //     this.user = user;
    //     if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
    //       this.step = 2;
    //       this.loading = false;
    //       this.$store.commit("SET_USEREMAIL", this.Login.EmailID);
    //       var LoginFirstTimeLoginStatus = true;
    //       this.$store.commit("SET_LOGIN_STATUS", LoginFirstTimeLoginStatus);
    //     } else {
    //       LoginFirstTimeLoginStatus = false;
    //       this.$store.commit("SET_LOGIN_STATUS", LoginFirstTimeLoginStatus);
    //       this.$store.commit("SET_USEREMAIL", this.Login.EmailID);
    //       this.SnackBarComponent = {
    //         SnackbarVmodel: true,
    //         SnackbarColor: "primary",
    //         Top: true,
    //         SnackbarText: "Login Successful",
    //       };
    //       this.ActivateMethod();
    //     }
    //   } catch (error) {
    //     this.overlay = false;
    //     this.loading = false;
    //     this.SnackBarComponent = {
    //       SnackbarVmodel: true,
    //       SnackbarColor: "red",
    //       Top: true,
    //       SnackbarText: error.message,
    //     };
    //   }
    // },
    ActivateMethod() {
      this.$store.commit("SET_USEREMAIL", this.Login.EmailID);
      setTimeout(() => this.$router.push("/Dashboard"), 500);
      this.overlay = false;
    },
    SignInDialogEmit() {
      this.$emit("clicked");
    },
  },
};
</script>
