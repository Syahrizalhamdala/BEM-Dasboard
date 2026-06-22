<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kabinets', function (Blueprint $table) {
            $table->string('nim')->unique()->nullable();
            $table->string('prodi')->nullable();
            $table->string('divisi')->nullable();
            $table->string('status')->default('aktif');
            $table->string('password')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('kabinets', function (Blueprint $table) {
            $table->dropColumn(['nim', 'prodi', 'divisi', 'status', 'password']);
        });
    }
};
