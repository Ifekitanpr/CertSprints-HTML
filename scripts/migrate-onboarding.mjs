import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || "/Users/user/Desktop/CertSprints-HTML";
const webRoot = path.join(root, "web");
const targetDir = path.join(webRoot, "onboarding");

const pages = [
  "plan.html",
  "mapping.html",
];

const redirectPage = (file) => {
  const target = `onboarding/${file}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CertSprints Onboarding</title>
  <script>
    location.replace("${target}" + location.search + location.hash);
  </script>
</head>
<body>
  <p><a href="${target}">Continue to Onboarding</a></p>
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

fs.mkdirSync(targetDir, { recursive: true });

for (const file of pages) {
  const sourcePath = path.join(webRoot, file);
  const targetPath = path.join(targetDir, file);
  const source = fs.readFileSync(sourcePath, "utf8");
  if (source.includes(`location.replace("onboarding/${file}"`)) {
    throw new Error(`${file} is already a compatibility route; migration has already run.`);
  }
  fs.writeFileSync(targetPath, addBasePath(source));
  fs.writeFileSync(sourcePath, redirectPage(file));
  console.log(`Migrated ${file} -> web/onboarding/${file}`);
}

console.log("Onboarding migration complete.");
