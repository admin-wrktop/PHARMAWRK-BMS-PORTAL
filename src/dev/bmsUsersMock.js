/** DEV-ONLY mock for BMS Users in ?uiPreview=1 mode. Fictitious data. */
const KEY = "pharmawrk.bms.uiPreview";
const DAY = 86400000;
let users = [
  { user_id: "preview-user", user_name: "Preview Admin", user_email_id: "preview.admin@example.com", user_role: "BMS_ADMIN", user_status: "ACTIVE", user_created_on: Date.now() - 30 * DAY },
  { user_id: "u2", user_name: "Support Agent", user_email_id: "agent@example.com", user_role: "BMS_USER", user_status: "ACTIVE", user_created_on: Date.now() - 5 * DAY },
  { user_id: "u3", user_name: "Former Staff", user_email_id: "former@example.com", user_role: "BMS_USER", user_status: "INACTIVE", user_created_on: Date.now() - 90 * DAY },
];
let seq = 4;
const on = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; } };
export function bmsUsersMock(command, p) {
  if (!on()) return undefined;
  switch (command) {
    case "list": {
      const items = users.filter((u) => u.user_status === p.user_status);
      return items.length ? Promise.resolve({ status: "SUCCESS", data: { items } }) : Promise.reject(new Error("No Users Found"));
    }
    case "create":
      if (users.some((u) => u.user_email_id === p.new_user_email_id)) return Promise.reject(new Error("BMS User With This Email Already Exists"));
      users.push({ user_id: `u${seq++}`, user_name: p.user_name, user_email_id: p.new_user_email_id, user_role: p.user_role, user_status: "ACTIVE", user_created_on: Date.now() });
      return Promise.resolve({ status: "SUCCESS" });
    case "rename":
      users = users.map((u) => (u.user_id === p.target_user_id ? { ...u, user_name: p.user_name } : u));
      return Promise.resolve({ status: "SUCCESS" });
    case "toggle":
      users = users.map((u) => (u.user_id === p.target_user_id ? { ...u, user_status: u.user_status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : u));
      return Promise.resolve({ status: "SUCCESS" });
    default:
      return undefined;
  }
}
