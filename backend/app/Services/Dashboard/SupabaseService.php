<?php

namespace App\Services\Dashboard;

use Illuminate\Support\Facades\Http;

class SupabaseService
{
    protected string $projectUrl;
    protected string $serviceKey;

    public function __construct()
    {
        $this->projectUrl = config('services.supabase.url', env('SUPABASE_URL'));
        $this->serviceKey = config('services.supabase.service_key', env('SUPABASE_SERVICE_KEY'));
    }

    public function broadcast(string $table, string $type, array $record): void
    {
        $payload = [
            'type' => $type,
            'table' => $table,
            'schema' => 'public',
            'record' => $record,
        ];

        Http::withHeaders([
            'apikey' => $this->serviceKey,
            'Authorization' => "Bearer {$this->serviceKey}",
            'Content-Type' => 'application/json',
        ])->post("{$this->projectUrl}/rest/v1/rpc/broadcast_changes", [
            'payload' => $payload,
        ]);
    }

    public function getPublicUrl(string $bucket, string $path): string
    {
        return "{$this->projectUrl}/storage/v1/object/public/{$bucket}/{$path}";
    }

    public function deleteFile(string $bucket, string $path): bool
    {
        $response = Http::withHeaders([
            'apikey' => $this->serviceKey,
            'Authorization' => "Bearer {$this->serviceKey}",
        ])->delete("{$this->projectUrl}/storage/v1/object/{$bucket}/{$path}");

        return $response->successful();
    }

    public function uploadFile(string $bucket, string $path, $contents, string $contentType): ?string
    {
        $response = Http::withHeaders([
            'apikey' => $this->serviceKey,
            'Authorization' => "Bearer {$this->serviceKey}",
            'Content-Type' => $contentType,
        ])->post("{$this->projectUrl}/storage/v1/object/{$bucket}/{$path}", $contents);

        if ($response->successful()) {
            return $this->getPublicUrl($bucket, $path);
        }

        return null;
    }
}
