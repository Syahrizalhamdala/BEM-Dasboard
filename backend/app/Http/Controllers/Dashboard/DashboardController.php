<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\DashboardService;
use App\Services\Dashboard\SupabaseService;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService,
        private SupabaseService $supabaseService,
    ) {}

    public function stats()
    {
        $data = $this->dashboardService->getStats();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function recentActivities()
    {
        $activities = $this->dashboardService->getRecentActivities();

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }
}
