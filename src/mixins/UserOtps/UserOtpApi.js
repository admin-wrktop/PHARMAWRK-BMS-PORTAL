/**
 * Set Users OTP: fixed sign-in codes for specific mobile users (BMS admins
 * only). Contract: set-users-otp-API.md (backend 4e57961). Codes are stored
 * encrypted; RevealUserOtp returns one on request and is audit-logged. Codes
 * set before that change were stored only as a hash (can_reveal: false).
 */
import { generateClient } from "aws-amplify/api";
import { ListUserOtps, ListUsersOfOrganization } from "@/graphql/queries.js";
import { SetUserOtp, RemoveUserOtp, RevealUserOtp, RevealUserOtpPhone } from "@/graphql/mutations.js";

const client = generateClient();

function messageOf(error) {
  return (
    (error && error.errors && error.errors[0] && error.errors[0].message) ||
    (error && error.message) ||
    "Something went wrong. Please try again."
  );
}

async function run(query, field, input, mockCommand) {
  if (process.env.NODE_ENV === "development") {
    const { userOtpMock } = require("@/dev/userOtpMock");
    const mocked = userOtpMock(mockCommand, input);
    if (mocked !== undefined) return mocked;
  }
  try {
    const result = await client.graphql({ query, variables: { input } });
    const raw = result.data[field];
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch (error) {
    throw new Error(messageOf(error));
  }
}

/** Active codes (newest first); pass include_expired to see expired ones too. */
export async function listUserOtps({ include_expired = false, organization_id } = {}) {
  const res = await run(ListUserOtps, "ListUserOtps", { include_expired, organization_id }, "list");
  return (res && res.data && res.data.items) || [];
}

/** { organization_id, target_user_id, otp (6 digits), expires_in_days (1-30), reason (3-200) } */
export const setUserOtp = (input) => run(SetUserOtp, "SetUserOtp", input, "set");

/**
 * Reveal a user's saved code (audit-logged by the backend). Resolves the code,
 * or null when the code was set before codes were stored encrypted.
 */
export async function revealUserOtp(target_user_id) {
  const res = await run(RevealUserOtp, "RevealUserOtp", { target_user_id }, "reveal");
  if (res && res.status && String(res.status).toUpperCase() !== "SUCCESS") {
    throw new Error(res.Status_Message || res.message || "Couldn't show the code. Please try again.");
  }
  const otp = res && res.data && res.data.otp;
  return otp ? String(otp) : null;
}

/**
 * The full mobile number of a user with a fixed code (PW-100033). Only this call returns it; the list
 * shows the masked hint. BMS_ADMIN only; every reveal is audit-logged by the backend.
 */
export async function revealUserOtpPhone(target_user_id) {
  const res = await run(RevealUserOtpPhone, "RevealUserOtpPhone", { target_user_id }, "revealPhone");
  if (res && res.status && String(res.status).toUpperCase() !== "SUCCESS") {
    throw new Error(res.Status_Message || res.message || "Couldn't show the number. Please try again.");
  }
  const phone = res && res.data && res.data.phone;
  return phone ? String(phone) : null;
}

export const removeUserOtp = (target_user_id) =>
  run(RemoveUserOtp, "RemoveUserOtp", { target_user_id }, "remove");

/** Users of one organisation, for the user picker. */
export async function listOrgUsers(organization_id) {
  const res = await run(ListUsersOfOrganization, "ListUsersOfOrganization", { organization_id }, "users");
  return (res && res.data && (res.data.Items || res.data.items)) || [];
}

/** Client-side check matching the backend rules. Returns an error string or "". */
export function otpProblem(otp) {
  if (!/^\d{6}$/.test(otp || "")) return "Exactly 6 digits";
  if (/^(\d)\1{5}$/.test(otp)) return "Can't be one repeated digit";
  const d = otp.split("").map(Number);
  const step = d[1] - d[0];
  if ((step === 1 || step === -1) && d.every((x, i) => i === 0 || x - d[i - 1] === step)) {
    return "Can't be a straight run like 123456";
  }
  return "";
}

/** Active organisations for the organisation picker. */
export async function listActiveOrgs() {
  if (process.env.NODE_ENV === "development") {
    const { userOtpMock } = require("@/dev/userOtpMock");
    const mocked = userOtpMock("orgs", {});
    if (mocked !== undefined) return mocked;
  }
  const { ListOrganizations } = await import("@/graphql/queries.js");
  const result = await client.graphql({ query: ListOrganizations });
  return JSON.parse(result.data.ListOrganizations).data.Items || [];
}
