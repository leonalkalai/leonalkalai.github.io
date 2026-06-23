import { NextResponse } from "next/server";
import {
  readMlPreferences,
  readMlRankings,
  writeMlRankings,
  writeMlJob,
} from "@/lib/ml/ml-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildKey(projectSlug: string, image: string) {
  return projectSlug + "__" + image;
}

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

export async function POST() {
  const rankings = readMlRankings();
  const preferences = readMlPreferences();

  const preferenceMap = new Map(
    preferences.map((preference) => [
      buildKey(preference.projectSlug, preference.image),
      preference,
    ]),
  );

  const missingRatings: Array<{ projectSlug: string; image: string }> = [];

  for (const ranking of Object.values(rankings)) {
    if (ranking.status !== "ready") continue;

    for (const image of ranking.candidates || []) {
      const key = buildKey(ranking.slug, image);
      if (!preferenceMap.has(key)) {
        missingRatings.push({
          projectSlug: ranking.slug,
          image,
        });
      }
    }
  }

  if (missingRatings.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "missing-ratings",
        message: "You must rate all available screenshots before continuing.",
        missingRatings,
      },
      { status: 400 },
    );
  }

  for (const ranking of Object.values(rankings)) {
    if (ranking.status !== "ready") continue;

    const candidateMeta = ranking.candidateMeta || [];

    const scoredCandidates = (ranking.candidates || []).map((image) => {
      const preference = preferenceMap.get(buildKey(ranking.slug, image));
      const meta = candidateMeta.find((item) => item.publicPath === image);

      const ratingScore = preference ? preference.rating * 0.35 : 0;
      const tagScore = getTagScore(preference?.tags || []);
      const basicScore = meta?.basicScore || 0;
      const cropScore = meta?.cropScore || 0;
      const sourceBonus = meta?.sourceType === "section" ? 0.2 : 0;

      return {
        image,
        score: basicScore + cropScore * 0.35 + ratingScore + tagScore + sourceBonus,
      };
    });

    scoredCandidates.sort((a, b) => b.score - a.score);

    ranking.cover = scoredCandidates[0]?.image || ranking.cover || null;
    ranking.slides = scoredCandidates.slice(1, 4).map((item) => item.image);
    ranking.message = "Next phase completed. Best screenshots selected.";
    ranking.updatedAt = new Date().toISOString();
  }

  writeMlRankings(rankings);

  writeMlJob({
    status: "ready",
    phase: "next-phase-completed",
    updatedAt: new Date().toISOString(),
    message: "Next phase completed.",
  });

  return NextResponse.json({
    ok: true,
    rankings,
  });
}
