import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";

/**
 * PharmaWRK design system — Vuetify theme + global component defaults.
 *
 * Palette: emerald brand (AA-contrast with white text), slate neutrals.
 * Legacy colour tokens (yellowColorVariant1, blueColorVariant2, ...) are kept
 * because templates reference them by name.
 */
const legacyTokens = {
  theme: "#FFFFFF",
  accent: "#3B82F6",

  yellowColorVariant1: "#F5B82E",
  yellowColorVariant2: "#FDF0C8",
  yellowColorVariant3: "#B7860F",

  redColorVariant1: "#DC2626",
  redColorVariant2: "#F87171",
  redColorVariant3: "#B91C1C",
  redColorVariant4: "#1F2937",
  redColorVariant5: "#F4A28C",

  greenColorVariant1: "#0B3B33",
  greenColorVariant2: "#10B981",

  blueColorVariant1: "#E8ECF2",
  blueColorVariant2: "#1E1B6B",
  blueColorVariant3: "#1D4ED8",
  blueColorVariant4: "#475569",
  blueColorVariant5: "#047857",
  blueColorVariant6: "#2DD4BF",
  blueColorVariant7: "#93B4EC",

  greyColorVariant1: "#E5E7EB",
  greyColorVariant2: "#EEF0E8",
  greyColorVariant3: "#E7E2E0",
  greyColorVariant4: "#F3F4F6",
  greyColorVariant5: "#E6E8EB",
  greyColorVariant6: "#CBD5E1",

  blackVariant1: "#334155",
  blackVariant2: "#0F172A",
  blackVariant3: "#0F172A",
  blackVariant4: "#94A3B8",
  blackVariant5: "#1E293B",
};

const myCustomTheme = {
  dark: false,
  colors: {
    ...legacyTokens,
    primary: "#047857", // emerald-700 — 5.5:1 on white
    "primary-darken-1": "#065F46",
    "primary-lighten-1": "#10B981",
    secondary: "#0F2A2E", // deep teal-slate (app shell)
    error: "#DC2626",
    info: "#2563EB",
    success: "#059669",
    warning: "#D97706",
    background: "#F4F6F8",
    surface: "#FFFFFF",
    "surface-variant": "#1E293B",
    "on-surface-variant": "#F8FAFC",
    "surface-bright": "#FFFFFF",
    "surface-light": "#F1F5F9",
    "on-background": "#0F172A",
    "on-surface": "#0F172A",
  },
  variables: {
    "border-color": "#0F172A",
    "border-opacity": 0.1,
    "high-emphasis-opacity": 0.92,
    "medium-emphasis-opacity": 0.64,
    "disabled-opacity": 0.42,
    "hover-opacity": 0.05,
    "focus-opacity": 0.1,
    "activated-opacity": 0.1,
    "theme-kbd": "#1E293B",
    "theme-code": "#F1F5F9",
  },
};

const myCustomThemeDark = {
  dark: true,
  colors: {
    ...legacyTokens,
    theme: "#111827",
    primary: "#34D399",
    "primary-darken-1": "#10B981",
    "primary-lighten-1": "#6EE7B7",
    secondary: "#0B1416",
    error: "#F87171",
    info: "#60A5FA",
    success: "#34D399",
    warning: "#FBBF24",
    background: "#0B1220",
    surface: "#111A2B",
    "surface-variant": "#E2E8F0",
    "on-surface-variant": "#0F172A",
    "surface-bright": "#1A2438",
    "surface-light": "#1A2438",
    "on-background": "#E5E7EB",
    "on-surface": "#E5E7EB",
    greyColorVariant4: "#1A2438",
    greyColorVariant1: "#243047",
    blueColorVariant1: "#1A2438",
  },
  variables: {
    "border-color": "#E2E8F0",
    "border-opacity": 0.12,
    "high-emphasis-opacity": 0.92,
    "medium-emphasis-opacity": 0.66,
    "hover-opacity": 0.06,
    "focus-opacity": 0.12,
  },
};

const field = {
  rounded: "lg",
  color: "primary",
};

export default createVuetify({
  defaults: {
    global: {
      ripple: true,
    },
    VBtn: {
      rounded: "lg",
      elevation: 0,
    },
    VCard: {
      rounded: "lg",
    },
    VDialog: {
      scrollable: false,
      VCard: { rounded: "xl" },
    },
    VTextField: field,
    VTextarea: field,
    VSelect: field,
    VAutocomplete: field,
    VCombobox: field,
    VFileInput: field,
    VCheckbox: { color: "primary" },
    VCheckboxBtn: { color: "primary" },
    VRadio: { color: "primary" },
    VRadioGroup: { color: "primary" },
    VSwitch: { color: "primary", inset: true },
    VChip: { rounded: "md" },
    VAlert: { rounded: "lg", variant: "tonal" },
    VTooltip: { contentClass: "pw-tooltip" },
    VMenu: { VList: { density: "compact" } },
    VDataTable: { hover: true },
    VDataTableServer: { hover: true },
    VDataTableVirtual: { hover: true },
    VTabs: { color: "primary" },
    VProgressLinear: { color: "primary" },
    VProgressCircular: { color: "primary" },
    VSnackbar: { rounded: "lg" },
  },
  theme: {
    defaultTheme: "myCustomTheme",
    themes: {
      myCustomTheme,
      myCustomThemeDark,
    },
  },
});
