/**
 * BMS navigation — single source of truth for the side menu, page titles
 * and page descriptions. Route names must match src/router/index.js.
 */

const I = (text, icon, link) => ({ type: "item", text, icon, link });
const H = (text) => ({ type: "header", text, key: `h:${text}` });

export const NAV_ITEMS = [
  I("Dashboard", "mdi-view-grid-outline", "Dashboard"),

  H("Customers"),
  I("Organizations", "mdi-domain", "Organization"),
  I("Device Management", "mdi-cellphone-cog", "Device"),
  I("API Keys", "mdi-key-outline", "Api Key"),
  I("User OTPs", "mdi-lock-reset", "Set Users OTP"),
  I("Data Templates", "mdi-database-import-outline", "Upload Templates"),
  I("Notifications", "mdi-bell-outline", "Notification"),

  H("Activity"),
  I("Visit Log", "mdi-map-marker-outline", "Visit Log"),
  I("Audit Log", "mdi-text-box-search-outline", "Audit Log"),
  I("Bug Reports", "mdi-bug-outline", "BugReport"),
];

export const PAGE_DESCRIPTIONS = {
  Dashboard: "Platform-wide usage across all customer organizations.",
  Organization:
    "Create and manage customer organizations, their modules and users.",
  Device: "Devices registered to customer organizations.",
  "Api Key": "Mobile API keys issued to each organization and their expiry.",
  "Set Users OTP": "Set or remove fixed sign-in OTPs for users.",
  "Upload Templates": "Excel templates for bulk data uploads.",
  "Visit Log": "Field visits logged by reps, by organization and date.",
  "Audit Log": "Who changed what, and when.",
  BugReport: "Bug reports submitted by users, by organization and month.",
  Notification: "Notification settings and messages sent to users.",
};

export function displayTitle(routeName) {
  const item = NAV_ITEMS.find((e) => e.type === "item" && e.link === routeName);
  return item ? item.text : routeName || "BMS";
}

export function routeGroup(routeName) {
  let group = null;
  for (const e of NAV_ITEMS) {
    if (e.type === "header") group = e.text;
    else if (e.link === routeName) return group;
  }
  return null;
}
