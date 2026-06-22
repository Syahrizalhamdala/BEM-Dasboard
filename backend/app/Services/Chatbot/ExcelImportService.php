<?php

namespace App\Services\Chatbot;

use App\Imports\BemDataImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExcelImportService
{
    public function import(string $filePath): array
    {
        $results = [
            'kabinet' => ['success' => 0, 'failed' => 0],
            'program_kerja' => ['success' => 0, 'failed' => 0],
            'jadwal_rapat' => ['success' => 0, 'failed' => 0],
        ];

        DB::beginTransaction();

        try {
            $import = new BemDataImport();
            Excel::import($import, $filePath);

            $results['kabinet']['success'] = 1;
            $results['program_kerja']['success'] = 1;
            $results['jadwal_rapat']['success'] = 1;

            DB::commit();

            return [
                'success' => true,
                'message' => 'Data berhasil diimpor.',
                'results' => $results,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Excel import failed: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Gagal mengimpor data: ' . $e->getMessage(),
                'results' => $results,
            ];
        }
    }
}
