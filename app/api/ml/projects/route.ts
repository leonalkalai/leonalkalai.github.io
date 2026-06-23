import { NextResponse } from "next/server";
import { readMlProjects, updateMlProjectSettings } from "@/lib/ml/ml-store";
import type { MlProjectAuth } from "@/lib/ml/ml-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    projects: readMlProjects(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const sourceUrls = Array.isArray(body.sourceUrls)
    ? body.sourceUrls
        .map((item: any) => ({
          label: String(item.label || "Page"),
          url: String(item.url || ""),
        }))
        .filter((item: any) => item.url)
    : [];

  const auth =
    body.auth && typeof body.auth === "object"
      ? ({
          type: String(body.auth.type || "none"),
          loginUrl: String(body.auth.loginUrl || ""),
          loginLinkSelector: String(body.auth.loginLinkSelector || ""),
          username: String(body.auth.username || ""),
          password: String(body.auth.password || ""),
          verificationCode: String(body.auth.verificationCode || ""),
          usernameSelector: String(body.auth.usernameSelector || ""),
          passwordSelector: String(body.auth.passwordSelector || ""),
          submitSelector: String(body.auth.submitSelector || ""),
          expectedUrlIncludes: String(body.auth.expectedUrlIncludes || ""),
          expectedContentIncludes: String(
            body.auth.expectedContentIncludes || "",
          ),
        } as MlProjectAuth)
      : undefined;

  const project = updateMlProjectSettings({
    slug: String(body.slug),
    disabled: Boolean(body.disabled),
    useForMl: !Boolean(body.disabled),
    personal: Boolean(body.personal),
    ownership: String(
      body.ownership || (body.personal ? "personal" : "employer"),
    ),
    company: String(body.company || ""),
    companyUrl: String(body.companyUrl || ""),
    roleContext: String(body.roleContext || ""),
    screenshotMin: Number(body.screenshotMin || 0),
    screenshotMax: Number(body.screenshotMax || 0),
    sourceUrls,
    auth,
  });

  return NextResponse.json({
    ok: true,
    project,
    projects: readMlProjects(),
  });
}
