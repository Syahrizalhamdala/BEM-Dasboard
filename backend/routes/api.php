<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Chatbot\ChatbotController;
use App\Http\Controllers\Api\KabinetApiController;
use App\Http\Controllers\Api\AgendaApiController;
use App\Http\Controllers\Api\AttendanceApiController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Api\LaporanApiController;
use App\Http\Controllers\Api\ImportApiController;
use App\Http\Controllers\Api\ProposalController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/password', [AuthController::class, 'changePassword']);

    Route::post('attendance/scan', [AttendanceApiController::class, 'scan']);
    Route::get('attendance/my', [AttendanceApiController::class, 'myAttendance']);
    Route::get('attendance', [AttendanceApiController::class, 'index']);
    Route::get('attendance/statistik', [AttendanceApiController::class, 'statistik']);
    Route::get('attendance/agenda/{agenda}/qr', [AttendanceApiController::class, 'agendaQr']);
    Route::post('attendance/agenda/{agenda}/qr/regenerate', [AttendanceApiController::class, 'regenerateQr']);
    Route::get('attendance/campus-location', [AttendanceApiController::class, 'getCampusLocation']);

    Route::get('laporan', [LaporanApiController::class, 'index']);
    Route::get('laporan/{id}/download', [LaporanApiController::class, 'download']);

    Route::post('chatbot/import', [ChatbotController::class, 'import']);

    Route::middleware('role:admin')->group(function () {
        Route::post('agenda', [AgendaApiController::class, 'store']);
        Route::put('agenda/{id}', [AgendaApiController::class, 'update']);
        Route::delete('agenda/{id}', [AgendaApiController::class, 'destroy']);
        Route::post('agenda/{id}/qr/toggle', [AgendaApiController::class, 'toggleQr']);

        Route::post('laporan', [LaporanApiController::class, 'store']);
        Route::put('laporan/{id}', [LaporanApiController::class, 'update']);
        Route::delete('laporan/{id}', [LaporanApiController::class, 'destroy']);

        Route::post('import', [ImportApiController::class, 'import']);
        Route::post('anggotas', [ImportApiController::class, 'storeAnggota']);
        Route::put('anggotas/{id}', [ImportApiController::class, 'updateAnggota']);
        Route::delete('anggotas/{id}', [ImportApiController::class, 'destroyAnggota']);
        Route::put('anggotas/{id}/status', [ImportApiController::class, 'toggleStatus']);

        Route::post('proposal/guideline', [ProposalController::class, 'uploadGuideline']);

        Route::post('kabinet', [KabinetApiController::class, 'store']);
        Route::put('kabinet/{id}', [KabinetApiController::class, 'update']);
        Route::delete('kabinet/{id}', [KabinetApiController::class, 'destroy']);

        Route::post('proposal/{id}/review', [ProposalController::class, 'review']);
        Route::post('proposal/{id}/sign', [ProposalController::class, 'sign']);
    });

    Route::get('kabinet', [KabinetApiController::class, 'index']);
    Route::get('kabinet/{id}', [KabinetApiController::class, 'show']);

    Route::get('anggotas', [ImportApiController::class, 'anggotas']);
    Route::get('program-kerja', [ImportApiController::class, 'programKerja']);

    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('dashboard/recent-activities', [DashboardController::class, 'recentActivities']);

    Route::prefix('proposal')->group(function () {
        Route::get('guidelines', [ProposalController::class, 'guidelines']);
        Route::get('guideline/aktif', [ProposalController::class, 'guidelineAktif']);
        Route::post('check', [ProposalController::class, 'check']);
        Route::get('checks', [ProposalController::class, 'checks']);
        Route::get('check/{id}', [ProposalController::class, 'checkDetail']);
        Route::get('review-queue', [ProposalController::class, 'reviewQueue']);
        Route::get('pending-signatures', [ProposalController::class, 'pendingSignatures']);
        Route::get('{id}/download', [ProposalController::class, 'download']);
    });
});

Route::prefix('chatbot')->group(function () {
    Route::post('/ask', [ChatbotController::class, 'ask']);
    Route::get('/status', [ChatbotController::class, 'status']);
});

Route::get('agenda', [AgendaApiController::class, 'index']);
Route::get('agenda/terdekat', [AgendaApiController::class, 'terdekat']);
