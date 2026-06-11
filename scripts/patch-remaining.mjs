/**
 * patch-remaining.mjs
 * Second-pass fix for patterns the first decompat missed:
 *   - window.location.href = 'file.html'  (spaces around =, inline <script> blocks)
 *   - location.href='file.html'            (no window. prefix)
 *   - special ternary / concatenation cases
 */
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || "/Users/user/Desktop/CertSprints-HTML";
const manifestPath = path.resolve("docs/project-route-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const webRoot = path.join(root, manifest.currentRoot);

const canonicalMap = new Map();
for (const [, migration] of Object.entries(manifest.migrations)) {
  if (migration.status !== "migrated") continue;
  const dir = migration.canonicalDirectory.replace(/^web\//, "");
  for (const page of migration.pages) {
    canonicalMap.set(page, `${dir}/${page}`);
  }
}

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function patch(content) {
  let out = content;
  for (const [filename, canonical] of canonicalMap) {
    const f = escRe(filename);

    // window.location.href = 'filename.html[extra]'  (spaces around =)
    out = out.replace(
      new RegExp(`(window\\.location\\.href\\s*=\\s*)'${f}([^']*)'`, "g"),
      (_, prefix, extra) =>
        `${prefix}new URL('${canonical}${extra}', document.baseURI).href`
    );

    // location.href = 'filename.html[extra]'  (no window.)
    out = out.replace(
      new RegExp(`(?<!window\\.)(location\\.href\\s*=\\s*)'${f}([^']*)'`, "g"),
      (_, prefix, extra) =>
        `${prefix}new URL('${canonical}${extra}', document.baseURI).href`
    );

    // Also catch:  location.href='filename.html'  (no space, no window.)
    out = out.replace(
      new RegExp(`(?<![\\w.])(location\\.href='${f}([^']*)')`, "g"),
      (_, _full, extra) =>
        `location.href=new URL('${canonical}${extra}', document.baseURI).href`
    );

    // String literal in ternary or concatenation: '?'filename.html':
    // e.g.  ?'notifications.html':'settings.html'
    // Replace the bare filename in single-quoted string fragments not yet canonical
    out = out.replace(
      new RegExp(`'${f}([^']*)'(?=[^a-zA-Z])`, "g"),
      (match, extra, offset) => {
        // Only replace if this looks like a navigation target, not already canonical
        // (If the char before the opening ' is a letter/slash, it's likely part of another word)
        const before = out[offset - 1] || "";
        if (/[a-zA-Z0-9_/]/.test(before)) return match;
        return `'${canonical}${extra}'`;
      }
    );
  }
  return out;
}

// Files that had remaining bare filenames
const targets = [
  "lms/pre-assessment-quiz.html",
  "lms/lesson-player.html",
  "lms/lesson-quiz.html",
  "lms/retrieval-sprint.html",
  "lms/knowledge-poll-2.html",
  "lms/decision-tree.html",
  "lms/module-quiz.html",
  "games/logic-sniper.html",
  "settings/settings-notifications.html",
  "js/comprehension-check.js",
];

let patched = 0;
for (const rel of targets) {
  const file = path.join(webRoot, rel);
  if (!fs.existsSync(file)) { console.warn(`Missing: ${rel}`); continue; }
  const original = fs.readFileSync(file, "utf8");
  const updated = patch(original);
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    console.log(`Patched: ${rel}`);
    patched++;
  } else {
    console.log(`No change: ${rel}`);
  }
}

console.log(`\nDone — ${patched} files updated.`);
