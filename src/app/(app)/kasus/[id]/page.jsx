import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader } from "@/components/Card";
import { SubmitButton } from "@/components/SubmitButton";
import { Badge, PrioritasBadge } from "@/components/Badge";
import { STATUS_KASUS_LABEL, STATUS_KASUS_WARNA, formatTanggal } from "@/lib/utils";
import { simpanSkriningAction, bukaDiskusiTimAction } from "./actions";

export default async function ProfilKasusPage({ params, searchParams }) {
  const session = requireSession();

  const kasus = await prisma.kasusBalita.findUnique({
    where: { id: params.id },
    include: { dibuatOleh: true, skrining: true, rujukan: true, diskusi: true },
  });

  if (!kasus) notFound();

  const bisaIsiSkrining = session.role === "DOKTER";
  const s = kasus.skrining;

  return (
    <div>
      <PageHeader
        eyebrow="Layar 2 dari 8 · Pengguna: Dokter"
        title={`📄 Profil Kasus — ${kasus.namaBalita}`}
        subtitle="Saat dokter menerima rujukan dari bidan untuk kasus stunting."
        action={<PrioritasBadge prioritas="Tinggi" />}
      />

      {searchParams?.dibuat ? (
        <div className="mb-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">
          Kasus baru berhasil disimpan dan masuk ke antrean.
        </div>
      ) : null}
      {searchParams?.skrining ? (
        <div className="mb-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">
          Hasil skrining tersimpan. Rujukan otomatis (jika ada) telah dibuat pada Layar 3.
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge className={STATUS_KASUS_WARNA[kasus.statusKasus]}>
          {STATUS_KASUS_LABEL[kasus.statusKasus]}
        </Badge>
        <Link href={`/kasus/${kasus.id}/rujukan`} className="text-sm font-semibold text-primary-700 hover:underline">
          Lihat Rujukan →
        </Link>
        <Link href={`/kasus/${kasus.id}/diskusi`} className="text-sm font-semibold text-primary-700 hover:underline">
          Forum Diskusi Tim →
        </Link>
        <form action={bukaDiskusiTimAction}>
          <input type="hidden" name="kasusId" value={kasus.id} />
          <button type="submit" className="text-sm font-semibold text-accent-700 hover:underline">
            {kasus.diskusi ? "Buka Diskusi Tim →" : "+ Mulai Diskusi Tim"}
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Riwayat dari Perawat / Bidan" subtitle="Riwayat sebelumnya langsung terlihat, tidak perlu tanya ulang." />
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-ink-400">Nama Orang Tua</dt>
                <dd className="font-medium text-ink-800">{kasus.namaOrangTua}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Tanggal Lahir</dt>
                <dd className="font-medium text-ink-800">{kasus.tanggalLahir ? formatTanggal(kasus.tanggalLahir) : "-"}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Jenis Kelamin</dt>
                <dd className="font-medium text-ink-800">{kasus.jenisKelamin || "-"}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Alamat</dt>
                <dd className="font-medium text-ink-800">{kasus.alamat || "-"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-ink-400">Hasil Kunjungan Rumah / Penimbangan</dt>
                <dd className="font-medium text-ink-800">{kasus.hasilKunjungan || "-"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-ink-400">Indikasi Risiko Stunting</dt>
                <dd className="font-medium text-ink-800">{kasus.indikasiRisiko}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-ink-400">
              Dicatat oleh {kasus.dibuatOleh.nama} · {formatTanggal(kasus.createdAt)}
            </p>
          </Card>

          <Card>
            <CardHeader
              title="Skrining Klinis & Asesmen Multifaktor"
              subtitle="Dokter mengisi hasil skrining & asesmen multifaktor di sini."
            />

            {bisaIsiSkrining ? (
              <form action={simpanSkriningAction} className="space-y-5">
                <input type="hidden" name="kasusId" value={kasus.id} />

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-600">
                    ✓ Tes Mantoux, HB, cek infeksi berulang
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="testMantoux">Test Mantoux</label>
                      <select id="testMantoux" name="testMantoux" defaultValue={s?.testMantoux || "BELUM_DIPERIKSA"}>
                        <option value="BELUM_DIPERIKSA">Belum diperiksa</option>
                        <option value="POSITIF">Positif</option>
                        <option value="NEGATIF">Negatif</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="hasilHB">Hasil HB</label>
                      <input id="hasilHB" name="hasilHB" type="text" defaultValue={s?.hasilHB || ""} placeholder="mis. 10.2 g/dL" />
                    </div>
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-sm text-ink-700">
                    <input type="checkbox" name="infeksiBerulang" defaultChecked={s?.infeksiBerulang} className="h-4 w-4 rounded border-ink-300" />
                    Ada indikasi infeksi berulang
                  </label>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-600">
                    ✓ LILA ibu, sosial-ekonomi, pola asuh
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="lilaIbu">LILA Ibu</label>
                      <input id="lilaIbu" name="lilaIbu" type="text" defaultValue={s?.lilaIbu || ""} placeholder="mis. 22 cm (KEK)" />
                    </div>
                    <div>
                      <label htmlFor="sosialEkonomi">Sosial-Ekonomi</label>
                      <input id="sosialEkonomi" name="sosialEkonomi" type="text" defaultValue={s?.sosialEkonomi || ""} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="polaAsuh">Pola Asuh</label>
                      <input id="polaAsuh" name="polaAsuh" type="text" defaultValue={s?.polaAsuh || ""} />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-600">
                    ✓ Riwayat BBLR / mikrosefali / ISK / TB
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { name: "riwayatBBLR", label: "BBLR" },
                      { name: "mikrosefali", label: "Mikrosefali" },
                      { name: "isk", label: "ISK" },
                      { name: "tb", label: "TB" },
                    ].map((f) => (
                      <label key={f.name} className="flex items-center gap-2 text-sm text-ink-700">
                        <input type="checkbox" name={f.name} defaultChecked={s?.[f.name]} className="h-4 w-4 rounded border-ink-300" />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="catatanTambahan">Catatan Tambahan</label>
                  <textarea id="catatanTambahan" name="catatanTambahan" rows={2} defaultValue={s?.catatanTambahan || ""} />
                </div>

                <div>
                  <label htmlFor="hasilSkrining">Kesimpulan Hasil Skrining</label>
                  <select id="hasilSkrining" name="hasilSkrining" defaultValue={s?.hasilSkrining || ""}>
                    <option value="" disabled>
                      Pilih kesimpulan
                    </option>
                    <option value="POSITIF">Positif — perlu rujukan</option>
                    <option value="NEGATIF">Negatif</option>
                  </select>
                </div>

                <SubmitButton>Simpan &amp; Lanjut Rujukan →</SubmitButton>
              </form>
            ) : s ? (
              <div className="space-y-2 text-sm text-ink-700">
                <p>Test Mantoux: <span className="font-medium">{s.testMantoux || "-"}</span></p>
                <p>Hasil HB: <span className="font-medium">{s.hasilHB || "-"}</span></p>
                <p>Kesimpulan: <span className="font-medium">{s.hasilSkrining || "-"}</span></p>
                <p className="text-xs text-ink-400">Hanya peran Dokter yang dapat mengubah hasil skrining.</p>
              </div>
            ) : (
              <p className="text-sm text-ink-500">Menunggu skrining oleh dokter.</p>
            )}
          </Card>
        </div>

        <Card className="h-fit bg-primary-50">
          <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Dasar Temuan FGD</p>
          <p className="mt-2 text-sm text-primary-900">
            P1 (verbatim): alur skrining mantoux/HB/infeksi sebelum konsul gizi; asesmen mencakup
            LILA ibu, sosial ekonomi, pola asuh, BBLR, mikrosefali, ISK, TB.
          </p>
        </Card>
      </div>
    </div>
  );
}
