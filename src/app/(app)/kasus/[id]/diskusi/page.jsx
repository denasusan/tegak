import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader } from "@/components/Card";
import { Badge, PrioritasBadge } from "@/components/Badge";
import { SubmitButton } from "@/components/SubmitButton";
import { TAHAP_DISKUSI_LABEL, formatTanggalWaktu } from "@/lib/utils";
import { kirimPesanDiskusiAction, simpanKesimpulanAction } from "./actions";

const TAHAP_WARNA = {
  BRIEFING: "bg-sky-100 text-sky-800",
  PELAKSANAAN: "bg-primary-100 text-primary-800",
  DEBRIEFING: "bg-accent-100 text-accent-800",
};

export default async function DiskusiTimPage({ params, searchParams }) {
  requireSession();

  const kasus = await prisma.kasusBalita.findUnique({
    where: { id: params.id },
    include: {
      diskusi: {
        include: { pesan: { include: { pengirim: true }, orderBy: { createdAt: "asc" } } },
      },
    },
  });
  if (!kasus) notFound();

  if (!kasus.diskusi) {
    return (
      <div>
        <PageHeader eyebrow="Layar 4 dari 8" title={`💬 Diskusi Tim — ${kasus.namaBalita}`} />
        <Card>
          <p className="text-sm text-ink-600">
            Forum diskusi untuk kasus ini belum dibuka. Buka forum dari halaman{" "}
            <Link href={`/kasus/${kasus.id}`} className="font-semibold text-primary-700 hover:underline">
              profil kasus
            </Link>
            .
          </p>
        </Card>
      </div>
    );
  }

  const diskusi = kasus.diskusi;

  return (
    <div>
      <PageHeader
        eyebrow="Layar 4 dari 8 · Pengguna: Semua Profesi Terkait"
        title={`💬 Diskusi Tim — ${kasus.namaBalita}`}
        subtitle="Dibuka otomatis untuk kasus yang butuh keputusan lintas profesi."
        action={<PrioritasBadge prioritas="Tinggi" />}
      />

      {searchParams?.error ? (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</div>
      ) : null}
      {searchParams?.tersimpan ? (
        <div className="mb-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">
          {diskusi.ditutup ? "Kesimpulan tersimpan dan kasus telah ditutup." : "Kesimpulan tersimpan."}
        </div>
      ) : null}

      <div className="mb-6">
        <Link href={`/kasus/${kasus.id}`} className="text-sm font-semibold text-primary-700 hover:underline">
          ← Kembali ke profil kasus
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader
              title="B · Briefing: ringkasan kasus & tujuan diskusi"
              subtitle="Forum bukan sekadar chat bebas — mengikuti alur briefing–pelaksanaan–debriefing."
            />
            <p className="text-sm text-ink-700">{diskusi.briefing || "-"}</p>
          </Card>

          <Card>
            <CardHeader title="P · Pelaksanaan: catatan tiap profesi" />
            <div className="space-y-3">
              {diskusi.pesan.length === 0 ? (
                <p className="text-sm text-ink-500">Belum ada catatan diskusi.</p>
              ) : (
                diskusi.pesan.map((p) => (
                  <div key={p.id} className="rounded-xl border border-ink-100 p-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink-800">{p.pengirim.nama}</span>
                      <Badge className={TAHAP_WARNA[p.tahap]}>{TAHAP_DISKUSI_LABEL[p.tahap]}</Badge>
                    </div>
                    <p className="text-sm text-ink-700">{p.isi}</p>
                    <p className="mt-1 text-xs text-ink-400">{formatTanggalWaktu(p.createdAt)}</p>
                  </div>
                ))
              )}
            </div>

            {!diskusi.ditutup ? (
              <form action={kirimPesanDiskusiAction} className="mt-4 space-y-3 border-t border-ink-100 pt-4">
                <input type="hidden" name="diskusiId" value={diskusi.id} />
                <input type="hidden" name="kasusId" value={kasus.id} />
                <div>
                  <label htmlFor="tahap">Tahap</label>
                  <select id="tahap" name="tahap" defaultValue="PELAKSANAAN">
                    <option value="BRIEFING">Briefing</option>
                    <option value="PELAKSANAAN">Pelaksanaan</option>
                    <option value="DEBRIEFING">Debriefing</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="isi">Catatan</label>
                  <textarea id="isi" name="isi" rows={2} placeholder="Tulis catatan dari sudut pandang profesi Anda..." required />
                </div>
                <SubmitButton variant="outline">Kirim Catatan</SubmitButton>
              </form>
            ) : null}
          </Card>

          <Card>
            <CardHeader
              title="D · Debriefing: kesimpulan & tindak lanjut wajib"
              subtitle="Kolom ini WAJIB diisi sebelum kasus bisa ditutup."
            />
            {diskusi.ditutup ? (
              <div className="space-y-2 text-sm text-ink-700">
                <p><span className="font-semibold">Kesimpulan:</span> {diskusi.kesimpulan}</p>
                <p><span className="font-semibold">Tindak lanjut:</span> {diskusi.tindakLanjut}</p>
                <Badge className="bg-ink-200 text-ink-700">Kasus telah ditutup</Badge>
              </div>
            ) : (
              <form action={simpanKesimpulanAction} className="space-y-4">
                <input type="hidden" name="diskusiId" value={diskusi.id} />
                <input type="hidden" name="kasusId" value={kasus.id} />
                <div>
                  <label htmlFor="kesimpulan">Kesimpulan</label>
                  <textarea id="kesimpulan" name="kesimpulan" rows={2} defaultValue={diskusi.kesimpulan || ""} />
                </div>
                <div>
                  <label htmlFor="tindakLanjut">Tindak Lanjut</label>
                  <textarea id="tindakLanjut" name="tindakLanjut" rows={2} defaultValue={diskusi.tindakLanjut || ""} />
                </div>
                <label className="flex items-center gap-2 text-sm text-ink-700">
                  <input type="checkbox" name="tutupKasus" className="h-4 w-4 rounded border-ink-300" />
                  Tutup kasus ini setelah menyimpan
                </label>
                <SubmitButton>Simpan Kesimpulan Tim</SubmitButton>
              </form>
            )}
          </Card>
        </div>

        <Card className="h-fit bg-primary-50">
          <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Dasar Temuan FGD</p>
          <p className="mt-2 text-sm text-primary-900">
            Temuan lintas-tema: kerja sama harian lancar, tapi "belum ada kolaborasi antar disiplin
            ilmu" &amp; belum pernah dilatih IPC — fitur ini membentuk kebiasaan kolaborasi
            terstruktur.
          </p>
        </Card>
      </div>
    </div>
  );
}
