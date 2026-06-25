const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const marker = "candidate" + "s-";

const scanTargets = [
  "app/page.tsx",
  "app/about",
  "app/projects",
  "components",
  "hooks",
  "lib",
  "data/portfolio.ts",
  "data/experience.ts",
  "data/ml/frontend-images.json",
  "data/ml/projects.json",
];

const badFiles = [];

function shouldScanFile(filePath) {
  return /\.(ts|tsx|js|jsx|json)$/.test(filePath);
}

function scanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  if (!shouldScanFile(filePath)) return;

  const text = fs.readFileSync(filePath, "utf8");
  const relative = path.relative(root, filePath).replace(/\\/g, "/");

  if (text.includes(marker)) {
    badFiles.push(relative);
  }
}

function walk(targetPath) {
  if (!fs.existsSync(targetPath)) return;

  const stat = fs.statSync(targetPath);

  if (stat.isFile()) {
    scanFile(targetPath);
    return;
  }

  for (const item of fs.readdirSync(targetPath)) {
    walk(path.join(targetPath, item));
  }
}

for (const target of scanTargets) {
  walk(path.join(root, target));
}

if (badFiles.length > 0) {
  console.error("");
  console.error(
    "Build blocked: public app references ML candidate screenshots.",
  );
  console.error("");

  for (const file of badFiles) {
    console.error("- " + file);
  }

  console.error("");
  console.error("Public production code must use:");
  console.error("- cover.webp");
  console.error("- slide-1.webp");
  console.error("- slide-2.webp");
  console.error("- slide-3.webp");
  console.error("");

  process.exit(1);
}

console.log("Production asset check passed.");
