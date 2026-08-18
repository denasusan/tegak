import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Badge, PrioritasBadge } from "@/components/Badge";

export default async function BelajarIPCPage() {
  const session = requireSession();

  const modul = await prisma.modulBelajar.findMany({
    orderBy: { urutan: "asc" },
    include: {
      progres: { where: { userId: session.id } },
      kuis: true,
    },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Layar 5 dari 8 · Pengguna: Semua Nakes"
        title="🎓 Belajar IPC"
        subtitle="Notifikasi berkala (mis. bulanan) atau saat nakes baru bergabung ke tim. Materi ringkas berbasis 4 domain interprofessional collaboration."
        action={<PrioritasBadge prioritas="Tinggi" />}
      />

      {modul.length === 0 ? (
        <EmptyState title="Belum ada modul" description="Jalankan `npm run prisma:seed` untuk mengisi modul contoh." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {modul.map((m) => {
            const progresSaya = m.progres[0];
            return (
              <Link key={m.id} href={`/belajar/${m.id}`}>
                <Card className="h-full transition hover:border-primary-300 hover:shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">{m.domainIPC}</p>
                  <p className="mt-1 font-semibold text-ink-900">{m.judul}</p>
                  <p className="mt-2 text-sm text-ink-600">{m.deskripsi}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge className="bg-ink-100 text-ink-700">⏱ {m.durasiMenit} menit</Badge>
                    {progresSaya?.sertifikat ? (
                      <Badge className="bg-primary-100 text-primary-800">🎓 Sertifikat diperoleh</Badge>
                    ) : progresSaya?.selesai ? (
                      <Badge className="bg-accent-100 text-accent-800">Selesai · skor {progresSaya.skorKuis}%</Badge>
                    ) : (
                      <Badge className="bg-ink-50 text-ink-500">Belum dimulai</Badge>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <Card className="mt-6 bg-primary-50">
        <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Dasar Temuan FGD</p>
        <p className="mt-2 text-sm text-primary-900">
          P1: "belum pernah nakes di puskesmas saya dilatih tentang IPC." Rencana tim peneliti:
          pelatihan IPC bersama narasumber pakar IPE (Dr. Rona, Universitas Andalas).
        </p>
      </Card>
    </div>
  );
}
