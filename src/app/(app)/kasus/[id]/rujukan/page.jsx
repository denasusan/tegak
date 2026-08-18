import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Badge, PrioritasBadge } from "@/components/Badge";
import { SubmitButton } from "@/components/SubmitButton";
import {
  STATUS_RUJUKAN_LABEL,
  STATUS_RUJUKAN_WARNA,
  JENIS_RUJUKAN_LABEL,
  formatTanggalWaktu,
} from "@/lib/utils";
import { konfirmasiRujukanAction, rsKembalikanKePuskesmasAction } from "./actions";

export default async function RujukanKasusPage({ params, searchParams }) {
  const session = requireSession();

  const kasus = await prisma.kasusBalita.findUnique({
    where: { id: params.id },
    include: { rujukan: { orderBy: { createdAt: "asc" } } },
  });
  if (!kasus) notFound();

  const bisaKonfirmasi = ["DOKTER", "AHLI_GIZI", "KEPALA_PUSKESMAS"].includes(session.role);
  const bisaRS = ["DOKTER", "KEPALA_PUSKESMAS"].includes(session.role);

  return (
    <div>
      <PageHeader
        eyebrow="Layar 3 dari 8 · Pengguna: Dokter → Ahli Gizi / RS"
        title={`➡️ Rujukan Kasus — ${kasus.namaBalita}`}
        subtitle="Otomatis muncul begitu hasil skrining di Layar 2 disimpan dengan hasil positif."
        action={<PrioritasBadge prioritas="Tinggi" />}
      />

      {searchParams?.ok ? (
        <div className="mb-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">
          Status rujukan berhasil diperbarui.
        </div>
      ) : null}

      <div className="mb-6">
        <Link href={`/kasus/${kasus.id}`} className="text-sm font-semibold text-primary-700 hover:underline">
          ← Kembali ke profil kasus
        </Link>
      </div>

      {kasus.rujukan.length === 0 ? (
        <EmptyState
          title="Belum ada rujukan otomatis"
          description="Rujukan akan terbentuk otomatis saat hasil skrining di Layar 2 disimpan dengan kesimpulan positif (Ahli Gizi) atau test Mantoux positif (RS)."
        />
      ) : (
        <div className="space-y-4">
          {kasus.rujukan.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                    {JENIS_RUJUKAN_LABEL[r.jenisRujukan] || r.jenisRujukan}
                  </p>
                  <p className="mt-1 font-semibold text-ink-900">{r.tujuan}</p>
                  <p className="mt-1 text-sm text-ink-600">{r.alasan}</p>
                  <p className="mt-2 text-xs text-ink-400">Dibuat {formatTanggalWaktu(r.createdAt)}</p>
                  {r.catatanBalik ? (
                    <p className="mt-2 rounded-lg bg-ink-50 px-3 py-2 text-sm text-ink-700">
                      Catatan RS: {r.catatanBalik}
                    </p>
                  ) : null}
                </div>
                <Badge className={STATUS_RUJUKAN_WARNA[r.status]}>{STATUS_RUJUKAN_LABEL[r.status]}</Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {r.status === "MENUNGGU" && bisaKonfirmasi ? (
                  <form action={konfirmasiRujukanAction}>
                    <input type="hidden" name="rujukanId" value={r.id} />
                    <input type="hidden" name="kasusId" value={kasus.id} />
                    <SubmitButton variant="outline">Konfirmasi Rujukan Terkirim</SubmitButton>
                  </form>
                ) : null}

                {r.jenisRujukan === "RS_TB" && r.status === "DIKONFIRMASI" && bisaRS ? (
                  <form action={rsKembalikanKePuskesmasAction} className="flex flex-1 flex-wrap items-end gap-2">
                    <input type="hidden" name="rujukanId" value={r.id} />
                    <input type="hidden" name="kasusId" value={kasus.id} />
                    <div className="min-w-[200px] flex-1">
                      <label htmlFor={`catatan-${r.id}`}>Catatan RS saat kasus dikembalikan</label>
                      <input id={`catatan-${r.id}`} name="catatanBalik" type="text" placeholder="mis. terapi TB selesai, lanjut pemantauan rutin" />
                    </div>
                    <SubmitButton variant="outline">RS Selesai Tangani → Kembali ke Puskesmas</SubmitButton>
                  </form>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6 bg-primary-50">
        <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Dasar Temuan FGD</p>
        <p className="mt-2 text-sm text-primary-900">
          P1 (verbatim): bila mantoux positif dirujuk ke RS untuk terapi TB oleh dokter anak, lalu
          dirujuk kembali ke Puskesmas untuk pemantauan.
        </p>
      </Card>
    </div>
  );
}
