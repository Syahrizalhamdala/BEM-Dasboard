<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class BemDataImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            0 => new KabinetImport(),
            1 => new ProgramKerjaImport(),
            2 => new JadwalRapatImport(),
        ];
    }
}
