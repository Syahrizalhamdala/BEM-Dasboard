<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Magang extends Model
{
    protected $fillable = [
        'judul_magang',
        'deskripsi',
        'persyaratan',
        'benefit',
        'durasi',
        'lokasi',
        'deadline',
        'status',
        'kontak',
        'gambar',
    ];

    public function applications()
    {
        return $this->hasMany(MagangApplication::class, 'magang_id');
    }
}
