<?php

namespace App\Services\Dashboard;

use App\Repositories\UserRepository;
use App\Repositories\AttendanceRepository;
use App\Repositories\AgendaRepository;
use App\Repositories\ActivityLogRepository;
use App\Models\Anggota;
use App\Models\ProgramKerja;
use App\Models\JadwalRapat;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    public function __construct(
        private UserRepository $userRepo,
        private AttendanceRepository $attendanceRepo,
        private AgendaRepository $agendaRepo,
        private ActivityLogRepository $activityLogRepo,
    ) {}

    public function getStats(): array
    {
        return Cache::store('file')->remember('dashboard_stats', 300, function () {
            $totalAnggota = Anggota::count();
            $userCount = $this->userRepo->count();
            $hadirHariIni = $this->attendanceRepo->countToday();
            $totalAgendaAktif = $this->agendaRepo->countActive();
            $kehadiranPct = $userCount > 0 ? round(($hadirHariIni / $userCount) * 100) : 0;

            $kehadiranBulanan = $this->attendanceRepo->getMonthlyStats(now()->year);
            $bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            $chartData = [];

            $indexed = [];
            foreach ($kehadiranBulanan as $row) {
                $indexed[(string)(int)$row['bulan']] = (int)$row['hadir'];
            }

            for ($i = 1; $i <= 12; $i++) {
                $chartData[] = [
                    'bulan' => $bulanNames[$i - 1],
                    'hadir' => $indexed[(string)$i] ?? 0,
                ];
            }

            $statusKehadiran = [];
            if ($totalAnggota > 0) {
                $statusKehadiran = [
                    ['name' => 'Hadir', 'value' => max($kehadiranPct, 5), 'color' => '#2563eb'],
                    ['name' => 'Belum', 'value' => max(100 - $kehadiranPct, 5), 'color' => '#94a3b8'],
                ];
            }

            $agendaTerdekat = $this->agendaRepo->getUpcoming(5);
            $agendaTerdekat = array_map(fn($a) => [
                'id' => $a['id'],
                'agenda' => $a['agenda'],
                'tanggal' => $a['tanggal'] ?? null,
                'waktu_mulai' => $a['waktu_mulai'] ?? null,
                'tempat' => $a['tempat'] ?? null,
            ], $agendaTerdekat);

            return [
                'totalAnggota' => $totalAnggota,
                'hadirHariIni' => $hadirHariIni,
                'totalAgenda' => $totalAgendaAktif,
                'persentaseKehadiran' => $kehadiranPct,
                'agendaTerdekat' => $agendaTerdekat,
                'kehadiranBulanan' => $chartData,
                'statusKehadiran' => $statusKehadiran,
                'importCounts' => [
                    'anggotas' => $totalAnggota,
                    'program_kerjas' => ProgramKerja::count(),
                    'jadwal_rapats' => JadwalRapat::count(),
                ],
            ];
        });
    }

    public function getRecentActivities(int $limit = 10): array
    {
        return $this->activityLogRepo->getRecent($limit);
    }
}
