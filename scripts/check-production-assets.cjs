const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const marker = "candidate" + "s-";

/**
 * These are files/folders that are part of the public app bundle
 * or production-facing data.
 *
 * We intentionally DO NOT scan every file under data/ml, because files like
 * feedback-model.json, preferences.json and rankings.json are internal
 * training/runtime files and may contain candidate screenshot references.
 */
const scanTargets = [
  "app",
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

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  const stat = fs.statSync(dir);

  if (stat.isFile()) {
    scanFile(dir);
    return;
  }

  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const itemStat = fs.statSync(fullPath);

    if (itemStat.isDirectory()) {
      walk(fullPath);
    } else {
      scanFile(fullPath);
    }
  }
}

for (const target of scanTargets) {
  walk(path.join(root, target));
}

if (badFiles.length > 0) {
  console.error("");
  console.error("Build blocked: public app references ML candidate screenshots.");
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
