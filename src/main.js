import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";
import store from "./store";
import { Amplify } from "aws-amplify";

loadFonts();

async function initApp() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID,
        userPoolClientId: process.env.VUE_APP_AWS_USER_POOL_WEB_CLIENT_ID,
        signUpVerificationMethod: "code",
        loginWith: {
          email: true,
        },
      },
    },

    API: {
      GraphQL: {
        endpoint: process.env.VUE_APP_AWS_GRAPHQL_ENDPOINT,
        region: process.env.VUE_APP_AWS_PROJECT_REGION,
        defaultAuthMode: "userPool",
      },
    },
  });
}

initApp().then(() => {
  createApp(App).use(router).use(store).use(vuetify).mount("#app");
});
