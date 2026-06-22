<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\UserRepository;
use App\Repositories\ActivityLogRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private UserRepository $userRepo,
        private ActivityLogRepository $activityLogRepo,
    ) {}

    public function register(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        $data['status'] = 'pending';

        $user = $this->userRepo->create($data);

        $this->activityLogRepo->log(
            'member',
            "Anggota baru: {$user->name}",
            $user->id,
            $user->name,
        );

        return $user;
    }

    public function login(string $email, string $password): array
    {
        $user = $this->userRepo->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah'],
            ]);
        }

        if ($user->status === 'pending') {
            throw ValidationException::withMessages([
                'email' => ['Akun menunggu persetujuan admin'],
            ]);
        }

        if ($user->status === 'nonaktif') {
            throw ValidationException::withMessages([
                'email' => ['Akun dinonaktifkan'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->activityLogRepo->log(
            'login',
            "Login: {$user->name}",
            $user->id,
            $user->name,
        );

        return [
            'user' => $user,
            'token' => $token,
            'role' => $user->role,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
