import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/session";
import { selesaikanGoogleLogin } from "@/lib/google-oauth";

const STATE_COOKIE = "google_oauth_state";

// Role default untuk akun baru yang login lewat Google (belum pernah
// terdaftar sebelumnya). Perawat dipilih karena ini peran pintu masuk alur
// deteksi kasus (Layar 1) — admin/Kepala Puskesmas bisa mengubah role
// pengguna tersebut belakangan lewat database jika perlu.
const ROLE_DEFAULT_AKUN_BARU = "KADER";

function redirectDenganError(origin, pesan) {
  const url = new URL("/login", origin);
  url.searchParams.set("error", pesan);
  const response = NextResponse.redirect(url);
  response.cookies.delete(STATE_COOKIE);
  return response;
}

export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = request.cookies.get(STATE_COOKIE)?.value;

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return redirectDenganError(origin, "Sesi login Google tidak valid, silakan coba lagi.");
  }

  let profil;
  try {
    profil = await selesaikanGoogleLogin({ code, origin });
  } catch (err) {
    return redirectDenganError(origin, "Gagal login dengan Google, silakan coba lagi.");
  }

  let user = await prisma.user.findUnique({ where: { email: profil.email } });

  if (!user) {
    const passwordAcakTakTerpakai = await bcrypt.hash(
      crypto.randomBytes(32).toString("hex"),
      10
    );
    user = await prisma.user.create({
      data: {
        nama: profil.nama,
        email: profil.email,
        password: passwordAcakTakTerpakai,
        role: ROLE_DEFAULT_AKUN_BARU,
      },
    });
  }

  setSessionCookie(user);

  const response = NextResponse.redirect(new URL("/dashboard", origin));
  response.cookies.delete(STATE_COOKIE);
  return response;
}
