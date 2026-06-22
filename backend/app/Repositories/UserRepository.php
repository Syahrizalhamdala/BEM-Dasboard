<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function count(): int
    {
        return User::count();
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }

    public function getAllActive(): array
    {
        return User::where('status', 'aktif')->get()->toArray();
    }

    public function countByStatus(string $status): int
    {
        return User::where('status', $status)->count();
    }
}
