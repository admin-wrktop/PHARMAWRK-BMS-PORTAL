/** DEV-ONLY mock for Set Users OTP in ?uiPreview=1 mode. Fictitious data. */
const KEY = "pharmawrk.bms.uiPreview";
const DAY = 86400000;
const now = Date.now();
let items = [
  { user_id: "u1", organization_id: "org-a", organization_name: "Asclepius Pharma", user_name: "Asha Rao", phone_hint: "******0001", reason: "Play Store review", set_on: now - DAY, set_by_name: "Preview Admin", expires_at_ms: now + 5 * DAY, active: true },
  { user_id: "u2", organization_id: "org-b", organization_name: "Borealis Labs", user_name: "QA tester", phone_hint: "******0002", reason: "Regression testing", set_on: now - 10 * DAY, set_by_name: "Preview Admin", expires_at_ms: now - 2 * DAY, active: false },
];
const users = [
  { user_id: "u1", user_name: "Asha Rao", user_type: "MEDREP", user_contact_number: "+919800000001" },
  { user_id: "u3", user_name: "Vikram Shah", user_type: "MANAGER", user_contact_number: "+919800000003" },
];
const on = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; } };
export function userOtpMock(command, p) {
  if (!on()) return undefined;
  switch (command) {
    case "list":
      return Promise.resolve({ status: "SUCCESS", data: { items: items.filter((x) => p.include_expired || x.active) } });
    case "orgs":
      return Promise.resolve([{ organization_id: "org-a", organization_name: "Asclepius Pharma", organization_status: "ACTIVE" }, { organization_id: "org-b", organization_name: "Borealis Labs", organization_status: "ACTIVE" }]);
    case "users":
      return Promise.resolve({ status: "SUCCESS", data: { Items: users } });
    case "set": {
      const u = users.find((x) => x.user_id === p.target_user_id) || {};
      items = items.filter((x) => x.user_id !== p.target_user_id);
      const item = { user_id: p.target_user_id, organization_id: p.organization_id, organization_name: "Preview Org", user_name: u.user_name, phone_hint: "******" + String(u.user_contact_number || "").slice(-4), reason: p.reason, set_on: Date.now(), set_by_name: "Preview Admin", expires_at_ms: Date.now() + (p.expires_in_days || 7) * DAY, active: true };
      items.unshift(item);
      return Promise.resolve({ status: "SUCCESS", Status_Message: "Fixed sign-in code set", data: item });
    }
    case "reveal":
      return Promise.resolve(p.target_user_id === "u2" ? { status: "SUCCESS", data: { otp: null } } : { status: "SUCCESS", data: { otp: "482915" } });
    case "remove":
      items = items.filter((x) => x.user_id !== p.target_user_id);
      return Promise.resolve({ status: "SUCCESS", Status_Message: "Fixed sign-in code removed" });
    default:
      return undefined;
  }
}
