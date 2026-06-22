<?php

namespace App\Services\Import;

use App\Models\Kabinet;
use App\Models\ProgramKerja;
use App\Models\JadwalRapat;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ImportService
{
    private array $errors = [];

    public function import(string $filePath): array
    {
        $this->errors = [];

        $raw = Excel::toArray([], $filePath);

        $anggotas = $this->rowsWithHeaders($raw[0] ?? []);
        $programs = $this->rowsWithHeaders($raw[1] ?? []);
        $rapats = $this->rowsWithHeaders($raw[2] ?? []);

        DB::beginTransaction();
        try {
            $anggotaResult = $this->importAnggota($anggotas);
            $programResult = $this->importProgramKerja($programs);
            $rapatResult = $this->importJadwalRapat($rapats);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Import berhasil.',
                'anggota' => $anggotaResult['success'],
                'program_kerja' => $programResult['success'],
                'jadwal_rapat' => $rapatResult['success'],
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Import gagal: ' . $e->getMessage(), [
                'file' => $filePath,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Import gagal: ' . $e->getMessage(),
                'anggota' => 0,
                'program_kerja' => 0,
                'jadwal_rapat' => 0,
            ];
        }
    }

    private function rowsWithHeaders(array $rows): array
    {
        if (empty($rows)) {
            return [];
        }
        $headers = array_shift($rows);
        $headers = array_map(fn($h) => strtolower(trim(str_replace([' ', '-', '.'], '_', (string) $h))), $headers);
        $result = [];
        foreach ($rows as $row) {
            $assoc = [];
            foreach ($headers as $i => $header) {
                $assoc[$header] = $row[$i] ?? null;
            }
            $result[] = $assoc;
        }
        return $result;
    }

    private function importAnggota(array $rows): array
    {
        $success = 0;
        $existingNames = Kabinet::pluck('nama')->filter()->values()->all();

        foreach ($rows as $index => $row) {
            $row = array_change_key_case($row, CASE_LOWER);

            $nim = trim($row['nim'] ?? $row['n i m'] ?? '');
            $nama = trim($row['nama'] ?? $row['nama_lengkap'] ?? '');
            $jabatan = trim($row['jabatan'] ?? $row['posisi'] ?? '');
            $angkatan = trim($row['angkatan'] ?? $row['tahun'] ?? '');
            $foto = trim($row['foto'] ?? $row['photo'] ?? '');

            if (empty($nama) && empty($jabatan)) {
                continue;
            }

            if (empty($nama)) {
                $this->logError("Anggota baris " . ($index + 2) . ": Nama kosong, dilewati.");
                continue;
            }

            if (in_array($nama, $existingNames)) {
                continue;
            }

            try {
                Kabinet::create([
                    'nim' => $nim ?: null,
                    'jabatan' => $jabatan ?: null,
                    'nama' => $nama,
                    'angkatan' => $angkatan ?: null,
                    'foto' => $foto ?: null,
                ]);

                $existingNames[] = $nama;
                $success++;
            } catch (\Exception $e) {
                $this->logError("Anggota '{$nama}': " . $e->getMessage());
            }
        }

        return ['success' => $success];
    }

    private function importProgramKerja(array $rows): array
    {
        $success = 0;

        foreach ($rows as $index => $row) {
            $row = array_change_key_case($row, CASE_LOWER);

            $kementerian = trim($row['kementerian'] ?? '');
            $programKerja = trim($row['program_kerja'] ?? $row['program'] ?? $row['nama_program'] ?? '');
            $bidang = trim($row['bidang'] ?? '');
            $bulan = trim($row['bulan'] ?? '');
            $tanggal = $this->parseDate($row['tanggal'] ?? null);
            $lokasi = trim($row['lokasi'] ?? '');
            $deskripsi = trim($row['deskripsi'] ?? '');
            $status = trim($row['status'] ?? '');

            if (empty($kementerian) && empty($programKerja)) {
                continue;
            }

            if (empty($programKerja)) {
                $this->logError("Program Kerja baris " . ($index + 2) . ": Nama program kosong, dilewati.");
                continue;
            }

            $exists = ProgramKerja::where('kementerian', $kementerian)
                ->where('program_kerja', $programKerja)
                ->exists();

            if ($exists) {
                continue;
            }

            try {
                ProgramKerja::create([
                    'kementerian' => $kementerian,
                    'program_kerja' => $programKerja,
                    'bidang' => $bidang ?: null,
                    'bulan' => $bulan ?: null,
                    'tanggal' => $tanggal,
                    'lokasi' => $lokasi ?: null,
                    'deskripsi' => $deskripsi ?: null,
                    'status' => $status ?: null,
                ]);
                $success++;
            } catch (\Exception $e) {
                $this->logError("Program Kerja '{$programKerja}': " . $e->getMessage());
            }
        }

        return ['success' => $success];
    }

    private function importJadwalRapat(array $rows): array
    {
        $success = 0;

        foreach ($rows as $index => $row) {
            $row = array_change_key_case($row, CASE_LOWER);

            $agenda = trim($row['agenda'] ?? '');
            $lingkup = trim($row['lingkup'] ?? '');
            $tanggal = $this->parseDate($row['tanggal'] ?? null);
            $waktuMulai = trim($row['waktu_mulai'] ?? $row['jam_mulai'] ?? '');
            $waktuSelesai = trim($row['waktu_selesai'] ?? $row['jam_selesai'] ?? '');
            $tempat = trim($row['tempat'] ?? $row['lokasi'] ?? '');
            $pemimpin = trim($row['pemimpin'] ?? $row['ketua'] ?? '');
            $deskripsi = trim($row['deskripsi'] ?? '');

            if (empty($agenda)) {
                continue;
            }

            $exists = JadwalRapat::where('agenda', $agenda)
                ->where('tanggal', $tanggal)
                ->exists();

            if ($exists) {
                continue;
            }

            try {
                JadwalRapat::create([
                    'agenda' => $agenda,
                    'lingkup' => $lingkup ?: null,
                    'tanggal' => $tanggal,
                    'waktu' => $tanggal && $waktuMulai ? "{$tanggal} {$waktuMulai}" : null,
                    'waktu_mulai' => $waktuMulai ?: null,
                    'waktu_selesai' => $waktuSelesai ?: null,
                    'tempat' => $tempat ?: null,
                    'pemimpin' => $pemimpin ?: null,
                    'deskripsi' => $deskripsi ?: null,
                ]);
                $success++;
            } catch (\Exception $e) {
                $this->logError("Jadwal Rapat '{$agenda}': " . $e->getMessage());
            }
        }

        return ['success' => $success];
    }

    private function parseDate(mixed $value): ?string
    {
        if (empty($value)) {
            return null;
        }

        if ($value instanceof \DateTime || $value instanceof \Carbon\Carbon) {
            return $value->format('Y-m-d');
        }

        if (is_string($value)) {
            $trimmed = trim($value);
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $trimmed)) {
                return $trimmed;
            }
            $ts = strtotime($trimmed);
            if ($ts !== false) {
                return date('Y-m-d', $ts);
            }
        }

        if (is_numeric($value)) {
            $unixDate = ($value - 25569) * 86400;
            return date('Y-m-d', (int) $unixDate);
        }

        return null;
    }

    private function logError(string $message): void
    {
        $this->errors[] = $message;
        Log::warning('Import warning: ' . $message);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
