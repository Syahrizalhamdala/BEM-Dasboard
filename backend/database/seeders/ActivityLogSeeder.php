<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $activities = [
            [
                'type' => 'member',
                'message' => 'Ahmad Brik Abdul Aziz bergabung sebagai Presiden Mahasiswa',
                'user_name' => 'Ahmad Brik Abdul Aziz',
                'created_at' => (clone $now)->subMinutes(2),
            ],
            [
                'type' => 'attendance',
                'message' => 'Syahrizal Hamdala melakukan absensi masuk',
                'user_name' => 'Syahrizal Hamdala',
                'created_at' => (clone $now)->subMinutes(15),
            ],
            [
                'type' => 'member',
                'message' => 'Citra Sonia ditambahkan sebagai anggota',
                'user_name' => 'Citra Sonia',
                'created_at' => (clone $now)->subHours(1),
            ],
            [
                'type' => 'agenda',
                'message' => 'Agenda baru: Rapat Koordinasi BEM',
                'user_name' => 'Ahmad Brik Abdul Aziz',
                'created_at' => (clone $now)->subHours(2),
            ],
            [
                'type' => 'login',
                'message' => 'Syahrizal Hamdala login ke sistem',
                'user_name' => 'Syahrizal Hamdala',
                'created_at' => (clone $now)->subHours(3),
            ],
            [
                'type' => 'attendance',
                'message' => 'Siti Salma Nurpahmi melakukan absensi masuk',
                'user_name' => 'Siti Salma Nurpahmi',
                'created_at' => (clone $now)->subHours(4),
            ],
            [
                'type' => 'member',
                'message' => 'Data Fachri Rajib Khairi Hakim diperbarui',
                'user_name' => 'Fachri Rajib Khairi Hakim',
                'created_at' => (clone $now)->subHours(5),
            ],
            [
                'type' => 'agenda',
                'message' => 'Agenda Workshop Desain Grafis selesai dilaksanakan',
                'user_name' => null,
                'created_at' => (clone $now)->subHours(8),
            ],
            [
                'type' => 'import',
                'message' => 'Import Excel berhasil: 50 anggota kabinet',
                'user_name' => null,
                'created_at' => (clone $now)->subDay(),
            ],
            [
                'type' => 'login',
                'message' => 'Alin Nurpadilah login ke sistem',
                'user_name' => 'Alin Nurpadilah',
                'created_at' => (clone $now)->subDay(),
            ],
            [
                'type' => 'attendance',
                'message' => 'Muhammad Najib Assary Hikmatullah melakukan absensi pulang',
                'user_name' => 'Muhammad Najib Assary Hikmatullah',
                'created_at' => (clone $now)->subDay()->subHours(2),
            ],
            [
                'type' => 'agenda',
                'message' => 'Agenda baru: Seminar Kepemimpinan',
                'user_name' => 'Rajwa Hauzan',
                'created_at' => (clone $now)->subDays(2),
            ],
        ];

        foreach ($activities as $activity) {
            ActivityLog::create($activity);
        }
    }
}
