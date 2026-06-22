<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Laporan extends Model
{
    protected $fillable = [
        'judul', 'tipe', 'status', 'file_path', 'file_name',
        'file_type', 'file_size', 'user_id', 'pembuat', 'tanggal', 'deskripsi',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'file_size' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
