// Session login sederhana berbasis cookie yang ditandatangani (HMAC-SHA256).
//
// Ini BUKAN pengganti NextAuth/Auth.js — sengaja ditulis minimal (tanpa
// dependency tambahan) supaya mudah dibaca & diaudit. Untuk produksi,
// pertimbangkan memakai Auth.js atau menambah proteksi tambahan (rate
// limiting percobaan login, rotasi SESSION_SECRET, dsb).

import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "ipc_session";
const MAX_AGE_DETIK = 60 * 60 * 24 * 7; // 7 hari

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET belum diset. Salin .env.example menjadi .env dan isi nilainya."
    );
  }
  return secret;
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

/** Buat token session untuk user yang berhasil login. */
export function buatSessionToken(user) {
  const payload = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    exp: Date.now() + MAX_AGE_DETIK * 1000,
  };
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

/** Verifikasi & baca isi token session. Mengembalikan null jika tidak valid/kedaluwarsa. */
export function verifikasiSessionToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payloadEncoded, signature] = token.split(".");
  const expected = sign(payloadEncoded);

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadEncoded, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Set cookie session (dipanggil dari Server Action / Route Handler). */
export function setSessionCookie(user) {
  const token = buatSessionToken(user);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_DETIK,
  });
}

/** Hapus cookie session (logout). */
export function hapusSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

/** Ambil data session dari cookie request saat ini (dipakai di Server Component). */
export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifikasiSessionToken(token);
}
