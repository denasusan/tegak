import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/Card";
import { PrioritasBadge } from "@/components/Badge";
import { labelRole } from "@/lib/roles";

const ALUR_LAYAR = [
  { no: 1, judul: "Deteksi Kasus", href: "/kasus/baru", prioritas: "Tinggi" },
  { no: 2, judul: "Profil & Skrining", href: "/kasus", prioritas: "Tinggi" },
  { no: 3, judul: "Rujukan Otomatis", href: "/kasus", prioritas: "Tinggi" },
  { no: 4, judul: "Diskusi Tim", href: "/kasus", prioritas: "Tinggi" },
  { no: 5, judul: "Microlearning IPC", href: "/belajar", prioritas: "Tinggi" },
  { no: 6, judul: "Jadwal & Notulen", href: "/jadwal", prioritas: "Sedang" },
  { no: 7, judul: "Dashboard & Integrasi", href: "/monitoring", prioritas: "Tinggi" },
  { no: 8, judul: "Knowledge Sharing", href: "/praktik-baik", prioritas: "Sedang" },
];

export default async function DashboardPage({ searchParams }) {
  const session = requireSession();

  const [kasusAktif, kasusSelesai, rujukanMenunggu, pertemuanBerikutnya] = await Promise.all([
    prisma.kasusBalita.count({ where: { statusKasus: { not: "SELESAI" } } }),
    prisma.kasusBalita.count({ where: { statusKasus: "SELESAI" } }),
    prisma.rujukan.count({ where: { status: "MENUNGGU" } }),
    prisma.pertemuanTim.findFirst({
      where: { tanggal: { gte: new Date() } },
      orderBy: { tanggal: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow={`Selamat datang, ${labelRole(session.role)}`}
        title={`Halo, ${session.nama}`}
        subtitle="Ringkasan alur kerja platform kolaborasi interprofesional untuk penurunan stunting di Kota Payakumbuh."
      />

      {searchParams?.akses === "ditolak" ? (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Halaman yang Anda tuju tidak tersedia untuk peran Anda.
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Kasus Aktif" value={kasusAktif} hint="Belum selesai ditangani" href="/kasus?status=aktif" />
        <StatCard label="Kasus Selesai" value={kasusSelesai} tone="ink" href="/kasus?status=SELESAI" />
        <StatCard label="Rujukan Menunggu" value={rujukanMenunggu} tone="accent" href="/kasus?rujukan=aktif" />
        <StatCard
          label="Pertemuan Berikutnya"
          value={pertemuanBerikutnya ? new Date(pertemuanBerikutnya.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) : "-"}
          hint={pertemuanBerikutnya ? pertemuanBerikutnya.judul : "Belum dijadwalkan"}
          href="/jadwal"
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-ink-900">Alur End-to-End & Prioritas Pengembangan</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ALUR_LAYAR.map((layar) => (
            <Link key={layar.no} href={layar.href}>
              <Card className="h-full transition hover:border-primary-300 hover:shadow-md">
                <p className="text-xs font-semibold text-primary-600">Layar {layar.no}/8</p>
                <p className="mt-1 text-sm font-semibold text-ink-900">{layar.judul}</p>
                <div className="mt-3">
                  <PrioritasBadge prioritas={layar.prioritas} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-accent-200 bg-accent-50 p-5">
        <p className="text-sm font-semibold text-accent-800">⚠ Catatan cakupan data</p>
        <p className="mt-1 text-sm text-accent-800/90">
          Storyboard ini disusun dari data FGD Puskesmas Padang Kerambil saja. Aie Tabik dan Tarok
          belum memiliki data FGD, dan Dimensi Profesional (hierarki antar profesi) serta suara
          Perawat/Promkes/Apoteker belum tergali. Disarankan alur divalidasi ulang setelah data
          tambahan tersedia.
        </p>
      </div>
    </div>
  );
}
