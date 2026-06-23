import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mlDir = path.join(root, "data", "ml");

export type MlAuthType =
  | "none"
  | "form"
  | "login-link-form"
  | "google"
  | "manual-session";

export type MlProjectAuth = {
  type: MlAuthType;
  loginUrl?: string;
  loginLinkSelector?: string;
  username?: string;
  password?: string;
  verificationCode?: string;
  usernameSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
  expectedUrlIncludes?: string;
  expectedContentIncludes?: string;
};

export type MlProjectSourceUrl = {
  label: string;
  url: string;
};

export type MlProject = {
  slug: string;
  title: string;
  url: string;
  prompt: string;
  personal?: boolean;
  ownership?: string;
  company?: string;
  companyUrl?: string;
  roleContext?: string;
  displayInTraining?: boolean;
  useForMl?: boolean;
  disabled?: boolean;
  sourceUrls?: MlProjectSourceUrl[];
  screenshotMin?: number;
  screenshotMax?: number;
  auth?: MlProjectAuth;
};

export type MlCandidateMeta = {
  publicPath: string;
  score: number;
  basicScore: number;
  cropScore: number;
  sourceType: "section" | "viewport";
  selector?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  personal?: boolean;
  ownership?: string;
  company?: string;
  width?: number;
  height?: number;
};

export type MlRankingItem = {
  slug: string;
  title: string;
  cover: string | null;
  slides: string[];
  candidates: string[];
  candidateMeta?: MlCandidateMeta[];
  status:
    | "idle"
    | "processing"
    | "ready"
    | "error"
    | "unavailable"
    | "login-required"
    | "auth-required"
    | "verification-required"
    | "skipped";
  score?: number;
  message?: string;
  unavailableReason?: string;
  authDetection?: {
    method?: string;
    loginUrl?: string;
    detectedSelector?: string;
  };
  authSession?: {
    loggedIn: boolean;
    userLabel?: string;
    reason?: string;
  };
  personal?: boolean;
  ownership?: string;
  company?: string;
  companyUrl?: string;
  updatedAt?: string;
};

export type MlPreferenceTag =
  | "full-section-visible"
  | "elements-cut-off"
  | "good-composition"
  | "bad-crop"
  | "important-content-visible"
  | "important-content-not-visible"
  | "not-relative-content"
  | "not-desired-content"
  | "popup-overlay"
  | "too-empty"
  | "too-zoomed";

export type MlPreference = {
  projectSlug: string;
  image: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tags: MlPreferenceTag[];
  rejected?: boolean;
  notes?: string;
  source?: "manual" | "auto";
  createdAt: string;
  updatedAt?: string;
};

function readJson<T>(fileName: string, fallback: T): T {
  try {
    const filePath = path.join(mlDir, fileName);
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(fileName: string, data: unknown) {
  fs.mkdirSync(mlDir, { recursive: true });
  fs.writeFileSync(
    path.join(mlDir, fileName),
    JSON.stringify(data, null, 2) + "\n",
    "utf8",
  );
}

export function readMlProjects() {
  return readJson<MlProject[]>("projects.json", []);
}

export function writeMlProjects(projects: MlProject[]) {
  writeJson("projects.json", projects);
}

export function updateMlProjectSettings(
  input: Partial<MlProject> & { slug: string },
) {
  const projects = readMlProjects();
  const index = projects.findIndex((project) => project.slug === input.slug);

  if (index === -1) {
    throw new Error("Project not found: " + input.slug);
  }

  const current = projects[index];

  projects[index] = {
    ...current,
    ...input,
    disabled:
      typeof input.disabled === "boolean" ? input.disabled : current.disabled,
    useForMl:
      typeof input.useForMl === "boolean" ? input.useForMl : current.useForMl,
    screenshotMin:
      typeof input.screenshotMin === "number"
        ? input.screenshotMin
        : current.screenshotMin,
    screenshotMax:
      typeof input.screenshotMax === "number"
        ? input.screenshotMax
        : current.screenshotMax,
    sourceUrls: Array.isArray(input.sourceUrls)
      ? input.sourceUrls
          .map((item) => ({
            label: String(item.label || "Page"),
            url: String(item.url || ""),
          }))
          .filter((item) => item.url)
      : current.sourceUrls || [],
    auth: {
      ...(current.auth || { type: "none" }),
      ...(input.auth || {}),
    },
  };

  writeMlProjects(projects);

  return projects[index];
}

export function readMlRankings() {
  return readJson<Record<string, MlRankingItem>>("rankings.json", {});
}

export function writeMlRankings(rankings: Record<string, MlRankingItem>) {
  writeJson("rankings.json", rankings);
}

export function readMlJob() {
  return readJson("jobs.json", {
    status: "idle",
    updatedAt: null,
    message: "No job has run yet.",
    config: {
      globalMinScreenshots: 2,
      globalMaxScreenshots: 6,
      autoSmartSelections: true,
    },
  });
}

export function writeMlJob(job: unknown) {
  writeJson("jobs.json", job);
}

export function readMlPreferences() {
  return readJson<MlPreference[]>("preferences.json", []);
}

export function writeMlPreferences(preferences: MlPreference[]) {
  writeJson("preferences.json", preferences);
}

export function addMlPreference(
  input: Omit<MlPreference, "createdAt" | "updatedAt">,
) {
  const preferences = readMlPreferences();

  const now = new Date().toISOString();

  const nextPreference = {
    ...input,
    source: input.source || "manual",
    tags: Array.isArray(input.tags) ? input.tags : [],
    rejected: Boolean(input.rejected),
    createdAt: now,
    updatedAt: now,
  };

  const filtered = preferences.filter((preference) => {
    return !(
      preference.projectSlug === input.projectSlug &&
      preference.image === input.image
    );
  });

  filtered.push(nextPreference);

  writeJson("preferences.json", filtered);

  return filtered;
}

export function resetMlPreferences(projectSlug?: string) {
  const preferences = readMlPreferences();

  const next = projectSlug
    ? preferences.filter((preference) => preference.projectSlug !== projectSlug)
    : [];

  writeJson("preferences.json", next);

  return next;
}
