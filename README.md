# TEGAK — Kolaborasi Sakato untuk Stunting

Aplikasi web (Next.js) untuk **Model Kolaborasi Interprofessional Teamworking Berbasis
Aplikasi Layanan Primer Puskesmas — Strategi Penurunan Stunting di Kota Payakumbuh**,
dibangun dari storyboard `Storyboard_Platform_IPC_Stunting.pptx` (8 layar utama,
disusun berdasarkan temuan FGD Puskesmas Padang Kerambil, Fase 1, 2026).

## Fitur (8 Layar)

1. **Deteksi & Input Kasus Baru** — `/kasus/baru` (Perawat, Bidan)
2. **Profil Kasus Balita Terpadu & Skrining** — `/kasus/[id]` (Dokter)
3. **Rujukan Otomatis Lintas Profesi** — `/kasus/[id]/rujukan` (otomatis dari Layar 2)
4. **Forum Diskusi Tim per Kasus** — `/kasus/[id]/diskusi` (semua profesi)
5. **Modul Microlearning IPC** — `/belajar` (semua nakes)
6. **Notifikasi & Jadwal Pertemuan Tim** — `/jadwal`
7. **Dashboard Monitoring & Integrasi Sistem** — `/monitoring` (Kepala Puskesmas)
8. **Knowledge Sharing Praktik Baik** — `/praktik-baik`

## Tumpukan Teknologi

- **Next.js 14** (App Router) + **React 18** — JavaScript murni (bukan TypeScript)
- **Tailwind CSS** untuk styling
- **Prisma ORM** + **PostgreSQL** (mis. [Neon](https://neon.tech) atau
  [Supabase](https://supabase.com), keduanya punya tier gratis dan cocok
  untuk deploy ke Vercel)
- Autentikasi sederhana berbasis cookie bertanda tangan (HMAC), tanpa dependency
  tambahan seperti NextAuth — lihat `src/lib/session.js`
- Login Google (OAuth 2.0) opsional sebagai alternatif email/kata sandi —
  lihat `src/lib/google-oauth.js` dan bagian "Setup Login Google" di bawah

Integrasi ke **SIMPUS / SIGIZI / SATUSEHAT** pada Layar 7 masih berupa **mock/simulasi**
(bukan koneksi sungguhan), karena sistem-sistem tersebut milik Kemenkes/Dinkes dan
memerlukan kredensial/API resmi.

## Cara Menjalankan (Development)

Prasyarat: Node.js 18.17+ dan npm, serta database PostgreSQL (lokal via
Docker, atau tier gratis dari [Neon](https://neon.tech)/[Supabase](https://supabase.com)).

```bash
# 1. Install dependency
npm install

# 2. Salin file environment
cp .env.example .env
# Isi DATABASE_URL dengan connection string Postgres Anda,
# dan edit SESSION_SECRET dengan string acak Anda sendiri

# 3. Jalankan migrasi + isi data contoh
npm run db:setup

# 4. Jalankan server development
npm run dev
```

Buka http://localhost:3000 — Anda akan diarahkan ke halaman login.

### Akun contoh (setelah `npm run db:setup`)

Semua akun memakai kata sandi: **`puskesmas123`**

| Peran | Email |
|---|---|
| Perawat | perawat@puskesmas.id |
| Bidan | bidan@puskesmas.id |
| Dokter | dokter@puskesmas.id |
| Ahli Gizi | gizi@puskesmas.id |
| Sanitarian | sanitarian@puskesmas.id |
| Kepala Puskesmas | kepala@puskesmas.id |

### Setup Login Google

Tombol "Masuk dengan Google" butuh OAuth client dari Google Cloud Console:

1. Buka [Google Cloud Console](https://console.cloud.google.com/) → buat project baru
   (atau pakai yang sudah ada).
2. **APIs & Services → OAuth consent screen** — pilih tipe **External**, isi nama
   aplikasi & email, lalu simpan (untuk testing, tambahkan email Anda sendiri di
   bagian "Test users" agar tidak perlu proses verifikasi Google).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** — pilih
   tipe **Web application**, lalu isi **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://<domain-vercel-anda>/api/auth/google/callback` (production — tambahkan
     setelah domain Vercel Anda diketahui)
4. Salin **Client ID** dan **Client secret** yang muncul, isi ke `.env` (dan ke
   Environment Variables Vercel untuk production) sebagai `GOOGLE_CLIENT_ID` dan
   `GOOGLE_CLIENT_SECRET`.

**Perilaku login Google:** jika email akun Google yang login belum pernah terdaftar
di tabel `User`, sistem otomatis membuat akun baru dengan role default `KADER`.
Kepala Puskesmas/admin bisa mengubah role akun tersebut belakangan langsung lewat
database bila perlu.

## Deploy ke Vercel

1. **Buat project Supabase gratis** di [supabase.com](https://supabase.com) →
   New Project → pilih region terdekat (mis. Southeast Asia/Singapore) & set
   password database (simpan baik-baik). Tunggu ~2 menit sampai provisioning
   selesai.
2. **Ambil connection string** — di dashboard Supabase, buka **Project
   Settings → Database → Connection string**, tab **URI**. Salin versi
   **Connection pooling** (port 6543) untuk `DATABASE_URL`, dan versi
   **Direct connection** (port 5432) untuk `DIRECT_URL` — lihat format
   lengkap di `.env.example`.
3. **Set environment variables** di Vercel (Project Settings → Environment
   Variables): `DATABASE_URL`, `DIRECT_URL`, dan `SESSION_SECRET` (isi
   manual dengan string acak, lihat contoh di `.env.example`).
4. **Push kode ke Git provider** (GitHub/GitLab/Bitbucket) lalu import
   repository-nya di [vercel.com/new](https://vercel.com/new). Vercel akan
   otomatis mendeteksi Next.js dan menjalankan `npm install` (memicu
   `postinstall` → `prisma generate`) lalu `next build`.
5. **Jalankan migrasi ke database production** — ini tidak dijalankan
   otomatis saat build, jadi lakukan sekali dari komputer Anda (dengan
   `DATABASE_URL`/`DIRECT_URL` di `.env` lokal diarahkan ke database
   Supabase di atas):
   ```bash
   npm run prisma:deploy   # prisma migrate deploy
   node prisma/seed.js     # opsional: isi akun & data contoh
   ```
6. Buka domain yang diberikan Vercel — halaman login akan muncul seperti di
   development.

## Struktur Proyek

```
prisma/
  schema.prisma      # skema database (User + 8 model fitur)
  seed.js             # data contoh (6 akun, modul belajar, kasus contoh, dst.)
src/
  lib/
    prisma.js         # koneksi Prisma singleton
    session.js         # session login berbasis cookie HMAC
    auth.js             # requireSession() / requireRole() untuk proteksi halaman
    roles.js, utils.js
  components/          # komponen UI yang dipakai berulang
  app/
    login/              # halaman & Server Action login
    (app)/              # grup route yang butuh login (sidebar + 8 layar)
      dashboard/
      kasus/            # Layar 1-4
      belajar/          # Layar 5
      jadwal/            # Layar 6
      monitoring/        # Layar 7
      praktik-baik/       # Layar 8
    api/
      auth/logout/
      laporan/            # ekspor CSV (Layar 7)
```

## Langkah Pengembangan Lanjutan yang Disarankan

- Tambahkan validasi input yang lebih ketat (mis. dengan `zod`) di setiap Server
  Action.
- Pertimbangkan migrasi autentikasi ke [Auth.js](https://authjs.dev) jika perlu
  fitur seperti reset password, login SSO, atau audit log akses.
- Integrasi sungguhan ke SATUSEHAT memerlukan pendaftaran resmi ke Kemenkes dan
  mengikuti spesifikasi FHIR mereka — lihat dokumentasi resmi SATUSEHAT.
- Storyboard sumber menyebutkan data FGD baru mencakup satu Puskesmas (Padang
  Kerambil). Sebelum dipakai di Puskesmas lain, validasi ulang alur & kebutuhan
  fitur dengan data FGD tambahan.
