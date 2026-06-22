<?php

namespace App\Repositories\Chatbot;

use App\Models\Kabinet;
use App\Models\ProgramKerja;
use App\Models\JadwalRapat;
use App\Repositories\Interfaces\ChatbotRepositoryInterface;

class ChatbotRepository implements ChatbotRepositoryInterface
{
    public function searchKabinet(string $keyword): array
    {
        return Kabinet::where('jabatan', 'like', "%{$keyword}%")
            ->orWhere('nama', 'like', "%{$keyword}%")
            ->get()
            ->toArray();
    }

    public function searchProgramKerja(string $keyword): array
    {
        return ProgramKerja::where('program_kerja', 'like', "%{$keyword}%")
            ->orWhere('kementerian', 'like', "%{$keyword}%")
            ->orWhere('bidang', 'like', "%{$keyword}%")
            ->orWhere('bulan', 'like', "%{$keyword}%")
            ->orWhere('deskripsi', 'like', "%{$keyword}%")
            ->get()
            ->toArray();
    }

    public function searchJadwalRapat(string $keyword): array
    {
        return JadwalRapat::where('agenda', 'like', "%{$keyword}%")
            ->orWhere('lingkup', 'like', "%{$keyword}%")
            ->orWhere('tempat', 'like', "%{$keyword}%")
            ->orWhere('deskripsi', 'like', "%{$keyword}%")
            ->get()
            ->toArray();
    }

    public function getAllKabinet(): array
    {
        return Kabinet::select(['nama', 'jabatan', 'divisi', 'nim'])->get()->toArray();
    }

    public function getAllProgramKerja(): array
    {
        return ProgramKerja::select(['program_kerja', 'kementerian', 'bulan', 'tanggal', 'lokasi', 'status'])->get()->toArray();
    }

    public function getAllJadwalRapat(): array
    {
        return JadwalRapat::select(['agenda', 'tanggal', 'waktu_mulai', 'waktu_selesai', 'tempat', 'pemimpin', 'lingkup'])->get()->toArray();
    }
}
