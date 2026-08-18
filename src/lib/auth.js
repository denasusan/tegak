import { redirect } from "next/navigation";
import { getSession } from "./session";

/**
 * Pastikan pengguna sudah login. Panggil di awal Server Component halaman
 * yang perlu proteksi. Mengembalikan data session ({ id, nama, email, role }).
 */
export function requireSession() {
  const session = getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/**
 * Pastikan pengguna sudah login DAN rolenya termasuk dalam daftar yang
 * diizinkan. Jika tidak, arahkan ke /dashboard dengan pesan error.
 */
export function requireRole(allowedRoles) {
  const session = requireSession();
  if (!allowedRoles.includes(session.role)) {
    redirect("/dashboard?akses=ditolak");
  }
  return session;
}
