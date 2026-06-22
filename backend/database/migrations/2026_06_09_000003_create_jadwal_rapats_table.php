<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_rapats', function (Blueprint $table) {
            $table->id();
            $table->string('agenda');
            $table->string('lingkup')->nullable();
            $table->dateTime('waktu')->nullable();
            $table->date('tanggal')->nullable();
            $table->string('waktu_mulai')->nullable();
            $table->string('waktu_selesai')->nullable();
            $table->string('tempat')->nullable();
            $table->string('pemimpin')->nullable();
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_rapats');
    }
};
