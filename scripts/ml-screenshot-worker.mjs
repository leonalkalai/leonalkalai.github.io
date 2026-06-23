#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { chromium } from "playwright";
import sharp from "sharp";

const root = process.cwd();
const dataDir = path.join(root, "data", "ml");
const publicDir = path.join(root, "public", "ml-screenshots");
const logFile = path.join(dataDir, "worker.log");

function log(message) {
  const line = "[" + new Date().toISOString() + "] " + message;
  console.log(line);
  fs.mkdirSync(dataDir, { recursive: true });
  fs.appendFileSync(logFile, line + "\n", "utf8");
}

function readJson(fileName, fallback) {
  try {
    const filePath = path.join(dataDir, fileName);
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(fileName, data) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    path.join(dataDir, fileName),
    JSON.stringify(data, null, 2) + "\n",
    "utf8",
  );
}

function extractDimensionsFromImagePath(imagePath) {
  const match = String(imagePath || "").match(/-(\d+)x(\d+)-[a-f0-9]+\.webp$/i);

  if (!match) {
    return { width: 0, height: 0 };
  }

  return {
    width: Number(match[1] || 0),
    height: Number(match[2] || 0),
  };
}

function getSourceTypeFromPathOrCandidate(input) {
  const value = String(
    input.sourceType || input.image || input.publicPath || "",
  ).toLowerCase();

  if (value.includes("section")) return "section";
  if (value.includes("viewport")) return "viewport";

  return "unknown";
}

function getCandidateDimensions(input) {
  const parsed = extractDimensionsFromImagePath(
    input.publicPath || input.image || "",
  );

  return {
    width: Number(input.width || parsed.width || 0),
    height: Number(input.height || parsed.height || 0),
  };
}

function getRatioBucket(width, height) {
  if (!width || !height) return "unknown";

  const ratio = width / height;

  if (ratio < 0.62) return "portrait-extreme";
  if (ratio < 0.9) return "portrait";
  if (ratio < 1.25) return "square-ish";
  if (ratio < 1.8) return "landscape";
  if (ratio < 3.2) return "wide";

  return "too-wide";
}

function getAreaBucket(width, height) {
  const area = Number(width || 0) * Number(height || 0);

  if (area < 180000) return "tiny-fragment";
  if (area < 320000) return "small";
  if (area < 720000) return "medium";
  if (area < 1500000) return "large";

  return "very-large";
}

function bucketNumber(value, size) {
  const number = Number(value || 0);

  if (!Number.isFinite(number) || number <= 0) return "0";

  return String(Math.round(number / size) * size);
}

function getVisualPattern(input) {
  const { width, height } = getCandidateDimensions(input);
  const sourceType = getSourceTypeFromPathOrCandidate(input);

  return {
    sourceType,
    ratioBucket: getRatioBucket(width, height),
    areaBucket: getAreaBucket(width, height),
    widthBucket: bucketNumber(width, 250),
    heightBucket: bucketNumber(height, 250),
  };
}

function getExactPatternKey(input) {
  const pattern = getVisualPattern(input);

  return [
    pattern.sourceType,
    pattern.ratioBucket,
    pattern.areaBucket,
    pattern.widthBucket,
    pattern.heightBucket,
  ].join("|");
}

function getBroadPatternKey(input) {
  const pattern = getVisualPattern(input);

  return [pattern.sourceType, pattern.ratioBucket, pattern.areaBucket].join(
    "|",
  );
}

function hasSevereNegativeTags(preference) {
  const tags = Array.isArray(preference.tags) ? preference.tags : [];

  return (
    tags.includes("not-desired-content") ||
    tags.includes("not-relative-content") ||
    tags.includes("important-content-not-visible") ||
    tags.includes("bad-crop") ||
    tags.includes("elements-cut-off") ||
    tags.includes("too-empty") ||
    tags.includes("too-zoomed") ||
    tags.includes("popup-overlay")
  );
}

function isNegativeTrainingPreference(preference) {
  const tags = Array.isArray(preference.tags) ? preference.tags : [];
  const isManual = preference.source === "manual";

  if (!isManual) return false;

  if (preference.rejected) return true;

  return (
    Number(preference.rating || 0) <= 1 &&
    (tags.includes("not-desired-content") ||
      tags.includes("not-relative-content") ||
      tags.includes("important-content-not-visible"))
  );
}

function buildHardNegativeModel(projectSlug) {
  const preferences = readJson("preferences.json", []);
  const exact = new Map();
  const broad = new Map();

  for (const preference of preferences) {
    if (!preference || preference.projectSlug !== projectSlug) continue;
    if (!preference.image) continue;
    if (!isNegativeTrainingPreference(preference)) continue;

    const exactKey = getExactPatternKey(preference);
    const broadKey = getBroadPatternKey(preference);

    exact.set(exactKey, (exact.get(exactKey) || 0) + 1);
    broad.set(broadKey, (broad.get(broadKey) || 0) + 1);
  }

  return { exact, broad };
}

function getHardNegativeReason(projectSlug, candidate, model) {
  const exactKey = getExactPatternKey(candidate);
  const broadKey = getBroadPatternKey(candidate);

  const exactCount = model.exact.get(exactKey) || 0;
  const broadCount = model.broad.get(broadKey) || 0;

  if (exactCount >= 1) {
    return "Matches rejected screenshot pattern: " + exactKey;
  }

  // if (broadCount >= 5) {
  //   return "Matches repeated rejected broad pattern: " + broadKey;
  // }

  return "";
}

function applyHardNegativeFilter(projectSlug, candidates) {
  const model = buildHardNegativeModel(projectSlug);

  const accepted = [];
  const rejected = [];

  for (const candidate of candidates) {
    const hardRejectReason = getHardNegativeReason(
      projectSlug,
      candidate,
      model,
    );

    if (hardRejectReason) {
      rejected.push({
        ...candidate,
        hardRejected: true,
        hardRejectReason,
        baseScore: candidate.score,
        score: -999,
      });
      continue;
    }

    accepted.push({
      ...candidate,
      hardRejected: false,
      hardRejectReason: "",
      baseScore: candidate.score,
    });
  }

  writeJson("feedback-model.json", {
    version: 2,
    updatedAt: new Date().toISOString(),
    projectSlug,
    exactPatterns: Array.from(model.exact.entries()).map(([key, count]) => ({
      key,
      count,
    })),
    broadPatterns: Array.from(model.broad.entries()).map(([key, count]) => ({
      key,
      count,
    })),
    rejectedCandidates: rejected.map((candidate) => ({
      publicPath: candidate.publicPath,
      reason: candidate.hardRejectReason,
      baseScore: candidate.baseScore,
      width: candidate.width,
      height: candidate.height,
      sourceType: candidate.sourceType,
    })),
  });

  return { accepted, rejected };
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function getCandidateFeatureKeys(projectSlug, input) {
  const { width, height } = getCandidateDimensions(input);
  const sourceType = getSourceTypeFromPathOrCandidate(input);
  const ratioBucket = getRatioBucket(width, height);
  const areaBucket = getAreaBucket(width, height);

  const sourceLabel = String(input.sourceLabel || "")
    .trim()
    .toLowerCase();
  const selector = String(input.selector || "")
    .trim()
    .toLowerCase();

  const keys = [
    "global|source:" + sourceType,
    "global|ratio:" + ratioBucket,
    "global|area:" + areaBucket,
    "global|source:" + sourceType + "|ratio:" + ratioBucket,
    "global|source:" + sourceType + "|area:" + areaBucket,
    "global|width:" + bucketNumber(width, 250),
    "global|height:" + bucketNumber(height, 250),

    "project:" + projectSlug + "|source:" + sourceType,
    "project:" + projectSlug + "|ratio:" + ratioBucket,
    "project:" + projectSlug + "|area:" + areaBucket,
    "project:" +
      projectSlug +
      "|source:" +
      sourceType +
      "|ratio:" +
      ratioBucket,
    "project:" + projectSlug + "|source:" + sourceType + "|area:" + areaBucket,
  ];

  if (sourceLabel) {
    keys.push("project:" + projectSlug + "|label:" + sourceLabel);
  }

  if (selector) {
    keys.push("project:" + projectSlug + "|selector:" + selector);
  }

  return keys;
}

function getPreferenceLearningValue(preference) {
  const tags = Array.isArray(preference.tags) ? preference.tags : [];
  const rating = Number(preference.rating || 0);

  let value = 0;

  if (preference.rejected) value -= 5;
  if (rating <= 1) value -= 3;
  if (rating === 2) value -= 2;
  if (rating === 3) value -= 0.25;
  if (rating === 4) value += 1.75;
  if (rating >= 5) value += 3;

  if (tags.includes("good-composition")) value += 1.2;
  if (tags.includes("full-section-visible")) value += 1.1;
  if (tags.includes("important-content-visible")) value += 1.2;

  if (tags.includes("bad-crop")) value -= 2;
  if (tags.includes("elements-cut-off")) value -= 1.7;
  if (tags.includes("important-content-not-visible")) value -= 2;
  if (tags.includes("not-relative-content")) value -= 2;
  if (tags.includes("not-desired-content")) value -= 2.5;
  if (tags.includes("popup-overlay")) value -= 3;
  if (tags.includes("too-empty")) value -= 1.6;
  if (tags.includes("too-zoomed")) value -= 1.4;

  return clampNumber(value, -8, 6);
}

function buildFeedbackModelFromPreferences() {
  const preferences = readJson("preferences.json", []);
  const buckets = new Map();

  for (const preference of preferences) {
    if (!preference || !preference.projectSlug || !preference.image) continue;

    const learningValue = getPreferenceLearningValue(preference);

    if (Math.abs(learningValue) < 0.25) continue;

    const keys = getCandidateFeatureKeys(preference.projectSlug, preference);

    for (const key of keys) {
      const current = buckets.get(key) || {
        key,
        count: 0,
        total: 0,
        rejected: 0,
        accepted: 0,
      };

      current.count += 1;
      current.total += learningValue;

      if (learningValue < -1) current.rejected += 1;
      if (learningValue > 1) current.accepted += 1;

      buckets.set(key, current);
    }
  }

  const weights = {};

  for (const [key, item] of buckets.entries()) {
    if (item.count < 2) continue;

    const average = item.total / item.count;
    const confidence = Math.min(1, item.count / 8);
    const weight = clampNumber(average * confidence, -4.5, 3.5);

    if (Math.abs(weight) >= 0.25) {
      weights[key] = {
        weight: Number(weight.toFixed(4)),
        count: item.count,
        rejected: item.rejected,
        accepted: item.accepted,
      };
    }
  }

  const model = {
    version: 1,
    updatedAt: new Date().toISOString(),
    sampleCount: Array.isArray(preferences) ? preferences.length : 0,
    weights,
  };

  writeJson("feedback-model.json", model);

  return model;
}

function getLearnedScoreAdjustment(projectSlug, candidate, model) {
  if (!model || !model.weights) return 0;

  const keys = getCandidateFeatureKeys(projectSlug, candidate);
  let adjustment = 0;

  for (const key of keys) {
    adjustment += Number(model.weights[key]?.weight || 0);
  }

  return clampNumber(adjustment, -6, 4);
}

function applyLearnedFeedbackToCandidate(projectSlug, candidate, model) {
  const learnedAdjustment = getLearnedScoreAdjustment(
    projectSlug,
    candidate,
    model,
  );
  const baseScore = Number(candidate.score || 0);
  const learnedScore = Number((baseScore + learnedAdjustment).toFixed(4));

  return {
    ...candidate,
    baseScore,
    learnedAdjustment,
    score: learnedScore,
  };
}

function resetProjectRuntime(projectSlug, rankings) {
  if (!projectSlug) return;

  delete rankings[projectSlug];

  fs.rmSync(path.join(publicDir, projectSlug), {
    recursive: true,
    force: true,
  });

  const frontendImages = readJson("frontend-images.json", {});
  delete frontendImages[projectSlug];
  writeJson("frontend-images.json", frontendImages);

  log("Reset runtime data for project: " + projectSlug);
}

function toPublicPath(filePath) {
  return (
    "/" +
    path.relative(path.join(root, "public"), filePath).replaceAll(path.sep, "/")
  );
}

function sanitizePlainText(text) {
  return String(text || "")
    .replace(/[<>]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700);
}

async function createPlaceholder(project, fileName, title, reason, accent) {
  const projectDir = path.join(publicDir, project.slug);
  fs.mkdirSync(projectDir, { recursive: true });

  const placeholderPath = path.join(projectDir, fileName);
  const safeTitle = sanitizePlainText(project.title);
  const safeReason = sanitizePlainText(reason);

  const svg = [
    '<svg width="1400" height="900" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg">',
    '<rect width="1400" height="900" fill="#f8fafc"/>',
    '<rect x="90" y="120" width="1220" height="660" rx="42" fill="#ffffff" stroke="' +
      accent +
      '" stroke-width="3"/>',
    '<text x="700" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="800" fill="#111827">' +
      safeTitle +
      "</text>",
    '<text x="700" y="465" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="' +
      accent +
      '">' +
      title +
      "</text>",
    '<text x="700" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#6b7280">' +
      safeReason +
      "</text>",
    "</svg>",
  ].join("");

  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(placeholderPath);

  return "/ml-screenshots/" + project.slug + "/" + fileName;
}

async function createUnavailablePlaceholder(project, reason) {
  return createPlaceholder(
    project,
    "page-unavailable.webp",
    "Page unavailable",
    reason,
    "#ef4444",
  );
}

async function createAuthRequiredPlaceholder(project, reason) {
  return createPlaceholder(
    project,
    "auth-required.webp",
    "Auth required",
    reason,
    "#f59e0b",
  );
}

async function createVerificationPlaceholder(project, reason) {
  return createPlaceholder(
    project,
    "verification-required.webp",
    "Verification required",
    reason,
    "#2563eb",
  );
}

async function handleCookieConsent(page) {
  const selectors = [
    'button:has-text("Accept")',
    'button:has-text("Accept all")',
    'button:has-text("I agree")',
    'button:has-text("Agree")',
    'button:has-text("Allow all")',
    'button:has-text("OK")',
    'button:has-text("Got it")',
    'button:has-text("Continue")',
    'button:has-text("Αποδοχή")',
    'button:has-text("Αποδοχή όλων")',
    'button:has-text("Συμφωνώ")',
    'button:has-text("Εντάξει")',
    '[id*="cookie" i] button',
    '[class*="cookie" i] button',
    '[id*="consent" i] button',
    '[class*="consent" i] button',
    '[aria-label*="accept" i]',
    '[aria-label*="agree" i]',
    '[aria-label*="close" i]',
  ];

  for (const selector of selectors) {
    try {
      const element = page.locator(selector).first();

      if (await element.isVisible({ timeout: 700 })) {
        await element.click({ timeout: 1500, force: true });
        await page.waitForTimeout(500);
        return true;
      }
    } catch {}
  }

  try {
    await page.keyboard.press("Escape");
  } catch {}

  return false;
}

async function detectLoginForm(page) {
  return await page
    .locator("input[type='password'], input[name='password']")
    .first()
    .isVisible({ timeout: 1200 })
    .catch(() => false);
}

async function detectGoogleOrVerification(page) {
  const bodyText = await page
    .locator("body")
    .innerText({ timeout: 5000 })
    .catch(() => "");
  const lower = bodyText.toLowerCase();
  const url = page.url().toLowerCase();

  if (url.includes("accounts.google.com")) return "Google auth page detected";

  if (
    lower.includes("verification code") ||
    lower.includes("verify it's you") ||
    lower.includes("2-step verification") ||
    lower.includes("enter the code") ||
    lower.includes("κωδικό επαλήθευσης") ||
    lower.includes("επαλήθευση")
  ) {
    return "Verification code required";
  }

  return "";
}

async function detectLoggedInUser(page, project) {
  const bodyText = await page
    .locator("body")
    .innerText({ timeout: 6000 })
    .catch(() => "");
  const lower = bodyText.toLowerCase();
  const username = String(project.auth?.username || "").trim();

  if (username && lower.includes(username.toLowerCase())) {
    return username;
  }

  const selectors = [
    ".user",
    ".username",
    ".profile",
    ".account",
    ".navbar .dropdown",
    "[class*='user' i]",
    "[class*='profile' i]",
    "[class*='account' i]",
  ];

  for (const selector of selectors) {
    try {
      const text = await page
        .locator(selector)
        .first()
        .innerText({ timeout: 1200 });
      const cleaned = sanitizePlainText(text);
      if (cleaned && cleaned.length <= 80) return cleaned;
    } catch {}
  }

  return username || "Authenticated user";
}

async function detectLoginLink(page, sourceUrl, project) {
  const configuredSelector =
    project.auth?.loginLinkSelector ||
    "a#Login, a[href*='login'], a:has-text('Login'), a:has-text('Sign in'), a:has-text('Σύνδεση')";

  const selectors = [
    configuredSelector,
    "a#Login",
    "a[href*='login']",
    "a[href*='signin']",
    "a:has-text('Login')",
    "a:has-text('Sign in')",
    "a:has-text('Σύνδεση')",
  ];

  for (const selector of selectors) {
    try {
      const locator = page.locator(selector).first();

      if (!(await locator.isVisible({ timeout: 1000 }).catch(() => false))) {
        continue;
      }

      const href = await locator.getAttribute("href").catch(() => "");

      if (!href) continue;

      const resolved = new URL(href, sourceUrl).toString();

      return {
        method: "login-link",
        loginUrl: resolved,
        detectedSelector: selector,
      };
    } catch {}
  }

  return null;
}

async function fillLoginFormOnCurrentPage(page, auth) {
  const usernameSelector =
    auth.usernameSelector ||
    "input[type='email'], input[name='email'], input[name='username'], input[type='text']";

  const passwordSelector =
    auth.passwordSelector || "input[type='password'], input[name='password']";

  const submitSelector =
    auth.submitSelector ||
    "button[type='submit'], input[type='submit'], button:has-text('Login'), button:has-text('Sign in'), button:has-text('Σύνδεση')";

  const usernameInput = page.locator(usernameSelector).first();
  const passwordInput = page.locator(passwordSelector).first();

  const usernameVisible = await usernameInput
    .isVisible({ timeout: 8000 })
    .catch(() => false);
  const passwordVisible = await passwordInput
    .isVisible({ timeout: 8000 })
    .catch(() => false);

  if (!usernameVisible)
    return { ok: false, reason: "Login username/email field not found" };
  if (!passwordVisible)
    return { ok: false, reason: "Login password field not found" };

  await usernameInput.fill(String(auth.username || ""), { timeout: 8000 });
  await passwordInput.fill(String(auth.password || ""), { timeout: 8000 });

  const submitButton = page.locator(submitSelector).first();
  const submitVisible = await submitButton
    .isVisible({ timeout: 3000 })
    .catch(() => false);

  if (submitVisible) {
    await Promise.all([
      page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {}),
      submitButton.click({ timeout: 8000, force: true }),
    ]);
  } else {
    await Promise.all([
      page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {}),
      passwordInput.press("Enter", { timeout: 5000 }),
    ]).catch(async () => {
      await page.keyboard.press("Enter");
    });
  }

  await page.waitForTimeout(1600);

  const verificationReason = await detectGoogleOrVerification(page);

  if (verificationReason) {
    return {
      ok: false,
      verificationRequired: true,
      reason: verificationReason,
    };
  }

  return { ok: true, reason: "Login submitted" };
}

async function verifyTargetAfterLogin(page, auth) {
  const currentUrl = page.url();
  const bodyText = await page
    .locator("body")
    .innerText({ timeout: 7000 })
    .catch(() => "");
  const lower = bodyText.toLowerCase();

  if (await detectLoginForm(page)) {
    return { ok: false, reason: "Target still shows login form after login" };
  }

  const verificationReason = await detectGoogleOrVerification(page);

  if (verificationReason) {
    return {
      ok: false,
      verificationRequired: true,
      reason: verificationReason,
    };
  }

  if (
    auth.expectedUrlIncludes &&
    !currentUrl.includes(auth.expectedUrlIncludes)
  ) {
    return {
      ok: false,
      reason:
        "Expected URL to include '" +
        auth.expectedUrlIncludes +
        "' but current URL is " +
        currentUrl,
    };
  }

  if (
    auth.expectedContentIncludes &&
    !lower.includes(String(auth.expectedContentIncludes).toLowerCase())
  ) {
    return {
      ok: false,
      reason:
        "Expected page content to include '" +
        auth.expectedContentIncludes +
        "' after login.",
    };
  }

  return { ok: true, reason: "Target verified after login" };
}

async function runAuthFlow(page, project, sourceUrl, detectedLogin) {
  const auth = project.auth || { type: "none" };
  const authType = auth.type || "none";

  if (authType === "none")
    return { ok: true, reason: "No auth configured", loggedIn: false };

  if (authType === "google" || authType === "manual-session") {
    return {
      ok: false,
      verificationRequired: true,
      reason:
        "This project uses " +
        authType +
        ". Enter verification code or use manual session support before capture.",
    };
  }

  if (!auth.username || !auth.password) {
    return {
      ok: false,
      authRequired: true,
      reason: "Username/email and password are required.",
      authDetection: detectedLogin || null,
    };
  }

  let loginUrl = auth.loginUrl || detectedLogin?.loginUrl || "";
  if (!loginUrl && authType === "form") loginUrl = sourceUrl;

  if (!loginUrl) {
    return {
      ok: false,
      authRequired: true,
      reason: "Login URL is required.",
      authDetection: detectedLogin || null,
    };
  }

  log(project.slug + ": opening login URL " + loginUrl);

  await page.goto(loginUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page
    .waitForLoadState("networkidle", { timeout: 18000 })
    .catch(() => {});
  await page.waitForTimeout(1200);
  await handleCookieConsent(page);

  if (!(await detectLoginForm(page))) {
    return {
      ok: false,
      authRequired: true,
      reason: "Login URL opened but no password field was found.",
      authDetection: detectedLogin || {
        method: "login-url",
        loginUrl,
        detectedSelector: auth.loginLinkSelector || "",
      },
    };
  }

  const loginResult = await fillLoginFormOnCurrentPage(page, auth);
  if (!loginResult.ok) return loginResult;

  log(project.slug + ": reopening target after login " + sourceUrl);

  await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page
    .waitForLoadState("networkidle", { timeout: 18000 })
    .catch(() => {});
  await page.waitForTimeout(1600);
  await handleCookieConsent(page);

  const verified = await verifyTargetAfterLogin(page, auth);

  if (!verified.ok) return verified;

  const userLabel = await detectLoggedInUser(page, project);

  return {
    ok: true,
    reason: verified.reason,
    loggedIn: true,
    userLabel,
  };
}

async function pageLooksEmpty(page) {
  try {
    return await page.evaluate(() => {
      const body = document.body;
      const documentElement = document.documentElement;
      const scrollHeight = Math.max(
        body?.scrollHeight || 0,
        documentElement?.scrollHeight || 0,
        body?.offsetHeight || 0,
        documentElement?.offsetHeight || 0,
      );

      const visibleNodes = Array.from(
        document.querySelectorAll(
          "img, video, canvas, svg, section, article, main, header, footer, .card, .container, .elementor, .elementor-section, .wp-site-blocks, .site-content",
        ),
      ).filter((node) => {
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return (
          rect.width >= 80 &&
          rect.height >= 40 &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity || "1") > 0
        );
      }).length;

      return scrollHeight < 300 && visibleNodes < 2;
    });
  } catch {
    return false;
  }
}

async function validateLoadedPage(page, response) {
  const status = response?.status?.() || 0;

  if (status >= 400)
    return { ok: false, kind: "unavailable", reason: "HTTP status " + status };

  const bodyText = await page
    .locator("body")
    .innerText({ timeout: 7000 })
    .catch(() => "");
  const lower = bodyText.toLowerCase();

  const verificationReason = await detectGoogleOrVerification(page);
  if (verificationReason)
    return {
      ok: false,
      kind: "verification-required",
      reason: verificationReason,
    };

  if (await detectLoginForm(page))
    return {
      ok: false,
      kind: "auth-required",
      reason: "Login form detected on target page",
    };

  const badPatterns = [
    "application error",
    "server-side exception",
    "internal server error",
    "this page could not be found",
    "digest:",
    "runtime error",
    "service unavailable",
  ];

  const matched = badPatterns.find((pattern) => lower.includes(pattern));
  if (matched)
    return {
      ok: false,
      kind: "unavailable",
      reason: "Detected error page: " + matched,
    };

  const visibleTextLength = sanitizePlainText(bodyText).length;
  const empty = await pageLooksEmpty(page);

  if (visibleTextLength < 20 && empty)
    return {
      ok: false,
      kind: "unavailable",
      reason: "Page content appears empty",
    };

  return { ok: true, kind: "ready", reason: "Page loaded" };
}

async function getSectionLocators(page) {
  const selectors = [
    "main section",
    "section",
    "article",
    "main > div",
    ".page-content",
    ".entry-content",
    ".site-content",
    ".wp-site-blocks",
    ".elementor-section",
    ".elementor-container",
    ".container",
    ".wrapper",
    ".dashboard",
    ".portfolio",
    ".projects",
    ".hero",
    ".section",
  ];

  const candidates = [];
  const seen = new Set();

  for (const selector of selectors) {
    const count = await page
      .locator(selector)
      .count()
      .catch(() => 0);

    for (let index = 0; index < Math.min(count, 14); index += 1) {
      const locator = page.locator(selector).nth(index);
      const box = await locator.boundingBox().catch(() => null);

      if (!box) continue;

      const width = box.width;
      const height = box.height;
      const area = width * height;
      const ratio = height > 0 ? width / height : 1;

      if (width < 650) continue;
      if (height < 320) continue;
      if (area < 320000) continue;
      if (height > 1800) continue;
      if (ratio > 3.3) continue;
      if (ratio < 0.55) continue;

      const quality = await locator
        .evaluate((node) => {
          const element = node;
          const text = (element.innerText || "").replace(/\s+/g, " ").trim();

          const images = element.querySelectorAll(
            "img, picture, video, canvas, svg",
          ).length;
          const buttons = element.querySelectorAll(
            "button, input[type='button'], input[type='submit'], a.button, .button",
          ).length;
          const fields = element.querySelectorAll(
            "input, textarea, select",
          ).length;
          const headings = element.querySelectorAll("h1, h2, h3, h4").length;
          const paragraphs = element.querySelectorAll("p, li").length;
          const children = element.querySelectorAll("*").length;

          return {
            textLength: text.length,
            images,
            buttons,
            fields,
            headings,
            paragraphs,
            children,
          };
        })
        .catch(() => ({
          textLength: 0,
          images: 0,
          buttons: 0,
          fields: 0,
          headings: 0,
          paragraphs: 0,
          children: 0,
        }));

      const hasMeaningfulContent =
        quality.textLength >= 80 ||
        quality.images >= 2 ||
        quality.headings >= 1 ||
        quality.paragraphs >= 2;

      const looksLikeSingleControl =
        quality.buttons >= 1 &&
        quality.children < 8 &&
        quality.textLength < 80 &&
        quality.images === 0;

      const looksLikeTinyForm =
        quality.fields > 0 &&
        quality.children < 14 &&
        quality.textLength < 120 &&
        height < 520;

      const looksLikeSingleImage =
        quality.images === 1 &&
        quality.textLength < 80 &&
        quality.children < 10;

      if (!hasMeaningfulContent) continue;
      if (looksLikeSingleControl) continue;
      if (looksLikeTinyForm) continue;
      if (looksLikeSingleImage) continue;

      const key =
        Math.round(box.x) +
        ":" +
        Math.round(box.y) +
        ":" +
        Math.round(width) +
        ":" +
        Math.round(height);

      if (seen.has(key)) continue;
      seen.add(key);

      candidates.push({
        selector,
        index,
        locator,
        width,
        height,
        quality,
      });
    }
  }

  candidates.sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;

    const contentA =
      a.quality.textLength +
      a.quality.images * 180 +
      a.quality.headings * 160 +
      a.quality.paragraphs * 80;

    const contentB =
      b.quality.textLength +
      b.quality.images * 180 +
      b.quality.headings * 160 +
      b.quality.paragraphs * 80;

    return contentB + areaB * 0.001 - (contentA + areaA * 0.001);
  });

  return candidates.slice(0, 24);
}

function calculateCropScore(candidate) {
  const width = Number(candidate.width || 0);
  const height = Number(candidate.height || 0);
  const area = width * height;
  const ratio = height > 0 ? width / height : 1;

  let score = 0.45;

  if (candidate.sourceType === "section") score += 0.25;

  if (width >= 650) score += 0.12;
  if (width >= 900) score += 0.08;

  if (height >= 320 && height <= 1200) score += 0.18;
  if (height >= 450 && height <= 1200) score += 0.08;

  if (area >= 320000) score += 0.12;
  if (area >= 600000) score += 0.08;

  if (height < 260) score -= 0.35;
  if (width < 520) score -= 0.32;
  if (area < 180000) score -= 0.38;

  if (ratio > 3.2 || ratio < 0.62) score -= 0.28;

  if (candidate.sourceType === "viewport") score -= 0.05;

  return Math.max(0, Math.min(1, score));
}

async function scoreScreenshotBasic(filePath) {
  const image = sharp(filePath);
  const metadata = await image.metadata();
  const stats = await image.stats();
  const channels = stats.channels || [];

  const avg =
    channels.slice(0, 3).reduce((sum, channel) => sum + channel.mean, 0) /
    Math.max(1, Math.min(3, channels.length));

  const variance =
    channels.slice(0, 3).reduce((sum, channel) => sum + channel.stdev, 0) /
    Math.max(1, Math.min(3, channels.length));

  const aspectScore =
    metadata.width && metadata.height
      ? Math.min(metadata.width / metadata.height, 2.2)
      : 1;

  const notBlankScore = Math.min(1, variance / 45);
  const brightnessPenalty = avg > 248 || avg < 8 ? 0.3 : 1;
  const score = notBlankScore * brightnessPenalty + aspectScore * 0.08;

  return Number(score.toFixed(4));
}

async function saveElementCandidateScreenshot(
  page,
  candidate,
  candidatesDir,
  sectionIndex,
  sourceIndex,
) {
  const hash = crypto.randomBytes(5).toString("hex");

  const safeName =
    "source-" +
    sourceIndex +
    "-section-" +
    String(sectionIndex).padStart(2, "0") +
    "-" +
    Math.round(candidate.width) +
    "x" +
    Math.round(candidate.height) +
    "-" +
    hash;

  const pngPath = path.join(candidatesDir, safeName + ".png");
  const webpPath = path.join(candidatesDir, safeName + ".webp");

  await candidate.locator.scrollIntoViewIfNeeded({ timeout: 5000 });
  await page.waitForTimeout(500);
  await handleCookieConsent(page);

  await candidate.locator.screenshot({ path: pngPath, timeout: 15000 });

  await sharp(pngPath)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(webpPath);

  fs.unlinkSync(pngPath);

  return webpPath;
}

async function saveViewportCandidateScreenshot(
  page,
  candidatesDir,
  candidate,
  sourceIndex,
) {
  const hash = crypto.randomBytes(5).toString("hex");

  const safeName =
    "source-" +
    sourceIndex +
    "-viewport-" +
    String(candidate.index).padStart(2, "0") +
    "-" +
    Math.round(candidate.width) +
    "x" +
    Math.round(candidate.height) +
    "-" +
    hash;

  const pngPath = path.join(candidatesDir, safeName + ".png");
  const webpPath = path.join(candidatesDir, safeName + ".webp");

  await page.screenshot({ path: pngPath, fullPage: false, timeout: 15000 });

  await sharp(pngPath)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(webpPath);

  fs.unlinkSync(pngPath);

  return webpPath;
}

function getProjectSources(project) {
  if (Array.isArray(project.sourceUrls) && project.sourceUrls.length > 0) {
    return project.sourceUrls.filter((item) => item && item.url);
  }
  return [{ label: "Main page", url: project.url }];
}

async function gotoAndValidateTarget(page, project, source) {
  log(project.slug + ": opening target " + source.url);

  let response = await page.goto(source.url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page
    .waitForLoadState("networkidle", { timeout: 18000 })
    .catch(() => {});
  await page.waitForTimeout(1600);
  await handleCookieConsent(page);
  await page.waitForTimeout(500);

  let validation = await validateLoadedPage(page, response);
  const detectedLogin = await detectLoginLink(page, source.url, project);

  if (
    !validation.ok &&
    (validation.kind === "auth-required" ||
      validation.kind === "verification-required")
  ) {
    if (validation.kind === "verification-required") {
      return {
        ok: false,
        kind: "verification-required",
        reason: validation.reason,
      };
    }

    const authResult = await runAuthFlow(
      page,
      project,
      source.url,
      detectedLogin,
    );

    if (!authResult.ok) {
      return {
        ok: false,
        kind: authResult.verificationRequired
          ? "verification-required"
          : "auth-required",
        reason: authResult.reason,
        authDetection: authResult.authDetection || detectedLogin || null,
        authSession: {
          loggedIn: false,
          userLabel: project.auth?.username || "",
          reason: authResult.reason,
        },
      };
    }

    validation = await validateLoadedPage(page, { status: () => 200 });

    return {
      ...validation,
      authDetection: detectedLogin || null,
      authSession: {
        loggedIn: true,
        userLabel:
          authResult.userLabel ||
          project.auth?.username ||
          "Authenticated user",
        reason: authResult.reason,
      },
    };
  }

  if (validation.ok && detectedLogin && project.auth?.type !== "none") {
    const authResult = await runAuthFlow(
      page,
      project,
      source.url,
      detectedLogin,
    );

    if (!authResult.ok) {
      return {
        ok: false,
        kind: authResult.verificationRequired
          ? "verification-required"
          : "auth-required",
        reason: authResult.reason,
        authDetection: authResult.authDetection || detectedLogin || null,
        authSession: {
          loggedIn: false,
          userLabel: project.auth?.username || "",
          reason: authResult.reason,
        },
      };
    }

    validation = await validateLoadedPage(page, { status: () => 200 });

    return {
      ...validation,
      authDetection: detectedLogin || null,
      authSession: {
        loggedIn: true,
        userLabel:
          authResult.userLabel ||
          project.auth?.username ||
          "Authenticated user",
        reason: authResult.reason,
      },
    };
  }

  return {
    ...validation,
    authDetection: detectedLogin || null,
    authSession: {
      loggedIn: false,
      userLabel: "",
      reason: detectedLogin
        ? "Login link detected, but auth type is none."
        : "No login required or no login detected.",
    },
  };
}

function getEffectiveScreenshotMax(project, job) {
  const useGlobal = Boolean(job?.config?.useGlobalScreenshotLimits);
  const globalMax = Number(job?.config?.globalMaxScreenshots || 6);
  const projectMax = Number(project.screenshotMax || 0);

  const max = useGlobal ? globalMax : projectMax > 0 ? projectMax : globalMax;

  return Math.max(1, Math.min(80, max));
}

function getEffectiveScreenshotMin(project, job) {
  const useGlobal = Boolean(job?.config?.useGlobalScreenshotLimits);
  const globalMin = Number(job?.config?.globalMinScreenshots || 2);
  const projectMin = Number(project.screenshotMin || 0);

  const min = useGlobal ? globalMin : projectMin > 0 ? projectMin : globalMin;

  return Math.max(0, Math.min(80, min));
}

function getAutoRating(candidate, index) {
  const learnedAdjustment = Number(candidate.learnedAdjustment || 0);
  const score = Number(candidate.score || 0);
  const basicScore = Number(candidate.basicScore || 0);
  const cropScore = Number(candidate.cropScore || 0);
  const width = Number(candidate.width || 0);
  const height = Number(candidate.height || 0);
  const ratio = height > 0 ? width / height : 1;
  const area = width * height;
  const sourceType = String(candidate.sourceType || "");

  let rating = 3;

  if (score >= 0.95) rating = 5;
  else if (score >= 0.78) rating = 4;
  else if (score >= 0.55) rating = 3;
  else if (score >= 0.35) rating = 2;
  else rating = 1;

  let penalty = 0;

  if (area < 180000) penalty += 1.4;
  if (width < 520) penalty += 1.1;
  if (height < 260) penalty += 1.1;
  if (ratio > 3.2 || ratio < 0.62) penalty += 1.0;
  if (cropScore < 0.42) penalty += 1.1;
  if (basicScore < 0.28) penalty += 1.1;
  if (sourceType === "viewport") penalty += 0.25;

  rating = Math.round(rating - penalty);

  if (index === 0 && rating < 3 && score >= 0.72 && area >= 320000) {
    rating = 3;
  }

  if (learnedAdjustment <= -3) rating -= 2;
  else if (learnedAdjustment <= -1.5) rating -= 1;
  else if (learnedAdjustment >= 2) rating += 1;

  return Math.max(1, Math.min(5, rating));
}

function normalizeExclusiveTags(tags) {
  const output = new Set(tags);

  function prefer(positive, negative) {
    if (output.has(positive) && output.has(negative)) {
      if (
        negative === "important-content-not-visible" ||
        negative === "elements-cut-off" ||
        negative === "bad-crop"
      ) {
        output.delete(positive);
      } else {
        output.delete(negative);
      }
    }
  }

  prefer("important-content-visible", "important-content-not-visible");
  prefer("full-section-visible", "elements-cut-off");
  prefer("good-composition", "bad-crop");

  return Array.from(output);
}

function getAutoTags(candidate, rating) {
  const tags = [];

  const basicScore = Number(candidate.basicScore || 0);
  const cropScore = Number(candidate.cropScore || 0);
  const width = Number(candidate.width || 0);
  const height = Number(candidate.height || 0);
  const ratio = height > 0 ? width / height : 1;
  const sourceType = String(candidate.sourceType || "");
  const area = width * height;
  const learnedAdjustment = Number(candidate.learnedAdjustment || 0);

  const isBroadArea = area >= 320000 && width >= 650 && height >= 320;
  const isTinyOrFragment = area < 180000 || width < 520 || height < 260;
  const isBadRatio = ratio > 3.2 || ratio < 0.62;

  if (
    sourceType === "section" &&
    isBroadArea &&
    cropScore >= 0.55 &&
    !isBadRatio
  ) {
    tags.push("full-section-visible");
  }

  if (rating >= 4 && basicScore >= 0.42 && cropScore >= 0.55 && isBroadArea) {
    tags.push("good-composition");
    tags.push("important-content-visible");
  }

  if (isTinyOrFragment || cropScore < 0.42 || isBadRatio) {
    tags.push("important-content-not-visible");
    tags.push("elements-cut-off");
  }

  if (cropScore < 0.38 || isBadRatio) {
    tags.push("bad-crop");
  }

  if (basicScore < 0.25) {
    tags.push("too-empty");
    tags.push("not-desired-content");
  }

  if (sourceType === "viewport" && rating <= 3) {
    tags.push("not-relative-content");
  }

  if (rating <= 2) {
    tags.push("not-desired-content");
  }

  if (learnedAdjustment <= -3) {
    tags.push("not-desired-content");
  }

  if (learnedAdjustment <= -1.5) {
    tags.push("important-content-not-visible");
  }

  if (learnedAdjustment >= 2 && rating >= 4) {
    tags.push("good-composition");
    tags.push("important-content-visible");
  }

  return normalizeExclusiveTags(tags);
}

function applyAutoPreferences(projectSlug, finalCandidates, job) {
  if (job?.config?.autoSmartSelections === false) return;

  const preferences = readJson("preferences.json", []);
  const existing = new Set(
    preferences.map((item) => item.projectSlug + "__" + item.image),
  );
  const now = new Date().toISOString();

  finalCandidates.forEach((candidate, index) => {
    if (candidate.hardRejected) return;

    const key = projectSlug + "__" + candidate.publicPath;
    if (existing.has(key)) return;

    const rating = getAutoRating(candidate, index);

    preferences.push({
      projectSlug,
      image: candidate.publicPath,
      rating,
      tags: getAutoTags(candidate, rating),
      notes: "Auto smart selection",
      source: "auto",
      createdAt: now,
      updatedAt: now,
    });
  });

  writeJson("preferences.json", preferences);
}

async function captureProject(browser, project, job) {
  const projectDir = path.join(publicDir, project.slug);
  const runId = String(Date.now());
  const candidatesDir = path.join(projectDir, "candidates-" + runId);
  const maxScreenshots = getEffectiveScreenshotMax(project, job);
  const minScreenshots = getEffectiveScreenshotMin(project, job);
  const candidatePoolLimit = Math.max(
    maxScreenshots * 4,
    minScreenshots * 4,
    maxScreenshots + 12,
  );

  fs.mkdirSync(projectDir, { recursive: true });
  fs.mkdirSync(candidatesDir, { recursive: true });

  if (project.useForMl === false || project.disabled === true) {
    return {
      slug: project.slug,
      title: project.title,
      cover: null,
      slides: [],
      candidates: [],
      candidateMeta: [],
      status: "skipped",
      score: 0,
      personal: Boolean(project.personal),
      ownership: project.ownership || "",
      company: project.company || "",
      companyUrl: project.companyUrl || "",
      authSession: { loggedIn: false, reason: "Project skipped" },
      message:
        "This project is disabled and was skipped. No screenshots were created.",
      updatedAt: new Date().toISOString(),
    };
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();
  page.setDefaultTimeout(45000);

  const candidates = [];
  const sources = getProjectSources(project);
  const failureReasons = [];
  let lastAuthDetection = null;
  let lastAuthSession = { loggedIn: false, reason: "No auth attempted" };
  let lastFailureKind = "unavailable";

  const viewports = [
    {
      name: "desktop",
      width: 1440,
      height: 1000,
      scrolls: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
    },
    {
      name: "wide",
      width: 1600,
      height: 1000,
      scrolls: [0, 0.25, 0.5, 0.75],
    },
    {
      name: "tablet",
      width: 1024,
      height: 900,
      scrolls: [0, 0.25, 0.5, 0.75],
    },
    {
      name: "mobile",
      width: 390,
      height: 844,
      scrolls: [0, 0.25, 0.5, 0.75],
    },
  ];

  try {
    for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex += 1) {
      if (candidates.length >= candidatePoolLimit) break;

      const source = sources[sourceIndex];

      for (const viewport of viewports) {
        if (candidates.length >= candidatePoolLimit) break;

        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });

        let validation;

        try {
          validation = await gotoAndValidateTarget(page, project, source);
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          failureReasons.push(source.url + " failed to open: " + reason);
          continue;
        }

        if (validation.authDetection)
          lastAuthDetection = validation.authDetection;
        if (validation.authSession) lastAuthSession = validation.authSession;

        if (!validation.ok) {
          lastFailureKind = validation.kind || "unavailable";
          failureReasons.push(source.url + ": " + validation.reason);
          continue;
        }

        const sectionCandidates = await getSectionLocators(page);
        let sectionIndex = 0;

        for (const sectionCandidate of sectionCandidates) {
          if (sectionIndex >= 16) break;
          if (candidates.length >= candidatePoolLimit) break;

          try {
            const candidateBase = {
              sourceType: "section",
              index: sectionIndex,
              width: sectionCandidate.width,
              height: sectionCandidate.height,
              selector:
                sectionCandidate.selector +
                ":nth(" +
                sectionCandidate.index +
                ")",
            };

            const webpPath = await saveElementCandidateScreenshot(
              page,
              sectionCandidate,
              candidatesDir,
              sectionIndex,
              sourceIndex,
            );

            const basicScore = await scoreScreenshotBasic(webpPath);
            const cropScore = calculateCropScore(candidateBase);
            const score = Number((basicScore + cropScore * 0.35).toFixed(4));

            candidates.push({
              file: webpPath,
              publicPath: toPublicPath(webpPath),
              score,
              basicScore,
              cropScore,
              sourceType: "section",
              selector: candidateBase.selector,
              sourceLabel: source.label || "Page",
              sourceUrl: source.url,
              personal: Boolean(project.personal),
              ownership: project.ownership || "",
              company: project.company || "",
              width: candidateBase.width,
              height: candidateBase.height,
            });

            sectionIndex += 1;
          } catch (error) {
            log(
              project.slug +
                ": section skipped: " +
                (error instanceof Error ? error.message : String(error)),
            );
          }
        }

        const pageHeight = await page.evaluate(() => {
          return Math.max(
            document.documentElement.scrollHeight || 0,
            document.body.scrollHeight || 0,
            document.documentElement.offsetHeight || 0,
            document.body.offsetHeight || 0,
          );
        });

        let viewportIndex = 0;

        for (const scroll of viewport.scrolls) {
          if (candidates.length >= candidatePoolLimit) break;

          try {
            const y = Math.max(
              0,
              Math.floor(Math.max(0, pageHeight - viewport.height) * scroll),
            );

            await page.evaluate((nextY) => {
              window.scrollTo({ top: nextY, left: 0, behavior: "instant" });
            }, y);

            await page.waitForTimeout(800);
            await handleCookieConsent(page);

            const candidateBase = {
              sourceType: "viewport",
              index: viewportIndex,
              width: viewport.width,
              height: viewport.height,
              selector: viewport.name + "-scroll-" + Math.round(scroll * 100),
            };

            const webpPath = await saveViewportCandidateScreenshot(
              page,
              candidatesDir,
              candidateBase,
              sourceIndex,
            );

            const basicScore = await scoreScreenshotBasic(webpPath);
            const cropScore = calculateCropScore(candidateBase);
            const score = Number((basicScore + cropScore * 0.35).toFixed(4));

            candidates.push({
              file: webpPath,
              publicPath: toPublicPath(webpPath),
              score,
              basicScore,
              cropScore,
              sourceType: "viewport",
              selector: candidateBase.selector,
              sourceLabel: source.label || "Page",
              sourceUrl: source.url,
              personal: Boolean(project.personal),
              ownership: project.ownership || "",
              company: project.company || "",
              width: candidateBase.width,
              height: candidateBase.height,
            });

            viewportIndex += 1;
          } catch (error) {
            log(
              project.slug +
                ": viewport skipped: " +
                (error instanceof Error ? error.message : String(error)),
            );
          }
        }
      }
    }
  } finally {
    await context.close();
  }

  if (candidates.length === 0) {
    const reason =
      failureReasons.length > 0
        ? failureReasons.join(" | ").slice(0, 1000)
        : "No valid screenshot candidates were captured from the configured source URLs.";

    let status = "unavailable";
    let placeholder = await createUnavailablePlaceholder(project, reason);
    let message =
      "No valid screenshots were captured from the configured source URLs.";

    if (lastFailureKind === "auth-required") {
      status = "auth-required";
      placeholder = await createAuthRequiredPlaceholder(project, reason);
      message = "This page requires login. Add login credentials in Phase 1.";
    }

    if (lastFailureKind === "verification-required") {
      status = "verification-required";
      placeholder = await createVerificationPlaceholder(project, reason);
      message = "This page requires verification code or manual session.";
    }

    return {
      slug: project.slug,
      title: project.title,
      cover: placeholder,
      slides: [],
      candidates: [],
      candidateMeta: [],
      status,
      score: 0,
      personal: Boolean(project.personal),
      ownership: project.ownership || "",
      company: project.company || "",
      companyUrl: project.companyUrl || "",
      unavailableReason: reason,
      authDetection: lastAuthDetection || undefined,
      authSession: lastAuthSession,
      message,
      updatedAt: new Date().toISOString(),
    };
  }

  const feedbackModel = buildFeedbackModelFromPreferences();

  const learnedCandidates = candidates.map((candidate) => {
    return applyLearnedFeedbackToCandidate(
      project.slug,
      candidate,
      feedbackModel,
    );
  });

  const filteredByLearning = applyHardNegativeFilter(
    project.slug,
    learnedCandidates,
  );

  const acceptedCandidates = filteredByLearning.accepted;

  acceptedCandidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Number(b.baseScore || 0) - Number(a.baseScore || 0);
  });

  const finalCandidates = acceptedCandidates.slice(0, maxScreenshots);

  log(
    "Learning filter for " +
      project.slug +
      ": pool=" +
      candidates.length +
      "/" +
      candidatePoolLimit +
      ", learned=" +
      learnedCandidates.length +
      ", accepted=" +
      acceptedCandidates.length +
      ", removed=" +
      filteredByLearning.rejected.length +
      ", final=" +
      finalCandidates.length +
      "/" +
      maxScreenshots,
  );

  const selected = finalCandidates.slice(0, 4);
  const cover = selected[0];
  const slides = selected.slice(1, 4);

  if (cover) fs.copyFileSync(cover.file, path.join(projectDir, "cover.webp"));

  slides.forEach((slide, index) => {
    fs.copyFileSync(
      slide.file,
      path.join(projectDir, "slide-" + (index + 1) + ".webp"),
    );
  });

  applyAutoPreferences(project.slug, finalCandidates, job);

  const minWarning =
    finalCandidates.length < minScreenshots
      ? " Only " +
        finalCandidates.length +
        " acceptable screenshots remained after learning filter. Desired minimum is " +
        minScreenshots +
        ". Rerun or adjust source URLs to capture different sections."
      : "";

  const learnedFilterMessage =
    filteredByLearning.rejected.length > 0
      ? " Learning filter removed " +
        filteredByLearning.rejected.length +
        " screenshot(s) similar to rejected feedback."
      : "";

  return {
    slug: project.slug,
    title: project.title,
    cover: cover ? "/ml-screenshots/" + project.slug + "/cover.webp" : null,
    slides: slides.map(
      (_, index) =>
        "/ml-screenshots/" + project.slug + "/slide-" + (index + 1) + ".webp",
    ),
    candidates: finalCandidates.map((item) => item.publicPath),
    candidateMeta: finalCandidates.map((item) => ({
      publicPath: item.publicPath,
      score: item.score,
      basicScore: item.basicScore,
      cropScore: item.cropScore,
      learnedAdjustment: item.learnedAdjustment || 0,
      baseScore: item.baseScore || item.score,
      hardRejected: Boolean(item.hardRejected),
      hardRejectReason: item.hardRejectReason || "",
      sourceType: item.sourceType,
      selector: item.selector,
      sourceLabel: item.sourceLabel,
      sourceUrl: item.sourceUrl,
      personal: item.personal,
      ownership: item.ownership,
      company: item.company,
      width: item.width,
      height: item.height,
    })),
    status: "ready",
    score: cover?.score || 0,
    personal: Boolean(project.personal),
    ownership: project.ownership || "",
    company: project.company || "",
    companyUrl: project.companyUrl || "",
    authSession: lastAuthSession,
    message:
      "Screenshots captured from configured source URLs." +
      learnedFilterMessage +
      minWarning,
    updatedAt: new Date().toISOString(),
  };
}

async function main() {
  const projects = readJson("projects.json", []);
  const rankings = readJson("rankings.json", {});
  const job = readJson("jobs.json", {
    config: {
      globalMinScreenshots: 2,
      globalMaxScreenshots: 6,
      autoSmartSelections: true,
    },
  });

  const targetProjectSlug = String(
    process.env.ML_PROJECT_SLUG || job.config?.targetProjectSlug || "",
  ).trim();

  const forceProject =
    process.env.ML_FORCE_PROJECT === "1" || job.config?.forceProject === true;

  const selectedProjects = targetProjectSlug
    ? projects.filter((project) => project.slug === targetProjectSlug)
    : projects;

  if (targetProjectSlug && selectedProjects.length === 0) {
    throw new Error(
      "Project not found for screenshot rerun: " + targetProjectSlug,
    );
  }

  if (targetProjectSlug && forceProject) {
    resetProjectRuntime(targetProjectSlug, rankings);
    writeJson("rankings.json", rankings);
  }

  log(
    "Worker started. Projects: " +
      selectedProjects.length +
      (targetProjectSlug ? " target=" + targetProjectSlug : ""),
  );

  writeJson("jobs.json", {
    ...job,
    status: "processing",
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    message: "Processing " + selectedProjects.length + " project(s)...",
  });

  const browser = await chromium.launch({ headless: true });

  try {
    for (const project of selectedProjects) {
      log("Processing project: " + project.slug + " - " + project.title);

      rankings[project.slug] = {
        slug: project.slug,
        title: project.title,
        cover: rankings[project.slug]?.cover || null,
        slides: rankings[project.slug]?.slides || [],
        candidates: rankings[project.slug]?.candidates || [],
        candidateMeta: rankings[project.slug]?.candidateMeta || [],
        status: "processing",
        personal: Boolean(project.personal),
        ownership: project.ownership || "",
        company: project.company || "",
        companyUrl: project.companyUrl || "",
        authSession: rankings[project.slug]?.authSession || {
          loggedIn: false,
          reason: "Processing...",
        },
        message: "Reading project settings and capturing screenshots...",
        updatedAt: new Date().toISOString(),
      };

      writeJson("rankings.json", rankings);

      try {
        rankings[project.slug] = await captureProject(browser, project, job);
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        const placeholder = await createUnavailablePlaceholder(project, reason);

        rankings[project.slug] = {
          slug: project.slug,
          title: project.title,
          cover: placeholder,
          slides: [],
          candidates: [],
          candidateMeta: [],
          status: "unavailable",
          score: 0,
          personal: Boolean(project.personal),
          ownership: project.ownership || "",
          company: project.company || "",
          companyUrl: project.companyUrl || "",
          authSession: {
            loggedIn: false,
            userLabel: project.auth?.username || "",
            reason,
          },
          unavailableReason: reason,
          message: "The project could not be captured. Reason: " + reason,
          updatedAt: new Date().toISOString(),
        };
      }

      writeJson("rankings.json", rankings);
    }
  } finally {
    await browser.close();
  }

  writeJson("jobs.json", {
    ...job,
    status: "ready",
    updatedAt: new Date().toISOString(),
    message: targetProjectSlug
      ? "Screenshot job finished for " + targetProjectSlug + "."
      : "Screenshot job finished.",
  });

  log("Worker finished.");
}

main().catch((error) => {
  const reason = error instanceof Error ? error.message : String(error);
  log("Worker fatal error: " + reason);

  writeJson("jobs.json", {
    status: "error",
    updatedAt: new Date().toISOString(),
    message: reason,
  });

  process.exit(1);
});
