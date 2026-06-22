<?php

namespace App\Services\Laporan;

use App\Models\Laporan;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class LaporanService
{
    public function getAll(): array
    {
        return Laporan::orderBy('tanggal', 'desc')->get()->toArray();
    }

    public function create(array $data, UploadedFile $file, int $userId, string $userName): Laporan
    {
        $filePath = $file->store('laporans', 'public');

        return Laporan::create([
            'judul' => $data['judul'],
            'tipe' => $data['tipe'],
            'status' => $data['status'],
            'file_path' => $filePath,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'user_id' => $userId,
            'pembuat' => $userName,
            'tanggal' => $data['tanggal'],
            'deskripsi' => $data['deskripsi'] ?? null,
        ]);
    }

    public function update(int $id, array $data, ?UploadedFile $file = null): ?Laporan
    {
        $laporan = Laporan::find($id);
        if (!$laporan) return null;

        $updateData = array_intersect_key($data, array_flip(['judul', 'tipe', 'status', 'tanggal', 'deskripsi']));

        if ($file) {
            Storage::disk('public')->delete($laporan->file_path);
            $updateData['file_path'] = $file->store('laporans', 'public');
            $updateData['file_name'] = $file->getClientOriginalName();
            $updateData['file_type'] = $file->getMimeType();
            $updateData['file_size'] = $file->getSize();
        }

        $laporan->update($updateData);
        return $laporan->fresh();
    }

    public function delete(int $id): bool
    {
        $laporan = Laporan::find($id);
        if (!$laporan) return false;

        Storage::disk('public')->delete($laporan->file_path);
        return $laporan->delete();
    }

    public function download(int $id)
    {
        $laporan = Laporan::find($id);
        if (!$laporan) return null;

        if (!Storage::disk('public')->exists($laporan->file_path)) {
            return null;
        }

        return Storage::disk('public')->download($laporan->file_path, $laporan->file_name);
    }
}
