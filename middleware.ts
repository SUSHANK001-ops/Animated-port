import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

// Routes that require authentication
const protectedPageRoutes = ["/admin/dashboard"];
const protectedApiRoutes = [
  "/api/admin/blog",
  "/api/admin/upload",
  "/api/admin/me",
  "/api/admin/register",
  "/api/admin/logout",
];

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: string; email: string; username: string };
  } catch {
    return null;
  }
}

function getToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookie = req.cookies.get("admin_token");
  return cookie?.value ?? null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if it's a protected page route
  const isProtectedPage = protectedPageRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if it's a protected API route
  const isProtectedApi = protectedApiRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = getToken(req);

  if (!token) {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = await verifyJWT(token);

  if (!decoded) {
    if (isProtectedPage) {
      const response = NextResponse.redirect(new URL("/admin", req.url));
      response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
      return response;
    }
    return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
  }

  // Attach admin info to headers for route handlers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-admin-id", decoded.id);
  requestHeaders.set("x-admin-email", decoded.email as string);
  requestHeaders.set("x-admin-username", decoded.username as string);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/api/admin/blog/:path*",
    "/api/admin/upload/:path*",
    "/api/admin/me/:path*",
    "/api/admin/register/:path*",
    "/api/admin/logout/:path*",
  ],
};
