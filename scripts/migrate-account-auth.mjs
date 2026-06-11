import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || "/Users/user/Desktop/CertSprints-HTML";
const webRoot = path.join(root, "web");
const targetDir = path.join(webRoot, "account", "auth");

const pages = [
  "index.html",
  "signin-password.html",
  "signin-code.html",
  "signin-check-email.html",
  "forgot-password.html",
  "forgot-check-email.html",
  "reset-password.html",
  "verify-email.html",
  "account-password.html",
  "account-code.html",
  "personal-details.html",
];

const redirectPage = (file) => {
  const target = `account/auth/${file}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CertSprints</title>
  <script>
    location.replace("${target}" + location.search + location.hash);
  </script>
</head>
<body>
  <p><a href="${target}">Continue to CertSprints</a></p>
</body>
</html>
`;
};

const addBasePath = (html) => {
  if (html.includes("<base ")) return html;
  const viewport = /(<meta name="viewport"[^>]*\/?>)/;
  if (!viewport.test(html)) throw new Error("Could not find viewport meta tag");
  return html.replace(viewport, '$1\n    <base href="../../" />');
};

const replaceOnce = (source, from, to, file) => {
  if (!source.includes(from)) throw new Error(`Expected text not found in ${file}: ${from}`);
  return source.replace(from, to);
};

fs.mkdirSync(targetDir, { recursive: true });

for (const file of pages) {
  const sourcePath = path.join(webRoot, file);
  const targetPath = path.join(targetDir, file);
  const source = fs.readFileSync(sourcePath, "utf8");
  if (source.includes(`location.replace("account/auth/${file}"`)) {
    throw new Error(`${file} is already a compatibility route; migration has already run.`);
  }
  fs.writeFileSync(targetPath, addBasePath(source));
  fs.writeFileSync(sourcePath, redirectPage(file));
  console.log(`Migrated ${file} -> web/account/auth/${file}`);
}

const appPath = path.join(webRoot, "js", "app.js");
let app = fs.readFileSync(appPath, "utf8");
app = replaceOnce(
  app,
  "        function navigateTo(url) {\n          const reduceMotion",
  "        function navigateTo(url) {\n          const targetUrl = new URL(url, document.baseURI).href;\n          const reduceMotion",
  appPath,
);
app = app.replaceAll("window.location.href = url;", "window.location.href = targetUrl;");
app = replaceOnce(
  app,
  "          const url = new URL(path, window.location.href);",
  "          const url = new URL(path, document.baseURI);",
  appPath,
);
fs.writeFileSync(appPath, app);

const checkoutPath = path.join(webRoot, "js", "checkout-flow.js");
let checkout = fs.readFileSync(checkoutPath, "utf8");
checkout = replaceOnce(
  checkout,
  "    const url = new URL(path, window.location.href);",
  "    const url = new URL(path, document.baseURI);",
  checkoutPath,
);
fs.writeFileSync(checkoutPath, checkout);

console.log("Updated shared URL helpers to resolve from document.baseURI.");
