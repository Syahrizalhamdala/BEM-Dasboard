# Migrasi SQLite → Supabase PostgreSQL

## Prasyarat

1. **Supabase Project** sudah aktif (`https://dlkxrfvfzehiezmhalcw.supabase.co`)
2. **Service Role Key** — dapatkan dari Supabase Dashboard:
   - Project Settings → API → service_role key
   - Copy ke `.env` → `SUPABASE_SERVICE_KEY=...`
3. **Database Password** — dapat dari Supabase Dashboard:
   - Project Settings → Database → Database password
   - Copy ke `.env` → `DB_PASSWORD=...`
4. **PG AI extension** untuk `uuid-ossp` (sudah terinstall default di Supabase)

## Langkah Migrasi

### 1. Update `.env`

```env
DB_CONNECTION=pgsql
DB_HOST=db.dlkxrfvfzehiezmhalcw.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=<password_dari_supabase>
DB_SSLMODE=require

SUPABASE_SERVICE_KEY=<service_role_key_dari_supabase>
SUPABASE_DB_HOST=db.dlkxrfvfzehiezmhalcw.supabase.co
```

### 2. Jalankan Migration

```bash
php artisan migrate:fresh
```

Ini akan:
- Drop semua tabel yang ada di Supabase PostgreSQL
- Menjalankan 28 migration dari awal
- Mengisi data default (settings GPS)

### 3. (Opsional) Seeder Data Awal

```bash
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=DivisiSeeder
```

### 4. Verifikasi Koneksi

```bash
php artisan tinker
> DB::connection()->getPdo()->getAttribute(PDO::ATTR_SERVER_VERSION)
# Harus menampilkan versi PostgreSQL (misal: 15.x)
```

## Aktivasi Realtime di Supabase

### Tabel yang perlu diaktifkan realtime:

| Tabel | Event | Kegunaan |
|-------|-------|----------|
| `attendances` | INSERT | Update dashboard real-time saat check-in |
| `activity_logs` | INSERT | Muncul aktivitas terbaru di dashboard |
| `notifications` | INSERT | Notifikasi real-time ke pengguna |

### Cara aktivasi:

1. Buka Supabase Dashboard → `https://supabase.com/dashboard/project/dlkxrfvfzehiezmhalcw`
2. Navigasi ke **Project Settings** → **Realtime**
3. Di bagian **Replication**, klik **Add Publication**
4. Pilih tabel `attendances`, `activity_logs`, `notifications`
5. Untuk setiap tabel, pilih event: **Insert**, **Update**, **Delete**
6. Klik **Save**

### Verifikasi Realtime:

```sql
-- Di Supabase SQL Editor
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

## Refactor Architecture

### Struktur baru:

```
app/
├── Http/
│   └── Controllers/
│       ├── Api/          → API controllers (thin)
│       └── Dashboard/    → Dashboard API
├── Services/             → Business logic
│   ├── Auth/
│   │   └── AuthService.php
│   ├── Attendance/       → Existing
│   ├── Chatbot/          → Existing
│   ├── Dashboard/
│   │   ├── DashboardService.php
│   │   ├── ActivityLogService.php (existing)
│   │   └── SupabaseService.php
│   └── Laporan/
│       └── LaporanService.php
├── Repositories/         → Data access
│   ├── UserRepository.php
│   ├── AttendanceRepository.php
│   ├── AgendaRepository.php
│   ├── DivisiRepository.php
│   ├── ActivityLogRepository.php
│   └── ...
├── Models/               → Eloquent models
└── Traits/
```

### Aliran data baru:

```
Controller (thin)
  ↓ call
Service (business logic, validation)
  ↓ call
Repository (query builder, Eloquent)
  ↓
Model (data mapping)
```

## Row Level Security (RLS) di Supabase

Setelah migrasi ke PostgreSQL, aktifkan RLS untuk mengamankan data di level database.

### Arsitektur RLS

```
Laravel (postgres role)  ──► bypass RLS (table owner) ──► full access
Frontend (anon key)      ──► subject to RLS            ──► SELECT only (realtime)
Future (Supabase Auth)   ──► subject to RLS            ──► role-based policies
```

### Tabel dengan RLS

| Tabel | anon (realtime) | admin | pengurus | anggota |
|-------|----------------|-------|----------|---------|
| `attendances` | SELECT | ALL | SELECT own + INSERT own | SELECT own + INSERT own |
| `activity_logs` | SELECT | ALL | SELECT own | SELECT own |
| `notifications` | SELECT | ALL | SELECT own | SELECT own |
| `laporans` | — | ALL | SELECT all + CRUD own | SELECT all + CRUD own |
| `jadwal_rapats` | — | ALL | SELECT + INSERT + UPDATE | SELECT |
| `users` | — | ALL | SELECT self + UPDATE self | SELECT self + UPDATE self |
| `kabinets` | — | ALL | SELECT | SELECT |
| `divisis`, `jabatans` | — | ALL | SELECT | SELECT |
| `program_kerjas` | — | ALL | SELECT + INSERT + UPDATE | SELECT |
| `settings` | SELECT | ALL | SELECT | SELECT |
| `face_descriptors` | — | ALL | — | — |
| `permissions` / `roles` (Spatie) | — | ALL | — | — |
| `agendas`, `anggotas`, `chatbot_faqs` | — | ALL | SELECT | SELECT |

### Cara Aktivasi RLS

**Opsi A — Via Laravel Command** (koneksi DB harus sudah hidup):

```bash
php artisan supabase:enable-rls
```

**Opsi B — Via Supabase SQL Editor** (recommended jika DB belum terkoneksi):

1. Buka Supabase Dashboard → SQL Editor
2. Copy isi `database/supabase/rls.sql`
3. Paste dan Run

### Verifikasi RLS

```sql
-- Cek semua policy
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Cek tabel dengan RLS aktif
SELECT tablename FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity
ORDER BY tablename;

-- Cek realtime publication
SELECT * FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
```

### Integrasi Supabase Auth (Future)

Untuk mengaktifkan role-based RLS (`admin`/`pengurus`/`anggota`), tambahkan custom claims ke JWT Supabase Auth:

```json
{
  "app_role": "admin",
  "app_user_id": 1,
  "app_divisi": "Humas"
}
```

Implementasi bisa via `supabase.auth.setSession()` dengan access token yang mengandung custom claims, atau via Auth Hooks di Supabase Dashboard.

## Checklist Verifikasi

- [x] **Koneksi PostgreSQL berhasil**
  ```bash
  php artisan tinker -c "DB::connection()->getPdo();"
  ```
- [x] **Migration berjalan**
  ```bash
  php artisan migrate:fresh
  php artisan migrate:status
  # 28 migrations should all show "Ran"
  ```
- [x] **CRUD Anggota**
  ```bash
  curl -X POST http://localhost:8000/api/kabinet -H "Content-Type: application/json" -d '{"nama":"Test","jabatan":"Anggota"}'
  curl http://localhost:8000/api/kabinet
  ```
- [x] **CRUD Agenda**
  ```bash
  curl -X POST http://localhost:8000/api/agenda -H "Content-Type: application/json" -d '{"agenda":"Rapat Test","tanggal":"2026-06-15"}'
  curl http://localhost:8000/api/agenda
  ```
- [x] **Absensi**
  ```bash
  curl -X POST http://localhost:8000/api/attendance/scan -H "Content-Type: application/json" -d '{"qr_token":"...","latitude":-6.8564,"longitude":107.5889}'
  curl http://localhost:8000/api/attendance/statistik
  ```
- [x] **Upload File**
  ```bash
  curl -X POST http://localhost:8000/api/laporan -F "file=@test.pdf" -F "judul=Laporan Test" -F "tipe=Kegiatan" -F "status=Draft" -F "tanggal=2026-06-15"
  ```
- [x] **Realtime**
  - Buka Supabase Dashboard → Database → Realtime
  - Pastikan `attendances` dan `activity_logs` ada di publikasi
- [x] **Realtime**
  - Buka Supabase Dashboard → Database → Realtime
  - Pastikan `attendances` dan `activity_logs` ada di publikasi
- [x] **RLS Policies**
  ```bash
  php artisan supabase:enable-rls
  # atau run database/supabase/rls.sql di Supabase SQL Editor
  ```
- [x] **Verifikasi RLS**
  ```sql
  -- Harus ≥40 policy terdaftar
  SELECT count(*) FROM pg_policies WHERE schemaname = 'public';
  ```
- [x] **Frontend build**
  ```bash
  cd frontend && npm run build
  # 0 errors
  ```

## File yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `.env` | `DB_CONNECTION=pgsql`, tambah `SUPABASE_DB_HOST`, `DB_SSLMODE` |
| `config/database.php` | Default `pgsql`, update host/sslmode |
| `config/services.php` | Tambah `supabase` config |
| `app/Providers/AppServiceProvider.php` | Register repositories & services |
| `app/Http/Controllers/Dashboard/DashboardController.php` | Refactor pakai DashboardService |
| `app/Http/Controllers/Api/AttendanceApiController.php` | `strftime` → `EXTRACT(MONTH ...)` |
| `database/migrations/*.php` (10 files) | Hapus `->after()` |
| `app/Services/Dashboard/DashboardService.php` | **Baru** — business logic dashboard |
| `app/Services/Dashboard/SupabaseService.php` | **Baru** — realtime broadcast + storage |
| `app/Services/Auth/AuthService.php` | **Baru** — auth business logic |
| `app/Services/Laporan/LaporanService.php` | **Baru** — laporan business logic |
| `app/Repositories/*.php` (5 files) | **Baru** — data access layer |

## Rollback

Jika terjadi error, kembali ke SQLite:

```bash
# 1. Kembalikan .env
DB_CONNECTION=sqlite

# 2. Hapus file migration yang sudah dimodifikasi
git checkout database/migrations/

# 3. Kembalikan database
php artisan migrate:fresh --seed

# 4. Kembalikan service provider
git checkout app/Providers/AppServiceProvider.php
```
