<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nim')->unique()->nullable();
            $table->string('divisi')->nullable();
            $table->string('jabatan')->nullable();
            $table->enum('role', ['admin', 'anggota'])->default('anggota');
            $table->string('foto_profil')->nullable();
            $table->enum('status', ['aktif', 'nonaktif', 'pending'])->default('pending');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nim', 'divisi', 'jabatan', 'role', 'foto_profil', 'status']);
        });
    }
};
