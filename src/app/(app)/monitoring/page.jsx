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
} from "@/lib/utils";

const SISTEM_TERINTEGRASI = [
  { nama: "SIMPUS", deskripsi: "Sistem Informasi Manajemen Puskesmas", status: "Tersinkron 4 menit lalu" },
  { nama: "SIGIZI", deskripsi: "Sistem Informasi Gizi Terpadu", status: "Tersinkron 4 menit lalu" },
  { nama: "SATUSEHAT", deskripsi: "Platform Kemenkes RI", status: "Rencana integrasi — belum aktif" },
];

export default async function DashboardMonitoringPage() {
  requireRole(["KEPALA_PUSKESMAS"]);

  const awalBulan = new Date();
  awalBulan.setDate(1);
  awalBulan.setHours(0, 0, 0, 0);

  const [totalKasus, kasusSelesai, kasusBulanIni, kasusPerStatus, rujukanPerStatus] = await Promise.all([
    prisma.kasusBalita.count(),
    prisma.kasusBalita.count({ where: { statusKasus: "SELESAI" } }),
    prisma.kasusBalita.count({ where: { createdAt: { gte: awalBulan } } }),
    prisma.kasusBalita.groupBy({ by: ["statusKasus"], _count: { _all: true } }),
    prisma.rujukan.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const persenSelesai = totalKasus > 0 ? Math.round((kasusSelesai / totalKasus) * 100) : 0;

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
        <StatCard label="Total Kasus" value={totalKasus} />
        <StatCard label="Kasus Baru Bulan Ini" value={kasusBulanIni} tone="accent" />
        <StatCard label="Kasus Selesai" value={kasusSelesai} />
        <StatCard label="Indikator M&E" value={`${persenSelesai}%`} hint="Persentase kasus stunting yang selesai ditangani" tone="ink" />
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
