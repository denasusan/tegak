"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { labelRole } from "@/lib/roles";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Ringkasan Alur", icon: "🏠", roles: null },
  { href: "/kasus/baru", label: "Deteksi & Input Kasus", icon: "📱", roles: ["KADER", "BIDAN"] },
  { href: "/kasus", label: "Daftar Kasus & Skrining", icon: "📄", roles: null },
  { href: "/belajar", label: "Belajar IPC", icon: "🎓", roles: null },
  { href: "/jadwal", label: "Jadwal Tim", icon: "📅", roles: null },
  { href: "/monitoring", label: "Dashboard Monitoring", icon: "📊", roles: ["KEPALA_PUSKESMAS"] },
  { href: "/praktik-baik", label: "Praktik Baik", icon: "💡", roles: null },
];

export function Sidebar({ role }) {
  const pathname = usePathname();

  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-primary-600 text-white"
                : "text-ink-600 hover:bg-primary-50 hover:text-primary-700"
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function roleNavLabel(role) {
  return labelRole(role);
}
