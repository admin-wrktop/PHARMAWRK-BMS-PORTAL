#!/usr/bin/env node
/*
 * Runs before every build ("prebuild") and dev server start ("preserve").
 *
 * 1. Checks src/data/release-notes.json and FAILS the build if it is malformed
 *    or contains text that looks internal (a developer note must never reach
 *    staff). Every string in that file is shown to users exactly as written.
 * 2. Writes public/build-info.json { version, commit, builtAt } (gitignored).
 *    It is copied into dist/ and served at /build-info.json; open tabs compare
 *    it with the commit baked into their bundle to notice a newer deploy.
 *
 * Usage: node scripts/generate-build-info.js [--dev] [--check-only] [--notes <file>]
 *   --dev         commit "dev" (local dev server: the update check stays off)
 *   --check-only  validate the notes, write nothing
 *   --notes       validate another file (used by the guardrail test)
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const notesArg = args.indexOf("--notes");
const NOTES_FILE =
  notesArg >= 0 ? path.resolve(args[notesArg + 1]) : path.join(ROOT, "src/data/release-notes.json");
const OUT_FILE = path.join(ROOT, "public/build-info.json");

const ID_RE = /^(\d{4}-\d{2}-\d{2})(?:\.(\d+))?$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Words that mean "not finished" or "talking to developers".
const INTERNAL_RE = /\b(todo|fixme|tbd|placeholder|lorem)\b|this file|add new entries/i;

function isRealDate(s) {
  if (!DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Sort key for an id: date, then the .N suffix as a number (2026-11-26.10 > .9). */
function idKey(id) {
  const m = ID_RE.exec(id);
  return [m[1], m[2] ? parseInt(m[2], 10) : 0];
}
function compareIds(a, b) {
  const [da, na] = idKey(a);
  const [db, nb] = idKey(b);
  return da === db ? na - nb : da < db ? -1 : 1;
}

function validate(notes) {
  const errors = [];
  if (!Array.isArray(notes) || notes.length === 0) {
    return ["must be a non-empty array of releases"];
  }
  const seen = new Set();
  notes.forEach((r, i) => {
    const at = `entry ${i}${r && r.id ? ` (${r.id})` : ""}`;
    if (!r || typeof r !== "object" || Array.isArray(r)) {
      errors.push(`${at}: must be an object`);
      return;
    }
    const allowed = ["id", "date", "title", "notes"];
    Object.keys(r).forEach((k) => {
      if (!allowed.includes(k)) errors.push(`${at}: unknown field "${k}"`);
    });
    if (typeof r.id !== "string" || !ID_RE.test(r.id)) {
      errors.push(`${at}: id must be YYYY-MM-DD or YYYY-MM-DD.N`);
    } else {
      if (!isRealDate(ID_RE.exec(r.id)[1])) errors.push(`${at}: id is not a real date`);
      if (seen.has(r.id)) errors.push(`${at}: duplicate id`);
      seen.add(r.id);
    }
    if (typeof r.date !== "string" || !isRealDate(r.date)) {
      errors.push(`${at}: date must be a real YYYY-MM-DD date`);
    }
    if (r.title !== undefined && (typeof r.title !== "string" || !r.title.trim())) {
      errors.push(`${at}: title, when given, must be non-empty text`);
    }
    if (!Array.isArray(r.notes) || r.notes.length === 0) {
      errors.push(`${at}: notes must be a non-empty list`);
    } else {
      r.notes.forEach((n, j) => {
        if (typeof n !== "string" || !n.trim()) errors.push(`${at}: note ${j} is empty`);
      });
    }
    [r.title, ...(Array.isArray(r.notes) ? r.notes : [])].forEach((text) => {
      if (typeof text === "string" && INTERNAL_RE.test(text)) {
        errors.push(`${at}: internal-sounding text is not allowed in staff-facing notes: "${text}"`);
      }
    });
    if (i > 0 && notes[i - 1] && ID_RE.test(notes[i - 1].id) && ID_RE.test(r.id || "")) {
      if (compareIds(notes[i - 1].id, r.id) <= 0) {
        errors.push(`${at}: not newest-first (must be older than ${notes[i - 1].id})`);
      }
    }
  });
  return errors;
}

function gitCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short=7 HEAD", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch (e) {
    return "unknown";
  }
}

function main() {
  let notes;
  try {
    notes = JSON.parse(fs.readFileSync(NOTES_FILE, "utf8"));
  } catch (e) {
    console.error(`\n[release-notes] ${path.relative(ROOT, NOTES_FILE)} is not valid JSON: ${e.message}\n`);
    process.exit(1);
  }
  const errors = validate(notes);
  if (errors.length) {
    console.error(`\n[release-notes] ${path.relative(ROOT, NOTES_FILE)} failed the check:`);
    errors.forEach((e) => console.error(`  - ${e}`));
    console.error("Build stopped. Fix the notes (newest first, staff-facing wording) and build again.\n");
    process.exit(1);
  }
  if (flag("--check-only")) {
    console.log(`[release-notes] ${notes.length} release(s) OK`);
    return;
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const info = {
    version: notes[0].id,
    appVersion: pkg.version,
    commit: flag("--dev") ? "dev" : gitCommit(),
    builtAt: new Date().toISOString(),
  };
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(info, null, 2)}\n`);
  console.log(`[release-notes] ${notes.length} release(s) OK; build-info ${info.commit} (${info.version})`);
}

if (require.main === module) main();
module.exports = { validate, compareIds };
