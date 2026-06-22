<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin BEM',
            'nim' => '00000000000',
            'email' => 'admin@nusaputra.ac.id',
            'password' => bcrypt(env('ADMIN_PASSWORD', 'bem2025')),
            'role' => 'admin',
            'status' => 'aktif',
        ]);
    }
}
