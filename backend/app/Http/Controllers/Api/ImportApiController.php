<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Import\ImportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ImportApiController extends Controller
{
    public function __construct(
        private ImportService $importService,
    ) {}

    public function import(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'File tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('file');
        $path = $file->store('imports');

        $result = $this->importService->import(Storage::disk('local')->path($path));

        return response()->json($result);
    }

    public function anggotas()
    {
        return response()->json([
            'success' => true,
            'data' => \App\Models\Anggota::orderBy('id')->limit(500)->get(),
        ]);
    }

    public function programKerja()
    {
        return response()->json([
            'success' => true,
            'data' => \App\Models\ProgramKerja::orderBy('created_at', 'desc')->limit(500)->get(),
        ]);
    }

    public function storeAnggota(Request $request)
    {
        $validated = $request->validate([
            'nim' => 'required|string|max:20|unique:kabinets,nim',
            'nama' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'angkatan' => 'nullable|string|max:20',
        ]);

        $anggota = \App\Models\Anggota::create($validated);

        return response()->json(['success' => true, 'data' => $anggota], 201);
    }

    public function updateAnggota(Request $request, $id)
    {
        $anggota = \App\Models\Anggota::findOrFail($id);

        $validated = $request->validate([
            'nim' => 'required|string|max:20|unique:kabinets,nim,'.$id,
            'nama' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'angkatan' => 'nullable|string|max:20',
        ]);

        $anggota->update($validated);

        return response()->json(['success' => true, 'data' => $anggota]);
    }

    public function destroyAnggota($id)
    {
        $anggota = \App\Models\Anggota::findOrFail($id);
        $anggota->delete();

        return response()->json(['success' => true, 'message' => 'Anggota berhasil dihapus']);
    }

    public function toggleStatus($id)
    {
        $anggota = \App\Models\Anggota::findOrFail($id);
        $anggota->status = $anggota->status === 'aktif' ? 'nonaktif' : 'aktif';
        $anggota->save();

        $message = $anggota->status === 'aktif'
            ? "Anggota {$anggota->nama} berhasil diaktifkan"
            : "Anggota {$anggota->nama} berhasil dinonaktifkan";

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $anggota,
        ]);
    }
}
