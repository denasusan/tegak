"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function buatKasusBaruAction(formData) {
  const session = requireRole(["KADER", "BIDAN"]);

  const namaBalita = String(formData.get("namaBalita") || "").trim();
  const namaOrangTua = String(formData.get("namaOrangTua") || "").trim();
  const tanggalLahirRaw = String(formData.get("tanggalLahir") || "");
  const jenisKelamin = String(formData.get("jenisKelamin") || "");
  const alamat = String(formData.get("alamat") || "").trim();
  const hasilKunjungan = String(formData.get("hasilKunjungan") || "").trim();
  const indikasiRisiko = String(formData.get("indikasiRisiko") || "").trim();

  if (!namaBalita || !namaOrangTua || !indikasiRisiko) {
    redirect(
      "/kasus/baru?error=" +
        encodeURIComponent("Nama balita, nama orang tua, dan indikasi risiko wajib diisi.")
    );
  }

  const kasus = await prisma.kasusBalita.create({
    data: {
      namaBalita,
      namaOrangTua,
      tanggalLahir: tanggalLahirRaw ? new Date(tanggalLahirRaw) : null,
      jenisKelamin: jenisKelamin || null,
      alamat: alamat || null,
      hasilKunjungan: hasilKunjungan || null,
      indikasiRisiko,
      statusKasus: "MENUNGGU_SKRINING",
      dibuatOlehId: session.id,
    },
  });

  revalidatePath("/kasus");
  revalidatePath("/dashboard");
  redirect(`/kasus/${kasus.id}?dibuat=1`);
}
