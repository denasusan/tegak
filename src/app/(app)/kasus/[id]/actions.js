"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const cb = (formData, name) => formData.get(name) === "on";

export async function simpanSkriningAction(formData) {
  const session = requireRole(["DOKTER"]);
  const kasusId = String(formData.get("kasusId") || "");
  if (!kasusId) redirect("/kasus");

  const data = {
    testMantoux: String(formData.get("testMantoux") || "") || null,
    hasilHB: String(formData.get("hasilHB") || "").trim() || null,
    infeksiBerulang: cb(formData, "infeksiBerulang"),
    lilaIbu: String(formData.get("lilaIbu") || "").trim() || null,
    sosialEkonomi: String(formData.get("sosialEkonomi") || "").trim() || null,
    polaAsuh: String(formData.get("polaAsuh") || "").trim() || null,
    riwayatBBLR: cb(formData, "riwayatBBLR"),
    mikrosefali: cb(formData, "mikrosefali"),
    isk: cb(formData, "isk"),
    tb: cb(formData, "tb"),
    catatanTambahan: String(formData.get("catatanTambahan") || "").trim() || null,
    hasilSkrining: String(formData.get("hasilSkrining") || "") || null,
    diisiOlehId: session.id,
  };

  await prisma.skrining.upsert({
    where: { kasusId },
    update: data,
    create: { ...data, kasusId },
  });

  // Layar 3 — Rujukan Otomatis Lintas Profesi: dipicu otomatis begitu hasil
  // skrining disimpan dengan hasil positif (sesuai temuan FGD P1).
  const rujukanDibuat = [];

  if (data.hasilSkrining === "POSITIF") {
    const sudahAda = await prisma.rujukan.findFirst({
      where: { kasusId, jenisRujukan: "AHLI_GIZI" },
    });
    if (!sudahAda) {
      rujukanDibuat.push(
        prisma.rujukan.create({
          data: {
            kasusId,
            jenisRujukan: "AHLI_GIZI",
            tujuan: "Ahli Gizi Puskesmas",
            alasan: "Skrining positif → rujuk ke Ahli Gizi untuk kajian pola makan.",
          },
        })
      );
    }
  }

  if (data.testMantoux === "POSITIF") {
    const sudahAda = await prisma.rujukan.findFirst({
      where: { kasusId, jenisRujukan: "RS_TB" },
    });
    if (!sudahAda) {
      rujukanDibuat.push(
        prisma.rujukan.create({
          data: {
            kasusId,
            jenisRujukan: "RS_TB",
            tujuan: "RS — dr. Anak (Poli TB Anak)",
            alasan: "Mantoux positif → rujuk ke RS untuk terapi TB oleh dokter anak.",
          },
        })
      );
    }
  }

  if (rujukanDibuat.length > 0) {
    await Promise.all(rujukanDibuat);
  }

  await prisma.kasusBalita.update({
    where: { id: kasusId },
    data: { statusKasus: rujukanDibuat.length > 0 ? "DIRUJUK" : "SKRINING_SELESAI" },
  });

  revalidatePath(`/kasus/${kasusId}`);
  revalidatePath(`/kasus/${kasusId}/rujukan`);
  revalidatePath("/kasus");
  revalidatePath("/dashboard");
  redirect(`/kasus/${kasusId}?skrining=1`);
}

export async function bukaDiskusiTimAction(formData) {
  requireRole(["DOKTER", "BIDAN", "AHLI_GIZI", "SANITARIAN", "KEPALA_PUSKESMAS", "KADER"]);
  const kasusId = String(formData.get("kasusId") || "");
  if (!kasusId) redirect("/kasus");

  const kasus = await prisma.kasusBalita.findUnique({ where: { id: kasusId } });
  if (!kasus) redirect("/kasus");

  const diskusiAda = await prisma.diskusiKasus.findUnique({ where: { kasusId } });
  if (!diskusiAda) {
    await prisma.diskusiKasus.create({
      data: {
        kasusId,
        briefing: `Ringkasan kasus: ${kasus.namaBalita} — ${kasus.indikasiRisiko}`,
      },
    });
    await prisma.kasusBalita.update({
      where: { id: kasusId },
      data: { statusKasus: "DALAM_DISKUSI_TIM" },
    });
    revalidatePath(`/kasus/${kasusId}`);
    revalidatePath("/kasus");
  }

  redirect(`/kasus/${kasusId}/diskusi`);
}
