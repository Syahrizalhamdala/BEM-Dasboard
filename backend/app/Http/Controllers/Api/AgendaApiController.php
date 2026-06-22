<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalRapat;
use App\Services\Attendance\QRService;
use App\Services\Dashboard\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AgendaApiController extends Controller
{
    public function __construct(
        private QRService $qrService,
    ) {}

    public function index()
    {
        $data = JadwalRapat::orderBy('tanggal', 'desc')->limit(500)->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function terdekat()
    {
        $data = JadwalRapat::whereNotNull('tanggal')
            ->whereDate('tanggal', '>=', now())
            ->orderBy('tanggal', 'asc')
            ->limit(5)
            ->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'agenda' => 'required|string',
            'tanggal' => 'nullable|date',
            'waktu_mulai' => 'nullable|string',
            'waktu_selesai' => 'nullable|string',
            'tempat' => 'nullable|string',
            'pemimpin' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'lingkup' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $agenda = JadwalRapat::create([
            'agenda' => $request->agenda,
            'tanggal' => $request->tanggal,
            'waktu_mulai' => $request->waktu_mulai,
            'waktu_selesai' => $request->waktu_selesai,
            'tempat' => $request->tempat,
            'pemimpin' => $request->pemimpin,
            'deskripsi' => $request->deskripsi,
            'lingkup' => $request->lingkup,
        ]);

        $this->qrService->generate($agenda);

        ActivityLogService::agendaCreated($agenda->agenda);

        return response()->json(['success' => true, 'data' => $agenda->fresh()], 201);
    }

    public function update(Request $request, $id)
    {
        $agenda = JadwalRapat::find($id);
        if (!$agenda) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'agenda' => 'required|string',
            'tanggal' => 'nullable|date',
            'waktu_mulai' => 'nullable|string',
            'waktu_selesai' => 'nullable|string',
            'tempat' => 'nullable|string',
            'pemimpin' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'lingkup' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $agenda->update([
            'agenda' => $request->agenda,
            'tanggal' => $request->tanggal,
            'waktu_mulai' => $request->waktu_mulai,
            'waktu_selesai' => $request->waktu_selesai,
            'tempat' => $request->tempat,
            'pemimpin' => $request->pemimpin,
            'deskripsi' => $request->deskripsi,
            'lingkup' => $request->lingkup,
        ]);

        ActivityLogService::agendaUpdated($agenda->agenda);

        return response()->json(['success' => true, 'data' => $agenda]);
    }

    public function destroy($id)
    {
        $agenda = JadwalRapat::find($id);
        if (!$agenda) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $agenda->delete();
        return response()->json(['success' => true, 'message' => 'Agenda berhasil dihapus']);
    }

    public function toggleQr($id)
    {
        $agenda = JadwalRapat::find($id);
        if (!$agenda) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $active = $this->qrService->toggleActive($agenda);

        return response()->json([
            'success' => true,
            'is_active' => $active,
            'message' => $active ? 'QR Code diaktifkan' : 'QR Code dinonaktifkan',
        ]);
    }
}
