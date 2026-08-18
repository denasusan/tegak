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
