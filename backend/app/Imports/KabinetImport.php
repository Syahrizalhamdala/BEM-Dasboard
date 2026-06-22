<?php

namespace App\Imports;

use App\Models\Kabinet;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithLimit;

class KabinetImport implements ToModel, WithHeadingRow, WithLimit
{
    private int $rowCount = 0;

    public function limit(): int
    {
        return 1000;
    }

    public function model(array $row): ?Kabinet
    {
        $this->rowCount++;

        return new Kabinet([
            'nim' => $row['nim'] ?? $row['n i m'] ?? $row['n i m'] ?? null,
            'jabatan' => $row['jabatan'] ?? $row['posisi'] ?? $row['nama_jabatan'] ?? '',
            'nama' => $row['nama'] ?? $row['nama_lengkap'] ?? $row['anggota'] ?? '',
            'angkatan' => $row['angkatan'] ?? $row['tahun'] ?? null,
            'foto' => $row['foto'] ?? $row['photo'] ?? null,
        ]);
    }

    public function getRowCount(): int
    {
        return $this->rowCount;
    }
}
