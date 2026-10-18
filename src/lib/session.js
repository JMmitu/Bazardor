import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth.js";

/** Returns the validated session (or null). Always checked on the server. */
export async function getSession() {
  // Read headers outside the try/catch: Next signals "this route is dynamic"
  // by throwing from headers(), and that signal must not be swallowed.
  const requestHeaders = await headers();
  try {
    return await auth.api.getSession({ headers: requestHeaders });
  } catch (err) {
    console.error("[bazardor] session lookup failed:", err.message);
    return null;
  }
}

/**
 * Guard for protected server-rendered pages. Sends visitors to /signin and
 * remembers where they were headed so they can be returned after login.
 */
export async function requireSession(returnTo) {
  const session = await getSession();
  if (!session) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(returnTo)}`);
  }
  return session;
}
