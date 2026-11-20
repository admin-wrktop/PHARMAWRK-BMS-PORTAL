/**
 * Default organisation for pages with an organisation filter: the one the
 * user picked last (remembered in this browser), else the first by name.
 * Never a hard-coded ID — IDs differ between environments.
 */
const KEY = "pharmawrk.bms.lastOrg";

export function activeOrgsSorted(items) {
  return (items || [])
    .filter((o) => o.organization_status === "ACTIVE")
    .sort((a, b) => String(a.organization_name).localeCompare(String(b.organization_name)));
}

export function pickDefaultOrg(orgs, current) {
  const has = (id) => id && orgs.some((o) => o.organization_id === id);
  if (has(current)) return current;
  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch (e) {
    saved = null;
  }
  if (has(saved)) return saved;
  return (orgs[0] && orgs[0].organization_id) || "";
}

export function rememberOrg(id) {
  if (!id) return;
  try {
    localStorage.setItem(KEY, id);
  } catch (e) {
    /* storage unavailable: nothing to remember */
  }
}
