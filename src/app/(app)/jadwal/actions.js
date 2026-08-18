"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function buatPertemuanAction(formData) {
  requireSession();
  const judul = String(formData.get("judul") || "").trim();
  const tanggalRaw = String(formData.get("tanggal") || "");
  const topik = String(formData.get("topik") || "").trim();

  if (!judul || !tanggalRaw) {
    redirect("/jadwal?error=" + encodeURIComponent("Judul dan tanggal pertemuan wajib diisi."));
  }

  await prisma.pertemuanTim.create({
    data: { judul, tanggal: new Date(tanggalRaw), topik },
  });

  revalidatePath("/jadwal");
  redirect("/jadwal?ok=1");
}

export async function simpanNotulenAction(formData) {
  requireSession();
  const pertemuanId = String(formData.get("pertemuanId") || "");
  const notulen = String(formData.get("notulen") || "").trim();

  await prisma.pertemuanTim.update({
    where: { id: pertemuanId },
    data: { notulen: notulen || null },
  });

  revalidatePath("/jadwal");
  redirect("/jadwal?ok=1");
}

export async function tandaiHadirAction(formData) {
  const session = requireSession();
  const pertemuanId = String(formData.get("pertemuanId") || "");

  const sudah = await prisma.kehadiranPertemuan.findUnique({
    where: { pertemuanId_userId: { pertemuanId, userId: session.id } },
  });

  if (sudah) {
    await prisma.kehadiranPertemuan.delete({ where: { id: sudah.id } });
  } else {
    await prisma.kehadiranPertemuan.create({
      data: { pertemuanId, userId: session.id, hadir: true },
    });
  }

  revalidatePath("/jadwal");
  redirect("/jadwal?ok=1");
}
