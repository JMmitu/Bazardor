import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { db, mongoClient } from "./mongodb.js";

const socialProviders = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // After sign-up the user is sent to /signin (no auto session), per the brief.
    autoSignIn: false,
    // Email verification and password reset are intentionally not implemented.
    requireEmailVerification: false,
  },
  socialProviders,
  // nextCookies must be the last plugin: it lets server actions set cookies.
  plugins: [nextCookies()],
});

/** Which social providers are actually configured on the server. */
export const enabledSocialProviders = Object.keys(socialProviders);
