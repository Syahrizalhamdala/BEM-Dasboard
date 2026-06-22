<?php

namespace App\Repositories;

use App\Models\ActivityLog;

class ActivityLogRepository
{
    public function getRecent(int $limit = 10): array
    {
        return ActivityLog::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function create(array $data): ActivityLog
    {
        return ActivityLog::create($data);
    }

    public function log(string $type, string $message, ?int $userId = null, ?string $userName = null, ?array $metadata = null): ActivityLog
    {
        return $this->create([
            'type' => $type,
            'message' => $message,
            'user_id' => $userId,
            'user_name' => $userName,
            'metadata' => $metadata,
        ]);
    }
}
