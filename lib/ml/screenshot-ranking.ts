export type ScreenshotCandidate = {
  imagePath: string;
  publicPath: string;
  basicScore: number;
  cropScore?: number;
  sourceType?: "section" | "viewport";
  personal?: boolean;
  ownership?: string;
  company?: string;
};

export type ScreenshotPreference = {
  projectSlug: string;
  image: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
};

export type RankingInput = {
  projectSlug: string;
  projectTitle: string;
  prompt: string;
  candidates: ScreenshotCandidate[];
  preferences?: ScreenshotPreference[];
};

export type RankingOutput = {
  cover: ScreenshotCandidate | null;
  slides: ScreenshotCandidate[];
};

function getTagScore(tags: string[] = []) {
  let score = 0;

  if (tags.includes("full-section-visible")) score += 0.35;
  if (tags.includes("good-composition")) score += 0.25;
  if (tags.includes("important-content-visible")) score += 0.25;

  if (tags.includes("important-content-not-visible")) score -= 0.55;
  if (tags.includes("not-relative-content")) score -= 0.55;
  if (tags.includes("not-desired-content")) score -= 0.65;
  if (tags.includes("elements-cut-off")) score -= 0.45;
  if (tags.includes("bad-crop")) score -= 0.45;
  if (tags.includes("popup-overlay")) score -= 0.65;
  if (tags.includes("too-empty")) score -= 0.25;
  if (tags.includes("too-zoomed")) score -= 0.25;

  return score;
}

export async function rankScreenshotsWithMl(
  input: RankingInput,
): Promise<RankingOutput> {
  const preferenceMap = new Map<string, ScreenshotPreference>();

  for (const preference of input.preferences || []) {
    if (preference.projectSlug !== input.projectSlug) continue;
    preferenceMap.set(preference.image, preference);
  }

  const sorted = [...input.candidates].sort((a, b) => {
    const preferenceA = preferenceMap.get(a.publicPath);
    const preferenceB = preferenceMap.get(b.publicPath);

    const ratingA = preferenceA?.rating || 0;
    const ratingB = preferenceB?.rating || 0;

    const tagScoreA = getTagScore(preferenceA?.tags || []);
    const tagScoreB = getTagScore(preferenceB?.tags || []);

    const sectionBonusA = a.sourceType === "section" ? 0.25 : 0;
    const sectionBonusB = b.sourceType === "section" ? 0.25 : 0;

    const scoreA =
      a.basicScore +
      (a.cropScore || 0) * 0.35 +
      ratingA * 0.25 +
      tagScoreA +
      sectionBonusA;

    const scoreB =
      b.basicScore +
      (b.cropScore || 0) * 0.35 +
      ratingB * 0.25 +
      tagScoreB +
      sectionBonusB;

    return scoreB - scoreA;
  });

  return {
    cover: sorted[0] || null,
    slides: sorted.slice(1, 4),
  };
}
