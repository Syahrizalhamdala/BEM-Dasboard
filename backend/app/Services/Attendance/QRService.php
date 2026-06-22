<?php

namespace App\Services\Attendance;

use App\Models\JadwalRapat;
use Illuminate\Support\Str;

class QRService
{
    public function generate(JadwalRapat $agenda): string
    {
        $token = $agenda->qr_token;
        $qrApiUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={$token}";

        $agenda->update([
            'qr_code_url' => $qrApiUrl,
            'is_qr_active' => true,
        ]);

        return $qrApiUrl;
    }

    public function regenerate(JadwalRapat $agenda): string
    {
        $agenda->update([
            'qr_token' => (string) Str::uuid(),
            'is_qr_active' => true,
        ]);

        return $this->generate($agenda->fresh());
    }

    public function toggleActive(JadwalRapat $agenda): bool
    {
        if ($agenda->tanggal && $agenda->tanggal->isPast()) {
            return false;
        }

        $agenda->update([
            'is_qr_active' => !$agenda->is_qr_active,
        ]);

        return $agenda->fresh()->is_qr_active;
    }

    public function validate(string $qrToken): ?JadwalRapat
    {
        return JadwalRapat::where('qr_token', $qrToken)
            ->where('is_qr_active', true)
            ->first();
    }
}
