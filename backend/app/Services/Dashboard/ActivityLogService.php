<?php

namespace App\Services\Dashboard;

use App\Models\ActivityLog;

class ActivityLogService
{
    public static function log(
        string $type,
        string $message,
        ?int $userId = null,
        ?string $userName = null,
        ?array $metadata = null
    ): ActivityLog {
        return ActivityLog::create([
            'type' => $type,
            'message' => $message,
            'user_id' => $userId,
            'user_name' => $userName,
            'metadata' => $metadata,
        ]);
    }

    public static function attendance(string $userName, ?int $userId = null): ActivityLog
    {
        return self::log('attendance', "{$userName} melakukan absensi", $userId, $userName);
    }

    public static function agendaCreated(string $agenda, ?int $userId = null, ?string $userName = null): ActivityLog
    {
        return self::log('agenda', "Agenda baru: {$agenda}", $userId, $userName);
    }

    public static function memberAdded(string $nama, ?int $userId = null): ActivityLog
    {
        return self::log('member', "{$nama} ditambahkan sebagai anggota", $userId, $nama);
    }

    public static function memberUpdated(string $nama, ?int $userId = null): ActivityLog
    {
        return self::log('member', "Data {$nama} diperbarui", $userId, $nama);
    }

    public static function login(?string $userName = null): ActivityLog
    {
        return self::log('login', ($userName ?? 'Pengurus') . ' login ke sistem', null, $userName);
    }

    public static function importSuccess(string $detail): ActivityLog
    {
        return self::log('import', "Import Excel berhasil: {$detail}");
    }

    public static function agendaUpdated(string $agenda): ActivityLog
    {
        return self::log('agenda', "Agenda {$agenda} diperbarui", null, null);
    }

    public static function agendaCompleted(string $agenda): ActivityLog
    {
        return self::log('agenda', "Agenda {$agenda} selesai dilaksanakan", null, null);
    }
}
