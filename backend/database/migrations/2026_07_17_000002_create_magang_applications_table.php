<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('magang_applications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('magang_id');
            $table->string('nama_lengkap');
            $table->string('nim')->nullable();
            $table->string('email');
            $table->string('no_hp')->nullable();
            $table->string('universitas')->nullable();
            $table->string('prodi')->nullable();
            $table->string('semester')->nullable();
            $table->string('cv_path')->nullable();
            $table->text('motivasi')->nullable();
            $table->string('status_pendaftaran')->default('pending');
            $table->timestamps();

            $table->foreign('magang_id')->references('id')->on('magangs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('magang_applications');
    }
};
