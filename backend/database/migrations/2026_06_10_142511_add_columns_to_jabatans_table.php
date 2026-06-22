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
        Schema::table('jabatans', function (Blueprint $table) {
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->integer('level')->default(5);
            $table->foreignId('parent_id')->nullable()->constrained('jabatans')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('jabatans', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['nama', 'deskripsi', 'level', 'parent_id']);
        });
    }
};
