import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { readMlPreferences, writeMlPreferences } from "@/lib/ml/ml-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const root = process.cwd();
const snapshotsDir = path.join(root, "data", "ml", "selection-snapshots");

function ensureSnapshotsDir() {
  fs.mkdirSync(snapshotsDir, { recursive: true });
}

function safeFileName(name: string) {
  return String(name || "")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/\.\./g, "");
}

function makeSnapshotName() {
  const stamp = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\./g, "-");
  return "training-selections-" + stamp + ".json";
}

export async function GET() {
  ensureSnapshotsDir();

  const files = fs
    .readdirSync(snapshotsDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .reverse();

  return NextResponse.json({
    files,
  });
}

export async function POST(request: Request) {
  ensureSnapshotsDir();

  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "save");

  if (action === "save") {
    const fileName = makeSnapshotName();
    const fullPath = path.join(snapshotsDir, fileName);

    fs.writeFileSync(
      fullPath,
      JSON.stringify(
        {
          createdAt: new Date().toISOString(),
          preferences: readMlPreferences(),
        },
        null,
        2,
      ) + "\n",
      "utf8",
    );

    return NextResponse.json({
      ok: true,
      action,
      fileName,
    });
  }

  if (action === "load") {
    const fileName = safeFileName(body.fileName || "");
    const fullPath = path.join(snapshotsDir, fileName);

    if (!fileName || !fs.existsSync(fullPath)) {
      return NextResponse.json(
        { ok: false, error: "Snapshot file not found" },
        { status: 404 },
      );
    }

    const parsed = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    const preferences = Array.isArray(parsed.preferences)
      ? parsed.preferences
      : Array.isArray(parsed)
        ? parsed
        : [];

    writeMlPreferences(preferences);

    return NextResponse.json({
      ok: true,
      action,
      fileName,
      preferences,
    });
  }

  return NextResponse.json(
    { ok: false, error: "Unknown action" },
    { status: 400 },
  );
}

export async function DELETE() {
  ensureSnapshotsDir();

  for (const file of fs.readdirSync(snapshotsDir)) {
    if (file.endsWith(".json")) {
      fs.rmSync(path.join(snapshotsDir, file), { force: true });
    }
  }

  return NextResponse.json({
    ok: true,
  });
}
