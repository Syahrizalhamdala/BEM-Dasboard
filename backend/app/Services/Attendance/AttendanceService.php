<?php

namespace App\Services\Attendance;

use App\Models\Attendance;
use App\Models\JadwalRapat;
use App\Models\User;
use App\Services\Dashboard\ActivityLogService;
use Illuminate\Validation\ValidationException;

class AttendanceService
{
    public function __construct(
        private QRService $qrService,
        private GPSService $gpsService,
    ) {}

    public function scan(array $data, User $user): Attendance
    {
        $agenda = $this->qrService->validate($data['qr_token']);

        if (!$agenda) {
            throw ValidationException::withMessages([
                'qr_token' => 'QR Code tidak valid atau agenda tidak ditemukan.',
            ]);
        }

        if ($agenda->tanggal && $agenda->tanggal->isBefore(now()->startOfDay())) {
            throw ValidationException::withMessages([
                'agenda' => 'Agenda ini sudah lewat.',
            ]);
        }

        $alreadyCheckedIn = Attendance::where('user_id', $user->id)
            ->where('agenda_id', $agenda->id)
            ->exists();

        if ($alreadyCheckedIn) {
            throw ValidationException::withMessages([
                'agenda' => 'Anda sudah melakukan absensi untuk agenda ini.',
            ]);
        }

        $latitude = (float) ($data['latitude'] ?? 0);
        $longitude = (float) ($data['longitude'] ?? 0);
        $distance = $this->gpsService->distanceFromCampus($latitude, $longitude);
        $withinRadius = $distance <= 100;

        $method = 'qr_code';
        if ($latitude && $longitude) {
            $method = $withinRadius ? 'qr_gps' : 'gps';
        }

        $attendance = Attendance::create([
            'user_id' => $user->id,
            'agenda_id' => $agenda->id,
            'check_in_time' => now(),
            'latitude' => $latitude ?: null,
            'longitude' => $longitude ?: null,
            'distance' => round($distance, 2),
            'verification_method' => $method,
        ]);

        ActivityLogService::attendance($user->name, $user->id);

        return $attendance->load(['agenda', 'user']);
    }

    public function getTodayStats(): array
    {
        $today = now()->toDateString();

        $totalHadir = Attendance::whereDate('check_in_time', $today)->count();
        $totalUser = User::count();

        return [
            'total_hadir' => $totalHadir,
            'total_user' => $totalUser,
            'persentase' => $totalUser > 0 ? round(($totalHadir / $totalUser) * 100) : 0,
        ];
    }

    public function getMonthlyStats(): array
    {
        $month = now()->month;
        $year = now()->year;

        $dailyStats = Attendance::selectRaw('DATE(check_in_time) as date, COUNT(*) as total')
            ->whereMonth('check_in_time', $month)
            ->whereYear('check_in_time', $year)
            ->groupByRaw('DATE(check_in_time)')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => $item->date,
                'total' => $item->total,
            ]);

        return $dailyStats->toArray();
    }
}
