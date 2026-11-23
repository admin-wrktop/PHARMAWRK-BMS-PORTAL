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
  BMS: { label: "BMS", icon: "mdi-shield-account-outline" },
};

/** Staff-raised platform-level case (no customer organisation). */
export function isPlatformCase(t) {
  return !!t && (!t.organization_id || t.organization_id === "PLATFORM" || t.is_platform === true);
}

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

/**
 * Who gets the staff email for a case of this severity. Same rule as the backend's
 * routeFor(): the severity's lists are used only when its To list is non-empty, and
 * then both its To and its CC apply (an empty CC means no CC). Otherwise the default
 * To and CC apply and a CC-only severity row is ignored. URGENT also adds
 * urgent_to_emails to To.
 */
export function severityRecipients(settings, severity) {
  const s = settings || {};
  const own = (s.by_severity && s.by_severity[severity]) || {};
  const hit = (own.to_emails || []).length > 0;
  const urgent = severity === "URGENT" ? s.urgent_to_emails || [] : [];
  const to = [...new Set([...((hit ? own.to_emails : s.to_emails) || []), ...urgent])];
  const cc = [...((hit ? own.cc_emails : s.cc_emails) || [])];
  return { to, cc, own: hit };
}

/* ------------------------------------------------------------------ */
/* Page screenshot for Raise case (same approach as the Portal).       */

const BLANK_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const pad2 = (n) => String(n).padStart(2, "0");
const stamp = () => {
  const d = new Date();
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
};

/*
 * Font CSS for the capture, built only from same-origin stylesheets (the icon
 * font). Letting html-to-image read every stylesheet logs errors for
 * cross-origin sheets (Google Fonts) and is slow. Cached per page load.
 */
let fontCssPromise = null;
const toDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
function sameOriginFontCss() {
  if (fontCssPromise) return fontCssPromise;
  fontCssPromise = (async () => {
    const out = [];
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try {
        if (sheet.href && new URL(sheet.href).origin !== window.location.origin) continue;
        rules = sheet.cssRules;
      } catch (e) {
        continue; // cross-origin: skip quietly
      }
      for (const rule of Array.from(rules || [])) {
        if (rule.type !== 5) continue; // CSSFontFaceRule
        const src = rule.style.getPropertyValue("src") || "";
        const m = /url\(["']?([^"')]+\.woff2[^"')]*)["']?\)/.exec(src);
        if (!m) continue;
        try {
          const url = new URL(m[1], sheet.href || window.location.href).href;
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await toDataUrl(await res.blob());
          const family = rule.style.getPropertyValue("font-family");
          const weight = rule.style.getPropertyValue("font-weight") || "normal";
          const style = rule.style.getPropertyValue("font-style") || "normal";
          out.push(`@font-face{font-family:${family};src:url(${data}) format("woff2");font-weight:${weight};font-style:${style};}`);
        } catch (e) {
          /* skip this font */
        }
      }
    }
    return out.join("\n");
  })();
  return fontCssPromise;
}

/**
 * Screenshot of what's on screen (viewport), open dialogs and menus included.
 * Only elements marked `.support-capture-exclude` (the Raise case form and its
 * button) are left out. Resolves { file } or { file: null, reason }; never throws.
 */
export async function captureCurrentPage() {
  // html-to-image can't copy ::placeholder rules, so a placeholder Vuetify hides
  // (labelled field, not active) would be drawn on top of the label. Strip those
  // placeholders for the capture and put them back afterwards.
  const hidden = Array.from(
    document.querySelectorAll(
      ".v-field:not(.v-field--no-label):not(.v-field--active) input[placeholder], .v-field:not(.v-field--no-label):not(.v-field--active) textarea[placeholder]",
    ),
  ).map((el) => [el, el.getAttribute("placeholder")]);
  hidden.forEach(([el]) => el.removeAttribute("placeholder"));
  try {
    const { toBlob } = await import(/* webpackChunkName: "html-to-image" */ "html-to-image");
    // body, not .v-application: Vuetify teleports dialogs and menus outside it
    const root = document.body;
    const bg = getComputedStyle(document.body).backgroundColor || "#ffffff";
    const fontEmbedCSS = await sameOriginFontCss();
    const wide = window.innerWidth > 1600;
    const base = {
      cacheBust: true,
      fontEmbedCSS,
      backgroundColor: bg,
      width: window.innerWidth,
      height: window.innerHeight,
      style: { transform: `translateY(-${window.scrollY}px)` },
      // an image that can't be fetched must not abort the whole capture
      imagePlaceholder: BLANK_PIXEL,
      filter: (node) => {
        // non-visual nodes: <noscript> text would otherwise be drawn as plain text
        if (/^(NOSCRIPT|SCRIPT|STYLE|TEMPLATE|LINK|META)$/.test(node.tagName || "")) return false;
        if (node.tagName === "IMG" && !(node.complete && node.naturalWidth > 0)) return false;
        return !(node.classList && (node.classList.contains("support-capture-exclude") || node.classList.contains("pw-skip-link")));
      },
    };
    let blob = await toBlob(root, { ...base, pixelRatio: wide ? 1 : Math.min(window.devicePixelRatio || 1, 1.5) });
    let name = `screenshot-${stamp()}.png`;
    if (blob && blob.size > MAX_FILE_BYTES) {
      blob = await toBlob(root, { ...base, pixelRatio: 1, type: "image/jpeg", quality: 0.82 });
      name = `screenshot-${stamp()}.jpg`;
    }
    if (!blob) return { file: null, reason: "The page couldn't be captured." };
    if (blob.size > MAX_FILE_BYTES) return { file: null, reason: "The screenshot is larger than 15 MB." };
    return { file: new File([blob], name, { type: blob.type || "image/png" }) };
  } catch (e) {
    console.warn("[support] page capture failed", e);
    return { file: null, reason: "The page couldn't be captured." };
  } finally {
    hidden.forEach(([el, v]) => el.setAttribute("placeholder", v));
  }
}
