/**
 * decompat.mjs
 * Replaces bare filename.html references with canonical domain-prefixed paths
 * in all migrated HTML + JS files, then deletes root compat redirects.
 *
 * Run: node scripts/decompat.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || "/Users/user/Desktop/CertSprints-HTML";
const manifestPath = path.resolve("docs/project-route-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const webRoot = path.join(root, manifest.currentRoot);

// ── Canonical map: "dashboard.html" → "app/dashboard.html" ───────────────────
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

// ── Patch a single HTML file ──────────────────────────────────────────────────
function patchHtml(content) {
  let out = content;
  for (const [filename, canonical] of canonicalMap) {
    const f = escRe(filename);

    // onclick/onkeydown inline: window.location.href='filename.html[extra]'
    // extra = optional ?query or #hash
    out = out.replace(
      new RegExp(`window\\.location\\.href='${f}([^']*)'`, "g"),
      (_, extra) =>
        `window.location.href=new URL('${canonical}${extra}',document.baseURI).href`
    );

    // <a href="filename.html[extra]"> — base href resolves this, no new URL needed
    out = out.replace(
      new RegExp(`(href=")${f}([^"]*)(")`,"g"),
      `$1${canonical}$2$3`
    );
  }
  return out;
}

// ── Patch a single JS file ────────────────────────────────────────────────────
function patchJs(content) {
  let out = content;
  for (const [filename, canonical] of canonicalMap) {
    const f = escRe(filename);

    // Double-quoted: window.location.href = "filename.html[extra]"
    out = out.replace(
      new RegExp(`(window\\.location\\.href\\s*=\\s*)"${f}([^"]*)"`, "g"),
      (_, prefix, extra) =>
        `${prefix}new URL("${canonical}${extra}", document.baseURI).href`
    );

    // Single-quoted: window.location.href = 'filename.html[extra]'
    out = out.replace(
      new RegExp(`(window\\.location\\.href\\s*=\\s*)'${f}([^']*)'`, "g"),
      (_, prefix, extra) =>
        `${prefix}new URL('${canonical}${extra}', document.baseURI).href`
    );

    // Template literal: window.location.href = `filename.html[extra]`
    out = out.replace(
      new RegExp(`(window\\.location\\.href\\s*=\\s*)\`${f}([^\`]*)\``, "g"),
      (_, prefix, extra) =>
        `${prefix}new URL(\`${canonical}${extra}\`, document.baseURI).href`
    );

    // Existing new URL("filename.html[extra]", document.baseURI) — update path only
    out = out.replace(
      new RegExp(`new URL\\("${f}([^"]*)",\\s*document\\.baseURI\\)`, "g"),
      (_, extra) => `new URL("${canonical}${extra}", document.baseURI)`
    );
    out = out.replace(
      new RegExp(`new URL\\('${f}([^']*)',\\s*document\\.baseURI\\)`, "g"),
      (_, extra) => `new URL('${canonical}${extra}', document.baseURI)`
    );
  }
  return out;
}

// ── Walk domain HTML folders ──────────────────────────────────────────────────
function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walkDir(full));
    else if (e.isFile() && e.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const domainDirs = [
  "app", "lms", "games", "practice", "onboarding", "support",
  "settings", "commerce", "community",
  path.join("account", "auth"), path.join("account", "profile"),
];

let htmlPatched = 0, jsPatched = 0, deleted = 0;

// Patch HTML files in domain subfolders
for (const d of domainDirs) {
  for (const file of walkDir(path.join(webRoot, d))) {
    const original = fs.readFileSync(file, "utf8");
    const patched = patchHtml(original);
    if (patched !== original) {
      fs.writeFileSync(file, patched);
      console.log(`HTML: ${path.relative(webRoot, file)}`);
      htmlPatched++;
    }
  }
}

// Patch all shared JS files
const jsDir = path.join(webRoot, "js");
for (const name of fs.readdirSync(jsDir)) {
  if (!name.endsWith(".js")) continue;
  const file = path.join(jsDir, name);
  const original = fs.readFileSync(file, "utf8");
  const patched = patchJs(original);
  if (patched !== original) {
    fs.writeFileSync(file, patched);
    console.log(`JS:   js/${name}`);
    jsPatched++;
  }
}

// Delete root compat redirects
for (const e of fs.readdirSync(webRoot, { withFileTypes: true })) {
  if (!e.isFile() || !e.name.endsWith(".html")) continue;
  const file = path.join(webRoot, e.name);
  if (fs.readFileSync(file, "utf8").includes("location.replace(")) {
    fs.unlinkSync(file);
    console.log(`DEL:  ${e.name}`);
    deleted++;
  }
}

console.log(
  `\nDone — HTML patched: ${htmlPatched}, JS patched: ${jsPatched}, compat deleted: ${deleted}.`
);
