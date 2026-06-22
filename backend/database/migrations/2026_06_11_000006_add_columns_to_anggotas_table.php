<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('anggotas', function (Blueprint $table) {
            $table->string('jabatan')->nullable();
            $table->string('nama')->nullable();
            $table->string('angkatan')->nullable();
            $table->string('foto')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('anggotas', function (Blueprint $table) {
            $table->dropColumn(['jabatan', 'nama', 'angkatan', 'foto']);
        });
    }
};
