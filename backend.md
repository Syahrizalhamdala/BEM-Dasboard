# Backend — BEM Dashboard (Laravel 13)

## Tech Stack
- **Framework:** Laravel 13
- **Database:** PostgreSQL (Supabase) / SQLite (local fallback)
- **Auth:** Laravel Sanctum (token-based)
- **AI:** Groq API (Llama 3.3 70B) — 30 req/min
- **PDF:** DomPDF, smalot/pdfparser, phpoffice/phpword

---

## Server
- **Dev:** `php artisan serve` → http://localhost:8000
- **API Base:** `/api`
- **CORS:** `http://localhost:5173` allowed, credentials enabled

---

## Routes (`routes/api.php`)

### Public (no auth)

| Method | URI | Controller@method |
|--------|-----|-------------------|
| POST | `/auth/register` | AuthController@register |
| POST | `/auth/login` | AuthController@login |
| GET | `/agenda` | AgendaApiController@index |
| GET | `/agenda/terdekat` | AgendaApiController@terdekat |
| GET | `/dashboard/stats` | DashboardController@stats |
| GET | `/dashboard/recent-activities` | DashboardController@recentActivities |
| GET | `/anggotas` | ImportApiController@anggotas |
| GET | `/program-kerja` | ImportApiController@programKerja |
| POST | `/chatbot/ask` | ChatbotController@ask |
| GET | `/chatbot/status` | ChatbotController@status |
| GET/POST/PUT/DELETE | `/kabinet{/id}` | KabinetApiController |

### Protected (`auth:sanctum`)

| Method | URI | Controller@method |
|--------|-----|-------------------|
| POST | `/auth/logout` | AuthController@logout |
| GET | `/auth/me` | AuthController@me |
| PUT | `/auth/profile` | AuthController@updateProfile |
| PUT | `/auth/password` | AuthController@changePassword |
| CRUD | `/agenda{/id}` | AgendaApiController |
| CRUD | `/anggotas{/id}` | ImportApiController (store/update/destroy) |
| CRUD | `/laporan{/id}` + `/laporan/{id}/download` | LaporanApiController |
| POST | `/attendance/scan` | AttendanceApiController@scan |
| GET | `/attendance/my` / `/attendance` / `/attendance/statistik` | AttendanceApiController |
| POST | `/import` | ImportApiController@import |
| POST | `/chatbot/import` | ChatbotController@import |

### Proposal Routes (`auth:sanctum`, prefix `/proposal`)

| Method | URI | Controller@method |
|--------|-----|-------------------|
| GET | `/proposal/guidelines` | ProposalController@guidelines |
| GET | `/proposal/guideline/aktif` | ProposalController@guidelineAktif |
| POST | `/proposal/guideline` | ProposalController@uploadGuideline (admin) |
| POST | `/proposal/check` | ProposalController@check |
| GET | `/proposal/checks` | ProposalController@checks |
| GET | `/proposal/check/{id}` | ProposalController@checkDetail |
| GET | `/proposal/review-queue` | ProposalController@reviewQueue |
| POST | `/proposal/{id}/review` | ProposalController@review |
| GET | `/proposal/pending-signatures` | ProposalController@pendingSignatures |
| POST | `/proposal/{id}/sign` | ProposalController@sign |
| GET | `/proposal/{id}/download` | ProposalController@download |

---

## Controllers

### Auth/AuthController.php
- `register()` — Validates name, nim (required), email, password, divisi, jabatan. Creates user with status='aktif'.
- `login()` — Authenticates by email/password. Checks status (pending/nonaktif/aktif). Issues Sanctum token.
- `logout()` — Deletes current access token.
- `me()` — Returns authenticated user.
- `updateProfile()` — Updates name, email, nim, divisi, jabatan.
- `changePassword()` — Validates current password, updates to new.

### Api/KabinetApiController.php
- `index()` — Lists all kabinet members (optional NIM filter).
- `store()` — Creates member with default password `bem2025`, logs activity.
- `show($id)` — Single member detail.
- `update()` — Updates member, logs activity.
- `destroy()` — Deletes member.

### Api/AgendaApiController.php
- `index()` — All agendas (date desc).
- `terdekat()` — Upcoming 5 agendas.
- `store()` — Creates agenda, generates QR code, logs activity.
- `update()` — Updates agenda, logs activity.
- `destroy()` — Deletes agenda.
- `toggleQr($id)` — Toggles QR active/inactive.

### Api/AttendanceApiController.php
- `scan()` — Processes QR + GPS scan, checks duplicate, creates attendance.
- `index()` — All attendances (filters: agenda_id, date).
- `myAttendance()` — Current user's attendances.
- `statistik()` — Today count, monthly, percentages, charts.
- `agendaQr()` — Returns/generates QR for agenda.
- `regenerateQr()` — Regenerates QR token.
- `getCampusLocation()` — Campus GPS from settings.

### Api/LaporanApiController.php
- `index()` — All reports (date desc).
- `store()` — Validates, uploads file, creates report.
- `update()` — Updates report, optionally replaces file.
- `destroy()` — Deletes report + file.
- `download()` — Downloads report file.

### Api/ImportApiController.php
- `import()` — Bulk Excel import (multi-sheet: Kabinet, ProgramKerja, JadwalRapat).
- `anggotas()` — All anggota (dari tabel `kabinets`) ordered by id.
- `programKerja()` — All program_kerja.
- `storeAnggota()` — Create single anggota.
- `updateAnggota()` — Update single anggota.
- `destroyAnggota()` — Delete single anggota.

### Api/ProposalController.php
- `guidelines()` — Lists all guidelines.
- `guidelineAktif()` — Active guideline.
- `uploadGuideline()` — Admin upload, deactivates previous.
- `check()` — Parse proposal file, AI check against guideline.
- `checks()` — All checks with relations.
- `checkDetail($id)` — Single check detail.
- `reviewQueue()` — Checks with status `lulus_ai` (admin review).
- `review()` — Approve/reject check.
- `sign()` — President signs approved check with base64 signature, generates PDF.
- `download()` — Download signed proposal PDF.
- `pendingSignatures()` — Approved checks pending signature.

### Chatbot/ChatbotController.php
- `ask()` — Accepts question, returns AI answer from Groq.
- `import()` — Admin Excel import to chatbot tables.
- `status()` — Record counts (kabinet, program_kerja, jadwal_rapat).

### Dashboard/DashboardController.php
- `stats()` — Members count, attendance today, total agendas, percentage, charts, import counts.
- `recentActivities()` — Recent activity logs.

---

## Models

| Model | Table | Key Fillable |
|-------|-------|-------------|
| User | `users` | name, email, password, nim, divisi, jabatan, role, foto_profil, status |
| Kabinet | `kabinets` | nim, nama, prodi, divisi, jabatan, angkatan, foto, status, password |
| Anggota | `kabinets` (alias) | nim, jabatan, nama, angkatan, foto, status |
| JadwalRapat | `jadwal_rapats` | agenda, lingkup, waktu, tanggal, waktu_mulai, waktu_selesai, tempat, pemimpin, deskripsi, qr_token, qr_code_url, is_qr_active |
| Attendance | `attendances` | user_id, agenda_id, check_in_time, latitude, longitude, distance, verification_method |
| ProgramKerja | `program_kerjas` | kementerian, program_kerja, bidang, bulan, tanggal, lokasi, deskripsi, status |
| Laporan | `laporans` | judul, tipe, status, file_path, file_name, file_type, file_size, user_id, pembuat, tanggal, deskripsi |
| ActivityLog | `activity_logs` | type, message, user_id, user_name, metadata |
| Setting | `settings` | key, value |
| ProposalGuideline | `proposal_guidelines` | judul, konten_teks, file_path, aktif |
| ProposalCheck | `proposal_checks` | guideline_id, nama_file, konten_proposal, hasil_check, jumlah_issues, status, admin_notes, reviewed_by, reviewed_at, signed_at, signed_by, signature_path |

---

## Key Services

### ChatbotService
- `ask($question)` — Builds context from DB, calls Groq AI, returns answer.
- `buildContext()` — Formats kabinet + program_kerja + jadwal_rapat as plain text.
- `askGroq()` — POST to Groq API (llama-3.3-70b-versatile), system prompt: BEM assistant in Indonesian.
- `fallbackAnswer()` — Returns raw context if Groq fails.

### ProposalService
- `parseFile()` — Extract text from PDF (smalot/pdfparser) or DOCX (phpoffice/phpword).
- `checkWithAi()` — Sends proposal + guideline to Groq AI, returns JSON issues.
- `generateSuratPengesahan()` — Generates signed PDF via DomPDF.
- `uploadGuideline()` — Stores guideline, parses text, creates model.
- `fallbackCheck()` — Generic error response.

### AttendanceService
- `scan()` — Validates QR, prevents duplicate, calculates GPS distance, creates attendance.
- `getTodayStats()` / `getMonthlyStats()` — Attendance statistics.

### QRService
- `generate()` / `regenerate()` / `toggleActive()` / `validate()` — QR code lifecycle.

### GPSService
- `haversine()` — Distance in meters.
- `isWithinRadius()` — Check if within campus radius (default 100m).
- Campus coords from settings: -6.8564, 107.5889.

### DashboardService
- `getStats()` — Aggregated dashboard statistics.
- `getRecentActivities()` — Recent activity logs.

### SupabaseService
- `broadcast()` / `getPublicUrl()` / `uploadFile()` / `deleteFile()` — Supabase integration.

---

## Key Config

| Config | Value |
|--------|-------|
| `DB_CONNECTION` | pgsql (Supabase) |
| `SUPABASE_URL` | `https://dlkxrfvfzehiezmhalcw.supabase.co` |
| `GROQ_API_KEY` | your-groq-api-key |
| `SANCTUM_STATEFUL_DOMAINS` | localhost:5173, localhost:8000, 127.0.0.1:8000 |
| `CORS.allowed_origins` | http://localhost:5173 |

---

## Env File (`.env`)
Database: Supabase PostgreSQL (cold start ~8.5s). For local dev, switch to SQLite.

Default login: `admin@bem.ac.id` / `bem2025`

---

## Proposal Flow
1. Admin upload guideline → `proposal_guidelines`
2. User upload proposal → AI check (Groq) → `proposal_checks` status `fail`/`lulus_ai`
3. Admin reviews → status `approved`/`fail`
4. Presma signs (base64 signature) → generates Surat Pengesahan PDF → status `signed`
5. User downloads signed PDF

---

## Activity Log Types
`login`, `attendance`, `agenda_created`, `agenda_updated`, `agenda_completed`, `member_added`, `member_updated`, `import_success`

---

## Database Tables (active)
`users`, `kabinets`, `program_kerjas`, `jadwal_rapats`, `attendances`, `activity_logs`, `settings`, `laporans`, `proposal_guidelines`, `proposal_checks`, `personal_access_tokens`, `cache`, `jobs`, `sessions`, `permissions`, `roles`

### Dropped tables
`anggotas` (data → `kabinets`), `absensis`, `face_descriptors`, `divisis`, `jabatans`
