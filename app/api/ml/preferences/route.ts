import { NextResponse } from "next/server";
import {
  addMlPreference,
  readMlPreferences,
  resetMlPreferences,
  writeMlPreferences,
  type MlPreferenceTag,
} from "@/lib/ml/ml-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTags = [
  "full-section-visible",
  "elements-cut-off",
  "good-composition",
  "bad-crop",
  "important-content-visible",
  "important-content-not-visible",
  "not-relative-content",
  "not-desired-content",
  "popup-overlay",
  "too-empty",
  "too-zoomed",
] as const satisfies readonly MlPreferenceTag[];

function isMlPreferenceTag(value: string): value is MlPreferenceTag {
  return (allowedTags as readonly string[]).includes(value);
}

function normalizeTags(value: unknown): MlPreferenceTag[] {
  return Array.isArray(value)
    ? value.map(String).filter(isMlPreferenceTag)
    : [];
}

function normalizeSource(value: unknown): "manual" | "auto" {
  return value === "auto" ? "auto" : "manual";
}

type ImportedPreferenceItem = {
  projectSlug: unknown;
  image: unknown;
  rating: unknown;
  tags?: unknown;
  rejected?: unknown;
  notes?: unknown;
  source?: unknown;
  createdAt?: unknown;
};

export async function GET() {
  return NextResponse.json({
    preferences: readMlPreferences(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.projectSlug || !body?.image || body?.rating === undefined) {
    return NextResponse.json(
      { error: "projectSlug, image and rating are required" },
      { status: 400 },
    );
  }

  const rating = Number(body.rating);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "rating must be an integer from 1 to 5" },
      { status: 400 },
    );
  }

  const preferences = addMlPreference({
    projectSlug: String(body.projectSlug),
    image: String(body.image),
    rating: rating as 1 | 2 | 3 | 4 | 5,
    tags: normalizeTags(body.tags),
    rejected: Boolean(body.rejected),
    notes: body.notes ? String(body.notes) : "",
    source: normalizeSource(body.source),
  });

  return NextResponse.json({
    ok: true,
    preferences,
  });
}

export async function PUT(request: Request) {
  const body = await request.json();

  const imported: unknown[] = Array.isArray(body.preferences)
    ? body.preferences
    : Array.isArray(body)
      ? body
      : [];

  const preferences = imported
    .filter((item: unknown): item is ImportedPreferenceItem => {
      return Boolean(
        item &&
        typeof item === "object" &&
        "projectSlug" in item &&
        "image" in item &&
        "rating" in item,
      );
    })
    .map((item: ImportedPreferenceItem) => ({
      projectSlug: String(item.projectSlug),
      image: String(item.image),
      rating: Math.max(1, Math.min(5, Number(item.rating))) as
        | 1
        | 2
        | 3
        | 4
        | 5,
      tags: normalizeTags(item.tags),
      rejected: Boolean(item.rejected),
      notes: item.notes ? String(item.notes) : "",
      source: normalizeSource(item.source),
      createdAt: item.createdAt
        ? String(item.createdAt)
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

  writeMlPreferences(preferences);

  return NextResponse.json({
    ok: true,
    preferences,
  });
}

export async function DELETE(request: Request) {
  let body: { projectSlug?: string } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const projectSlug = body.projectSlug ? String(body.projectSlug) : undefined;
  const preferences = resetMlPreferences(projectSlug);

  return NextResponse.json({
    ok: true,
    preferences,
  });
}
