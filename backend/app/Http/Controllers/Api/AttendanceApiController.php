<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\JadwalRapat;
use App\Models\User;
use App\Models\Setting;
use App\Services\Attendance\AttendanceService;
use App\Services\Attendance\GPSService;
use App\Services\Attendance\QRService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class AttendanceApiController extends Controller
{
    public function __construct(
        private AttendanceService $attendanceService,
        private QRService $qrService,
        private GPSService $gpsService,
    ) {}

    public function scan(Request $request)
    {
        $request->validate([
            'qr_token' => 'required|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        try {
            $user = $request->user();
            $attendance = $this->attendanceService->scan($request->only(['qr_token', 'latitude', 'longitude']), $user);

            return response()->json([
                'success' => true,
                'message' => 'Absensi berhasil dicatat.',
                'data' => [
                    'attendance' => $attendance,
                    'distance' => $attendance->distance,
                    'verification_method' => $attendance->verification_method,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses absensi.',
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $query = Attendance::with(['user', 'agenda']);

        if ($request->agenda_id) {
            $query->where('agenda_id', $request->agenda_id);
        }

        if ($request->date) {
            $query->whereDate('check_in_time', $request->date);
        }

        $data = $query->orderBy('check_in_time', 'desc')->limit(500)->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function myAttendance(Request $request)
    {
        $data = Attendance::with('agenda')
            ->where('user_id', $request->user()->id)
            ->orderBy('check_in_time', 'desc')
            ->limit(500)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function statistik()
    {
        return Cache::remember('attendance_statistik', 60, function () {
            $totalAnggota = User::count();
            $today = now()->toDateString();
            $thisMonth = now()->month;
            $thisYear = now()->year;

            $hadirHariIni = Attendance::whereDate('check_in_time', $today)->count();
            $hadirBulanIni = Attendance::whereMonth('check_in_time', $thisMonth)
                ->whereYear('check_in_time', $thisYear)
                ->count();

            $totalHadir = Attendance::count();

            $agendaAktif = JadwalRapat::whereDate('tanggal', '>=', $today)->count();

            $hadirPct = $totalAnggota > 0 ? round(($hadirHariIni / $totalAnggota) * 100) : 0;
            $blnPct = $totalAnggota > 0 ? round(($hadirBulanIni / $totalAnggota) * 100) : 0;

            $dbDriver = \DB::connection()->getDriverName();
            $monthExpr = $dbDriver === 'sqlite' ? "strftime('%m', check_in_time)" : "EXTRACT(MONTH from check_in_time)";
            $kehadiranBulanan = Attendance::selectRaw(
                "{$monthExpr} as bulan, COUNT(*) as hadir"
            )->whereYear('check_in_time', $thisYear)
                ->groupByRaw($monthExpr)
                ->orderBy('bulan')
                ->get()
                ->map(fn($item) => [
                    'bulan' => date('M', mktime(0, 0, 0, (int)$item->bulan, 1)),
                    'hadir' => (int) $item->hadir,
                ]);

            $namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            for ($i = 1; $i <= 12; $i++) {
                if (!$kehadiranBulanan->firstWhere('bulan', $namaBulan[$i - 1])) {
                    $kehadiranBulanan->push(['bulan' => $namaBulan[$i - 1], 'hadir' => 0]);
                }
            }
            $kehadiranBulanan = $kehadiranBulanan->sortBy(function ($item) use ($namaBulan) {
                return array_search($item['bulan'], $namaBulan);
            })->values();

            return [
                'success' => true,
                'data' => [
                    'statCards' => [
                        ['label' => 'Hadir Hari Ini', 'value' => $hadirHariIni, 'key' => 'hadir'],
                        ['label' => 'Hadir Bulan Ini', 'value' => $hadirBulanIni, 'key' => 'hadir'],
                        ['label' => 'Total Hadir', 'value' => $totalHadir, 'key' => 'total'],
                    ],
                    'persentaseKehadiran' => $hadirPct,
                    'persentaseBulanan' => $blnPct,
                    'kehadiranBulanan' => $kehadiranBulanan,
                    'totalAgendaAktif' => $agendaAktif,
                    'todayCheckIns' => Attendance::with('user')
                        ->whereDate('check_in_time', $today)
                        ->orderBy('check_in_time', 'desc')
                        ->limit(100)
                        ->get()
                        ->map(fn($a) => [
                            'id' => $a->id,
                            'nama' => $a->user->name ?? '-',
                            'waktu' => $a->check_in_time->format('H:i:s'),
                            'metode' => $a->verification_method,
                            'distance' => $a->distance,
                        ]),
                ],
            ];
        });
    }

    public function agendaQr(JadwalRapat $agenda)
    {
        if (!$agenda->qr_code_url) {
            $this->qrService->generate($agenda);
            $agenda->refresh();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'agenda' => $agenda,
                'qr_token' => $agenda->qr_token,
                'qr_code_url' => $agenda->qr_code_url,
            ],
        ]);
    }

    public function regenerateQr(JadwalRapat $agenda)
    {
        $url = $this->qrService->regenerate($agenda);

        return response()->json([
            'success' => true,
            'message' => 'QR Code berhasil diperbarui.',
            'data' => [
                'qr_token' => $agenda->fresh()->qr_token,
                'qr_code_url' => $url,
            ],
        ]);
    }

    public function getCampusLocation()
    {
        return response()->json([
            'success' => true,
            'data' => $this->gpsService->getCampusCoordinates(),
        ]);
    }
}
