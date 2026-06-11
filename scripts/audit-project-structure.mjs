import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || "/Users/user/Desktop/CertSprints-HTML";
const manifestPath = path.resolve("docs/project-route-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const webRoot = path.join(root, manifest.currentRoot);

// Root-level HTML files (should be zero now that compat redirects are removed)
const rootHtmlFiles = fs
  .readdirSync(webRoot, { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.endsWith(".html"))
  .map((e) => e.name)
  .sort();

const migrationsObj = manifest.migrations || {};
const allPages = new Set();
const duplicates = [];
const missingCanonical = [];

// Build ownership + verify canonical files exist
for (const [domain, migration] of Object.entries(migrationsObj)) {
  const pages = Array.isArray(migration) ? migration : (migration.pages || []);
  for (const page of pages) {
    if (allPages.has(page)) duplicates.push(`${page}: duplicate in ${domain}`);
    allPages.add(page);
  }
  if (migration && migration.status === "migrated" && migration.canonicalDirectory) {
    for (const page of (migration.pages || [])) {
      const canonical = path.join(root, migration.canonicalDirectory, page);
      if (!fs.existsSync(canonical)) missingCanonical.push(path.relative(root, canonical));
    }
  }
}

console.log(`Project root:       ${root}`);
console.log(`Domains/migrations: ${Object.keys(migrationsObj).length}`);
console.log(`Registered pages:   ${allPages.size}`);
console.log(`Root HTML stragglers: ${rootHtmlFiles.length}${rootHtmlFiles.length ? " ← should be 0" : ""}`);

let ok = true;

if (duplicates.length) {
  console.error("\nDuplicate page registrations:");
  duplicates.forEach((d) => console.error(`  - ${d}`));
  ok = false;
}

if (missingCanonical.length) {
  console.error("\nCanonical files missing from domain folders:");
  missingCanonical.forEach((f) => console.error(`  - ${f}`));
  ok = false;
}

if (rootHtmlFiles.length) {
  console.error("\nUnexpected HTML files at web root (should all be in domain folders):");
  rootHtmlFiles.forEach((f) => console.error(`  - ${f}`));
  ok = false;
}

if (ok) console.log("\nAll canonical files present. Web root is clean. Structure is complete.");
else process.exitCode = 1;
