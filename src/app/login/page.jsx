import { loginAction } from "./actions";
import { ROLES, ROLE_LABEL, ROLE_SINGKATAN } from "@/lib/roles";

const AKUN_CONTOH = ROLES.map((role) => ({
  role,
  email: {
    KADER: "kader@puskesmas.id",
    BIDAN: "bidan@puskesmas.id",
    DOKTER: "dokter@puskesmas.id",
    AHLI_GIZI: "gizi@puskesmas.id",
    SANITARIAN: "sanitarian@puskesmas.id",
    KEPALA_PUSKESMAS: "kepala@puskesmas.id",
  }[role],
}));

export default function LoginPage({ searchParams }) {
  const error = searchParams?.error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary-950 px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-primary-800 p-8 text-primary-50 md:flex">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-200">
              TEGAK
            </p>
            <h1 className="mt-2 text-2xl font-bold leading-snug">
              Kolaborasi Sakato untuk Stunting
            </h1>
            <p className="mt-3 text-sm text-primary-100">
              Strategi Penurunan Stunting di Kota Payakumbuh. Disusun berdasarkan temuan FGD
              Puskesmas Padang Kerambil (Fase 1, 2026).
            </p>
          </div>
          <div className="space-y-2 text-sm text-primary-100">
            <p className="font-semibold text-primary-50">Akun contoh untuk uji coba:</p>
            {AKUN_CONTOH.map((a) => (
              <div key={a.role} className="flex items-center justify-between rounded-lg bg-primary-700/50 px-3 py-1.5">
                <span>{ROLE_LABEL[a.role]} ({ROLE_SINGKATAN[a.role]})</span>
                <code className="text-xs text-primary-200">{a.email}</code>
              </div>
            ))}
            <p className="pt-1 text-xs text-primary-300">Kata sandi untuk semua akun: puskesmas123</p>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-ink-900">Masuk ke TEGAK</h2>
          <p className="mt-1 text-sm text-ink-500">
            Gunakan akun peran Anda (Kader, Bidan, Dokter, Ahli Gizi, Sanitarian, atau Kepala
            Puskesmas).
          </p>

          {error ? (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          <form action={loginAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="nama@puskesmas.id" required />
            </div>
            <div>
              <label htmlFor="password">Kata Sandi</label>
              <input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Masuk
            </button>
          </form>

          <div className="mt-4 flex items-center gap-3 text-xs text-ink-400">
            <div className="h-px flex-1 bg-ink-100" />
            atau
            <div className="h-px flex-1 bg-ink-100" />
          </div>

          <a
            href="/api/auth/google"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.03l3.05-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
            </svg>
            Masuk dengan Google
          </a>

          <div className="mt-6 rounded-xl bg-ink-50 p-4 text-xs text-ink-500 md:hidden">
            <p className="font-semibold text-ink-700">Akun contoh (kata sandi: puskesmas123)</p>
            <ul className="mt-1 space-y-0.5">
              {AKUN_CONTOH.map((a) => (
                <li key={a.role}>
                  {ROLE_LABEL[a.role]}: <code>{a.email}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
