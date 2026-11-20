/**
 * DEV-ONLY UI preview harness.
 *
 * Open any BMS route with `?uiPreview=1` on a local dev server to see the
 * signed-in shell WITHOUT signing in to any backend (sticky for the browser
 * tab via sessionStorage; `?uiPreview=0` turns it off). Page API calls fail
 * by design, so pages render their empty states.
 *
 * Every call site is wrapped in `process.env.NODE_ENV === "development"`,
 * so webpack strips this module from production builds.
 * All data below is fictitious.
 */
const KEY = "pharmawrk.bms.uiPreview";

export function isUiPreview(route) {
  try {
    const q = route && route.query ? route.query.uiPreview : undefined;
    if (q === "1") sessionStorage.setItem(KEY, "1");
    if (q === "0") sessionStorage.removeItem(KEY);
    const on = sessionStorage.getItem(KEY) === "1";
    if (on && !document.getElementById("ui-preview-style")) {
      const st = document.createElement("style");
      st.id = "ui-preview-style";
      st.textContent =
        "#webpack-dev-server-client-overlay{display:none!important}";
      document.head.appendChild(st);
    }
    return on;
  } catch (e) {
    return false;
  }
}

export function previewUser() {
  return {
    user_id: "preview-user",
    user_name: "Preview Admin",
    user_email_id: "preview.admin@example.com",
    user_type: "BMS ADMIN",
    user_role: "BMS_ADMIN",
  };
}
