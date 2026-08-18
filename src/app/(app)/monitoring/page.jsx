import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardHeader } from "@/components/Card";
import { Badge, PrioritasBadge } from "@/components/Badge";
import {
  STATUS_KASUS_LABEL,
  STATUS_KASUS_WARNA,
  STATUS_RUJUKAN_LABEL,
  STATUS_RUJUKAN_WARNA,
  hitungTrenBulanan,
  profesiBertugas,
  waktuRelatif,
  formatTanggal,
} from "@/lib/utils";

const SISTEM_TERINTEGRASI = [
  { nama: "SIMPUS", deskripsi: "Sistem Informasi Manajemen Puskesmas", status: "Tersinkron 4 menit lalu" },
  { nama: "SIGIZI", deskripsi: "Sistem Informasi Gizi Terpadu", status: "Tersinkron 4 menit lalu" },
  { nama: "SATUSEHAT", deskripsi: "Platform Kemenkes RI", status: "Rencana integrasi — belum aktif" },
];

export default async function DashboardMonitoringPage() {
  requireRole(["KEPALA_PUSKESMAS"]);

  const [
    totalKasus,
    kasusAktif,
    kasusSelesai,
    menungguTindakLanjut,
    rujukanAktif,
    kasusPerStatus,
    rujukanPerStatus,
    kasusTerbaru,
    diskusiAktif,
    semuaTanggalKasus,
    pesanTerbaru,
    rujukanMenunggu,
    pertemuanMendatang,
  ] = await Promise.all([
    prisma.kasusBalita.count(),
    prisma.kasusBalita.count({ where: { statusKasus: { not: "SELESAI" } } }),
    prisma.kasusBalita.count({ where: { statusKasus: "SELESAI" } }),
    prisma.kasusBalita.count({ where: { statusKasus: "MENUNGGU_SKRINING" } }),
    prisma.rujukan.count({ where: { status: { in: ["MENUNGGU", "DIKONFIRMASI"] } } }),
    prisma.kasusBalita.groupBy({ by: ["statusKasus"], _count: { _all: true } }),
    prisma.rujukan.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.kasusBalita.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: { dibuatOleh: true, skrining: { include: { diisiOleh: true } }, rujukan: true },
    }),
    prisma.diskusiKasus.findMany({
      where: { ditutup: false },
      orderBy: { updatedAt: "desc" },
      take: 3,
      include: {
        kasus: true,
        pesan: { orderBy: { createdAt: "desc" }, take: 1, include: { pengirim: true } },
        _count: { select: { pesan: true } },
      },
    }),
    prisma.kasusBalita.findMany({ select: { createdAt: true } }),
    prisma.pesanDiskusi.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { pengirim: true, diskusi: { include: { kasus: true } } },
    }),
    prisma.rujukan.findMany({
      where: { status: "MENUNGGU" },
      orderBy: { updatedAt: "desc" },
      take: 2,
      include: { kasus: true },
    }),
    prisma.pertemuanTim.findFirst({ where: { tanggal: { gte: new Date() } }, orderBy: { tanggal: "asc" } }),
  ]);

  const persenSelesai = totalKasus > 0 ? Math.round((kasusSelesai / totalKasus) * 100) : 0;
  const trenBulanan = hitungTrenBulanan(semuaTanggalKasus, 6);
  const maxTren = Math.max(...trenBulanan.map((b) => b.jumlah), 1);

  const notifikasi = [];
  if (pertemuanMendatang) {
    notifikasi.push({
      warna: "bg-accent-500",
      teks: `Jadwal: ${pertemuanMendatang.judul} — ${formatTanggal(pertemuanMendatang.tanggal)}`,
      waktu: pertemuanMendatang.tanggal,
    });
  }
  for (const r of rujukanMenunggu) {
    notifikasi.push({
      warna: "bg-red-500",
      teks: `Rujukan ${r.kasus.namaBalita} menunggu tindak lanjut`,
      waktu: r.updatedAt,
    });
  }
  for (const p of pesanTerbaru) {
    notifikasi.push({
      warna: "bg-primary-500",
      teks: `${p.pengirim.nama}: "${p.isi}" — kasus ${p.diskusi.kasus.namaBalita}`,
      waktu: p.createdAt,
    });
  }
  notifikasi.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
  const notifikasiTerbatas = notifikasi.slice(0, 5);

  return (
    <div>
      <PageHeader
        eyebrow="Layar 7 dari 8 · Pengguna: Kepala Puskesmas / Dinkes"
        title="📊 Dashboard Koordinasi Kasus"
        subtitle="Dibuka Kepala Puskesmas/Dinas Kesehatan kapan saja untuk pemantauan berkala. Data tidak diinput dua kali — tersinkron dari sistem yang sudah dipakai nakes sehari-hari."
        action={
          <div className="flex items-center gap-2">
            <PrioritasBadge prioritas="Tinggi" />
            <a
              href="/api/laporan"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Ekspor Laporan
            </a>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Kasus Aktif" value={kasusAktif} hint="kasus balita berisiko" href="/kasus?status=aktif" />
        <StatCard
          label="Selesai Terkoordinasi"
          value={kasusSelesai}
          hint={`${persenSelesai}% dari total kasus`}
          tone="ink"
          href="/kasus?status=SELESAI"
        />
        <StatCard
          label="Menunggu Tindak Lanjut"
          value={menungguTindakLanjut}
          hint="perlu perhatian segera"
          tone="accent"
          href="/kasus?status=MENUNGGU_SKRINING"
        />
        <StatCard
          label="Rujukan Aktif"
          value={rujukanAktif}
          hint="menunggu tindakan lintas profesi"
          href="/kasus?rujukan=aktif"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Daftar Kasus Terbaru"
            action={
              <Link href="/kasus" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                Lihat Semua →
              </Link>
            }
          />
          {kasusTerbaru.length === 0 ? (
            <p className="text-sm text-ink-500">Belum ada data kasus.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                    <th className="pb-2 pr-4">Nama Balita</th>
                    <th className="pb-2 pr-4">Wilayah</th>
                    <th className="pb-2 pr-4">Profesi Bertugas</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2">Diperbarui</th>
                  </tr>
                </thead>
                <tbody>
                  {kasusTerbaru.map((k) => (
                    <tr key={k.id} className="border-b border-ink-50 last:border-0">
                      <td className="py-2.5 pr-4 font-semibold text-ink-900">
                        <Link href={`/kasus/${k.id}`} className="hover:text-primary-600">
                          {k.namaBalita}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-4 text-ink-600">{k.alamat ?? "-"}</td>
                      <td className="py-2.5 pr-4 text-ink-600">{profesiBertugas(k)}</td>
                      <td className="py-2.5 pr-4">
                        <Badge className={STATUS_KASUS_WARNA[k.statusKasus]}>{STATUS_KASUS_LABEL[k.statusKasus]}</Badge>
                      </td>
                      <td className="py-2.5 text-ink-400">{waktuRelatif(k.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Diskusi Lintas Profesi Aktif" />
          <div className="space-y-3">
            {diskusiAktif.length === 0 ? (
              <p className="text-sm text-ink-500">Belum ada diskusi aktif.</p>
            ) : (
              diskusiAktif.map((d) => (
                <Link
                  key={d.id}
                  href={`/kasus/${d.kasusId}/diskusi`}
                  className="block rounded-xl border border-ink-100 p-3 transition hover:border-primary-300 hover:bg-primary-50/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-ink-900">Kasus {d.kasus.namaBalita}</p>
                    <Badge className="bg-primary-100 text-primary-800">{d._count.pesan}</Badge>
                  </div>
                  {d.pesan[0] ? (
                    <p className="mt-1 text-xs text-ink-500">
                      {d.pesan[0].pengirim.nama}: &ldquo;{d.pesan[0].isi}&rdquo;
                    </p>
                  ) : null}
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={`Tren Kasus per Bulan (${new Date().getFullYear()})`} />
          <div className="flex items-end gap-3" style={{ height: 160 }}>
            {trenBulanan.map((b) => (
              <div key={`${b.tahun}-${b.bulan}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-semibold text-ink-700">{b.jumlah}</span>
                <div
                  className="w-full max-w-12 rounded-t-lg bg-primary-600"
                  style={{ height: `${Math.max(4, (b.jumlah / maxTren) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3">
            {trenBulanan.map((b) => (
              <span key={`label-${b.tahun}-${b.bulan}`} className="flex-1 text-center text-xs text-ink-400">
                {b.label}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Notifikasi Terbaru" />
          <ul className="space-y-3">
            {notifikasiTerbatas.length === 0 ? (
              <li className="text-sm text-ink-500">Belum ada notifikasi.</li>
            ) : (
              notifikasiTerbatas.map((n, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.warna}`} />
                  {n.teks}
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="≡ Ringkasan Kasus Aktif per Status" />
          <div className="space-y-2">
            {kasusPerStatus.length === 0 ? (
              <p className="text-sm text-ink-500">Belum ada data kasus.</p>
            ) : (
              kasusPerStatus.map((row) => (
                <div key={row.statusKasus} className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2">
                  <Badge className={STATUS_KASUS_WARNA[row.statusKasus]}>{STATUS_KASUS_LABEL[row.statusKasus]}</Badge>
                  <span className="text-sm font-semibold text-ink-800">{row._count._all}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Ringkasan Rujukan per Status" />
          <div className="space-y-2">
            {rujukanPerStatus.length === 0 ? (
              <p className="text-sm text-ink-500">Belum ada data rujukan.</p>
            ) : (
              rujukanPerStatus.map((row) => (
                <div key={row.status} className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2">
                  <Badge className={STATUS_RUJUKAN_WARNA[row.status]}>{STATUS_RUJUKAN_LABEL[row.status]}</Badge>
                  <span className="text-sm font-semibold text-ink-800">{row._count._all}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="⇄ Sinkron Otomatis: SIMPUS · SIGIZI · SATUSEHAT" subtitle="Simulasi status integrasi sistem eksternal." />
        <div className="grid gap-3 sm:grid-cols-3">
          {SISTEM_TERINTEGRASI.map((sistem) => (
            <div key={sistem.nama} className="rounded-xl border border-ink-100 p-3">
              <p className="font-semibold text-ink-900">{sistem.nama}</p>
              <p className="text-xs text-ink-500">{sistem.deskripsi}</p>
              <p className="mt-2 text-xs font-medium text-primary-600">{sistem.status}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-400">
          * Status integrasi ini adalah simulasi (mock) untuk keperluan prototipe — belum terhubung
          ke sistem eksternal Kemenkes/Dinkes yang sesungguhnya.
        </p>
      </Card>

      <Card className="mt-6 bg-primary-50">
        <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Dasar Temuan FGD</p>
        <p className="mt-2 text-sm text-primary-900">
          P4: keluhan "banyaknya aplikasi di puskesmas sehingga kami bingung", usul integrasi ke
          aplikasi Kemenkes. Tim peneliti: rencana integrasi ke SATUSEHAT.
        </p>
      </Card>
    </div>
  );
}
