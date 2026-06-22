<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->index('check_in_time');
        });

        Schema::table('jadwal_rapats', function (Blueprint $table) {
            $table->index('tanggal');
            $table->index('is_qr_active');
        });

        Schema::table('proposal_checks', function (Blueprint $table) {
            $table->index('status');
            $table->index('created_at');
        });

        Schema::table('laporans', function (Blueprint $table) {
            $table->index('tanggal');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('program_kerjas', function (Blueprint $table) {
            $table->index(['kementerian', 'program_kerja']);
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropIndex(['check_in_time']);
        });

        Schema::table('jadwal_rapats', function (Blueprint $table) {
            $table->dropIndex(['tanggal']);
            $table->dropIndex(['is_qr_active']);
        });

        Schema::table('proposal_checks', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('laporans', function (Blueprint $table) {
            $table->dropIndex(['tanggal']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('program_kerjas', function (Blueprint $table) {
            $table->dropIndex(['kementerian', 'program_kerja']);
        });
    }
};
