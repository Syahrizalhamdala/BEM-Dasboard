<?php

namespace App\Imports;

use App\Models\ProgramKerja;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithLimit;

class ProgramKerjaImport implements ToModel, WithHeadingRow, WithLimit
{
    private int $rowCount = 0;

    public function limit(): int
    {
        return 1000;
    }

    public function model(array $row): ?ProgramKerja
    {
        $this->rowCount++;

        return new ProgramKerja([
            'kementerian' => $row['kementerian'] ?? $row['departemen'] ?? $row['bidang'] ?? $row['divisi'] ?? '',
            'program_kerja' => $row['program_kerja'] ?? $row['program'] ?? $row['kegiatan'] ?? $row['nama_program'] ?? '',
            'bidang' => $row['bidang'] ?? $row['sub_bidang'] ?? null,
            'bulan' => $row['bulan'] ?? $row['periode'] ?? null,
            'tanggal' => $this->parseDate($row['tanggal'] ?? $row['tgl'] ?? null),
            'lokasi' => $row['lokasi'] ?? $row['tempat'] ?? null,
            'deskripsi' => $row['deskripsi'] ?? $row['keterangan'] ?? null,
            'status' => $row['status'] ?? $row['kondisi'] ?? null,
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
