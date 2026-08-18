-- CreateEnum
CREATE TYPE "Role" AS ENUM ('KADER', 'BIDAN', 'DOKTER', 'AHLI_GIZI', 'SANITARIAN', 'KEPALA_PUSKESMAS');

-- CreateEnum
CREATE TYPE "StatusKasus" AS ENUM ('MENUNGGU_SKRINING', 'SKRINING_SELESAI', 'DIRUJUK', 'DALAM_DISKUSI_TIM', 'SELESAI');

-- CreateEnum
CREATE TYPE "StatusRujukan" AS ENUM ('MENUNGGU', 'DIKONFIRMASI', 'SELESAI_DITANGANI', 'KEMBALI_KE_PUSKESMAS');

-- CreateEnum
CREATE TYPE "TahapDiskusi" AS ENUM ('BRIEFING', 'PELAKSANAAN', 'DEBRIEFING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "puskesmas" TEXT NOT NULL DEFAULT 'Puskesmas Padang Kerambil',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KasusBalita" (
    "id" TEXT NOT NULL,
    "namaBalita" TEXT NOT NULL,
    "namaOrangTua" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3),
    "jenisKelamin" TEXT,
    "alamat" TEXT,
    "hasilKunjungan" TEXT,
    "indikasiRisiko" TEXT NOT NULL,
    "statusKasus" "StatusKasus" NOT NULL DEFAULT 'MENUNGGU_SKRINING',
    "dibuatOlehId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KasusBalita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skrining" (
    "id" TEXT NOT NULL,
    "kasusId" TEXT NOT NULL,
    "testMantoux" TEXT,
    "hasilHB" TEXT,
    "infeksiBerulang" BOOLEAN NOT NULL DEFAULT false,
    "lilaIbu" TEXT,
    "sosialEkonomi" TEXT,
    "polaAsuh" TEXT,
    "riwayatBBLR" BOOLEAN NOT NULL DEFAULT false,
    "mikrosefali" BOOLEAN NOT NULL DEFAULT false,
    "isk" BOOLEAN NOT NULL DEFAULT false,
    "tb" BOOLEAN NOT NULL DEFAULT false,
    "catatanTambahan" TEXT,
    "hasilSkrining" TEXT,
    "diisiOlehId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skrining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rujukan" (
    "id" TEXT NOT NULL,
    "kasusId" TEXT NOT NULL,
    "jenisRujukan" TEXT NOT NULL,
    "tujuan" TEXT NOT NULL,
    "alasan" TEXT NOT NULL,
    "status" "StatusRujukan" NOT NULL DEFAULT 'MENUNGGU',
    "catatanBalik" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rujukan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiskusiKasus" (
    "id" TEXT NOT NULL,
    "kasusId" TEXT NOT NULL,
    "briefing" TEXT,
    "kesimpulan" TEXT,
    "tindakLanjut" TEXT,
    "ditutup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiskusiKasus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PesanDiskusi" (
    "id" TEXT NOT NULL,
    "diskusiId" TEXT NOT NULL,
    "pengirimId" TEXT NOT NULL,
    "tahap" "TahapDiskusi" NOT NULL DEFAULT 'PELAKSANAAN',
    "isi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PesanDiskusi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModulBelajar" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "domainIPC" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "durasiMenit" INTEGER NOT NULL DEFAULT 10,
    "studiKasus" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ModulBelajar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kuis" (
    "id" TEXT NOT NULL,
    "modulId" TEXT NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "pilihan" TEXT NOT NULL,
    "jawabanBenar" INTEGER NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Kuis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgresBelajar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modulId" TEXT NOT NULL,
    "selesai" BOOLEAN NOT NULL DEFAULT false,
    "skorKuis" INTEGER,
    "sertifikat" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgresBelajar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PertemuanTim" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "topik" TEXT NOT NULL,
    "notulen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PertemuanTim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KehadiranPertemuan" (
    "id" TEXT NOT NULL,
    "pertemuanId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hadir" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "KehadiranPertemuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PraktikBaik" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "kategoriKasus" TEXT NOT NULL,
    "puskesmasAsal" TEXT NOT NULL,
    "dibagikanOlehId" TEXT NOT NULL,
    "kasusTerkaitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PraktikBaik_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Skrining_kasusId_key" ON "Skrining"("kasusId");

-- CreateIndex
CREATE UNIQUE INDEX "DiskusiKasus_kasusId_key" ON "DiskusiKasus"("kasusId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgresBelajar_userId_modulId_key" ON "ProgresBelajar"("userId", "modulId");

-- CreateIndex
CREATE UNIQUE INDEX "KehadiranPertemuan_pertemuanId_userId_key" ON "KehadiranPertemuan"("pertemuanId", "userId");

-- AddForeignKey
ALTER TABLE "KasusBalita" ADD CONSTRAINT "KasusBalita_dibuatOlehId_fkey" FOREIGN KEY ("dibuatOlehId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skrining" ADD CONSTRAINT "Skrining_kasusId_fkey" FOREIGN KEY ("kasusId") REFERENCES "KasusBalita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skrining" ADD CONSTRAINT "Skrining_diisiOlehId_fkey" FOREIGN KEY ("diisiOlehId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rujukan" ADD CONSTRAINT "Rujukan_kasusId_fkey" FOREIGN KEY ("kasusId") REFERENCES "KasusBalita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiskusiKasus" ADD CONSTRAINT "DiskusiKasus_kasusId_fkey" FOREIGN KEY ("kasusId") REFERENCES "KasusBalita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesanDiskusi" ADD CONSTRAINT "PesanDiskusi_diskusiId_fkey" FOREIGN KEY ("diskusiId") REFERENCES "DiskusiKasus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesanDiskusi" ADD CONSTRAINT "PesanDiskusi_pengirimId_fkey" FOREIGN KEY ("pengirimId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kuis" ADD CONSTRAINT "Kuis_modulId_fkey" FOREIGN KEY ("modulId") REFERENCES "ModulBelajar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresBelajar" ADD CONSTRAINT "ProgresBelajar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresBelajar" ADD CONSTRAINT "ProgresBelajar_modulId_fkey" FOREIGN KEY ("modulId") REFERENCES "ModulBelajar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KehadiranPertemuan" ADD CONSTRAINT "KehadiranPertemuan_pertemuanId_fkey" FOREIGN KEY ("pertemuanId") REFERENCES "PertemuanTim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KehadiranPertemuan" ADD CONSTRAINT "KehadiranPertemuan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PraktikBaik" ADD CONSTRAINT "PraktikBaik_dibagikanOlehId_fkey" FOREIGN KEY ("dibagikanOlehId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PraktikBaik" ADD CONSTRAINT "PraktikBaik_kasusTerkaitId_fkey" FOREIGN KEY ("kasusTerkaitId") REFERENCES "KasusBalita"("id") ON DELETE SET NULL ON UPDATE CASCADE;
