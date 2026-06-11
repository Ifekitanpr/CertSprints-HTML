import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || "/Users/user/Desktop/CertSprints-HTML";
const webRoot = path.join(root, "web");
const targetDir = path.join(webRoot, "lms");

const pages = [
  "study-backlog.html",
  "lesson-player.html",
  "key-takeaway.html",
  "key-takeaway-2.html",
  "gap-prompt.html",
  "insight-exchange.html",
  "decision-simulator.html",
  "scenario-sorting.html",
  "risk-cycle-sequencer.html",
  "sorting-type-2.html",
  "boolean-flashcard.html",
  "active-recall.html",
  "blurting-canvas.html",
  "retrieval-sprint.html",
  "pre-assessment-quiz.html",
  "decision-tree.html",
  "knowledge-poll.html",
  "knowledge-poll-2.html",
  "peer-teachbacks.html",
  "comprehension-check.html",
  "lesson-quiz.html",
  "module-quiz.html",
  "mock-exam.html",
  "capability-matrix.html",
  "standard-evolution.html",
  "ethics-evolution.html",
  "standard-comparison.html",
  "ethics-comparison.html",
  "reading.html",
  "definition-matrix.html",
  "phase-controller.html",
  "curriculum.html",
  "core-terms.html",
];

const redirectPage = (file) => {
  const target = `lms/${file}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CertSprints LMS</title>
  <script>
    location.replace("${target}" + location.search + location.hash);
  </script>
</head>
<body>
  <p><a href="${target}">Continue to LMS</a></p>
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
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Skipping ${file} — source file not found.`);
    continue;
  }
  const source = fs.readFileSync(sourcePath, "utf8");
  if (source.includes(`location.replace("lms/${file}"`)) {
    throw new Error(`${file} is already a compatibility route; migration has already run.`);
  }
  fs.writeFileSync(targetPath, addBasePath(source));
  fs.writeFileSync(sourcePath, redirectPage(file));
  console.log(`Migrated ${file} -> web/lms/${file}`);
}

console.log("LMS migration complete.");
