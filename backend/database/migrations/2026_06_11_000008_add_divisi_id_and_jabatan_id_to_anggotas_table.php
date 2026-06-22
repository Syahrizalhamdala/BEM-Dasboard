<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('anggotas', function (Blueprint $table) {
            $table->foreignId('divisi_id')->nullable()->constrained('divisis')->nullOnDelete();
            $table->foreignId('jabatan_id')->nullable()->constrained('jabatans')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('anggotas', function (Blueprint $table) {
            $table->dropForeign(['divisi_id']);
            $table->dropForeign(['jabatan_id']);
            $table->dropColumn(['divisi_id', 'jabatan_id']);
        });
    }
};
