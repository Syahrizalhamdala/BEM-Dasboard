<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Copy data dari anggotas ke kabinets (skip duplikat NIM)
        $anggotas = DB::table('anggotas')->get();
        foreach ($anggotas as $a) {
            $exists = DB::table('kabinets')->where('nim', $a->nim)->exists();
            if (!$exists) {
                DB::table('kabinets')->insert([
                    'nim' => $a->nim,
                    'nama' => $a->nama,
                    'jabatan' => $a->jabatan,
                    'angkatan' => $a->angkatan,
                    'foto' => $a->foto,
                    'created_at' => $a->created_at,
                    'updated_at' => $a->updated_at,
                ]);
            }
        }

        Schema::dropIfExists('anggotas');
    }

    public function down(): void
    {
        Schema::create('anggotas', function (Blueprint $table) {
            $table->id();
            $table->string('nim', 20)->unique()->nullable();
            $table->string('jabatan')->nullable();
            $table->string('nama')->nullable();
            $table->string('angkatan')->nullable();
            $table->string('foto')->nullable();
            $table->timestamps();
        });

        // Kembalikan data dari kabinets (yang punya nim)
        $kabinets = DB::table('kabinets')->whereNotNull('nim')->get();
        foreach ($kabinets as $k) {
            DB::table('anggotas')->insert([
                'nim' => $k->nim,
                'nama' => $k->nama,
                'jabatan' => $k->jabatan,
                'angkatan' => $k->angkatan,
                'foto' => $k->foto,
                'created_at' => $k->created_at,
                'updated_at' => $k->updated_at,
            ]);
        }
    }
};
