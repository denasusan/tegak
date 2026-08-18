import { NextResponse } from "next/server";
import { hapusSessionCookie } from "@/lib/session";

export async function POST(request) {
  hapusSessionCookie();
  return NextResponse.redirect(new URL("/login", request.url));
}
