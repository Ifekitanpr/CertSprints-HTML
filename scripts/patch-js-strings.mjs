/**
 * patch-js-strings.mjs
 * Replaces ALL bare "filename.html" / 'filename.html' string literals
 * in JS files with canonical domain-prefixed paths.
 * Covers navigateTo(), currentFlowUrl(), goToAccount(), .endsWith() etc.
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

function patchJs(content) {
  let out = content;
  for (const [filename, canonical] of canonicalMap) {
    const f = escRe(filename);
    // Replace "filename.html" and 'filename.html' wherever they appear
    // as standalone string literals (not already prefixed with a path segment)
    out = out.replace(
      new RegExp(`(?<=[^/a-zA-Z0-9_-])"${f}([^"]*)"`, "g"),
      (_, extra) => `"${canonical}${extra}"`
    );
    out = out.replace(
      new RegExp(`(?<=[^/a-zA-Z0-9_-])'${f}([^']*)'`, "g"),
      (_, extra) => `'${canonical}${extra}'`
    );
  }
  return out;
}

// Also patch HTML files — some have navigateTo() calls inline
function patchHtml(content) {
  let out = content;
  for (const [filename, canonical] of canonicalMap) {
    const f = escRe(filename);
    out = out.replace(
      new RegExp(`(?<=[^/a-zA-Z0-9_-])"${f}([^"]*)"`, "g"),
      (_, extra) => `"${canonical}${extra}"`
    );
    out = out.replace(
      new RegExp(`(?<=[^/a-zA-Z0-9_-])'${f}([^']*)'`, "g"),
      (_, extra) => `'${canonical}${extra}'`
    );
  }
  return out;
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkDir(full));
    else if (e.isFile()) out.push(full);
  }
  return out;
}

let patched = 0;

// All JS files
for (const file of walkDir(path.join(webRoot, "js"))) {
  if (!file.endsWith(".js")) continue;
  const original = fs.readFileSync(file, "utf8");
  const updated = patchJs(original);
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    console.log(`JS:   ${path.relative(webRoot, file)}`);
    patched++;
  }
}

// All domain HTML files (inline scripts / navigateTo calls)
const domainDirs = [
  "app","lms","games","practice","onboarding","support",
  "settings","commerce","community",
  path.join("account","auth"), path.join("account","profile"),
];
for (const d of domainDirs) {
  for (const file of walkDir(path.join(webRoot, d))) {
    if (!file.endsWith(".html")) continue;
    const original = fs.readFileSync(file, "utf8");
    const updated = patchHtml(original);
    if (updated !== original) {
      fs.writeFileSync(file, updated);
      console.log(`HTML: ${path.relative(webRoot, file)}`);
      patched++;
    }
  }
}

console.log(`\nDone — ${patched} files updated.`);
