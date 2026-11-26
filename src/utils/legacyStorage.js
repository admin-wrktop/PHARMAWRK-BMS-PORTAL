// Clean-up of browser storage left by the legacy BMS.
//
// The legacy BMS was served from the same address (bms.pharmawrk.com) that
// this app takes over at cut-over, so its localStorage is visible here.
//  - "currentuseremail": the legacy "Remember me" box stored the sign-in form
//    (email AND password, in plain text). Never used by this app.
//  - "CognitoIdentityServiceProvider.<client id>.*": Amplify session keys. Any
//    that belong to a different app client (the legacy user pool) are dead
//    sessions from the old system.
// Runs on every start; it is cheap and leaves this app's own keys alone.

const LEGACY_KEYS = ["currentuseremail"];
const COGNITO_PREFIX = "CognitoIdentityServiceProvider.";

export function purgeLegacyStorage(currentClientId) {
  try {
    const store = window.localStorage;
    LEGACY_KEYS.forEach((k) => store.removeItem(k));
    if (!currentClientId) return;
    const own = `${COGNITO_PREFIX}${currentClientId}.`;
    const stale = [];
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (k && k.startsWith(COGNITO_PREFIX) && !k.startsWith(own)) stale.push(k);
    }
    stale.forEach((k) => store.removeItem(k));
  } catch (e) {
    /* storage unavailable (private mode, blocked): nothing to clean */
  }
}
