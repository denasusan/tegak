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
