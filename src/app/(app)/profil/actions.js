"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

function redirectDenganError(pesan) {
  redirect("/profil?error=" + encodeURIComponent(pesan));
}
function redirectDenganSukses(pesan) {
  redirect("/profil?sukses=" + encodeURIComponent(pesan));
}

export async function updateProfilAction(formData) {
  const session = requireSession();
  const nama = String(formData.get("nama") || "").trim();
  const puskesmas = String(formData.get("puskesmas") || "").trim();

  if (!nama) {
    redirectDenganError("Nama tidak boleh kosong.");
  }

  const user = await prisma.user.update({
    where: { id: session.id },
    data: { nama, puskesmas: puskesmas || undefined },
  });

  setSessionCookie(user);
  redirectDenganSukses("Profil berhasil diperbarui.");
}

export async function ubahPasswordAction(formData) {
  const session = requireSession();
  const passwordSaatIni = String(formData.get("passwordSaatIni") || "");
  const passwordBaru = String(formData.get("passwordBaru") || "");
  const konfirmasiPassword = String(formData.get("konfirmasiPassword") || "");

  if (!passwordSaatIni || !passwordBaru || !konfirmasiPassword) {
    redirectDenganError("Semua kolom kata sandi wajib diisi.");
  }
  if (passwordBaru.length < 8) {
    redirectDenganError("Kata sandi baru minimal 8 karakter.");
  }
  if (passwordBaru !== konfirmasiPassword) {
    redirectDenganError("Konfirmasi kata sandi baru tidak cocok.");
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  const cocok = await bcrypt.compare(passwordSaatIni, user.password);
  if (!cocok) {
    redirectDenganError("Kata sandi saat ini salah.");
  }

  const hashed = await bcrypt.hash(passwordBaru, 10);
  await prisma.user.update({ where: { id: session.id }, data: { password: hashed } });

  redirectDenganSukses("Kata sandi berhasil diubah.");
}
