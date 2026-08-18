import "./globals.css";

export const metadata = {
  title: "TEGAK — Kolaborasi Sakato untuk Stunting",
  description:
    "TEGAK — Kolaborasi Sakato untuk Stunting. Platform Kolaborasi Interprofessional Teamworking Berbasis Aplikasi Layanan Primer Puskesmas — Strategi Penurunan Stunting di Kota Payakumbuh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
