/**
 * Support Cases: shared constants and helpers for the BMS staff console.
 * Enum strings follow the backend contract (support-cases spec §3.5).
 */

export const SUPPORT_STATUS = {
  OPEN: { label: "Open", tone: "info", icon: "mdi-inbox-outline" },
  IN_PROGRESS: { label: "In progress", tone: "warning", icon: "mdi-progress-wrench" },
  PENDING_CUSTOMER: { label: "Awaiting customer", tone: "neutral", icon: "mdi-account-clock-outline" },
  REOPENED: { label: "Reopened", tone: "error", icon: "mdi-backup-restore" },
  RESOLVED: { label: "Resolved", tone: "success", icon: "mdi-check-circle-outline" },
};
export const OPEN_STATUSES = ["OPEN", "IN_PROGRESS", "PENDING_CUSTOMER", "REOPENED"];
export const STATUS_ORDER = [...OPEN_STATUSES, "RESOLVED"];

export const SUPPORT_SEVERITY = {
  URGENT: { label: "Urgent", tone: "error" },
  HIGH: { label: "High", tone: "warning" },
  NORMAL: { label: "Normal", tone: "info" },
  LOW: { label: "Low", tone: "neutral" },
};
export const SEVERITY_ORDER = ["URGENT", "HIGH", "NORMAL", "LOW"];

export const CASE_TYPES = {
  BUG: { label: "Bug", icon: "mdi-bug-outline" },
  ENHANCEMENT: { label: "Enhancement", icon: "mdi-lightbulb-on-outline" },
};
export const APP_AREAS = {
  PORTAL: { label: "Portal", icon: "mdi-monitor" },
  MOBILE: { label: "Mobile app", icon: "mdi-cellphone" },
};

export const toItems = (map) =>
  Object.entries(map).map(([value, v]) => ({ value, title: v.label }));

/* ---- attachments (spec §3.8) ---- */
export const MAX_FILE_BYTES = 15 * 1024 * 1024;
export const MAX_FILES = 10;
export const ALLOWED_EXTENSIONS = [
  "png", "jpg", "jpeg", "gif", "webp", "pdf", "txt", "csv", "xlsx", "docx", "mp4", "webm",
];
export const ACCEPT_ATTR = ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",");

export function extOf(name) {
  const m = /\.([a-z0-9]+)$/i.exec(name || "");
  return m ? m[1].toLowerCase() : "";
}
export function isImageName(name) {
  return ["png", "jpg", "jpeg", "gif", "webp"].includes(extOf(name));
}
export function fileIconFor(name) {
  const e = extOf(name);
  if (isImageName(name)) return "mdi-file-image-outline";
  if (e === "pdf") return "mdi-file-pdf-box";
  if (e === "xlsx" || e === "csv") return "mdi-file-excel-outline";
  if (e === "docx") return "mdi-file-word-outline";
  if (e === "mp4" || e === "webm") return "mdi-file-video-outline";
  return "mdi-file-document-outline";
}
export function formatBytes(n) {
  if (!n && n !== 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** Validate new files against what is already attached. Returns {ok[], errors[]}. */
export function validateFiles(files, existingCount = 0) {
  const ok = [];
  const errors = [];
  for (const f of files) {
    if (existingCount + ok.length >= MAX_FILES) {
      errors.push(`Up to ${MAX_FILES} files per message.`);
      break;
    }
    if (!ALLOWED_EXTENSIONS.includes(extOf(f.name))) {
      errors.push(`${f.name}: file type not allowed.`);
    } else if (!f.size || f.size > MAX_FILE_BYTES) {
      errors.push(`${f.name}: must be under 15 MB.`);
    } else {
      ok.push(f);
    }
  }
  return { ok, errors };
}

export function imagesFromClipboard(event) {
  const items = (event.clipboardData && event.clipboardData.items) || [];
  const files = [];
  for (const it of items) {
    if (it.kind === "file" && it.type.startsWith("image/")) {
      const f = it.getAsFile();
      if (f) {
        const ext = f.type.split("/")[1] || "png";
        files.push(new File([f], `pasted-${Date.now()}.${ext}`, { type: f.type }));
      }
    }
  }
  return files;
}

/* ---- dates ---- */
export function formatDateTime(ms) {
  if (!ms) return "";
  return new Date(Number(ms)).toLocaleString(undefined, {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
export function relativeTime(ms, now = Date.now()) {
  if (!ms) return "";
  const s = Math.round((now - Number(ms)) / 1000);
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} d ago`;
  return formatDateTime(ms);
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
