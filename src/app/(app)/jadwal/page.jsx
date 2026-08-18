import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/PageHeader";
import { Card, CardHeader } from "@/components/Card";
import { Badge, PrioritasBadge } from "@/components/Badge";
import { SubmitButton } from "@/components/SubmitButton";
import { formatTanggal } from "@/lib/utils";
import { buatPertemuanAction, simpanNotulenAction, tandaiHadirAction } from "./actions";

export default async function JadwalTimPage({ searchParams }) {
  const session = requireSession();

  const pertemuan = await prisma.pertemuanTim.findMany({
    orderBy: { tanggal: "desc" },
    include: { kehadiran: { include: { user: true } } },
  });

  const sekarang = new Date();

  return (
    <div>
      <PageHeader
        eyebrow="Layar 6 dari 8 · Pengguna: Semua Anggota Tim"
        title="📅 Jadwal Tim Bulan Ini"
        subtitle="Terjadwal otomatis mengikuti pola pertemuan bulanan yang sudah berjalan. Memperkuat kebiasaan baik yang sudah ada, bukan memperkenalkan rapat baru."
        action={<PrioritasBadge prioritas="Sedang" />}
      />

      {searchParams?.error ? (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</div>
      ) : null}
      {searchParams?.ok ? (
        <div className="mb-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">Perubahan tersimpan.</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {pertemuan.length === 0 ? (
            <EmptyState title="Belum ada jadwal pertemuan" description="Tambahkan jadwal pertama di panel sebelah kanan." />
          ) : (
            pertemuan.map((p) => {
              const akanDatang = new Date(p.tanggal) >= sekarang;
              const sayaHadir = p.kehadiran.some((k) => k.userId === session.id);
              return (
                <Card key={p.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink-900">{p.judul}</p>
                      <p className="text-sm text-ink-500">{formatTanggal(p.tanggal)}</p>
                      <p className="mt-1 text-sm text-ink-700">{p.topik}</p>
                    </div>
                    <Badge className={akanDatang ? "bg-sky-100 text-sky-800" : "bg-ink-200 text-ink-700"}>
                      {akanDatang ? "🔔 Akan datang" : "Sudah berlalu"}
                    </Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                    <span className="font-semibold text-ink-700">Hadir ({p.kehadiran.length}):</span>
                    {p.kehadiran.length === 0 ? (
                      <span>belum ada</span>
                    ) : (
                      p.kehadiran.map((k) => (
                        <Badge key={k.id} className="bg-ink-100 text-ink-700">
                          {k.user.nama}
                        </Badge>
                      ))
                    )}
                  </div>

                  <form action={tandaiHadirAction} className="mt-3">
                    <input type="hidden" name="pertemuanId" value={p.id} />
                    <SubmitButton variant={sayaHadir ? "outline" : "primary"}>
                      {sayaHadir ? "Batalkan Kehadiran" : "Tandai Hadir"}
                    </SubmitButton>
                  </form>

                  <div className="mt-4 border-t border-ink-100 pt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-600">📝 Notulen</p>
                    <form action={simpanNotulenAction} className="space-y-2">
                      <input type="hidden" name="pertemuanId" value={p.id} />
                      <textarea name="notulen" rows={2} defaultValue={p.notulen || ""} placeholder="Notulen otomatis tersimpan di sini..." />
                      <SubmitButton variant="outline">Simpan Notulen</SubmitButton>
                    </form>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <Card className="h-fit">
          <CardHeader title="Jadwalkan Pertemuan" subtitle="Pengingat pertemuan koordinasi bulanan." />
          <form action={buatPertemuanAction} className="space-y-4">
            <div>
              <label htmlFor="judul">Judul Pertemuan</label>
              <input id="judul" name="judul" type="text" placeholder="Pertemuan Koordinasi Tim Bulanan" required />
            </div>
            <div>
              <label htmlFor="tanggal">Tanggal</label>
              <input id="tanggal" name="tanggal" type="date" required />
            </div>
            <div>
              <label htmlFor="topik">Topik</label>
              <textarea id="topik" name="topik" rows={2} placeholder="Riwayat kehadiran & topik dibahas..." />
            </div>
            <SubmitButton>Lihat Detail Pertemuan</SubmitButton>
          </form>

          <div className="mt-6 rounded-xl bg-primary-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Dasar Temuan FGD</p>
            <p className="mt-2 text-sm text-primary-900">
              P2: pertemuan tim lintas profesi rutin sebulan sekali, "kami merasa puas dengan kerja
              tim kami."
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
