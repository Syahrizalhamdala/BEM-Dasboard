<?php

namespace App\Repositories;

use App\Models\Attendance;

class AttendanceRepository
{
    public function countToday(): int
    {
        return Attendance::whereDate('check_in_time', now()->toDateString())->count();
    }

    public function countThisMonth(): int
    {
        return Attendance::whereMonth('check_in_time', now()->month)
            ->whereYear('check_in_time', now()->year)
            ->count();
    }

    public function countTotal(): int
    {
        return Attendance::count();
    }

    public function getMonthlyStats(int $year): array
    {
        $dbDriver = \DB::connection()->getDriverName();
        if ($dbDriver === 'sqlite') {
            return Attendance::selectRaw(
                "strftime('%m', check_in_time) as bulan, COUNT(*) as hadir"
            )
                ->whereYear('check_in_time', $year)
                ->groupByRaw("strftime('%m', check_in_time)")
                ->orderBy('bulan')
                ->get()
                ->toArray();
        }

        return Attendance::selectRaw(
            "EXTRACT(MONTH from check_in_time) as bulan, COUNT(*) as hadir"
        )
            ->whereYear('check_in_time', $year)
            ->groupByRaw("EXTRACT(MONTH from check_in_time)")
            ->orderBy('bulan')
            ->get()
            ->toArray();
    }

    public function getTodayCheckIns(array $with = []): array
    {
        return Attendance::with($with)
            ->whereDate('check_in_time', now()->toDateString())
            ->orderBy('check_in_time', 'desc')
            ->get()
            ->toArray();
    }

    public function findByUserAndAgenda(int $userId, int $agendaId): ?Attendance
    {
        return Attendance::where('user_id', $userId)
            ->where('agenda_id', $agendaId)
            ->first();
    }

    public function create(array $data): Attendance
    {
        return Attendance::create($data);
    }
}
