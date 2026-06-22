<?php

namespace App\Repositories;

use App\Models\JadwalRapat;

class AgendaRepository
{
    public function countActive(): int
    {
        return JadwalRapat::whereDate('tanggal', '>=', now()->toDateString())->count();
    }

    public function getUpcoming(int $limit = 5): array
    {
        return JadwalRapat::whereDate('tanggal', '>=', now()->toDateString())
            ->orderBy('tanggal')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function findById(int $id): ?JadwalRapat
    {
        return JadwalRapat::find($id);
    }

    public function create(array $data): JadwalRapat
    {
        return JadwalRapat::create($data);
    }

    public function update(JadwalRapat $agenda, array $data): bool
    {
        return $agenda->update($data);
    }

    public function delete(JadwalRapat $agenda): bool
    {
        return $agenda->delete();
    }
}
