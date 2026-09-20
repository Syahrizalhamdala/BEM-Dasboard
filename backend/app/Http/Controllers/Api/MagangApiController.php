<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Magang;
use App\Models\MagangApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MagangApiController extends Controller
{
    // ─── PUBLIC (tanpa login) ───

    public function publicIndex()
    {
        $data = Magang::where('status', 'dibuka')
            ->orderBy('deadline', 'asc')
            ->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function publicShow($id)
    {
        $magang = Magang::find($id);
        if (!$magang) {
            return response()->json(['success' => false, 'message' => 'Data magang tidak ditemukan'], 404);
        }
        return response()->json(['success' => true, 'data' => $magang]);
    }

    public function apply(Request $request, $magangId)
    {
        $magang = Magang::find($magangId);
        if (!$magang) {
            return response()->json(['success' => false, 'message' => 'Data magang tidak ditemukan'], 404);
        }
        if ($magang->status !== 'dibuka') {
            return response()->json(['success' => false, 'message' => 'Pendaftaran magang sudah ditutup'], 422);
        }

        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'nim' => 'nullable|string|max:20',
            'no_hp' => 'nullable|string|max:20',
            'universitas' => 'nullable|string|max:255',
            'prodi' => 'nullable|string|max:255',
            'semester' => 'nullable|string|max:10',
            'motivasi' => 'nullable|string',
            'cv' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'nama_lengkap', 'email', 'nim', 'no_hp',
            'universitas', 'prodi', 'semester', 'motivasi',
        ]);

        if ($request->hasFile('cv')) {
            $data['cv_path'] = $request->file('cv')->store('magang-cvs', 'public');
        }

        $application = MagangApplication::create(array_merge($data, [
            'magang_id' => $magangId,
            'status_pendaftaran' => 'pending',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran berhasil dikirim! Kami akan menghubungi Anda segera.',
            'data' => $application,
        ], 201);
    }

    // ─── ADMIN ───

    public function adminIndex()
    {
        $data = Magang::orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function adminStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul_magang' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'persyaratan' => 'nullable|string',
            'benefit' => 'nullable|string',
            'durasi' => 'nullable|string|max:100',
            'lokasi' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
            'status' => 'nullable|string|in:dibuka,ditutup',
            'kontak' => 'nullable|string|max:255',
            'gambar' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'judul_magang', 'deskripsi', 'persyaratan', 'benefit',
            'durasi', 'lokasi', 'deadline', 'kontak',
        ]);
        $data['status'] = $request->status ?? 'dibuka';

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('magang-images', 'public');
        }

        $magang = Magang::create($data);

        return response()->json(['success' => true, 'data' => $magang], 201);
    }

    public function adminUpdate(Request $request, $id)
    {
        $magang = Magang::find($id);
        if (!$magang) {
            return response()->json(['success' => false, 'message' => 'Data magang tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'judul_magang' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'persyaratan' => 'nullable|string',
            'benefit' => 'nullable|string',
            'durasi' => 'nullable|string|max:100',
            'lokasi' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
            'status' => 'nullable|string|in:dibuka,ditutup',
            'kontak' => 'nullable|string|max:255',
            'gambar' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'judul_magang', 'deskripsi', 'persyaratan', 'benefit',
            'durasi', 'lokasi', 'deadline', 'kontak', 'status',
        ]);

        if ($request->hasFile('gambar')) {
            if ($magang->gambar) {
                Storage::disk('public')->delete($magang->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('magang-images', 'public');
        }

        $magang->update($data);

        return response()->json(['success' => true, 'data' => $magang]);
    }

    public function adminDestroy($id)
    {
        $magang = Magang::find($id);
        if (!$magang) {
            return response()->json(['success' => false, 'message' => 'Data magang tidak ditemukan'], 404);
        }

        if ($magang->gambar) {
            Storage::disk('public')->delete($magang->gambar);
        }

        $magang->delete();
        return response()->json(['success' => true, 'message' => 'Data magang berhasil dihapus']);
    }

    public function adminApplications(Request $request)
    {
        $query = MagangApplication::with('magang');

        if ($request->has('magang_id')) {
            $query->where('magang_id', $request->magang_id);
        }
        if ($request->has('status')) {
            $query->where('status_pendaftaran', $request->status);
        }

        $data = $query->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function adminUpdateApplication(Request $request, $id)
    {
        $application = MagangApplication::find($id);
        if (!$application) {
            return response()->json(['success' => false, 'message' => 'Pendaftaran tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status_pendaftaran' => 'required|string|in:pending,diterima,ditolak',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $application->update(['status_pendaftaran' => $request->status_pendaftaran]);

        return response()->json(['success' => true, 'data' => $application]);
    }

    public function adminDownloadCv($applicationId)
    {
        $application = MagangApplication::find($applicationId);
        if (!$application || !$application->cv_path) {
            return response()->json(['success' => false, 'message' => 'CV tidak ditemukan'], 404);
        }

        if (!Storage::disk('public')->exists($application->cv_path)) {
            return response()->json(['success' => false, 'message' => 'File CV tidak ditemukan'], 404);
        }

        $filename = $application->cv_path ? basename($application->cv_path) : 'cv.pdf';
        return Storage::disk('public')->download($application->cv_path, $filename);
    }
}
