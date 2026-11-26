import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";
import store from "./store";
import { Amplify } from "aws-amplify";
import { loadConfig } from "./config";
import { purgeLegacyStorage } from "./utils/legacyStorage";

loadFonts();

async function initApp() {
  const cfg = await loadConfig();
  purgeLegacyStorage(cfg.userPoolClientId);
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: cfg.userPoolId,
        userPoolClientId: cfg.userPoolClientId,
        signUpVerificationMethod: "code",
        loginWith: {
          email: true,
        },
      },
    },

    API: {
      GraphQL: {
        endpoint: cfg.graphqlEndpoint,
        region: cfg.region,
        defaultAuthMode: "userPool",
      },
    },
  });
}

initApp().then(
  () => {
    createApp(App).use(router).use(store).use(vuetify).mount("#app");
  },
  (error) => {
    console.error(error);
    const el = document.getElementById("app");
    if (el) {
      el.textContent =
        "PharmaWRK BMS could not load its configuration. Please refresh, or contact support if this continues.";
      el.style.cssText = "font-family:system-ui,sans-serif;padding:48px 24px;text-align:center;color:#12353a";
    }
  }
);
