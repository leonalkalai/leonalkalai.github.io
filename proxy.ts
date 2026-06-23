import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ML Dashboard"',
    },
  });
}

function isAuthorized(request: NextRequest) {
  const username = process.env.ML_DASHBOARD_USER;
  const password = process.env.ML_DASHBOARD_PASSWORD;

  if (!username || !password) {
    return false;
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  const encoded = authHeader.replace("Basic ", "");

  let decoded = "";

  try {
    decoded = atob(encoded);
  } catch {
    return false;
  }

  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return false;
  }

  const inputUsername = decoded.slice(0, separatorIndex);
  const inputPassword = decoded.slice(separatorIndex + 1);

  return inputUsername === username && inputPassword === password;
}

export function proxy(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/screenshot-training/:path*",
    "/api/ml/run-screenshot-job/:path*",
    "/api/ml/screenshots-status/:path*",
    "/api/ml/preferences/:path*",
    "/api/ml/preferences-files/:path*",
    "/api/ml/projects/:path*",
    "/api/ml/next-phase/:path*",
  ],
};