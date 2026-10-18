import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic gate for protected routes: no session cookie -> real HTTP 307 to
 * /signin (remembering the destination). This is only a fast first check;
 * each protected page still validates the session on the server
 * (lib/session.js -> requireSession), which is the authoritative check.
 */
export function proxy(request) {
  if (getSessionCookie(request)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const signIn = new URL("/signin", request.url);
  signIn.searchParams.set("callbackUrl", `${pathname}${search}`);
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*"],
};
