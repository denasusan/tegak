"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function kirimPesanDiskusiAction(formData) {
  const session = requireSession();
  const diskusiId = String(formData.get("diskusiId") || "");
  const kasusId = String(formData.get("kasusId") || "");
  const tahap = String(formData.get("tahap") || "PELAKSANAAN");
  const isi = String(formData.get("isi") || "").trim();

  if (!isi) {
    redirect(`/kasus/${kasusId}/diskusi?error=` + encodeURIComponent("Catatan tidak boleh kosong."));
  }

  await prisma.pesanDiskusi.create({
    data: { diskusiId, pengirimId: session.id, tahap, isi },
  });

  revalidatePath(`/kasus/${kasusId}/diskusi`);
  redirect(`/kasus/${kasusId}/diskusi`);
}

export async function simpanKesimpulanAction(formData) {
  requireSession();
  const diskusiId = String(formData.get("diskusiId") || "");
  const kasusId = String(formData.get("kasusId") || "");
  const kesimpulan = String(formData.get("kesimpulan") || "").trim();
  const tindakLanjut = String(formData.get("tindakLanjut") || "").trim();
  const tutupKasus = formData.get("tutupKasus") === "on";

  if (tutupKasus && (!kesimpulan || !tindakLanjut)) {
    redirect(
      `/kasus/${kasusId}/diskusi?error=` +
        encodeURIComponent("Kesimpulan dan tindak lanjut wajib diisi sebelum kasus bisa ditutup.")
    );
  }

  await prisma.diskusiKasus.update({
    where: { id: diskusiId },
    data: {
      kesimpulan: kesimpulan || null,
      tindakLanjut: tindakLanjut || null,
      ditutup: tutupKasus,
    },
  });

  if (tutupKasus) {
    await prisma.kasusBalita.update({ where: { id: kasusId }, data: { statusKasus: "SELESAI" } });
  }

  revalidatePath(`/kasus/${kasusId}/diskusi`);
  revalidatePath(`/kasus/${kasusId}`);
  revalidatePath("/kasus");
  revalidatePath("/dashboard");
  redirect(`/kasus/${kasusId}/diskusi?tersimpan=1`);
}
