<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LaporanApiController extends Controller
{
    public function index()
    {
        $data = Laporan::orderBy('tanggal', 'desc')->limit(500)->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'tipe' => 'required|string|in:Bulanan,Kegiatan,Keuangan,Proposal,Evaluasi',
            'status' => 'required|string|in:Draft,Proses,Selesai',
            'tanggal' => 'required|date',
            'deskripsi' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $filePath = $file->store('laporans', 'public');
        $fileSize = $file->getSize();
        $fileType = $file->getMimeType();
        $fileName = $file->getClientOriginalName();

        $user = $request->user();

        $laporan = Laporan::create([
            'judul' => $request->judul,
            'tipe' => $request->tipe,
            'status' => $request->status,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'user_id' => $user->id,
            'pembuat' => $user->name,
            'tanggal' => $request->tanggal,
            'deskripsi' => $request->deskripsi,
        ]);

        return response()->json(['success' => true, 'data' => $laporan], 201);
    }

    public function update(Request $request, $id)
    {
        $laporan = Laporan::find($id);
        if (!$laporan) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'judul' => 'string|max:255',
            'tipe' => 'string|in:Bulanan,Kegiatan,Keuangan,Proposal,Evaluasi',
            'status' => 'string|in:Draft,Proses,Selesai',
            'tanggal' => 'date',
            'deskripsi' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $request->only(['judul', 'tipe', 'status', 'tanggal', 'deskripsi']);

        if ($request->hasFile('file')) {
            Storage::disk('public')->delete($laporan->file_path);

            $file = $request->file('file');
            $data['file_path'] = $file->store('laporans', 'public');
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_type'] = $file->getMimeType();
            $data['file_size'] = $file->getSize();
        }

        $laporan->update($data);

        return response()->json(['success' => true, 'data' => $laporan]);
    }

    public function destroy($id)
    {
        $laporan = Laporan::find($id);
        if (!$laporan) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        Storage::disk('public')->delete($laporan->file_path);
        $laporan->delete();

        return response()->json(['success' => true, 'message' => 'Laporan berhasil dihapus']);
    }

    public function download($id)
    {
        $laporan = Laporan::find($id);
        if (!$laporan) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        if (!Storage::disk('public')->exists($laporan->file_path)) {
            return response()->json(['success' => false, 'message' => 'File tidak ditemukan'], 404);
        }

        return Storage::disk('public')->download($laporan->file_path, $laporan->file_name);
    }
}
