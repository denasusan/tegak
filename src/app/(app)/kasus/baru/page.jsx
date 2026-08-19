import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader } from "@/components/Card";
import { SubmitButton } from "@/components/SubmitButton";
import { PrioritasBadge } from "@/components/Badge";
import { buatKasusBaruAction } from "./actions";

export default function KasusBaruPage({ searchParams }) {
  requireRole(["KADER", "BIDAN"]);
  const error = searchParams?.error;

  return (
    <div>
      <PageHeader
        eyebrow="Layar 1 dari 8 · Pengguna: Perawat / Bidan"
        title="📱 Input Kasus Balita"
        subtitle="Saat perawat menemukan kasus balita berisiko di lapangan, atau bidan mencatat hasil kunjungan rumah."
        action={<PrioritasBadge prioritas="Tinggi" />}
      />

      {error ? (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Form Input Kasus Baru"
            subtitle="Form input sederhana di lapangan (mobile-friendly). Begitu disimpan, data otomatis masuk ke antrean bidan koordinator untuk ditindaklanjuti."
          />

          <form action={buatKasusBaruAction} className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-600">
                1 · Data identitas balita &amp; orang tua
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="namaBalita">Nama Balita</label>
                  <input id="namaBalita" name="namaBalita" type="text" placeholder="Nama lengkap balita" required />
                </div>
                <div>
                  <label htmlFor="namaOrangTua">Nama Orang Tua / Wali</label>
                  <input id="namaOrangTua" name="namaOrangTua" type="text" placeholder="Nama orang tua" required />
                </div>
                <div>
                  <label htmlFor="tanggalLahir">Tanggal Lahir</label>
                  <input id="tanggalLahir" name="tanggalLahir" type="date" />
                </div>
                <div>
                  <label htmlFor="jenisKelamin">Jenis Kelamin</label>
                  <select id="jenisKelamin" name="jenisKelamin" defaultValue="">
                    <option value="" disabled>
                      Pilih jenis kelamin
                    </option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="alamat">Alamat</label>
                  <input id="alamat" name="alamat" type="text" placeholder="Kelurahan / RT-RW" />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-600">
                2 · Hasil kunjungan rumah / penimbangan
              </p>
              <textarea
                id="hasilKunjungan"
                name="hasilKunjungan"
                rows={3}
                placeholder="Contoh: berat badan di bawah garis merah KMS, riwayat lahir BBLR..."
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-600">
                3 · Tandai indikasi risiko stunting
              </p>
              <textarea
                id="indikasiRisiko"
                name="indikasiRisiko"
                rows={2}
                placeholder="Contoh: berisiko stunting — BBLR & pertumbuhan tidak sesuai usia"
                required
              />
            </div>

            <SubmitButton>Kirim ke Bidan Koordinator →</SubmitButton>
          </form>
        </Card>

        <Card className="h-fit bg-primary-50">
          <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Dasar Temuan FGD</p>
          <p className="mt-2 text-sm text-primary-900">
            P1: bayi BBLR/prematur berisiko stunting. P3: ada kesenjangan hasil perawat vs nakes —
            modul ini menyatukan data dari sumber pertama (perawat) langsung ke sistem.
          </p>
        </Card>
      </div>
    </div>
  );
}
