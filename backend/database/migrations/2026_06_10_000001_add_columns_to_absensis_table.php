<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('absensis', function (Blueprint $table) {
            $table->foreignId('anggota_id')->nullable()->constrained('kabinets')->onDelete('cascade');
            $table->string('kegiatan')->nullable();
            $table->date('tanggal')->nullable();
            $table->time('waktu')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('akurasi_wajah', 5, 2)->nullable();
            $table->enum('status', ['hadir', 'terlambat', 'tidak_hadir'])->default('hadir');
            $table->string('foto_selfie')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('absensis', function (Blueprint $table) {
            $table->dropForeign(['anggota_id']);
            $table->dropColumn([
                'anggota_id', 'kegiatan', 'tanggal', 'waktu',
                'latitude', 'longitude', 'akurasi_wajah', 'status', 'foto_selfie'
            ]);
        });
    }
};
