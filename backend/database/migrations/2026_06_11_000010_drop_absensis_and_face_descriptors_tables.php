<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('face_descriptors');
        Schema::dropIfExists('absensis');
    }

    public function down(): void
    {
        Schema::create('absensis', function ($table) {
            $table->id();
            $table->timestamps();
        });

        Schema::create('face_descriptors', function ($table) {
            $table->id();
            $table->timestamps();
        });
    }
};
