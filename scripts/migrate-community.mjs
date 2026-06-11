import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || "/Users/user/Desktop/CertSprints-HTML";
const webRoot = path.join(root, "web");
const targetDir = path.join(webRoot, "community");

const pages = [
  "community.html",
  "community-cohort.html",
  "community-host.html",
  "community-session.html",
];

const redirectPage = (file) => {
  const target = `community/${file}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CertSprints Community</title>
  <script>
    location.replace("${target}" + location.search + location.hash);
  </script>
</head>
<body>
  <p><a href="${target}">Continue to Community</a></p>
</body>
</html>
`;
};

const addBasePath = (html) => {
  if (html.includes("<base ")) return html;
  const viewport = /(<meta name="viewport"[^>]*\/?>)/;
  if (!viewport.test(html)) throw new Error("Could not find viewport meta tag");
  return html.replace(viewport, '$1\n    <base href="../" />');
};

const replaceOnce = (file, before, after) => {
  const filePath = path.join(webRoot, file);
  const source = fs.readFileSync(filePath, "utf8");
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Could not find expected route expression in ${file}`);
  fs.writeFileSync(filePath, source.replace(before, after));
};

const replaceAll = (file, before, after) => {
  const filePath = path.join(webRoot, file);
  const source = fs.readFileSync(filePath, "utf8");
  if (!source.includes(before)) {
    if (source.includes(after)) return;
    throw new Error(`Could not find expected route expression in ${file}`);
  }
  fs.writeFileSync(filePath, source.replaceAll(before, after));
};

fs.mkdirSync(targetDir, { recursive: true });

for (const file of pages) {
  const sourcePath = path.join(webRoot, file);
  const targetPath = path.join(targetDir, file);
  const source = fs.readFileSync(sourcePath, "utf8");
  if (source.includes(`location.replace("community/${file}"`)) {
    throw new Error(`${file} is already a compatibility route; migration has already run.`);
  }
  fs.writeFileSync(targetPath, addBasePath(source));
  fs.writeFileSync(sourcePath, redirectPage(file));
  console.log(`Migrated ${file} -> web/community/${file}`);
}

replaceOnce(
  "js/community-host.js",
  'return (\n      "community-cohort.html?cohort=" +\n      encodeURIComponent(cohortId) +\n      "&tab=sessions"\n    );',
  'return new URL(\n      "community-cohort.html?cohort=" +\n        encodeURIComponent(cohortId) +\n        "&tab=sessions",\n      document.baseURI,\n    ).href;',
);
replaceOnce(
  "js/community-sessions.js",
  "return url;",
  "return new URL(url, document.baseURI).href;",
);
replaceAll(
  "js/community-chat.js",
  'window.location.href = "community.html";',
  'window.location.href = new URL("community.html", document.baseURI).href;',
);
replaceOnce(
  "js/community.js",
  'window.location.href =\n          "community-cohort.html?cohort=" + encodeURIComponent(btn.getAttribute("data-cohort-id"));',
  'window.location.href = new URL(\n          "community-cohort.html?cohort=" + encodeURIComponent(btn.getAttribute("data-cohort-id")),\n          document.baseURI,\n        ).href;',
);

const sessionPath = path.join(targetDir, "community-session.html");
const session = fs.readFileSync(sessionPath, "utf8");
const oldSessionRoute = "window.location.replace(url);";
const newSessionRoute = "window.location.replace(new URL(url, document.baseURI).href);";
if (!session.includes(newSessionRoute)) {
  if (!session.includes(oldSessionRoute)) throw new Error("Could not find community-session redirect");
  fs.writeFileSync(sessionPath, session.replace(oldSessionRoute, newSessionRoute));
}
