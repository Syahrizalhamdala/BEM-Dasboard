<?php

namespace App\Repositories\Interfaces;

interface ChatbotRepositoryInterface
{
    public function searchKabinet(string $keyword): array;
    public function searchProgramKerja(string $keyword): array;
    public function searchJadwalRapat(string $keyword): array;
    public function getAllKabinet(): array;
    public function getAllProgramKerja(): array;
    public function getAllJadwalRapat(): array;
}
