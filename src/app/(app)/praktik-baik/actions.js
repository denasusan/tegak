"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function bagikanPraktikBaikAction(formData) {
  const session = requireSession();

  const judul = String(formData.get("judul") || "").trim();
  const deskripsi = String(formData.get("deskripsi") || "").trim();
  const kategoriKasus = String(formData.get("kategoriKasus") || "").trim();
  const puskesmasAsal = String(formData.get("puskesmasAsal") || "").trim() || session.puskesmas || "Puskesmas Padang Kerambil";
  const kasusTerkaitId = String(formData.get("kasusTerkaitId") || "") || null;

  if (!judul || !deskripsi || !kategoriKasus) {
    redirect(
      "/praktik-baik?error=" + encodeURIComponent("Judul, deskripsi, dan kategori kasus wajib diisi.")
    );
  }

  await prisma.praktikBaik.create({
    data: {
      judul,
      deskripsi,
      kategoriKasus,
      puskesmasAsal,
      dibagikanOlehId: session.id,
      kasusTerkaitId,
    },
  });

  revalidatePath("/praktik-baik");
  redirect("/praktik-baik?ok=1");
}
