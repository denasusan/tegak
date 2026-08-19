// Definisi 6 peran pengguna sesuai temuan FGD, dan label/warna tampilannya.

export const ROLES = [
  "KADER",
  "BIDAN",
  "DOKTER",
  "AHLI_GIZI",
  "SANITARIAN",
  "KEPALA_PUSKESMAS",
];

export const ROLE_LABEL = {
  KADER: "Perawat",
  BIDAN: "Bidan",
  DOKTER: "Dokter",
  AHLI_GIZI: "Ahli Gizi",
  SANITARIAN: "Sanitarian",
  KEPALA_PUSKESMAS: "Kepala Puskesmas",
};

export const ROLE_SINGKATAN = {
  KADER: "PR",
  BIDAN: "BD",
  DOKTER: "DK",
  AHLI_GIZI: "GZ",
  SANITARIAN: "SN",
  KEPALA_PUSKESMAS: "KP",
};

export function labelRole(role) {
  return ROLE_LABEL[role] ?? role;
}
