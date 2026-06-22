<?php

namespace App\Services\Chatbot;

use App\Repositories\Interfaces\ChatbotRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotService
{
    protected ChatbotRepositoryInterface $repository;

    public function __construct(ChatbotRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function ask(string $question): array
    {
        $context = $this->buildContext();

        if (empty($context)) {
            return [
                'answer' => 'Maaf, informasi BEM belum tersedia di database.',
                'source' => null,
            ];
        }

        return $this->askGroq($question, $context);
    }

    protected function buildContext(): string
    {
        return Cache::store('file')->remember('chatbot_context', 3600, function () {
            $kabinet = $this->repository->getAllKabinet();
            $program = $this->repository->getAllProgramKerja();
            $rapat = $this->repository->getAllJadwalRapat();

            if (empty($kabinet) && empty($program) && empty($rapat)) {
                return '';
            }

            $parts = [];

            if (!empty($kabinet)) {
                $lines = ["KABINET (" . count($kabinet) . " anggota):"];
                foreach ($kabinet as $k) {
                    $lines[] = "- {$k['nama']} | {$k['jabatan']} | {$k['divisi']} | {$k['nim']}";
                }
                $parts[] = implode("\n", $lines);
            }

            if (!empty($program)) {
                $lines = ["PROGRAM KERJA (" . count($program) . "):"];
                foreach ($program as $p) {
                    $lines[] = "- {$p['program_kerja']} | Kementerian: {$p['kementerian']} | Bulan: {$p['bulan']} | Tanggal: {$p['tanggal']} | Lokasi: {$p['lokasi']} | Status: {$p['status']}";
                }
                $parts[] = implode("\n", $lines);
            }

            if (!empty($rapat)) {
                $lines = ["JADWAL RAPAT (" . count($rapat) . "):"];
                foreach ($rapat as $j) {
                    $lines[] = "- {$j['agenda']} | {$j['tanggal']} | {$j['waktu_mulai']}-{$j['waktu_selesai']} | {$j['tempat']} | Pimpinan: {$j['pemimpin']} | {$j['lingkup']}";
                }
                $parts[] = implode("\n", $lines);
            }

            return implode("\n\n", $parts);
        });
    }

    protected function askGroq(string $question, string $context): array
    {
        $apiKey = config('services.groq.api_key');

        if (empty($apiKey)) {
            Log::warning('GROQ_API_KEY tidak dikonfigurasi');

            return [
                'answer' => $this->fallbackAnswer($question, $context),
                'source' => 'local',
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.3-70b-versatile',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "Kamu adalah asisten cerdas BEM (Badan Eksekutif Mahasiswa) Universitas Nusa Putra. Jawab dengan ramah, informatif, dan dalam Bahasa Indonesia.\n\nKamu memiliki akses ke data lengkap BEM berikut:\n\n{$context}\n\nKemampuan kamu:\n- Menjawab siapa saja pengurus BEM dan jabatannya\n- Menjelaskan program kerja per kementerian\n- Memberitahu jadwal rapat dan agenda BEM\n- Menjawab kegiatan BEM yang akan datang\n- Memberikan informasi kontak/divisi yang relevan\n\nJika ditanya hal di luar data BEM, jawab dengan sopan bahwa kamu hanya bisa membantu seputar informasi BEM Universitas Nusa Putra.",
                    ],
                    [
                        'role' => 'user',
                        'content' => "{$question}",
                    ],
                ],
                'temperature' => 0.7,
                'max_tokens' => 1024,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $answer = $data['choices'][0]['message']['content'] ?? null;

                if ($answer) {
                    return [
                        'answer' => $answer,
                        'source' => 'groq',
                    ];
                }
            }

            Log::error('Groq API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        } catch (\Exception $e) {
            Log::error('Groq API exception: ' . $e->getMessage());
        }

        return [
            'answer' => $this->fallbackAnswer($question, $context),
            'source' => 'local',
        ];
    }

    protected function fallbackAnswer(string $question, string $context): string
    {
        if (empty($context)) {
            return 'Maaf, informasi BEM belum tersedia di database.';
        }

        $lines = explode("\n", $context);
        $totalLines = count($lines);
        $showLines = min($totalLines, 25);

        $result = "Berdasarkan data BEM yang tersedia:\n\n";
        $result .= implode("\n", array_slice($lines, 0, $showLines));
        $result .= "\n\nUntuk informasi lebih detail, silakan hubungi admin.";

        return $result;
    }
}
