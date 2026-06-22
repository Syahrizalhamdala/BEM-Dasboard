<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProposalGuideline extends Model
{
    protected $fillable = [
        'judul',
        'konten_teks',
        'file_path',
        'aktif',
    ];

    protected function casts(): array
    {
        return [
            'aktif' => 'boolean',
        ];
    }

    public function scopeAktif($query)
    {
        return $query->where('aktif', true);
    }
}
