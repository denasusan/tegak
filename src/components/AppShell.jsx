"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ROLE_LABEL, ROLE_SINGKATAN } from "@/lib/roles";

export function AppShell({ session, children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Tutup menu otomatis setiap kali pindah halaman (SPA navigation tidak
  // me-remount layout ini, jadi tanpa ini menu mobile akan tetap terbuka).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-ink-50/60 md:flex">
      <aside className="border-b border-ink-100 bg-white md:min-h-screen md:w-72 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between p-4 md:p-6 md:pb-0">
          <div className="flex items-center gap-2">
            <div className="flex h-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 px-2.5 text-xs font-bold tracking-wide text-white">
              TEGAK
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-ink-900">TEGAK</p>
              <p className="text-xs leading-tight text-ink-500">Kolaborasi Sakato untuk Stunting</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="sidebar-nav"
            aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="shrink-0 rounded-lg border border-ink-200 p-2 text-lg leading-none text-ink-600 hover:bg-ink-50 md:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        <div id="sidebar-nav" className={`${open ? "block" : "hidden"} px-4 pb-4 md:block md:p-6 md:pt-4`}>
          <Sidebar role={session.role} />

          <div className="mt-6 rounded-xl bg-primary-50 p-3">
            <p className="text-xs font-semibold text-primary-800">
              {ROLE_LABEL[session.role]} ({ROLE_SINGKATAN[session.role]})
            </p>
            <p className="mt-0.5 truncate text-xs text-primary-600">{session.nama}</p>
            <Link
              href="/profil"
              className="mt-2 block w-full rounded-lg border border-primary-200 bg-white px-3 py-1.5 text-center text-xs font-semibold text-primary-700 hover:bg-primary-100"
            >
              Profil Saya
            </Link>
            <form action="/api/auth/logout" method="POST" className="mt-2">
              <button
                type="submit"
                className="w-full rounded-lg border border-primary-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
