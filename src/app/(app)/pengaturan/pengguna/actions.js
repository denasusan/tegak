"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/roles";

function redirectDenganError(pesan) {
  redirect("/pengaturan/pengguna?error=" + encodeURIComponent(pesan));
}
function redirectDenganSukses(pesan) {
  redirect("/pengaturan/pengguna?sukses=" + encodeURIComponent(pesan));
}

export async function tambahPenggunaAction(formData) {
  requireRole(["KEPALA_PUSKESMAS"]);

  const nama = String(formData.get("nama") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "");
  const puskesmas = String(formData.get("puskesmas") || "").trim();

  if (!nama || !email || !password || !ROLES.includes(role)) {
    redirectDenganError("Nama, email, kata sandi, dan role wajib diisi dengan benar.");
  }
  if (password.length < 8) {
    redirectDenganError("Kata sandi minimal 8 karakter.");
  }

  const sudahAda = await prisma.user.findUnique({ where: { email } });
  if (sudahAda) {
    redirectDenganError("Email sudah terdaftar.");
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { nama, email, password: hashed, role, puskesmas: puskesmas || undefined },
  });

  revalidatePath("/pengaturan/pengguna");
  redirectDenganSukses(`Pengguna ${nama} berhasil ditambahkan.`);
}

export async function updatePenggunaAction(formData) {
  requireRole(["KEPALA_PUSKESMAS"]);

  const id = String(formData.get("id") || "");
  const role = String(formData.get("role") || "");
  const puskesmas = String(formData.get("puskesmas") || "").trim();

  if (!id || !ROLES.includes(role)) {
    redirectDenganError("Data pengguna tidak valid.");
  }

  await prisma.user.update({
    where: { id },
    data: { role, puskesmas: puskesmas || undefined },
  });

  revalidatePath("/pengaturan/pengguna");
  redirectDenganSukses("Data pengguna berhasil diperbarui.");
}

export async function hapusPenggunaAction(formData) {
  const session = requireRole(["KEPALA_PUSKESMAS"]);
  const id = String(formData.get("id") || "");

  if (id === session.id) {
    redirectDenganError("Tidak bisa menghapus akun sendiri.");
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    redirectDenganError("Pengguna tidak ditemukan.");
  }

  if (target.role === "KEPALA_PUSKESMAS") {
    const jumlahKepala = await prisma.user.count({ where: { role: "KEPALA_PUSKESMAS" } });
    if (jumlahKepala <= 1) {
      redirectDenganError("Tidak bisa menghapus satu-satunya akun Kepala Puskesmas.");
    }
  }

  try {
    await prisma.user.delete({ where: { id } });
  } catch {
    redirectDenganError(
      "Pengguna ini tidak bisa dihapus karena masih memiliki data terkait (kasus/diskusi/dll). Ubah role-nya saja jika ingin membatasi akses."
    );
  }

  revalidatePath("/pengaturan/pengguna");
  redirectDenganSukses("Pengguna berhasil dihapus.");
}
