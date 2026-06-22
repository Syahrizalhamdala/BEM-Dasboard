<?php

namespace App\Services;

use App\Models\ProposalCheck;
use App\Models\ProposalGuideline;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\IOFactory;
use Smalot\PdfParser\Parser as PdfParser;

class ProposalService
{
    public function parseFile(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();

        return match ($extension) {
            'pdf' => $this->parsePdf($file),
            'docx' => $this->parseDocx($file),
            'doc' => $this->parseDocx($file),
            default => throw new \InvalidArgumentException('Format file tidak didukung. Gunakan PDF atau Word.'),
        };
    }

    protected function parsePdf(UploadedFile $file): string
    {
        $parser = new PdfParser();
        $pdf = $parser->parseContent($file->get());
        return $pdf->getText();
    }

    protected function parseDocx(UploadedFile $file): string
    {
        $tempPath = $file->getPathname();
        $phpWord = IOFactory::load($tempPath);
        $text = '';

        foreach ($phpWord->getSections() as $section) {
            foreach ($section->getElements() as $element) {
                if (method_exists($element, 'getText')) {
                    $text .= $element->getText() . "\n";
                } elseif (method_exists($element, 'getElements')) {
                    foreach ($element->getElements() as $child) {
                        if (method_exists($child, 'getText')) {
                            $text .= $child->getText() . "\n";
                        }
                    }
                }
            }
        }

        return trim($text);
    }

    public function checkWithAi(ProposalGuideline $guideline, string $kontenProposal): array
    {
        $apiKey = config('services.groq.api_key');

        $prompt = <<<PROMPT
Kamu adalah asisten pemeriksa proposal BEM (Badan Eksekutif Mahasiswa).

Berikut adalah PANDUAN yang harus dipatuhi dalam penulisan proposal:
---
{$guideline->konten_teks}
---

Berikut adalah PROPOSAL yang akan diperiksa:
---
{$kontenProposal}
---

Periksa proposal di atas terhadap panduan yang diberikan.
Untuk setiap ketidaksesuaian yang ditemukan, berikan dalam format JSON array saja (tanpa markdown, tanpa teks lain):

[
  {
    "bagian": "nama bagian proposal yang bermasalah",
    "masalah": "deskripsi ketidaksesuaian yang ditemukan",
    "acuan": "isi spesifik dari panduan yang dilanggar",
    "saran": "saran perbaikan yang konkret"
  }
]

Jika semua sesuai dengan panduan, return array kosong: []
PROMPT;

        if (empty($apiKey)) {
            return $this->fallbackCheck($kontenProposal);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.3-70b-versatile',
                'messages' => [
                    ['role' => 'system', 'content' => 'Kamu adalah asisten pemeriksa proposal yang teliti. Selalu respon dalam format JSON array.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.2,
                'max_tokens' => 4096,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $content = $data['choices'][0]['message']['content'] ?? '[]';
                $content = trim($content);
                $content = str_replace(['```json', '```'], '', $content);
                $issues = json_decode($content, true);

                if (is_array($issues)) {
                    return $issues;
                }
            }

            Log::error('Groq proposal check error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        } catch (\Exception $e) {
            Log::error('Groq proposal check exception: ' . $e->getMessage());
        }

        return $this->fallbackCheck($kontenProposal);
    }

    protected function fallbackCheck(string $kontenProposal): array
    {
        return [
            [
                'bagian' => 'Seluruh dokumen',
                'masalah' => 'Tidak dapat memproses pengecekan dengan AI.',
                'acuan' => '-',
                'saran' => 'Silakan periksa koneksi atau hubungi admin.',
            ],
        ];
    }

    public function generateSuratPengesahan(ProposalCheck $check): string
    {
        $signaturePath = null;
        if ($check->signature_path) {
            $signaturePath = Storage::disk('local')->path($check->signature_path);
        }

        $pdf = Pdf::loadView('proposal.surat_pengesahan', [
            'check' => $check,
            'guideline' => $check->guideline,
            'signer' => $check->signer,
            'signaturePath' => $signaturePath,
        ]);

        $filename = 'surat_pengesahan_' . $check->id . '_' . time() . '.pdf';
        $path = 'proposals/' . $filename;
        Storage::disk('local')->put($path, $pdf->output());

        return $path;
    }

    public function uploadGuideline(UploadedFile $file, string $judul): ProposalGuideline
    {
        $path = $file->store('guidelines');
        $konten = $this->parseFile($file);

        return ProposalGuideline::create([
            'judul' => $judul,
            'konten_teks' => $konten,
            'file_path' => $path,
            'aktif' => true,
        ]);
    }
}
