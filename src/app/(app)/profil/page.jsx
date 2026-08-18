import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader } from "@/components/Card";
import { SubmitButton } from "@/components/SubmitButton";
import { Badge } from "@/components/Badge";
import { labelRole } from "@/lib/roles";
import { updateProfilAction, ubahPasswordAction } from "./actions";

export default async function ProfilPage({ searchParams }) {
  const session = requireSession();
  const error = searchParams?.error;
  const sukses = searchParams?.sukses;
  const user = await prisma.user.findUnique({ where: { id: session.id } });

  return (
    <div>
      <PageHeader eyebrow="Akun Saya" title="Profil Saya" subtitle="Ubah nama, puskesmas, atau kata sandi akun Anda." />

      {error ? <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {sukses ? (
        <div className="mb-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">{sukses}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Data Diri" />
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge className="bg-primary-100 text-primary-800">{labelRole(user.role)}</Badge>
            <span className="text-xs text-ink-400">{user.email} (tidak bisa diubah)</span>
          </div>
          <form action={updateProfilAction} className="space-y-4">
            <div>
              <label htmlFor="nama">Nama Lengkap</label>
              <input id="nama" name="nama" type="text" defaultValue={user.nama} required />
            </div>
            <div>
              <label htmlFor="puskesmas">Puskesmas</label>
              <input id="puskesmas" name="puskesmas" type="text" defaultValue={user.puskesmas} />
            </div>
            <SubmitButton>Simpan Perubahan</SubmitButton>
          </form>
        </Card>

        <Card>
          <CardHeader title="Ubah Kata Sandi" subtitle="Kosongkan bagian ini jika tidak ingin mengubah kata sandi." />
          <form action={ubahPasswordAction} className="space-y-4">
            <div>
              <label htmlFor="passwordSaatIni">Kata Sandi Saat Ini</label>
              <input id="passwordSaatIni" name="passwordSaatIni" type="password" placeholder="••••••••" />
            </div>
            <div>
              <label htmlFor="passwordBaru">Kata Sandi Baru</label>
              <input id="passwordBaru" name="passwordBaru" type="password" placeholder="Minimal 8 karakter" minLength={8} />
            </div>
            <div>
              <label htmlFor="konfirmasiPassword">Konfirmasi Kata Sandi Baru</label>
              <input id="konfirmasiPassword" name="konfirmasiPassword" type="password" placeholder="Ulangi kata sandi baru" minLength={8} />
            </div>
            <SubmitButton>Ubah Kata Sandi</SubmitButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
