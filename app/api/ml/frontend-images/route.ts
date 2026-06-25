import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const mlDir = path.join(process.cwd(), "data", "ml");
const publicDir = path.join(process.cwd(), "public");
const frontendImagesPath = path.join(mlDir, "frontend-images.json");
const rankingsPath = path.join(mlDir, "rankings.json");
const preferencesPath = path.join(mlDir, "preferences.json");

const DEFAULT_MIN_ACCEPTABLE_SCORE = 2.8;

const SELECTED_SCREENSHOT_FILES = [
  "cover.webp",
  "slide-1.webp",
  "slide-2.webp",
  "slide-3.webp",
];

type FrontendProjectImages = {
  cover: string | null;
  images: string[];
  updatedAt: string;
};

type CandidateMeta = {
  publicPath: string;
  score?: number;
  basicScore?: number;
  cropScore?: number;
  sourceType?: "section" | "viewport";
};

type RankingItem = {
  slug?: string;
  cover?: string | null;
  candidates?: string[];
  candidateMeta?: CandidateMeta[];
};

type PreferenceItem = {
  projectSlug: string;
  image: string;
  rating?: number;
  tags?: string[];
  rejected?: boolean;
};

type CandidateScoreInput = {
  rankings: Record<string, RankingItem>;
  preferenceMap: Map<string, PreferenceItem>;
  projectSlug: string;
  image: string;
};

type PickBestCoverInput = {
  rankings: Record<string, RankingItem>;
  preferences: PreferenceItem[];
  projectSlug: string;
  images: string[];
};

type CreateProductionImagesInput = {
  projectSlug: string;
  cover: string | null;
  images: string[];
};

function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeFrontendImages(data: Record<string, FrontendProjectImages>) {
  fs.mkdirSync(path.dirname(frontendImagesPath), { recursive: true });
  fs.writeFileSync(
    frontendImagesPath,
    JSON.stringify(data, null, 2) + "\n",
    "utf8",
  );
}

function normalizePublicPath(publicPath: string) {
  return publicPath.split(/[?#]/)[0];
}

function publicPathToFilePath(publicPath: string) {
  const normalizedPublicPath = normalizePublicPath(publicPath);

  if (!normalizedPublicPath.startsWith("/")) return null;

  const relativePath = decodeURIComponent(normalizedPublicPath).replace(
    /^\/+/,
    "",
  );

  const filePath = path.join(publicDir, relativePath);
  const relativeToPublic = path.relative(publicDir, filePath);

  if (relativeToPublic.startsWith("..") || path.isAbsolute(relativeToPublic)) {
    return null;
  }

  return filePath;
}

function getProjectScreenshotPrefix(projectSlug: string) {
  return `/ml-screenshots/${projectSlug}/`;
}

function isProjectScreenshotPath(projectSlug: string, image: string) {
  return image.startsWith(getProjectScreenshotPrefix(projectSlug));
}

function getSelectedPublicPath(projectSlug: string, index: number) {
  return `/ml-screenshots/${projectSlug}/${SELECTED_SCREENSHOT_FILES[index]}`;
}

function materializeSelectedImage(
  sourcePublicPath: string,
  targetPublicPath: string,
) {
  const sourceFilePath = publicPathToFilePath(sourcePublicPath);
  const targetFilePath = publicPathToFilePath(targetPublicPath);

  if (!targetFilePath) return null;

  if (sourcePublicPath === targetPublicPath) {
    return fs.existsSync(targetFilePath) ? targetPublicPath : null;
  }

  if (sourceFilePath && fs.existsSync(sourceFilePath)) {
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
    fs.copyFileSync(sourceFilePath, targetFilePath);
    return targetPublicPath;
  }

  // In production builds the candidate source may not exist, but the selected
  // target files can already be committed under public/ml-screenshots.
  return fs.existsSync(targetFilePath) ? targetPublicPath : null;
}

function createProductionFrontendImages(
  input: CreateProductionImagesInput,
): FrontendProjectImages {
  const { projectSlug, cover, images } = input;

  const orderedSources = Array.from(
    new Set(
      [cover, ...images]
        .filter((image): image is string => typeof image === "string")
        .map(normalizePublicPath)
        .filter((image) => isProjectScreenshotPath(projectSlug, image)),
    ),
  );

  const selectedImages: string[] = [];

  for (const sourcePublicPath of orderedSources) {
    if (selectedImages.length >= SELECTED_SCREENSHOT_FILES.length) break;

    const targetPublicPath = getSelectedPublicPath(
      projectSlug,
      selectedImages.length,
    );

    const materializedPublicPath = materializeSelectedImage(
      sourcePublicPath,
      targetPublicPath,
    );

    if (materializedPublicPath) {
      selectedImages.push(materializedPublicPath);
    }
  }

  // Final fallback: use committed selected files if they exist.
  for (
    let index = selectedImages.length;
    index < SELECTED_SCREENSHOT_FILES.length;
    index += 1
  ) {
    const selectedPublicPath = getSelectedPublicPath(projectSlug, index);
    const selectedFilePath = publicPathToFilePath(selectedPublicPath);

    if (selectedFilePath && fs.existsSync(selectedFilePath)) {
      selectedImages.push(selectedPublicPath);
    }
  }

  return {
    cover: selectedImages[0] || null,
    images: selectedImages,
    updatedAt: new Date().toISOString(),
  };
}

function readFrontendImages(): Record<string, FrontendProjectImages> {
  return readJson<Record<string, FrontendProjectImages>>(
    frontendImagesPath,
    {},
  );
}

function readRankings(): Record<string, RankingItem> {
  return readJson<Record<string, RankingItem>>(rankingsPath, {});
}

function readPreferences(): PreferenceItem[] {
  return readJson<PreferenceItem[]>(preferencesPath, []);
}

function buildPreferenceKey(projectSlug: string, image: string) {
  return projectSlug + "::" + image;
}

function getMinimumAcceptableScore(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_MIN_ACCEPTABLE_SCORE;
  }

  return Math.max(0, Math.min(10, parsed));
}

function isRejectedImage(
  preferenceMap: Map<string, PreferenceItem>,
  projectSlug: string,
  image: string,
) {
  return Boolean(
    preferenceMap.get(buildPreferenceKey(projectSlug, image))?.rejected,
  );
}

function getTagScore(tags: string[] = []) {
  let score = 0;

  if (tags.includes("good-composition")) score += 0.65;
  if (tags.includes("full-section-visible")) score += 0.45;
  if (tags.includes("important-content-visible")) score += 0.65;

  if (tags.includes("bad-crop")) score -= 0.75;
  if (tags.includes("elements-cut-off")) score -= 0.65;
  if (tags.includes("popup-overlay")) score -= 1.2;
  if (tags.includes("important-content-not-visible")) score -= 0.85;
  if (tags.includes("not-relative-content")) score -= 0.9;
  if (tags.includes("not-desired-content")) score -= 0.9;
  if (tags.includes("too-empty")) score -= 0.45;
  if (tags.includes("too-zoomed")) score -= 0.45;

  return score;
}

function getCandidateScore(input: CandidateScoreInput) {
  const { rankings, preferenceMap, projectSlug, image } = input;

  const ranking = rankings[projectSlug];

  const meta = Array.isArray(ranking?.candidateMeta)
    ? ranking.candidateMeta.find((item) => item.publicPath === image)
    : null;

  const preference = preferenceMap.get(buildPreferenceKey(projectSlug, image));

  const storedScore = typeof meta?.score === "number" ? meta.score : 0;
  const basicScore = typeof meta?.basicScore === "number" ? meta.basicScore : 0;
  const cropScore = typeof meta?.cropScore === "number" ? meta.cropScore : 0;
  const sourceBonus = meta?.sourceType === "section" ? 0.2 : 0;
  const ratingScore =
    typeof preference?.rating === "number" ? preference.rating * 0.35 : 0;
  const tagScore = getTagScore(preference?.tags || []);
  const previousCoverBonus = ranking?.cover === image ? 0.001 : 0;

  return (
    storedScore +
    basicScore +
    cropScore * 0.35 +
    sourceBonus +
    ratingScore +
    tagScore +
    previousCoverBonus
  );
}

function pickBestCoverByScore(input: PickBestCoverInput) {
  const { rankings, preferences, projectSlug, images } = input;

  if (images.length === 0) return null;

  const preferenceMap = new Map(
    preferences.map((preference) => [
      buildPreferenceKey(preference.projectSlug, preference.image),
      preference,
    ]),
  );

  const scoredImages = images.map((image, index) => ({
    image,
    index,
    score: getCandidateScore({
      rankings,
      preferenceMap,
      projectSlug,
      image,
    }),
  }));

  scoredImages.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  return scoredImages[0]?.image || images[0] || null;
}

function getBestScoredImage(input: PickBestCoverInput) {
  const { rankings, preferences, projectSlug, images } = input;

  const preferenceMap = new Map(
    preferences.map((preference) => [
      buildPreferenceKey(preference.projectSlug, preference.image),
      preference,
    ]),
  );

  const scoredImages = images.map((image, index) => ({
    image,
    index,
    score: getCandidateScore({
      rankings,
      preferenceMap,
      projectSlug,
      image,
    }),
  }));

  scoredImages.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  return scoredImages[0] || null;
}

export async function GET() {
  return NextResponse.json({
    images: readFrontendImages(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.projectSlug || !Array.isArray(body.images)) {
    return NextResponse.json(
      { ok: false, error: "projectSlug and images are required" },
      { status: 400 },
    );
  }

  const projectSlug = String(body.projectSlug);
  const minimumAcceptableScore = getMinimumAcceptableScore(body.minimumScore);

  const submittedImages: string[] = body.images
    .map((image: unknown) => String(image))
    .map(normalizePublicPath)
    .filter((image: string) => isProjectScreenshotPath(projectSlug, image));

  if (submittedImages.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        code: "no-images",
        message: "No valid screenshots were submitted.",
      },
      { status: 422 },
    );
  }

  const rankings = readRankings();
  const preferences = readPreferences();

  const preferenceMap = new Map(
    preferences.map((preference) => [
      buildPreferenceKey(preference.projectSlug, preference.image),
      preference,
    ]),
  );

  const images: string[] = submittedImages.filter((image: string) => {
    return !isRejectedImage(preferenceMap, projectSlug, image);
  });

  if (images.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        code: "all-rejected",
        message:
          "All submitted screenshots are rejected. Nothing was applied to frontend.",
      },
      { status: 422 },
    );
  }

  const best = getBestScoredImage({
    rankings,
    preferences,
    projectSlug,
    images,
  });

  if (!best || best.score < minimumAcceptableScore) {
    return NextResponse.json(
      {
        ok: false,
        code: "below-threshold",
        message:
          "Best screenshot score is below the minimum acceptable threshold.",
        bestScore: best?.score ?? null,
        minimumAcceptableScore,
      },
      { status: 422 },
    );
  }

  const cover = pickBestCoverByScore({
    rankings,
    preferences,
    projectSlug,
    images,
  });

  const productionItem = createProductionFrontendImages({
    projectSlug,
    cover,
    images,
  });

  if (productionItem.images.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        code: "no-production-images",
        message:
          "No selected production screenshots could be created. Make sure candidate files exist locally or cover.webp / slide images are already present.",
      },
      { status: 422 },
    );
  }

  const current = readFrontendImages();

  current[projectSlug] = productionItem;

  writeFrontendImages(current);

  return NextResponse.json({
    ok: true,
    projectSlug,
    bestScore: best.score,
    minimumAcceptableScore,
    item: current[projectSlug],
    images: current,
  });
}
