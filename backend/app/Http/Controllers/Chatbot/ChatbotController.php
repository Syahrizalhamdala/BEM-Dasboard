<?php

namespace App\Http\Controllers\Chatbot;

use App\Http\Controllers\Controller;
use App\Services\Chatbot\ChatbotService;
use App\Services\Chatbot\ExcelImportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ChatbotController extends Controller
{
    protected ChatbotService $chatbotService;
    protected ExcelImportService $excelImportService;

    public function __construct(ChatbotService $chatbotService, ExcelImportService $excelImportService)
    {
        $this->chatbotService = $chatbotService;
        $this->excelImportService = $excelImportService;
    }

    public function ask(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question' => 'required|string|min:2|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Pertanyaan tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $result = $this->chatbotService->ask($request->question);

            return response()->json([
                'success' => true,
                'message' => 'Jawaban berhasil didapatkan.',
                'data' => [
                    'answer' => $result['answer'],
                    'source' => $result['source'],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses pertanyaan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function import(Request $request)
    {
        set_time_limit(120);

        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya admin yang dapat mengimport data.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'File tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $file = $request->file('file');
            $path = $file->store('imports');

            $fullPath = Storage::path($path);

            if (!file_exists($fullPath)) {
                throw new \RuntimeException("File tidak ditemukan setelah upload: {$fullPath}");
            }

            $result = $this->excelImportService->import($fullPath);

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengimpor file: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function status()
    {
        $kabinetCount = \App\Models\Kabinet::count();
        $programCount = \App\Models\ProgramKerja::count();
        $rapatCount = \App\Models\JadwalRapat::count();

        return response()->json([
            'success' => true,
            'data' => [
                'kabinet' => $kabinetCount,
                'program_kerja' => $programCount,
                'jadwal_rapat' => $rapatCount,
                'total' => $kabinetCount + $programCount + $rapatCount,
                'has_data' => $kabinetCount > 0 || $programCount > 0 || $rapatCount > 0,
            ],
        ]);
    }
}
