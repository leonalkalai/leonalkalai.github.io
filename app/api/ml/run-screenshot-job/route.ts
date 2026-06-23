import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { readMlJob, writeMlJob } from "@/lib/ml/ml-store";

function appendWorkerRouteLog(message: string) {
  const logPath = path.join(process.cwd(), "data", "ml", "worker.log");

  fs.mkdirSync(path.dirname(logPath), { recursive: true });

  fs.appendFileSync(
    logPath,
    "[" + new Date().toISOString() + "] [route] " + message + "\n",
    "utf8",
  );
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PROCESSING_JOB_AGE_MS = 1000 * 60 * 3;

function isRecentProcessingJob(job: any) {
  if (!job || job.status !== "processing") return false;

  const startedAt = job.startedAt || job.updatedAt;
  const startedTime = startedAt ? new Date(startedAt).getTime() : 0;

  if (!startedTime) return false;

  return Date.now() - startedTime < MAX_PROCESSING_JOB_AGE_MS;
}

export async function POST(request: Request) {
  const currentJob = readMlJob();

  if (isRecentProcessingJob(currentJob)) {
    appendWorkerRouteLog(
      "Rerun blocked because another processing job is still recent.",
    );

    return NextResponse.json({
      ok: true,
      status: "already-running",
      job: currentJob,
    });
  }

  let body: any = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const currentConfig = currentJob?.config as
    | {
        useGlobalScreenshotLimits?: boolean;
        globalMinScreenshots?: number;
        globalMaxScreenshots?: number;
        autoSmartSelections?: boolean;
        targetProjectSlug?: string;
        forceProject?: boolean;
      }
    | undefined;

  const targetProjectSlug = body.projectSlug ? String(body.projectSlug) : "";
  const forceProject = body.forceProject === true;

  const config = {
    useGlobalScreenshotLimits:
      typeof body.useGlobalScreenshotLimits === "boolean"
        ? body.useGlobalScreenshotLimits
        : Boolean(currentConfig?.useGlobalScreenshotLimits),

    globalMinScreenshots: Number(
      body.globalMinScreenshots || currentConfig?.globalMinScreenshots || 2,
    ),

    globalMaxScreenshots: Number(
      body.globalMaxScreenshots || currentConfig?.globalMaxScreenshots || 6,
    ),

    autoSmartSelections:
      typeof body.autoSmartSelections === "boolean"
        ? body.autoSmartSelections
        : currentConfig?.autoSmartSelections !== false,

    targetProjectSlug,
    forceProject,
  };

  const nextJob = {
    status: "processing",
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    message: targetProjectSlug
      ? "Screenshot ML worker started for " + targetProjectSlug + "."
      : "Screenshot ML worker started.",
    config,
  };

  writeMlJob(nextJob);

  const scriptPath = path.join(
    process.cwd(),
    "scripts",
    "ml-screenshot-worker.mjs",
  );
  const logPath = path.join(process.cwd(), "data", "ml", "worker.log");

  fs.mkdirSync(path.dirname(logPath), { recursive: true });

  const logStream = fs.createWriteStream(logPath, { flags: "a" });
  logStream.write(
    "\n--- Worker started " + new Date().toISOString() + " ---\n",
  );

  appendWorkerRouteLog(
    "Starting worker. target=" +
      targetProjectSlug +
      " forceProject=" +
      String(forceProject),
  );

  const child = spawn(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    detached: false,
    env: {
      ...process.env,
      ML_PROJECT_SLUG: targetProjectSlug,
      ML_FORCE_PROJECT: forceProject ? "1" : "",
    },
  });

  child.stdout.on("data", (chunk) => logStream.write(chunk));
  child.stderr.on("data", (chunk) => logStream.write(chunk));
  child.on("close", (code) => {
    appendWorkerRouteLog("Worker process closed with code " + String(code));

    logStream.write(
      "\n--- Worker finished with code " +
        String(code) +
        " at " +
        new Date().toISOString() +
        " ---\n",
    );

    logStream.end();

    if (code !== 0) {
      writeMlJob({
        status: "error",
        updatedAt: new Date().toISOString(),
        message:
          "Screenshot worker exited with code " +
          String(code) +
          ". Check data/ml/worker.log.",
        config,
      });
    }
  });
  child.on("error", (error) => {
    appendWorkerRouteLog("Worker failed to start: " + error.message);

    writeMlJob({
      status: "error",
      updatedAt: new Date().toISOString(),
      message: "Worker failed to start: " + error.message,
      config,
    });
  });

  return NextResponse.json({
    ok: true,
    status: "started",
    job: nextJob,
  });
}
