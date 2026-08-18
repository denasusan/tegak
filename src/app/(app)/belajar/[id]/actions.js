"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function submitKuisAction(formData) {
  const session = requireSession();
  const modulId = String(formData.get("modulId") || "");

  const kuisList = await prisma.kuis.findMany({ where: { modulId } });
  if (kuisList.length === 0) redirect(`/belajar/${modulId}`);

  let benar = 0;
  for (const k of kuisList) {
    const jawaban = formData.get(`jawaban-${k.id}`);
    if (jawaban !== null && Number(jawaban) === k.jawabanBenar) {
      benar += 1;
    }
  }

  const skor = Math.round((benar / kuisList.length) * 100);
  const lulus = skor >= 70;

  await prisma.progresBelajar.upsert({
    where: { userId_modulId: { userId: session.id, modulId } },
    update: { selesai: true, skorKuis: skor, sertifikat: lulus },
    create: { userId: session.id, modulId, selesai: true, skorKuis: skor, sertifikat: lulus },
  });

  revalidatePath(`/belajar/${modulId}`);
  revalidatePath("/belajar");
  redirect(`/belajar/${modulId}?skor=${skor}`);
}
