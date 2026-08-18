"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function konfirmasiRujukanAction(formData) {
  requireRole(["DOKTER", "AHLI_GIZI", "KEPALA_PUSKESMAS"]);
  const rujukanId = String(formData.get("rujukanId") || "");
  const kasusId = String(formData.get("kasusId") || "");

  await prisma.rujukan.update({
    where: { id: rujukanId },
    data: { status: "DIKONFIRMASI" },
  });

  revalidatePath(`/kasus/${kasusId}/rujukan`);
  redirect(`/kasus/${kasusId}/rujukan?ok=1`);
}

export async function rsKembalikanKePuskesmasAction(formData) {
  requireRole(["DOKTER", "KEPALA_PUSKESMAS"]);
  const rujukanId = String(formData.get("rujukanId") || "");
  const kasusId = String(formData.get("kasusId") || "");
  const catatanBalik = String(formData.get("catatanBalik") || "").trim();

  await prisma.rujukan.update({
    where: { id: rujukanId },
    data: { status: "KEMBALI_KE_PUSKESMAS", catatanBalik: catatanBalik || null },
  });

  revalidatePath(`/kasus/${kasusId}/rujukan`);
  redirect(`/kasus/${kasusId}/rujukan?ok=1`);
}
