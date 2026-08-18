// Seed data awal: 6 akun contoh (satu per peran) + beberapa kasus, modul
// belajar, jadwal pertemuan, dan praktik baik supaya aplikasi langsung bisa
// dicoba setelah `npm run db:setup`.

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const AKUN = [
  { nama: "Sari (Kader)", email: "kader@puskesmas.id", role: "KADER" },
  { nama: "Bidan Ratna", email: "bidan@puskesmas.id", role: "BIDAN" },
  { nama: "dr. Andra", email: "dokter@puskesmas.id", role: "DOKTER" },
  { nama: "Gizi — Wulan, S.Gz", email: "gizi@puskesmas.id", role: "AHLI_GIZI" },
  { nama: "Sanitarian — Budi", email: "sanitarian@puskesmas.id", role: "SANITARIAN" },
  { nama: "Kepala Puskesmas — dr. Hendra", email: "kepala@puskesmas.id", role: "KEPALA_PUSKESMAS" },
];

const PASSWORD_DEFAULT = "puskesmas123";

const MODUL_BELAJAR = [
  {
    judul: "Domain 1 — Nilai & Etika Kolaborasi Antarprofesi",
    domainIPC: "Values/Ethics for Interprofessional Practice",
    deskripsi:
      "Memahami nilai bersama saat bekerja lintas profesi: saling menghormati keahlian masing-masing, dan menempatkan kepentingan pasien di atas ego profesi.",
    durasiMenit: 10,
    studiKasus:
      "Studi kasus: kader menemukan balita BBLR di Padang Kerambil — bagaimana kader, bidan, dan dokter saling menghargai peran masing-masing dalam satu alur penanganan.",
    urutan: 1,
    kuis: [
      {
        pertanyaan: "Apa inti dari domain nilai & etika dalam kolaborasi interprofesi?",
        pilihan: [
          "Setiap profesi bekerja sendiri-sendiri agar efisien",
          "Saling menghormati keahlian profesi lain demi kepentingan pasien",
          "Profesi dengan pendidikan tertinggi selalu mengambil keputusan akhir",
          "Kolaborasi hanya perlu dilakukan saat ada masalah",
        ],
        jawabanBenar: 1,
      },
    ],
  },
  {
    judul: "Domain 2 — Peran & Tanggung Jawab",
    domainIPC: "Roles/Responsibilities",
    deskripsi:
      "Mengenali batas dan cakupan peran tiap profesi (kader, bidan, dokter, ahli gizi, sanitarian) agar tidak tumpang tindih maupun ada yang terlewat.",
    durasiMenit: 10,
    studiKasus:
      "Studi kasus: pembagian kerja saat kasus stunting dengan penyakit penyerta TB — siapa mengerjakan apa dari deteksi sampai monitoring.",
    urutan: 2,
    kuis: [
      {
        pertanyaan: "Mengapa penting memahami peran & tanggung jawab profesi lain?",
        pilihan: [
          "Supaya bisa mengambil alih pekerjaan profesi lain sepenuhnya",
          "Supaya tahu kapan harus merujuk/melibatkan profesi yang tepat, tanpa tumpang tindih",
          "Tidak penting, cukup fokus pada tugas sendiri",
          "Hanya berlaku untuk tenaga medis, bukan kader",
        ],
        jawabanBenar: 1,
      },
    ],
  },
  {
    judul: "Domain 3 — Komunikasi Interprofesional",
    domainIPC: "Interprofessional Communication",
    deskripsi:
      "Teknik komunikasi efektif lintas profesi: serah-terima informasi yang jelas, mendengarkan aktif, dan menghindari istilah teknis yang membingungkan.",
    durasiMenit: 10,
    studiKasus:
      "Studi kasus: forum diskusi tim (briefing–pelaksanaan–debriefing) untuk kasus balita dengan banyak penyakit penyerta.",
    urutan: 3,
    kuis: [
      {
        pertanyaan: "Apa ciri komunikasi interprofesional yang baik dalam forum diskusi tim?",
        pilihan: [
          "Hanya satu profesi yang berbicara, yang lain mendengarkan",
          "Kesimpulan dan tindak lanjut jelas disepakati bersama sebelum kasus ditutup",
          "Diskusi bebas tanpa perlu kesimpulan tertulis",
          "Menggunakan istilah medis serumit mungkin",
        ],
        jawabanBenar: 1,
      },
    ],
  },
  {
    judul: "Domain 4 — Kerja Sama Tim (Teams & Teamwork)",
    domainIPC: "Teams and Teamwork",
    deskripsi:
      "Membangun kebiasaan kerja tim yang terstruktur: pertemuan rutin, notulen yang bisa ditelusuri, dan berbagi praktik baik antar-Puskesmas.",
    durasiMenit: 10,
    studiKasus:
      "Studi kasus: praktik baik teknik pijat bayi BBLR dari Puskesmas Padang Kerambil yang terbukti efektif dan dibagikan ke Puskesmas lain.",
    urutan: 4,
    kuis: [
      {
        pertanyaan: "Apa manfaat utama berbagi praktik baik antar-Puskesmas?",
        pilihan: [
          "Menambah beban kerja tanpa manfaat jelas",
          "Praktik yang terbukti efektif di satu Puskesmas bisa diadopsi Puskesmas lain tanpa menunggu pelatihan formal",
          "Hanya untuk keperluan laporan ke Dinkes",
          "Menggantikan kebutuhan pertemuan tim bulanan",
        ],
        jawabanBenar: 1,
      },
    ],
  },
];

// Data untuk generate kasus tambahan (demo dashboard: tabel, grafik tren,
// diskusi aktif, notifikasi) — semua nama & wilayah fiktif untuk keperluan
// uji coba, tersebar 6 bulan terakhir supaya grafik tren terlihat realistis.
const KELURAHAN = [
  "Padang Kerambil", "Balai Nan Duo", "Ibuh", "Tigo Koto", "Payolansek",
  "Aur Kuning", "Balai Batuang", "Tarok", "Aie Tabik",
];
const NAMA_DEPAN_BALITA = [
  "Zikri", "Nabila", "Rafa", "Cika", "Fajar", "Hafiz", "Aisyah", "Dimas",
  "Putri", "Rangga", "Yusuf", "Zahra", "Ilham", "Nadia", "Fikri", "Salma",
  "Reza", "Intan", "Arif", "Bunga", "Farrel", "Keysha", "Naufal", "Alya",
];
const INISIAL_KELUARGA = ["A", "F", "D", "M", "S", "R", "P", "K", "N", "H"];
const NAMA_ORTU = [
  "Melati", "Ratna", "Siti", "Yuni", "Dewi", "Fitri", "Rina", "Wati",
  "Ahmad", "Budi", "Doni", "Hendra", "Irwan", "Joko",
];
const HASIL_KUNJUNGAN_POOL = [
  "Berat badan di bawah garis merah KMS, perlu pemantauan lanjutan.",
  "Tinggi badan tidak sesuai usia, indikasi stunting ringan.",
  "Riwayat lahir BBLR, asupan ASI belum optimal.",
  "Kunjungan rutin — pertumbuhan mulai membaik dibanding bulan lalu.",
  "Infeksi saluran napas berulang, nafsu makan menurun.",
];
const INDIKASI_RISIKO_POOL = [
  "Berisiko stunting — BBLR & pertumbuhan tidak sesuai usia.",
  "Berisiko stunting — pola asuh & sosial ekonomi pra-sejahtera.",
  "Berisiko stunting — riwayat infeksi berulang.",
  "Berisiko stunting — asupan gizi tidak seimbang.",
];
const ISI_PESAN_DISKUSI_POOL = [
  "Jadwalkan pemeriksaan lanjutan minggu ini.",
  "Rencana edukasi gizi sudah disiapkan.",
  "Menunggu jadwal dari dokter.",
  "Kondisi balita mulai membaik.",
  "Perlu kunjungan rumah ulang.",
];

// Distribusi jumlah kasus per bulan (6 bulan terakhir, mundurBulan 5 = paling
// lama, 0 = bulan berjalan) — bentuknya naik lalu turun, mirip tren nyata.
const BULAN_MUNDUR = [5, 4, 3, 2, 1, 0];
const JUMLAH_PER_BULAN = [8, 10, 12, 16, 14, 10];

function acak(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function acakInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pilihTertimbang(pool) {
  const total = pool.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [item, w] of pool) {
    if (r < w) return item;
    r -= w;
  }
  return pool[pool.length - 1][0];
}
function tanggalDiBulan(mundurBulan, hariKe) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - mundurBulan);
  const akhirBulan = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(hariKe, akhirBulan));
  d.setHours(9, acakInt(0, 59), 0, 0);
  const sekarang = new Date();
  return d > sekarang ? sekarang : d;
}
// Makin baru bulannya, makin besar kemungkinan kasus masih "dalam proses"
// (bukan SELESAI) — supaya funnel-nya terasa realistis.
function pilihStatusKasus(mundurBulan) {
  if (mundurBulan >= 4) {
    return pilihTertimbang([["SELESAI", 85], ["DALAM_DISKUSI_TIM", 10], ["DIRUJUK", 5]]);
  }
  if (mundurBulan >= 2) {
    return pilihTertimbang([
      ["SELESAI", 65], ["DALAM_DISKUSI_TIM", 15], ["DIRUJUK", 12], ["SKRINING_SELESAI", 8],
    ]);
  }
  return pilihTertimbang([
    ["SELESAI", 45], ["DALAM_DISKUSI_TIM", 20], ["DIRUJUK", 15],
    ["SKRINING_SELESAI", 12], ["MENUNGGU_SKRINING", 8],
  ]);
}

async function buatKasusTambahan(users) {
  const totalKasusSekarang = await prisma.kasusBalita.count();
  if (totalKasusSekarang >= 10) {
    console.log("  - Sudah ada data kasus tambahan, lewati.");
    return;
  }

  const penginput = ["KADER", "BIDAN"];
  const pengirimDiskusi = ["BIDAN", "DOKTER", "AHLI_GIZI"];

  for (let bulanIdx = 0; bulanIdx < BULAN_MUNDUR.length; bulanIdx++) {
    const mundurBulan = BULAN_MUNDUR[bulanIdx];
    const jumlah = JUMLAH_PER_BULAN[bulanIdx];

    for (let i = 0; i < jumlah; i++) {
      const status = pilihStatusKasus(mundurBulan);
      const createdAt = tanggalDiBulan(mundurBulan, acakInt(1, 27));

      const skrining =
        status === "MENUNGGU_SKRINING"
          ? undefined
          : {
              create: {
                testMantoux: acak(["POSITIF", "NEGATIF", "BELUM_DIPERIKSA"]),
                hasilHB: `${(9 + Math.random() * 3).toFixed(1)} g/dL`,
                infeksiBerulang: Math.random() < 0.3,
                lilaIbu: `${acakInt(20, 25)} cm`,
                sosialEkonomi: acak(["Pra-sejahtera", "Sejahtera I", "Sejahtera II"]),
                polaAsuh: acak(["Diasuh orang tua", "Diasuh nenek", "Dititip tetangga"]),
                riwayatBBLR: Math.random() < 0.4,
                mikrosefali: false,
                isk: Math.random() < 0.1,
                tb: Math.random() < 0.15,
                hasilSkrining: Math.random() < 0.6 ? "POSITIF" : "NEGATIF",
                diisiOlehId: users["DOKTER"].id,
              },
            };

      const perluRujukan = ["DIRUJUK", "DALAM_DISKUSI_TIM", "SELESAI"].includes(status);
      const jenisRujukan = acak(["AHLI_GIZI", "RS_TB"]);
      const rujukan = !perluRujukan
        ? undefined
        : {
            create: [
              {
                jenisRujukan,
                tujuan:
                  jenisRujukan === "AHLI_GIZI"
                    ? "Ahli Gizi Puskesmas"
                    : "RS Rujukan — dr. Anak (Poli TB Anak)",
                alasan:
                  jenisRujukan === "AHLI_GIZI"
                    ? "Hasil skrining menunjukkan perlu kajian pola makan & gizi."
                    : "Hasil skrining mengindikasikan perlu penanganan RS lanjutan.",
                status: status === "SELESAI" ? "SELESAI_DITANGANI" : acak(["MENUNGGU", "DIKONFIRMASI"]),
              },
            ],
          };

      const perluDiskusi = ["DALAM_DISKUSI_TIM", "SELESAI"].includes(status);
      const ditutup = status === "SELESAI";
      const diskusi = !perluDiskusi
        ? undefined
        : {
            create: {
              briefing: "Ringkasan kasus & tujuan diskusi tim lintas profesi.",
              kesimpulan: ditutup ? "Kondisi membaik, kasus dinyatakan selesai ditangani." : null,
              tindakLanjut: ditutup ? "Pemantauan rutin bulanan oleh kader." : null,
              ditutup,
              pesan: {
                create: Array.from({ length: acakInt(2, 4) }, (_, idx) => ({
                  pengirimId: users[acak(pengirimDiskusi)].id,
                  tahap: idx === 0 ? "BRIEFING" : "PELAKSANAAN",
                  isi: acak(ISI_PESAN_DISKUSI_POOL),
                })),
              },
            },
          };

      await prisma.kasusBalita.create({
        data: {
          namaBalita: `An. ${acak(NAMA_DEPAN_BALITA)} ${acak(INISIAL_KELUARGA)}.`,
          namaOrangTua: `${acak(["Ny.", "Tn."])} ${acak(NAMA_ORTU)}`,
          jenisKelamin: acak(["Laki-laki", "Perempuan"]),
          alamat: `Kelurahan ${acak(KELURAHAN)}, Payakumbuh`,
          hasilKunjungan: acak(HASIL_KUNJUNGAN_POOL),
          indikasiRisiko: acak(INDIKASI_RISIKO_POOL),
          statusKasus: status,
          dibuatOlehId: users[acak(penginput)].id,
          createdAt,
          updatedAt: createdAt,
          skrining,
          rujukan,
          diskusi,
        },
      });
    }
  }
  console.log("  - Kasus tambahan berhasil dibuat.");
}

async function main() {
  console.log("Membuat akun pengguna...");
  const users = {};
  for (const akun of AKUN) {
    const hashed = await bcrypt.hash(PASSWORD_DEFAULT, 10);
    const user = await prisma.user.upsert({
      where: { email: akun.email },
      update: {},
      create: {
        nama: akun.nama,
        email: akun.email,
        password: hashed,
        role: akun.role,
      },
    });
    users[akun.role] = user;
    console.log(`  - ${akun.email} (${akun.role})`);
  }

  console.log("Membuat modul microlearning IPC...");
  for (const modul of MODUL_BELAJAR) {
    const existing = await prisma.modulBelajar.findFirst({ where: { judul: modul.judul } });
    if (existing) continue;
    await prisma.modulBelajar.create({
      data: {
        judul: modul.judul,
        domainIPC: modul.domainIPC,
        deskripsi: modul.deskripsi,
        durasiMenit: modul.durasiMenit,
        studiKasus: modul.studiKasus,
        urutan: modul.urutan,
        kuis: {
          create: modul.kuis.map((k, i) => ({
            pertanyaan: k.pertanyaan,
            pilihan: JSON.stringify(k.pilihan),
            jawabanBenar: k.jawabanBenar,
            urutan: i,
          })),
        },
      },
    });
  }

  console.log("Membuat contoh kasus balita...");
  const kasusContoh = await prisma.kasusBalita.findFirst({ where: { namaBalita: "Balita A. (contoh)" } });
  let kasusA = kasusContoh;
  if (!kasusA) {
    kasusA = await prisma.kasusBalita.create({
      data: {
        namaBalita: "Balita A. (contoh)",
        namaOrangTua: "Ny. Melati",
        jenisKelamin: "Perempuan",
        alamat: "Kelurahan Padang Kerambil, Payakumbuh",
        hasilKunjungan: "Berat badan di bawah garis merah KMS, riwayat lahir BBLR (2.1 kg).",
        indikasiRisiko: "Berisiko stunting — BBLR & pertumbuhan tidak sesuai usia.",
        statusKasus: "SKRINING_SELESAI",
        dibuatOlehId: users["KADER"].id,
        skrining: {
          create: {
            testMantoux: "POSITIF",
            hasilHB: "10.2 g/dL (rendah)",
            infeksiBerulang: true,
            lilaIbu: "22 cm (KEK)",
            sosialEkonomi: "Pra-sejahtera",
            polaAsuh: "Pengasuhan oleh nenek, ibu bekerja",
            riwayatBBLR: true,
            mikrosefali: false,
            isk: false,
            tb: true,
            hasilSkrining: "POSITIF",
            catatanTambahan: "Perlu rujukan gizi dan RS untuk terapi TB.",
            diisiOlehId: users["DOKTER"].id,
          },
        },
        rujukan: {
          create: [
            {
              jenisRujukan: "AHLI_GIZI",
              tujuan: "Ahli Gizi Puskesmas Padang Kerambil",
              alasan: "Hasil skrining positif — perlu kajian pola makan & tindak lanjut gizi.",
              status: "MENUNGGU",
            },
            {
              jenisRujukan: "RS_TB",
              tujuan: "RS Rujukan — dr. Anak (Poli TB Anak)",
              alasan: "Hasil test Mantoux positif — perlu terapi TB oleh dokter anak.",
              status: "MENUNGGU",
            },
          ],
        },
      },
    });
    console.log("  - Contoh kasus dibuat:", kasusA.namaBalita);
  }

  console.log("Membuat kasus tambahan untuk dashboard (data demo)...");
  await buatKasusTambahan(users);

  console.log("Membuat contoh jadwal pertemuan tim...");
  const pertemuanAda = await prisma.pertemuanTim.findFirst();
  if (!pertemuanAda) {
    const tanggal = new Date();
    tanggal.setDate(tanggal.getDate() + 7);
    await prisma.pertemuanTim.create({
      data: {
        judul: "Pertemuan Koordinasi Tim Bulanan",
        tanggal,
        topik: "Evaluasi kasus stunting bulan berjalan & rencana tindak lanjut.",
      },
    });
  }

  console.log("Membuat contoh praktik baik...");
  const praktikAda = await prisma.praktikBaik.findFirst();
  if (!praktikAda) {
    await prisma.praktikBaik.create({
      data: {
        judul: "Teknik Pijat Bayi BBLR untuk Memperbaiki Isapan",
        deskripsi:
          "Teknik pijat bayi hasil pelatihan bersama dr. Doni, terbukti memperbaiki refleks isapan bayi BBLR sehingga asupan ASI lebih optimal.",
        kategoriKasus: "BBLR",
        puskesmasAsal: "Puskesmas Padang Kerambil",
        dibagikanOlehId: users["BIDAN"].id,
        kasusTerkaitId: kasusA.id,
      },
    });
  }

  console.log("Selesai. Password untuk semua akun contoh:", PASSWORD_DEFAULT);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
