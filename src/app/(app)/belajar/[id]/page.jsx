import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { SubmitButton } from "@/components/SubmitButton";
import { submitKuisAction } from "./actions";

export default async function ModulBelajarPage({ params, searchParams }) {
  const session = requireSession();

  const modul = await prisma.modulBelajar.findUnique({
    where: { id: params.id },
    include: {
      kuis: { orderBy: { urutan: "asc" } },
      progres: { where: { userId: session.id } },
    },
  });
  if (!modul) notFound();

  const progresSaya = modul.progres[0];
  const skorBaruSaja = searchParams?.skor;

  return (
    <div>
      <PageHeader eyebrow={`Layar 5 dari 8 · ${modul.domainIPC}`} title={`🎓 ${modul.judul}`} subtitle={modul.deskripsi} />

      <div className="mb-6">
        <Link href="/belajar" className="text-sm font-semibold text-primary-700 hover:underline">
          ← Kembali ke daftar modul
        </Link>
      </div>

      {skorBaruSaja ? (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${
            Number(skorBaruSaja) >= 70 ? "bg-primary-50 text-primary-800" : "bg-accent-50 text-accent-800"
          }`}
        >
          Kuis selesai — skor Anda: {skorBaruSaja}%.{" "}
          {Number(skorBaruSaja) >= 70 ? "Sertifikat internal telah diterbitkan. 🎓" : "Coba lagi untuk mencapai skor minimal 70% dan memperoleh sertifikat."}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="1 · Video singkat: 4 domain kolaborasi IPC" subtitle={`Durasi ${modul.durasiMenit} menit`} />
            <div className="flex aspect-video items-center justify-center rounded-xl bg-ink-900 text-sm text-ink-200">
              ▶ Placeholder video pembelajaran — {modul.judul}
            </div>
          </Card>

          <Card>
            <CardHeader title="2 · Studi kasus dari Puskesmas sendiri" />
            <p className="text-sm text-ink-700">{modul.studiKasus || "-"}</p>
          </Card>

          <Card>
            <CardHeader title="3 · Kuis singkat & sertifikat internal" />
            {modul.kuis.length === 0 ? (
              <p className="text-sm text-ink-500">Belum ada kuis untuk modul ini.</p>
            ) : (
              <form action={submitKuisAction} className="space-y-5">
                <input type="hidden" name="modulId" value={modul.id} />
                {modul.kuis.map((k, idx) => {
                  const pilihan = JSON.parse(k.pilihan);
                  return (
                    <div key={k.id}>
                      <p className="mb-2 text-sm font-semibold text-ink-800">
                        {idx + 1}. {k.pertanyaan}
                      </p>
                      <div className="space-y-2">
                        {pilihan.map((opsi, i) => (
                          <label key={i} className="flex items-start gap-2 rounded-xl border border-ink-100 px-3 py-2 text-sm text-ink-700 hover:bg-ink-50">
                            <input type="radio" name={`jawaban-${k.id}`} value={i} required className="mt-0.5" />
                            {opsi}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <SubmitButton>Kumpulkan Kuis &amp; Mulai Modul (10 menit)</SubmitButton>
              </form>
            )}
          </Card>
        </div>

        <Card className="h-fit bg-primary-50">
          <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Status Anda</p>
          {progresSaya?.sertifikat ? (
            <Badge className="mt-2 bg-primary-600 text-white">🎓 Sertifikat diperoleh — skor {progresSaya.skorKuis}%</Badge>
          ) : progresSaya?.selesai ? (
            <Badge className="mt-2 bg-accent-100 text-accent-800">Skor terakhir {progresSaya.skorKuis}% — belum lulus</Badge>
          ) : (
            <p className="mt-2 text-sm text-primary-900">Anda belum mengerjakan kuis modul ini.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
