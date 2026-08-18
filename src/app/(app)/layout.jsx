import { requireSession } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { ROLE_LABEL, ROLE_SINGKATAN } from "@/lib/roles";

export default function AppLayout({ children }) {
  const session = requireSession();

  return (
    <div className="min-h-screen bg-ink-50/60 md:flex">
      <aside className="border-b border-ink-100 bg-white p-4 md:min-h-screen md:w-72 md:border-b-0 md:border-r md:p-6">
        <div className="mb-6 flex items-center gap-2 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">
            IPC
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-ink-900">Platform Kolaborasi</p>
            <p className="text-xs leading-tight text-ink-500">Puskesmas Payakumbuh</p>
          </div>
        </div>

        <Sidebar role={session.role} />

        <div className="mt-6 rounded-xl bg-primary-50 p-3">
          <p className="text-xs font-semibold text-primary-800">
            {ROLE_LABEL[session.role]} ({ROLE_SINGKATAN[session.role]})
          </p>
          <p className="mt-0.5 truncate text-xs text-primary-600">{session.nama}</p>
          <form action="/api/auth/logout" method="POST" className="mt-2">
            <button
              type="submit"
              className="w-full rounded-lg border border-primary-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100"
            >
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
