import { labelRole } from "./roles";

const NAMA_BULAN_SINGKAT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
];

/** Hitung jumlah kasus per bulan untuk N bulan terakhir (termasuk bulan berjalan). */
export function hitungTrenBulanan(rows, jumlahBulan = 6) {
  const sekarang = new Date();
  const buckets = [];
  for (let i = jumlahBulan - 1; i >= 0; i--) {
    const d = new Date(sekarang.getFullYear(), sekarang.getMonth() - i, 1);
    buckets.push({ tahun: d.getFullYear(), bulan: d.getMonth(), label: NAMA_BULAN_SINGKAT[d.getMonth()], jumlah: 0 });
  }
  for (const row of rows) {
    const d = new Date(row.createdAt);
    const bucket = buckets.find((b) => b.tahun === d.getFullYear() && b.bulan === d.getMonth());
    if (bucket) bucket.jumlah += 1;
  }
  return buckets;
}

/** Daftar peran (dipisah koma) yang terlibat menangani satu kasus. */
export function profesiBertugas(kasus) {
  const roles = new Set();
  if (kasus.dibuatOleh) roles.add(kasus.dibuatOleh.role);
  if (kasus.skrining?.diisiOleh) roles.add(kasus.skrining.diisiOleh.role);
  for (const r of kasus.rujukan ?? []) {
    if (r.jenisRujukan === "AHLI_GIZI") roles.add("AHLI_GIZI");
  }
  return [...roles].map(labelRole).join(", ") || "-";
}

/** Format "X menit/jam/hari lalu" dari sebuah tanggal. */
export function waktuRelatif(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const menit = Math.floor(diffMs / 60000);
  if (menit < 1) return "baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.floor(jam / 24);
  return `${hari} hari lalu`;
}

export function formatTanggal(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTanggalWaktu(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export const STATUS_KASUS_LABEL = {
  MENUNGGU_SKRINING: "Menunggu Skrining",
  SKRINING_SELESAI: "Skrining Selesai",
  DIRUJUK: "Dirujuk",
  DALAM_DISKUSI_TIM: "Dalam Diskusi Tim",
  SELESAI: "Selesai",
};

export const STATUS_KASUS_WARNA = {
  MENUNGGU_SKRINING: "bg-accent-100 text-accent-800",
  SKRINING_SELESAI: "bg-primary-100 text-primary-800",
  DIRUJUK: "bg-amber-100 text-amber-800",
  DALAM_DISKUSI_TIM: "bg-sky-100 text-sky-800",
  SELESAI: "bg-ink-200 text-ink-700",
};

export const STATUS_RUJUKAN_LABEL = {
  MENUNGGU: "Menunggu",
  DIKONFIRMASI: "Dikonfirmasi",
  SELESAI_DITANGANI: "Selesai Ditangani",
  KEMBALI_KE_PUSKESMAS: "Kembali ke Puskesmas",
};

export const STATUS_RUJUKAN_WARNA = {
  MENUNGGU: "bg-accent-100 text-accent-800",
  DIKONFIRMASI: "bg-primary-100 text-primary-800",
  SELESAI_DITANGANI: "bg-sky-100 text-sky-800",
  KEMBALI_KE_PUSKESMAS: "bg-primary-200 text-primary-900",
};

export const JENIS_RUJUKAN_LABEL = {
  AHLI_GIZI: "Ahli Gizi",
  RS_TB: "RS — dr. Anak (TB)",
};

export const TAHAP_DISKUSI_LABEL = {
  BRIEFING: "Briefing",
  PELAKSANAAN: "Pelaksanaan",
  DEBRIEFING: "Debriefing",
};
