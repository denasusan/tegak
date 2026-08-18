import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { buildGoogleAuthUrl } from "@/lib/google-oauth";

const STATE_COOKIE = "google_oauth_state";

/** Mulai alur "Sign in with Google" — redirect ke halaman consent Google. */
export async function GET(request) {
  const origin = new URL(request.url).origin;
  const state = crypto.randomBytes(16).toString("hex");

  const response = NextResponse.redirect(buildGoogleAuthUrl({ origin, state }));
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 menit, cukup untuk menyelesaikan login
  });
  return response;
}
