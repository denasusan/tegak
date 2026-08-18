import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader } from "@/components/Card";
import { SubmitButton, ConfirmSubmitButton } from "@/components/SubmitButton";
import { ROLES, ROLE_LABEL } from "@/lib/roles";
import { formatTanggal } from "@/lib/utils";
import { tambahPenggunaAction, updatePenggunaAction, hapusPenggunaAction } from "./actions";

export default async function PengaturanPenggunaPage({ searchParams }) {
  requireRole(["KEPALA_PUSKESMAS"]);
  const error = searchParams?.error;
  const sukses = searchParams?.sukses;
  const q = searchParams?.q?.trim() || "";

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { nama: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ role: "asc" }, { nama: "asc" }],
  });

  return (
    <div>
      <PageHeader
        eyebrow="Pengaturan · Kepala Puskesmas"
        title="⚙ Pengaturan Pengguna"
        subtitle="Kelola akun tim: tambah pengguna baru, ubah role/puskesmas, atau hapus akun."
      />

      {error ? <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {sukses ? (
        <div className="mb-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">{sukses}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Daftar Pengguna"
            subtitle={q ? `${users.length} akun cocok dengan "${q}"` : `${users.length} akun terdaftar`}
            action={
              <form method="GET" className="flex flex-wrap items-center gap-2">
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Cari nama atau email..."
                  className="w-full sm:w-56"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
                >
                  Cari
                </button>
                {q ? (
                  <Link href="/pengaturan/pengguna" className="text-xs font-semibold text-ink-400 hover:text-ink-600">
                    Reset
                  </Link>
                ) : null}
              </form>
            }
          />
          {users.length === 0 ? (
            <p className="text-sm text-ink-500">Tidak ada pengguna yang cocok dengan pencarian &ldquo;{q}&rdquo;.</p>
          ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col gap-3 rounded-xl border border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{u.nama}</p>
                  <p className="truncate text-xs text-ink-500">{u.email}</p>
                  <p className="mt-0.5 text-xs text-ink-400">Bergabung {formatTanggal(u.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={updatePenggunaAction} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={u.id} />
                    <select name="role" defaultValue={u.role} className="w-full sm:w-40">
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </option>
                      ))}
                    </select>
                    <input type="text" name="puskesmas" defaultValue={u.puskesmas} className="w-full sm:w-44" />
                    <SubmitButton variant="outline">Simpan</SubmitButton>
                  </form>
                  <form action={hapusPenggunaAction}>
                    <input type="hidden" name="id" value={u.id} />
                    <ConfirmSubmitButton
                      confirmText={`Hapus pengguna ${u.nama}? Tindakan ini tidak bisa dibatalkan.`}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Hapus
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
          )}
        </Card>

        <Card className="h-fit">
          <CardHeader title="Tambah Pengguna Baru" />
          <form action={tambahPenggunaAction} className="space-y-4">
            <div>
              <label htmlFor="nama">Nama Lengkap</label>
              <input id="nama" name="nama" type="text" placeholder="Nama lengkap" required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="nama@puskesmas.id" required />
            </div>
            <div>
              <label htmlFor="password">Kata Sandi Awal</label>
              <input id="password" name="password" type="password" placeholder="Minimal 8 karakter" required minLength={8} />
            </div>
            <div>
              <label htmlFor="role">Role</label>
              <select id="role" name="role" defaultValue="KADER">
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="puskesmas">Puskesmas</label>
              <input id="puskesmas" name="puskesmas" type="text" placeholder="Puskesmas Padang Kerambil" />
            </div>
            <SubmitButton>Tambah Pengguna</SubmitButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
