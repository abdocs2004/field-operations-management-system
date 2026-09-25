import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/field"];
const COOKIE_NAME = "fieldops_token";

/**
 * Coarse, edge-level gate: redirects to /login when the auth cookie is
 * missing entirely, avoiding a flash of protected UI before the client
 * loads. This is a UX convenience only — the backend (via requireAuth /
 * authorize middleware) remains the sole authority for whether a request
 * is actually allowed, since a client can always forge cookie presence.
 * Fine-grained role checks happen client-side in <RouteGuard> after
 * /api/auth/me confirms the session, and are re-checked by the API itself
 * on every request.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const hasToken = request.cookies.has(COOKIE_NAME);
  if (!hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/field/:path*"],
};
