<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('magangs', function (Blueprint $table) {
            $table->id();
            $table->string('judul_magang');
            $table->text('deskripsi');
            $table->text('persyaratan')->nullable();
            $table->text('benefit')->nullable();
            $table->string('durasi')->nullable();
            $table->string('lokasi')->nullable();
            $table->date('deadline')->nullable();
            $table->string('status')->default('dibuka');
            $table->string('kontak')->nullable();
            $table->string('gambar')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('magangs');
    }
};
