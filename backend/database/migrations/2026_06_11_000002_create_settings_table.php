<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        DB::table('settings')->insert([
            ['key' => 'campus_latitude', 'value' => '-6.8564'],
            ['key' => 'campus_longitude', 'value' => '107.5889'],
            ['key' => 'campus_radius', 'value' => '100'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
