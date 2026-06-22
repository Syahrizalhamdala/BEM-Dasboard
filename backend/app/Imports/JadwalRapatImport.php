<?php

namespace App\Imports;

use App\Models\JadwalRapat;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithLimit;

class JadwalRapatImport implements ToModel, WithHeadingRow, WithLimit
{
    private int $rowCount = 0;

    public function limit(): int
    {
        return 1000;
    }

    public function model(array $row): ?JadwalRapat
    {
        $this->rowCount++;

        $tanggal = $this->parseDate($row['tanggal'] ?? null);
        $waktuMulai = $row['waktu_mulai'] ?? $row['jam_mulai'] ?? $row['pukul'] ?? null;
        $waktuSelesai = $row['waktu_selesai'] ?? $row['jam_selesai'] ?? null;

        $waktu = null;
        if ($tanggal && $waktuMulai) {
            try {
                $waktu = \Carbon\Carbon::parse($tanggal . ' ' . $waktuMulai);
            } catch (\Exception $e) {
                $waktu = null;
            }
        }

        return new JadwalRapat([
            'agenda' => $row['agenda'] ?? $row['nama_rapat'] ?? $row['topik'] ?? $row['acara'] ?? '',
            'lingkup' => $row['lingkup'] ?? $row['jenis'] ?? $row['tingkat'] ?? null,
            'waktu' => $waktu,
            'tanggal' => $tanggal,
            'waktu_mulai' => $waktuMulai,
            'waktu_selesai' => $waktuSelesai,
            'tempat' => $row['tempat'] ?? $row['lokasi'] ?? $row['ruang'] ?? null,
            'pemimpin' => $row['pemimpin'] ?? $row['ketua'] ?? $row['pimpinan_rapat'] ?? null,
            'deskripsi' => $row['deskripsi'] ?? $row['keterangan'] ?? $row['catatan'] ?? null,
        ]);
    }

    public function getRowCount(): int
    {
        return $this->rowCount;
    }

    private function parseDate($value): ?string
    {
        if (empty($value)) return null;

        if ($value instanceof \DateTime || $value instanceof \Carbon\Carbon) {
            return $value->format('Y-m-d');
        }

        if (is_string($value)) {
            $date = date_parse($value);
            if ($date['error_count'] === 0 && checkdate($date['month'], $date['day'], $date['year'])) {
                return date('Y-m-d', strtotime($value));
            }
        }

        if (is_numeric($value)) {
            $unixDate = ($value - 25569) * 86400;
            return date('Y-m-d', $unixDate);
        }

        return null;
    }
}
