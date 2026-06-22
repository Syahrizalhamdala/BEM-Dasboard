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
        Schema::table('divisis', function (Blueprint $table) {
            $table->string('nama');
            $table->text('deskripsi')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('divisis', function (Blueprint $table) {
            $table->dropColumn(['nama', 'deskripsi']);
        });
    }
};
