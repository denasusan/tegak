import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { formatTanggalWaktu, STATUS_KASUS_LABEL, STATUS_KASUS_WARNA } from "@/lib/utils";
import { ROLE_SINGKATAN } from "@/lib/roles";

export default async function DaftarKasusPage() {
  requireSession();

  const daftarKasus = await prisma.kasusBalita.findMany({
    orderBy: { createdAt: "desc" },
    include: { dibuatOleh: true, rujukan: true },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Layar 2–4 dari 8 · Antrean Kasus"
        title="Daftar Kasus & Skrining"
        subtitle="Kasus balita yang masuk dari Layar 1, siap ditindaklanjuti dengan profil terpadu, skrining, rujukan, dan diskusi tim."
      />

      {daftarKasus.length === 0 ? (
        <EmptyState
          title="Belum ada kasus"
          description="Kasus baru yang dibuat di Layar 1 (Deteksi & Input Kasus) akan muncul di sini."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Balita</th>
                <th className="px-4 py-3">Dibuat Oleh</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Rujukan</th>
                <th className="px-4 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {daftarKasus.map((kasus) => (
                <tr key={kasus.id} className="border-t border-ink-100 hover:bg-primary-50/40">
                  <td className="px-4 py-3">
                    <Link href={`/kasus/${kasus.id}`} className="font-semibold text-primary-700 hover:underline">
                      {kasus.namaBalita}
                    </Link>
                    <p className="text-xs text-ink-500">Ortu: {kasus.namaOrangTua}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-600">
                    {kasus.dibuatOleh.nama}{" "}
                    <span className="text-xs text-ink-400">
                      ({ROLE_SINGKATAN[kasus.dibuatOleh.role]})
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_KASUS_WARNA[kasus.statusKasus]}>
                      {STATUS_KASUS_LABEL[kasus.statusKasus]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-600">
                    {kasus.rujukan.length > 0 ? `${kasus.rujukan.length} rujukan` : "-"}
                  </td>
                  <td className="px-4 py-3 text-ink-500">{formatTanggalWaktu(kasus.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
