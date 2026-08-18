import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/PageHeader";
import { Card, CardHeader } from "@/components/Card";
import { PrioritasBadge } from "@/components/Badge";
import { SubmitButton } from "@/components/SubmitButton";
import { formatTanggal } from "@/lib/utils";
import { bagikanPraktikBaikAction } from "./actions";

export default async function PraktikBaikPage({ searchParams }) {
  requireSession();
  const q = (searchParams?.q || "").trim();

  const [praktikBaik, daftarKasus] = await Promise.all([
    prisma.praktikBaik.findMany({
      where: q
        ? {
            OR: [
              { kategoriKasus: { contains: q } },
              { judul: { contains: q } },
              { deskripsi: { contains: q } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: { dibagikanOleh: true, kasusTerkait: true },
    }),
    prisma.kasusBalita.findMany({ select: { id: true, namaBalita: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Layar 8 dari 8 · Pengguna: Semua Puskesmas"
        title="💡 Praktik Baik Antar Puskesmas"
        subtitle="Digunakan bebas kapan saja; disarankan direview tiap pertemuan tim bulanan. Repositori ringan agar praktik baik satu Puskesmas bisa diadopsi Puskesmas lain."
        action={<PrioritasBadge prioritas="Sedang" />}
      />

      {searchParams?.error ? (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</div>
      ) : null}
      {searchParams?.ok ? (
        <div className="mb-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">
          Praktik baik berhasil dibagikan.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <form method="GET" className="flex gap-2">
            <input type="text" name="q" defaultValue={q} placeholder="🔍 Cari praktik baik berdasarkan kasus serupa..." />
            <button type="submit" className="shrink-0 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50">
              Cari
            </button>
          </form>

          {praktikBaik.length === 0 ? (
            <EmptyState title="Belum ada praktik baik" description="Bagikan praktik baik pertama dari panel sebelah kanan." />
          ) : (
            praktikBaik.map((p) => (
              <Card key={p.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-semibold text-ink-900">☆ {p.judul}</p>
                  <span className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-800">
                    {p.kategoriKasus}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-700">{p.deskripsi}</p>
                <p className="mt-3 text-xs text-ink-400">
                  Dibagikan oleh {p.dibagikanOleh.nama} · {p.puskesmasAsal} · {formatTanggal(p.createdAt)}
                  {p.kasusTerkait ? ` · Terkait kasus: ${p.kasusTerkait.namaBalita}` : ""}
                </p>
              </Card>
            ))
          )}
        </div>

        <Card className="h-fit">
          <CardHeader title="+ Bagikan Praktik Baik" subtitle="Bagikan praktik baik dari Puskesmas sendiri." />
          <form action={bagikanPraktikBaikAction} className="space-y-4">
            <div>
              <label htmlFor="judul">Judul</label>
              <input id="judul" name="judul" type="text" placeholder="mis. Teknik pijat bayi BBLR" required />
            </div>
            <div>
              <label htmlFor="kategoriKasus">Kategori Kasus</label>
              <input id="kategoriKasus" name="kategoriKasus" type="text" placeholder="mis. BBLR, TB, Sosial-Ekonomi" required />
            </div>
            <div>
              <label htmlFor="deskripsi">Deskripsi</label>
              <textarea id="deskripsi" name="deskripsi" rows={3} placeholder="Ceritakan praktik yang terbukti efektif..." required />
            </div>
            <div>
              <label htmlFor="puskesmasAsal">Puskesmas Asal</label>
              <input id="puskesmasAsal" name="puskesmasAsal" type="text" placeholder="Puskesmas Padang Kerambil" />
            </div>
            <div>
              <label htmlFor="kasusTerkaitId">Kasus Terkait (opsional)</label>
              <select id="kasusTerkaitId" name="kasusTerkaitId" defaultValue="">
                <option value="">Tidak terkait kasus tertentu</option>
                {daftarKasus.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.namaBalita}
                  </option>
                ))}
              </select>
            </div>
            <SubmitButton>Bagikan Praktik Baik</SubmitButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
