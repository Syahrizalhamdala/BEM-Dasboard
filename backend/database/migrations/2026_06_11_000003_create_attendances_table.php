<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('agenda_id')->constrained('jadwal_rapats')->onDelete('cascade');
            $table->timestamp('check_in_time')->useCurrent();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('distance', 8, 2)->nullable()->comment('jarak dari kampus dalam meter');
            $table->enum('verification_method', ['qr_code', 'gps', 'qr_gps'])->default('qr_gps');
            $table->timestamps();

            $table->unique(['user_id', 'agenda_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
