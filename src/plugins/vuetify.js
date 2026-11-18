// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const myCustomTheme = {
  dark: false,
  colors: {
    primary: "#0c9f6b",
    secondary: "#D3EDE4",
    theme: "#FFFFFF",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "myCustomTheme",
    themes: {
      myCustomTheme,
    },
  },
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
