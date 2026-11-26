// Release notes ("What's new") and the new-version check. Frontend only.
//
// - The notes come from src/data/release-notes.json, bundled at build time, so
//   what a user reads always matches the code they are running.
// - /build-info.json is written on every build (scripts/generate-build-info.js)
//   and served with no-cache. The bundle carries its own commit
//   (__PW_BUILD_COMMIT__, vue.config.js). When the live file names a different
//   commit, a newer build has been deployed.

import releaseNotes from "@/data/release-notes.json";

/* global __PW_BUILD_COMMIT__, __PW_BUILD_AT__ */
export const BUILD_COMMIT = typeof __PW_BUILD_COMMIT__ !== "undefined" ? __PW_BUILD_COMMIT__ : "dev";
export const BUILD_AT = typeof __PW_BUILD_AT__ !== "undefined" ? __PW_BUILD_AT__ : "";

export const DISMISS_PREFIX = "pharmawrk_bms_release_notes_dismissed:";
const DISMISS_KEY = `${DISMISS_PREFIX}browser`;
const AUTO_RELOAD_PREFIX = "pharmawrk_bms_auto_reloaded:";
const NAV_RELOAD_PREFIX = "pharmawrk_bms_nav_reloaded:";

/** Any screen can open the release notes dialog with openReleaseNotes(). */
export const OPEN_RELEASE_NOTES_EVENT = "pw:open-release-notes";
export function openReleaseNotes() {
  window.dispatchEvent(new Event(OPEN_RELEASE_NOTES_EVENT));
}

export const POLL_MS = 2 * 60 * 1000;
export const FOCUS_MIN_GAP_MS = 30 * 1000;
export const SKIP_MS = 30 * 60 * 1000;

/** Newest first, as stored. */
export function getReleaseNotes() {
  return releaseNotes;
}
export function latestRelease() {
  return releaseNotes[0] || null;
}

/** "2026-11-26" -> "26 Nov 2026", always in UTC so it never shows the 25th west of GMT. */
export function formatDate(s) {
  if (!s) return "";
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T00:00:00Z`) : new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });
}

/** Label for the running build, e.g. "Build 36ec098 · 26 Nov 2026, 17:05 UTC". */
export function buildLabel() {
  if (BUILD_COMMIT === "dev") return "Local development build";
  let when = "";
  if (BUILD_AT) {
    const d = new Date(BUILD_AT);
    if (!Number.isNaN(d.getTime())) {
      when = `${formatDate(BUILD_AT)}, ${d.toLocaleTimeString("en-GB", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
      })} UTC`;
    }
  }
  return `Build ${BUILD_COMMIT}${when ? ` · ${when}` : ""}`;
}

// ---- dismissal (per browser, not per user: the banner also shows before sign-in)

function compareIds(a, b) {
  const re = /^(\d{4}-\d{2}-\d{2})(?:\.(\d+))?$/;
  const ma = re.exec(a || "");
  const mb = re.exec(b || "");
  if (!ma || !mb) return ma ? 1 : mb ? -1 : 0;
  if (ma[1] !== mb[1]) return ma[1] < mb[1] ? -1 : 1;
  return (parseInt(ma[2] || "0", 10)) - (parseInt(mb[2] || "0", 10));
}

/** Newest release id dismissed under any key with our prefix (or null). */
export function dismissedId() {
  let newest = null;
  try {
    const s = window.localStorage;
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      if (!k || !k.startsWith(DISMISS_PREFIX)) continue;
      const v = s.getItem(k);
      if (v && (!newest || compareIds(v, newest) > 0)) newest = v;
    }
  } catch (e) {
    /* storage blocked: the banner simply shows again next load */
  }
  return newest;
}

export function shouldShowBanner() {
  const latest = latestRelease();
  if (!latest) return false;
  const d = dismissedId();
  return !d || compareIds(latest.id, d) > 0;
}

export function dismissLatest() {
  const latest = latestRelease();
  if (!latest) return;
  try {
    window.localStorage.setItem(DISMISS_KEY, latest.id);
  } catch (e) {
    /* storage blocked */
  }
}

// ---- new-version check

let pendingCommit = null;

/** Live build info, or null when it can't be read (offline, local dev, not deployed yet). */
export async function fetchBuildInfo() {
  try {
    const res = await fetch(`${process.env.BASE_URL}build-info.json?t=${Date.now()}`, { cache: "no-store" });
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !type.includes("json")) return null; // SPA fallback returns index.html
    const info = await res.json();
    return info && typeof info.commit === "string" ? info : null;
  } catch (e) {
    return null;
  }
}

/** The newer commit that is live, or null when this tab is current (or can't tell). */
export async function checkForUpdate() {
  if (BUILD_COMMIT === "dev" || BUILD_COMMIT === "unknown") return null;
  const info = await fetchBuildInfo();
  if (!info || !info.commit || info.commit === "dev" || info.commit === "unknown") return null;
  if (info.commit === BUILD_COMMIT) {
    pendingCommit = null;
    return null;
  }
  pendingCommit = info.commit;
  return info.commit;
}

/**
 * Router hook: once a newer build is known, the next in-app navigation loads it.
 * At most once per target commit per tab, so a cached old index.html can't loop.
 */
export function claimNavReload() {
  if (!pendingCommit) return false;
  try {
    const k = `${NAV_RELOAD_PREFIX}${pendingCommit}`;
    if (window.sessionStorage.getItem(k)) return false;
    window.sessionStorage.setItem(k, String(Date.now()));
    return true;
  } catch (e) {
    return false;
  }
}

/** True only the first time for this target commit in this tab (prevents reload loops). */
export function claimAutoReload(commit) {
  try {
    const k = `${AUTO_RELOAD_PREFIX}${commit}`;
    if (window.sessionStorage.getItem(k)) return false;
    window.sessionStorage.setItem(k, String(Date.now()));
    return true;
  } catch (e) {
    return false; // can't guard against a loop: ask instead
  }
}

export function reloadPage() {
  window.location.reload();
}
