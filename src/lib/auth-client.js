"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL: the client talks to /api/auth on the current origin, so the same
// build works on localhost, preview deployments and production.
export const authClient = createAuthClient();
