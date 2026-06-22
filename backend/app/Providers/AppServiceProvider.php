<?php

namespace App\Providers;

use App\Repositories\Interfaces\ChatbotRepositoryInterface;
use App\Repositories\Chatbot\ChatbotRepository;
use App\Repositories\UserRepository;
use App\Repositories\AttendanceRepository;
use App\Repositories\AgendaRepository;
use App\Repositories\ActivityLogRepository;
use App\Services\Dashboard\DashboardService;
use App\Services\Dashboard\SupabaseService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ChatbotRepositoryInterface::class, ChatbotRepository::class);

        $this->app->singleton(UserRepository::class);
        $this->app->singleton(AttendanceRepository::class);
        $this->app->singleton(AgendaRepository::class);
        $this->app->singleton(ActivityLogRepository::class);

        $this->app->singleton(SupabaseService::class);

        $this->app->singleton(DashboardService::class, function ($app) {
            return new DashboardService(
                $app->make(UserRepository::class),
                $app->make(AttendanceRepository::class),
                $app->make(AgendaRepository::class),
                $app->make(ActivityLogRepository::class),
            );
        });
    }

    public function boot(): void
    {
        //
    }
}
