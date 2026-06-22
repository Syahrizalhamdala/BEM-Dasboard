<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kabinet;
use App\Services\Dashboard\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class KabinetApiController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('nim')) {
            $data = Kabinet::where('nim', $request->nim)->first();
            if (!$data) {
                return response()->json(['success' => false, 'message' => 'Anggota tidak ditemukan'], 404);
            }
            return response()->json(['success' => true, 'data' => $data]);
        }
        $data = Kabinet::limit(500)->get();
        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nim' => 'required|string|unique:kabinets,nim',
            'nama' => 'required|string',
            'prodi' => 'required|string',
            'divisi' => 'required|string',
            'jabatan' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $anggota = Kabinet::create([
            'nim' => $request->nim,
            'nama' => $request->nama,
            'prodi' => $request->prodi,
            'divisi' => $request->divisi,
            'jabatan' => $request->jabatan,
            'angkatan' => substr($request->nim, 0, 4),
            'status' => 'aktif',
            'password' => Hash::make('bem2025'),
            'foto' => '',
        ]);

        ActivityLogService::memberAdded($anggota->nama);

        return response()->json(['success' => true, 'data' => $anggota], 201);
    }

    public function show($id)
    {
        $anggota = Kabinet::find($id);
        if (!$anggota) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }
        return response()->json(['success' => true, 'data' => $anggota]);
    }

    public function update(Request $request, $id)
    {
        $anggota = Kabinet::find($id);
        if (!$anggota) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nim' => 'required|string|unique:kabinets,nim,' . $id,
            'nama' => 'required|string',
            'prodi' => 'required|string',
            'divisi' => 'required|string',
            'jabatan' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $anggota->update([
            'nim' => $request->nim,
            'nama' => $request->nama,
            'prodi' => $request->prodi,
            'divisi' => $request->divisi,
            'jabatan' => $request->jabatan,
            'angkatan' => substr($request->nim, 0, 4),
        ]);

        ActivityLogService::memberUpdated($anggota->nama);

        return response()->json(['success' => true, 'data' => $anggota]);
    }

    public function destroy($id)
    {
        $anggota = Kabinet::find($id);
        if (!$anggota) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $anggota->delete();
        return response()->json(['success' => true, 'message' => 'Data berhasil dihapus']);
    }
}
