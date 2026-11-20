import axios from "axios";
import { generateClient } from "aws-amplify/api";
import { SupportCases } from "@/graphql/mutations.js";

const client = generateClient();

/** Turn an Amplify/AppSync error into a readable message. */
export function supportErrorMessage(error) {
  return (
    (error && error.errors && error.errors[0] && error.errors[0].message) ||
    (error && error.message) ||
    "Something went wrong. Please try again."
  );
}

/**
 * The whole Support Cases API is one mutation: SupportCases(command, payload).
 * BMS uses the staff (bms*) commands; the backend stamps the caller's identity.
 */
export async function supportCall(command, payload = {}) {
  if (process.env.NODE_ENV === "development") {
    const { supportMock } = require("@/dev/supportMock");
    const mocked = supportMock(command, payload);
    if (mocked !== undefined) return mocked;
  }
  try {
    const result = await client.graphql({
      query: SupportCases,
      variables: { command, payload: JSON.stringify(payload) },
    });
    const raw = result.data.SupportCases;
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && parsed.status && String(parsed.status).toUpperCase() === "ERROR") {
      throw new Error(parsed.message || parsed.Status_Message || "Request failed");
    }
    return parsed;
  } catch (error) {
    throw new Error(supportErrorMessage(error));
  }
}

/**
 * Upload files through presigned PUT URLs and return the attachment refs the
 * reply command expects: [{ key, name, is_screenshot }].
 */
export async function uploadSupportAttachments(ticketId, files, onProgress) {
  const refs = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const contentType = file.type || "application/octet-stream";
    const res = await supportCall("bmsGetSupportUploadUrl", {
      ticket_id: ticketId,
      file_name: file.name,
      content_type: contentType,
      file_size: file.size,
    });
    if (!res.mock) await axios.put(res.upload_url, file, {
      headers: { "Content-Type": res.content_type || contentType },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(i, Math.round((e.loaded / e.total) * 100));
      },
    });
    refs.push({ key: res.key, name: file.name, is_screenshot: false });
  }
  return refs;
}

export const SupportCasesApi = {
  methods: { supportCall, uploadSupportAttachments, supportErrorMessage },
};
