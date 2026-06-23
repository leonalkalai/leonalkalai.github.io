import { NextResponse } from "next/server";
import { readMlJob, readMlRankings } from "@/lib/ml/ml-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    job: readMlJob(),
    rankings: readMlRankings(),
  });
}
