/** BMS staff users (back-office logins). Admin-only writes are enforced by the backend. */
import { generateClient } from "aws-amplify/api";
import { ListBMSUsers } from "@/graphql/queries.js";
import { CreateBMSUser, UpdateBMSUser, ActiveOrDeactiveBMSUser } from "@/graphql/mutations.js";

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
    const { bmsUsersMock } = require("@/dev/bmsUsersMock");
    const mocked = bmsUsersMock(mockCommand, input);
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

export async function listBmsUsers(user_status = "ACTIVE") {
  const res = await run(ListBMSUsers, "ListBMSUsers", { user_status }, "list");
  return (res && res.data && (res.data.items || res.data.Items)) || [];
}

/** { new_user_email_id, user_name, user_role: BMS_USER | BMS_ADMIN } */
export const createBmsUser = (input) => run(CreateBMSUser, "CreateBMSUser", input, "create");

export const renameBmsUser = (target_user_id, user_name) =>
  run(UpdateBMSUser, "UpdateBMSUser", { target_user_id, user_name }, "rename");

/** Flips ACTIVE <-> INACTIVE; deactivation also signs the user out everywhere. */
export const toggleBmsUser = (target_user_id) =>
  run(ActiveOrDeactiveBMSUser, "ActiveOrDeactiveBMSUser", { target_user_id }, "toggle");
